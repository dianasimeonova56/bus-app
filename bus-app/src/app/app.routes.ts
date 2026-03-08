import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';

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
        path: 'bus-stations',
        title: "Burgas Bus - South",
        loadComponent: () => import('./features/bus-stations/south-bus-station/south-bus-station').then(c => c.SouthBusStation)
    },
    {
        path: 'bus-stations/south',
        title: "Burgas Bus - South",
        loadComponent: () => import('./features/bus-stations/south-bus-station/south-bus-station').then(c => c.SouthBusStation)
    },
    {
        path: 'bus-stations/west',
        title: "Burgas Bus - West",
        loadComponent: () => import('./features/bus-stations/west-bus-station/west-bus-station').then(c => c.WestBusStation)
    },
    {
        path: 'admin',
        title: "Admin",
        loadComponent: () => import('./features/admin/admin-panel/admin-panel').then(c => c.AdminPanel),
        canActivate: [roleGuard, authGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'login',
        title: "Log In",
        loadComponent: () => import('./features/auth/login/login').then(c => c.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        title: "Register",
        loadComponent: () => import('./features/auth/register/register').then(c => c.Register),
        canActivate: [guestGuard]
    },
    {
        path: 'profile',
        title: "Profile",
        loadComponent: () => import('./features/profile/profile').then(c => c.Profile),
        canActivate: [roleGuard, authGuard],
        data: { roles: ['user'] }
    },
    {
        path: 'booking',
        title: "Резервиране на билет",
        loadComponent: () => import('./features/booking/booking').then(c => c.Booking),
        canActivate: [authGuard]
    },
    {
        path: 'booking/:tripId',
        title: "Резервиране на билет",
        loadComponent: () => import('./features/booking/booking').then(c => c.Booking),
        canActivate: [authGuard]
    },
];
