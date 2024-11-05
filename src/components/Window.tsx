import React, { useState } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
  children?: React.ReactNode;
  isMobile?: boolean;
}

const Window: React.FC<WindowProps> = ({ title, icon, isActive, onClose, onClick, children, isMobile }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className={`absolute ${
        isMaximized ? 'top-0 left-0 right-0 bottom-12' : 'top-4 left-4 right-4 bottom-16'
      } bg-white rounded-lg shadow-xl overflow-hidden flex flex-col ${
        isActive ? 'z-10' : 'z-0'
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleMinimize}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleMaximize}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-red-500 hover:text-white rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Window;