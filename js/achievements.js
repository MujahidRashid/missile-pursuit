const ACHIEVEMENTS_STORAGE_KEY = 'missile_pursuit_achievements';

export const ACHIEVEMENTS = [
    {
        id: 'first_blood',
        name: 'FIRST BLOOD',
        description: 'Complete level 1',
        icon: '🎯'
    },
    {
        id: 'level_5_survivor',
        name: 'LEVEL 5 SURVIVOR',
        description: 'Reach level 5',
        icon: '⭐'
    },
    {
        id: 'level_10_master',
        name: 'LEVEL 10 MASTER',
        description: 'Reach level 10',
        icon: '👑'
    },
    {
        id: 'realistic_rookie',
        name: 'REALISTIC ROOKIE',
        description: 'Complete a level in Realistic mode',
        icon: '📡'
    },
    {
        id: 'sam_survivor',
        name: 'SAM SURVIVOR',
        description: 'Beat level 5+ with 5 SAM sites',
        icon: '💥'
    },
    {
        id: 'perfect_strike',
        name: 'PERFECT STRIKE',
        description: 'Destroy target without getting hit',
        icon: '🎪'
    },
    {
        id: 'arsenal_master',
        name: 'ARSENAL MASTER',
        description: 'Use all 3 missile types',
        icon: '🚀'
    },
    {
        id: 'a10_pilot',
        name: 'A-10 PILOT',
        description: 'Complete 5 levels with A-10',
        icon: '✈️'
    },
    {
        id: 'tactician',
        name: 'TACTICIAN',
        description: 'Use Tactical Missile 3 times',
        icon: '🎓'
    },
    {
        id: 'speedrunner',
        name: 'SPEEDRUNNER',
        description: 'Complete any level in under 45 seconds',
        icon: '⚡'
    }
];

export function getUnlockedAchievements() {
    const data = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function unlockAchievement(id) {
    const unlocked = getUnlockedAchievements();
    if (!unlocked.includes(id)) {
        unlocked.push(id);
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(unlocked));
        return true;
    }
    return false;
}

export function isAchievementUnlocked(id) {
    return getUnlockedAchievements().includes(id);
}

export function getAchievementById(id) {
    return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementStats() {
    const unlocked = getUnlockedAchievements();
    return {
        total: ACHIEVEMENTS.length,
        unlockedCount: unlocked.length,
        percentage: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)
    };
}
