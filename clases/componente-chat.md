# Clase12: Componente de Chat con Angular 20, Firebase y OpenAI API

Este documento describe los pasos e implementación inicial del componente **Chat** dentro de un proyecto en Angular 20 con Firebase, pensado para crear un chat que posteriormente integrará la API de OpenAI. 

Se incluyen los archivos HTML y TypeScript del componente, mientras que el archivo CSS será provisto por separado. El objetivo es centrarnos en la lógica y estructura del componente.

---

## 1. Estructura HTML (`chat.html`)
El HTML define la interfaz del chat, organizada en:

- **Contenedor principal (`chat-container`)**: agrupa todo el chat.
- **Header (`chat-header`)**: muestra información del usuario y un botón de cerrar sesión.
- **Main (`chat-messages`)**: contiene los mensajes, indicadores de carga, bienvenida y estado del asistente.
- **Footer (`chat-input`)**: incluye el formulario para enviar mensajes.

El código contiene directivas Angular como `@if` y `@for` para renderizado condicional e iteración sobre los mensajes.

> **Nota:** Varias partes están comentadas o aún no implementadas (ej. conexión directa con servicios de `AuthService` y `ChatService`). Esto es intencional, ya que se explicarán progresivamente durante la clase.

```html
<!-- Contenedor principal del chat -->
<div class="chat-container">
  
  <!-- Header con información del usuario -->
  <header class="chat-header">
    <div class="user-info">
      <img 
        [src]="usuario?.photoURL || 'default-avatar.png'" 
        [alt]="usuario?.displayName || 'Usuario'"
        class="user-avatar"
        (error)="manejarErrorImagen($event)">
      <div class="user-details">
        <h3 class="user-name">{{ usuario?.displayName || 'Usuario' }}</h3>
        <p class="user-email">{{ usuario?.email }}</p>
      </div>
    </div>
    
    <div class="header-actions">
      <!-- Botón de cerrar sesión -->
      <button 
        class="logout-btn" 
        (click)="cerrarSesion()"
        title="Cerrar sesión">
        Salir
      </button>
    </div>
  </header>
  
  <!-- Área de mensajes -->
  <main class="chat-messages" #messagesContainer>
    
    <!-- Mensaje de bienvenida cuando no hay mensajes -->
    @if (mensajes.length === 0 && !cargandoHistorial) {
      <div class="welcome-message">
        <div class="welcome-content">
          <div class="welcome-icon">🤖</div>
          <h2>¡Hola! Soy tu asistente virtual</h2>
          <p>Puedo ayudarte con preguntas, programación, tareas cotidianas y mucho más.</p>
          <p class="welcome-tip">💡 <strong>Consejo:</strong> Sé específico en tus preguntas para obtener mejores respuestas.</p>
        </div>
      </div>
    }
    
    <!-- Indicador de carga del historial -->
    @if (cargandoHistorial) {
      <div class="loading-history">
        <div class="loading-spinner"></div>
        <p>Cargando tu historial de conversaciones...</p>
      </div>
    }
    
    <!-- Lista de mensajes -->
    <div class="messages-list">
      @for (mensaje of mensajes; track trackByMensaje($index, mensaje)) {
        <div 
          class="message-wrapper"
          [class.user-message]="mensaje.tipo === 'usuario'"
          [class.assistant-message]="mensaje.tipo === 'asistente'">
        
          <!-- Mensaje del usuario -->
          @if (mensaje.tipo === 'usuario') {
            <div class="message user-msg">
              <div class="message-content">
                <p>{{ mensaje.contenido }}</p>
              </div>
              <div class="message-time">
                {{ formatearHora(mensaje.fechaEnvio) }}
              </div>
            </div>
          }
        
          <!-- Mensaje del asistente -->
          @if (mensaje.tipo === 'asistente') {
            <div class="message assistant-msg">
              <div class="message-avatar">🤖</div>
              <div class="message-bubble">
                <div class="message-content">
                  <p [innerHTML]="formatearMensajeAsistente(mensaje.contenido)"></p>
                </div>
                <div class="message-time">
                  {{ formatearHora(mensaje.fechaEnvio) }}
                  @if (mensaje.estado === 'error') {
                    <span class="error-indicator">⚠️</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
      
      <!-- Indicador de que el asistente está escribiendo -->
      @if (asistenteEscribiendo) {
        <div class="message-wrapper assistant-message">
          <div class="message assistant-msg typing">
            <div class="message-avatar">🤖</div>
            <div class="message-bubble">
              <div class="typing-indicator">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p class="typing-text">El asistente está escribiendo...</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  </main>
  
  <!-- Formulario para enviar mensajes -->
  <footer class="chat-input">
    <form class="input-form" (ngSubmit)="enviarMensaje()" #chatForm="ngForm">
      <div class="input-wrapper">
        <textarea
          #messageInput
          [(ngModel)]="mensajeTexto"
          name="mensaje"
          placeholder="Escribe tu mensaje aquí... (presiona Enter para enviar, Shift+Enter para nueva línea)"
          class="message-input"
          [disabled]="enviandoMensaje || asistenteEscribiendo"
          (keydown)="manejarTeclaPresionada($event)"
          rows="1">
        </textarea>
        
        <button 
          type="submit"
          class="send-btn"
          [disabled]="!mensajeTexto.trim() || enviandoMensaje || asistenteEscribiendo"
          [class.sending]="enviandoMensaje">
          
          <!-- Icono de envío o spinner -->
          @if (!enviandoMensaje) {
            <span>></span>
          }
          @if (enviandoMensaje) {
            <span class="sending-spinner"></span>
          }
        </button>
      </div>
      
      <!-- Información del estado -->
      @if (mensajeError) {
        <div class="input-status">
          <span class="error-text">❌ {{ mensajeError }}</span>
        </div>
      }
    </form>
  </footer>
  
</div>
```

---

## 2. Lógica en TypeScript (`chat.ts`)
El componente `Chat` incluye:

- **Dependencias principales:** `AuthService`, `ChatService`, `Router`.
- **Variables de estado:** usuario, lista de mensajes, indicadores de carga/envío, error de mensajes, etc.
- **Hooks de ciclo de vida:**
  - `ngOnInit`: inicializa autenticación y configuración del chat.
  - `ngOnDestroy`: limpia suscripciones.
  - `ngAfterViewChecked`: gestiona scroll automático.

### Métodos clave:
- `verificarAutenticacion`: valida si hay un usuario. Actualmente usa un mock para desarrollo.
- `inicializarChat`: prepara el historial de chat (conexión con servicio comentada).
- `configurarSuscripciones`: escuchará cambios en mensajes y estado del asistente (aún comentado).
- `enviarMensaje`: envía un mensaje al asistente (pendiente conexión con `ChatService`).
- `manejarTeclaPresionada`: permite enviar mensaje con Enter o nueva línea con Shift+Enter.
- `cerrarSesion`: cerrará sesión en Firebase (actualmente comentado).
- `scrollHaciaAbajo` y `enfocarInput`: mejoran la experiencia de uso del chat.
- `formatearHora`: da formato a la hora de los mensajes.
- `formatearMensajeAsistente`: interpreta el texto del asistente y lo convierte a HTML simple.
- `trackByMensaje`: optimiza el renderizado de la lista de mensajes.
- `manejarErrorImagen`: gestiona un fallback para la foto de perfil cuando no se puede cargar.

```ts
import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat';
import { MensajeChat } from '../../models/chat';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private router = inject(Router);
  
  // Referencia al contenedor de mensajes para hacer scroll automático
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  
  usuario: any = null;                    // Información del usuario actual
  mensajes: MensajeChat[] = [];          // Lista de mensajes del chat
  mensajeTexto = '';                     // Texto del mensaje que está escribiendo el usuario
  enviandoMensaje = false;               // Indica si se está enviando un mensaje
  asistenteEscribiendo = false;          // Indica si el asistente está generando una respuesta
  cargandoHistorial = false;             // Indica si se está cargando el historial
  mensajeError = '';                     // Mensaje de error para mostrar al usuario
  
  private suscripciones: Subscription[] = [];
  
  // Control para hacer scroll automático
  private debeHacerScroll = false;

  async ngOnInit(): Promise<void> {
    try {
      await this.verificarAutenticacion();
      await this.inicializarChat();
      this.configurarSuscripciones();
    } catch (error) {
      console.error('❌ Error al inicializar el chat:', error);
      this.mensajeError = 'Error al cargar el chat. Intenta recargar la página.';
    }
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach(sub => sub.unsubscribe());
  }

  /**
   * Se ejecuta después de que Angular actualiza la vista
   * Lo usamos para hacer scroll automático cuando hay nuevos mensajes
   */
  ngAfterViewChecked(): void {
    if (this.debeHacerScroll) {
      this.scrollHaciaAbajo();
      this.debeHacerScroll = false;
    }
  }

  private async verificarAutenticacion(): Promise<void> {
    // this.usuario = this.authService.obtenerUsuarioActual();
    
    // Simulación de usuario autenticado para desarrollo
    this.usuario = { uid: 'usuario123', nombre: 'Usuario de Prueba', fotoURL: '' };
    
    if (!this.usuario) {
      await this.router.navigate(['/auth']);
      throw new Error('Usuario no autenticado');
    }
  }

  private async inicializarChat(): Promise<void> {
    if (!this.usuario) return;
    
    this.cargandoHistorial = true;
    
    try {
      // Inicializamos el chat con el ID del usuario
      // await this.chatService.inicializarChat(this.usuario.uid);
      
    } catch (error) {
      console.error('❌ Error al inicializar chat en componente:', error);
      throw error;
      
    } finally {
      this.cargandoHistorial = false;
    }
  }

  private configurarSuscripciones(): void {
    // Suscribirse a los mensajes del chat
    // const subMensajes = this.chatService.mensajes$.subscribe(mensajes => {
    //   this.mensajes = mensajes;
    //   this.debeHacerScroll = true;
    // });
    
    // // Suscribirse al estado del asistente
    // const subAsistente = this.chatService.asistenteRespondiendo$.subscribe(respondiendo => {
    //   this.asistenteEscribiendo = respondiendo;
    //   if (respondiendo) {
    //     this.debeHacerScroll = true;
    //   }
    // });
    
    // this.suscripciones.push(subMensajes, subAsistente);
  }


  async enviarMensaje(): Promise<void> {
    // Validamos que hay texto para enviar
    if (!this.mensajeTexto.trim()) {
      return;
    }
    
    // Limpiamos errores previos
    this.mensajeError = '';
    this.enviandoMensaje = true;
    
    // Guardamos el texto del mensaje y limpiamos el input
    const texto = this.mensajeTexto.trim();
    this.mensajeTexto = '';
    
    try {
      // Enviamos el mensaje usando el servicio de chat
      // await this.chatService.enviarMensaje(texto);
      
      // Hacemos focus en el input para continuar escribiendo
      this.enfocarInput();
      
    } catch (error: any) {
      console.error('❌ Error al enviar mensaje:', error);
      
      // Mostramos el error al usuario
      this.mensajeError = error.message || 'Error al enviar el mensaje';
      
      // Restauramos el texto en el input
      this.mensajeTexto = texto;
      
    } finally {
      this.enviandoMensaje = false;
    }
  }

  manejarTeclaPresionada(evento: KeyboardEvent): void {
    // Enter sin Shift envía el mensaje
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      this.enviarMensaje();
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      // Limpiamos el chat local
      // this.chatService.limpiarChat();
      
      // Cerramos sesión en Firebase
      // await this.authService.cerrarSesion();
      
      // Navegamos al login
      await this.router.navigate(['/auth']);
      
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      this.mensajeError = 'Error al cerrar sesión';
    }
  }

  private scrollHaciaAbajo(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (error) {
      // Error al hacer scroll
    }
  }


  private enfocarInput(): void {
    setTimeout(() => {
      this.messageInput?.nativeElement?.focus();
    }, 100);
  }


  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatea el contenido de los mensajes del asistente
   * Convierte texto plano en HTML básico
   */
  formatearMensajeAsistente(contenido: string): string {
    return contenido
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  trackByMensaje(index: number, mensaje: MensajeChat): string {
    return mensaje.id || `${mensaje.tipo}-${mensaje.fechaEnvio.getTime()}`;
  }


  manejarErrorImagen(evento: any): void {
    evento.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEg2VjIySDZIMThINlYyMEM2IDE2LjY4NjMgMTUuMzEzNyAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K';
  }
}
```

---

## 3. Explicación de `manejarErrorImagen`
Este método se utiliza para manejar errores al cargar imágenes de usuario (por ejemplo, si no hay `photoURL` válido). En lugar de mostrar un espacio vacío o un ícono roto, se asigna una imagen de respaldo en formato **SVG embebido en base64**. Esto asegura que siempre haya un avatar visible y consistente en la interfaz, incluso si falla la carga de la imagen remota.

El enfoque evita depender de rutas externas y garantiza que el componente sea más estable y predecible.

---

## 4. Estilos CSS
Los estilos **no se incluyen en este documento**, ya que se entregarán como archivo independiente para copiar y pegar. La clase no se centrará en diseño visual, sino en lógica y funcionalidad.

---

## 4. Agregar imagen default-avatar.png
Agregar una imagen en el caso de no estar disponible la foto de Google