import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, SideQuest, Achievement } from '../types';

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  sideQuests: SideQuest[];
  setSideQuests: React.Dispatch<React.SetStateAction<SideQuest[]>>;
  totalXp: number;
  setTotalXp: React.Dispatch<React.SetStateAction<number>>;
  streakCount: number;
  setStreakCount: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  maxXp: number;
  completeTask: (taskId: string) => void;
  completeSideQuest: (questId: string) => void;
  removeTask: (taskId: string) => void;
  removeSideQuest: (questId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  addSideQuest: (quest: Omit<SideQuest, 'id' | 'createdAt'>) => void;
  showLevelInfo: boolean;
  setShowLevelInfo: React.Dispatch<React.SetStateAction<boolean>>;
  levelProgression: number[];
  totalTasksCompleted: number;
  achievements: Achievement[];
  xpMultiplier: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Calculate XP required for each level using custom progression
const calculateLevelProgression = () => {
  const levels = [0]; // Level 0 (not used)
  let baseXp = 200; // Starting XP for level 1
  
  // First 5 levels: 2x multiplier
  levels.push(baseXp); // Level 1
  for (let i = 2; i <= 5; i++) {
    baseXp *= 2;
    levels.push(Math.round(baseXp));
  }
  
  // Next 15 levels: 1.25x multiplier
  for (let i = 6; i <= 20; i++) {
    baseXp *= 1.25;
    levels.push(Math.round(baseXp));
  }
  
  // Remaining levels until 99: 1.1x multiplier
  for (let i = 21; i <= 99; i++) {
    baseXp *= 1.1;
    levels.push(Math.round(baseXp));
  }
  
  // Level 100: Fixed at 500M
  levels.push(500000000);
  
  return levels;
};

// Calculate XP multiplier based on streak count
const calculateXpMultiplier = (streakCount: number): number => {
  if (streakCount >= 180) { // 6 months (approx)
    return 2.0; // 2x multiplier (max)
  } else if (streakCount >= 30) { // 1 month
    return 1.5; // 1.5x multiplier
  } else if (streakCount >= 7) { // 1 week
    return 1.25; // 1.25x multiplier
  } else {
    return 1.0; // No multiplier
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sideQuests, setSideQuests] = useState<SideQuest[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [xp, setXp] = useState<number>(0);
  const [maxXp, setMaxXp] = useState<number>(200);
  const [showLevelInfo, setShowLevelInfo] = useState<boolean>(false);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState<number>(0);
  const [xpMultiplier, setXpMultiplier] = useState<number>(1.0);
  const levelProgression = calculateLevelProgression();
  
  // Define achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    // Task Achievements
    {
      id: 'task-1',
      name: 'Task Novice',
      description: 'Complete 5 tasks',
      category: 'task',
      requirement: 5,
      completed: false,
      icon: 'CheckCircle'
    },
    {
      id: 'task-2',
      name: 'Task Apprentice',
      description: 'Complete 25 tasks',
      category: 'task',
      requirement: 25,
      completed: false,
      icon: 'CheckCircle'
    },
    {
      id: 'task-3',
      name: 'Task Master',
      description: 'Complete 100 tasks',
      category: 'task',
      requirement: 100,
      completed: false,
      icon: 'CheckCircle'
    },
    {
      id: 'task-4',
      name: 'Task Legend',
      description: 'Complete 500 tasks',
      category: 'task',
      requirement: 500,
      completed: false,
      icon: 'CheckCircle'
    },
    
    // Streak Achievements
    {
      id: 'streak-1',
      name: 'Consistent',
      description: 'Maintain a 7-day streak',
      category: 'streak',
      requirement: 7,
      completed: false,
      icon: 'Flame'
    },
    {
      id: 'streak-2',
      name: 'Dedicated',
      description: 'Maintain a 30-day streak',
      category: 'streak',
      requirement: 30,
      completed: false,
      icon: 'Flame'
    },
    {
      id: 'streak-3',
      name: 'Unstoppable',
      description: 'Maintain a 100-day streak',
      category: 'streak',
      requirement: 100,
      completed: false,
      icon: 'Flame'
    },
    {
      id: 'streak-4',
      name: 'Legendary Streak',
      description: 'Maintain a 365-day streak',
      category: 'streak',
      requirement: 365,
      completed: false,
      icon: 'Flame'
    },
    
    // Level Achievements
    {
      id: 'level-1',
      name: 'Beginner',
      description: 'Reach level 10',
      category: 'level',
      requirement: 10,
      completed: false,
      icon: 'Trophy'
    },
    {
      id: 'level-2',
      name: 'Intermediate',
      description: 'Reach level 25',
      category: 'level',
      requirement: 25,
      completed: false,
      icon: 'Trophy'
    },
    {
      id: 'level-3',
      name: 'Expert',
      description: 'Reach level 50',
      category: 'level',
      requirement: 50,
      completed: false,
      icon: 'Trophy'
    },
    {
      id: 'level-4',
      name: 'Master',
      description: 'Reach level 75',
      category: 'level',
      requirement: 75,
      completed: false,
      icon: 'Trophy'
    },
    {
      id: 'level-5',
      name: 'Legend',
      description: 'Reach level 100',
      category: 'level',
      requirement: 100,
      completed: false,
      icon: 'Trophy'
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedTasks = localStorage.getItem('tasks');
    if (loadedTasks) {
      try {
        const parsedTasks = JSON.parse(loadedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(tasksWithDates);
      } catch (e) {
        console.error("Error parsing saved tasks:", e);
        setTasks([]);
      }
    }

    const loadedSideQuests = localStorage.getItem('sideQuests');
    if (loadedSideQuests) {
      try {
        const parsedQuests = JSON.parse(loadedSideQuests);
        // Convert string dates back to Date objects
        const questsWithDates = parsedQuests.map((quest: any) => ({
          ...quest,
          createdAt: new Date(quest.createdAt)
        }));
        setSideQuests(questsWithDates);
      } catch (e) {
        console.error("Error parsing saved side quests:", e);
        setSideQuests([]);
      }
    }

    const savedTotalXp = localStorage.getItem('totalXp');
    if (savedTotalXp) {
      setTotalXp(parseInt(savedTotalXp, 10));
    }

    const savedStreakCount = localStorage.getItem('streakCount');
    if (savedStreakCount) {
      setStreakCount(parseInt(savedStreakCount, 10));
    }

    const savedLevel = localStorage.getItem('level');
    if (savedLevel) {
      setLevel(parseInt(savedLevel, 10));
    }

    const savedXp = localStorage.getItem('xp');
    if (savedXp) {
      setXp(parseInt(savedXp, 10));
    }
    
    const savedTotalTasksCompleted = localStorage.getItem('totalTasksCompleted');
    if (savedTotalTasksCompleted) {
      setTotalTasksCompleted(parseInt(savedTotalTasksCompleted, 10));
    }
    
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.error("Error parsing saved achievements:", e);
      }
    }

    // Check for last login date to update streak
    const lastLogin = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (lastLogin) {
      const lastDate = new Date(lastLogin);
      const currentDate = new Date();
      
      // Calculate the difference in days
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, increase streak
        const newStreak = streakCount + 1;
        setStreakCount(newStreak);
        localStorage.setItem('streakCount', newStreak.toString());
      } else if (diffDays > 1) {
        // Streak broken, reset to 1
        setStreakCount(1);
        localStorage.setItem('streakCount', '1');
      }
    }
    
    // Update last login date
    localStorage.setItem('lastLoginDate', today);
  }, []);

  // Update maxXp whenever level changes
  useEffect(() => {
    setMaxXp(levelProgression[level]);
  }, [level, levelProgression]);

  // Update XP multiplier whenever streak count changes
  useEffect(() => {
    const newMultiplier = calculateXpMultiplier(streakCount);
    setXpMultiplier(newMultiplier);
  }, [streakCount]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save side quests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sideQuests', JSON.stringify(sideQuests));
  }, [sideQuests]);

  // Save totalXp to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('totalXp', totalXp.toString());
  }, [totalXp]);

  // Save level and XP to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('level', level.toString());
    localStorage.setItem('xp', xp.toString());
  }, [level, xp]);
  
  // Save total tasks completed
  useEffect(() => {
    localStorage.setItem('totalTasksCompleted', totalTasksCompleted.toString());
  }, [totalTasksCompleted]);
  
  // Save achievements
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check for level up
  useEffect(() => {
    if (xp >= maxXp && level < 100) {
      // Level up
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(xp - maxXp); // Carry over excess XP
    }
  }, [xp, maxXp, level]);
  
  // Check for achievement updates
  useEffect(() => {
    // Update achievements based on current stats
    setAchievements(prev => prev.map(achievement => {
      let completed = achievement.completed;
      
      // Check if achievement should be completed
      if (!completed) {
        if (achievement.category === 'task' && totalTasksCompleted >= achievement.requirement) {
          completed = true;
        } else if (achievement.category === 'streak' && streakCount >= achievement.requirement) {
          completed = true;
        } else if (achievement.category === 'level' && level >= achievement.requirement) {
          completed = true;
        }
      }
      
      return { ...achievement, completed };
    }));
  }, [totalTasksCompleted, streakCount, level]);

  const completeTask = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          
          // Add XP if completing the task, remove if uncompleting
          if (newCompleted) {
            // Apply XP multiplier based on streak
            const multipliedXP = Math.round(task.xpReward * xpMultiplier);
            setXp(prev => prev + multipliedXP);
            setTotalXp(prev => prev + multipliedXP);
            setTotalTasksCompleted(prev => prev + 1);
          } else if (!newCompleted && task.completed) {
            // Remove XP if uncompleting (use original XP value)
            setXp(prev => Math.max(0, prev - task.xpReward));
            setTotalXp(prev => Math.max(0, prev - task.xpReward));
            setTotalTasksCompleted(prev => Math.max(0, prev - 1));
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const completeSideQuest = (questId: string) => {
    // Find the quest
    const quest = sideQuests.find(q => q.id === questId);
    
    if (quest) {
      // Apply XP multiplier based on streak
      const multipliedXP = Math.round(quest.xpReward * xpMultiplier);
      
      // Add XP
      setXp(prev => prev + multipliedXP);
      setTotalXp(prev => prev + multipliedXP);
      setTotalTasksCompleted(prev => prev + 1);
      
      // Remove the completed quest
      setSideQuests(prev => prev.filter(q => q.id !== questId));
    }
  };

  const removeTask = (taskId: string) => {
    // Check if the task is completed before removing
    const taskToRemove = tasks.find(task => task.id === taskId);
    
    if (taskToRemove && taskToRemove.completed) {
      // If task was completed, adjust the totalTasksCompleted count
      setTotalTasksCompleted(prev => Math.max(0, prev - 1));
      
      // Also remove the XP that was awarded for this task
      setTotalXp(prev => Math.max(0, prev - taskToRemove.xpReward));
      setXp(prev => Math.max(0, prev - taskToRemove.xpReward));
    }
    
    // Remove the task from the tasks array
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const removeSideQuest = (questId: string) => {
    // Remove the side quest from the array
    setSideQuests(prevQuests => prevQuests.filter(quest => quest.id !== questId));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const addSideQuest = (quest: Omit<SideQuest, 'id' | 'createdAt'>) => {
    const newQuest: SideQuest = {
      ...quest,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSideQuests(prevQuests => [...prevQuests, newQuest]);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      setTasks, 
      sideQuests, 
      setSideQuests,
      totalXp,
      setTotalXp,
      streakCount,
      setStreakCount,
      level,
      setLevel,
      xp,
      setXp,
      maxXp,
      completeTask,
      completeSideQuest,
      removeTask,
      removeSideQuest,
      addTask,
      addSideQuest,
      showLevelInfo,
      setShowLevelInfo,
      levelProgression,
      totalTasksCompleted,
      achievements,
      xpMultiplier
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};