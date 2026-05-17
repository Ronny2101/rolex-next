export interface CreateOrderItemInput {
    itemQuantity: number;
    itemPrice: number;
    propertyId: string;
    orderId?: string;
}

