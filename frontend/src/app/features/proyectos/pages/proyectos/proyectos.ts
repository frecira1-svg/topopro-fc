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
import {
  ConfirmationService,
  MessageService
} from 'primeng/api';

import { ProyectoService } from '../../../../core/services/proyecto.service';
import {
  Proyecto,
  ProyectoRequest
} from '../../../../core/models/proyecto.model';

import { AuthService } from '../../../../core/services/auth.service';
import {
  PermisoService,
  PermisosUsuario
} from '../../../../core/services/permiso.service';

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
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})
export class Proyectos implements OnInit {

  proyectos = signal<Proyecto[]>([]);
  cargando = signal(false);

  dialogoVisible = signal(false);
  modoEdicion = signal(false);

  filtroTexto = '';

  proyectoActual: ProyectoRequest =
    this.formularioVacio();

  idEnEdicion: number | null = null;


  // =====================================================
  // PERMISOS
  // =====================================================

  permisos: PermisosUsuario | null = null;

  cargandoPermisos = signal(true);

  puedeVer = signal(false);
  puedeCrear = signal(false);
  puedeEditar = signal(false);
  puedeEliminar = signal(false);


  // =====================================================
  // ESTADOS
  // =====================================================

  opcionesEstado = [
    {
      label: 'En Progreso',
      value: 'EN_PROGRESO'
    },
    {
      label: 'Finalizado',
      value: 'FINALIZADO'
    },
    {
      label: 'Pausado',
      value: 'PAUSADO'
    },
    {
      label: 'Cancelado',
      value: 'CANCELADO'
    }
  ];


  constructor(
    private proyectoService: ProyectoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private permisoService: PermisoService
  ) {}


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    this.cargarPermisos();

  }


  // =====================================================
  // CARGAR PERMISOS DEL USUARIO ACTUAL
  // =====================================================

  cargarPermisos(): void {

    const usuario = this.authService.usuarioActual();

    if (!usuario) {

      this.cargandoPermisos.set(false);

      return;
    }


    // ---------------------------------------------------
    // ADMINISTRADOR = ACCESO TOTAL
    // ---------------------------------------------------

    if (usuario.rol === 'ADMIN') {

      this.puedeVer.set(true);
      this.puedeCrear.set(true);
      this.puedeEditar.set(true);
      this.puedeEliminar.set(true);

      this.cargandoPermisos.set(false);

      this.cargarProyectos();

      return;
    }


    // ---------------------------------------------------
    // USUARIO = CARGAR PERMISOS
    // ---------------------------------------------------

   this.permisoService
  .obtenerMisPermisos()
  .subscribe({

        next: (permisos) => {

          this.permisos = permisos;

          this.puedeVer.set(
            permisos.proyectosVer
          );

          this.puedeCrear.set(
            permisos.proyectosCrear
          );

          this.puedeEditar.set(
            permisos.proyectosEditar
          );

          this.puedeEliminar.set(
            permisos.proyectosEliminar
          );

          this.cargandoPermisos.set(false);


          // -------------------------------------------------
          // SOLO CARGAR SI TIENE PERMISO DE VER
          // -------------------------------------------------

          if (permisos.proyectosVer) {

            this.cargarProyectos();

          }

        },

        error: (error: any) => {

          this.cargandoPermisos.set(false);

          this.puedeVer.set(false);
          this.puedeCrear.set(false);
          this.puedeEditar.set(false);
          this.puedeEliminar.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error?.error?.error ||
              'No se pudieron cargar los permisos.'
          });

        }

      });

  }


  // =====================================================
  // CARGAR PROYECTOS
  // =====================================================

  cargarProyectos(): void {

    if (!this.puedeVer()) {
      return;
    }

    this.cargando.set(true);

    this.proyectoService
      .obtenerTodos()
      .subscribe({

        next: (data) => {

          this.proyectos.set(data);
          this.cargando.set(false);

        },

        error: (err) => {

          this.cargando.set(false);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error?.error ||
              'No se pudieron cargar los proyectos'
          });

        }

      });

  }


  // =====================================================
  // NUEVO PROYECTO
  // =====================================================

  abrirNuevo(): void {

    if (!this.puedeCrear()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso restringido',
        detail:
          'No tienes permiso para crear proyectos.'
      });

      return;
    }

    this.modoEdicion.set(false);
    this.proyectoActual = this.formularioVacio();
    this.idEnEdicion = null;

    this.dialogoVisible.set(true);

  }


  // =====================================================
  // EDITAR PROYECTO
  // =====================================================

  abrirEdicion(proyecto: Proyecto): void {

    if (!this.puedeEditar()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso restringido',
        detail:
          'No tienes permiso para editar proyectos.'
      });

      return;
    }

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


  // =====================================================
  // GUARDAR
  // =====================================================

  guardar(): void {

    // ---------------------------------------------------
    // VALIDAR SI ES EDICIÓN
    // ---------------------------------------------------

    if (
      this.modoEdicion() &&
      !this.puedeEditar()
    ) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso restringido',
        detail:
          'No tienes permiso para editar proyectos.'
      });

      return;
    }


    // ---------------------------------------------------
    // VALIDAR SI ES CREACIÓN
    // ---------------------------------------------------

    if (
      !this.modoEdicion() &&
      !this.puedeCrear()
    ) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso restringido',
        detail:
          'No tienes permiso para crear proyectos.'
      });

      return;
    }


    // ---------------------------------------------------
    // VALIDAR CAMPOS
    // ---------------------------------------------------

    if (
      !this.proyectoActual.nombre ||
      !this.proyectoActual.cliente ||
      !this.proyectoActual.ubicacion
    ) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail:
          'Completa los campos obligatorios'
      });

      return;
    }


    // ---------------------------------------------------
    // PETICIÓN
    // ---------------------------------------------------

    const peticion =
      this.modoEdicion() && this.idEnEdicion

        ? this.proyectoService.actualizar(
            this.idEnEdicion,
            this.proyectoActual
          )

        : this.proyectoService.crear(
            this.proyectoActual
          );


    peticion.subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail:
            this.modoEdicion()
              ? 'Proyecto actualizado'
              : 'Proyecto creado'
        });

        this.dialogoVisible.set(false);

        this.cargarProyectos();

      },

      error: (err) => {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            err.error?.error ||
            'No se pudo guardar el proyecto'
        });

      }

    });

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  confirmarEliminar(proyecto: Proyecto): void {

    if (!this.puedeEliminar()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso restringido',
        detail:
          'No tienes permiso para eliminar proyectos.'
      });

      return;
    }


    this.confirmationService.confirm({

      message:
        `¿Seguro que quieres eliminar "${proyecto.nombre}"?`,

      header:
        'Confirmar eliminación',

      icon:
        'pi pi-exclamation-triangle',

      accept:
        () => this.eliminar(proyecto.id)

    });

  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(id: number): void {

    if (!this.puedeEliminar()) {

      return;
    }

    this.proyectoService
      .eliminar(id)
      .subscribe({

        next: () => {

          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail:
              'Proyecto eliminado correctamente'
          });

          this.cargarProyectos();

        },

        error: (err) => {

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error?.error ||
              'No se pudo eliminar el proyecto'
          });

        }

      });

  }


  // =====================================================
  // VER PUNTOS
  // =====================================================

  verPuntos(proyecto: Proyecto): void {

    if (!this.puedeVer()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso restringido',
        detail:
          'No tienes permiso para consultar proyectos.'
      });

      return;
    }

    this.router.navigate([
      '/proyectos',
      proyecto.id,
      'puntos'
    ]);

  }


  // =====================================================
  // SEVERIDAD ESTADO
  // =====================================================

  severidadEstado(
    estado: string
  ): 'success' | 'info' | 'warn' | 'danger' {

    switch (estado) {

      case 'FINALIZADO':
        return 'success';

      case 'EN_PROGRESO':
        return 'info';

      case 'PAUSADO':
        return 'warn';

      case 'CANCELADO':
        return 'danger';

      default:
        return 'info';
    }

  }


  // =====================================================
  // FORMULARIO VACÍO
  // =====================================================

  private formularioVacio(): ProyectoRequest {

    return {
      nombre: '',
      descripcion: '',
      cliente: '',
      ubicacion: '',
      estado: 'EN_PROGRESO'
    };

  }

}
