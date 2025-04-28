import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
  iconSize?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = 'top',
  showIcon = true,
  iconSize = 16,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gold border-r-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gold border-r-transparent border-t-transparent border-l-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gold border-t-transparent border-r-transparent border-b-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gold border-t-transparent border-l-transparent border-b-transparent',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="inline-flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {children}
        {showIcon && !children && (
          <HelpCircle
            size={iconSize}
            className="text-gold cursor-help"
          />
        )}
      </div>

      {showTooltip && (
        <div
          className={`absolute z-50 ${positionClasses[position]}`}
        >
          <div className="bg-gold/90 text-white text-sm rounded-lg py-2 px-3 shadow-lg max-w-xs">
            {text}
          </div>
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Tooltip);