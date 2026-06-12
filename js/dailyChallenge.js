const DAILY_CHALLENGE_KEY = 'missile_pursuit_daily_challenge';

const CHALLENGE_TEMPLATES = [
    { level: 3, mode: 'easy', missile: 'standard', sams: 3, name: 'Triple Threat' },
    { level: 5, mode: 'easy', missile: 'advanced', sams: 4, name: 'Advanced Challenge' },
    { level: 7, mode: 'realistic', missile: 'tactical', sams: 3, name: 'Tactical Reality' },
    { level: 2, mode: 'easy', missile: 'standard', sams: 5, name: 'SAM Gauntlet' },
    { level: 4, mode: 'realistic', missile: 'standard', sams: 2, name: 'Radar Training' },
    { level: 6, mode: 'easy', missile: 'tactical', sams: 3, name: 'Missile Mastery' }
];

function getDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function generateChallenge() {
    const dateKey = getDateKey();
    const seed = dateKey.split('-').reduce((a, b) => a + parseInt(b), 0);
    const index = seed % CHALLENGE_TEMPLATES.length;
    return CHALLENGE_TEMPLATES[index];
}

export function getDailyChallenge() {
    const stored = localStorage.getItem(DAILY_CHALLENGE_KEY);
    if (!stored) {
        const challenge = generateChallenge();
        saveDailyChallenge(challenge);
        return challenge;
    }

    const data = JSON.parse(stored);
    if (data.date !== getDateKey()) {
        const challenge = generateChallenge();
        saveDailyChallenge(challenge);
        return challenge;
    }

    return data.challenge;
}

function saveDailyChallenge(challenge) {
    const data = {
        date: getDateKey(),
        challenge: challenge,
        completed: false
    };
    localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(data));
}

export function completeDailyChallenge() {
    const data = JSON.parse(localStorage.getItem(DAILY_CHALLENGE_KEY) || '{}');
    data.completed = true;
    localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(data));
}

export function isDailyChallengeCompleted() {
    const data = localStorage.getItem(DAILY_CHALLENGE_KEY);
    return data ? JSON.parse(data).completed : false;
}

export function matchesDailyChallenge(level, mode, missileId, samCount) {
    const challenge = getDailyChallenge();
    return challenge.level === level &&
           challenge.mode === mode &&
           challenge.missile === missileId &&
           challenge.sams === samCount;
}
