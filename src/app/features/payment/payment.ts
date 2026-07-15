import { Component, OnInit } from '@angular/core';
import { Order } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Address } from '../../models/address-model';
import { Cart } from '../../core/services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {

  cartItems: any[] = [];
  selectedAddress: Address | null = null;

  selectedPaymentMethod: string = '';
  totalAmount: number = 0;

  openSection: string = '';

  constructor(
    private router: Router,
    private orderService: Order,
    private cartService: Cart
  ) {}

  ngOnInit(): void {

    // ✅ Get cart
    this.cartItems = this.cartService.getCartItems();

    // ✅ Get selected address (FIXED 🔥)
    const address = localStorage.getItem('selectedAddress');
    this.selectedAddress = address ? JSON.parse(address) : null;

    // ❗ Safety check
    if (!this.selectedAddress) {
      alert("Please select address first");
      this.router.navigate(['/checkout']);
      return;
    }

    // ✅ Calculate total
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.cartService.getTotal();
  }

  // ✅ Toggle payment section
  toggleSection(method: string) {
    this.openSection = this.openSection === method ? '' : method;
    this.selectedPaymentMethod = method;
  }

  // ✅ PLACE ORDER
placeOrder() {
  if (!this.selectedPaymentMethod) {
    alert("Please select payment method");
    return;
  }

  const payload = {
    items: this.cartItems.map(item => ({
      foodItemId: item.food.id,
      quantity: item.quantity
    })),
    deliveryAddress: this.selectedAddress,
    paymentMethod: this.selectedPaymentMethod
  };

  this.orderService.placeOrder(payload).subscribe({
    next: (res: any) => {
      this.cartService.clearCart();
      localStorage.removeItem('selectedAddress');

      // backup in case of refresh
      localStorage.setItem('lastOrder', JSON.stringify(res));

      this.router.navigate(['/order-success'], {
        state: { order: res }
      });
    },
    error: (err: any) => {
      console.error(err);
      alert("Order Failed ❌. Please try again.");
    }
  });
}

  // ✅ Back to checkout
  goBack() {
    this.router.navigate(['/checkout']);
  }
}