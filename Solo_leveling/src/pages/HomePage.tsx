import React, { useState } from 'react';
import { Star, Trophy, Flame, CheckCircle, Trash2, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import LevelInfo from '../components/LevelInfo';
import AchievementsDisplay from '../components/AchievementsDisplay';
import { quotes } from '../data/quotes';

const HomePage = () => {
  const { currentTheme, userName, customQuote, profileImage } = useTheme();
  const { 
    tasks, 
    completeTask, 
    removeTask,
    level,
    xp,
    maxXp,
    totalXp,
    streakCount,
    showLevelInfo,
    setShowLevelInfo,
    achievements,
    totalTasksCompleted,
    xpMultiplier
  } = useTasks();

  const [showAchievements, setShowAchievements] = useState(false);

  // Calculate completed achievements by category
  const completedTaskAchievements = achievements.filter(a => a.category === 'task' && a.completed).length;
  const completedStreakAchievements = achievements.filter(a => a.category === 'streak' && a.completed).length;
  const completedLevelAchievements = achievements.filter(a => a.category === 'level' && a.completed).length;

  const difficultyXP = {
    easy: 50,
    medium: 100,
    hard: 200,
    epic: 500
  };

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    hard: 'bg-red-500/20 text-red-300',
    epic: 'bg-purple-500/20 text-purple-300'
  };

  const getDifficultyFromXP = (xp: number): 'easy' | 'medium' | 'hard' | 'epic' => {
    switch (xp) {
      case 50: return 'easy';
      case 100: return 'medium';
      case 200: return 'hard';
      case 500: return 'epic';
      default: return 'medium';
    }
  };

  const handleRemoveTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      removeTask(taskId);
    }
  };

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  // Get a random quote if no custom quote is set
  const defaultQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteToShow = customQuote || defaultQuote;

  return (
    <div className="h-full p-6">
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-white mb-6">
        Hello, <span className={currentTheme.textPrimary}>{userName}</span>!
      </h1>

      {/* Daily Quote */}
      {quoteToShow && (
        <div className="backdrop-blur-sm bg-black/30 rounded-xl p-6 mb-8 border border-white/10">
          <p className="text-lg text-white/90 italic mb-2">
            "{quoteToShow.text}"
          </p>
          <p className="text-white/70 text-sm">
            - {quoteToShow.author}
          </p>
        </div>
      )}

      {/* Profile and Level Section */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <button 
            onClick={() => setShowLevelInfo(true)}
            className="w-full backdrop-blur-sm bg-black/30 rounded-xl p-4 border border-white/10 hover:bg-black/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Level {level}</span>
              <span className="text-white/70">{xp}/{maxXp} XP</span>
            </div>
            <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${currentTheme.accentGradient}`}
                style={{ width: `${(xp / maxXp) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/50 mt-2 text-center">Click to view level progression</p>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="backdrop-blur-sm bg-black/30 rounded-xl p-4 border border-white/10 text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-white/70">Total XP</p>
          <p className="text-xl font-bold text-white">{totalXp.toLocaleString()}</p>
        </div>
        <div className="backdrop-blur-sm bg-black/30 rounded-xl p-4 border border-white/10 text-center">
          <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-sm text-white/70">Current Streak</p>
          <p className="text-xl font-bold text-white">{streakCount} days</p>
          {xpMultiplier > 1 && (
            <p className="text-sm text-yellow-400 mt-1">
              {xpMultiplier}x XP Bonus
            </p>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <button 
        onClick={() => setShowAchievements(true)}
        className="w-full backdrop-blur-sm bg-black/30 rounded-xl p-6 border border-white/10 mb-8 hover:bg-black/40 transition-all"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
        <div className="flex justify-center items-center space-x-8">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center ${
              completedTaskAchievements > 0 
                ? 'bg-gradient-to-br from-green-500/40 to-green-700/40 border border-green-400/30' 
                : 'bg-black/40 border border-white/10'
            }`}>
              <CheckCircle className={completedTaskAchievements > 0 ? 'text-green-300' : 'text-white/30'} />
            </div>
            <p className="text-sm mt-2 text-white/70">{completedTaskAchievements} Tasks</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center ${
              completedStreakAchievements > 0 
                ? 'bg-gradient-to-br from-orange-500/40 to-orange-700/40 border border-orange-400/30' 
                : 'bg-black/40 border border-white/10'
            }`}>
              <Flame className={completedStreakAchievements > 0 ? 'text-orange-300' : 'text-white/30'} />
            </div>
            <p className="text-sm mt-2 text-white/70">{completedStreakAchievements} Streaks</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center ${
              completedLevelAchievements > 0 
                ? 'bg-gradient-to-br from-yellow-500/40 to-yellow-700/40 border border-yellow-400/30' 
                : 'bg-black/40 border border-white/10'
            }`}>
              <Trophy className={completedLevelAchievements > 0 ? 'text-yellow-300' : 'text-white/30'} />
            </div>
            <p className="text-sm mt-2 text-white/70">{completedLevelAchievements} Levels</p>
          </div>
        </div>
      </button>

      {/* Daily Tasks Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Daily Tasks</h2>
        <div className="space-y-4">
          {sortedTasks.map(task => (
            <div 
              key={task.id} 
              className={`backdrop-blur-sm ${task.completed ? 'bg-black/20' : 'bg-black/30'} rounded-xl p-4 border ${task.completed ? 'border-white/5' : 'border-white/10'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => completeTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-white/20 border-white/50'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <h3 className={`font-semibold ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded text-xs ${difficultyColors[getDifficultyFromXP(task.xpReward)]}`}>
                    {getDifficultyFromXP(task.xpReward).toUpperCase()}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {task.xpReward} 
                      {xpMultiplier > 1 && !task.completed && (
                        <span className="ml-1 text-xs">
                          ({Math.round(task.xpReward * xpMultiplier)})
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTask(task.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Info Modal */}
      {showLevelInfo && <LevelInfo />}
      
      {/* Achievements Modal */}
      {showAchievements && <AchievementsDisplay onClose={() => setShowAchievements(false)} />}
    </div>
  );
};

export default HomePage;