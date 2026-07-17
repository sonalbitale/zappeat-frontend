import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SocketService } from '../../../core/services/socketservices/socket-service';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { Order } from '../../../core/services/order.service';
import { Navbar } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-delivery-orders-component',
  imports: [CommonModule, GoogleMapsModule, Navbar],
  templateUrl: './delivery-orders-component.html',
  styleUrl: './delivery-orders-component.css',
})
export class DeliveryOrdersComponent implements OnInit {
  orders: any[] = [];
  stompClient: any;
  waitingOrders: any[] = [];   // READY_FOR_PICKUP, not yet accepted by anyone
  myOrders: any[] = [];

  // Tab & UI state
  activeTab: 'available' | 'my-deliveries' = 'available';
  selectedOrderIdForMap: number | null = null;
  isProcessing = false;

  // Google Map options
  center = { lat: 28.6139, lng: 77.2090 }; // Default to center on India/Delhi
  markerPosition = { lat: 28.6139, lng: 77.2090 };
  zoom = 15;

  constructor(
    private socketService: SocketService, 
    private orderservice: Order,   
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.getAllOrders();
    this.getMyOrders();
    this.socketService.connect();
    
    // Attempt to set map center to user's current location initially
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.updateMap(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation not allowed or unavailable: ', err.message);
        }
      );
    }
  }

  // Get available orders waiting for a driver
  getAllOrders() {
    return this.orderservice.getAllorders().subscribe({
      next: (res: any) => {
        this.waitingOrders = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err, "error while fetching orders");
      }
    });
  }

  // Get orders assigned to the logged-in delivery boy
  getMyOrders() {
    this.orderservice.getMyAllOrders().subscribe({
      next: (res: any) => {
        this.myOrders = res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err, "error fetching my orders");
      }
    });
  }

  selectTab(tab: 'available' | 'my-deliveries') {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  // Toggle map visibility for a specific active order
  toggleMap(orderId: number) {
    if (this.selectedOrderIdForMap === orderId) {
      this.selectedOrderIdForMap = null;
    } else {
      this.selectedOrderIdForMap = orderId;
      // Center map on delivery partner's current coordinates when opening
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.updateMap(position.coords.latitude, position.coords.longitude);
          // If we also start broadcasting location, do it here
          this.sendLocation(orderId);
        });
      }
    }
    this.cdr.detectChanges();
  }

  // Accept a ready order
  acceptOrder(orderId: number) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.orderservice.ACCEPTORDERBYDELIVERYBOY(orderId).subscribe({
      next: (res: any) => {
        this.isProcessing = false;
        this.getAllOrders();   // refresh waiting list (this order leaves it)
        this.getMyOrders();    // refresh my list (this order joins it)
        this.activeTab = 'my-deliveries'; // automatically switch to my deliveries to show next step
        this.cdr.detectChanges();
      },
      error: () => {
        this.isProcessing = false;
        console.error("some error occurred while assigning the driver");
      }
    });
  }

  // Pick up the accepted order from the restaurant
  pickupOrder(orderId: number) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.orderservice.PICKUPORDER(orderId).subscribe({
      next: (res: any) => {
        this.isProcessing = false;
        this.getMyOrders();
        this.sendLocation(orderId);   // start GPS broadcasting once picked up
        this.cdr.detectChanges();
      },
      error: () => {
        this.isProcessing = false;
        console.error("error picking up order");
      }
    });
  }

  // Complete and deliver the order
  deliverOrder(orderId: number) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.orderservice.DELIVERORDER(orderId).subscribe({
      next: (res: any) => {
        this.isProcessing = false;
        this.selectedOrderIdForMap = null; // Hide map if open
        this.getMyOrders();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isProcessing = false;
        console.error("error marking order delivered");
      }
    });
  }

  // Broadcast location updates via WebSocket
  sendLocation(orderId: number) {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const tracking = {
          orderId: orderId,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (this.stompClient) {
          this.stompClient.send('/app/tracking', {}, JSON.stringify(tracking));
        } else {
          console.warn('stompClient is not initialized, could not send tracking message.');
        }
      }, (err) => {
        console.error('Error getting location for tracking:', err);
      }, {
        enableHighAccuracy: true
      });
    }
  }

  updateMap(lat: number, lng: number) {
    this.center = { lat, lng };
    this.markerPosition = { lat, lng };
  }

  // Customer tracking client subscription (kept for consistency)
  subscribeToTracking(orderId: number) {
    if (this.stompClient) {
      this.stompClient.subscribe(`/topic/tracking/${orderId}`, (msg: { body: string; }) => {
        const data = JSON.parse(msg.body);
        this.updateMap(data.lat, data.lng);
      });
    }
  }
}

