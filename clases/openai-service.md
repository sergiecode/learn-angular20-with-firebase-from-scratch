# 🤖 Clase 19: Integración de OpenAI Service en Angular 20 con Firebase

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
En esta clase se agregará el servicio `OpenaiService` al proyecto para permitir la comunicación con la API de OpenAI y así poder implementar un chat inteligente. Este servicio se encuentra en `src/app/services/openai.ts`.

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface PeticionOpenAI {
  model: string;
  messages: MensajeOpenAI[];
  max_tokens?: number;
  temperature?: number;
}

interface MensajeOpenAI {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RespuestaOpenAI {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private http = inject(HttpClient);

  private readonly apiUrl = environment.openai.apiUrl;
  private readonly apiKey = environment.openai.apiKey;

  enviarMensaje(mensaje: string, historialPrevio: MensajeOpenAI[] = []): Observable<string> {
    if (!this.apiKey || this.apiKey === 'TU_API_KEY_DE_OPENAI') {
      console.error('❌ API Key de OpenAI no configurada');
      return throwError(() => new Error('API Key de OpenAI no configurada. Por favor configura tu clave en environment.ts'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const mensajes: MensajeOpenAI[] = [
      {
        role: 'system',
        content: `Eres un asistente virtual útil y amigable. Responde siempre en español de manera clara y concisa.
                 Eres especialista en ayudar con preguntas generales, programación, y tecnología.
                 Mantén un tono profesional pero cercano.`
      },
      ...historialPrevio,
      {
        role: 'user',
        content: mensaje
      }
    ];

    const cuerposPeticion: PeticionOpenAI = {
      model: 'gpt-3.5-turbo',
      messages: mensajes,
      max_tokens: 200,
      temperature: 0.7
    };

    return this.http.post<RespuestaOpenAI>(this.apiUrl, cuerposPeticion, { headers })
      .pipe(
        map(respuesta => {
          if (respuesta.choices && respuesta.choices.length > 0) {
            const choice = respuesta.choices[0];
            let contenidoRespuesta = choice.message.content;
            if (choice.finish_reason === 'length') {
              contenidoRespuesta += '\n\n[Nota: Respuesta truncada por límite de tokens. Puedes pedirme que continúe.]';
            }
            return contenidoRespuesta;
          } else {
            throw new Error('Respuesta de OpenAI no tiene el formato esperado');
          }
        }),
        catchError(error => {
          console.error('❌ Error al comunicarse con OpenAI:', error);
          let mensajeError = 'Error al conectar con ChatGPT';
          if (error.status === 401) {
            mensajeError = 'Clave de API de OpenAI inválida';
          } else if (error.status === 429) {
            mensajeError = 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.';
          } else if (error.status === 500) {
            mensajeError = 'Error en el servidor de OpenAI. Intenta de nuevo más tarde.';
          } else if (error.error?.error?.message) {
            mensajeError = error.error.error.message;
          }
          return throwError(() => new Error(mensajeError));
        })
      );
  }

  convertirHistorialAOpenAI(mensajes: any[]): MensajeOpenAI[] {
    const historialConvertido = mensajes.map(msg => ({
      role: (msg.tipo === 'usuario' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.contenido
    }));

    if (historialConvertido.length > 8) {
      const ultimosMensajes = historialConvertido.slice(-6);
      if (ultimosMensajes.length > 0 && ultimosMensajes[0].role === 'assistant') {
        return ultimosMensajes.slice(1);
      }
      return ultimosMensajes;
    }

    return historialConvertido;
  }

  verificarConfiguracion(): boolean {
    const configuracionValida = !!(this.apiKey && this.apiKey !== 'TU_API_KEY_DE_OPENAI' && this.apiUrl);
    return configuracionValida;
  }
}
```

### Explicación Detallada

1. **Imports y Dependencias:**
   - `HttpClient` y `HttpHeaders` se usan para hacer peticiones HTTP a la API de OpenAI.
   - `Observable`, `throwError`, `map`, `catchError` de RxJS manejan las respuestas y errores de manera reactiva.
   - `environment` permite usar la configuración de API Key y URL sin exponer datos sensibles.

2. **Interfaces:**
   - `PeticionOpenAI` define cómo enviar los datos a la API de OpenAI.
   - `MensajeOpenAI` estandariza los mensajes según el rol (`system`, `user`, `assistant`).
   - `RespuestaOpenAI` define cómo se estructura la respuesta recibida.

3. **Servicio `OpenaiService`:**
   - **`enviarMensaje`**: envía un mensaje al modelo de OpenAI, manteniendo el historial previo y configurando headers, cuerpo de petición y manejo de errores. Devuelve un `Observable<string>` con la respuesta del asistente.
   - **`convertirHistorialAOpenAI`**: transforma el historial interno del chat a formato compatible con OpenAI y optimiza la cantidad de mensajes para no exceder límites de tokens.
   - **`verificarConfiguracion`**: comprueba que la API Key y URL estén correctamente configuradas antes de hacer peticiones.

Este servicio es el núcleo de la comunicación entre tu aplicación Angular 20 y OpenAI, permitiendo implementar un chat con contexto, manejo de errores y personalización de respuestas en español.


## Actualización de ChatService para usar OpenaiService real en lugar de openaiServiceMock

Cambios a realizar en `src/app/services/chat.ts`:

1. **Importar `OpenaiService` y eliminar el mock:**
```typescript
import { OpenaiService } from './openai';

// Eliminar openaiServiceMock
// const openaiServiceMock = { ... }
```

2. **Inyectar `OpenaiService` en la clase:**
```typescript
private openaiService = inject(OpenaiService);
```

3. **Actualizar la conversión de historial y envío de mensajes:**
```typescript
// Antes con mock
// const historialParaOpenAI = openaiServiceMock.convertirHistorialAOpenAI(mensajesActuales.slice(-6));
const historialParaOpenAI = this.openaiService.convertirHistorialAOpenAI(mensajesActuales.slice(-6));

// Antes con mock
// const respuestaAsistente = await openaiServiceMock.enviarMensaje(contenidoMensaje, historialParaOpenAI);
const respuestaAsistente = await firstValueFrom(
  this.openaiService.enviarMensaje(contenidoMensaje, historialParaOpenAI)
);
```

4. **Opcional:**
   - En `chatListo()`, reemplazar `const openaiConfigurado = true` por:
```typescript
const openaiConfigurado = this.openaiService.verificarConfiguracion();
```

