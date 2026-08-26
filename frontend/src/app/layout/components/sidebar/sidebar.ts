import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import {
  PermisoService,
  PermisosUsuario
} from '../../../core/services/permiso.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  private authService = inject(AuthService);

  private permisoService = inject(PermisoService);

  private cdr = inject(ChangeDetectorRef);


  // =====================================================
  // PERMISOS
  // =====================================================

  permisos: PermisosUsuario | null = null;

  cargandoPermisos = true;

  puedeVerProyectos = false;

  puedeVerLevantamientos = false;

  puedeVerEquipos = false;

  puedeVerReportes = false;


  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    this.cargarPermisos();

  }


  // =====================================================
  // CARGAR PERMISOS
  // =====================================================

  cargarPermisos(): void {

    const usuario =
      this.authService.usuarioActual();


    if (!usuario) {

      this.cargandoPermisos = false;

      return;
    }


    // =================================================
    // ADMIN → TODO VISIBLE
    // =================================================

    if (usuario.rol === 'ADMIN') {

      this.puedeVerProyectos = true;

      this.puedeVerLevantamientos = true;

      this.puedeVerEquipos = true;

      this.puedeVerReportes = true;

      this.cargandoPermisos = false;

      this.cdr.detectChanges();

      return;

    }


    // =================================================
    // USUARIO → SUS PERMISOS
    // =================================================

    this.permisoService
      .obtenerMisPermisos()
      .subscribe({

        next: (permisos) => {

          this.permisos = permisos;


          this.puedeVerProyectos =
            permisos.proyectosVer;


          this.puedeVerLevantamientos =
            permisos.levantamientosVer;


          this.puedeVerEquipos =
            permisos.equiposVer;


          this.puedeVerReportes =
            permisos.reportesVer;


          this.cargandoPermisos = false;


          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.error(
            'Error cargando permisos del sidebar:',
            error
          );


          this.puedeVerProyectos = false;

          this.puedeVerLevantamientos = false;

          this.puedeVerEquipos = false;

          this.puedeVerReportes = false;


          this.cargandoPermisos = false;


          this.cdr.detectChanges();

        }

      });

  }

}
