# Clase 21: Desplegar en Firebase Hosting

#### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

#### 2. Autenticarse

```bash
firebase login
```

#### 3. Inicializar Firebase Hosting

```bash
# En el directorio raíz del proyecto
firebase init hosting

# Configuración recomendada:
# ❓ What do you want to use as your public directory? → dist/angular20-firebase-chat/browser
# ❓ Configure as a single-page app (rewrite all urls to /index.html)? → Yes
# ❓ Set up automatic builds and deploys with GitHub? → No (por ahora)
```

La configuración generará un archivo `firebase.json` que incluye:
- Directorio de salida para el build
- Reglas para ignorar archivos innecesarios
- Rewrites para el manejo de rutas en SPA
- Headers optimizados para CORS y cache

#### 4. Construir para Producción

```bash
# Construir la aplicación
npm run build

# O con configuración específica
ng build --configuration=production
```

#### 5. Configurar Seguridad de Firestore

**En Firebase Console → Firestore → Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura solo a usuarios autenticados
    match /mensajes/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Usuarios pueden leer/escribir solo sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 6. Desplegar

```bash
# Desplegar a Firebase Hosting
firebase deploy

# Si todo sale bien, verás:
# ✔ Deploy complete!
# Project Console: https://console.firebase.google.com/project/tu-proyecto
# Hosting URL: https://tu-proyecto.web.app
```

#### 7. Script de Deploy Automatizado

**Scripts disponibles en `package.json`:**
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "deploy": "ng build && firebase deploy",
    "deploy:quick": "firebase deploy --only hosting"
  }
}
```

**Uso:**
```bash
# Deploy completo (build + deploy)
npm run deploy

# Deploy rápido (solo archivos ya construidos)
npm run deploy:quick
```

**Nota importante**: En Angular 20, los archivos se generan en `dist/angular20-firebase-chat/browser`. El archivo `firebase.json` debe estar configurado así:

```json
{
  "hosting": {
    "public": "dist/angular20-firebase-chat/browser",
    ...
  }
  ...
}
```

#### 8. Configurar Dominios Autorizados

**En Firebase Console → Authentication → Settings:**

1. Ve a **"Authorized domains"**
2. Agrega tu dominio de producción: `tu-proyecto.web.app`
3. Si tienes dominio personalizado, agrégalo también

---

