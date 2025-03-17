import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { DailyQuote, User } from '../types';
import { Save, Check, Upload, Zap } from 'lucide-react';

const SettingsPage = () => {
  const { currentTheme, userName, setUserName, customQuote, setCustomQuote, profileImage, setProfileImage } = useTheme();
  const { streakCount, xpMultiplier } = useTasks();
  
  const [user, setUser] = useState<User>({
    name: userName,
    level: 23,
    xp: 2153,
    streaks: 155,
    selectedQuote: 0,
    achievements: []
  });

  const [newQuote, setNewQuote] = useState<DailyQuote>({
    id: 999,
    text: customQuote?.text || "",
    author: customQuote?.author || ""
  });

  const [savedChanges, setSavedChanges] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when context values change
  useEffect(() => {
    setUser(prev => ({ ...prev, name: userName }));
    setNewQuote({
      id: 999,
      text: customQuote?.text || "",
      author: customQuote?.author || ""
    });
  }, [userName, customQuote]);

  // Reset saved message after 3 seconds
  useEffect(() => {
    if (savedChanges) {
      const timer = setTimeout(() => {
        setSavedChanges(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [savedChanges]);

  const handleSaveSettings = () => {
    // Start save animation
    setSaveAnimation(true);
    
    // Update the context with new values
    setUserName(user.name);
    
    if (newQuote.text && newQuote.author) {
      setCustomQuote(newQuote);
    }
    
    // Update localStorage to persist changes
    localStorage.setItem('userName', user.name);
    
    if (newQuote.text && newQuote.author) {
      localStorage.setItem('customQuote', JSON.stringify(newQuote));
    }
    
    // Show success message after a short delay
    setTimeout(() => {
      setSaveAnimation(false);
      setSavedChanges(true);
    }, 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get streak multiplier info text
  const getStreakMultiplierText = () => {
    if (streakCount >= 180) {
      return "You've reached the maximum 2x XP multiplier!";
    } else if (streakCount >= 30) {
      return `Current: 1.5x XP | Next: 2x at 180 days (${180 - streakCount} days left)`;
    } else if (streakCount >= 7) {
      return `Current: 1.25x XP | Next: 1.5x at 30 days (${30 - streakCount} days left)`;
    } else {
      return `No multiplier yet | Next: 1.25x at 7 days (${7 - streakCount} days left)`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`flex-1 ${currentTheme.cardBg} p-6 overflow-auto`}>
        <h1 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-6`}>Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className={`p-4 rounded-xl border ${currentTheme.borderAccent} bg-black/30`}>
            <h2 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-4`}>Profile</h2>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full backdrop-blur-sm bg-white/10 p-1 overflow-hidden">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className={`block text-sm ${currentTheme.textSecondary} mb-1`}>Username</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className={`w-full bg-black/50 text-white rounded-lg px-4 py-2 border ${currentTheme.borderAccent}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* XP Multiplier Info */}
          <div className={`p-4 rounded-xl border ${currentTheme.borderAccent} bg-black/30`}>
            <h2 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-4 flex items-center`}>
              <Zap className="w-5 h-5 mr-2" />
              XP Multiplier
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Current Streak:</span>
                <span className="text-white font-bold">{streakCount} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Current Multiplier:</span>
                <span className={`font-bold ${
                  xpMultiplier >= 2 ? 'text-yellow-300' :
                  xpMultiplier >= 1.5 ? 'text-orange-300' :
                  xpMultiplier >= 1.25 ? 'text-green-300' : 'text-white'
                }`}>{xpMultiplier}x</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    xpMultiplier >= 2 ? 'bg-yellow-400' :
                    xpMultiplier >= 1.5 ? 'bg-orange-400' :
                    xpMultiplier >= 1.25 ? 'bg-green-400' : 'bg-gray-600'
                  }`}
                  style={{ 
                    width: streakCount >= 180 ? '100%' : 
                           streakCount >= 30 ? `${((streakCount - 30) / (180 - 30)) * 33 + 67}%` :
                           streakCount >= 7 ? `${((streakCount - 7) / (30 - 7)) * 33 + 34}%` :
                           `${(streakCount / 7) * 33}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-white/60 px-1">
                <span>7 days</span>
                <span>30 days</span>
                <span>180 days</span>
              </div>
              <p className="text-sm text-white/70 mt-2">{getStreakMultiplierText()}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-white/80">
                  <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
                  <span>7+ days: 1.25x XP multiplier</span>
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
                  <span>30+ days: 1.5x XP multiplier</span>
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                  <span>180+ days: 2x XP multiplier (maximum)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Quote Settings */}
          <div className={`p-4 rounded-xl border ${currentTheme.borderAccent} bg-black/30`}>
            <h2 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-4`}>Custom Quote</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm ${currentTheme.textSecondary} mb-1`}>Quote Text (max 2 lines)</label>
                <textarea
                  value={newQuote.text}
                  onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                  maxLength={120}
                  rows={2}
                  className={`w-full bg-black/50 text-white rounded-lg px-4 py-2 border ${currentTheme.borderAccent} resize-none`}
                  placeholder="Enter your custom quote here..."
                />
                <div className="text-right text-xs text-white/50 mt-1">
                  {newQuote.text.length}/120 characters
                </div>
              </div>
              <div>
                <label className={`block text-sm ${currentTheme.textSecondary} mb-1`}>Author</label>
                <input
                  type="text"
                  value={newQuote.author}
                  onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                  className={`w-full bg-black/50 text-white rounded-lg px-4 py-2 border ${currentTheme.borderAccent}`}
                  placeholder="Author name"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={saveAnimation}
            className={`w-full bg-gradient-to-r ${currentTheme.buttonGradient} text-white py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center ${saveAnimation ? 'scale-95' : ''}`}
          >
            {saveAnimation ? (
              <span className="animate-pulse flex items-center">
                Saving <span className="ml-2 animate-spin">⟳</span>
              </span>
            ) : savedChanges ? (
              <span className="flex items-center">
                <Check className="w-5 h-5 mr-2" /> Settings Saved
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" /> Save Settings
              </span>
            )}
          </button>

          {/* Saved Message */}
          {savedChanges && (
            <div className="text-center text-green-400 mt-2 animate-pulse">
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;