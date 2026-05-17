import {OrderStatus } from '../../enums/order.enum';

export interface OrderInquiry {  
    page: number;
    limit: number;
    orderStatus: OrderStatus;  
}
