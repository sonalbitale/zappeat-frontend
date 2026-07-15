// src/app/core/constants/api-endpoints.ts
import { environment } from '../environments/environment.prod';

const BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/Api/login`,
    REGISTER: `${BASE_URL}/Api/signup`,
    CHECKUSER:`${BASE_URL}/Api/check-user`,
    SENDOTP: `${BASE_URL}/Api/send-otp`,
    VERIFYOTP: `${BASE_URL}/Api/verify-otp`,
    REGISTERGUEST: `${BASE_URL}/Api/register-guest`,
  },
  FOOD: {
    GET_ALL: `${BASE_URL}/foods/getallcustomer-facingmenu`,
    GET_BY_ID: (id: number) => `${BASE_URL}/foods/${id}`,
    // ADD: `${BASE_URL}/foods`,
    UPDATE: (id: number) => `${BASE_URL}/foods/${id}`,
    DELETE: (id: number) => `${BASE_URL}/foods/${id}`,
     MY_ITEMS: `${BASE_URL}/vendor/food-items`,
  // DELETE: (id: number) => `${BASE_URL}/vendor/food-items/${id}`,

  },
  ORDER: {
    PLACE: `${BASE_URL}/orders`,
    MY_ORDERS: `${BASE_URL}/orders/my`,
    GET_BY_ID: (id: number) => `${BASE_URL}/orders/${id}`,
    GETALLORDERS:`${BASE_URL}/orders/getallorders`
  },
  CART: {
    ADD: `${BASE_URL}/cart/add`,
    GET: `${BASE_URL}/cart`,
    REMOVE: (id: number) => `${BASE_URL}/cart/${id}`,
  },
  ADMIN: {
    USERS: `${BASE_URL}/admin/users`,
    DELETE_USER: (id: number) => `${BASE_URL}/admin/users/${id}`,
    ORDERS: `${BASE_URL}/admin/orders`,
    UPDATE_ORDER_STATUS: (id: number) => `${BASE_URL}/admin/orders/${id}/status`,
    DASHBOARD: `${BASE_URL}/admin/dashboard`,
  },

  VENDOR:{
    VENDORSIGNUP :`${BASE_URL}/Api/vendor-signup`,
    MY_RESTAURANT: `${BASE_URL}/vendor/my-restaurant`,
    ADD: `${BASE_URL}/foods/vendor/food-items`,   // add food by vendor 
    UPDATEFOODITEM :(id: number)=> `${BASE_URL}/foods/vendor/updatefooditem/${id}`,
    DELETEFOODITEM:(id: number)=> `${BASE_URL}/foods/vendor/deletefooditem/${id}`,
    GETFOODITEMBYID:(id: number)=> `${BASE_URL}/foods/vendor/getfooditems/${id}`,
    GETFOODITEMS :`${BASE_URL}/foods/vendor/getfood-items`,
    MY_ORDERS: `${BASE_URL}/orders/vendor/orders`,
  ACCEPT_ORDER: (id: number) => `${BASE_URL}/orders/vendor/orders/${id}/accept`,
  REJECT_ORDER: (id: number) => `${BASE_URL}/orders/vendor/orders/${id}/reject`,
  READY_ORDER: (id: number) => `${BASE_URL}/orders/vendor/orders/${id}/mark-ready`,
 },

 DELIVERY:{
  DELIVERYSIGNUP :`${BASE_URL}/delivery-signup`,
  ACCEPTORDERBYDELIVERYBOY : (id: number) =>`${BASE_URL}/delivery/orders/${id}/accept`,
  PICKUPORDER: (id: number) => `${BASE_URL}/delivery/orders/${id}/pickup`,
  DELIVERORDER: (id: number) => `${BASE_URL}/delivery/orders/${id}/delivered`,
  MYORDERS: `${BASE_URL}/delivery/orders/my`,

}
};