import { inject, Injectable } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services";

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getCurrentUserRole();
    const allowedRoles: String[] = route.data['roles'];

    if(userRole && allowedRoles.includes(userRole)) {
        return true;
    } else {
        return router.createUrlTree(['/home'])
    }
    
}