import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateCreditComponent } from '../../components/create-credit/create-credit.component';
import { CreditDetailComponent } from '../../components/credit-detail/credit-detail.component';
import { CreditsService } from '../../../../core/services/credits.service';
import { CreditItemDto } from '../../../../core/models/credits.model';
import { CreditStatusPipe } from '../../../../core/pipes/credit-status.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CreateCreditComponent, CreditDetailComponent, CommonModule, FormsModule, CreditStatusPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly creditsService = inject(CreditsService);

  isDrawerOpen = signal(false);
  isDetalleDrawerOpen = signal(false);
  selectedCredit = signal<number | null>(null);

  isDeleteModalOpen = signal(false);
  creditToDelete = signal<CreditItemDto | null>(null);
  isDeleting = signal(false);

  credits = signal<CreditItemDto[]>([]);
  isLoading = signal(false);
  statusFilter = signal('');
  
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadCredits(true);
  }

  loadCredits(reset = false) {
    this.isLoading.set(true);
    this.creditsService.getCredits(reset, this.statusFilter()).subscribe({
      next: (items) => {
        this.credits.set(items);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange() {
    this.loadCredits(true);
  }

  loadMore() {
    this.loadCredits(false);
  }

  openDrawer() {
    this.isDrawerOpen.set(true);
  }

  onDrawerClose() {
    this.isDrawerOpen.set(false);
  }

  onCreditCreated() {
    this.isDrawerOpen.set(false);
    this.showSuccess('El crédito ha sido creado y registrado exitosamente.');
    this.loadCredits(true);
  }

  viewDetail(id: number) {
    this.selectedCredit.set(id);
    this.isDetalleDrawerOpen.set(true);
  }

  onDetailDrawerClose() {
    this.isDetalleDrawerOpen.set(false);
    setTimeout(() => this.selectedCredit.set(null), 300);
  }

  prepareDelete(credit: CreditItemDto) {
    this.creditToDelete.set(credit);
    this.isDeleteModalOpen.set(true);
  }

  cancelDelete() {
    this.isDeleteModalOpen.set(false);
    this.creditToDelete.set(null);
  }

  executeDelete() {
    const cred = this.creditToDelete();
    if (!cred) return;

    this.isDeleting.set(true);
    this.creditsService.deleteCredit(cred.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteModalOpen.set(false);
        this.creditToDelete.set(null);
        this.showSuccess(`El crédito ${cred.creditNumber} ha sido cancelado y borrado exitosamente.`);
        this.loadCredits(true);
      },
      error: (err: Error) => {
        this.isDeleting.set(false);
        this.errorMessage.set('Error al eliminar: ' + err.message.replace(/\|/g, ', '));
      }
    });
  }

  private showSuccess(msj: string) {
    this.successMessage.set(msj);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}
