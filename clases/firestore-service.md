## Clase 18 FirestoreService para Angular 20 con Firebase

Este documento explica cómo implementar un servicio de Firestore en un proyecto de Angular 20 para manejar un chat integrado con la API de OpenAI. El código se encuentra en `src\app\services\firestore.ts`.

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ConversacionChat, MensajeChat } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  async guardarMensaje(mensaje: MensajeChat): Promise<void> {
    try {
      if (!mensaje.usuarioId) {
        throw new Error('usuarioId es requerido');
      }
      if (!mensaje.contenido) {
        throw new Error('contenido es requerido');
      }
      if (!mensaje.tipo) {
        throw new Error('tipo es requerido');
      }
      
      const coleccionMensajes = collection(this.firestore, 'mensajes');
      
      const mensajeParaGuardar = {
        usuarioId: mensaje.usuarioId,
        contenido: mensaje.contenido,
        tipo: mensaje.tipo,
        estado: mensaje.estado || 'enviado',
        fechaEnvio: Timestamp.fromDate(mensaje.fechaEnvio)
      };
      
      const docRef = await addDoc(coleccionMensajes, mensajeParaGuardar);
      
    } catch (error: any) {
      console.error('❌ Error al guardar mensaje en Firestore:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  }

  obtenerMensajesUsuario(usuarioId: string): Observable<MensajeChat[]> {
    return new Observable(observer => {
      const consulta = query(
        collection(this.firestore, 'mensajes'),
        where('usuarioId', '==', usuarioId)
      );

      const unsubscribe = onSnapshot(
        consulta,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const mensajes: MensajeChat[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              usuarioId: data['usuarioId'],
              contenido: data['contenido'],
              tipo: data['tipo'],
              estado: data['estado'],
              fechaEnvio: data['fechaEnvio'].toDate()
            } as MensajeChat;
          });
          mensajes.sort((a, b) => a.fechaEnvio.getTime() - b.fechaEnvio.getTime());
          observer.next(mensajes);
        },
        error => {
          console.error('❌ Error al escuchar mensajes:', error);
          observer.error(error);
        }
      );

      return () => {
        unsubscribe();
      };
    });
  }

  async guardarConversacion(conversacion: ConversacionChat): Promise<void> {
    try {
      const coleccionConversaciones = collection(this.firestore, 'conversaciones');
      
      const conversacionParaGuardar = {
        ...conversacion,
        fechaCreacion: Timestamp.fromDate(conversacion.fechaCreacion),
        ultimaActividad: Timestamp.fromDate(conversacion.ultimaActividad),
        mensajes: conversacion.mensajes.map(mensaje => ({
          ...mensaje,
          fechaEnvio: Timestamp.fromDate(mensaje.fechaEnvio)
        }))
      };
      
      await addDoc(coleccionConversaciones, conversacionParaGuardar);
      
    } catch (error) {
      console.error('❌ Error al guardar conversación:', error);
      throw error;
    }
  }
}
```

### Explicación detallada del código

1. **Importaciones y dependencias**: Se importan los módulos necesarios de Angular y Firebase para interactuar con Firestore, así como las interfaces `ConversacionChat` y `MensajeChat` desde los modelos del proyecto.

2. **Inyección de Firestore**: Se utiliza `inject(Firestore)` para obtener una instancia de Firestore dentro del servicio.

3. **Método `guardarMensaje`**:
   - Valida que `usuarioId`, `contenido` y `tipo` estén presentes.
   - Convierte la fecha del mensaje a `Timestamp` de Firebase.
   - Guarda el mensaje en la colección `mensajes` de Firestore.
   - Maneja errores de manera detallada mostrando mensaje, código y stack.

4. **Método `obtenerMensajesUsuario`**:
   - Crea un `Observable` que permite suscribirse a los mensajes de un usuario en tiempo real.
   - Filtra los mensajes por `usuarioId` usando `where`.
   - Escucha cambios en tiempo real con `onSnapshot`.
   - Convierte los `Timestamp` de Firebase a `Date` para uso en Angular.
   - Ordena los mensajes por fecha de envío en el cliente.

5. **Método `guardarConversacion`**:
   - Convierte las fechas de la conversación y de cada mensaje a `Timestamp` de Firebase.
   - Guarda la conversación en la colección `conversaciones`.
   - Maneja errores de manera explícita.

Este servicio proporciona todas las funcionalidades necesarias para manejar chats de usuarios y conversaciones, manteniendo sincronización en tiempo real con Firestore y facilitando la integración con la API de OpenAI para respuestas automatizadas o asistencia en el chat.

## Actualización ChatService para usar FirestoreService real en lugar de mocks

Ahora que tenemos `FirestoreService` implementado, podemos reemplazar todas las instancias de `firestoreServiceMock` por el servicio real, importándolo y usando inyección de dependencias de Angular.

### Cambios necesarios

1. **Importar FirestoreService**
```typescript
import { FirestoreService } from './firestore';
```

2. **Reemplazar la declaración del mock por el servicio real**
```typescript
// Antes (comentado o mock)
// const firestoreServiceMock = { ... }

// Declaración real usando inyección
private firestoreService = inject(FirestoreService);
```

3. **Actualizar llamadas en `inicializarChat`**
```typescript
// Antes (usando mock)
firestoreServiceMock.obtenerMensajesUsuario(usuarioId).subscribe({ ... });

// Después (servicio real)
this.firestoreService.obtenerMensajesUsuario(usuarioId).subscribe({ ... });
```

4. **Actualizar llamadas en `enviarMensaje`**
```typescript
// Antes (usando mock)
await firestoreServiceMock.guardarMensaje(mensajeUsuario);
await firestoreServiceMock.guardarMensaje(mensajeAsistente);
await firestoreServiceMock.guardarMensaje(mensajeError);

// Después (servicio real)
await this.firestoreService.guardarMensaje(mensajeUsuario);
await this.firestoreService.guardarMensaje(mensajeAsistente);
await this.firestoreService.guardarMensaje(mensajeError);
```

Con estos cambios, `ChatService` dejará de depender de mocks y comenzará a interactuar directamente con Firestore, usando el `FirestoreService` que ya implementamos, manteniendo el resto del flujo de mensajes intacto.

