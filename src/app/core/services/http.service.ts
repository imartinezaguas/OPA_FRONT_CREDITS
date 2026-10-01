import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UNKNOWN_ERROR, ERROR_NETWORK } from '../constants/const';

export interface HttpOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface CustomHttpError {
  status: number;
  message: string;
  url: string | null;
  error?: unknown;
}

@Injectable({
  providedIn: 'root' // <-- Esto lo hace global en toda la aplicación (Singleton)
})
export class HttpService {
  // En Angular, la forma recomendada y nativa es usar HttpClient en lugar de fromFetch
  private readonly http = inject(HttpClient);

  /**
   * Método genérico base para cualquier petición
   */
  public request<T, B = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: B,
    options?: HttpOptions
  ): Observable<T> {
    const url = `${environment.apiUrl}${endpoint}`;

    // Convertimos los parámetros genéricos a HttpParams de Angular
    let httpParams = new HttpParams();
    if (options?.params) {
      Object.keys(options.params).forEach((key) => {
        const value = options.params![key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }

    // Convertimos las cabeceras genéricas a HttpHeaders
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    });

    // El token ahora se maneja de forma global automáticamente a través del AuthInterceptor

    const requestOptions = {
      body,
      headers: httpHeaders,
      params: httpParams,
    };

    return this.http.request<T>(method, url, requestOptions);
  }

  // --- MÉTODOS DE CONVENIENCIA PARA NO REPETIR CÓDIGO ---

  public get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  public post<T, B = unknown>(endpoint: string, body: B, options?: HttpOptions): Observable<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  public put<T, B = unknown>(endpoint: string, body: B, options?: HttpOptions): Observable<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  public patch<T, B = unknown>(endpoint: string, body: B, options?: HttpOptions): Observable<T> {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  public delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}
