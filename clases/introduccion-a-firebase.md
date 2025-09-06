# 🔥 Clase 5: Introducción a Firebase

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Introducción a Firebase

### Primeros Pasos

**Paso 1:** Visitar [https://firebase.google.com/](https://firebase.google.com/)

**Paso 2:** Se puede cambiar el idioma a Español Latinoamérica

**Paso 3:** Registrarse con Google

**Paso 4:** Explicación Firebase

---

## Panorama General de Firebase

Hoy, Firebase continúa consolidándose como una plataforma integral de desarrollo móvil y web, especialmente potenciada por su fuerte integración con las tecnologías de Google Cloud e inteligencia artificial.

Firebase es una plataforma propiedad de Google que ofrece una amplia variedad de servicios para desarrollar, desplegar y escalar aplicaciones móviles y web sin necesidad de gestionar infraestructura de backend compleja.

### Productos Principales

#### 🔧 Servicios para Construir
- Authentication
- Realtime Database
- Firestore
- Hosting
- Cloud Functions
- Cloud Storage
- App Check
- AI Logic
- ML
- Genkit
- Extensions

#### 🚀 Herramientas para Ejecutar
- Cloud Messaging
- Crashlytics
- Google Analytics
- A/B Testing
- Remote Config
- Performance Monitoring
- Test Lab
- App Distribution
- In-App Messaging

---

## Novedades Recientes (2025)

### Firebase Studio y la Integración con IA

**Firebase Studio** es un entorno de desarrollo online (basado en Visual Studio Code) potenciado por IA, que permite crear aplicaciones completas (front-end, back-end, APIs, móviles) directamente desde el navegador.

- Se encuentra en Preview, sin SLA garantizado
- Su infraestructura funciona sobre Google Cloud
- Incluye un asistente de inteligencia artificial incorporado

#### Mejoras Anunciadas en Google I/O Connect India 2025:

- **Plantillas optimizadas por IA** para frameworks como Angular, Flutter, React, Next.js
- **Importación desde Figma** usando el plugin de Builder.io
- **Forks de workspaces** para experimentar sin arriesgar tu proyecto principal
- **"Enhance prompts"** y aumento del tamaño máximo de carga de proyectos a 100 MB

### Firebase AI Logic

Es la evolución de Vertex AI dentro de Firebase, presentada en Cloud Next 2025, y facilita la integración de modelos generativos dentro de tus aplicaciones.

---

## Angular + Autenticación, Base de Datos y Hosting

### 🔐 Autenticación (Firebase Authentication)

Permite agregar identidad de usuario con SDKs sencillos y UI lista para usar (FirebaseUI).

#### Métodos de Autenticación Soportados:
- Email/password
- Número de teléfono
- Federados (Google, Facebook, Apple, Twitter, GitHub)
- Autenticación anónima
- Sistemas personalizados

#### Funciones Avanzadas con Identity Platform:
- Autenticación multifactor
- Bloqueo con funciones
- SAML/OpenID
- Auditoría de actividad
- Multi-tenancy
- Borrado automático de cuentas anónimas
- Soporte empresarial y SLA

> **Nota:** La autenticación no utiliza Firestore ni Realtime Database internamente, solo se vincula con estos a través de las reglas de seguridad para controlar acceso a datos.

### 🗄️ Base de Datos

#### Realtime Database
- Base de datos JSON en tiempo real
- Ideal para sincronización instantánea entre múltiples clientes
- Cache local offline: si el usuario pierde conexión, los datos se sincronizan una vez vuelve la conexión

#### Cloud Firestore
- Base de datos NoSQL moderna
- Organizada por documentos y colecciones
- Consultas más flexibles, escalable y eficiente

Ambas se integran de forma nativa con Firebase Authentication mediante reglas de seguridad basadas en `auth != null` u otras condiciones por usuario.

### 🌐 Hosting (Firebase Hosting)

Servicio de hosting seguro y rápido para proyectos web/SPA con las siguientes características:

- **Despliegue sencillo** vía CLI
- **Distribución por CDN global**
- **SSL automático**
- **Compresión automática** (gzip/Brotli)
- **Emulación local** del entorno
- **Previews compartibles** con equipo
- **Integración con GitHub** para despliegue continuo
- **Rollback** con un solo clic

> **Nota:** Aunque está optimizado para contenido estático, se puede combinar con Cloud Functions o Cloud Run para contenido dinámico.

---

## Consola de Firebase: Visión General

Cuando ingresas a la consola, tienes un panel principal que te da dos caminos iniciales:

### 1. Crear un Nuevo Proyecto

Esto significa iniciar un proyecto desde cero:
- Darle un nombre
- Asociarlo a tu cuenta de Google Cloud
- Habilitar los productos de Firebase que quieras usar (Auth, Firestore, Hosting, etc.)

*Lo dejamos de lado por ahora porque lo verás en otra clase.*

### 2. Start Coding an App

Esta opción está relacionada con **Firebase Studio**, la nueva experiencia de desarrollo integrada.

- Te permite arrancar directamente desde una plantilla para un framework web o móvil
- Al elegir una plantilla, se crea un workspace en la nube
- El código base del framework ya viene configurado y conectado con Firebase
- Todo se puede editar en el navegador, sin necesidad de instalar nada localmente
- Puedes desplegar directamente desde ahí

#### ¿Qué Ofrece "Start Coding an App"?

##### 📋 Plantillas Listas para Usar
- **Web:** Angular, React, Svelte, Vue, Next.js, etc.
- **Móvil:** Flutter, Android, iOS
- **Backend:** Cloud Functions, APIs
- **AI & ML:** Plantillas especializadas

##### 🔗 Integración Automática con Firebase
Cada plantilla viene con:
- Dependencias y configuración inicial de Firebase ya preparada
- Conexión a la base de datos
- Autenticación
- Hosting
- Reglas de seguridad

##### 💻 Entorno Online de Desarrollo
- Como tener un VS Code en la nube
- Herramientas de IA que te ayudan a generar componentes
- Configurar reglas
- Escribir código repetitivo

##### 🤖 Explorar Ejemplos de Apps con IA
- **Agentic Barista App:** Usa Firestore, autenticación y AI Logic
- **Trip Planner App:** App de planificación con IA multimodal

Estos ejemplos te permiten ver cómo se usan en conjunto las distintas piezas de Firebase.

##### 🚀 Despliegue Directo desde el Workspace
- Publicar en Firebase Hosting desde el mismo editor
- Probar localmente con el emulador

