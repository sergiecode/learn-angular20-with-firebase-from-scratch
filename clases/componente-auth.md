# Clase11 : Componente de Autenticación en Angular 20 + Firebase + Chat con OpenAI

En este paso vamos a crear el componente de autenticación que nos permitirá iniciar sesión con Google utilizando Firebase. Este será el punto de entrada de la aplicación antes de acceder al chat con OpenAI.

---

## Paso 1: Crear el archivo HTML (`auth.html`)

El HTML define la interfaz de la pantalla de autenticación. Usamos un diseño de tarjeta con un encabezado, una descripción de la aplicación y el botón de inicio de sesión.

Puntos importantes:
- El botón de autenticación está vinculado a la función `iniciarSesionConGoogle()`.
- Mientras el proceso está en curso, el botón muestra un spinner y se deshabilita.
- El ícono de Google es un **SVG** que copiamos directamente desde este archivo de clase (separado para facilitar su reutilización).
- Si ocurre un error, se muestra debajo del botón.

```html
<!-- Contenedor principal con diseño responsivo -->
<div class="auth-container">
  
  <!-- Tarjeta principal de autenticación -->
  <div class="auth-card">
    
    <!-- Encabezado con logo y título -->
    <div class="auth-header">
      <div class="logo">
        💬
      </div>
      <h1 class="title">Chat Asistente</h1>
      <p class="subtitle">
        Bienvenido a tu asistente personal con IA
      </p>
    </div>
    
    <!-- Contenido principal -->
    <div class="auth-content">
      
      <!-- Descripción de la aplicación -->
      <div class="description">
        <h2>¿Qué puedes hacer?</h2>
        <ul class="features-list">
          <li>💭 Conversar con ChatGPT en español</li>
          <li>💾 Tu historial se guarda automáticamente</li>
          <li>🔄 Accede a tus conversaciones desde cualquier dispositivo</li>
          <li>🛡️ Tus datos están seguros con Firebase</li>
        </ul>
      </div>
      
      <!-- Botón de autenticación -->
      <div class="auth-actions">
        <button 
          class="google-btn"
          (click)="iniciarSesionConGoogle()"
          [disabled]="autenticando"
          [class.loading]="autenticando">
          
          <!-- Icono de Google -->
          @if (!autenticando) {
            <span class="google-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </span>
          }@else {
              <span class="spinner"></span>
          }
          
          <!-- Texto del botón -->
          <span class="btn-text">
            {{ autenticando ? 'Iniciando sesión...' : 'Continuar con Google' }}
          </span>
        </button>
        
        <!-- Mensaje de error si existe -->
        @if (mensajeError) {
          <div class="error-message">
            ❌ {{ mensajeError }}
          </div>
        }
      </div>
      
      <!-- Información adicional -->
      <div class="info-section">
        <p class="info-text">
          Al continuar, aceptas que utilizamos Google para autenticarte de forma segura.
          No almacenamos tu contraseña.
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div class="auth-footer">
      <p>
        Desarrollado por <strong>Sergie Code</strong> 🚀<br>
        <small>Tutorial Angular 20 + Firebase + ChatGPT</small>
      </p>
    </div>
    
  </div>
</div>

```

---

## Paso 2: Lógica del componente (`auth.ts`)

En este archivo se implementa la lógica de autenticación:
- Se inyecta el servicio de autenticación (`AuthService`) y el `Router`.
- La función `iniciarSesionConGoogle()` maneja el proceso de login.
- Se muestra un loader mientras se autentica y se captura cualquier error para dar feedback claro al usuario.

> 🔹 **Nota importante:** en este punto hemos dejado el llamado real al servicio comentado y hemos agregado una **simulación temporal** que espera 1 segundo y devuelve un objeto de usuario ficticio. Esto sirve para probar la navegación y los estados de carga sin necesidad de tener Firebase configurado todavía.

```ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  imports: [CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {

  private authService = inject(AuthService);
  private router = inject(Router);
  autenticando = false;
  mensajeError = '';

  async iniciarSesionConGoogle(): Promise<void> {
    this.mensajeError = '';
    this.autenticando = true;
    
    try {
      // const usuario = await this.authService.iniciarSesionConGoogle();

      // Simulación de llamada al servicio de autenticación (reemplazar con la línea anterior en producción)
      let usuario = null; 
      usuario = await new Promise((resolve) => {
        setTimeout(() => resolve({ nombre: 'Usuario de Prueba' }), 1000);
      });
      
      if (usuario) {
        await this.router.navigate(['/chat']);
        
      } else {
        this.mensajeError = 'No se pudo obtener la información del usuario';
        console.error('❌ No se obtuvo información del usuario');
      }
      
    } catch (error: any) {
      console.error('❌ Error durante la autenticación:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        this.mensajeError = 'Has cerrado la ventana de autenticación. Intenta de nuevo.';
      } else if (error.code === 'auth/popup-blocked') {
        this.mensajeError = 'Tu navegador bloqueó la ventana de autenticación. Permite popups y vuelve a intentar.';
      } else if (error.code === 'auth/network-request-failed') {
        this.mensajeError = 'Error de conexión. Verifica tu internet y vuelve a intentar.';
      } else {
        this.mensajeError = 'Error al iniciar sesión. Por favor intenta de nuevo.';
      }
      
    } finally {
      this.autenticando = false;
    }
  }

  ngOnInit(): void {
    // this.authService.estaAutenticado$.subscribe(autenticado => {
    //   if (autenticado) {
    //     this.router.navigate(['/chat']);
    //   }
    // });
  }
}
```

    Hasta que esté la llamada real al servicio de autenticación (cuando ya tengamos Firebase configurado) se simulará con una promesa que devuelve usuario de prueba

    Observamos si el usuario ya está autenticado.
    estaAutenticado$ nos dará la indicación en tiempo real de si redirigir o no al chat.
    En este momento está comentado, pero más adelante lo activaremos

---

## Paso 3: Estilos (`auth.css`)

El archivo CSS se entregará listo para copiar y pegar. En este curso no profundizamos en estilos, pero se incluyen para dar un acabado profesional a la interfaz.

---

✅ Con esto ya tenemos un **flujo de login con Google totalmente funcional** en Angular 20 + Firebase. Incluso con la simulación actual podemos probar la experiencia de usuario. Más adelante, al activar el observable `estaAutenticado$`, controlaremos automáticamente la navegación entre login y chat.

