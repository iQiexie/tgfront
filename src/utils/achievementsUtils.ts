
import { Achievement, GameState } from './types';
import { getScores } from './storageUtils';
import { getDailyGameStats } from './gameLogic';

// Define all achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_run',
    name: 'First Boot',
    description: 'Start your first hack attempt',
    unlocked: false,
    imageSrc: '/achievements/first-boot.svg',
  },
  {
    id: 'reach_10percent',
    name: '10% Access',
    description: 'Reach 10% hack completion',
    unlocked: false,
    imageSrc: '/achievements/ten-percent.svg',
  },
  {
    id: 'reach_25percent',
    name: '25% Access',
    description: 'Reach 25% hack completion',
    unlocked: false,
    imageSrc: '/achievements/twenty-five-percent.svg',
  },
  {
    id: 'reach_50percent',
    name: '50% Access',
    description: 'Reach 50% hack completion',
    unlocked: false,
    imageSrc: '/achievements/fifty-percent.svg',
  },
  {
    id: 'reach_75percent',
    name: '75% Access',
    description: 'Reach 75% hack completion',
    unlocked: false,
    imageSrc: '/achievements/seventy-five-percent.svg',
  },
  {
    id: 'reach_100percent',
    name: '100% Access',
    description: 'Complete the hack at 100%',
    unlocked: false,
    imageSrc: '/achievements/hundred-percent.svg',
  },
  {
    id: 'collect_key',
    name: 'Security Bypass',
    description: 'Collect your first Safety Key',
    unlocked: false,
    imageSrc: '/achievements/security-bypass.svg',
  },
  {
    id: 'collect_backdoor',
    name: 'Backdoor Found',
    description: 'Collect your first Backdoor',
    unlocked: false,
    imageSrc: '/achievements/backdoor.svg',
  },
  {
    id: 'play_3_times',
    name: 'Persistence',
    description: 'Play the game 3 times in one day',
    unlocked: false,
    imageSrc: '/achievements/persistence.svg',
  },
  {
    id: 'play_10_times',
    name: 'Determination',
    description: 'Play the game 10 times in one day',
    unlocked: false,
    imageSrc: '/achievements/determination.svg',
  },
  // New memory core related achievements
  {
    id: 'defeat_first_core',
    name: 'Memory Crasher',
    description: 'Defeat your first Memory Core',
    unlocked: false,
    imageSrc: '/achievements/memory-crasher.svg',
  },
  {
    id: 'defeat_level2_core',
    name: 'Data Corruptor',
    description: 'Defeat a Level 2 Memory Core',
    unlocked: false,
    imageSrc: '/achievements/data-corruptor.svg',
  },
  {
    id: 'defeat_level3_core',
    name: 'System Annihilator',
    description: 'Defeat a Level 3 Memory Core',
    unlocked: false,
    imageSrc: '/achievements/system-annihilator.svg',
  }
];

// Load achievements from localStorage, merging with defaults
export const loadAchievements = (): Achievement[] => {
  try {
    const savedAchievements = localStorage.getItem('netrunner_achievements');
    const parsed: Achievement[] = savedAchievements ? JSON.parse(savedAchievements) : [];
    
    // Create a map of saved achievements for quick lookup
    const savedMap = new Map(parsed.map((a: Achievement) => [a.id, a]));
    
    // Merge with default achievements
    return ACHIEVEMENTS.map(defaultAchievement => {
      const savedAchievement = savedMap.get(defaultAchievement.id);
      return savedAchievement ? {
        ...defaultAchievement,
        unlocked: Boolean(savedAchievement.unlocked)
      } : defaultAchievement;
    });
  } catch (e) {
    console.error('Error loading achievements', e);
    return [...ACHIEVEMENTS];
  }
};

// Save achievements to localStorage
const saveAchievements = (achievements: Achievement[]): void => {
  try {
    localStorage.setItem('netrunner_achievements', JSON.stringify(achievements));
    console.log('Achievements saved:', achievements);
  } catch (e) {
    console.error('Error saving achievements', e);
  }
};

// Check if specific achievement is unlocked
export const isAchievementUnlocked = (id: string): boolean => {
  const achievements = loadAchievements();
  const achievement = achievements.find(a => a.id === id);
  return achievement ? achievement.unlocked : false;
};

// Update achievements based on game state and current score
export const updateAchievements = (state: GameState): void => {
  console.log('Updating achievements with state:', state);
  const achievements = loadAchievements();
  let updated = false;
  
  // First run achievement - unlocks as soon as the game is played
  if (!isAchievementUnlocked('first_run')) {
    const achievementIndex = achievements.findIndex(a => a.id === 'first_run');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: First Boot');
    }
  }
  
  // Check current score for percentage-based achievements
  const currentScore = state.score;
  
  // 10% completion (10,000 points)
  if (!isAchievementUnlocked('reach_10percent') && currentScore >= 10000) {
    const achievementIndex = achievements.findIndex(a => a.id === 'reach_10percent');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: 10% Access');
    }
  }
  
  // 25% completion (25,000 points)
  if (!isAchievementUnlocked('reach_25percent') && currentScore >= 25000) {
    const achievementIndex = achievements.findIndex(a => a.id === 'reach_25percent');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: 25% Access');
    }
  }
  
  // 50% completion (50,000 points)
  if (!isAchievementUnlocked('reach_50percent') && currentScore >= 50000) {
    const achievementIndex = achievements.findIndex(a => a.id === 'reach_50percent');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: 50% Access');
    }
  }
  
  // 75% completion (75,000 points)
  if (!isAchievementUnlocked('reach_75percent') && currentScore >= 75000) {
    const achievementIndex = achievements.findIndex(a => a.id === 'reach_75percent');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: 75% Access');
    }
  }
  
  // 100% completion (100,000 points)
  if (!isAchievementUnlocked('reach_100percent') && currentScore >= 100000) {
    const achievementIndex = achievements.findIndex(a => a.id === 'reach_100percent');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: 100% Access');
    }
  }
  
  // Collected Safety Key - check the state directly
  if (!isAchievementUnlocked('collect_key') && state.collectedSafetyKeys > 0) {
    const achievementIndex = achievements.findIndex(a => a.id === 'collect_key');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: Security Bypass');
    }
  }
  
  // Collected Backdoor - check the state directly
  if (!isAchievementUnlocked('collect_backdoor') && state.collectedBackdoors > 0) {
    const achievementIndex = achievements.findIndex(a => a.id === 'collect_backdoor');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: Backdoor Found');
    }
  }
  
  // Daily games played - check for play count achievements
  const dailyStats = getDailyGameStats();
  console.log('Daily stats for achievements:', dailyStats);
  
  // 3 games in a day
  if (!isAchievementUnlocked('play_3_times') && dailyStats.gamesPlayed >= 3) {
    const achievementIndex = achievements.findIndex(a => a.id === 'play_3_times');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: Persistence');
    }
  }
  
  // 10 games in a day
  if (!isAchievementUnlocked('play_10_times') && dailyStats.gamesPlayed >= 10) {
    const achievementIndex = achievements.findIndex(a => a.id === 'play_10_times');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: Determination');
    }
  }

  // Memory Core achievements - track boss defeats by level
  // First Memory Core defeat
  if (!isAchievementUnlocked('defeat_first_core') && state.bossDefeatsCount > 0) {
    const achievementIndex = achievements.findIndex(a => a.id === 'defeat_first_core');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: Memory Crasher');
    }
  }
  
  // Level 2 Memory Core defeat (needs to have defeated a level 2 boss)
  if (!isAchievementUnlocked('defeat_level2_core') && state.highestBossLevelDefeated >= 2) {
    const achievementIndex = achievements.findIndex(a => a.id === 'defeat_level2_core');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: Data Corruptor');
    }
  }
  
  // Level 3 Memory Core defeat (needs to have defeated a level 3 boss)
  if (!isAchievementUnlocked('defeat_level3_core') && state.highestBossLevelDefeated >= 3) {
    const achievementIndex = achievements.findIndex(a => a.id === 'defeat_level3_core');
    if (achievementIndex !== -1) {
      achievements[achievementIndex].unlocked = true;
      updated = true;
      console.log('Achievement unlocked: System Annihilator');
    }
  }
  
  // Save if any achievements were updated
  if (updated) {
    saveAchievements(achievements);
  }
};

// Get the highest score achieved
export const getHighestScore = (): number => {
  const scores = getScores();
  return scores.length > 0 ? Math.max(...scores) : 0;
};
