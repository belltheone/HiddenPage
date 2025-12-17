import { useState, useCallback, useEffect } from 'react';
import {
    processTokensForDisplay,
    checkWordMatch,
    getFeedbackLevel,
    getFeedbackMessage,
    calculateProgress,
    isGameComplete,
    normalizeWord
} from '../utils/masking';
import {
    getUserStats,
    updateStatsAfterGame,
    saveGameState,
    loadGameState,
    clearGameState,
    markPlayedToday
} from '../utils/storage';
import { getTodayArticle } from '../data/sampleArticles';

/**
 * 게임 상태 관리 커스텀 훅
 * 게임 로직 전체를 관리하는 중앙 훅
 */
export function useGame() {
    // 현재 기사 데이터
    const [article, setArticle] = useState(null);

    // 공개된 단어 Set
    const [revealedWords, setRevealedWords] = useState(new Set());

    // 방금 공개된 단어 (하이라이트용)
    const [newWord, setNewWord] = useState(null);

    // 시도 횟수
    const [guessCount, setGuessCount] = useState(0);

    // 피드백 상태
    const [feedback, setFeedback] = useState({ level: 'none', message: '', count: 0 });

    // 게임 완료 여부
    const [isComplete, setIsComplete] = useState(false);

    // 게임 시작 시간
    const [startTime, setStartTime] = useState(null);

    // 경과 시간 (초)
    const [elapsedTime, setElapsedTime] = useState(0);

    // 사용자 통계
    const [userStats, setUserStats] = useState(getUserStats());

    // 결과 화면 표시 여부
    const [showResult, setShowResult] = useState(false);

    // 게임 초기화
    const initGame = useCallback((articleData = null) => {
        const gameArticle = articleData || getTodayArticle();
        setArticle(gameArticle);
        setRevealedWords(new Set());
        setNewWord(null);
        setGuessCount(0);
        setFeedback({ level: 'none', message: '', count: 0 });
        setIsComplete(false);
        setStartTime(Date.now());
        setElapsedTime(0);
        setShowResult(false);
        clearGameState();
    }, []);

    // 저장된 게임 상태 복원
    useEffect(() => {
        const savedState = loadGameState();
        if (savedState && savedState.articleId) {
            // 저장된 상태가 있으면 복원
            const savedArticle = getTodayArticle(); // 오늘의 기사
            if (savedArticle.id === savedState.articleId) {
                setArticle(savedArticle);
                setRevealedWords(new Set(savedState.revealedWords || []));
                setGuessCount(savedState.guessCount || 0);
                setStartTime(savedState.startTime || Date.now());
                return;
            }
        }
        // 새 게임 시작
        initGame();
    }, [initGame]);

    // 경과 시간 업데이트
    useEffect(() => {
        if (!startTime || isComplete) return;

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    // 새 단어 하이라이트 해제 (3초 후)
    useEffect(() => {
        if (newWord) {
            const timeout = setTimeout(() => setNewWord(null), 3000);
            return () => clearTimeout(timeout);
        }
    }, [newWord]);

    // 단어 제출
    const submitWord = useCallback((inputWord) => {
        if (!article || !inputWord.trim() || isComplete) return false;

        const word = inputWord.trim();
        const normalizedInput = normalizeWord(word);

        // 이미 공개된 단어인지 확인
        if (revealedWords.has(normalizedInput)) {
            setFeedback({
                level: 'none',
                message: '이미 찾은 단어입니다',
                count: 0
            });
            return false;
        }

        // 매칭 확인
        const match = checkWordMatch(word, article.tokens);
        const level = getFeedbackLevel(match.count);
        const message = getFeedbackMessage(level, match.count);

        // 시도 횟수 증가
        setGuessCount(prev => prev + 1);

        // 피드백 설정
        setFeedback({ level, message, count: match.count });

        if (match.count > 0) {
            // 단어 공개
            const newRevealedWords = new Set(revealedWords);
            newRevealedWords.add(normalizedInput);
            setRevealedWords(newRevealedWords);
            setNewWord(word);

            // 게임 상태 저장
            saveGameState({
                articleId: article.id,
                revealedWords: Array.from(newRevealedWords),
                guessCount: guessCount + 1,
                startTime
            });

            // 게임 완료 확인
            if (isGameComplete(article.tokens, newRevealedWords)) {
                setIsComplete(true);
                markPlayedToday();
                const updatedStats = updateStatsAfterGame(true, guessCount + 1);
                setUserStats(updatedStats);

                // 결과 화면 표시 딜레이
                setTimeout(() => setShowResult(true), 1500);
            }

            return true;
        }

        return false;
    }, [article, revealedWords, isComplete, guessCount, startTime]);

    // 진행률 계산
    const progress = article
        ? calculateProgress(article.tokens, revealedWords)
        : { revealed: 0, total: 0, percentage: 0 };

    // 표시용 토큰 데이터
    const displayTokens = article
        ? processTokensForDisplay(article.tokens, revealedWords, newWord)
        : [];

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        // 상태
        article,
        displayTokens,
        revealedWords,
        guessCount,
        feedback,
        isComplete,
        showResult,
        progress,
        elapsedTime,
        formattedTime: formatTime(elapsedTime),
        userStats,

        // 액션
        submitWord,
        initGame,
        closeResult: () => setShowResult(false),
        refreshStats: () => setUserStats(getUserStats())
    };
}
