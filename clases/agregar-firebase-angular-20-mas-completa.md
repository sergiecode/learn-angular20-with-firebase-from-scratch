# Agregar Firebase a Angular 20 — Guía paso a paso (mejorada)

[⬅️ Regresar al índice](../README.md)

## 1) Instalar dependencias en el proyecto

Ejecutá en la raíz del proyecto:

```bash
npm install @angular/fire firebase
npm list @angular/fire firebase
```

`@angular/fire` es el paquete oficial que hace de puente entre Angular y el SDK modular de Firebase.

---

## 2) Crear el proyecto en Firebase

1. Abrí la consola: https://console.firebase.google.com/
2. Click en **Create a project**.
3. Poné un nombre para el proyecto y seguí los pasos del asistente.
4. Opcional: habilitar Google Analytics del proyecto si querés usar métricas (no es obligatorio para usar Auth/Firestore).

> Nota: evitá subir claves privadas a repositorios públicos. El objeto de configuración del cliente (apiKey, authDomain, etc.) no es secreto, pero las claves de servicio sí lo son.

---

## 3) Habilitar Authentication

1. En la consola > **Build** > **Authentication** > **Get started**.
2. En **Sign-in method** habilitá los proveedores que necesites:
   - **Google**: click en Google → enable. Es probable que te pida seleccionar un *support email* o confirmar el proyecto.
   - **Email/Password**: click en Email/Password → enable.
3. Guardá los cambios.

> Consejo: para Google Sign-In puede ser necesario completar la pantalla de consentimiento OAuth en Google Cloud si vas a usar usuarios reales fuera del entorno de pruebas.

---

## 4) Crear Firestore (base de datos)

1. En la consola > **Build** > **Firestore Database** > **Get started**.
2. Elegí el modo: **Start in production mode** o **Start in test mode**.
   - **Start in test mode**: abre la DB públicamente (lectura/escritura) temporalmente — útil para pruebas, pero **peligroso** en producción.
   - **Start in production mode**: aplica reglas más restrictivas por defecto (recomendado para producción).
3. Seleccioná la ubicación (puede dejarse la sugerida).

> Importante: si empezás en *test mode*, recordá cerrar ese acceso (modificar reglas) antes de lanzar la app públicamente.

---

## 5) Reglas recomendadas iniciales para Firestore

Un ejemplo seguro para empezar (solo usuarios autenticados pueden leer/escribir en colecciones específicas):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura a usuarios autenticados en la colección 'mensajes'
    match /mensajes/{messageId} {
      allow read, write: if request.auth != null;
    }

    // Ejemplo para una colección 'test'
    match /test/{testId} {
      allow read, write: if request.auth != null;
    }

    // Otras colecciones: por defecto denegar
  }
}
```

Adaptá estas reglas según la lógica de tu aplicación (por ejemplo, permitir que solo el propietario lea/escriba su documento usando `request.auth.uid == resource.data.ownerId`).

---

## 6) Obtener la configuración del app web (Firebase config)

1. En la consola > **Project settings** (ícono de engranaje) > **General**.
2. En *Your apps* agregá una nueva app web (</>), registrala y copiá el objeto de configuración que Firebase entrega, por ejemplo:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "G-..." // opcional
};
```

---

## 7) Guardar la config en los environments de Angular

Editá `src/environments/environment.ts` y `src/environments/environment.prod.ts` e incorporá la clave `firebase`:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '<API_KEY>',
    authDomain: '<AUTH_DOMAIN>',
    projectId: '<PROJECT_ID>',
    storageBucket: '<STORAGE_BUCKET>',
    messagingSenderId: '<MESSAGING_SENDER_ID>',
    appId: '<APP_ID>',
    measurementId: '<MEASUREMENT_ID>'
  }
};
```

---

## 8) Inicializar Firebase en Angular (app.module.ts o setup de providers)

Ejemplo usando el estilo modular recomendado por `@angular/fire`:

```ts
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [ /* tus componentes */ ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [/* AppComponent */]
})
export class AppModule {}
```

Si usás el estilo *standalone* de Angular 20 podés agregar estos providers en `main.ts` o donde declares los providers globales.

---

## 9) Servicio mínimo de autenticación (ejemplo)

```ts
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
```

---

## 10) Servicio mínimo para Firestore (ejemplo)

```ts
// src/app/services/mensajes.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class MensajesService {
  constructor(private firestore: Firestore) {}

  addMensaje(mensaje: any) {
    const mensajesRef = collection(this.firestore, 'mensajes');
    return addDoc(mensajesRef, { ...mensaje, createdAt: Date.now() });
  }

  getMensajes() {
    const mensajesRef = collection(this.firestore, 'mensajes');
    return collectionData(mensajesRef, { idField: 'id' });
  }
}
```

---

## 11) Ejecutar y verificar

1. Levantá la app Angular:

```bash
ng serve
```

2. Probá las funciones de login/registro desde la UI.
3. En la consola de Firebase verificá en **Authentication** y **Firestore** que las operaciones se registren.

---

## 12) Emuladores (opcional, recomendado para pruebas)

1. Instalá Firebase CLI y arrancá los emuladores:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

2. Configurá tu app para apuntar a los emuladores durante desarrollo si querés evitar tocar datos reales.

---

## 13) Deploy (hosting) — pasos rápidos

1. Hacé build de producción:

```bash
ng build --configuration production
```

2. Inicializá/seleccioná Hosting con Firebase CLI y desplegá:

```bash
firebase init hosting
firebase deploy --only hosting
```

---

## 14) Buenas prácticas y recomendaciones

- No dejes reglas abiertas en Firestore (test mode) en producción.
- Usá reglas específicas por colección y condicioná por `request.auth.uid` cuando corresponda.
- Mantén la configuración del cliente en `environments` y las credenciales sensibles fuera del repo.
- Para pruebas aisladas usá los emuladores de Firebase.
- Revisa límites y costos de Firestore (lecturas/escrituras) para no tener sorpresas.

---

## 15) Problemas comunes y soluciones rápidas

- **Error: No Firebase App '[DEFAULT]' has been created** — verificá que `provideFirebaseApp(() => initializeApp(environment.firebase))` esté importado.
- **Permisos denegados** — revisá las reglas de Firestore en la consola.
- **Google Sign-In no funciona** — comprobá la pantalla de consentimiento OAuth y dominios autorizados.

---

## Resumen rápido (checklist)

- [ ] Instalar `@angular/fire` y `firebase`.
- [ ] Crear proyecto en Firebase.
- [ ] Habilitar Authentication (Google y Email/Password).
- [ ] Crear Firestore y configurar reglas.
- [ ] Copiar Firebase config a `environments`.
- [ ] Inicializar AngularFire en `AppModule` o `main.ts`.
- [ ] Implementar servicios de Auth y Firestore.
- [ ] Probar en local y (opcional) con emuladores.
- [ ] Deploy si corresponde.