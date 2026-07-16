import { Component } from '@angular/core';
import { LoginRequest } from '../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth} from '../../../core/services/auth.service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
 imports: [CommonModule, ReactiveFormsModule, RouterModule], 
 templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(){
this.loginForm.valueChanges.subscribe(() => {
  this.errorMessage = '';
});
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: (res:any) => {
        this.isLoading = false;


          localStorage.setItem('token', res.token);

      const decoded = this.authService.decodeToken(res.token);
      console.log(decoded);
      const role = decoded.role; // "ROLE_USER" | "ROLE_VENDOR" | "ROLE_ADMIN"
      const username = decoded.sub;
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);



      this.authService.updateLoginState(username);


      if (role === 'ROLE_VENDOR') {
        this.router.navigate(['/vendor-dashboard']);
      } else if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if(role==='ROLE_DELIVERY_BOY'){
        this.router.navigate(['/delivery/incomingorders'])
      }
      else{
        this.router.navigate(['/menu']); // customer goes to menu/home
      }
    },
      error: (err) => {
        
        this.isLoading = false;
  if (err.status === 401) {
 this.errorMessage = 'Invalid username or password.';
  this.loginForm.get('username')?.setErrors({ invalid: true });
  this.loginForm.get('password')?.setErrors({ invalid: true });  }
   else if (err.status === 0) {
    this.errorMessage = 'Server not reachable. Please try again later.';
  } else {
    this.errorMessage = err.error?.message || 'Something went wrong.';
  }      }
    });
  }
}
