import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        title: 'Burgas Bus',
        pathMatch: 'full'
    },
    {
        path: 'home',
        title: "Burgas Bus",
        loadComponent: () => import('./features/home/home/home').then(c => c.Home)
    },
    {
        path: 'admin',
        title: "Admin",
        loadComponent: () => import('./features/admin/admin-panel/admin-panel').then(c => c.AdminPanel)
    },
];
