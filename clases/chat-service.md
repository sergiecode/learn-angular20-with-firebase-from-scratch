# 💬 Clase 17: ChatService para Angular 20 con Firebase y Google Gemini

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Este archivo define el servicio `ChatService` para manejar la lógica del chat dentro de un proyecto Angular 20 que utiliza Firebase y la API de Google Gemini.

```typescript
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { MensajeChat } from '../models/chat';
import { AuthService } from './auth';

// TODO: Reemplazar estos mocks cuando tengamos los servicios reales implementados
const firestoreServiceMock = {
  obtenerMensajesUsuario: (usuarioId: string) => of([]),
  guardarMensaje: async (mensaje: MensajeChat) => Promise.resolve()
};

// Mock temporal de GeminiService - Se reemplazará por el servicio real
const geminiServiceMock = {
  convertirHistorialAGemini: (historial: MensajeChat[]) => {
    // Simulamos la conversión del historial al formato de Gemini
    return historial.map(msg => ({
      role: msg.tipo === 'usuario' ? 'user' : 'model',
      parts: [{ text: msg.contenido }]
    }));
  },
  enviarMensaje: async (contenido: string, historial: any) => {
    // Simulamos una respuesta de Gemini con un delay realista
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Respuesta simulada de Gemini para: "${contenido}". En la implementación real, aquí se conectará con la API de Google Gemini.`;
  }
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private authService = inject(AuthService);
  
  private mensajesSubject = new BehaviorSubject<MensajeChat[]>([]);
  public mensajes$ = this.mensajesSubject.asObservable();
  
  private cargandoHistorial = false;
  
  private asistenteRespondiendo = new BehaviorSubject<boolean>(false);
  public asistenteRespondiendo$ = this.asistenteRespondiendo.asObservable();

  async inicializarChat(usuarioId: string): Promise<void> {
    if (this.cargandoHistorial) {
      return;
    }
    
    this.cargandoHistorial = true;
    
    try {
      firestoreServiceMock.obtenerMensajesUsuario(usuarioId).subscribe({
        next: (mensajes) => {
          this.mensajesSubject.next(mensajes);
          this.cargandoHistorial = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar historial:', error);
          this.cargandoHistorial = false;
          this.mensajesSubject.next([]);
        }
      });
      
    } catch (error) {
      console.error('❌ Error al inicializar chat:', error);
      this.cargandoHistorial = false;
      this.mensajesSubject.next([]);
    }
  }

  async enviarMensaje(contenidoMensaje: string): Promise<void> {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    
    if (!usuarioActual) {
      console.error('❌ No hay usuario autenticado');
      throw new Error('Usuario no autenticado');
    }
    
    if (!contenidoMensaje.trim()) {
      return;
    }
    
    const mensajeUsuario: MensajeChat = {
      usuarioId: usuarioActual.uid,
      contenido: contenidoMensaje.trim(),
      fechaEnvio: new Date(),
      tipo: 'usuario',
      estado: 'enviando'
    };
    
    try {
      const mensajesDelUsuario = this.mensajesSubject.value;
      const nuevosMatches = [...mensajesDelUsuario, mensajeUsuario];
      this.mensajesSubject.next(nuevosMatches);
      
      try {
        await firestoreServiceMock.guardarMensaje(mensajeUsuario);
      } catch (firestoreError) {}
      
      this.asistenteRespondiendo.next(true);
      const mensajesActuales = this.mensajesSubject.value;
      
      // Convertimos el historial para Gemini (últimos 6 mensajes para optimizar tokens)
      const historialParaGemini = geminiServiceMock.convertirHistorialAGemini(mensajesActuales.slice(-6));
      
      // Enviamos el mensaje a Gemini y esperamos la respuesta
      const respuestaAsistente = await geminiServiceMock.enviarMensaje(contenidoMensaje, historialParaGemini);
      
      const mensajeAsistente: MensajeChat = {
        usuarioId: usuarioActual.uid,
        contenido: respuestaAsistente,
        fechaEnvio: new Date(),
        tipo: 'asistente',
        estado: 'enviado'
      };
      
      const mensajesActualizados = this.mensajesSubject.value;
      const nuevosMatches2 = [...mensajesActualizados, mensajeAsistente];
      this.mensajesSubject.next(nuevosMatches2);
      
      try {
        await firestoreServiceMock.guardarMensaje(mensajeAsistente);
      } catch (firestoreError) {}
      
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error);
      const mensajeError: MensajeChat = {
        usuarioId: usuarioActual.uid,
        contenido: 'Lo siento, hubo un problema al procesar tu mensaje. Por favor intenta de nuevo.',
        fechaEnvio: new Date(),
        tipo: 'asistente',
        estado: 'error'
      };
      
      try {
        await firestoreServiceMock.guardarMensaje(mensajeError);
      } catch (saveErrorError) {
        console.error('❌ Error al guardar mensaje de error:', saveErrorError);
        const mensajesActuales = this.mensajesSubject.value;
        this.mensajesSubject.next([...mensajesActuales, mensajeError]);
      }
      
      throw error;
      
    } finally {
      this.asistenteRespondiendo.next(false);
    }
  }

  obtenerMensajes(): MensajeChat[] {
    return this.mensajesSubject.value;
  }

  limpiarChat(): void {
    this.mensajesSubject.next([]);
  }

  chatListo(): boolean {
    const usuarioAutenticado = !!this.authService.obtenerUsuarioActual();
    // TODO: Cuando implementemos GeminiService real, reemplazar por:
    // const geminiConfigurado = this.geminiService.verificarConfiguracion();
    const geminiConfigurado = true; // Simulado como verdadero para testing
    
    return usuarioAutenticado && geminiConfigurado;
  }
}
```

## Explicación detallada de la implementación

- **Imports y dependencias:** Se importan `BehaviorSubject` y `rxjs` para manejar streams reactivos, así como los modelos y servicios necesarios.
- **Mocks:** Se incluyen servicios simulados (`firestoreServiceMock` y `geminiServiceMock`) para permitir desarrollo y pruebas sin conexión a Firestore o Google Gemini. El mock de Gemini incluye una simulación más realista del formato de datos que esperará la API real.
- **`mensajesSubject` y `mensajes$`:** `BehaviorSubject` mantiene el estado de los mensajes del chat y permite a los componentes suscribirse a cambios.
- **`asistenteRespondiendo$`:** Observable que indica si el asistente está generando una respuesta.
- **`inicializarChat`:** Obtiene el historial de mensajes del usuario desde Firestore y actualiza el BehaviorSubject. Se asegura de no cargar historial duplicado si ya está en proceso.
- **`enviarMensaje`:** Maneja el flujo completo de enviar un mensaje:
  1. Valida el usuario autenticado y el contenido del mensaje.
  2. Crea un mensaje de usuario y lo muestra inmediatamente.
  3. Guarda el mensaje en Firestore (en segundo plano).
  4. Marca al asistente como respondiendo.
  5. Convierte el historial al formato que esperará Gemini (estructura de roles user/model y parts).
  6. Envía el mensaje al mock de Gemini y recibe la respuesta simulada.
  7. Maneja errores y asegura que el estado de `asistenteRespondiendo` se actualice correctamente.
- **`obtenerMensajes`:** Devuelve los mensajes actuales.
- **`limpiarChat`:** Vacía el chat.
- **`chatListo`:** Verifica que el usuario esté autenticado y que Gemini esté configurado. Por ahora simula que Gemini siempre está configurado, pero incluye un TODO para la implementación real.

# Integración de ChatService en el componente Chat

Ahora que tenemos `ChatService` con mocks funcionales, podemos descomentar las siguientes líneas en el componente `src\app\components\chat\chat.ts` para que el chat funcione correctamente con simulación de Gemini:

```typescript
// 1. Inicializamos el chat con el usuario actual
await this.chatService.inicializarChat(this.usuario.uid);

// 2. Nos suscribimos a los mensajes para actualizar la UI automáticamente
const subMensajes = this.chatService.mensajes$.subscribe(mensajes => {
  this.mensajes = mensajes;
  this.debeHacerScroll = true;
});

// 3. Nos suscribimos al estado del asistente para mostrar cuando está escribiendo
const subAsistente = this.chatService.asistenteRespondiendo$.subscribe(respondiendo => {
  this.asistenteEscribiendo = respondiendo;
  if (respondiendo) {
    this.debeHacerScroll = true;
  }
});
this.suscripciones.push(subMensajes, subAsistente);

// 4. Enviamos un mensaje usando el servicio de chat (por ahora con mock de Gemini)
await this.chatService.enviarMensaje(texto);

// 5. Limpiamos el chat local
this.chatService.limpiarChat();
```

## Próximos pasos para la implementación real

Una vez que tengamos el servicio `GeminiService` real implementado, deberemos:

1. **Reemplazar el mock de GeminiService:**
```typescript
// Eliminar geminiServiceMock
// import { GeminiService } from './gemini';
// private geminiService = inject(GeminiService);
```

2. **Actualizar la conversión de historial y envío de mensajes:**
```typescript
// Reemplazar:
// const historialParaGemini = geminiServiceMock.convertirHistorialAGemini(mensajesActuales.slice(-6));
// const respuestaAsistente = await geminiServiceMock.enviarMensaje(contenidoMensaje, historialParaGemini);

// Por:
// const historialParaGemini = this.geminiService.convertirHistorialAGemini(mensajesActuales.slice(-6));
// const respuestaAsistente = await firstValueFrom(
//   this.geminiService.enviarMensaje(contenidoMensaje, historialParaGemini)
// );
```

3. **Actualizar la verificación de configuración:**
```typescript
// En chatListo(), reemplazar:
// const geminiConfigurado = true;
// Por:
// const geminiConfigurado = this.geminiService.verificarConfiguracion();
```

## Explicación detallada

1. **Inicializar chat**: `inicializarChat` carga el historial de mensajes del usuario desde Firestore y lo coloca en el `BehaviorSubject` del servicio para que la UI lo muestre.

2. **Suscripción a mensajes**: `mensajes$` es un observable que emite cambios en la lista de mensajes. Al suscribirnos, actualizamos automáticamente la lista en el componente y habilitamos el scroll automático.

3. **Suscripción al asistente**: `asistenteRespondiendo$` indica cuando el asistente está generando una respuesta. Esto permite mostrar un indicador de “escribiendo” en la UI y hacer scroll hacia abajo si es necesario.

4. **Enviar mensaje**: `enviarMensaje` envía el texto del usuario al chat, lo guarda en Firestore y obtiene la respuesta de Google Gemini. La UI se actualiza automáticamente gracias a las suscripciones.

5. **Limpiar chat**: `limpiarChat` borra localmente todos los mensajes del chat, útil al cerrar sesión o reiniciar la conversación.

