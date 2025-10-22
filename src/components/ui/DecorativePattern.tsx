import React from 'react';

interface DecorativePatternProps {
  color?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
}

const DecorativePattern: React.FC<DecorativePatternProps> = ({ color = 'bg-blue-100', position = 'top-right', size = 'md' }) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'lg':
        return 'w-32 h-32';
      case 'md':
      default:
        return 'w-24 h-24';
    }
  };

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return '-ml-8 -mt-8';
      case 'bottom-right':
        return '-mr-8 -mb-8';
      case 'bottom-left':
        return '-ml-8 -mb-8';
      case 'top-right':
      default:
        return '-mr-8 -mt-8';
    }
  };

  const sizeClasses = getSizeClasses(size);
  const positionClasses = getPositionClasses(position);

  return (
    <div className="absolute pointer-events-none">
      {/* Main circle */}
      <div
        className={`
          ${sizeClasses} ${color} rounded-full opacity-50
          ${positionClasses}
        `}
      />

      {/* Smaller accent circle */}
      <div
        className={`
          ${size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}
          ${color} rounded-full opacity-30
          ${positionClasses}
          ${position.includes('right') ? 'ml-4' : '-ml-4'}
          ${position.includes('bottom') ? '-mt-2' : 'mt-2'}
        `}
      />

      {/* Tiny dot */}
      <div
        className={`
          ${size === 'lg' ? 'w-2 h-2' : size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5'}
          ${color} rounded-full opacity-40
          ${positionClasses}
          ${position.includes('right') ? 'ml-8' : '-ml-8'}
          ${position.includes('bottom') ? '-mt-4' : 'mt-4'}
        `}
      />
    </div>
  );
};

export default React.memo(DecorativePattern);
