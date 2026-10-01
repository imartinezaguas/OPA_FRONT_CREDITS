import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, map } from 'rxjs';
import { ENDPOINTS } from '../constants/const';
import { ApiResponse, PaginatedData } from '../models/api.model';
import { 
  CreateCreditRequest, 
  UpdateCreditRequest, 
  ChangeStatusRequest, 
  CreditItemDto, 
  DashboardSummaryDto, 
  CreditDetailDto 
} from '../models/credits.model';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {
  private readonly httpService = inject(HttpService);

  private paginationState = {
    page: 1,
    items: [] as CreditItemDto[],
    hasMore: true
  };

  createCredit(payload: CreateCreditRequest): Observable<ApiResponse<unknown>> {
    return this.httpService.post<ApiResponse<unknown>>(ENDPOINTS.CREDITS.BASE, payload);
  }

  getCredits(reset = false, status?: string): Observable<CreditItemDto[]> {
    if (reset) {
      this.paginationState = { page: 1, items: [], hasMore: true };
    }

    if (!this.paginationState.hasMore && !reset) {
      return new Observable<CreditItemDto[]>(obs => {
        obs.next(this.paginationState.items);
        obs.complete();
      });
    }

    const params: Record<string, string | number> = {
      Pagina: this.paginationState.page,
      Cantidad: 10
    };

    if (status && status !== 'Todos los estados' && status !== 'All statuses' && status !== '') {
      params['Status'] = status;
    }

    return this.httpService.get<ApiResponse<PaginatedData<CreditItemDto>>>(ENDPOINTS.CREDITS.BASE, { params }).pipe(
      map(response => {
        const data = response.data;
        this.paginationState.items = [...this.paginationState.items, ...data.items];
        this.paginationState.page++;
        this.paginationState.hasMore = data.currentPage < data.totalPages;
        return this.paginationState.items;
      })
    );
  }

  getCreditById(id: number): Observable<ApiResponse<CreditDetailDto>> {
    return this.httpService.get<ApiResponse<CreditDetailDto>>(`${ENDPOINTS.CREDITS.BASE}/${id}`);
  }

  updateCredit(id: number, payload: UpdateCreditRequest): Observable<ApiResponse<unknown>> {
    return this.httpService.put<ApiResponse<unknown>>(`${ENDPOINTS.CREDITS.BASE}/${id}`, payload);
  }

  changeStatus(id: number, payload: ChangeStatusRequest): Observable<ApiResponse<unknown>> {
    return this.httpService.patch<ApiResponse<unknown>>(`${ENDPOINTS.CREDITS.BASE}/${id}/estado`, payload);
  }

  deleteCredit(id: number): Observable<ApiResponse<unknown>> {
    return this.httpService.delete<ApiResponse<unknown>>(`${ENDPOINTS.CREDITS.BASE}/${id}`);
  }

  getSummary(): Observable<ApiResponse<DashboardSummaryDto>> {
    return this.httpService.get<ApiResponse<DashboardSummaryDto>>(`${ENDPOINTS.CREDITS.BASE}/summary`);
  }
}
