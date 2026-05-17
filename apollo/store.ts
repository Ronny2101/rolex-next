import { InMemoryCache, makeVar } from '@apollo/client';
import { CustomJwtPayload } from '../libs/types/customJwtPayload';

export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
  _id: '',
  memberType: '',
  memberStatus: '',
  memberAuthType: '',
  memberPhone: '',
  memberNick: '',
  memberFullName: '',
  memberImage: '',
  memberAddress: '',
  memberDesc: '',
  memberProperties: 0,
  memberRank: 0,
  memberArticles: 0,
  memberPoints: 0,
  memberLikes: 0,
  memberViews: 0,
  memberWarnings: 0,
  memberBlocks: 0,
});

/* ===== property In Basket Type ===== */
export interface PropertyInBasket {
  // propertyTitle: any;
  // propertyPrice: any;
  // propertyId: string;
  id: string;
  _id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImages: string; // full image URL
  propertyPrice: number;
  itemQuantity: number;
  memberNick?: string;
  memberId?: string | null;
}

/* ===== LocalStorage Key ===== */
const CART_KEY = 'rolexCart';

/* ===== Load Initial Cart ===== */
function loadCart(): PropertyInBasket[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ===== Reactive Var ===== */
export const basketItemsVar = makeVar<PropertyInBasket[]>(loadCart());

/* ===== Cart Helpers ===== */
export function setBasketItems(next: PropertyInBasket[]) {
  basketItemsVar(next);
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }
}

export function updateBasket(updater: (curr: PropertyInBasket[]) => PropertyInBasket[]) {
  const next = updater(basketItemsVar());
  setBasketItems(next);
}

export function clearBasket() {
  basketItemsVar([]);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_KEY);
  }
}

export function rehydrateBasketForCurrentUser() {
  setBasketItems(loadCart());
}

/* Apollo cache */
export const cache = new InMemoryCache({
  typePolicies: {
    Notification: { keyFields: ['_id'] },
  },
});

//@ts-ignore
export const socketVar = makeVar<WebSocket>();
