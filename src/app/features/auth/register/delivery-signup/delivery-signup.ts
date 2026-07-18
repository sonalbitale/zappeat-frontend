import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Deliveryservice } from '../../../../core/services/deliveryservice/deliveryservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-signup',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './delivery-signup.html',
  styleUrl: './delivery-signup.css',
})
export class DeliverySignup {


  signupForm!: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private deliveryService: Deliveryservice,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      drivingLicense: ['', Validators.required],
      aadharPan: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.deliveryService.DeliverySignUp(this.signupForm.value).subscribe({
      next: (res: any) => {
        this.message = res;
        alert("Registration successful! Awaiting admin approval.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert("Something went wrong");
      }
    });
  }
}
