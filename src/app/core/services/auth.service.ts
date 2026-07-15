import { inject, Injectable, Service } from '@angular/core';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/user.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../endpoint';



@Injectable({
  providedIn: 'root'
})
export class Auth {
  subscribe(arg0: { next: (res: any) => void; error: (err: any) => void; }) {
    throw new Error('Method not implemented.');
  }


  
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(this.getStoredUsername());
  username$ = this.usernameSubject.asObservable();


  constructor(private http: HttpClient) {}
  
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUsername(): string | null {
    return localStorage.getItem('username');
  }


  updateLoginState(username: string) {
  this.isLoggedInSubject.next(true);
  this.usernameSubject.next(username);
}

  // ✅ Central place to set session after ANY login (OTP or password-based)
  setSession(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.isLoggedInSubject.next(true);
    this.usernameSubject.next(username);
  }

 
  checkUser(phoneNumber: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.CHECKUSER, { phone: phoneNumber });
  }

  sendOtp(phoneNumber: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.SENDOTP, { phone: phoneNumber });
  }

  verifyOtp(phoneNumber: string, otp: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.VERIFYOTP, { phone: phoneNumber, otp: otp });
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload)
      .pipe(
        tap((res: LoginResponse) => {
          this.setSession(res.token, (res as any).username ?? '');
        })
      );
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(API_ENDPOINTS.AUTH.REGISTER, payload, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role'); 


    this.isLoggedInSubject.next(false);
    this.usernameSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  VendorSignUp(VendorRegisterdto: any): Observable<any> {
    return this.http.post(API_ENDPOINTS.VENDOR.VENDORSIGNUP, VendorRegisterdto);
  }

  getMyrestoaurant(): Observable<any> {
    return this.http.get(API_ENDPOINTS.VENDOR.MY_RESTAURANT);
  }


  registerGuest(phone: string, name: string, email: string): Observable<any> {
  return this.http.post(API_ENDPOINTS.AUTH.REGISTERGUEST, { phone, name, email });
}

}
