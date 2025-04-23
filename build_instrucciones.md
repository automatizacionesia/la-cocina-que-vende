# Instrucciones para compilar y ejecutar la aplicación

Sigue estos pasos para resolver el problema de la página en blanco y el error MIME:

## Paso 1: Compilar la aplicación

```bash
cd C:\Users\diaza\Downloads\TEST\project
npm run build
```

Esto generará una nueva versión de la aplicación en la carpeta `dist`.

## Paso 2: Ejecutar un servidor adecuado

Tienes dos opciones:

### Opción A: Usar el servidor de vista previa de Vite (recomendado)

```bash
cd C:\Users\diaza\Downloads\TEST\project
npm run preview
```

Este servidor está configurado correctamente para servir aplicaciones Vite compiladas.
Por defecto, se ejecutará en http://localhost:4173

### Opción B: Usar el servidor Python personalizado

```bash
cd C:\Users\diaza\Downloads\TEST\project\dist
python ..\server.py
```

Este servidor Python personalizado configura correctamente los tipos MIME.
Se ejecutará en http://localhost:8000

## Paso 3: Configurar ngrok (si es necesario)

Si necesitas compartir la aplicación, configura ngrok para apuntar al puerto correcto:

```bash
ngrok http 4173  # Si usas npm run preview
```

o

```bash
ngrok http 8000  # Si usas el servidor Python personalizado
```

## Nota importante

Si sigues viendo la página en blanco, intenta:
1. Borrar la caché del navegador (Ctrl+F5 o Cmd+Shift+R)
2. Usar una ventana de incógnito
3. Verificar la consola del navegador para ver si hay errores adicionales
