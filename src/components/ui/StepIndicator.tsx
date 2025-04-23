import React from 'react';
import { useAppContext } from '../../context/AppContext';

const StepIndicator: React.FC = () => {
  const { currentStep } = useAppContext();

  return (
    <div className="step-indicator">
      <div className={`step-dot ${currentStep === 1 ? 'step-active' : 'step-completed'}`}></div>
      <div className={`step-dot ${
        currentStep === 2 
          ? 'step-active' 
          : currentStep > 2 
            ? 'step-completed' 
            : 'step-upcoming'
      }`}></div>
      <div className={`step-dot ${currentStep === 3 ? 'step-active' : 'step-upcoming'}`}></div>
    </div>
  );
};

export default StepIndicator;