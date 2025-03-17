import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeType, DailyQuote } from '../types';
import { quotes } from '../data/quotes';

const themes: Record<ThemeType, Theme> = {
  neon: {
    id: 'neon',
    name: 'Neon Night',
    bgGradient: 'bg-gradient-to-br from-blue-900 via-black to-purple-900',
    cardBg: 'bg-black/60',
    accentGradient: 'from-blue-500 via-purple-500 to-pink-500',
    textPrimary: 'text-blue-400',
    textSecondary: 'text-purple-300',
    buttonGradient: 'from-blue-600 to-purple-600',
    borderAccent: 'border-blue-500/30',
    buttonActiveGradient: 'from-blue-700 to-purple-700'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk',
    bgGradient: 'bg-gradient-to-br from-yellow-900 via-black to-red-900',
    cardBg: 'bg-black/60',
    accentGradient: 'from-yellow-500 via-red-500 to-pink-500',
    textPrimary: 'text-yellow-400',
    textSecondary: 'text-red-300',
    buttonGradient: 'from-yellow-600 to-red-600',
    borderAccent: 'border-yellow-500/30',
    buttonActiveGradient: 'from-yellow-700 to-red-700'
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    bgGradient: 'bg-gradient-to-br from-pink-900 via-black to-indigo-900',
    cardBg: 'bg-black/60',
    accentGradient: 'from-pink-500 via-purple-500 to-indigo-500',
    textPrimary: 'text-pink-400',
    textSecondary: 'text-indigo-300',
    buttonGradient: 'from-pink-600 to-indigo-600',
    borderAccent: 'border-pink-500/30',
    buttonActiveGradient: 'from-pink-700 to-indigo-700'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    bgGradient: 'bg-gradient-to-br from-green-900 via-black to-emerald-900',
    cardBg: 'bg-black/60',
    accentGradient: 'from-green-500 to-emerald-500',
    textPrimary: 'text-green-400',
    textSecondary: 'text-emerald-300',
    buttonGradient: 'from-green-600 to-emerald-600',
    borderAccent: 'border-green-500/30',
    buttonActiveGradient: 'from-green-700 to-emerald-700'
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: ThemeType) => void;
  themes: Record<ThemeType, Theme>;
  userName: string;
  setUserName: (name: string) => void;
  customQuote: DailyQuote | null;
  setCustomQuote: (quote: DailyQuote) => void;
  profileImage: string;
  setProfileImage: (imageUrl: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.neon);
  const [userName, setUserName] = useState<string>("Gamer");
  const [customQuote, setCustomQuote] = useState<DailyQuote | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");

  // Load user preferences from localStorage on mount
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme as ThemeType]) {
      setCurrentTheme(themes[savedTheme as ThemeType]);
    }
    
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }

    const savedQuote = localStorage.getItem('customQuote');
    if (savedQuote) {
      try {
        setCustomQuote(JSON.parse(savedQuote));
      } catch (e) {
        console.error("Error parsing saved quote:", e);
      }
    }
    
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const setTheme = (themeId: ThemeType) => {
    setCurrentTheme(themes[themeId]);
    localStorage.setItem('theme', themeId);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      themes,
      userName,
      setUserName,
      customQuote,
      setCustomQuote,
      profileImage,
      setProfileImage
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};