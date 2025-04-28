import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Download, FileText, Clock, RefreshCw } from 'lucide-react';
import SuccessConfetti from '../ui/SuccessConfetti';
import { OptimizedVideo } from '../ui/VideoPlayer';

const DownloadStep: React.FC = () => {
  const { restaurantName, setDownloadStarted, downloadStarted } = useAppContext();
  const [showBackupButton, setShowBackupButton] = useState(false);
  
  // Activar confetti al cargar el componente, resetear scroll y configurar el timer para el botón de respaldo
  useEffect(() => {
    // Mover scroll al inicio de la página - asegura que se vea desde arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Mostrar indicador de carga en el botón
    const button = document.getElementById('backup-download-btn');
    if (button) {
      button.classList.add('opacity-70');
      button.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Descargando...';
    }
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // Usar el nuevo webhook verificarx2 con solo el parámetro de instancia
    iframe.src = `https://webhook.lacocinaquevende.com/webhook/verificarx2?instance=${localStorage.getItem('instance') || ''}`;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      // Restaurar el botón después de un tiempo
      if (button) {
        button.classList.remove('opacity-70');
        button.innerHTML = '<svg class="-ml-1 mr-2 h-4 w-4 text-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Descargar contactos';
      }
    }, 5000); // 5 segundos
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
          id="backup-download-btn"
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

      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Paso 1: Borrar WhatsApp</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <h4 className="font-medium mb-2">iPhone</h4>
                <OptimizedVideo 
                  src="https://www.loom.com/embed/44ab211e65ca4cb2ba2ae2f4a79ea8a6" 
                  title="Tutorial borrar WhatsApp iPhone"
                  loomShareUrl="https://www.loom.com/share/44ab211e65ca4cb2ba2ae2f4a79ea8a6"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <h4 className="font-medium mb-2">Android</h4>
                <OptimizedVideo 
                  title="Tutorial borrar WhatsApp Android"
                  src="https://www.loom.com/embed/73f28bed87d548fcbc5ab742a90e1ce6" 
                  loomShareUrl="https://www.loom.com/share/73f28bed87d548fcbc5ab742a90e1ce6?sid=3bba513d-5a61-4af5-9dbb-a65988e5393c"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Paso 2: Cómo importar tus contactos y la info que necesites</h3>
          <OptimizedVideo 
            src="https://www.loom.com/embed/bb28dc8b307544f184815e9b0be0f474" 
            title="Tutorial importar contactos"
            loomShareUrl="https://www.loom.com/share/bb28dc8b307544f184815e9b0be0f474?sid=7454a4bd-26ef-454c-8b69-d4e90ec6c6dd"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadStep;