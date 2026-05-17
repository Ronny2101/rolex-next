import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography, Button, LinearProgress, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { OrderInquiry } from '../../types/order/order.input';
import { Order } from '../../types/order/order';
import { OrderStatus } from '../../enums/order.enum';
import moment from 'moment';
import { REACT_APP_API_URL } from '../../config';
import { UPDATE_ORDER } from '../../../apollo/user/mutation';
import { GET_MY_ORDERS } from '../../../apollo/user/query';

// ── Helpers ──────────────────────────────────────────────────────────────────

const money = (n?: number, currency?: string) =>
  typeof n === 'number' ? `${currency ? currency + ' ' : ''}${n.toLocaleString()}` : '';

const getItems = (order: any) => (order?.orderItems || order?.items || []) as any[];

const titleFromOrder = (order: any) => {
  const items = getItems(order);
  const firstName =
    items?.[0]?.propertyData?.propertyTitle ||
    items?.[0]?.propertyName ||
    order?._id ||
    '—';
  const extra = Math.max(0, (items?.length || 0) - 1);
  return extra > 0 ? `${firstName} +${extra}` : firstName;
};

const deriveDisplayStatus = (createdAt?: string | Date) => {
  if (!createdAt) return { label: 'Preparing', effective: OrderStatus.PAUSE, progress: 25 };
  const days = Math.max(0, moment().diff(moment(createdAt).startOf('day'), 'days'));
  if (days === 0) return { label: 'Preparing', effective: OrderStatus.PAUSE, progress: 30 };
  if (days === 1) return { label: 'On the way', effective: OrderStatus.PROCESS, progress: 70 };
  return { label: 'Arrived', effective: OrderStatus.FINISH, progress: 100 };
};

// Rasm URL to'g'ri qurish
const buildImageSrc = (thumb: string | undefined): string => {
  const fallback = '/img/banner/product4.png';
  if (!thumb) return fallback;
  if (thumb.startsWith('http')) return thumb;
  const base = (REACT_APP_API_URL || '').replace(/\/$/, '');
  const path = thumb.replace(/^\//, '');
  return `${base}/${path}`;
};

// ── Component ─────────────────────────────────────────────────────────────────

const MyOrders: NextPage = ({ initialInput }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<OrderInquiry>(initialInput);
  const [orders, setOrders] = useState<Order[]>([]);
  const [initialized, setInitialized] = useState(false);

  // ── Apollo ──────────────────────────────────────────────────────────────────

  const [updateOrder] = useMutation(UPDATE_ORDER);

  const { refetch: getOrdersRefetch } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchFilter, page: 1, limit: 100 } }, // barcha orderlarni bir marta olish
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setOrders(data?.getMyOrders ?? []);
    },
  });

  // ── Auth guard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => setInitialized(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialized && (!user?._id || user?.memberType !== 'USER')) {
      router.replace('/');
    }
  }, [initialized, user?._id]);

  if (!initialized) return null;

  // ── Filtering ───────────────────────────────────────────────────────────────

  const EXCLUDED = new Set([OrderStatus.CANCEL, OrderStatus.DELETE]);

  const matchesActiveTab = (o: any) => {
    if (!o) return false;
    if (EXCLUDED.has(o?.orderStatus)) return false;

    const tab = searchFilter?.orderStatus;
    if (!tab) return true;

    const eff = deriveDisplayStatus(o?.createdAt).effective;

    if (tab === OrderStatus.PROCESS) {
      return (
        o?.orderStatus === OrderStatus.PROCESS ||
        o?.orderStatus === OrderStatus.PAUSE ||
        eff === OrderStatus.PROCESS ||
        eff === OrderStatus.PAUSE
      );
    }
    if (tab === OrderStatus.FINISH) {
      return o?.orderStatus === OrderStatus.FINISH || eff === OrderStatus.FINISH;
    }
    return o?.orderStatus === tab || eff === tab;
  };

  const filteredOrders = (orders || []).filter(matchesActiveTab);

  // ── Client-side pagination ──────────────────────────────────────────────────

  const limit = searchFilter.limit || 5;
  const page  = searchFilter.page  || 1;
  const pageCount      = Math.max(1, Math.ceil(filteredOrders.length / limit));
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit); // ✅ asosiy tuzatma

  // ── Handlers ────────────────────────────────────────────────────────────────

  const paginationHandler = (_e: T, value: number) => {
    setSearchFilter(prev => ({ ...prev, page: value }));
  };

  const changeStatusHandler = (value: OrderStatus) => {
    setSearchFilter(prev => ({ ...prev, orderStatus: value, page: 1 })); // tab o'zgarganda 1-sahifaga qaytish
  };

  const optimisticRemove = (id: string) => {
    const snapshot = [...orders];
    setOrders(prev => prev.filter((o: any) => String(o?._id) !== String(id)));
    return snapshot;
  };

  const deleteOrderHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Are you sure you want to delete this order?')) {
        const snapshot = optimisticRemove(id);
        try {
          await updateOrder({ variables: { input: { orderId: id, orderStatus: OrderStatus.DELETE } } });
          await sweetTopSmallSuccessAlert('Order deleted successfully!');
          await getOrdersRefetch({ input: { ...searchFilter, page: 1, limit: 100 } });
        } catch (err: any) {
          setOrders(snapshot);
          throw err;
        }
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const cancelOrderHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Cancel this order?')) {
        const snapshot = optimisticRemove(id);
        try {
          await updateOrder({ variables: { input: { orderId: id, orderStatus: OrderStatus.CANCEL } } });
          await sweetTopSmallSuccessAlert('Order cancelled.');
          await getOrdersRefetch({ input: { ...searchFilter, page: 1, limit: 100 } });
        } catch (err: any) {
          setOrders(snapshot);
          throw err;
        }
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  // ── Mobile ──────────────────────────────────────────────────────────────────

  if (device === 'mobile') {
    return <div>ROLEX PRODUCTS MOBILE</div>;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div id="my-order-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">My Orders</Typography>
          <Typography className="sub-title">We are glad to see you again!</Typography>
        </Stack>
      </Stack>

      <Stack className="order-list-box">
        {/* Tabs */}
        <Stack className="tab-name-box">
          <Typography
            onClick={() => changeStatusHandler(OrderStatus.PROCESS)}
            className={searchFilter.orderStatus === OrderStatus.PROCESS ? 'active-tab-name' : 'tab-name'}
          >
            On the way
          </Typography>
          <Typography
            onClick={() => changeStatusHandler(OrderStatus.FINISH)}
            className={searchFilter.orderStatus === OrderStatus.FINISH ? 'active-tab-name' : 'tab-name'}
          >
            Arrived
          </Typography>
        </Stack>

        <Stack className="list-box">
          {/* Table headers */}
          <Stack className="listing-title-box">
            <Typography className="title-text">Order</Typography>
            <Typography className="title-text">Total</Typography>
            <Typography className="title-text">Status</Typography>
            <Typography className="title-text">Order Executed</Typography>
          </Stack>

          {/* Rows */}
          {paginatedOrders.length === 0 ? (
            <div className="no-data">
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No order found!</p>
            </div>
          ) : (
            paginatedOrders.map((order: any) => {
              const items    = getItems(order);
              const executed = order?.createdAt ? moment(order.createdAt).format('YYYY-MM-DD HH:mm') : '—';
              const { label, effective, progress } = deriveDisplayStatus(order?.createdAt);

              const itemsTotal = items.reduce((sum: number, it: any) => {
                const price = typeof it?.itemPrice    === 'number' ? it.itemPrice    : 0;
                const qty   = typeof it?.itemQuantity === 'number' ? it.itemQuantity : 0;
                return sum + price * qty;
              }, 0);
              const delivery    = typeof order?.orderDelivery === 'number' ? order.orderDelivery : 0;
              const computedTotal = itemsTotal + delivery;
              const shownTotal  = typeof order?.orderTotal === 'number' ? order.orderTotal : computedTotal;
              const totalLine   = `Total: ${money(shownTotal, order?.currency)} (${money(itemsTotal, order?.currency)} + ${money(delivery, order?.currency)})`;

              return (
                <Stack key={order?._id} className="order-row">
                  {/* Column 1: Items */}
                  <Stack className="row-text">
                    <Typography>{titleFromOrder(order)}</Typography>

                    <Stack className="order-items-inline" sx={{ gap: 12, mt: 1 }}>
                      {items.map((item: any, idx: number) => {
                        const src   = buildImageSrc(item?.propertyData?.propertyImages?.[0]);
                        const title = item?.propertyData?.propertyTitle || '—';
                        const qty   = item?.itemQuantity ?? 0;
                        const price = item?.itemPrice;

                        const goDetail = () =>
                          router.push({ pathname: '/property/detail', query: { id: item?.propertyId } });

                        return (
                          <Stack
                            key={item?._id ?? `${order?._id}-${idx}`}
                            direction="row"
                            alignItems="center"
                            className="order-item-row"
                          >
                            <Box
                              component="img"
                              src={src}
                              alt={title}
                              className="item-thumb"
                              onClick={goDetail}
                            />
                            <Stack className="item-info" onClick={goDetail}>
                              <Typography className="item-title" title={title}>
                                {title}
                              </Typography>
                              <Stack direction="row" className="item-meta">
                                <Typography className="item-qty">x{qty}</Typography>
                                <Typography className="item-price">{money(price, order?.currency)} =</Typography>
                                <Typography className="item-subtotal">
                                  {typeof price === 'number' ? money(price * qty, order?.currency) : ''}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>

                  {/* Column 2: Total + actions */}
                  <Stack className="row-text total-actions" sx={{ gap: 8 }}>
                    <Typography className="total-line">{totalLine}</Typography>

                    <Stack direction="row" className="row-actions" spacing={1}>
                      {(effective === OrderStatus.PROCESS || effective === OrderStatus.PAUSE) && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => cancelOrderHandler(order?._id as string)}
                        >
                          Cancel
                        </Button>
                      )}

                      {effective === OrderStatus.FINISH && (
                        <>
                          <Typography className="arrived-msg">Your order arrived</Typography>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => deleteOrderHandler(order?._id as string)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Stack>

                  {/* Column 3: Status + progress */}
                  <Stack className="row-text status" sx={{ minWidth: 160 }}>
                    <Typography>{label}</Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
                  </Stack>

                  {/* Column 4: Executed */}
                  <Typography className="row-text order-executed">
                    <span>{executed}</span>
                  </Typography>
                </Stack>
              );
            })
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <Stack className="pagination-config">
              <Stack className="pagination-box">
                <Pagination
                  count={pageCount}
                  page={page}
                  shape="circular"
                  color="primary"
                  onChange={paginationHandler}
                />
              </Stack>
              <Stack className="total-result">
                <Typography>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, filteredOrders.length)} of {filteredOrders.length} orders
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

MyOrders.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    orderStatus: 'PROCESS',
  },
};

export default MyOrders;