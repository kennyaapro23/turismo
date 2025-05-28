import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CrearReservaRequest,
  ReservaResponseDTO
} from '../models/reserva.model';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /**
   * Extrae el rol actual desde el token (formato sin "ROLE_")
   */
  private getRol(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Token no encontrado');
      return null;
    }

    try {
      const payload: any = jwtDecode(token);
      const rawRole: string = payload.rol || payload.role || null;

      if (!rawRole) {
        console.warn('⚠️ El rol no está presente en el token');
        return null;
      }

      const normalized = rawRole.toUpperCase(); // por seguridad
      console.info('🔐 Rol detectado desde token:', normalized);
      return normalized;
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }

  /**
   * Determina el endpoint base según el rol limpio
   */
  private getEndpointByRol(): string {
    const rol = this.getRol();

    switch (rol) {
      case 'USUARIO':
        return `${this.baseUrl}/usuario/reserva`;
      case 'ADMIN':
        return `${this.baseUrl}/admin/reserva`;
      case 'EMPRENDEDOR':
        return `${this.baseUrl}/emprendedor/reserva`;
      default:
        console.warn('⚠️ Rol desconocido, usando fallback usuario/reserva');
        return `${this.baseUrl}/usuario/reserva`;
    }
  }

  /**
   * Crear una reserva (POST)
   */
  crearReserva(data: CrearReservaRequest): Observable<ReservaResponseDTO> {
    return this.http.post<ReservaResponseDTO>(this.getEndpointByRol(), data);
  }

  /**
   * Obtener número del emprendedor por ID de emprendimiento
   */
  getTelefonoEmprendedor(idEmprendimiento: number): Observable<string> {
    return this.http.get(`${this.getEndpointByRol()}/telefono/${idEmprendimiento}`, {
      responseType: 'text'
    });
  }

  /**
   * Obtener reservas del usuario autenticado
   */
  getMisReservas(): Observable<ReservaResponseDTO[]> {
    return this.http.get<ReservaResponseDTO[]>(`${this.getEndpointByRol()}/mis-reservas`);
  }

  /**
   * Cancelar una reserva por ID
   */
  cancelarReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getEndpointByRol()}/${id}`);
  }
}
