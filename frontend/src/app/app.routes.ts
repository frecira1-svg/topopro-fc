import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { CorreoVerificado } from './features/auth/pages/correo-verificado/correo-verificado';
import { Registro } from './features/auth/pages/registro/registro';

import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { Proyectos } from './features/proyectos/pages/proyectos/proyectos';
import { Clientes } from './features/clientes/pages/clientes/clientes';
import { Perfil } from './features/perfil/pages/perfil/perfil';
import { Puntos } from './features/puntos/pages/puntos/puntos';
import { Levantamientos } from './features/levantamientos/pages/levantamientos/levantamientos';
import { Mapas } from './features/mapas/pages/mapas/mapas';
import { Equipos } from './features/equipos/pages/equipos/equipos';
import { Publicaciones } from './features/publicaciones/pages/publicaciones/publicaciones';
import { Reportes } from './features/reportes/pages/reportes/reportes';
import { Configuracion } from './features/configuracion/pages/configuracion/configuracion';

import { authGuard } from './core/guards/auth.guard';
import { permisoGuard } from './core/guards/permiso.guard';


export const routes: Routes = [

  // =====================================================
  // RUTA PRINCIPAL
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =====================================================
  // AUTENTICACIÓN
  // =====================================================

  {
    path: 'login',
    component: Login
  },

  {
    path: 'registro',
    component: Registro
  },

  {
    path: 'correo-verificado',
    component: CorreoVerificado
  },


  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [
      authGuard
    ]
  },


  // =====================================================
  // PROYECTOS
  // =====================================================

  {
    path: 'proyectos',
    component: Proyectos,
    canActivate: [
      authGuard,
      permisoGuard('proyectosVer')
    ]
  },


  // =====================================================
  // PUNTOS DE UN PROYECTO
  // =====================================================

  {
    path: 'proyectos/:id/puntos',
    component: Puntos,
    canActivate: [
      authGuard,
      permisoGuard('proyectosVer')
    ]
  },


  // =====================================================
  // CLIENTES
  // =====================================================

  {
    path: 'clientes',
    component: Clientes,
    canActivate: [
      authGuard
    ]
  },


  // =====================================================
  // PERFIL
  // =====================================================

  {
    path: 'perfil',
    component: Perfil,
    canActivate: [
      authGuard
    ]
  },


  // =====================================================
  // LEVANTAMIENTOS
  // =====================================================

  {
    path: 'levantamientos',
    component: Levantamientos,
    canActivate: [
      authGuard,
      permisoGuard('levantamientosVer')
    ]
  },


  // =====================================================
  // EQUIPOS
  // =====================================================

  {
    path: 'equipos',
    component: Equipos,
    canActivate: [
      authGuard,
      permisoGuard('equiposVer')
    ]
  },


  // =====================================================
  // MAPAS
  // =====================================================

  {
    path: 'mapas',
    component: Mapas,
    canActivate: [
      authGuard
    ]
  },


  // =====================================================
  // PUBLICACIONES
  // =====================================================

  {
    path: 'publicaciones',
    component: Publicaciones,
    canActivate: [
      authGuard
    ]
  },


  // =====================================================
  // REPORTES
  // =====================================================

  {
    path: 'reportes',
    component: Reportes,
    canActivate: [
      authGuard,
      permisoGuard('reportesVer')
    ]
  },


  // =====================================================
  // CONFIGURACIÓN
  // =====================================================

  {
    path: 'configuracion',
    component: Configuracion,
    canActivate: [
      authGuard
    ]
  },


  // =====================================================
  // RUTA NO ENCONTRADA
  // =====================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];
