import { Address } from "./address-model";

// src/app/models/order.model.ts
export interface OrderItemRequest {
  foodItemId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  deliveryAddress: Address;
  paymentMethod: string;
}

export interface PlaceOrderRequest {
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  foodName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: number;
  totalPrice: number;
  status: string;
  orderDate: string;
  items: OrderItemResponse[];
}