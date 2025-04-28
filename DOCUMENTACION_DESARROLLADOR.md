# Documentación para Desarrolladores - La Cocina que Vende

Este documento contiene información detallada sobre el funcionamiento, estructura y características del proyecto "La Cocina que Vende - Exportador de Contactos". Está diseñado para ayudar a futuros desarrolladores (humanos o IA) a entender rápidamente cómo funciona el sistema y dónde encontrar los componentes clave.

## Descripción General del Proyecto

"La Cocina que Vende - Exportador de Contactos" es una aplicación web diseñada para ayudar a restaurantes a exportar sus contactos de WhatsApp. La aplicación proporciona una interfaz guiada de tres pasos que permite al usuario:

1. Introducir el nombre de su restaurante
2. Escanear un código QR para vincular su cuenta de WhatsApp
3. Descargar sus contactos en formato CSV

## Estructura del Proyecto

```
C:\Users\diaza\Downloads\TEST\project\
│
├── src/                         # Código fuente principal
│   ├── components/              # Componentes React
│   │   ├── steps/               # Pasos del asistente
│   │   │   ├── WelcomeStep.tsx  # Paso 1: Bienvenida e input de nombre
│   │   │   ├── QRCodeStep.tsx   # Paso 2: Generación y escaneo de QR
│   │   │   └── DownloadStep.tsx # Paso 3: Descarga de contactos
│   │   ├── ui/                  # Componentes de UI reutilizables
│   │   └── ExportWizard.tsx     # Componente principal que orquesta los pasos
│   ├── context/                 # Contexto de la aplicación
│   │   └── AppContext.tsx       # Gestión de estado global
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Punto de entrada
│   └── index.css                # Estilos globales
│
├── public/                      # Activos públicos
├── dist/                        # Código compilado (generado por build)
└── ...                          # Archivos de configuración
```

## Tecnologías Utilizadas

- **Frontend**: React con TypeScript
- **Estilos**: Tailwind CSS
- **Peticiones HTTP**: Axios
- **Íconos**: Lucide React
- **Construcción**: Vite
- **Despliegue**: Vercel

## Flujo de Trabajo de la Aplicación

### Paso 1: WelcomeStep
- El usuario ingresa el nombre de su restaurante
- Se hace una petición POST a `https://webhook.lacocinaquevende.com/webhook/crearqr` con el nombre y un token único
- Se recibe un código QR en formato base64 y un identificador de instancia
- Se avanza automáticamente al siguiente paso

### Paso 2: QRCodeStep
- Se muestra el código QR que el usuario debe escanear
- Se muestran instrucciones en video para escanear el QR en iPhone y Android
- **Verificación automática**: Cada 30 segundos se envía una petición a `https://webhook.lacocinaquevende.com/webhook/validarestadoqr`
  - Si la respuesta es "todo ok", se avanza automáticamente al paso 3
  - Si la respuesta es un nuevo base64, se actualiza el QR en pantalla
- No hay botón "continuar", todo es automático

### Paso 3: DownloadStep
- Se muestra un mensaje de éxito y confeti
- Se inicia automáticamente la descarga del archivo CSV de contactos
- Si la descarga automática falla, después de 10 segundos aparece un botón de respaldo
- Se muestran instrucciones en video para importar los contactos

## Webhooks y Endpoints

### 1. Crear QR
- **URL**: `https://webhook.lacocinaquevende.com/webhook/crearqr`
- **Método**: POST
- **Datos**: `{ restaurantName: string, token: string }`
- **Respuesta**: `{ codigo: string (base64), instancia: string }`

### 2. Verificar Estado QR
- **URL**: `https://webhook.lacocinaquevende.com/webhook/validarestadoqr`
- **Método**: POST
- **Datos**: `{ instance: string }`
- **Respuesta**: 
  - `{ respuesta: "todo ok" }` - Si el QR fue escaneado correctamente
  - `{ respuesta: string (base64) }` - Si se debe actualizar el QR

### 3. Verificar y Descargar Contactos
- **URL**: `https://webhook.lacocinaquevende.com/webhook/verificar`
- **Método**: POST
- **Datos**: `{ instance: string, token: string }`
- **Respuesta**: Archivo CSV con los contactos
- **Alternativa (GET)**: `https://webhook.lacocinaquevende.com/webhook/verificar?instance=[INSTANCE]&token=[TOKEN]`

### 4. Verificar Alternativo (para botón de respaldo)
- **URL**: `https://webhook.lacocinaquevende.com/webhook/verificarx2`
- **Método**: GET
- **Datos**: `?instance=[INSTANCE]`
- **Respuesta**: Archivo CSV con los contactos

## Características Especiales y Detalles Importantes

### Sistema de Renovación Automática de QR
- Implementado en QRCodeStep.tsx
- Usa un temporizador para decrementar cada segundo
- Cuando llega a 0, verifica el estado del QR
- Si se recibe un nuevo código QR, lo muestra y reinicia el temporizador

### Descarga de Archivos
- Implementado tanto en QRCodeStep.tsx como en DownloadStep.tsx
- Usa responseType: 'blob' en Axios para manejar datos binarios
- Implementa método de respaldo usando iframe para casos donde falla Axios
- Botón de descarga manual aparece después de 10 segundos en caso de fallo

### Manejo de Errores
- Sistema de fallback para videos que no cargan
- Recuperación automática para descargas fallidas
- Mensajes de error amigables para el usuario

## Notas sobre el Desarrollador Original y Estilo de Solicitudes

El desarrollador original (Juan Diego Díaz) tiene un estilo de trabajo detallado y preciso. Sus solicitudes de cambios suelen ser específicas y orientadas tanto a la funcionalidad como a la experiencia de usuario. Cuando solicita modificaciones:

1. Suele explicar claramente el "qué" (qué cambiar) y el "por qué" (razón del cambio)
2. Proporciona retroalimentación detallada sobre implementaciones existentes
3. Prioriza la experiencia de usuario y la estética visual
4. Es receptivo a recomendaciones técnicas mientras se mantenga el objetivo principal
5. Valora soluciones que anticipen posibles problemas (como manejo de errores y casos límite)

## Consideraciones para Futuras Modificaciones

### Para Desarrolladores Humanos
- Respetar la paleta de colores y el diseño visual existente
- Mantener la compatibilidad con los webhooks existentes
- Probar exhaustivamente la funcionalidad de escaneo de QR y descarga
- Considerar añadir analíticas para rastrear éxito/fracaso de exportaciones

### Para IAs Asistentes
- Analizar cuidadosamente la estructura del proyecto antes de sugerir cambios
- Prestar especial atención a los hooks de React y la gestión de estados
- Mantener el equilibrio entre automatización y feedback visual para el usuario
- Si se sugieren cambios en los webhooks, proporcionar documentación clara

## Infraestructura y Despliegue

La aplicación está desplegada en Vercel y conectada a un repositorio Git. Para desplegar cambios:

1. Hacer commit de los cambios: `git add . && git commit -m "Descripción del cambio"`
2. Subir los cambios al repositorio: `git push`
3. Vercel detectará automáticamente los cambios y desplegará la nueva versión

## Contacto y Soporte

En caso de problemas técnicos o preguntas, contactar al desarrollador original:
- WhatsApp: +573147746150 (número que aparece en el botón de soporte)
- Proyecto: La Cocina que Vende

---

Documento creado: 28 de abril de 2025  
Última actualización: 28 de abril de 2025
