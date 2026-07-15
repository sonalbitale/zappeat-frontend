import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional, Service } from '@angular/core';
import { API_ENDPOINTS } from '../../endpoint';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class Order {


  constructor(private http: HttpClient) {}

  placeOrder(payload: any) {
    const token = localStorage.getItem('Token');

    return this.http.post(API_ENDPOINTS.ORDER.PLACE,
      payload,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

getOrderById(id: number) {
  return this.http.get<any>(API_ENDPOINTS.ORDER.GET_BY_ID(id));
}


// get orders of vendor specific
getMyOrders() : Observable<any>{
  return this.http.get<any[]>(API_ENDPOINTS.VENDOR.MY_ORDERS)
}


// accept order by vendor on vendor dahboard
acceptIncomingOrder(orderId:number) :Observable<any>{
  return  this.http.patch(API_ENDPOINTS.VENDOR.ACCEPT_ORDER(orderId), {})
}

// rejet order by vendor with reason
rejectIncomingOrder(orderId:number,rejectReason:string) :Observable<any>{
   return  this.http.patch(API_ENDPOINTS.VENDOR.REJECT_ORDER(orderId),rejectReason)
}

// mark ready when food preparation is done 

marKReady(orderId:number) :Observable<any>{
   return  this.http.patch(API_ENDPOINTS.VENDOR.READY_ORDER(orderId), {})
}


//  getall orders whose status ready for delivery 
getAllorders() :Observable<any>{
  return this.http.get(API_ENDPOINTS.ORDER.GETALLORDERS);
}

ACCEPTORDERBYDELIVERYBOY(orderId:number) :Observable<any>{
  return this.http.patch(API_ENDPOINTS.DELIVERY.ACCEPTORDERBYDELIVERYBOY(orderId),{});
}


PICKUPORDER(orderId: number): Observable<any> {
  return this.http.patch(API_ENDPOINTS.DELIVERY.PICKUPORDER(orderId), {});
}

DELIVERORDER(orderId: number): Observable<any> {
  return this.http.patch(API_ENDPOINTS.DELIVERY.DELIVERORDER(orderId), {});
}

getMyAllOrders(): Observable<any> {
  return this.http.get(API_ENDPOINTS.DELIVERY.MYORDERS);
}
}