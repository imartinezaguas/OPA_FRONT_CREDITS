import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditStatus',
  standalone: true
})
export class CreditStatusPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    const statusMap: Record<string, string> = {
      'Requested': 'Solicitado',
      'UnderStudy': 'En Estudio',
      'Approved': 'Aprobado',
      'Rejected': 'Rechazado',
      'Disbursed': 'Desembolsado',
      'Cancelled': 'Cancelado'
    };
    return statusMap[value] || value;
  }
}
