
import React, { useState, useEffect } from 'react';
import { getScores } from '@/utils/gameLogic';
import { CustomButton } from './ui/CustomButton';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isVisible, onClose }) => {
  const [scores, setScores] = useState<number[]>([]);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');

  useEffect(() => {
    if (isVisible) {
      setScores(getScores());
      setAnimationState('entering');
      const timer = setTimeout(() => setAnimationState('entered'), 300);
      return () => clearTimeout(timer);
    } else if (animationState === 'entered') {
      setAnimationState('exiting');
      const timer = setTimeout(() => setAnimationState('exited'), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (animationState === 'exited') return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50",
        animationState === 'entering' && "animate-fade-in",
        animationState === 'exiting' && "animate-fade-out"
      )}
    >
      <div 
        className={cn(
          "glass-panel p-8 max-w-md w-full max-h-[80vh] flex flex-col gap-6 overflow-hidden",
          animationState === 'entering' && "animate-scale-up",
          animationState === 'exiting' && "animate-scale-down"
        )}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-glow">NETRUNNER LEADERBOARD</h2>
          <button 
            onClick={onClose}
            className="text-cyber-primary hover:text-glow transition-all"
          >
            ✕
          </button>
        </div>
        
        <div className="cyber-border overflow-auto flex-1 p-4">
          {scores.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-cyber-primary/30">
                  <th className="p-2 text-cyber-primary">#</th>
                  <th className="p-2 text-cyber-primary">SCORE</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr 
                    key={index} 
                    className={cn(
                      "border-b border-cyber-primary/10 transition-colors",
                      index === 0 && "bg-cyber-primary/10"
                    )}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animation: "fade-up 0.3s forwards"
                    }}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 font-mono">{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-cyber-primary/50">
              No scores yet. Start playing to set records!
            </div>
          )}
        </div>
        
        <CustomButton onClick={onClose} className="w-full" variant="ghost">
          CLOSE
        </CustomButton>
      </div>
    </div>
  );
};

export default Leaderboard;
