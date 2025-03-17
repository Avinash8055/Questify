import React, { useState } from 'react';
import { Plus, Check, Trash2, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const SideQuestsPage = () => {
  const { currentTheme } = useTheme();
  const { sideQuests, completeSideQuest, removeSideQuest, addSideQuest, xpMultiplier } = useTasks();
  
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'epic'
  });

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

  const handleAddQuest = () => {
    if (newQuest.title.trim()) {
      addSideQuest({
        title: newQuest.title,
        description: '',
        difficulty: newQuest.difficulty,
        xpReward: difficultyXP[newQuest.difficulty],
        completed: false,
        permanent: false
      });
      setNewQuest({ title: '', difficulty: 'medium' });
      setShowAddQuest(false);
    }
  };
  
  const handleRemoveSideQuest = (questId: string) => {
    // Show confirmation dialog before removing
    if (window.confirm('Are you sure you want to delete this side quest? This action cannot be undone.')) {
      removeSideQuest(questId);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Side Quests</h1>
          
          {/* XP Multiplier Badge */}
          {xpMultiplier > 1 && (
            <div className="inline-flex items-center bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
              <Zap className="w-4 h-4 mr-1" />
              <span>{xpMultiplier}x XP</span>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {sideQuests.map(quest => (
            <div 
              key={quest.id} 
              className="backdrop-blur-sm bg-black/30 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => completeSideQuest(quest.id)}
                    className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-white/50 flex items-center justify-center transition-colors"
                  >
                    {quest.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <h3 className="font-semibold text-white">
                    {quest.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded text-xs ${difficultyColors[quest.difficulty]}`}>
                    {quest.difficulty.toUpperCase()}
                  </span>
                  <span className="text-yellow-400 text-sm">
                    {quest.xpReward} 
                    {xpMultiplier > 1 && (
                      <span className="ml-1 text-xs">
                        ({Math.round(quest.xpReward * xpMultiplier)})
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleRemoveSideQuest(quest.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAddQuest ? (
          <button
            onClick={() => setShowAddQuest(true)}
            className="w-full backdrop-blur-sm bg-white/10 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Side Quest</span>
          </button>
        ) : (
          <div className="backdrop-blur-sm bg-black/30 rounded-xl p-4 border border-white/10">
            <input
              type="text"
              placeholder="Quest Title"
              value={newQuest.title}
              onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
              className="w-full bg-black/50 text-white rounded-lg px-4 py-2 mb-4 border border-white/10"
            />
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <label className="text-sm text-white/70 block mb-1">Difficulty:</label>
                <select
                  value={newQuest.difficulty}
                  onChange={(e) => setNewQuest({ 
                    ...newQuest, 
                    difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'epic'
                  })}
                  className="w-full bg-black/50 text-white rounded-lg px-4 py-2 border border-white/10"
                >
                  <option value="easy">Easy (50 XP)</option>
                  <option value="medium">Medium (100 XP)</option>
                  <option value="hard">Hard (200 XP)</option>
                  <option value="epic">Epic (500 XP)</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddQuest(false)}
                className="flex-1 backdrop-blur-sm bg-black/50 text-white py-2 rounded-lg hover:bg-black/70"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuest}
                className="flex-1 backdrop-blur-sm bg-white/10 text-white py-2 rounded-lg hover:bg-white/20"
              >
                Add Quest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideQuestsPage;