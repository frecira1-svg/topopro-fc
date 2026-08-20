import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { PublicacionRequest } from '../../../../core/models/publicacion.model';

@Component({
  selector: 'app-publicacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './publicacion-dialog.html',
  styleUrl: './publicacion-dialog.css'
})
export class PublicacionDialog implements OnChanges {

  @Input()
  visible = false;

  @Input()
  esAdmin = false;

  @Input()
  modoEdicion = false;

  @Input()
  publicacion: PublicacionRequest = this.formularioVacio();

  @Output()
  guardar = new EventEmitter<PublicacionRequest>();

  @Output()
  cerrar = new EventEmitter<void>();

  modelo: PublicacionRequest = this.formularioVacio();

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {

  if (changes['publicacion'] || changes['visible']) {

    this.modelo = {

      titulo: this.publicacion?.titulo ?? '',
      contenido: this.publicacion?.contenido ?? '',
      tipo: this.publicacion?.tipo ?? 'COMUNIDAD',
      imagen: this.publicacion?.imagen ?? ''

    };

  }

}

  guardarPublicacion(): void {

    if (!this.modelo.titulo?.trim()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Debe ingresar un título.'
      });

      return;

    }

    if (!this.modelo.contenido?.trim()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Debe ingresar un contenido.'
      });

      return;

    }

    this.guardar.emit({

  ...this.modelo,

  tipo: this.esAdmin
    ? this.modelo.tipo
    : 'COMUNIDAD'

  });

  }

  cerrarDialogo(): void {

    this.cerrar.emit();

  }

  private formularioVacio(): PublicacionRequest {

    return {

      titulo: '',

      contenido: '',

      tipo: 'COMUNIDAD',

      imagen: ''

    };

  }

}
