import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Levantamiento } from '../../models/levantamiento';
import { LevantamientosService } from '../../services/levantamientos';
import { Proyecto } from '../../../../core/models/proyecto.model';
import { ProyectoService } from '../../../../core/services/proyecto.service';
import { Equipo } from '../../../equipos/models/equipo';
import { EquiposService } from '../../../equipos/services/equipos';

@Component({
  selector: 'app-levantamientos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './levantamientos.html',
  styleUrl: './levantamientos.css'
})
export class Levantamientos implements OnInit {

  private levantamientosService = inject(LevantamientosService);
  private proyectoService = inject(ProyectoService);
  private equiposService = inject(EquiposService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  levantamientos: Levantamiento[] = [];
  proyectos: Proyecto[] = [];
  equipos: Equipo[] = [];

  cargando = true;

  mostrarFormulario = false;

  editando = false;

  levantamientoId: number | null = null;

  opcionesEstado = ['PLANIFICADO', 'EN_CAMPO', 'COMPLETADO'];

  formulario: FormGroup = this.fb.group({

    fecha: [''],

    descripcion: [''],

    observaciones: [''],

    estado: ['PLANIFICADO'],

    proyectoId: [null, Validators.required],

    equipoId: [null]

  });

  get planificados(): number {
    return this.levantamientos.filter(l => l.estado === 'PLANIFICADO').length;
  }

  get enCampo(): number {
    return this.levantamientos.filter(l => l.estado === 'EN_CAMPO').length;
  }

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarEquipos();
    this.cargarLevantamientos();
  }

  cargarProyectos(): void {
    this.proyectoService.obtenerTodos().subscribe({
      next: (data) => this.proyectos = data,
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudieron cargar los proyectos.'
        });
      }
    });
  }

  cargarEquipos(): void {
    this.equiposService.obtenerEquipos().subscribe({
      next: (data) => this.equipos = data,
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudieron cargar los equipos.'
        });
      }
    });
  }

  cargarLevantamientos(): void {

    this.cargando = true;

    this.levantamientosService.obtenerLevantamientos().subscribe({

      next: (respuesta: Levantamiento[]) => {

        this.levantamientos = respuesta;
        this.cargando = false;

      },

      error: (error: any) => {

        console.error(error);
        this.cargando = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudieron cargar los levantamientos.'
        });

      }

    });

  }

  nombreProyecto(id: number): string {
    return this.proyectos.find(p => p.id === id)?.nombre || '-';
  }

  nombreEquipo(id: number | null | undefined): string {
    if (!id) return '-';
    return this.equipos.find(e => e.id === id)?.nombre || '-';
  }

  nuevoLevantamiento(): void {

    this.editando = false;

    this.levantamientoId = null;

    this.formulario.reset({ estado: 'PLANIFICADO' });

    this.mostrarFormulario = true;

  }

  editarLevantamiento(levantamiento: Levantamiento): void {

    this.editando = true;

    this.levantamientoId = levantamiento.id ?? null;

    this.formulario.patchValue({
      ...levantamiento,
      fecha: levantamiento.fecha ? levantamiento.fecha.substring(0, 10) : ''
    });

    this.mostrarFormulario = true;

  }

  guardarLevantamiento(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Selecciona un proyecto para el levantamiento.'
      });

      return;

    }

    const datos: Levantamiento = this.formulario.value;

    if (this.editando && this.levantamientoId) {

      this.levantamientosService.actualizarLevantamiento(this.levantamientoId, datos).subscribe({

        next: () => {

          this.mostrarFormulario = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Levantamiento actualizado correctamente.'
          });

          this.cargarLevantamientos();

        },

        error: (error: any) => {

          console.error(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'No se pudo actualizar el levantamiento.'
          });

        }

      });

    } else {

      this.levantamientosService.crearLevantamiento(datos).subscribe({

        next: () => {

          this.mostrarFormulario = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Levantamiento creado correctamente.'
          });

          this.cargarLevantamientos();

        },

        error: (error: any) => {

          console.error(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'No se pudo crear el levantamiento.'
          });

        }

      });

    }

  }

  eliminarLevantamiento(levantamiento: Levantamiento): void {

    if (!levantamiento.id) return;

    if (!confirm(`¿Eliminar este levantamiento?`)) return;

    this.levantamientosService.eliminarLevantamiento(levantamiento.id).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Levantamiento eliminado correctamente.'
        });

        this.cargarLevantamientos();

      },

      error: (error: any) => {

        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudo eliminar el levantamiento.'
        });

      }

    });

  }

  cancelar(): void {

    this.mostrarFormulario = false;

    this.formulario.reset({ estado: 'PLANIFICADO' });

  }

}
