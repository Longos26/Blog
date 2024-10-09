import { CanActivateFn } from '@angular/router';
import { AuthFService } from './services/auth-f.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authFService = inject(AuthFService);
  const router = inject(Router);

  if (authFService.isLoggedIn === false) {
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};
