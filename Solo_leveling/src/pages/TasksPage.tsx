import React, { useState } from 'react';
import { Plus, Star, CheckCircle, Trash2, Zap } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import TaskAnalytics from '../components/TaskAnalytics';

const TasksPage = () => {
  const { currentTheme } = useTheme();
  const { 
    tasks, 
    completeTask, 
    removeTask, 
    addTask,
    xpMultiplier
  } = useTasks();
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [newTask, setNewTask] = useState({ 
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

  const getDifficultyFromXP = (xp: number): 'easy' | 'medium' | 'hard' | 'epic' => {
    switch (xp) {
      case 50: return 'easy';
      case 100: return 'medium';
      case 200: return 'hard';
      case 500: return 'epic';
      default: return 'medium';
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask({
        title: newTask.title,
        description: '',
        xpReward: difficultyXP[newTask.difficulty],
        completed: false
      });
      setNewTask({ title: '', difficulty: 'medium' });
      setShowAddTask(false);
    }
  };
  
  const handleRemoveTask = (taskId: string) => {
    // Show confirmation dialog before removing
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      removeTask(taskId);
    }
  };
  
  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-8">
            <h1 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Daily Tasks</h1>
            
            {/* XP Multiplier Badge */}
            {xpMultiplier > 1 && (
              <div className="mt-2 inline-flex items-center bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                <Zap className="w-4 h-4 mr-1" />
                <span>{xpMultiplier}x XP Multiplier Active</span>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8">
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

          {!showAddTask ? (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full backdrop-blur-sm bg-white/10 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Task</span>
            </button>
          ) : (
            <div className="backdrop-blur-sm bg-black/30 rounded-xl p-4 border border-white/10">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full bg-black/50 text-white rounded-lg px-4 py-2 mb-4 border border-white/10"
              />
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <label className="text-sm text-white/70 block mb-1">Difficulty:</label>
                  <select
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask({ 
                      ...newTask, 
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
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 backdrop-blur-sm bg-black/50 text-white py-2 rounded-lg hover:bg-black/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="flex-1 backdrop-blur-sm bg-white/10 text-white py-2 rounded-lg hover:bg-white/20"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}
        </div>

        {showAnalytics && (
          <div className="mt-auto border-t border-white/10 backdrop-blur-sm bg-black/30" id="analytics">
            <TaskAnalytics tasks={tasks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;