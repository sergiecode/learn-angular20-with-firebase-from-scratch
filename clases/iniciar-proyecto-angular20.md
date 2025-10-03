# 🚀 Clase 2: Iniciar Proyecto Angular 20

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
En esta clase crearemos nuestro proyecto base de **Angular 20** que servirá como fundación para integrar **Firebase** y la **API de Google Gemini** en nuestro chat inteligente.

---

## 📋 Requisitos Previos
- ✅ Tener instalado **Node.js** (versión LTS)
- ✅ Tener instalado **npm** 
- ✅ **VS Code** configurado con las extensiones de Angular

---

## 🛠️ Paso 1: Instalar Angular CLI

Primero, instalamos la versión más reciente del **Angular CLI** de forma global:

```bash
npm install -g @angular/cli@latest
```

### ✅ Verificar la instalación
```bash
ng version
```

---

## 🏗️ Paso 2: Crear el Proyecto

Ejecutamos el comando para crear nuestro nuevo proyecto:

```bash
ng new angular20-firebase-chat
```

### ⚙️ Configuración del Proyecto

Durante la creación, Angular CLI nos hará varias preguntas importantes:

#### 1. **Formato de Hojas de Estilo**
```
√ Which stylesheet format would you like to use? CSS
```
**✅ Respuesta recomendada:** `CSS`
- Para simplicidad en este tutorial
- Fácil de entender para principiantes

#### 2. **Server-Side Rendering (SSR)**
```
√ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? No
```
**✅ Respuesta recomendada:** `No`
- No necesario para nuestro chat en tiempo real
- Simplifica la configuración inicial

#### 3. **Aplicación Zoneless**
```
√ Do you want to create a 'zoneless' application without zone.js? No
```
**✅ Respuesta recomendada:** `No`
- Zone.js nos ayuda con la detección de cambios
- Recomendado para aplicaciones tradicionales

#### 4. **Herramientas de IA**
```
√ Which AI tools do you want to configure with Angular best practices? None
```
**✅ Respuesta recomendada:** `None`
- Configuraremos Google Gemini manualmente más adelante
- Mayor control sobre la implementación

---

## 📁 Paso 3: Navegar al Proyecto

Una vez creado el proyecto, navegamos a la carpeta:

```bash
cd angular20-firebase-chat
```

---

## 🗂️ Estructura del Proyecto Creado

Después de la creación, tendremos la siguiente estructura de Angular 20:

```
angular20-firebase-chat/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── app.ts              # Componente principal (standalone)
│   │   ├── app.html            # Template del componente principal
│   │   ├── app.css             # Estilos del componente principal
│   │   ├── app.config.ts       # Configuración de la aplicación
│   │   ├── app.routes.ts       # Configuración de rutas
│   │   └── app.spec.ts         # Tests del componente principal
│   ├── main.ts                 # Punto de entrada de la aplicación
│   ├── index.html              # HTML principal
│   └── styles.css              # Estilos globales
├── angular.json                # Configuración del workspace Angular
├── package.json                # Dependencias y scripts del proyecto
├── tsconfig.json               # Configuración base de TypeScript
├── tsconfig.app.json           # Configuración TypeScript para la app
└── tsconfig.spec.json          # Configuración TypeScript para tests
```

### 🆕 Novedades de Angular 20:
- **Componentes Standalone por defecto:** No más módulos tradicionales
- **Estructura simplificada:** Archivos separados por responsabilidad
- **Nueva carpeta `public/`:** Para archivos estáticos
- **Configuración moderna:** Con `app.config.ts` en lugar de `app.module.ts`

---

## 🧪 Paso 4: Verificar el Proyecto

Ejecutamos el servidor de desarrollo para verificar que todo funciona:

```bash
ng serve
```

### 🌐 Acceder a la aplicación
- **URL:** `http://localhost:4200`
- **Estado esperado:** Página de bienvenida de Angular funcionando

### 🛑 Detener el servidor
Presiona `Ctrl + C` en la terminal para detener el servidor.

---

## 📦 Dependencias Instaladas

El proyecto viene con las siguientes dependencias principales de Angular 20:

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `@angular/core` | ^20.2.0 | Core de Angular 20 |
| `@angular/common` | ^20.2.0 | Funcionalidades comunes |
| `@angular/router` | ^20.2.0 | Sistema de rutas |
| `@angular/forms` | ^20.2.0 | Manejo de formularios |
| `@angular/platform-browser` | ^20.2.0 | Soporte para navegadores |
| `typescript` | ~5.9.2 | Lenguaje de programación |
| `rxjs` | ~7.8.0 | Programación reactiva |
| `zone.js` | ~0.15.0 | Detección de cambios |

### 🛠️ Herramientas de Desarrollo:
| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `@angular/build` | ^20.2.2 | Sistema de build moderno |
| `@angular/cli` | ^20.2.2 | Herramientas de línea de comandos |
| `karma` | ~6.4.0 | Test runner |
| `jasmine-core` | ~5.9.0 | Framework de testing |
