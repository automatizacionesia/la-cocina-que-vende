import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 border-4 border-gold/30 rounded-full animate-spin"></div>
      <div className="absolute inset-0 border-t-4 border-terracotta rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-b-4 border-sage rounded-full animate-spin-slow"></div>
    </div>
  );
};

export default LoadingSpinner;