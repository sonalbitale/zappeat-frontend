import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from '../../../core/services/socketservices/socket-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-delivery-orders-component',
  imports: [CommonModule,GoogleMapsModule],
  templateUrl: './delivery-orders-component.html',
  styleUrl: './delivery-orders-component.css',
})
export class DeliveryOrdersComponent {
 orders: any[] = [];
  stompClient: any;

  constructor(private socketService: SocketService, private orderservice: Order,   private cdr: ChangeDetectorRef, ) {}
 
  waitingOrders: any[] = [];   // READY_FOR_PICKUP, not yet accepted by anyone
  myOrders: any[] = [];
  ngOnInit(): void {
   this.getAllOrders();
  this.getMyOrders();
  this.socketService.connect();
  }
// getallorders on ui whose order status if orderstatus is waiting for driver 

getAllOrders(){

  return this.orderservice.getAllorders().subscribe({
    next: (res:any) =>{
    this.waitingOrders=res;
   this.cdr.detectChanges();   // 👈 force re-render




    },

    error:(err:any) =>{
   console.log(err, "error while fetching orders")
    }


  })
}






isAccepting = false;

// acceptOrder(orderId: number) {
//   if (this.isAccepting) return;
//   this.isAccepting = true;

//   this.orderservice.ACCEPTORDERBYDELIVERYBOY(orderId).subscribe({
//     next: (res: any) => {
//       this.isAccepting = false;
//       console.log("you been assigned for this order with Id", res.id);
//     },
//     error: () => {
//       this.isAccepting = false;
//       console.log("some error occurred while assigning the driver");
//     }
//   });

//   //  console.log("Accepted order:", orderId);

//   // later we connect socket here
// }


getMyOrders() {
  this.orderservice.getMyAllOrders().subscribe({
    next: (res: any) => {
      this.myOrders = res;
      this.cdr.detectChanges();
    },
    error: (err) => console.log(err, "error fetching my orders")
  });
}

isProcessing = false;

acceptOrder(orderId: number) {
  if (this.isProcessing) return;
  this.isProcessing = true;

  this.orderservice.ACCEPTORDERBYDELIVERYBOY(orderId).subscribe({
    next: (res: any) => {
      this.isProcessing = false;
      this.getAllOrders();   // refresh waiting list (this order leaves it)
      this.getMyOrders();    // refresh my list (this order joins it)
    },
    error: () => {
      this.isProcessing = false;
      console.log("some error occurred while assigning the driver");
    }
  });
}

pickupOrder(orderId: number) {
  if (this.isProcessing) return;
  this.isProcessing = true;

  this.orderservice.PICKUPORDER(orderId).subscribe({
    next: (res: any) => {
      this.isProcessing = false;
      this.getMyOrders();
      this.sendLocation(orderId);   // start GPS broadcasting once picked up
    },
    error: () => {
      this.isProcessing = false;
      console.log("error picking up order");
    }
  });
}

deliverOrder(orderId: number) {
  if (this.isProcessing) return;
  this.isProcessing = true;

  this.orderservice.DELIVERORDER(orderId).subscribe({
    next: (res: any) => {
      this.isProcessing = false;
      this.getMyOrders();
    },
    error: () => {
      this.isProcessing = false;
      console.log("error marking order delivered");
    }
  });
}



// DELIVERY BOY  SEND LOCATION  Get GPS location
sendLocation(orderId: number) {
  navigator.geolocation.watchPosition((position) => {

    const tracking = {
      orderId: orderId,
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    this.stompClient.send('/app/tracking', {}, JSON.stringify(tracking));

  });
}



center = { lat: 0, lng: 0 };
markerPosition = { lat: 0, lng: 0 };

updateMap(lat: number, lng: number) {
  this.center = { lat, lng };
  this.markerPosition = { lat, lng };
}
// CUSTOMER  RECEIVE LOCATION Subscribe to tracking
subscribeToTracking(orderId: number) {

  this.stompClient.subscribe(`/topic/tracking/${orderId}`, (msg: { body: string; }) => {

    const data = JSON.parse(msg.body);

    this.updateMap(data.lat, data.lng);
  });
}



}
