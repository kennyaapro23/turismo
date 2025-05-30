export interface CrearReservaRequest {
  idEmprendimiento: number;
  fechaHoraInicio: string; // ISO string
  fechaHoraFin: string;    // ISO string
  detalles: {
    idServicioTuristico: number;
    cantidad: number;
    observaciones?: string;
  }[];
}

export interface ReservaResponseDTO {
  idReserva: number; // <- importante, no 'id'
  nombreEmprendimiento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: string;
  detalles: {
    idServicioTuristico: number;
    nombreServicio: string;
    cantidad: number;
    observaciones: string;
  }[];
}
