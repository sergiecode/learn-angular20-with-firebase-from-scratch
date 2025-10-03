# 🔗 Clase 4: Crear Repositorio en GitHub

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Crear y configurar un repositorio de GitHub para el proyecto de Angular 20 con Firebase donde se implementará un chat usando la API de Google Gemini.

## 1. Crear el repositorio en GitHub
1. Ingresar a [GitHub](https://github.com/)
2. Hacer clic en **New Repository**
3. Completar la información:
   - **Nombre:** Colocar el nombre del repositorio
   - **Descripción:** Breve descripción del proyecto
   - **Visibilidad:** Público

## 2. Inicializar Git en el proyecto local
Abrir terminal en la carpeta del proyecto y ejecutar:

```bash
git init
```

## 3. Agregar archivos y primer commit
```bash
git add .
git commit -am "Descripción del commit (puede coincidir con la de GitHub si es la primera)"
```

## 4. Conectar con el repositorio remoto
```bash
git remote add origin https://github.com/sergiecode/nombre-repositorio.git
```

## 5. Subir los archivos al repositorio
```bash
git push -u origin master
```

Ahora tu proyecto de Angular 20 con Firebase está listo en GitHub y podrás continuar con la integración del chat usando la API de Google Gemini.

