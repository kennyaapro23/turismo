export interface CrearReservaRequest {
  emprendimientoId: number;
  fecha: string; // formato 'YYYY-MM-DD'
  cantidadPersonas: number;
}

export interface ReservaResponseDTO {
  id: number;
  fecha: string;
  cantidadPersonas: number;
  estado: string;
  nombreEmprendimiento: string;
  nombreUsuario: string;
}
