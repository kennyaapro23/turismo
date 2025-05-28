import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // 🏠 Redirección por defecto
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // 🔐 Rutas públicas (login y registro)
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // 📦 Rutas protegidas bajo layout
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      // 🧭 Panel principal
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ADMIN', 'USUARIO', 'EMPRENDEDOR'] }, // ✅ sin ROLE_
      },

      // 🌱 Emprendimientos
      {
        path: 'emprendimientos',
        loadComponent: () =>
          import('./modules/emprendimientos/emprendimiento-list/emprendimiento-list.component')
            .then((m) => m.EmprendimientoListComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ADMIN', 'USUARIO', 'EMPRENDEDOR'] },
      },

      // 📆 Reservas - solo para USUARIO
      {
        path: 'reservas',
        loadComponent: () =>
          import('./modules/reservas/reserva-list/reserva-list.component')
            .then((m) => m.ReservaListComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['USUARIO'] },
      },
      {
        path: 'reservas/crear/:id',
        loadComponent: () =>
          import('./modules/reservas/reserva-form/reserva-form.component')
            .then((m) => m.ReservaFormComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['USUARIO'] },
      }
    ]
  },

  // 🚧 Ruta 404
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
