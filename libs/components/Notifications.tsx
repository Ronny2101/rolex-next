import React, { useMemo, useState } from 'react';
import {
	Popover,
	Typography,
	Divider,
	List,
	ListItem,
	Stack,
	Box,
	Button,
	Tooltip,
	Chip,
	Tabs,
	Tab,
} from '@mui/material';
import { CheckCircle, Trash2, MailOpen, Mail } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Notification } from '../types/notification/notification';
import { T } from '../types/common';
import { getJwtToken } from '../auth';
import { GET_NOTIFICATIONS, GET_UNREADNOTIFICATIONS } from '../../apollo/user/query';
import { useTranslation } from 'next-i18next';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import { MARKALLNOTIFICATIONREAD, MARKNOTIFICATIONREAD, REMOVEALLNOTIFICATION, REMOVENOTIFICATION } from '../../apollo/user/mutation';

type Direction = 'ASC' | 'DESC';
type TabKey = 'new' | 'read' | 'all';

interface NotificationsProps {
	initialInput: {
		_id: any; page: number; limit: number; sort?: string; direction?: Direction 
};
	open: boolean;
	onClose: () => void;
}

const fmtTime = (d?: string) => (d ? new Date(d).toLocaleString() : '');

const Notifications = ({ initialInput, open, onClose }: NotificationsProps) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const [tab, setTab] = useState<TabKey>('new');
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);

	const token = getJwtToken();
	const isLoggedIn = !!token;

	const [markNotificationRead, { loading: markOneLoading }] = useMutation(MARKNOTIFICATIONREAD);
	const [markAllNotificationRead, { loading: markAllLoading }] = useMutation(MARKALLNOTIFICATIONREAD);
	const [removeNotification, { loading: removeOneLoading }] = useMutation(REMOVENOTIFICATION);
	const [removeAllNotifications, { loading: removeAllLoading }] = useMutation(REMOVEALLNOTIFICATION);

	const listVariables = useMemo(() => {
		const statusList = tab === 'read' ? ['READ'] : tab === 'new' ? ['WAIT'] : ['WAIT', 'READ'];
		return {
			input: {
				page: initialInput.page,
				limit: initialInput.limit,
				sort: initialInput.sort ?? 'createdAt',
				direction: initialInput.direction ?? 'DESC',
				search: { statusList },
			},
		};
	}, [initialInput.page, initialInput.limit, initialInput.sort, initialInput.direction, tab]);

	const { loading: listLoading, refetch: refetchList } = useQuery(GET_NOTIFICATIONS, {
		skip: !isLoggedIn || !open,
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
		variables: listVariables,
		onCompleted: (data: T) => setNotifications(data?.myNotifications?.list ?? []),
	});

	const { refetch: refetchCount } = useQuery(GET_UNREADNOTIFICATIONS, {
		skip: !isLoggedIn,
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => setUnreadCount(data?.unreadNotificationsCount ?? 0),
	});

	const handleMarkRead = async (id: string) => {
		await markNotificationRead({ variables: { id } }).catch(console.error);
		if (tab !== 'read') setNotifications((prev) => prev.filter((n) => n._id !== id));
		await refetchCount?.();
	};

	const handleMarkAllRead = async () => {
		await markAllNotificationRead().catch(console.error);
		if (tab !== 'read') setNotifications([]);
		await Promise.all([refetchCount?.(), refetchList?.(listVariables)]);
	};

	const handleRemove = async (id: string) => {
		await removeNotification({ variables: { id } }).catch(console.error);
		setNotifications((prev) => prev.filter((n) => n._id !== id));
		await refetchCount?.();
	};

	const handleDeleteAll = async () => {
		await removeAllNotifications({ variables: {} }).catch(console.error);
		 setNotifications([]);
		await Promise.all([refetchCount?.(), refetchList?.(listVariables)]);
	};

	const onTabChange = (_e: React.SyntheticEvent, value: TabKey) => setTab(value);

	if (device === 'mobile') {
		return (
			<Stack className="info-box">
				<span>{t('Notifications are unavailable on mobile yet — please use desktop')}</span>
			</Stack>
		);
	}

	return (
		<Popover
			open={open}
			onClose={onClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			PaperProps={{
				sx: {
					width: 450,
					maxWidth: '95vw',
					maxHeight: '90vh',
					overflow: 'auto',
					mt: 11,
					borderRadius: 3,
					boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
					border: '1px solid #e0e0e0',
					backgroundColor: '#fffaf5',
					backdropFilter: 'blur(8px)',
				},
			}}
		>
			<Stack sx={{ height: '100%', p: 2 }}>
				{/* Header */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
					<Stack direction="row" spacing={1} alignItems="center">
						<Typography variant="h6">{t('Notifications')}</Typography>
						<Chip size="small" icon={<Mail size={14} />} label={`${t('Unread')}: ${unreadCount}`} variant="outlined" />
					</Stack>

					<Stack direction="row" spacing={1}>
						<Tooltip title={t('Mark all visible as read') as string}>
							<span>
								<Button
									size="small"
									variant="outlined"
									startIcon={<MailOpen size={16} />}
									onClick={handleMarkAllRead}
									disabled={tab === 'read' || notifications.length === 0 || markAllLoading}
								>
									{t('Read all')}
								</Button>
							</span>
						</Tooltip>
						<Tooltip title={t('Delete all visible') as string}>
							<span>
								<Button
									size="small"
									color="error"
									variant="outlined"
									onClick={handleDeleteAll}
									disabled={notifications.length === 0 || removeAllLoading}
								>
									{t('Delete all')}
								</Button>
							</span>
						</Tooltip>
					</Stack>
				</Stack>

				<Divider sx={{ mb: 1 }} />

				{/* Tabs */}
				{/* @ts-ignore */}
				<Box sx={{ mb: 1 }}>
					<Tabs
						value={tab}
						onChange={onTabChange}
						variant="fullWidth"
						sx={{
							'& .MuiTab-root': {
								color: '#555',
								textTransform: 'none',
							},
							'& .Mui-selected': {
								color: '#1e88e5 !important',
							},
						}}
						TabIndicatorProps={{
							style: {
								backgroundColor: '#1e88e5',
							},
						}}
					>
						<Tab value="new" label={t('New')} />
						<Tab value="read" label={t('Read')} />
						<Tab value="all" label={t('All')} />
					</Tabs>
				</Box>

				{/* List */}
				<List disablePadding>
					{!isLoggedIn || notifications.length === 0 ? (
						<Stack alignItems="center" justifyContent="center" sx={{ py: 6, color: 'text.secondary' }}>
							<Typography variant="body2">
								{isLoggedIn
									? listLoading
										? t('Loading...')
										: tab === 'read'
										? t('No read notifications.')
										: tab === 'new'
										? t('No new notifications.')
										: t('No notifications.')
									: t('Log in to see your notifications.')}
							</Typography>
						</Stack>
					) : (
						notifications.map((n) => {
							const title = (n as any).notificationTitle ?? t('Notification');
							const message = (n as any).notificationDesc ?? '—';
							const created = fmtTime((n as any).createdAt);

							return (
								<React.Fragment key={n._id}>
									<ListItem sx={{ px: 1, py: 1.5 }} disableGutters>
										<Box sx={{ flex: 1, pr: 2, minWidth: 0 }}>
											<Stack spacing={0.75}>
												<Stack direction="row" spacing={1} alignItems="center">
													<SubjectIcon fontSize="small" sx={{ color: 'text.secondary', minWidth: 20 }} />
													<Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3, wordBreak: 'break-word' }}>
														{title}
													</Typography>
												</Stack>

												<Stack direction="row" spacing={1} alignItems="center">
													<MessageIcon fontSize="small" sx={{ color: 'text.secondary', minWidth: 20 }} />
													<Typography
														variant="body1"
														sx={{ lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
													>
														{message}
													</Typography>
												</Stack>
											</Stack>
										</Box>

										<Stack sx={{ width: 200, alignItems: 'flex-end' }} spacing={1}>
											<Typography variant="caption" color="text.secondary">
												{created}
											</Typography>
											<Stack direction="row" spacing={1}>
												{tab !== 'read' && (
													<Tooltip title={t('Read') as string}>
														<span>
															<Button
																size="small"
																sx={{
																	color: '#181a20',
																	borderColor: '#007bff',
																	'&:hover': {
																		backgroundColor: '#217cc7',
																		borderColor: '#007bff',
																		color: '#fff',
																	},
																}}
																variant="outlined"
																onClick={() => handleMarkRead(n._id)}
																disabled={markOneLoading}
																startIcon={<CheckCircle size={16} />}
															>
																{t('Read')}
															</Button>
														</span>
													</Tooltip>
												)}
												<Tooltip title={t('Delete') as string}>
													<span>
														<Button
															size="small"
															sx={{
																color: '#181a20',
																borderColor: '#ff0000',
																'&:hover': {
																	backgroundColor: '#c72121',
																	color: '#fff',
																},
															}}
															variant="outlined"
															onClick={() => handleRemove(n._id)}
															disabled={removeOneLoading}
															startIcon={<Trash2 size={16} />}
														>
															{t('Delete')}
														</Button>
													</span>
												</Tooltip>
											</Stack>
										</Stack>
									</ListItem>

									<Divider component="li" />
								</React.Fragment>
							);
						})
					)}
				</List>
			</Stack>
		</Popover>
	);
};

Notifications.defaultProps = {
	initialInput: { page: 1, limit: 10, sort: 'createdAt', direction: 'DESC' },
};

export default Notifications;