import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChefHat } from 'lucide-react';
import axios from 'axios';

const WelcomeStep: React.FC = () => {
  const { setRestaurantName, nextStep, setQrData, clientToken } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Mensajes dinámicos relacionados con cocina y restaurantes
  const loadingMessages = [
    "Preparando los ingredientes...",
    "Calentando el horno...",
    "Amasando la base perfecta...",
    "Añadiendo un toque de sabor...",
    "Generando conexiones culinarias...",
    "Sirviendo tu experiencia gourmet..."
  ];
  
  // Efecto para rotar los mensajes mientras carga
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000); // Cambiar mensaje cada 2 segundos
    
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError('Por favor ingresa el nombre de tu restaurante');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://webhook.lacocinaquevende.com/webhook/crearqr',
        {
          restaurantName: inputValue,
          token: clientToken,
        }
      );

      const { codigo, instancia } = response.data;
      setQrData({ code: codigo, instance: instancia });
      setRestaurantName(inputValue);
      nextStep();
    } catch (error) {
      setError('Error al procesar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-terracotta/10 p-4 rounded-full mb-6">
        <ChefHat className="h-12 w-12 text-terracotta" />
      </div>

      <h2 className="card-title text-center">
        Bienvenido a la herramienta de exportación de contactos
      </h2>

      <p className="text-center mb-6 text-brown/80">
        En solo tres pasos simples, exportarás tu base de datos de contactos
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="restaurantName" className="block mb-2 font-medium text-brown">
            Nombre de tu restaurante
          </label>
          <input
            type="text"
            id="restaurantName"
            className={`input-primary ${error ? 'border-red-500' : ''}`}
            placeholder="Ej: Sabores de Colombia"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
        </div>

        <div className="progress-bar mb-4">
          <div className="progress-bar-fill" style={{ width: '33%' }}></div>
        </div>

        <button
          type="submit"
          className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? loadingMessages[currentMessageIndex] : 'Continuar'}
        </button>
      </form>
    </div>
  );
};

export default WelcomeStep;