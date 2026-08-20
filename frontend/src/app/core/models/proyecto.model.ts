export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  cliente: string;
  ubicacion: string;
  estado: string;
  fechaInicio: string;
  fechaFin?: string;
  usuarioId: number;
  createdAt: string;
  updatedAt: string;
  latitud?: number;
  longitud?: number;
}

export interface ProyectoRequest {
  nombre: string;
  descripcion?: string;
  cliente: string;
  ubicacion: string;
  estado: string;
}
