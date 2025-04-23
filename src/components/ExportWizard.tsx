import React from 'react';
import { useAppContext } from '../context/AppContext';
import WelcomeStep from './steps/WelcomeStep';
import QRCodeStep from './steps/QRCodeStep';
import DownloadStep from './steps/DownloadStep';
import StepIndicator from './ui/StepIndicator';
import { CookingPot, Heart } from 'lucide-react';

const ExportWizard: React.FC = () => {
  const { currentStep } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 pattern-bg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <CookingPot className="text-terracotta mr-2 h-8 w-8" />
          <h1 className="text-2xl md:text-3xl font-semibold text-brown">
            La Cocina que Vende
          </h1>
        </div>
        <p className="text-lg text-brown/80">
          Herramienta de Exportación de Contactos
        </p>
      </div>

      <StepIndicator />

      <div className="card w-full max-w-md transition-all duration-500">
        {currentStep === 1 && <WelcomeStep />}
        {currentStep === 2 && <QRCodeStep />}
        {currentStep === 3 && <DownloadStep />}
      </div>

      <div className="mt-8 text-sm text-brown/60 text-center">
        <p>© {new Date().getFullYear()} La Cocina que Vende. Todos los derechos reservados.</p>
        <p className="mt-1 text-xs flex items-center justify-center">
          Hecho con <Heart className="h-3 w-3 mx-1 text-terracotta fill-terracotta" /> por Juan Diego Diaz para La Cocina que Vende
        </p>
      </div>
    </div>
  );
};

export default ExportWizard;