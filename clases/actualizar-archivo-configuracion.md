# ⚙️ Clase 15: Actualizar Archivo de Configuración

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
En este paso configuraremos la aplicación para inicializar los servicios principales: **routing, HTTP, Firebase Auth y Firestore**. Esta configuración se centraliza en un archivo que exporta el objeto `appConfig`, utilizado por Angular para registrar proveedores globales.

---

### Importaciones principales

1. **Angular Core**
   - `ApplicationConfig`: Interfaz usada para definir la configuración global de la aplicación.
   - `provideBrowserGlobalErrorListeners`: Registra listeners globales para capturar errores del navegador.
   - `provideZoneChangeDetection`: Configura la detección de cambios con optimizaciones (en este caso, `eventCoalescing: true`).

2. **Router y HTTP**
   - `provideRouter`: Registra las rutas definidas en `app.routes`.
   - `provideHttpClient`: Habilita el cliente HTTP para hacer solicitudes a APIs externas (ej. OpenAI).

3. **Firebase**
   - `initializeApp` y `provideFirebaseApp`: Inicializan la aplicación de Firebase con la configuración definida en `environment.firebaseConfig`.
   - `getAuth` y `provideAuth`: Configuran la autenticación de Firebase (manejo de usuarios, login, logout, etc.).
   - `getFirestore` y `provideFirestore`: Configuran la base de datos Firestore para guardar mensajes y conversaciones.

4. **Environment**
   - `environment`: Contiene las variables de entorno, incluyendo la configuración de Firebase (`firebaseConfig`).

---

### Objeto de configuración `appConfig`

Este objeto define todos los proveedores globales que estarán disponibles en la aplicación. Aquí se incluyen las configuraciones de Angular, el enrutador, el cliente HTTP y los servicios de Firebase.

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => {
      return initializeApp(environment.firebaseConfig);
    }),
    provideAuth(() => {
      return getAuth();
    }),
    provideFirestore(() => {
      return getFirestore();
    })
  ]
};
```

---

Con esta configuración lista, la aplicación ya cuenta con la base necesaria para implementar los **servicios de autenticación, almacenamiento en Firestore y llamadas a la API de OpenAI**.