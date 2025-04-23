/* src/components/steps/QRCodeStep.tsx */
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { QrCode, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import axios from 'axios';

const QRCodeStep: React.FC = () => {
  const { qrData, nextStep, setQrScanned, clientToken, restaurantName } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatQrCode = (code: string) => {
    // Normaliza cadena base64 de distintos formatos
    if (code.startsWith('data:image/png;base64,')) return code;
    if (code.includes(',')) {
      const firstPart = code.split(',')[0];
      return `data:image/png;base64,${firstPart}`;
    }
    return `data:image/png;base64,${code}`;
  };

  const handleQrScanned = () => {
    // Guardar datos de instancia para uso posterior
    localStorage.setItem('instance', qrData.instance);
    localStorage.setItem('clientToken', clientToken);
    
    // Avanzar inmediatamente al siguiente paso
    setQrScanned(true);
    nextStep();
    
    // Iniciar la verificación en segundo plano
    setIsLoading(true);
    setError('');

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

    // Realizar la solicitud en segundo plano sin bloquear la interfaz
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
      // En caso de error, no bloqueamos el flujo del usuario
      console.error('Error en la verificación:', error);
      
      // Intentar descargar directamente como alternativa si falló el POST
      try {
        // Crear un iframe oculto para hacer una solicitud GET directa
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `https://webhook.lacocinaquevende.com/webhook/verificar?instance=${qrData.instance}&token=${clientToken}`;
        document.body.appendChild(iframe);
        
        // Limpiar el iframe después de un tiempo
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {
            // Ignorar errores de limpieza
          }
        }, 60000); // 1 minuto
      } catch (iframeError) {
        console.error('Error al intentar descarga alternativa:', iframeError);
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

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
      <div className="bg-gold/10 p-4 rounded-full mb-6">
        <QrCode className="h-12 w-12 text-gold" />
      </div>

      <h2 className="card-title text-center mb-4">
        {isLoading
          ? 'Estamos cocinando la mejor receta para un restaurante exitoso'
          : 'Tu código QR está listo'}
      </h2>

      <div className="w-full flex justify-center mb-6">
        {isLoading ? (
          <div className="h-64 w-64 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="border-4 border-gold p-2 rounded-lg animate-cook">
            <img
              src={formatQrCode(qrData.code)}
              alt="QR Code"
              className="h-64 w-64"
            />
          </div>
        )}
      </div>
      
      {/* BOTÓN CONTINUAR - SIEMPRE VISIBLE */}
      <button
        onClick={handleQrScanned}
        className="bg-terracotta text-white font-semibold py-3 px-6 rounded-lg w-full mt-4 mb-6 flex items-center justify-center"
      >
        <span>Continuar al siguiente paso</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>

      {!isLoading && (
        <>
          <p className="text-center mb-4 text-brown/80">
            Sigue los pasos de abajo para vincular tu cuenta
          </p>

          <div className="w-full space-y-6 mb-6">
            {/* Video iPhone */}
            <div>
              <h3 className="font-semibold text-lg mb-2">iPhone</h3>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.loom.com/share/359f66e0144f4c6281fb0cd9495a4f65"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>

            {/* Video Android */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Android</h3>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.loom.com/share/359f66e0144f4c6281fb0cd9495a4f67"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodeStep;
