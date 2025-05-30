import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {Router, RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: true,
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: [],
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule],
})
export class DashboardLayoutComponent {
  mobileNavOpen = false;
  userDropdownOpen = false;
  private isBrowser: boolean;
  rol: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.setRol();
    }
  }

  private setRol(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Token no encontrado en localStorage');
      return;
    }

    try {
      const payload: any = jwtDecode(token);
      const rawrole = payload?.role;
      if (rawrole) {
        this.rol = rawrole.replace('ROLE_', '').toUpperCase();
        console.log('✅ Rol detectado desde token:', this.rol);
      } else {
        console.warn('⚠️ Token no contiene "role"');
      }
    } catch (e) {
      console.error('❌ Error decodificando token:', e);
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/auth/login']);
  }

  toggleDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  isDesktop(): boolean {
    return this.isBrowser && window.innerWidth > 768;
  }
}
