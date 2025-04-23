import React, { useEffect, useState } from 'react';

const SuccessConfetti: React.FC = () => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const colors = ['#E27D60', '#E8A87C', '#84A59D'];
    const newParticles: JSX.Element[] = [];
    
    // Create confetti particles
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push(
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-0"
          style={{
            left: `${left}%`,
            backgroundColor: color,
            top: '-20px',
            animation: `confetti 3s ease-in forwards ${animationDelay}s`,
          }}
        />
      );
    }
    
    setParticles(newParticles);
    
    // Clean up particles after animation completes
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      {particles}
    </div>
  );
};

export default SuccessConfetti;