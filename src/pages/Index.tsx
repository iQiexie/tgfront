import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameCanvas from '@/components/GameCanvas';
import StartScreen from '@/components/StartScreen';
import Leaderboard from '@/components/Leaderboard';
import Achievements from '@/components/Achievements';
import Scripts from '@/components/Scripts';
import { toast } from "sonner";
import { saveScore, getScores, setUnlimitedAttempts } from '@/utils/gameLogic';
import { PlayerSkin } from '@/utils/types';
import { getSelectedSkin, saveSelectedSkin } from '@/utils/skinsUtils';
import { getNextAttemptTime, checkAndRestoreAttempts } from '@/utils/attemptsUtils';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
      };
    };
  }
}

const Index = () => {
  const [gameActive, setGameActive] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showScripts, setShowScripts] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [lastScore, setLastScore] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState<PlayerSkin>(PlayerSkin.DEFAULT);
  const [nextAttemptTime, setNextAttemptTime] = useState<number | undefined>(undefined);

  // Check if running in Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      setIsTelegramWebApp(true);
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  // Load selected skin
  useEffect(() => {
    setSelectedSkin(getSelectedSkin());
  }, []);

  // Check and restore attempts based on time
  useEffect(() => {
    // Only run if attemptsLeft is below the maximum (3) and not infinity
    if (attemptsLeft !== Infinity && attemptsLeft < 3) {
      const { attempts, nextTime } = checkAndRestoreAttempts();
      setAttemptsLeft(attempts);
      setNextAttemptTime(nextTime);
      
      // Set interval to check for new attempts every minute
      const interval = setInterval(() => {
        const { attempts: newAttempts, nextTime: newNextTime } = checkAndRestoreAttempts();
        setAttemptsLeft(newAttempts);
        setNextAttemptTime(newNextTime);
        
        // If attempts restored, show notification
        if (newAttempts > attemptsLeft) {
          toast.success(isTelegramWebApp ? "Новая уязвимость найдена!" : "New vulnerability found!", {
            description: isTelegramWebApp ? "Вы можете использовать её для взлома." : "You can use it for hacking."
          });
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    } else {
      // If attemptsLeft is at max or infinity, no need for next attempt time
      setNextAttemptTime(undefined);
    }
  }, [attemptsLeft, isTelegramWebApp]);

  // Loading sequence
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle skin selection
  const handleSelectSkin = (skin: PlayerSkin) => {
    setSelectedSkin(skin);
    saveSelectedSkin(skin);
    
    toast.success(isTelegramWebApp ? "Скрипт активирован" : "Script activated", {
      description: isTelegramWebApp ? "Новый скрипт успешно применен" : "New script successfully applied"
    });
  };
  
  // Handle game over
  const handleGameOver = (score: number) => {
    setGameActive(false);
    setLastScore(score);
    
    // Save score to storage
    saveScore(score);
    console.log("Game over, saved score:", score);
    
    // Show toast with score
    toast("Взлом прерван", {
      description: `Ваш счёт: ${score}`,
      position: 'top-center',
    });
    
    // Send score to Telegram if in WebApp
    if (isTelegramWebApp && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({ action: 'gameOver', score }));
      } catch (err) {
        console.error('Error sending data to Telegram:', err);
      }
    }
  };
  
  // Handle game win
  const handleGameWin = (score: number) => {
    setGameActive(false);
    setLastScore(score);
    
    // Save score to storage
    saveScore(score);
    console.log("Game won, saved score:", score);
    
    // Show toast with winning message
    toast.success("Взлом успешно завершен!", {
      description: `Поздравляем! Вы достигли 100% взлома!`,
      position: 'top-center',
    });
    
    // Send win event to Telegram if in WebApp
    if (isTelegramWebApp && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({ action: 'gameWin', score }));
      } catch (err) {
        console.error('Error sending data to Telegram:', err);
      }
    }
  };
  
  // Start game
  const handleStartGame = () => {
    if (attemptsLeft <= 0) {
      toast.error("Нет попыток!", {
        description: "Посмотрите рекламу или купите безлимитные попытки.",
      });
      return;
    }
    
    // Only deduct an attempt when game is actually starting
    if (!gameActive) {
      setAttemptsLeft(prev => {
        const newAttempts = prev === Infinity ? Infinity : prev - 1;
        // Update next attempt time if attempts reduced
        if (newAttempts < 3 && newAttempts !== Infinity) {
          setNextAttemptTime(getNextAttemptTime());
        }
        return newAttempts;
      });
    }
    
    setGameActive(true);
  };
  
  // Watch ad for attempts
  const handleWatchAd = () => {
    // If in Telegram, send event to show ad
    if (isTelegramWebApp && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({ action: 'watchAd' }));
        toast.info("Загрузка рекламы...", {
          description: "Пожалуйста, подождите пока реклама загрузится.",
        });
      } catch (err) {
        console.error('Error sending data to Telegram:', err);
        simulateAdView();
      }
    } else {
      simulateAdView();
    }
  };
  
  // Simulate ad viewing (fallback for non-Telegram environment)
  const simulateAdView = () => {
    toast.info("Загрузка рекламы...", {
      description: "Симуляция просмотра рекламы.",
    });
    
    setTimeout(() => {
      setAttemptsLeft(prev => {
        const newAttempts = prev === Infinity ? Infinity : prev + 1;
        // If we just added an attempt but still below max, update next attempt time
        if (newAttempts < 3 && newAttempts !== Infinity) {
          setNextAttemptTime(getNextAttemptTime());
        } else {
          setNextAttemptTime(undefined);
        }
        return newAttempts;
      });
      
      toast.success("Реклама завершена", {
        description: "Вы получили дополнительную попытку!"
      });
    }, 2000);
  };
  
  // Buy unlimited attempts
  const handleBuyUnlimited = () => {
    // If in Telegram, send event to process payment
    if (isTelegramWebApp && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({ action: 'buyUnlimited' }));
        toast.info("Обработка платежа...", {
          description: "Пожалуйста, завершите оплату в Telegram.",
        });
      } catch (err) {
        console.error('Error sending data to Telegram:', err);
        simulatePurchase();
      }
    } else {
      simulatePurchase();
    }
  };
  
  // Simulate purchase (fallback for non-Telegram environment)
  const simulatePurchase = () => {
    toast.info("Обработка платежа...", {
      description: "Симуляция платежа.",
    });
    
    setTimeout(() => {
      setAttemptsLeft(Infinity);
      setNextAttemptTime(undefined); // Clear timer when unlimited is activated
      toast.success("Покупка успешна", {
        description: "Теперь у вас безлимитные попытки!"
      });
    }, 2000);
  };
  
  // Add attempts (can be called from Telegram backend)
  const addAttempts = (count: number) => {
    setAttemptsLeft(prev => {
      const newAttempts = prev === Infinity ? Infinity : prev + count;
      // Update next attempt time if still below max and not infinity
      if (newAttempts < 3 && newAttempts !== Infinity) {
        setNextAttemptTime(getNextAttemptTime());
      } else {
        setNextAttemptTime(undefined);
      }
      return newAttempts;
    });
    
    toast.success("Попытки добавлены", {
      description: `Вы получили ${count} новых попыток!`
    });
  };
  
  // Set unlimited attempts (can be called from Telegram backend)
  const activateUnlimited = () => {
    setAttemptsLeft(Infinity);
    setNextAttemptTime(undefined); // Clear timer when unlimited is activated
    toast.success("Безлимитный режим активирован", {
      description: "Теперь у вас безлимитные попытки!"
    });
  };

  // Expose functions to window for Telegram to call
  useEffect(() => {
    if (isTelegramWebApp) {
      (window as any).addAttempts = addAttempts;
      (window as any).activateUnlimited = activateUnlimited;
    }
    
    return () => {
      if (isTelegramWebApp) {
        delete (window as any).addAttempts;
        delete (window as any).activateUnlimited;
      }
    };
  }, [isTelegramWebApp]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-background flex items-center justify-center flex-col gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-glow"
        >
          NETRUNNER
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="h-1 bg-cyber-primary rounded-full"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-cyber-foreground/70 mt-2"
        >
          ИНИЦИАЛИЗАЦИЯ ВЗЛОМА...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cyber-background overflow-hidden">
      {/* Background grid effect */}
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 204, 0.2) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(0, 255, 204, 0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: '-1px -1px'
        }}
      />
      
      {/* Game Canvas */}
      <GameCanvas 
        isActive={gameActive} 
        onGameOver={handleGameOver}
        onGameWin={handleGameWin}
        attemptsLeft={attemptsLeft}
        selectedSkin={selectedSkin}
      />
      
      {/* Start Screen */}
      <StartScreen 
        isVisible={!gameActive}
        onStartGame={handleStartGame}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        onShowAchievements={() => setShowAchievements(true)}
        onShowScripts={() => setShowScripts(true)}
        onWatchAd={handleWatchAd}
        onBuyUnlimited={handleBuyUnlimited}
        attemptsLeft={attemptsLeft}
        lastScore={lastScore}
        isTelegramWebApp={isTelegramWebApp}
        nextAttemptTime={nextAttemptTime}
      />
      
      {/* Leaderboard */}
      <Leaderboard 
        isVisible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
      
      {/* Achievements */}
      <Achievements
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
        isTelegramWebApp={isTelegramWebApp}
      />
      
      {/* Scripts */}
      <Scripts
        isVisible={showScripts}
        onClose={() => setShowScripts(false)}
        onSelectSkin={handleSelectSkin}
        selectedSkin={selectedSkin}
        isTelegramWebApp={isTelegramWebApp}
      />
      
      {/* Version tag */}
      <div className="absolute bottom-2 right-2 text-xs text-cyber-foreground/30">
        v1.4.0
      </div>
    </div>
  );
};

export default Index;
