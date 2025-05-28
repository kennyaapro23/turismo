export interface Emprendimiento {
  idEmprendimiento: number; // <- ✅ Este campo es obligatorio según tu backend
  nombre: string;
  descripcion?: string;
  ubicacion: string;
  precio: number;
  categoria: string;
}
