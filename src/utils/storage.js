/**
 * 로컬 스토리지 관리 유틸리티
 * 사용자 통계 및 게임 상태 저장
 */

const STORAGE_KEYS = {
    USER_STATS: 'hiddenpage_user_stats',
    GAME_STATE: 'hiddenpage_game_state',
    LAST_PLAYED: 'hiddenpage_last_played'
};

/**
 * 사용자 통계 기본값
 */
const DEFAULT_STATS = {
    totalGames: 0,
    totalWins: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalGuesses: 0,
    averageGuesses: 0
};

/**
 * 로컬 스토리지에서 데이터 불러오기
 * @param {string} key - 스토리지 키
 * @param {any} defaultValue - 기본값
 * @returns {any} 저장된 값 또는 기본값
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('로컬 스토리지 읽기 실패:', error);
        return defaultValue;
    }
}

/**
 * 로컬 스토리지에 데이터 저장
 * @param {string} key - 스토리지 키
 * @param {any} value - 저장할 값
 */
export function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('로컬 스토리지 저장 실패:', error);
    }
}

/**
 * 사용자 통계 불러오기
 * @returns {Object} 사용자 통계
 */
export function getUserStats() {
    return getFromStorage(STORAGE_KEYS.USER_STATS, DEFAULT_STATS);
}

/**
 * 사용자 통계 저장
 * @param {Object} stats - 저장할 통계
 */
export function saveUserStats(stats) {
    saveToStorage(STORAGE_KEYS.USER_STATS, stats);
}

/**
 * 게임 결과로 통계 업데이트
 * @param {boolean} won - 승리 여부
 * @param {number} guesses - 시도 횟수
 */
export function updateStatsAfterGame(won, guesses) {
    const stats = getUserStats();

    stats.totalGames += 1;
    stats.totalGuesses += guesses;
    stats.averageGuesses = Math.round(stats.totalGuesses / stats.totalGames);

    if (won) {
        stats.totalWins += 1;
        stats.currentStreak += 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
        stats.currentStreak = 0;
    }

    saveUserStats(stats);
    return stats;
}

/**
 * 오늘 게임을 이미 했는지 확인
 * @returns {boolean} 오늘 플레이 여부
 */
export function hasPlayedToday() {
    const lastPlayed = getFromStorage(STORAGE_KEYS.LAST_PLAYED, null);
    if (!lastPlayed) return false;

    const today = new Date().toDateString();
    return lastPlayed === today;
}

/**
 * 오늘 날짜를 마지막 플레이로 저장
 */
export function markPlayedToday() {
    const today = new Date().toDateString();
    saveToStorage(STORAGE_KEYS.LAST_PLAYED, today);
}

/**
 * 게임 상태 저장 (진행 중인 게임)
 * @param {Object} gameState - 게임 상태
 */
export function saveGameState(gameState) {
    saveToStorage(STORAGE_KEYS.GAME_STATE, {
        ...gameState,
        savedAt: new Date().toISOString()
    });
}

/**
 * 저장된 게임 상태 불러오기
 * @returns {Object|null} 저장된 게임 상태
 */
export function loadGameState() {
    return getFromStorage(STORAGE_KEYS.GAME_STATE, null);
}

/**
 * 저장된 게임 상태 삭제
 */
export function clearGameState() {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
}

/**
 * 모든 저장 데이터 초기화 (개발용)
 */
export function resetAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}
