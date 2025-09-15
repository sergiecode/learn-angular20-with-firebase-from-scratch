# 🏗️ Clase 3: Estructura de Angular 20

[⬅️ Regresar al índice](../README.md)

## Explicar archivos

### 📁 Archivos de configuración de TypeScript

#### `tsconfig.json`
- **Configuración principal de TypeScript** para todo el proyecto.
- Define reglas de compilación, rutas de módulos y opciones del compilador.
- Es el archivo base que extienden los demás tsconfig.

#### `tsconfig.app.json`
- **Configuración específica para la aplicación** (código de producción).
- Extiende `tsconfig.json` y define qué archivos incluir/excluir.
- Se usa durante el build de la app.

#### `tsconfig.spec.json`
- **Configuración específica para tests**.
- Incluye configuraciones adicionales para testing (Jasmine, Jest, etc.).
- Define tipos especiales para testing.

### 📁 Archivos de configuración del proyecto

#### `angular.json`
- **Archivo maestro de configuración** del workspace Angular.
- Define proyectos, targets (build, serve, test), rutas y opciones.
- Configura el CLI de Angular para todos los comandos.

#### `package.json`
- **Manifiesto del proyecto Node.js**.
- Lista dependencias, scripts npm y metadatos del proyecto.
- Define comandos como `npm start`, `npm run build`, etc.

#### `package-lock.json`
- **Lockfile** que garantiza instalaciones consistentes.
- Especifica versiones exactas de todas las dependencias.
- **No modificar manualmente**.

### 📁 Archivos de desarrollo

#### `.gitignore`
- **Lista archivos/carpetas** que Git debe ignorar.
- Incluye `node_modules/`, `dist/`, archivos temporales, etc.
- Mantiene el repo limpio de archivos generados.

#### `.editorconfig`
- **Configuración del editor** para mantener consistencia.
- Define indentación, charset, saltos de línea, etc.
- Funciona con VS Code, WebStorm y otros editores.

### 📁 Carpeta .vscode/

#### `extensions.json`
- **Extensiones recomendadas** para el proyecto.
- Sugiere automáticamente extensiones útiles (Angular Language Service, etc.).
- Mejora la experiencia de desarrollo.

#### `launch.json`
- **Configuración de debugging** para VS Code.
- Define cómo ejecutar y debuggear la aplicación.
- Permite breakpoints y debugging en el navegador.

#### `tasks.json`
- **Tareas automatizadas** de VS Code.
- Define comandos personalizados (build, test, lint, etc.).
- Integra herramientas externas con el editor.

### 📁 Estructura de carpetas

#### `src/app/`
- **Corazón de la aplicación Angular**.
- Contiene componentes, servicios, pipes, guards, etc.
- Usa estructura flat (todos los archivos del componente juntos).

#### `public/`
- **Archivos estáticos** que se copian al build.
- Reemplaza la vieja carpeta `assets/`.
- Todo aquí se sirve directamente desde la raíz.

---

## 1. Cambiar el título de la app

En el archivo `index.html`:

```html
<title>Asistente con IA Angular + FireBase</title>
```

Esto reemplaza el título anterior `Angular20FirebaseChat`.

## 2. Cambiar el ícono de la app

En el mismo archivo `index.html`, reemplazar la referencia al ícono:

```html
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

Por un favicon que descargues desde [https://icons8.com/icons/set/robot](https://icons8.com/icons/set/robot).

Guardá el ícono como `favicon.ico` en la carpeta `public/` (más adelante explicamos esta carpeta).

## 3. Borrar styles.css

**Antes de borrarlo:** este archivo servía como hoja de estilos global (se cargaba en toda la app).

Hoy en Angular moderno podés manejar los estilos dentro de los standalone components o directamente usar tailwind / librerías CSS.

Por lo tanto, ya no es necesario mantener este `styles.css`. Se puede borrar.

## 4. Explicar carpeta public/

En Angular moderno, la carpeta `public/` reemplaza la vieja idea de `assets/`.

Todo lo que pongas en `public/` (por ejemplo imágenes, íconos, archivos estáticos) se copia tal cual a la carpeta de build `dist/`.

Esto evita configuraciones adicionales y es más directo para servir recursos.

**Por eso, tu favicon debería ir dentro de `public/`.**

## 5. Borrar app.spec.ts

Este archivo es un test unitario autogenerado por Angular CLI.

Si no vas a usar testing en este proyecto, lo podés borrar directamente.

## 6. Limpiar app.component.html

Dejarlo únicamente con:

```html
<router-outlet />
```

**Explicación:**

Antes, Angular generaba HTML, CSS y boilerplate en `app.component`.

Hoy en día, como la idea es usar router + standalone, no necesitás nada más que el `router-outlet` para renderizar los componentes de rutas.

Esto hace más fácil el mantenimiento porque podés empezar con un lienzo vacío.

## 7. Borrar propiedad innecesaria en AppComponent

Eliminar:

```typescript
protected readonly title = signal('angular20-firebase-chat');
```

Porque ya no se usa ni se muestra en el template.

## 8. Explicar main.ts

### En Angular clásico (antes de la v14):

```typescript
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

Esto levantaba un `AppModule` que contenía toda la configuración.

### En Angular 20 con Standalone Components:

```typescript
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

### Detalles:

- **`bootstrapApplication(App, appConfig)`**
  - Arranca directamente un componente standalone (`App`).
  - Usa `appConfig` para la configuración global (providers, router, etc.).

- **`.catch((err) => console.error(err))`**
  - Maneja posibles errores al iniciar la aplicación.

### Flujo de arranque completo:

1. El navegador carga `index.html` y encuentra `<app-root>`.
2. `main.ts` ejecuta `bootstrapApplication(App, appConfig)`.
3. Angular configura providers, router, error handling, change detection.
4. Renderiza el componente `App` en `<app-root>`.
5. Si algo falla, se muestra en consola.

## 9. Explicar app.config.ts

Este archivo reemplaza la lógica de configuración que antes estaba en `app.module.ts`.

Define un objeto `ApplicationConfig` con providers globales.

### Ejemplo de tu caso:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
```

### ¿Qué hacen estos providers?

#### `provideBrowserGlobalErrorListeners()`
- Captura y gestiona errores globales (incluyendo promesas rechazadas). 
- Mejora la robustez.

#### `provideZoneChangeDetection({ eventCoalescing: true })`
- Habilita la detección de cambios moderna sin Zone.js.
- `eventCoalescing: true` agrupa eventos y mejora rendimiento.

#### `provideRouter(routes)`
- Configura el Router de Angular sin necesidad de módulos.
- Usa rutas definidas en `app.routes.ts`.

---

✅ **Con esto, tu proyecto queda limpio, actualizado y preparado para Angular 20 con standalone components.**
