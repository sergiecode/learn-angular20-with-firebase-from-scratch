# Agregar Variables de Entorno en Angular 20

[⬅️ Regresar al índice](../README.md)

En esta clase agregaremos las variables de entorno en Angular 20. Para ello, crearemos la carpeta `environments` dentro de `src` con un archivo para desarrollo (`environment.ts`) y otro para producción (`environment.prod.ts`). En ambos incluiremos las API Keys e información sensible de Firebase y OpenAI.

## Estructura de archivos
Dentro de `src`:

```
src/
└── environments/
    ├── environment.ts        # Entorno de desarrollo
    └── environment.prod.ts   # Entorno de producción
```

## Template de environment

```typescript
/**
 * TEMPLATE - Configuración del entorno para desarrollo
 *
 * INSTRUCCIONES:
 * 1. Copia este archivo como 'environment.ts'
 * 2. Reemplaza los valores placeholder con tus claves reales
 * 3. NUNCA subas el archivo con claves reales a Git
 *
 * environment.ts
 * environment.prod.ts
 *
 * @autor Sergie Code - Tutorial Angular 20 + Firebase
 */

export const environment = {
  production: false,
  
  // Firebase Configuration - Obtener desde Firebase Console
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghijklmnop",
    measurementId: "G-XXXXXXXXXX"
  },
  
  // OpenAI Configuration - Obtener desde https://platform.openai.com/api-keys
  openai: {
    apiKey: "YOUR_OPENAI_API_KEY",
    apiUrl: "https://api.openai.com/v1/chat/completions"
  }
};
```

> ⚠️ **Importante:** Nunca subir estos archivos con claves reales a un repositorio público.

## Proteger archivos sensibles en Git

Agregar al `.gitignore` los siguientes archivos:

```
.env
environment.ts
environment.prod.ts
src/environments/environment.ts
src/environments/environment.prod.ts
```

De esta manera, nuestras claves de Firebase y OpenAI no quedarán expuestas.

