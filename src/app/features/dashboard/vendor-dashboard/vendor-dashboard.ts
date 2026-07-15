import { ChangeDetectorRef, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../../endpoint';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth.service';
import { Food } from '../../../core/services/food.service';

@Component({
  selector: 'app-vendor-dashboard',
  imports: [CommonModule,RouterModule],
  templateUrl: './vendor-dashboard.html',
  styleUrl: './vendor-dashboard.css',
})
export class VendorDashboard {



   foodItems: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient, private router: Router, private authservice: Auth,  private cdr: ChangeDetectorRef, private foodservice : Food
) {}

  ngOnInit(): void {
    this.fetchMyRestaurant();
    this.fetchMyFoodItems();
  }

  fetchMyFoodItems() {
    debugger
    
    this.loading = true;
      this.foodservice.getFoodItems().subscribe({
      
      next: (res: any[]) => {
        debugger
        this.foodItems = res;
        this.loading = false;
        this.cdr.detectChanges();   // 👈 force re-render

      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Could not load your menu items.';
        this.loading = false;
      }
    });
  }
restaurant:any;
fetchMyRestaurant() {
  this.authservice.getMyrestoaurant().subscribe({
    next: (res:any) => {
      this.restaurant = res;
      this.cdr.detectChanges();   // force re-render

    },
    error: (err:any) => {
      console.error(err);
    }
  });
}
  
  goToAddFood() {
    this.router.navigate(['/vendor/add-food-item']);
  }

  editFood(id: number) {
    this.router.navigate(['vendor/edit-food-item', id]);
  }

  deleteFood(id: number) {
    if (!confirm('Delete this item?')) return;

    this.foodservice.deleteFoodItem(id).subscribe({
      next: () => {
        this.foodItems = this.foodItems.filter(item => item.id !== id);
      },
      error: (err: any) => {
        console.error(err);
        alert('Could not delete item.');
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
