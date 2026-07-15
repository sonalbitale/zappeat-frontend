import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Food } from '../../core/services/food.service';
import { Cart } from '../../core/services/cart.service';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',
})
export class OrderSuccess implements OnInit {

  order: any = null;
  recommended: any[] = [];
  cartAdded: Set<number> = new Set();

  constructor(
    private router: Router,
    private foodService: Food,
    private cartService: Cart
  ) {}

  ngOnInit(): void {
    this.order = history.state.order ?? JSON.parse(localStorage.getItem('lastOrder') || 'null');

    if (!this.order) {
      this.router.navigate(['/']);
      return;
    }

    this.loadRecommended();
  }

  loadRecommended() {
    this.foodService.getallFood().subscribe({
      next: (resp: any) => {
        // Shuffle and take first 6 as recommendations
        const shuffled = [...resp].sort(() => Math.random() - 0.5);
        this.recommended = shuffled.slice(0, 6).map((f: any) => ({
          ...f,
          rating: +(((f.id * 7) % 5) / 10 + 4.4).toFixed(1),
        }));
      },
      error: () => { /* silently ignore */ }
    });
  }

  addToCart(food: any) {
    this.cartService.addToCart(food);
    this.cartAdded.add(food.id);
  }

  isAdded(foodId: number): boolean {
    return this.cartAdded.has(foodId);
  }

  trackOrder() {
    this.router.navigate(['/order-tracking', this.order.orderid]);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToHome() {
    this.router.navigate(['/menu']);
  }
}
