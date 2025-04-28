import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 rounded-full bg-gold/90 dark:bg-gold/70 text-white shadow-md hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-cream" />
      ) : (
        <Moon size={20} className="text-brown" />
      )}
    </button>
  );
};

export default ThemeToggle;