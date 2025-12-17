/**
 * 결과 화면 컴포넌트
 * 게임 완료 시 통계 및 공유 옵션 표시
 */
export default function ResultScreen({
    article,
    guessCount,
    formattedTime,
    progress,
    onClose,
    onPlayAgain,
    onShare
}) {
    // 공유 텍스트 생성
    const generateShareText = () => {
        const emoji = progress.percentage === 100 ? '🎉' : '📖';
        return `${emoji} 히든페이지
📝 ${article.category}
✅ ${progress.revealed}/${progress.total} 단어
🎯 ${guessCount}회 시도
⏱️ ${formattedTime}

https://hiddenpage.game`;
    };

    // 공유하기
    const handleShare = async () => {
        const text = generateShareText();

        if (navigator.share) {
            try {
                await navigator.share({ text });
            } catch (err) {
                // 사용자가 공유 취소
            }
        } else {
            // 클립보드 복사
            navigator.clipboard.writeText(text);
            alert('결과가 클립보드에 복사되었습니다!');
        }
    };

    return (
        <div className="result-overlay" onClick={onClose}>
            <div className="result-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="result-title">
                    {progress.percentage === 100 ? '🎉 완벽해요!' : '📖 수고하셨어요!'}
                </h2>

                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                    <strong>"{article.title}"</strong> 문서였습니다!
                </p>

                <div className="result-stats">
                    <div className="stat-item">
                        <div className="stat-value">{progress.revealed}/{progress.total}</div>
                        <div className="stat-label">찾은 단어</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{guessCount}</div>
                        <div className="stat-label">시도 횟수</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{formattedTime}</div>
                        <div className="stat-label">소요 시간</div>
                    </div>
                </div>

                <div className="result-actions">
                    <button
                        className="result-btn primary"
                        onClick={handleShare}
                    >
                        📤 결과 공유하기
                    </button>
                    <button
                        className="result-btn secondary"
                        onClick={onPlayAgain}
                    >
                        🔄 다른 문서 도전
                    </button>
                    <button
                        className="result-btn secondary"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
