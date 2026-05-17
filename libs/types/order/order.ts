import { OrderStatus } from "../../enums/order.enum";
import { OrderItem } from "../orderitem/orderitem";
import { Property } from "../property/property";

export interface Order {  
    _id: string;
	orderTotal: number;
	orderDelivery: number;
	orderStatus: OrderStatus;
	orderItems?: OrderItem[]; // this fixes the CannotDetermineOutputTypeError
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	propertyData?: Property[]; // this fixes the CannotDetermineOutputTypeError
}