import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: true,
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: [],
  imports: [CommonModule, RouterLink, RouterOutlet]
})
export class DashboardLayoutComponent {
  mobileNavOpen = false;
  userDropdownOpen = false;
  private isBrowser: boolean;
  rol: string | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.setRol(); // ✅ solo si estamos en el navegador
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
      this.rol = (payload.rol || payload.role || '').toUpperCase(); // ✅ usa 'rol', normaliza
      console.log('✅ Rol detectado desde token:', this.rol);
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
