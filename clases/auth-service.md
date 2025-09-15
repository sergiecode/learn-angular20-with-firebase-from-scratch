# 🔐 Clase 16: AuthService en Angular 20 con Firebase

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Crear el servicio de autenticación que manejará el login y logout de usuarios usando Firebase Auth.

### Paso 1: Crear el servicio AuthService
Archivo: `src\app\services\auth.ts`

```ts
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);

  usuario$ = user(this.auth);

  estaAutenticado$ = this.usuario$.pipe(
    map(usuario => !!usuario)
  );

  async iniciarSesionConGoogle(): Promise<Usuario | null> {
    try {
      const proveedor = new GoogleAuthProvider();
      proveedor.addScope('email');
      proveedor.addScope('profile');

      const resultado = await signInWithPopup(this.auth, proveedor);
      const usuarioFirebase = resultado.user;

      if (usuarioFirebase) {
        const usuario: Usuario = {
          uid: usuarioFirebase.uid,
          email: usuarioFirebase.email || '',
          nombre: usuarioFirebase.displayName || 'Usuario sin nombre',
          fotoUrl: usuarioFirebase.photoURL || undefined,
          fechaCreacion: new Date(),
          ultimaConexion: new Date()
        };

        return usuario;
      }

      return null;

    } catch (error) {
      console.error('❌ Error durante la autenticación:', error);
      throw error;
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  obtenerUsuarioActual(): User | null {
    return this.auth.currentUser;
  }

  obtenerUidUsuario(): string | null {
    const usuario = this.obtenerUsuarioActual();
    return usuario ? usuario.uid : null;
  }
}
```

### Explicación detallada

- **Inyección del servicio Auth:** Se utiliza `inject(Auth)` para obtener la instancia de autenticación de Firebase.
- **usuario$:** Observable que emite el usuario actual cada vez que cambia el estado de autenticación.
- **estaAutenticado$:** Observable que devuelve `true` si el usuario está autenticado y `false` si no.
- **iniciarSesionConGoogle():** Método que abre un popup de Google para iniciar sesión, obtiene los datos del usuario y los transforma en un objeto `Usuario`.
- **cerrarSesion():** Método que cierra la sesión del usuario usando Firebase.
- **obtenerUsuarioActual():** Retorna el usuario actualmente autenticado o `null` si no hay ninguno.
- **obtenerUidUsuario():** Devuelve el UID del usuario actual o `null`.

---

### Paso 2: Actualizar componentes para usar AuthService

Archivo: `src\app\components\auth\auth.ts`

Descomentar las líneas:
```ts
const usuario = await this.authService.iniciarSesionConGoogle();
```
```ts
this.authService.estaAutenticado$.subscribe(autenticado => {
  if (autenticado) {
    this.router.navigate(['/chat']);
  }
});
```

Archivo: `src\app\components\chat\chat.ts`

Descomentar las líneas:
```ts
this.usuario = this.authService.obtenerUsuarioActual();
```
```ts
await this.authService.cerrarSesion();
```

