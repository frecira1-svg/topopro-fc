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

import { Equipo } from '../../models/equipo';
import { EquiposService } from '../../services/equipos';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css'
})
export class Equipos implements OnInit {

  private equiposService = inject(EquiposService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  equipos: Equipo[] = [];

  cargando = true;

  mostrarFormulario = false;

  editando = false;

  equipoId: number | null = null;

  opcionesEstado = ['DISPONIBLE', 'EN_USO', 'MANTENIMIENTO'];

  formulario: FormGroup = this.fb.group({

    nombre: ['', Validators.required],

    tipo: ['', Validators.required],

    marca: [''],

    modelo: [''],

    numeroSerie: [''],

    fechaCompra: [''],

    estado: ['DISPONIBLE']

  });

  get disponibles(): number {
    return this.equipos.filter(e => e.estado === 'DISPONIBLE').length;
  }

  get enUso(): number {
    return this.equipos.filter(e => e.estado === 'EN_USO').length;
  }

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {

    this.cargando = true;

    this.equiposService.obtenerEquipos().subscribe({

      next: (respuesta: Equipo[]) => {

        this.equipos = respuesta;
        this.cargando = false;

      },

      error: (error: any) => {

        console.error(error);
        this.cargando = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudieron cargar los equipos.'
        });

      }

    });

  }

  nuevoEquipo(): void {

    this.editando = false;

    this.equipoId = null;

    this.formulario.reset({ estado: 'DISPONIBLE' });

    this.mostrarFormulario = true;

  }

  editarEquipo(equipo: Equipo): void {

    this.editando = true;

    this.equipoId = equipo.id ?? null;

    this.formulario.patchValue({
      ...equipo,
      fechaCompra: equipo.fechaCompra ? equipo.fechaCompra.substring(0, 10) : ''
    });

    this.mostrarFormulario = true;

  }

  guardarEquipo(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Revisa los campos obligatorios del formulario.'
      });

      return;

    }

    const datos: Equipo = this.formulario.value;

    if (this.editando && this.equipoId) {

      this.equiposService.actualizarEquipo(this.equipoId, datos).subscribe({

        next: () => {

          this.mostrarFormulario = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Equipo actualizado correctamente.'
          });

          this.cargarEquipos();

        },

        error: (error: any) => {

          console.error(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'No se pudo actualizar el equipo.'
          });

        }

      });

    } else {

      this.equiposService.crearEquipo(datos).subscribe({

        next: () => {

          this.mostrarFormulario = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Equipo creado correctamente.'
          });

          this.cargarEquipos();

        },

        error: (error: any) => {

          console.error(error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.error || 'No se pudo crear el equipo.'
          });

        }

      });

    }

  }

  eliminarEquipo(equipo: Equipo): void {

    if (!equipo.id) return;

    if (!confirm(`¿Eliminar el equipo "${equipo.nombre}"?`)) return;

    this.equiposService.eliminarEquipo(equipo.id).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Equipo eliminado correctamente.'
        });

        this.cargarEquipos();

      },

      error: (error: any) => {

        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.error || 'No se pudo eliminar el equipo.'
        });

      }

    });

  }

  cancelar(): void {

    this.mostrarFormulario = false;

    this.formulario.reset({ estado: 'DISPONIBLE' });

  }

}
