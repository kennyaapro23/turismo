// src/app/core/guards/role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import {AuthService} from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    try {
      const payload: any = jwtDecode(token);
      const userRole = payload.rol || payload.role || payload.authorities?.[0]; // ✅ uso flexible

      if (!userRole) {
        console.warn('⚠️ No se encontró ningún rol en el token.');
        this.router.navigate(['/auth/login']);
        return false;
      }

      const normalizedRole = userRole.replace('ROLE_', '').toUpperCase(); // 🔁 limpia y normaliza
      const expectedRoles: string[] = route.data['expectedRoles']?.map((r: string) => r.toUpperCase()) || [];

      if (expectedRoles.includes(normalizedRole)) {
        return true;
      }

      console.warn('❌ Rol no autorizado:', normalizedRole);
      this.router.navigate(['/unauthorized']);
      return false;

    } catch (err) {
      console.error('❌ Token inválido:', err);
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
