import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Download, FileText, Clock, RefreshCw } from 'lucide-react';
import SuccessConfetti from '../ui/SuccessConfetti';

const DownloadStep: React.FC = () => {
  const { restaurantName, setDownloadStarted, downloadStarted } = useAppContext();
  const [showBackupButton, setShowBackupButton] = useState(false);
  
  // Activar confetti al cargar el componente y configurar el timer para el botón de respaldo
  useEffect(() => {
    if (!downloadStarted) {
      setDownloadStarted(true);
    }
    
    // Mostrar el botón de respaldo después de 10 segundos (si la descarga automática no funcionó)
    const timer = setTimeout(() => {
      setShowBackupButton(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Función para descargar manualmente el archivo
  const downloadManually = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // Usar el nuevo webhook verificarx2 con solo el parámetro de instancia
    iframe.src = `https://webhook.lacocinaquevende.com/webhook/verificarx2?instance=${localStorage.getItem('instance') || ''}`;
    document.body.appendChild(iframe);
    
    // Limpiar el iframe después de un tiempo
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch (e) {
        // Ignorar errores de limpieza
      }
    }, 60000); // 1 minuto
  };

  return (
    <div className="flex flex-col items-center">
      {downloadStarted && <SuccessConfetti />}
      
      <div className="bg-sage/10 p-4 rounded-full mb-6">
        <Download className="h-12 w-12 text-sage" />
      </div>
      
      <h2 className="card-title text-center">
        Gracias por confiar en nuestro servicio ❤️
      </h2>
      
      <div className="bg-cream/50 border border-sage/30 rounded-lg p-4 mb-6 flex items-center">
        <Clock className="h-6 w-6 text-sage mr-3 flex-shrink-0" />
        <p className="text-brown/90">
          Por favor espera, el documento con tus contactos aparecerá en tu carpeta de descargas en breve.
        </p>
      </div>
      
      {/* Botón de respaldo que aparece después de 10 segundos */}
      {showBackupButton && (
        <button 
          onClick={downloadManually} 
          className="bg-sage/20 border border-sage text-brown/80 font-medium py-2 px-4 rounded-lg mb-6 flex items-center justify-center hover:bg-sage/30 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          ¿No aparece tu archivo? Haz clic aquí para descargarlo
        </button>
      )}
      
      <p className="text-center mb-6 text-brown/80">
        Mientras esperas, sigue los pasos de aquí abajo para continuar:
      </p>

      <div className="w-full space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Paso 1: Borrar WhatsApp</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">iPhone</h4>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.loom.com/embed/44ab211e65ca4cb2ba2ae2f4a79ea8a6"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.innerHTML = 'No se pudo cargar el video. <a href="https://www.loom.com/share/44ab211e65ca4cb2ba2ae2f4a79ea8a6" target="_blank" rel="noopener noreferrer" class="text-terracotta underline">Ver en Loom</a>';
                    fallback.className = 'p-4 border border-gold bg-cream text-brown rounded-lg text-center';
                    e.currentTarget.parentNode.appendChild(fallback);
                  }}
                ></iframe>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Android</h4>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.loom.com/embed/73f28bed87d548fcbc5ab742a90e1ce6"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.innerHTML = 'No se pudo cargar el video. <a href="https://www.loom.com/share/73f28bed87d548fcbc5ab742a90e1ce6?sid=3bba513d-5a61-4af5-9dbb-a65988e5393c" target="_blank" rel="noopener noreferrer" class="text-terracotta underline">Ver en Loom</a>';
                    fallback.className = 'p-4 border border-gold bg-cream text-brown rounded-lg text-center';
                    e.currentTarget.parentNode.appendChild(fallback);
                  }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Paso 2: Cómo importar tus contactos y la info que necesites</h3>
          <div className="aspect-video w-full">
            <iframe
            src="https://www.loom.com/embed/bb28dc8b307544f184815e9b0be0f474"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.innerHTML = 'No se pudo cargar el video. <a href="https://www.loom.com/share/bb28dc8b307544f184815e9b0be0f474?sid=7454a4bd-26ef-454c-8b69-d4e90ec6c6dd" target="_blank" rel="noopener noreferrer" class="text-terracotta underline">Ver en Loom</a>';
                fallback.className = 'p-4 border border-gold bg-cream text-brown rounded-lg text-center';
                e.currentTarget.parentNode.appendChild(fallback);
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadStep;