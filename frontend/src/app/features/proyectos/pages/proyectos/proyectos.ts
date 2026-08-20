import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ProyectoService } from '../../../../core/services/proyecto.service';
import { Proyecto, ProyectoRequest } from '../../../../core/models/proyecto.model';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})
export class Proyectos implements OnInit {
  proyectos = signal<Proyecto[]>([]);
  cargando = signal(false);
  dialogoVisible = signal(false);
  modoEdicion = signal(false);
  filtroTexto = '';

  proyectoActual: ProyectoRequest = this.formularioVacio();
  idEnEdicion: number | null = null;

  opcionesEstado = [
    { label: 'En Progreso', value: 'EN_PROGRESO' },
    { label: 'Finalizado', value: 'FINALIZADO' },
    { label: 'Pausado', value: 'PAUSADO' },
    { label: 'Cancelado', value: 'CANCELADO' }
  ];

  constructor(
    private proyectoService: ProyectoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.cargando.set(true);
    this.proyectoService.obtenerTodos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
        this.cargando.set(false);
      },
              error: (err) => {
        this.cargando.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.error || 'No se pudieron cargar los proyectos' });
      }
    });
  }

  abrirNuevo(): void {
    this.modoEdicion.set(false);
    this.proyectoActual = this.formularioVacio();
    this.idEnEdicion = null;
    this.dialogoVisible.set(true);
  }

  abrirEdicion(proyecto: Proyecto): void {
    this.modoEdicion.set(true);
    this.idEnEdicion = proyecto.id;
    this.proyectoActual = {
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      cliente: proyecto.cliente,
      ubicacion: proyecto.ubicacion,
      estado: proyecto.estado
    };
    this.dialogoVisible.set(true);
  }

  guardar(): void {
    if (!this.proyectoActual.nombre || !this.proyectoActual.cliente || !this.proyectoActual.ubicacion) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Completa los campos obligatorios' });
      return;
    }

    const peticion = this.modoEdicion() && this.idEnEdicion
      ? this.proyectoService.actualizar(this.idEnEdicion, this.proyectoActual)
      : this.proyectoService.crear(this.proyectoActual);

    peticion.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.modoEdicion() ? 'Proyecto actualizado' : 'Proyecto creado' });
        this.dialogoVisible.set(false);
        this.cargarProyectos();
      },
           error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.error || 'No se pudo guardar el proyecto' });
      }
    });
  }

  confirmarEliminar(proyecto: Proyecto): void {
    this.confirmationService.confirm({
      message: `¿Seguro que quieres eliminar "${proyecto.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminar(proyecto.id)
    });
  }

  eliminar(id: number): void {
    this.proyectoService.eliminar(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Proyecto eliminado correctamente' });
        this.cargarProyectos();
      },
           error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.error || 'No se pudo eliminar el proyecto' });
      }
    });
  }

  verPuntos(proyecto: Proyecto): void {
    this.router.navigate(['/proyectos', proyecto.id, 'puntos']);
  }

  severidadEstado(estado: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (estado) {
      case 'FINALIZADO': return 'success';
      case 'EN_PROGRESO': return 'info';
      case 'PAUSADO': return 'warn';
      case 'CANCELADO': return 'danger';
      default: return 'info';
    }
  }

  private formularioVacio(): ProyectoRequest {
    return { nombre: '', descripcion: '', cliente: '', ubicacion: '', estado: 'EN_PROGRESO' };
  }
}
