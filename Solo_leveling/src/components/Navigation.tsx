import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ListTodo, Compass, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tasks', icon: ListTodo, label: 'Daily Quests' },
    { path: '/side-quests', icon: Compass, label: 'Side Quests' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="backdrop-blur-sm border-t border-white/10 p-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'backdrop-blur-sm bg-white/20 text-white' 
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;