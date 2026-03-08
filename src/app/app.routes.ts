import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'loggin',
    loadComponent: () => import('./pages/loggin/loggin.component'),
  },
  {
    path: 'mina',
    loadComponent: () => import('./pages/mina/mina.component'),
  },

   {
    path: 'resgistro_unidades',
    loadComponent: () => import('./pages/registro-unidades/registro-unidades.component'),

  },
  {
    path: 'usuario_receptor',
    loadComponent: () => import('./pages/usuario-receptor/usuario-receptor.component'),
  },
 {
    path: 'registro-usuarios', // 👈 nueva ruta para tu vista de usuarios
    loadComponent: () => import('./pages/registro-usuarios/registro-usuarios.component')
      .then(m => m.default),
  },
  {
    path: '**',
    redirectTo: () => {
      // const authService = inject(AuthService)

      return 'loggin';
    },
  },
];
