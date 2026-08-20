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

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

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

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
  path: 'proyectos',
  component: Proyectos,
  canActivate: [authGuard]
},

{
  path: 'clientes',
  component: Clientes,
  canActivate: [authGuard]
},

{
  path: 'perfil',
  component: Perfil,
  canActivate: [authGuard]
},

{
  path: 'proyectos/:id/puntos',
  component: Puntos,
  canActivate: [authGuard]
},

{
    path: 'levantamientos',
    component: Levantamientos,
    canActivate: [authGuard]
  },

{
  path: 'publicaciones',
  component: Publicaciones,
  canActivate: [authGuard]
},

{
    path: 'equipos',
    component: Equipos,
    canActivate: [authGuard]
  },

  {
    path: 'mapas',
    component: Mapas,
    canActivate: [authGuard]
  },

  {
  path: 'reportes',
  component: Reportes,
  canActivate: [authGuard]
},

{
  path: 'configuracion',
  component: Configuracion,
  canActivate: [authGuard]
},

  {
    path: '**',
    redirectTo: 'login'
  }

];
