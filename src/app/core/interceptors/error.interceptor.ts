import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UNKNOWN_ERROR, ERROR_NETWORK } from '../constants/const';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      const errorMessage = extractErrorMessage(response);
      
      // Lanzamos un error estándar de JS con el mensaje ya formateado,
      // para que los componentes solo tengan que hacer err.message
      return throwError(() => new Error(errorMessage));
    })
  );
};

function extractErrorMessage(response: HttpErrorResponse): string {
  // Errores de red o de cliente (ej. timeout, CORS)
  if (response.error instanceof ErrorEvent) {
    return response.error.message || ERROR_NETWORK;
  }

  // Servidor inalcanzable
  if (response.status === 0) {
    return ERROR_NETWORK;
  }

  // Errores provenientes del backend
  if (response.error && typeof response.error === 'object') {
    const data = response.error as Record<string, unknown>;

    // 1. ESQUEMA CUSTOM DE NEGOCIO: { success: false, error: { code: '...', message: '...' } }
    if (isCustomError(data)) {
      const errorObj = data['error'] as Record<string, unknown>;
      return errorObj['message'] as string;
    }

    // 2. ESQUEMA NATIVO .NET (ProblemDetails): { errors: { field: ["msg1", "msg2"] } }
    if (data['errors'] && typeof data['errors'] === 'object') {
      const errorsDict = data['errors'] as Record<string, string[]>;
      return Object.values(errorsDict)
        .flat()
        .join('\n');
    }

    // Fallback si devuelve solo un title (ProblemDetails básico)
    if (typeof data['title'] === 'string') {
      return data['title'];
    }
  }

  // Mensaje genérico o de estado HTTP
  return typeof response.error === 'string' ? response.error : (response.statusText || UNKNOWN_ERROR);
}

function isCustomError(data: Record<string, unknown>): boolean {
  return !!data['error'] && typeof data['error'] === 'object' && !!(data['error'] as Record<string, unknown>)['message'];
}
