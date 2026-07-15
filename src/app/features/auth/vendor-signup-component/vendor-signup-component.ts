import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vendor-signup-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './vendor-signup-component.html',
  styleUrl: './vendor-signup-component.css',
})
export class VendorSignupComponent {


   formData = {
    username: '',
    password: '',
    email: '',
    contactno:'',
    restaurantName: '',
    fssaiLicense: '',
    businessAddress: ''
  };

  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private http: HttpClient, private router: Router, private authservice : Auth) {}

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.formData.username || !this.formData.password || !this.formData.email || !this.formData.contactno ||
        !this.formData.restaurantName || !this.formData.fssaiLicense || !this.formData.businessAddress) {
      this.errorMsg = 'Please fill all fields.';
      return;
    }

    this.loading = true;
    this.authservice.VendorSignUp(this.formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMsg = 'Registration submitted! Awaiting admin approval.';
        setTimeout(() => this.router.navigate(['/']), 2500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
