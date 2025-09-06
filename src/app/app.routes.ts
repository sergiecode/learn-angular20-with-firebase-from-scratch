import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/auth', 
    pathMatch: 'full' 
  },
  { 
    path: 'auth', 
    loadComponent: () => import('./components/auth/auth').then(m => m.Auth),
    title: 'Iniciar Sesión - Chat Asistente'
  },
  { 
    path: 'chat', 
    loadComponent: () => import('./components/chat/chat').then(m => m.Chat),
    title: 'Chat - Asistente Virtual',
    canActivate: [AuthGuard] // 🛡️ Ruta protegida con Auth Guard
  },
  { 
    path: '**', 
    redirectTo: '/auth' 
  }
];