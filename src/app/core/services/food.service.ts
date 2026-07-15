import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { API_ENDPOINTS } from '../../endpoint';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Food {


    constructor(private http: HttpClient) {}

    // menu service  get allfood
    getallFood(){
        const token = localStorage.getItem("Token");
        return this.http.get(API_ENDPOINTS.FOOD.GET_ALL, {headers : {Authorization :  `Bearer ${token}` }})
    }



    //  add food item by vendor 

    addFoodItem(FoodDTO:any) : Observable<any> {
        return this.http.post(API_ENDPOINTS.VENDOR.ADD, FoodDTO);
    }

     updateFoodItem(FoodDTO:any, id: number) : Observable<any> {
        return this.http.put(API_ENDPOINTS.VENDOR.UPDATEFOODITEM(id), FoodDTO);
    }

    //  will use when have to load any food item 
    getFoodItemById(id:number)  : Observable<any>{
          return this.http.get(API_ENDPOINTS.VENDOR.UPDATEFOODITEM(id))
    }

    //  to get vendor resto items on dashboard eg menu -list
    getFoodItems() : Observable<any>{
        return this.http.get(API_ENDPOINTS.VENDOR.GETFOODITEMS)
    }

    deleteFoodItem(id:number) : Observable<any> {
       return this.http.delete(API_ENDPOINTS.VENDOR.DELETEFOODITEM(id))
    }


}
