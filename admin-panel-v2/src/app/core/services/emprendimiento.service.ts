import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emprendimiento } from '../models/emprendimiento.model';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class EmprendimientoService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /**
   * Extrae el rol desde el token JWT (formato actual: sin "ROLE_")
   */
  private getRol(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Token no encontrado en localStorage');
      return null;
    }

    try {
      const payload: any = jwtDecode(token);
      const role = payload.rol || payload.role || null; // 👈 usa "rol" como en backend actual
      console.log('🔐 Rol detectado desde token:', role);
      return role?.toUpperCase() ?? null;
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }

  /**
   * Determina la URL del endpoint según el rol (actual)
   */
  private getEndpointByRol(): string {
    const rol = this.getRol();

    switch (rol) {
      case 'ADMIN':
        return `${this.baseUrl}/admin/emprendimiento`;
      case 'EMPRENDEDOR':
        return `${this.baseUrl}/emprendedor/emprendimiento`;
      case 'USUARIO':
        return `${this.baseUrl}/general/emprendimiento`;
      default:
        console.warn('⚠️ Rol desconocido o no autenticado:', rol);
        return `${this.baseUrl}/general/emprendimiento`;
    }
  }

  /**
   * Consulta de emprendimientos para cualquier rol
   */
  getAll(): Observable<Emprendimiento[]> {
    const endpoint = this.getEndpointByRol();
    console.log('🌐 Usando endpoint:', endpoint);
    return this.http.get<Emprendimiento[]>(endpoint);
  }
}
