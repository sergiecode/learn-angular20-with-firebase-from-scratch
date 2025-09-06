# Clase 10: Configuración de Rutas en Angular 20 con Firebase y OpenAI API

[⬅️ Regresar al índice](../README.md)

En esta clase vamos a agregar el **sistema de rutas** a nuestro proyecto de Angular 20, que servirá como base para nuestro chat con Firebase y la API de OpenAI.

## Paso 1: Crear archivo de rutas
En la raíz del proyecto (o en la carpeta `app`), definimos el archivo `app.routes.ts` donde configuraremos las rutas principales de la aplicación.

```ts
import { Routes } from '@angular/router';

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
  },
  {
    path: '**',
    redirectTo: '/auth'
  }
];
```

## Paso 2: Explicación de las rutas
1. **Ruta vacía (`''`)** → Redirige automáticamente a `/auth`.
2. **Ruta `/auth`** → Carga el componente de autenticación (`Auth`) de manera lazy. Aquí los usuarios podrán iniciar sesión con Firebase.
3. **Ruta `/chat`** → Carga el componente principal del chat (`Chat`) de forma lazy. En el futuro la protegeremos con un **AuthGuard** para evitar accesos sin login.
4. **Ruta comodín (`'**'`)** → Cubre cualquier URL no definida y redirige a `/auth`.

## Paso 3: Probar las rutas
- Si vamos a `http://localhost:4200/` → nos redirige a `/auth`.
- Si vamos a `http://localhost:4200/auth` → veremos la pantalla de login.
- Si vamos a `http://localhost:4200/chat` → veremos el chat (aunque luego agregaremos la protección con **AuthGuard**).
- Si ingresamos cualquier ruta inexistente (por ejemplo `/xyz`) → nos devuelve a `/auth`.

Con esto ya tenemos un **sistema básico de rutas** funcionando que será clave para la experiencia del usuario en nuestro chat con Firebase y OpenAI.

