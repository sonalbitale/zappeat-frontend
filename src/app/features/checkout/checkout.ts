import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Address } from '../../models/address-model';
import { Cart } from '../../core/services/cart.service';
import { Auth } from '../../core/services/auth.service';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule,Navbar],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  addresses: Address[] = [];
  selectedAddress: Address | null = null;

  showSidebar = false;
  addressForm!: FormGroup;

  cartItems: any[] = [];
  total = 0;
  isLoggedIn = false;
  phoneNumber: string = '';
  showOtpModal = false;
  enteredOtp: string = '';

  step = 1; // 1 = phone, 2 = next step
  userExists: boolean | null = null;

  name: string = '';
  email: string = '';

  isSendingOtp = false;
  isVerifying = false;
  otpError = '';

  loggedInUsername = '';
  loggedInPhone = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: Cart,
    private authservice : Auth,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authservice.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.loggedInUsername = localStorage.getItem('username') || '';
        this.loggedInPhone = localStorage.getItem('userPhone') || '';
      } else {
        this.loggedInUsername = '';
        this.loggedInPhone = '';
      }
    });
    this.loadAddresses();
    this.loadCart();

    // ✅ Initialize form
    this.addressForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      landmark: [''],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      type: ['home']
    });
  }





// register() {

//   if (!this.name || !this.email) {
//     alert("Fill all fields");
//     return;
//   }

//   this.authservice.register({
//     phone: this.phoneNumber,
//     name: this.name,
//     email: this.email
//   }).subscribe(() => {

//     // 🔥 directly open OTP
//     this.showOtpModal = true;

//   });
// }


  // 🧾 Load saved addresses
  loadAddresses() {
    this.addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
  }

  // 🛒 Load cart
  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  // ✅ Select address
  selectAddress(addr: Address) {
    this.selectedAddress = addr;
  }

  // ➕ Open sidebar
  openSidebar() {
    this.showSidebar = true;
  }

  // ❌ Close sidebar
  closeSidebar() {
    this.showSidebar = false;
  }

  // 💾 Save new address
  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    // ✅ Proper mapping (IMPORTANT)
    const newAddress: Address = {
      phone: this.addressForm.value.phone,
      address: this.addressForm.value.address,
      landmark: this.addressForm.value.landmark,
      city: this.addressForm.value.city,
      pincode: this.addressForm.value.pincode,
      type: this.addressForm.value.type
    };

    this.addresses = [...this.addresses, newAddress];

    localStorage.setItem('addresses', JSON.stringify(this.addresses));

    this.selectedAddress = newAddress;

    this.closeSidebar();

    this.addressForm.reset({
      type: 'home'
    });
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

  // 🚀 Proceed to payment
proceedToPayment() {

  if (!this.selectedAddress) {
    alert("Please select address");
    return;
  }

  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) {
    // Save current state (IMPORTANT)
    localStorage.setItem('selectedAddress', JSON.stringify(this.selectedAddress));

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/payment' }
    });

    return;
  }

  // ✅ Logged in
  localStorage.setItem('selectedAddress', JSON.stringify(this.selectedAddress));
  this.router.navigate(['/payment']);
}
  logout(): void {
    this.authservice.logout();
    localStorage.removeItem('userPhone');
    this.isLoggedIn = false;
    this.phoneNumber = '';
    this.enteredOtp = '';
    this.showOtpModal = false;
    this.step = 1;
    this.otpError = '';
    this.loggedInUsername = '';
    this.loggedInPhone = '';
  }

checkUser() {
  if (this.phoneNumber.length !== 10) {
    alert("Enter valid phone number");
    return;
  }
  this.authservice.checkUser(this.phoneNumber).subscribe({
    next: (res: any) => {
      this.userExists = res.exists;
      if (this.userExists) {
        this.sendOtp();   // existing user → straight to OTP
      }
      // if false, template shows name/email fields — user must click Register
      this.cdr.detectChanges();
    },
    error: () => {
      this.otpError = "Something went wrong. Please try again.";
    }
  });
}

sendOtp() {
  this.isSendingOtp = true;
  this.otpError = '';
  this.authservice.sendOtp(this.phoneNumber).subscribe({
    next: () => {
      debugger
      this.isSendingOtp = false;
      this.showOtpModal = true;
      this.cdr.detectChanges();   // ← is this line present?

    },
    error: (err) => {
      this.isSendingOtp = false;
      this.otpError = err.error?.error || "Failed to send OTP. Please try again.";
    }
  });
}

  verifyOtp() {
    if (this.enteredOtp.length !== 6) {
      this.otpError = "Enter the 6-digit OTP";
      return;
    }
    this.isVerifying = true;
    this.otpError = '';
    this.cdr.detectChanges();

    this.authservice.verifyOtp(this.phoneNumber, this.enteredOtp).subscribe({
      next: (res: any) => {
        this.isVerifying = false;
        if (res && res.error) {
          this.otpError = res.error;
          this.cdr.detectChanges();
          return;
        }
        this.authservice.setSession(res.token, res.username);   // ✅ centralized, navbar reacts automatically
        if (res.phone) {
          localStorage.setItem('userPhone', res.phone);
          this.loggedInPhone = res.phone;
        } else {
          localStorage.setItem('userPhone', this.phoneNumber);
          this.loggedInPhone = this.phoneNumber;
        }
        this.loggedInUsername = res.username || '';
        this.isLoggedIn = true;
        this.showOtpModal = false;
        this.step = 1; // reset for cleanliness
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isVerifying = false;
        console.error("OTP verification error:", err);
        let errorMsg = "Verification failed. Please try again.";
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.error) {
            errorMsg = err.error.error;
          } else if (err.error.message) {
            errorMsg = err.error.message;
          }
        }
        this.otpError = errorMsg;
        this.cdr.detectChanges();
      }
    });
  }



  newUserName: string = '';
newUserEmail: string = '';
isRegistering = false;
registerError = '';



registerGuest() {
  if (!this.newUserName.trim()) {
    this.registerError = "Please enter your name";
    return;
  }
  this.isRegistering = true;
  this.registerError = '';

  this.authservice.registerGuest(this.phoneNumber, this.newUserName, this.newUserEmail).subscribe({
    next: () => {
      this.isRegistering = false;
      this.userExists = true;   // ✅ flips template back to normal Send-OTP view
      this.newUserName = '';
      this.newUserEmail = '';
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.isRegistering = false;
      this.registerError = err.error?.error || "Registration failed. Please try again.";
      this.cdr.detectChanges();
    }
  });
}

resendOtp() {
  this.enteredOtp = '';
  this.sendOtp();
}

closeOtpModal() {
  this.showOtpModal = false;
  this.enteredOtp = '';
  this.otpError = '';
}
}