import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const LevelInfo = () => {
  const { currentTheme } = useTheme();
  const { level, levelProgression, setShowLevelInfo } = useTasks();
  
  // Show all levels in groups
  const levelGroups = [
    { name: "Early Levels (2x growth)", levels: [1, 2, 3, 4, 5] },
    { name: "Mid Levels (1.25x growth)", levels: [6, 7, 8, 9, 10, 15, 20] },
    { name: "High Levels (1.1x growth)", levels: [25, 30, 40, 50, 75, 99] },
    { name: "Max Level", levels: [100] }
  ];

  return (
    <div className="fixed inset-x-4 top-20 bottom-20 md:inset-x-1/4 z-50">
      <div className={`w-full h-full rounded-xl ${currentTheme.cardBg} border ${currentTheme.borderAccent} p-6 overflow-hidden flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${currentTheme.textPrimary}`}>Level Progression</h2>
          <button 
            onClick={() => setShowLevelInfo(false)}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <p className="text-white/70 mb-4">
          You are currently at level {level}. Each level requires more XP based on a custom progression system.
        </p>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {levelGroups.map((group, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-white font-semibold mb-2">{group.name}</h3>
              <table className="w-full text-white">
                <thead className="text-white/70 border-b border-white/10">
                  <tr>
                    <th className="py-2 text-left">Level</th>
                    <th className="py-2 text-right">XP Required</th>
                  </tr>
                </thead>
                <tbody>
                  {group.levels.map(lvl => (
                    <tr 
                      key={lvl} 
                      className={`border-b border-white/5 ${lvl === level ? 'bg-white/10' : ''}`}
                    >
                      <td className={`py-2 ${lvl === level ? currentTheme.textPrimary : 'text-white'} font-${lvl === level ? 'bold' : 'normal'}`}>
                        {lvl}
                      </td>
                      <td className="py-2 text-right">
                        {lvl === 100 
                          ? "500,000,000 XP" 
                          : `${levelProgression[lvl].toLocaleString()} XP`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-white/70 text-sm">
          <p>Level progression:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Levels 1-5: 2x growth per level</li>
            <li>Levels 6-20: 1.25x growth per level</li>
            <li>Levels 21-99: 1.1x growth per level</li>
            <li>Level 100: Fixed at 500M XP</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LevelInfo;