import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditsService } from '../../../../core/services/credits.service';
import { CreditDetailDto, UpdateCreditRequest, ChangeStatusRequest } from '../../../../core/models/credits.model';
import { CreditStatusPipe } from '../../../../core/pipes/credit-status.pipe';

@Component({
  selector: 'app-credit-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CreditStatusPipe],
  templateUrl: './credit-detail.component.html',
  styleUrls: ['./credit-detail.component.scss']
})
export class CreditDetailComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() creditId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  private readonly creditsService = inject(CreditsService);
  private readonly decimalPipe = new DecimalPipe('en-US');

  isLoading = signal(false);
  detail = signal<CreditDetailDto | null>(null);

  isEditing = signal(false);
  isSaving = signal(false);
  editData: UpdateCreditRequest = { requestedValue: 0, interestRate: 0, numberOfInstallments: 0, paymentMethod: '' };
  valueDisplay = '';
  paymentMethods = ['NOMINA', 'VENTANILLA', 'DEBITO_AUTOMATICO', 'CAJA'];

  isStatusModalOpen = signal(false);
  selectedStatus = signal<string>('');
  observationText = signal<string>('');
  isUpdatingStatus = signal(false);

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']?.currentValue === true && this.creditId) {
      this.loadDetail(this.creditId);
    }
  }

  loadDetail(id: number) {
    this.isLoading.set(true);
    this.isEditing.set(false);
    this.errorMessage.set(null);
    this.creditsService.getCreditById(id).subscribe({
      next: (res) => {
        this.detail.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  closeDrawer() {
    this.isOpen = false;
    this.isEditing.set(false);
    setTimeout(() => {
      this.detail.set(null);
      this.errorMessage.set(null);
      this.successMessage.set(null);
    }, 300);
    this.close.emit();
  }

  startEdit() {
    const det = this.detail();
    if (!det) return;
    this.editData = {
      requestedValue: det.requestedValue,
      interestRate: det.interestRate,
      numberOfInstallments: det.numberOfInstallments,
      paymentMethod: det.paymentMethod
    };
    this.valueDisplay = this.decimalPipe.transform(det.requestedValue, '1.0-0')?.replace(/,/g, '.') || '';
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  onValueChange(value: string) {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      const parsed = parseInt(numericValue, 10);
      this.editData.requestedValue = parsed;
      this.valueDisplay = this.decimalPipe.transform(parsed, '1.0-0')?.replace(/,/g, '.') || '';
    } else {
      this.editData.requestedValue = 0;
      this.valueDisplay = '';
    }
  }

  saveChanges() {
    if (!this.creditId) return;
    this.isSaving.set(true);
    this.creditsService.updateCredit(this.creditId, this.editData).subscribe({
      next: () => {
        this.showSuccess('Crédito actualizado exitosamente');
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.loadDetail(this.creditId!);
        this.updated.emit();
      },
      error: (err: Error) => {
        this.isSaving.set(false);
        this.errorMessage.set('Error al actualizar: ' + err.message.replace(/\|/g, ', '));
      }
    });
  }

  prepareStatusChange(status: string) {
    this.selectedStatus.set(status);
    this.observationText.set('');
    this.isStatusModalOpen.set(true);
  }

  cancelStatusChange() {
    this.isStatusModalOpen.set(false);
  }

  confirmStatusChange() {
    if (!this.observationText().trim()) return;

    this.isUpdatingStatus.set(true);
    const payload: ChangeStatusRequest = {
      newStatus: this.selectedStatus(),
      observation: this.observationText().trim()
    };

    this.creditsService.changeStatus(this.creditId!, payload).subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.isStatusModalOpen.set(false);
        this.showSuccess(`Estado cambiado exitosamente`);
        this.loadDetail(this.creditId!);
        this.updated.emit();
      },
      error: (err: Error) => {
        this.isUpdatingStatus.set(false);
        this.errorMessage.set('Error al cambiar estado: ' + err.message.replace(/\|/g, ', '));
      }
    });
  }

  private showSuccess(msj: string) {
    this.successMessage.set(msj);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}
