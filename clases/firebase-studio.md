# 🔥 Clase 22: Firebase Studio

[⬅️ Regresar al índice](../README.md)

---

---

## Guía para usar Firebase Studio

### 1. Acceder a Firebase Studio

- Ingresa a [Firebase Studio](https://firebase.google.com/studio).

### 2. Aceptar términos y condiciones

Al ingresar, aparecerá el siguiente mensaje:

> Welcome to Firebase Studio, a complete web-based development workspace from Google, designed to make it faster and easier to build, ship, and manage full-stack, multiplatform apps from the comfort of your browser.
>
> I accept the terms and conditions for Firebase Services listed on the Terms of Service page and the Android SDK Terms and Conditions
>
> I want to receive email updates about Firebase Studio news and features.
>
> I’m interested in participating in research studies to improve Firebase Studio

Debes aceptar todos los términos y condiciones, excepto la opción de recibir correos electrónicos.

### 3. Importar repositorio

- Haz clic en "Import Project".
- Ingresa la URL del repositorio:  
	`https://github.com/sergiecode/learn-angular20-with-firebase-from-scratch`
- Si el repositorio es privado, se solicitarán tus credenciales.
- Nombra tu workspace:  
	`practice123456789`
- Activa el soporte para Mobile SDK (Flutter + Android Emulator).
- Espera a que se complete la importación.

### 4. Crear una app desde cero

También puedes crear una aplicación nueva. Por ejemplo, en el chat de Firebase Studio puedes usar el siguiente prompt:

```
Build a modern Next.js application with two main screens: authentication and chat.

Requirements:

Authentication screen:
Allow users to log in using Google.
Use Firebase for authentication (I will provide the Firebase configuration).

Chat screen:
After logging in, users can access a chat interface.
The chat must integrate with the Gemini API (I will provide the API key).
Show a modern, clean design with a contemporary style (rounded corners, subtle shadows, and responsive layout).

Technical details:
Use Tailwind CSS for styling.
Use React hooks and functional components.
Ensure a smooth transition between the auth screen and the chat screen after login.
Display the user’s Google profile picture and name at the top of the chat screen.
Messages should be displayed in a chat bubble style, with a clear distinction between user messages and Gemini responses.

Notes:
Authentication state must persist between page reloads.
Handle errors gracefully (e.g., login errors or API issues).
Keep the UI minimal and professional.

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
GEMINI_API_KEY=
GEMINI_API_URL=
```

> Recuerda agregar las API keys al archivo `.gitignore` para evitar exponerlas.

---

### 5. Crear una app móvil (Flutter)

Actualmente, la única forma de crear una app móvil es:

- Selecciona el template de FLUTTER.
- Usa este prompt en el chat:

```
Modify this existing FLUTTER template and turn it into a chat in SPANISH to interact with the GEMINI API.
Here are the API keys:

gemini: { 
	apiKey: , 
	apiUrl:  
}
```

