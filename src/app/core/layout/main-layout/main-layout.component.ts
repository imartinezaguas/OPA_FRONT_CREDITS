import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  isLogoutModalOpen = signal(false);

  prepararLogout() {
    this.isLogoutModalOpen.set(true);
  }

  cancelarLogout() {
    this.isLogoutModalOpen.set(false);
  }

  ejecutarLogout() {
    this.isLogoutModalOpen.set(false);
    this.authService.logout();
  }
}
