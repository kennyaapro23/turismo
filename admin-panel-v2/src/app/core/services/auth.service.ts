import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode'; // ✅ IMPORT CORRECTO

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  // 🔐 Login con almacenamiento automático del token
  login(data: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        if (res.token) {
          this.setToken(res.token);
        }
      })
    );
  }

  // 💾 Guardar token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // 🔑 Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🧠 Extraer y normalizar el rol desde el JWT
  getRol(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      console.log('🟢 Payload:', payload); // 👈 Agrega esto otra vez

      const rawRole = payload.role || payload.authorities?.[0];
      if (!rawRole) return null;

      return rawRole.toUpperCase();
    } catch (err) {
      console.error('Error al decodificar token:', err);
      return null;
    }
  }


  // 👁️‍🗨️ Verificar si hay sesión activa
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🧾 Registro de cuenta
  create(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
