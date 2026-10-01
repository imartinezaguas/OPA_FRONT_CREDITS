import { Component, inject, signal, OnInit } from '@angular/core';
import { CreditsService } from '../../../../core/services/credits.service';
import { DashboardSummaryDto } from '../../../../core/models/credits.model';

@Component({
  selector: 'app-summary',
  standalone: true,
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private readonly creditsService = inject(CreditsService);

  isLoading = signal(true);
  summary = signal<DashboardSummaryDto | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.isLoading.set(true);
    this.creditsService.getSummary().subscribe({
      next: (res) => {
        const data = res.data as any;
        this.summary.set({
          totalCredits: data.totalCredits ?? data.TotalCredits ?? 0,
          quantityByStatus: data.quantityByStatus ?? data.QuantityByStatus ?? {}
        });
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('Error fetching summary:', err);
        this.errorMessage.set('Error al cargar el resumen: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }
}
