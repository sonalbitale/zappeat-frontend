import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Food } from '../../../core/services/food.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../../../core/services/cart.service';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule, RouterModule,Navbar],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.css',
})
export class MenuList  {

  //  FOOD DATA
  Menu: any[] = [];
  filteredMenu: any[] = [];

  //  CATEGORY
  categories: string[] = [];
  activeCategory: string = 'All';

  //  CART DATA
  cartLines: any[] = [];
  cartOpen: boolean = false;
  searchQuery: string = '';

  username: string | null = null;


  constructor(
    private cartService: Cart,
    private foodService: Food,
    private cd: ChangeDetectorRef,
    private authservice :Auth
  ) {}

  ngOnInit() {
    //  this.authservice.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    // this.authservice.username$.subscribe(name => this.username = name);
    this.getAllFood();
    this.loadCart();
  }

  // ✅ FETCH FOOD
  getAllFood() {
    this.foodService.getallFood().subscribe({
      next: (resp: any) => {
        // Map to include aesthetic elements like ratings & prep times
        this.Menu = resp.map((f: any) => ({
          ...f,
          rating: +(((f.id * 7) % 5) / 10 + 4.4).toFixed(1), // stable rating between 4.4 and 4.8
          prepTime: `${(f.id * 5) % 20 + 15} mins` // stable prep time between 15 and 35 mins
        }));
        this.applyFilters();

        // ✅ EXTRACT CATEGORIES
        const cats: string[] = resp
          .map((f: any) => f.category)
          .filter((c: any) => typeof c === 'string');

        this.categories = ['All', ...Array.from(new Set(cats))];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log("error", err);
      }
    });
  }

  // ✅ COMBINED FILTER (CATEGORY + SEARCH)
  applyFilters() {
    let temp = this.Menu;

    // 1. Apply category filter
    if (this.activeCategory !== 'All') {
      temp = temp.filter(f => f.category === this.activeCategory);
    }

    // 2. Apply search query filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      temp = temp.filter(f => 
        f.name.toLowerCase().includes(q) || 
        (f.description && f.description.toLowerCase().includes(q))
      );
    }

    this.filteredMenu = temp;
  }

  // ✅ CATEGORY FILTER
  setCategory(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  // ✅ SEARCH TRIGGER
  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  // ✅ CART LOAD
  loadCart() {
    this.cartLines = this.cartService.getCartItems();
  }

  // ✅ ADD ITEM
  addToCart(food: any) {
    this.cartService.addToCart(food);
    this.loadCart();
  }

  // ✅ INCREMENT
  increment(food: any) {
    this.cartService.addToCart(food);
    this.loadCart();
  }

  // ✅ DECREMENT
  decrement(food: any) {
    this.cartService.removeOne(food);
    this.loadCart();
  }

  

  getQuantity(foodId: number): number {
  const item = this.cartLines.find(i => i.food.id === foodId);
  return item ? item.quantity : 0;
}

  // ✅ CART COUNT (TOP BADGE)
  get cartCount(): number {
    return this.cartService.getCartCount();
  }

  // ✅ DRAWER TOGGLE
  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }
}