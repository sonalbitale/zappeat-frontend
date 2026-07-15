import { Injectable, Service } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class Cart {
  private cartItems: any[] = [];

  constructor() {}

  getCartItems() {
    return this.cartItems;
  }

  addToCart(item: any) {
    const existing = this.cartItems.find(i => i.food.id === item.id);

    if (existing) {
      existing.quantity++;
    } else {
      this.cartItems.push({
        food: item,
        quantity: 1
      });
    }
  }

  getCartCount() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.food.price * item.quantity,
      0
    );
  }

  increment(item: any) {
    item.quantity++;
  }

  decrement(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cartItems = this.cartItems.filter(i => i !== item);
    }
  }


  removeOne(food: any) {
    const item = this.cartItems.find(i => i.food.id === food.id);

    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cartItems = this.cartItems.filter(i => i.food.id !== food.id);
    }
  }

  removeItemCompletely(foodId: number) {
    this.cartItems = this.cartItems.filter(i => i.food.id !== foodId);
  }

  clearCart() {
    this.cartItems = [];
  }
}
