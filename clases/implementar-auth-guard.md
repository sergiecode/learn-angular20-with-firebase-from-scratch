# 🛡️ Clase 20: Implementar AuthGuard en Angular 20 con Firebase

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Crear un guard que proteja las rutas de la aplicación, asegurando que solo usuarios autenticados puedan acceder a ciertas páginas.

**Ubicación del archivo:** `src\app\guards\auth-guard.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.estaAutenticado$.pipe(
      tap(estaAutenticado => {
        if (!estaAutenticado) {
          console.log('🚫 Acceso denegado - Usuario no autenticado');
          this.router.navigate(['/auth']);
        } else {
          console.log('✅ Acceso permitido - Usuario autenticado');
        }
      }),
      map(estaAutenticado => estaAutenticado)
    );
  }
}
```

### Explicación detallada:

1. **Decorador `@Injectable`**:
   - Marca la clase como inyectable y la registra en el nivel raíz (`providedIn: 'root'`), lo que permite que Angular gestione su ciclo de vida y que pueda ser utilizada en cualquier parte del proyecto.

2. **Inyecciones de dependencias con `inject`**:
   - `authService` inyecta el servicio de autenticación (`AuthService`) que maneja el estado de login del usuario.
   - `router` inyecta el enrutador de Angular (`Router`) para poder redirigir al usuario cuando sea necesario.

3. **Implementación de `CanActivate`**:
   - El método `canActivate` determina si una ruta puede ser activada o no según el estado de autenticación.

4. **Uso de Observables y operadores RxJS**:
   - `estaAutenticado$`: observable que emite `true` o `false` dependiendo de si el usuario está autenticado.
   - `tap`: ejecuta una acción secundaria, en este caso imprime en consola y redirige al login si el usuario no está autenticado.
   - `map`: transforma el valor del observable para retornar exactamente `true` o `false`, que es lo que espera Angular para permitir o denegar el acceso a la ruta.

5. **Redirección condicional**:
   - Si el usuario no está autenticado, se imprime un mensaje en consola y se redirige automáticamente a la ruta `/auth`.
   - Si está autenticado, se imprime un mensaje de acceso permitido y la navegación continúa normalmente.

Este guard es esencial para proteger rutas en la aplicación de chat, asegurando que solo los usuarios autenticados puedan acceder a ciertas secciones, como el chat con OpenAI API.


### Configuración de rutas con AuthGuard en Angular 20 con Firebase

**Ubicación del archivo:** `src\app\app.routes.ts`

```typescript
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
```

### Explicación detallada:

1. **Importación de `Routes` y `AuthGuard`**:
   - `Routes` es la estructura que Angular utiliza para definir el enrutamiento de la aplicación.
   - `AuthGuard` es el guard que creamos previamente para proteger rutas según el estado de autenticación.

2. **Ruta raíz (`''`)**:
   - Redirige automáticamente al usuario a `/auth` cuando accede a la ruta base.
   - `pathMatch: 'full'` asegura que la coincidencia se haga exactamente con la ruta vacía.

3. **Ruta `/auth`**:
   - Carga de manera lazy el componente de autenticación (`Auth`) solo cuando se accede a esta ruta.
   - `title` define el título que se mostrará en el navegador.

4. **Ruta `/chat`**:
   - Carga de manera lazy el componente de chat (`Chat`) al acceder.
   - `title` define el título de la página de chat.
   - `canActivate: [AuthGuard]` protege la ruta, asegurando que solo usuarios autenticados puedan acceder. Si no se está autenticado, el guard redirige al login.

5. **Ruta comodín (`'**'`)**:
   - Captura cualquier ruta no definida y redirige al login (`/auth`).

**Resumen:**
Gracias a la implementación del `AuthGuard`, se puede descomentar la línea `canActivate: [AuthGuard]` en la ruta `/chat` para protegerla. Esto garantiza que solo los usuarios autenticados tengan acceso al chat con OpenAI API, evitando accesos no autorizados.

