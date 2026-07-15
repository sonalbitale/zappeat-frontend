import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../endpoint';


@Injectable({
  providedIn: 'root'
})
export class Deliveryservice {

constructor( private http: HttpClient){

}

      DeliverySignUp(registerdto :object):Observable<any>{
      return  this.http.post(API_ENDPOINTS.DELIVERY.DELIVERYSIGNUP , registerdto);
    }
}
