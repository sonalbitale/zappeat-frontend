import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-vendororders',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendororders.html',
  styleUrl: './vendororders.css',
})
export class Vendororders {

  orders: any[] = [];
  loading = true;
  error = '';

  // track which order is showing the reject-reason input
  rejectingOrderId: number | null = null;
  rejectReason = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private orderservice: Order) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderservice.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load orders.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  acceptOrder(orderId: number) {
   this.orderservice.acceptIncomingOrder(orderId).subscribe({
      next: () => this.fetchOrders(),
      error: (err) => {
        console.error(err);
        alert('Could not accept order.');
      }
    });
  }

  openRejectBox(orderId: number) {
    this.rejectingOrderId = orderId;
    this.rejectReason = '';
  }

  cancelRejectBox() {
    this.rejectingOrderId = null;
    this.rejectReason = '';
  }

  confirmReject(orderId: number) {
    if (!this.rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

   this.orderservice.rejectIncomingOrder(orderId,this.rejectReason ).subscribe({
      next: () => {
        this.rejectingOrderId = null;
        this.fetchOrders();
      },
      error: (err) => {
        console.error(err);
        alert('Could not reject order.');
      }
    });
  }

  markReady(orderId: number) {
    this.orderservice.marKReady(orderId).subscribe({
      next: () => 
       {
        alert('Order ready for pickup 🚴');
        this.fetchOrders();
},
      error: (err) => {
        console.error(err);
        alert('Could not update order.');
      }
    });
  }

//   markReady(order: any) {
//   this.orderService.updateStatus(order.id, 'WAITING_FOR_DRIVER')
//     .subscribe(() => {
//       order.status = 'WAITING_FOR_DRIVER';
//     });
// }
}
