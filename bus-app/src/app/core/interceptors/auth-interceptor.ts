import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/login') && !req.url.includes('/register')) {
        
        console.warn('Сесията е изтекла или е невалидна. Изчистване на локалните данни...');
        
        authService.clearLocalData();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};