import { OrderStatus } from "../../enums/order.enum";

export interface OrderUpdateInput {  //orderUpdate
    orderId: string;
    orderStatus: OrderStatus;  
}