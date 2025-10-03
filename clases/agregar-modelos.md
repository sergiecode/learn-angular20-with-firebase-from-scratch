# 📊 Clase 14: Modelos de Datos para Angular 20 + Firebase + OpenAI Chat

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
En este proyecto utilizaremos dos modelos principales para estructurar la información: **Usuario** y **Chat**. Estos modelos servirán como contrato de datos para manejar usuarios autenticados mediante Firebase y los mensajes de chat integrados con la API de OpenAI.

---

### 1. Modelo de Usuario (`src/app/models/usuario.ts`)

El modelo `Usuario` define cómo representamos un usuario dentro de nuestra aplicación. Esta información proviene principalmente de Firebase Authentication y, en algunos casos, de Google Auth.

- **uid**: Identificador único generado por Firebase Auth.
- **email**: Correo electrónico asociado al usuario.
- **nombre** *(opcional)*: Nombre completo, generalmente obtenido de Google Auth.
- **fotoUrl** *(opcional)*: URL de la foto de perfil.
- **fechaCreacion**: Fecha de creación de la cuenta.
- **ultimaConexion**: Última vez que el usuario se conectó.

```typescript
export interface Usuario {
  uid: string;
  email: string;
  nombre?: string;
  fotoUrl?: string;
  fechaCreacion: Date;
  ultimaConexion: Date;
}
```

---

### 2. Modelo de Chat (`src/app/models/chat.ts`)

El modelo `Chat` se divide en dos partes: **MensajeChat** (estructura de cada mensaje) y **ConversacionChat** (agrupa todos los mensajes de una conversación).

#### 2.1. MensajeChat

Define cómo se estructura cada mensaje individual en el chat.

- **id** *(opcional)*: Identificador único del mensaje.
- **usuarioId**: ID del usuario que envió el mensaje.
- **contenido**: Texto del mensaje.
- **fechaEnvio**: Fecha y hora en que se envió.
- **tipo**: Puede ser `usuario` (mensaje enviado por el usuario) o `asistente` (respuesta generada por OpenAI).
- **estado** *(opcional)*: Estado del mensaje, útil para indicar si está enviándose, enviado, con error, etc.

```typescript
export interface MensajeChat {
  id?: string;
  usuarioId: string;
  contenido: string;
  fechaEnvio: Date;
  tipo: 'usuario' | 'asistente';
  estado?: 'enviando' | 'enviado' | 'error' | 'temporal';
}
```

#### 2.2. ConversacionChat

Representa la conversación completa de un usuario.

- **id** *(opcional)*: Identificador único de la conversación.
- **usuarioId**: Usuario propietario de la conversación.
- **mensajes**: Lista de todos los mensajes de la conversación.
- **fechaCreacion**: Fecha en que se creó la conversación.
- **ultimaActividad**: Última vez que se actualizó la conversación.
- **titulo** *(opcional)*: Nombre o resumen de la conversación.

```typescript
export interface ConversacionChat {
  id?: string;
  usuarioId: string;
  mensajes: MensajeChat[];
  fechaCreacion: Date;
  ultimaActividad: Date;
  titulo?: string;
}
```

