import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CreditsService } from '../../../../core/services/credits.service';
import { CreateCreditRequest } from '../../../../core/models/credits.model';

@Component({
  selector: 'app-create-credit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-credit.component.html',
  styleUrls: ['./create-credit.component.scss']
})
export class CreateCreditComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private readonly creditsService = inject(CreditsService);
  private readonly decimalPipe = new DecimalPipe('en-US');

  formData: CreateCreditRequest = {
    associateIdentification: '',
    associateName: '',
    creditType: '',
    requestedValue: 0,
    interestRate: 0,
    numberOfInstallments: 0,
    paymentMethod: ''
  };

  valueDisplay = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  creditTypes = ['LIBRE_INVERSION', 'VIVIENDA', 'PRODUCTIVO'];
  paymentMethods = ['NOMINA', 'VENTANILLA', 'DEBITO_AUTOMATICO'];

  onIdentificationInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/[^0-9]/g, '');
    if (input.value !== cleanValue) {
      input.value = cleanValue;
    }
    this.formData.associateIdentification = cleanValue;
  }

  onNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    if (input.value !== cleanValue) {
      input.value = cleanValue;
    }
    this.formData.associateName = cleanValue;
  }

  onValueInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/[^0-9]/g, '');
    
    if (numericValue) {
      const parsed = parseInt(numericValue, 10);
      this.formData.requestedValue = parsed;
      this.valueDisplay = this.decimalPipe.transform(parsed, '1.0-0')?.replace(/,/g, '.') || '';
    } else {
      this.formData.requestedValue = 0;
      this.valueDisplay = '';
    }

    if (input.value !== this.valueDisplay) {
      input.value = this.valueDisplay;
    }
  }

  submitForm() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.creditsService.createCredit(this.formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeDrawer(true);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message.replace(/\|/g, '<br>'));
      }
    });
  }

  closeDrawer(wasSuccess = false) {
    this.isOpen = false;
    this.errorMessage.set(null);
    this.formData = {
      associateIdentification: '',
      associateName: '',
      creditType: '',
      requestedValue: 0,
      interestRate: 0,
      numberOfInstallments: 0,
      paymentMethod: ''
    };
    this.valueDisplay = '';
    
    if (wasSuccess) {
      this.success.emit();
    } else {
      this.close.emit();
    }
  }
}
