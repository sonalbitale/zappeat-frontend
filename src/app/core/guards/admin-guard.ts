
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {


  
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role === 'ROLE_ADMIN') {
    return true;
  }

  router.navigate(['/']);
  return false;
};

