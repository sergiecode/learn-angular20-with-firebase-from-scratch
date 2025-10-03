# 🎨 Clase 11: Agregar Estilos Generales de la Aplicación

[⬅️ Regresar al índice](../README.md)

---

## 🎯 Objetivo
Configurar los estilos globales de la aplicación para una mejor experiencia de usuario.

1. **styles.css**
   Este archivo contiene los estilos globales de la aplicación.
   - Reset de márgenes y padding para consistencia entre navegadores.
   - Tipografía base y colores de fondo del body.
   - Variables CSS para colores, espaciado, bordes y sombras.
   - Clases utilitarias de texto, color, espaciado, display y flexbox.
   - Estilos base para botones, inputs, cards, animaciones y responsive design para tablets y móviles.

   **Nota:** El contenido completo del archivo CSS se proporcionará en la clase para copiar y pegar, ya que este curso no profundiza en estilos.

2. **app.css**
   Define estilos para el host y router-outlet:
   - Variables de colores globales y tipografía base.
   - Configuración de ancho, alto, padding y márgenes.
   - Clases utilitarias de contenedor, centrado de texto, márgenes y ocultamiento de elementos en móviles.

3. **angular.json**
   Modificaciones en configurations:
   - Budgets para controlar tamaño de la aplicación y estilos, generando warnings y errores cuando se exceden.
   - Optimización, extracción de licencias y source maps configurados para entornos de desarrollo y producción.

Código modificado en angular.json con formato legible:

```json
"configurations": {
  "production": {
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "5000kB",
        "maximumError": "5MB"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "40kB",
        "maximumError": "80kB"
      }
    ],
    "outputHashing": "all"
  },
  "development": {
    "optimization": false,
    "extractLicenses": false,
    "sourceMap": true
  }
}
```

