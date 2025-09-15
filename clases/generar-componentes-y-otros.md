# 🏗️ Clase 9: Crear Componentes, Servicios, Guard y Modelos

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Generar la estructura básica de componentes, servicios, guards y modelos necesarios para el proyecto.

---

## 1. Generar Componentes
### Componente de Autenticación
```bash
ng generate component components/auth --skip-tests
```

### Componente de Chat
```bash
ng generate component components/chat --skip-tests
```

### Crear archivo index.ts para exportar los componentes
Ruta: `src/app/components/index.ts`
```typescript
export { AuthComponent } from './auth/auth';
export { ChatComponent } from './chat/chat';
```

## 2. Generar Servicios
```bash
ng generate service services/auth --skip-tests
ng generate service services/firestore --skip-tests
ng generate service services/chat --skip-tests
ng generate service services/gemini --skip-tests
```

## 3. Generar Guard de Autenticación
```bash
ng generate guard guards/auth --skip-tests
```
Cuando pregunte:
```
✔ Which type of guard would you like to create? CanActivate
```

## 4. Crear directorio para modelos
```bash
mkdir src/app/models
```
### Crear archivos de modelos
- `src/app/models/usuario.ts`
- `src/app/models/chat.ts`

