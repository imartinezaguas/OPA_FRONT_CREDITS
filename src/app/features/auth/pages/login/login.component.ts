import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  credentials: LoginRequest = { username: '', password: '' };
  
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  login() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Credenciales inválidas');
      }
    });
  }
}
