# Agregar Firebase a Angular 20 — Paso a Paso

Este paso a paso se enfoca únicamente en los puntos que me proporcionaste: instalación de paquetes, creación del proyecto en Firebase, configuración de autenticación y Firestore, y reglas de seguridad.

---

## 1) Instalar dependencias en Angular

```bash
npm install @angular/fire firebase
npm list @angular/fire firebase
```

---

## 2) Crear proyecto en Firebase

1. Ir a https://console.firebase.google.com/
2. Click en **Create a new project**.
3. Poner nombre del proyecto y continuar.
4. Permitir Gemini en Firebase si se solicita.
5. Permitir Google Analytics si se desea (opcional).
6. Dejar la cuenta por defecto y click en **Crear proyecto**.

---

## 3) Configurar Authentication

1. En Firebase Console > **Build** > **Authentication** > **Get started**.
2. Seleccionar **Google** → **Enable**.
   - Poner nombre del proyecto y mail/cuenta.
   - Guardar.
3. Seleccionar **Email/Password** → **Enable**.

---

## 4) Configurar Firestore Database

1. En Firebase Console > **Build** > **Firestore Database** > **Get Started**.
2. Seleccionar **Standard edition** y click **Next**.
3. Dejar Database ID y ubicación por defecto.
4. Empezar en **modo producción** (permite leer y escribir). Las reglas se pueden modificar después.

### Secciones importantes en Firestore:
- **Data**: información de la base.
- **Rules**: reglas de lectura/escritura.
- **Usage**: estadísticas de uso.

---

## 5) Reglas recomendadas iniciales

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura a usuarios autenticados en 'mensajes'
    match /mensajes/{messageId} {
      allow read, write: if request.auth != null;
    }

    // Permitir lectura/escritura a usuarios autenticados en 'test'
    match /test/{testId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

