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

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
     ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
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
        this.router.navigate(['/getmenu']); // customer goes to menu/home
      }
    },
    error: (err) => {
      alert('Login failed');
    }
  });
    //     this.router.navigate(['/getmenu']);
    //   },
    //   error: (err: any) => {
    //     this.isLoading = false;
    //     this.errorMessage = 'Invalid username or password';
    //     console.error('Login failed', err);
    //   }
    // });
  }

}
