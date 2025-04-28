import React, { useState, useEffect } from 'react';

interface OptimizedVideoProps {
  src: string;
  title: string;
  loomShareUrl: string;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({ src, title, loomShareUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Precargar el iframe
  useEffect(() => {
    const img = new Image();
    img.src = 'https://cdn.loom.com/sessions/thumbnails/new-placeholder-4096w.jpg';
  }, []);

  return (
    <div className="aspect-video w-full relative rounded-lg overflow-hidden">
      {/* Mostrar un placeholder mientras carga */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-cream flex flex-col items-center justify-center gap-2 z-10">
          <div className="animate-pulse flex items-center justify-center w-16 h-16 rounded-full bg-gold/20">
            <svg className="w-8 h-8 text-gold" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-brown font-medium">Cargando video...</p>
        </div>
      )}

      {/* Mostrar un mensaje de error si falla la carga */}
      {hasError && (
        <div className="absolute inset-0 p-4 border border-gold bg-cream text-brown rounded-lg text-center flex flex-col items-center justify-center">
          <p>No se pudo cargar el video.</p>
          <a 
            href={loomShareUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-terracotta underline font-medium mt-2 hover:text-terracotta/80 transition-colors"
          >
            Ver en Loom
          </a>
        </div>
      )}

      {/* El iframe real */}
      <iframe
        src={src}
        frameBorder="0"
        allowFullScreen
        className={`w-full h-full rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        title={title}
      ></iframe>
    </div>
  );
};

export default React.memo(OptimizedVideo);