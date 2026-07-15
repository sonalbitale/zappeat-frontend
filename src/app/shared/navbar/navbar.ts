import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth.service';
import { Cart } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  isLoggedIn = false;
  username: string | null = null;
  showDropdown = false;
  isCheckoutPage = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(
    private authservice: Auth,
    private router: Router,
    private cartService: Cart
  ) {

      this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.isCheckoutPage = event.urlAfterRedirects === '/checkout';
    }
  });
  }

  ngOnInit(): void {
    this.authservice.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authservice.username$.subscribe(name => this.username = name);
  }

  /** Live cart item count from CartService */
  get cartCount(): number {
    return this.cartService.getCartCount();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  logout() {
    this.authservice.logout();
    this.closeDropdown();
    this.router.navigate(['/getmenu']);
  }

  goTo(path: string) {
    this.closeDropdown();
    this.router.navigate([path]);
  }
}
