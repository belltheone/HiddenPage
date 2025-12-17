import { useState, useEffect } from 'react';
import { hasPlayedToday } from '../utils/storage';

/**
 * 일일 퀴즈 상태 컴포넌트
 * 오늘의 퀴즈 완료 여부와 다음 퀴즈까지의 카운트다운 표시
 */
export default function DailyStatus({ isComplete }) {
    const [timeUntilNext, setTimeUntilNext] = useState('');
    const [played, setPlayed] = useState(false);

    // 다음 자정까지 남은 시간 계산
    const calculateTimeUntilMidnight = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 초기 상태 및 카운트다운 업데이트
    useEffect(() => {
        setPlayed(hasPlayedToday() || isComplete);
        setTimeUntilNext(calculateTimeUntilMidnight());

        const interval = setInterval(() => {
            setTimeUntilNext(calculateTimeUntilMidnight());
        }, 1000);

        return () => clearInterval(interval);
    }, [isComplete]);

    // 게임 진행 중이면 표시하지 않음
    if (!played && !isComplete) {
        return null;
    }

    return (
        <div className="daily-status">
            <div className="daily-status-badge">
                <span className="check-icon">✅</span>
                <span>오늘의 퀴즈 완료!</span>
            </div>

            <div className="daily-countdown">
                <span className="countdown-label">다음 퀴즈까지</span>
                <span className="countdown-time">{timeUntilNext}</span>
            </div>
        </div>
    );
}
