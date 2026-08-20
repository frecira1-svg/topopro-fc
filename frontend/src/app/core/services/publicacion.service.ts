import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import {
    Publicacion,
    PublicacionRequest,
    Comentario,
    ComentarioRequest,
    TipoPublicacion
} from '../models/publicacion.model';

@Injectable({
    providedIn: 'root'
})
export class PublicacionService {

    private readonly http = inject(HttpClient);

    private readonly API_URL =
      `${environment.apiUrl}/publicaciones`;

    // ============================================
    // PUBLICACIONES
    // ============================================

    obtenerPublicaciones(
        tipo?: TipoPublicacion
    ): Observable<Publicacion[]> {

        if (tipo) {

            return this.http.get<Publicacion[]>(
                `${this.API_URL}?tipo=${tipo}`
            );

        }

        return this.http.get<Publicacion[]>(
            this.API_URL
        );

    }

    obtenerPublicacion(
        id: number
    ): Observable<Publicacion> {

        return this.http.get<Publicacion>(
            `${this.API_URL}/${id}`
        );

    }

    crearPublicacion(
        datos: PublicacionRequest
    ): Observable<Publicacion> {

        return this.http.post<Publicacion>(
            this.API_URL,
            datos
        );

    }

    actualizarPublicacion(
        id: number,
        datos: PublicacionRequest
    ): Observable<Publicacion> {

        return this.http.put<Publicacion>(
            `${this.API_URL}/${id}`,
            datos
        );

    }

    eliminarPublicacion(
        id: number
    ): Observable<{ mensaje: string }> {

        return this.http.delete<{ mensaje: string }>(
            `${this.API_URL}/${id}`
        );

    }

    // ============================================
    // COMENTARIOS
    // ============================================

    crearComentario(
        publicacionId: number,
        datos: ComentarioRequest
    ): Observable<Comentario> {

        return this.http.post<Comentario>(
            `${this.API_URL}/${publicacionId}/comentarios`,
            datos
        );

    }

    eliminarComentario(
        comentarioId: number
    ): Observable<{ mensaje: string }> {

        return this.http.delete<{ mensaje: string }>(
            `${this.API_URL}/comentarios/${comentarioId}`
        );

    }

}
