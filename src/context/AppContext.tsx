import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definición de pasos del wizard
export type Step = 1 | 2 | 3;

// Datos que retorna el webhook de creación de QR
export interface QrData {
  code: string;
  instance: string;
}

// Context API: tipos expuestos
export interface AppContextType {
  currentStep: Step;
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: Step) => void;
  qrScanned: boolean;
  setQrScanned: (scanned: boolean) => void;
  downloadStarted: boolean;
  setDownloadStarted: (started: boolean) => void;
  qrData: QrData;
  setQrData: (data: QrData) => void;
  clientToken: string; // Token único válido por 24 h
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [qrScanned, setQrScanned] = useState<boolean>(false);
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);
  const [qrData, setQrData] = useState<QrData>({ code: '', instance: '' });
  const [clientToken, setClientToken] = useState<string>('');

  // Generar o recuperar token único (24 h)
  useEffect(() => {
    const stored = localStorage.getItem('clientToken');
    const expiry = localStorage.getItem('clientTokenExpiry');
    const now = Date.now();
    if (stored && expiry && Number(expiry) > now) {
      setClientToken(stored);
    } else {
      const newToken = crypto.randomUUID();
      const expiresAt = now + 24 * 60 * 60 * 1000; // 24 h en ms
      localStorage.setItem('clientToken', newToken);
      localStorage.setItem('clientTokenExpiry', expiresAt.toString());
      setClientToken(newToken);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <AppContext.Provider
      value={{
        currentStep,
        restaurantName,
        setRestaurantName,
        nextStep,
        prevStep,
        goToStep,
        qrScanned,
        setQrScanned,
        downloadStarted,
        setDownloadStarted,
        qrData,
        setQrData,
        clientToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
