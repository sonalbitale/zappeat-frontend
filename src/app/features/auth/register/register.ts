import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerform: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  errorMsg = '';
  emailError = '';
  phoneError = '';

  constructor(
    private fb: FormBuilder,
    private authservice: Auth,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    // form creation
    this.registerform = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Toggle password visibility
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // method to call on registration form submission
  onSubmit() {

    this.errorMsg = '';
    this.emailError = '';
    this.phoneError = '';
    if (this.registerform?.invalid) {
      this.registerform.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = this.registerform?.value;

    this.authservice.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log("user registered successfully");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 409) {
          debugger
          const msg = err.error;

          if (msg.toLowerCase().includes('email')) {
            this.registerform.get('email')?.setErrors({ alreadyExists: true });
            // this.registerform.get('email')?.markAsTouched();
            // this.registerform.get('email')?.updateValueAndValidity(); // 🔥 add this
            // // this.cd.detectChanges(); // 🔥 FORCE UI UPDATE

          } else if (msg.toLowerCase().includes('phone')) {
            this.registerform.get('phone')?.setErrors({ alreadyExists: true });

            // this.phoneError = 'This phone number is already registered.';
          } else {
            this.errorMsg = msg;
          }
        } else {
          this.errorMsg = 'Signup failed. Please try again.';
        }
      }
    });

  }
}

