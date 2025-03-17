import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import SideQuestsPage from './pages/SideQuestsPage';
import SettingsPage from './pages/SettingsPage';
import Navigation from './components/Navigation';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Router>
          <AppContent />
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`min-h-screen h-screen flex flex-col ${currentTheme.bgGradient}`}>
      <ThemeSwitcher />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/side-quests" element={<SideQuestsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <Navigation />
    </div>
  );
};

export default App;