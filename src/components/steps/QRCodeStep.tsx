/* src/components/steps/QRCodeStep.tsx */
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { QrCode, Clock, RefreshCw, CheckCircle, AlertCircle, ArrowDown, Info } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import axios from 'axios';

const QRCodeStep: React.FC = () => {
  const { qrData, nextStep, setQrScanned, clientToken, restaurantName } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para el sistema de renovación automática del QR
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(30); // Segundos hasta la próxima actualización
  const [qrRefreshCount, setQrRefreshCount] = useState(0); // Contador de renovaciones
  const [qrJustRefreshed, setQrJustRefreshed] = useState(false); // Indicador de QR recién renovado
  const [currentQrCode, setCurrentQrCode] = useState(qrData.code); // Código QR actual

  const formatQrCode = (code: string) => {
    // Normaliza cadena base64 de distintos formatos
    if (code.startsWith('data:image/png;base64,')) return code;
    if (code.includes(',')) {
      const firstPart = code.split(',')[0];
      return `data:image/png;base64,${firstPart}`;
    }
    return `data:image/png;base64,${code}`;
  };
  
  // Función para generar un nombre de archivo seguro
  const getSafeFilename = () => {
    // Si no hay nombre de restaurante, usar un nombre genérico
    const baseFileName = restaurantName 
      ? `contactos_${restaurantName.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_')}` 
      : 'contactos_restaurante';
    
    // Añadir fecha actual al nombre
    const date = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    return `${baseFileName}_${date}.csv`;
  };

  // Función para forzar la descarga del archivo
  const downloadFile = (blob, filename) => {
    // Crear un URL para el blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear un elemento de enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Establecer el nombre del archivo
    
    // Ocultar el enlace
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Simular clic en el enlace para iniciar la descarga
    link.click();
    
    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  // Función para manejar la verificación y procesamiento de la respuesta del webhook
  const checkQrStatus = () => {
    axios.post(
      'https://webhook.lacocinaquevende.com/webhook/validarestadoqr',
      {
        instance: qrData.instance
      }
    )
    .then(response => {
      const { respuesta } = response.data;
      
      // Si la respuesta es "todo ok", proceder como si se hubiera presionado el botón continuar
      if (respuesta === 'todo ok') {
        handleAutomaticContinue();
      } 
      // Si la respuesta es un base64, actualizar el QR
      else if (respuesta && typeof respuesta === 'string') {
        setCurrentQrCode(respuesta);
        setQrRefreshCount(prev => prev + 1);
        setQrJustRefreshed(true);
        
        // Ocultar el mensaje de QR renovado después de 5 segundos
        setTimeout(() => {
          setQrJustRefreshed(false);
        }, 5000);
      }
    })
    .catch(error => {
      console.error('Error al verificar estado del QR:', error);
    });
  };
  
  // Función para manejar el avance automático (equivalente a handleQrScanned pero sin eventos de UI)
  const handleAutomaticContinue = () => {
    // Guardar datos de instancia para uso posterior
    localStorage.setItem('instance', qrData.instance);
    localStorage.setItem('clientToken', clientToken);
    
    // Avanzar al siguiente paso
    setQrScanned(true);
    nextStep();
    
    // Iniciar la verificación en segundo plano para descargar el archivo
    axios.post(
      'https://webhook.lacocinaquevende.com/webhook/verificar',
      {
        instance: qrData.instance,
        token: clientToken,
      },
      {
        responseType: 'blob', // Configurar para recibir datos binarios
      }
    )
    .then(response => {
      // Verificar si la respuesta es un archivo CSV
      const contentType = response.headers['content-type'];
      
      if (contentType && (contentType.includes('text/csv') || contentType.includes('application/octet-stream'))) {
        // Es un archivo CSV, forzar descarga
        const filename = getSafeFilename();
        downloadFile(response.data, filename);
      } else {
        // No es un archivo CSV, intentar analizar como JSON
        return response.data.text().then(text => {
          try {
            const data = JSON.parse(text);
            if (data.estado === 'error') {
              setError('error');
            }
          } catch (e) {
            // No es JSON, ignorar
          }
        });
      }
    })
    .catch((error) => {
      console.error('Error en la verificación:', error);
      
      // Intentar descargar directamente como alternativa
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `https://webhook.lacocinaquevende.com/webhook/verificar?instance=${qrData.instance}&token=${clientToken}`;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {
            // Ignorar errores de limpieza
          }
        }, 60000);
      } catch (iframeError) {
        console.error('Error al intentar descarga alternativa:', iframeError);
      }
    });
  };
  
  // Efecto para el contador de tiempo y verificación automática
  useEffect(() => {
    // Inicializar el QR actual
    setCurrentQrCode(qrData.code);
    
    // Contador para reducir el tiempo hasta la próxima actualización
    const timerInterval = setInterval(() => {
      setTimeUntilRefresh(prev => {
        // Si llega a 0, reiniciar a 30 segundos y verificar estado
        if (prev <= 1) {
          checkQrStatus();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Limpiar intervalo cuando el componente se desmonte
    return () => clearInterval(timerInterval);
  }, []);

  if (error === 'error') {
    return (
      <div className="flex flex-col items-center">
        <h2 className="card-title text-center text-red-500">
          Oh no, hemos tenido un pequeño problema con el sistema.
        </h2>
        <a
          href="https://wa.me/573147746150"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4"
        >
          Contactar a soporte técnico
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gold/10 p-4 rounded-full mb-4">
        <QrCode className="h-12 w-12 text-gold" />
      </div>

      <h2 className="card-title text-center mb-6">
        {isLoading
          ? 'Estamos cocinando la mejor receta para un restaurante exitoso'
          : 'Sigue estos pasos para vincular tu WhatsApp'}
      </h2>
      
      {/* Instrucciones y videos primero */}
      {!isLoading && (
        <div className="w-full space-y-6 mb-6 border-gold border rounded-lg p-4 bg-cream/30">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Info className="text-gold h-5 w-5" />
            <p className="text-center font-medium">Paso 1: Lee el código QR con tu teléfono siguiendo estas instrucciones</p>
          </div>
          
          {/* Video iPhone */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <span className="bg-gold/20 text-gold text-sm font-bold rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
              iPhone
            </h3>
            <div className="aspect-video w-full">
              <iframe
                src="https://www.loom.com/embed/aeab6cfec18445a7af93eca530846f94"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.innerHTML = 'No se pudo cargar el video. <a href="https://www.loom.com/share/aeab6cfec18445a7af93eca530846f94" target="_blank" rel="noopener noreferrer" class="text-terracotta underline">Ver en Loom</a>';
                  fallback.className = 'p-4 border border-gold bg-cream text-brown rounded-lg text-center';
                  e.currentTarget.parentNode.appendChild(fallback);
                }}
              ></iframe>
            </div>
          </div>

          {/* Video Android */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <span className="bg-gold/20 text-gold text-sm font-bold rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
              Android
            </h3>
            <div className="aspect-video w-full">
              <iframe
                src="https://www.loom.com/embed/1502e1a0acb34477a0886c4684eeff57"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.innerHTML = 'No se pudo cargar el video. <a href="https://www.loom.com/share/1502e1a0acb34477a0886c4684eeff57" target="_blank" rel="noopener noreferrer" class="text-terracotta underline">Ver en Loom</a>';
                  fallback.className = 'p-4 border border-gold bg-cream text-brown rounded-lg text-center';
                  e.currentTarget.parentNode.appendChild(fallback);
                }}
              ></iframe>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <ArrowDown className="h-8 w-8 text-gold animate-bounce" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="text-gold h-5 w-5" />
            <p className="text-center font-medium">Paso 2: Escanea este código QR con tu teléfono</p>
          </div>
        </div>
      )}

      {/* QR Code */}
      <div className="w-full flex flex-col items-center mb-4">
        {isLoading ? (
          <div className="h-64 w-64 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="border-4 border-gold p-2 rounded-lg animate-cook relative">
              <img
                src={formatQrCode(currentQrCode)}
                alt="QR Code"
                className="h-64 w-64"
              />
              
              {/* Mensaje de QR recién renovado */}
              {qrJustRefreshed && (
                <div className="absolute inset-0 bg-gold/90 flex items-center justify-center rounded-lg animate-pulse">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <RefreshCw className="h-6 w-6 text-gold mx-auto mb-2 animate-spin" />
                    <p className="text-brown font-medium">¡Nuevo código QR generado!</p>
                    <p className="text-brown/70 text-sm">Inténtalo de nuevo</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Contador e información */}
            <div className="flex items-center mt-3 text-brown/70">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {qrRefreshCount > 0 
                  ? `Nuevo QR en ${timeUntilRefresh} segundos` 
                  : `Renovando QR en ${timeUntilRefresh} segundos`}
              </span>
            </div>
            
            {qrRefreshCount > 0 && (
              <p className="text-sm text-brown/60 mt-2 text-center">
                Si acabaste de intentar leer el QR y no funcionó, espera un momento para el siguiente código.
              </p>
            )}
          </>
        )}
      </div>
      
      {/* Nota informativa */}
      <div className="w-full bg-cream/50 rounded-lg p-3 border border-gold/30 mt-2 mb-4">
        <p className="text-sm text-center text-brown/80">
          <Info className="inline h-4 w-4 mr-1 text-gold" />
          Renovamos el código QR cada 30 segundos para asegurar la mejor experiencia. Si has escaneado el código correctamente, avanzarás automáticamente.
        </p>
      </div>
    </div>
  );
};

export default QRCodeStep;