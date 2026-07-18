import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../core/services/order.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
    import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-order-tracking',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './order-tracking.html',
  styleUrl: './order-tracking.css',
})
export class OrderTracking implements OnInit {

  order: any = null;
  loading: boolean = true;
  error: string = '';
  orderId: number = 0;
  pollSub!: Subscription;


  statusSteps: string[] = ['PLACED','PREPARING', 'READY_FOR_PICKUP', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED',];

  stepDescriptions: Record<string, string> = {
    PLACED:           'Order received & confirmed',
    PREPARING:        'Restaurant is cooking your food',
    OUT_FOR_DELIVERY: 'On the way to your doorstep',
    DELIVERED:        'Delivered! Enjoy your meal 🎉',
  };


  statusLabels: Record<string, string> = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  ASSIGNED: 'Assigned',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: Order,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }

  this.pollSub = interval(5000).subscribe(() => {
    this.fetchOrder(this.orderId);
  });
}
  
  
  fetchOrder(id: number) {
    this.loading = true;
    this.error = '';
    this.orderService.getOrderById(id).subscribe({
      next: (res: any) => {
        this.order = res;
        console.log("order to track",this.order);

        this.loading = false;
         if (['DELIVERED','CANCELLED','REJECTED'].includes(this.order.status)) {
      this.pollSub.unsubscribe(); //  stop polling
    }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Could not load order details.';
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
  return this.statusLabels[status] ?? status;
}
  retryFetch() {
    this.fetchOrder(this.orderId);
  }

  getStepIndex(status: string): number {
    return this.statusSteps.indexOf(status);
  }

  isStepActive(step: string): boolean {
    if (!this.order) return false;
    return this.getStepIndex(step) <= this.getStepIndex(this.order.status);
  }

  isCurrentStep(step: string): boolean {
    if (!this.order) return false;
    return this.order.status === step;
  }

  getStepDesc(step: string): string {
    return this.stepDescriptions[step] ?? '';
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }
  ngOnDestroy() {
  this.pollSub?.unsubscribe();
}
}
