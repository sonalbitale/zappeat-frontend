import { Component } from '@angular/core';
import { Cart } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule,RouterModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
 cartLines: any[] = [];
  total: number = 0;

  constructor(private cartService: Cart) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartLines = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  increment(item: any) {
    this.cartService.addToCart(item.food);
    this.loadCart();
  }

  decrement(item: any) {
    this.cartService.removeOne(item.food);
    this.loadCart();
  }

  removeItem(item: any) {
    this.cartService.removeItemCompletely(item.food.id);
    this.loadCart();
  }
}