import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button 
          className={`p-2 rounded-full bg-gradient-to-r ${currentTheme.buttonGradient} text-white`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Palette className="w-5 h-5" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-black/80 rounded-lg shadow-xl">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-white/10 ${
                  currentTheme.id === theme.id ? `${theme.textPrimary}` : 'text-white'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;