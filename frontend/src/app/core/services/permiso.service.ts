import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


// =====================================================
// USUARIO RESUMEN
// =====================================================

export interface UsuarioResumen {

  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;

}


// =====================================================
// PERMISOS DE USUARIO
// =====================================================

export interface PermisosUsuario {

  id: number;
  usuarioId: number;

  proyectosVer: boolean;
  proyectosCrear: boolean;
  proyectosEditar: boolean;
  proyectosEliminar: boolean;

  levantamientosVer: boolean;
  levantamientosCrear: boolean;
  levantamientosEditar: boolean;
  levantamientosEliminar: boolean;

  equiposVer: boolean;
  equiposCrear: boolean;
  equiposEditar: boolean;
  equiposEliminar: boolean;

  reportesVer: boolean;
  reportesCrear: boolean;
  reportesEditar: boolean;
  reportesEliminar: boolean;

  createdAt: string;
  updatedAt: string;

}


// =====================================================
// SERVICIO
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private http = inject(HttpClient);

  private readonly API_URL =
    `${environment.apiUrl}/permisos`;


  private readonly headersNoCache =
    new HttpHeaders({

      'Cache-Control':
        'no-cache, no-store, must-revalidate',

      'Pragma':
        'no-cache'

    });


  // ===================================================
  // USUARIOS
  // SOLO ADMIN
  // ===================================================

  obtenerUsuarios():
    Observable<UsuarioResumen[]> {

    return this.http.get<UsuarioResumen[]>(
      `${this.API_URL}/usuarios`,
      {
        headers: this.headersNoCache
      }
    );

  }


  // ===================================================
  // MIS PROPIOS PERMISOS
  // CUALQUIER USUARIO AUTENTICADO
  // ===================================================

  obtenerMisPermisos():
    Observable<PermisosUsuario> {

    return this.http.get<PermisosUsuario>(
      `${this.API_URL}/mios`,
      {
        headers: this.headersNoCache
      }
    );

  }


  // ===================================================
  // PERMISOS DE UN USUARIO
  // SOLO ADMIN
  // ===================================================

  obtenerPermisos(
    usuarioId: number
  ): Observable<PermisosUsuario> {

    return this.http.get<PermisosUsuario>(
      `${this.API_URL}/${usuarioId}`,
      {
        headers: this.headersNoCache
      }
    );

  }


  // ===================================================
  // ACTUALIZAR PERMISOS
  // SOLO ADMIN
  // ===================================================

  actualizarPermisos(
    usuarioId: number,
    datos: Partial<PermisosUsuario>
  ): Observable<PermisosUsuario> {

    return this.http.put<PermisosUsuario>(
      `${this.API_URL}/${usuarioId}`,
      datos
    );

  }

}
