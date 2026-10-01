import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Observable, tap } from 'rxjs';
import { ENDPOINTS } from '../constants/const';

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpService = inject(HttpService);
  private readonly router = inject(Router);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpService.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials).pipe(
      tap((response) => {
        if (response.success && response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
