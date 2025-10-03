# 🤖 Clase 19: Integración de Gemini Service en Angular 20 con Firebase

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
En esta clase se agregará el servicio `GeminiService` al proyecto para permitir la comunicación con la API de Google Gemini y así poder implementar un chat inteligente. Este servicio se encuentra en `src/app/services/gemini.ts`.

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface PeticionGemini {
  contents: ContenteGemini[];
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
  };
  safetySettings?: SafetySetting[];
}

interface ContenteGemini {
  role: 'user' | 'model';
  parts: PartGemini[];
}

interface PartGemini {
  text: string;
}

interface SafetySetting {
  category: string;
  threshold: string;
}

interface RespuestaGemini {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private http = inject(HttpClient);

  private readonly apiUrl = environment.gemini.apiUrl;
  private readonly apiKey = environment.gemini.apiKey;

  enviarMensaje(mensaje: string, historialPrevio: ContenteGemini[] = []): Observable<string> {
    if (!this.apiKey || this.apiKey === 'TU_API_KEY_DE_GEMINI') {
      console.error('❌ API Key de Gemini no configurada');
      return throwError(() => new Error('API Key de Gemini no configurada. Por favor configura tu clave en environment.ts'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const mensajeSistema: ContenteGemini = {
      role: 'user',
      parts: [{
        text: `Eres un asistente virtual útil y amigable. Responde siempre en español de manera clara y concisa.
               Eres especialista en ayudar con preguntas generales, programación, y tecnología.
               Mantén un tono profesional pero cercano.`
      }]
    };

    const respuestaSistema: ContenteGemini = {
      role: 'model',
      parts: [{
        text: 'Entendido. Soy tu asistente virtual especializado en tecnología y programación. Te ayudaré de manera clara y profesional en español. ¿En qué puedo ayudarte?'
      }]
    };

    const contenidos: ContenteGemini[] = [
      mensajeSistema,
      respuestaSistema,
      ...historialPrevio,
      {
        role: 'user',
        parts: [{ text: mensaje }]
      }
    ];

    const configuracionesSeguridad: SafetySetting[] = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ];

    const cuerposPeticion: PeticionGemini = {
      contents: contenidos,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7
      },
      safetySettings: configuracionesSeguridad
    };

    const urlCompleta = `${this.apiUrl}?key=${this.apiKey}`;

    return this.http.post<RespuestaGemini>(urlCompleta, cuerposPeticion, { headers })
      .pipe(
        map(respuesta => {
          if (respuesta.candidates && respuesta.candidates.length > 0) {
            const candidate = respuesta.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
              let contenidoRespuesta = candidate.content.parts[0].text;
              if (candidate.finishReason === 'MAX_TOKENS') {
                contenidoRespuesta += '\n\n[Nota: Respuesta truncada por límite de tokens. Puedes pedirme que continúe.]';
              }
              return contenidoRespuesta;
            } else {
              throw new Error('Respuesta de Gemini no contiene contenido válido');
            }
          } else {
            throw new Error('Respuesta de Gemini no tiene el formato esperado');
          }
        }),
        catchError(error => {
          console.error('❌ Error al comunicarse con Gemini:', error);
          let mensajeError = 'Error al conectar con Gemini';
          if (error.status === 400) {
            mensajeError = 'Petición inválida a Gemini. Verifica la configuración.';
          } else if (error.status === 403) {
            mensajeError = 'Clave de API de Gemini inválida o sin permisos';
          } else if (error.status === 429) {
            mensajeError = 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.';
          } else if (error.status === 500) {
            mensajeError = 'Error en el servidor de Gemini. Intenta de nuevo más tarde.';
          } else if (error.error?.error?.message) {
            mensajeError = error.error.error.message;
          }
          return throwError(() => new Error(mensajeError));
        })
      );
  }

  convertirHistorialAGemini(mensajes: any[]): ContenteGemini[] {
    const historialConvertido: ContenteGemini[] = mensajes.map(msg => ({
      role: (msg.tipo === 'usuario' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: msg.contenido }]
    }));

    if (historialConvertido.length > 8) {
      const ultimosMensajes = historialConvertido.slice(-6);
      if (ultimosMensajes.length > 0 && ultimosMensajes[0].role === 'model') {
        return ultimosMensajes.slice(1);
      }
      return ultimosMensajes;
    }

    return historialConvertido;
  }

  verificarConfiguracion(): boolean {
    const configuracionValida = !!(this.apiKey && this.apiKey !== 'TU_API_KEY_DE_GEMINI' && this.apiUrl);
    return configuracionValida;
  }
}
```

### Explicación Detallada

1. **Imports y Dependencias:**
   - `HttpClient` y `HttpHeaders` se usan para hacer peticiones HTTP a la API de Google Gemini.
   - `Observable`, `throwError`, `map`, `catchError` de RxJS manejan las respuestas y errores de manera reactiva.
   - `environment` permite usar la configuración de API Key y URL sin exponer datos sensibles.

2. **Interfaces:**
   - `PeticionGemini` define cómo enviar los datos a la API de Google Gemini.
   - `ContenteGemini` estandariza los contenidos según el rol (`user`, `model`) y su estructura de partes.
   - `RespuestaGemini` define cómo se estructura la respuesta recibida de Gemini.

3. **Servicio `GeminiService`:**
   - **`enviarMensaje`**: envía un mensaje al modelo Gemini 1.5 Flash, manteniendo el historial previo y configurando headers, cuerpo de petición y manejo de errores. Devuelve un `Observable<string>` con la respuesta del asistente.
   - **`convertirHistorialAGemini`**: transforma el historial interno del chat a formato compatible con Gemini y optimiza la cantidad de mensajes para no exceder límites de tokens.
   - **`verificarConfiguracion`**: comprueba que la API Key y URL estén correctamente configuradas antes de hacer peticiones.

Este servicio es el núcleo de la comunicación entre tu aplicación Angular 20 y Google Gemini, permitiendo implementar un chat con contexto, manejo de errores y personalización de respuestas en español.


## Actualización de ChatService para usar GeminiService en lugar de OpenaiService

Cambios a realizar en `src/app/services/chat.ts`:

1. **Importar `GeminiService` y eliminar referencias a OpenAI:**
```typescript
import { GeminiService } from './gemini';

// Ya no se necesita OpenaiService
```

2. **Inyectar `GeminiService` en la clase:**
```typescript
private geminiService = inject(GeminiService);
```

3. **Actualizar la conversión de historial y envío de mensajes:**
```typescript
// Actualizado para Gemini
const historialParaGemini = this.geminiService.convertirHistorialAGemini(mensajesActuales.slice(-6));

// Enviar mensaje a Gemini
const respuestaAsistente = await firstValueFrom(
  this.geminiService.enviarMensaje(contenidoMensaje, historialParaGemini)
);
```

4. **Verificación de configuración:**
   - En `chatListo()`, usar:
```typescript
const geminiConfigurado = this.geminiService.verificarConfiguracion();
```

