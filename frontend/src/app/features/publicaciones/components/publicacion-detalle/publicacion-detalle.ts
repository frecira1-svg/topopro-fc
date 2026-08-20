import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Publicacion,
  ComentarioRequest
} from '../../../../core/models/publicacion.model';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css'
})
export class PublicacionDetalle implements OnChanges {

  @Input()
  visible = false;

  @Input()
  publicacion: Publicacion | null = null;

  @Input()
  usuarioId: number | null = null;

  @Input()
  esAdmin = false;

  @Output()
  cerrar = new EventEmitter<void>();

  @Output()
  comentar = new EventEmitter<ComentarioRequest>();

  @Output()
  eliminarComentario = new EventEmitter<number>();

  comentario = '';

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['visible'] && this.visible) {
      this.comentario = '';
    }

  }

  enviarComentario(): void {

    if (!this.comentario.trim()) {
      return;
    }

    this.comentar.emit({
      contenido: this.comentario
    });

    this.comentario = '';

  }

  puedeEliminarComentario(usuarioComentarioId: number): boolean {

    return this.esAdmin || usuarioComentarioId === this.usuarioId;

  }

  cerrarDialogo(): void {

    this.cerrar.emit();

  }

}
