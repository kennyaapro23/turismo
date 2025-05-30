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
   * Extrae el rol desde el token JWT
   */
  private getRol(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Token no encontrado en localStorage');
      return 'USUARIO'; // Rol por defecto
    }

    try {
      const payload: any = jwtDecode(token);
      const role = (payload.role || '').toUpperCase();

      if (!role) {
        console.warn('⚠️ Token válido pero sin "role" definido');
        return 'USUARIO';
      }

      return role;
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return 'USUARIO'; // Retornar algo seguro
    }
  }

  /**
   * Determina la URL del endpoint según el rol actual
   */
  private getEndpointByRol(): string {
    const role = this.getRol();

    switch (role) {
      case 'ADMIN':
        return `${this.baseUrl}/admin/emprendimiento`;
      case 'EMPRENDEDOR':
        return `${this.baseUrl}/emprendedor/emprendimiento`;
      case 'USUARIO':
        return `${this.baseUrl}/general/emprendimiento`;
      default:
        console.warn('⚠️ Rol no reconocido, usando endpoint público:', role);
        return `${this.baseUrl}/general/emprendimiento`;
    }
  }

  /**
   * Consulta de emprendimientos para cualquier rol
   */
  getAll(): Observable<Emprendimiento[]> {
    const endpoint = this.getEndpointByRol();
    console.log('🌐 Consultando emprendimientos desde:', endpoint);
    return this.http.get<Emprendimiento[]>(endpoint);
  }
}
