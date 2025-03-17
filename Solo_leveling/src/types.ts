export interface User {
  name: string;
  level: number;
  xp: number;
  streaks: number;
  achievements: Achievement[];
  selectedQuote: number;
  profileImage?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category?: 'task' | 'streak' | 'level';
  requirement?: number;
  completed: boolean;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  createdAt: Date;
}

export interface SideQuest extends Task {
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  permanent: boolean;
}

export type ThemeType = 'neon' | 'cyber' | 'synthwave' | 'matrix';

export interface Theme {
  id: ThemeType;
  name: string;
  bgGradient: string;
  cardBg: string;
  accentGradient: string;
  textPrimary: string;
  textSecondary: string;
  buttonGradient: string;
  borderAccent: string;
  buttonActiveGradient: string;
}

export interface DailyQuote {
  id: number;
  text: string;
  author: string;
}