import React from 'react';
import { X, CheckCircle, Flame, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const AchievementsDisplay = ({ onClose }: { onClose: () => void }) => {
  const { currentTheme } = useTheme();
  const { achievements } = useTasks();
  
  // Group achievements by category
  const taskAchievements = achievements.filter(a => a.category === 'task');
  const streakAchievements = achievements.filter(a => a.category === 'streak');
  const levelAchievements = achievements.filter(a => a.category === 'level');
  
  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl ${currentTheme.cardBg} border ${currentTheme.borderAccent} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${currentTheme.textPrimary}`}>Achievements</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto pr-2">
          {/* Task Achievements */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Task Achievements
            </h3>
            <div className="space-y-3">
              {taskAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 rounded-lg border ${
                    achievement.completed 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 ${achievement.completed ? 'text-green-400' : 'text-white/30'}`}>
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${achievement.completed ? 'text-white' : 'text-white/50'}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-white/60">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Streak Achievements */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Flame className="w-5 h-5 mr-2" />
              Streak Achievements
            </h3>
            <div className="space-y-3">
              {streakAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 rounded-lg border ${
                    achievement.completed 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 ${achievement.completed ? 'text-orange-400' : 'text-white/30'}`}>
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${achievement.completed ? 'text-white' : 'text-white/50'}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-white/60">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Level Achievements */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Level Achievements
            </h3>
            <div className="space-y-3">
              {levelAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 rounded-lg border ${
                    achievement.completed 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 ${achievement.completed ? 'text-yellow-400' : 'text-white/30'}`}>
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${achievement.completed ? 'text-white' : 'text-white/50'}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-white/60">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsDisplay;