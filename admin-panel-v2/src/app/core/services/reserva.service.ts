import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CrearReservaRequest,
  ReservaResponseDTO
} from '../models/reserva.model';
import { Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /** 🔐 Extrae el rol actual desde el token (normalizado) */
  private getRol(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      const role = payload.role || payload.rol || payload.authorities?.[0] || '';
      return role.replace('ROLE_', '').toUpperCase();
    } catch (error) {
      console.error('❌ Error al extraer el rol:', error);
      return null;
    }
  }

  /** 🧑‍💼 Extrae el ID de usuario desde el token */
  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      return payload.idUsuario || null;
    } catch (error) {
      console.error('❌ Error al extraer el idUsuario:', error);
      return null;
    }
  }

  /** 📌 Determina el endpoint base según el rol */
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
        console.warn('⚠️ Rol no reconocido, usando endpoint de usuario');
        return `${this.baseUrl}/usuario/reserva`;
    }
  }

  /** 🟢 Crear nueva reserva */
  crearReserva(data: CrearReservaRequest): Observable<ReservaResponseDTO> {
    return this.http.post<ReservaResponseDTO>(`${this.baseUrl}/usuario/reserva`, data);
  }

  /** 📞 Obtener teléfono del emprendedor por idEmprendimiento */
  getTelefonoEmprendedor(idEmprendimiento: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/usuario/reserva/telefono/${idEmprendimiento}`, {
      responseType: 'text'
    });
  }

  /** 📄 Obtener reservas por usuario usando idUsuario desde el token */
  getReservasPorUsuario(): Observable<ReservaResponseDTO[]> {
    const idUsuario = this.getUserIdFromToken();
    if (!idUsuario) {
      console.warn('⚠️ ID del usuario no encontrado en el token');
      return throwError(() => new Error('ID del usuario no encontrado'));
    }

    const url = `${this.baseUrl}/usuario/reserva/idUsuario/${idUsuario}`;
    return this.http.get<ReservaResponseDTO[]>(url);
  }

  /** ❌ Cancelar una reserva por ID (DELETE) */
  cancelarReserva(idReserva: number): Observable<void> {
    const url = `${this.baseUrl}/usuario/reserva/${idReserva}`;
    return this.http.delete<void>(url);
  }
}
