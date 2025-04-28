import React, { lazy, Suspense } from 'react';
import { useAppContext } from '../context/AppContext';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
// Lazy loading de componentes
const WelcomeStep = lazy(() => import('./steps/WelcomeStep'));
const QRCodeStep = lazy(() => import('./steps/QRCodeStep'));
const DownloadStep = lazy(() => import('./steps/DownloadStep'));

// Componente de carga mientras se cargan los pasos
const StepLoading = () => (
  <div className="flex flex-col items-center justify-center w-full p-8">
    <div className="w-12 h-12 rounded-full border-4 border-terracotta border-r-transparent animate-spin mb-4"></div>
    <p className="text-brown font-medium">Cargando...</p>
  </div>
);
import StepIndicator from './ui/StepIndicator';
import { CookingPot, Heart } from 'lucide-react';

const ExportWizard: React.FC = () => {
  const { currentStep } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 pattern-bg">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center mb-2">
          <CookingPot className="text-terracotta mr-2 h-6 w-6 sm:h-8 sm:w-8" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-brown">
            La Cocina que Vende
          </h1>
        </div>
        <p className="text-md sm:text-lg text-brown/80">
          Herramienta de Exportación de Contactos
        </p>
      </div>

      <StepIndicator />

      <div className="card w-full max-w-xs sm:max-w-sm md:max-w-md overflow-hidden">
        <Suspense fallback={<StepLoading />}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={currentStep}
              timeout={300}
              classNames="fade-slide"
              unmountOnExit
            >
              <div>
                {currentStep === 1 && <WelcomeStep />}
                {currentStep === 2 && <QRCodeStep />}
                {currentStep === 3 && <DownloadStep />}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Suspense>
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