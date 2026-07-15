import { Component } from '@angular/core';
import { Food } from '../../../core/services/food.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addfooditem',
  imports: [CommonModule,FormsModule],
  templateUrl: './addfooditem.html',
  styleUrl: './addfooditem.css',
})
export class Addfooditem {

formData = {
    name: '',
    price: null,
    category: '',
    imageUrl: ''
  };

  loading = false;
  errorMsg = '';
  successMsg = '';

  isEditMode = false;
  foodId!: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private foodservice: Food
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.foodId = Number(idParam);
      this.loadExistingFood(this.foodId);
    }
  }

  loadExistingFood(id: number) {
    this.foodservice.getFoodItemById(id).subscribe({
      next: (res) => {
        this.formData = {
          name: res.name,
          price: res.price,
          category: res.category,
          imageUrl: res.imageUrl
        };
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Could not load food item.';
      }
    });
  }

  onSubmit() {
  this.errorMsg = '';
  this.successMsg = '';

  if (!this.formData.name || !this.formData.price || !this.formData.category || !this.formData.imageUrl) {
    this.errorMsg = 'Please fill all fields.';
    return;
  }

  this.loading = true;

  const request$ = this.isEditMode
    ? this.foodservice.updateFoodItem(this.formData, this.foodId!)
    : this.foodservice.addFoodItem(this.formData);

  request$.subscribe({
    next: () => {
      this.loading = false;
      this.successMsg = this.isEditMode
        ? 'Food item updated successfully!'
        : 'Food item added successfully!';
      setTimeout(() => this.router.navigate(['/vendor-dashboard']), 1500);
    },
    error: (err: any) => {
      this.loading = false;
      this.errorMsg = err?.error?.message || 'Something went wrong.';
      console.error(err);
    }
  });
}

  goBack() {
    this.router.navigate(['/vendor-dashboard']);
  }
}
