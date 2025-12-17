import { useMemo } from 'react';

/**
 * 게임 보드 컴포넌트
 * 마스킹된 문서를 표시하고 진행률을 보여줌
 */
export default function GameBoard({
    article,
    displayTokens,
    progress,
    guessCount,
    formattedTime
}) {
    // 토큰들을 렌더링
    const renderedContent = useMemo(() => {
        return displayTokens.map((token, index) => {
            // 마스킹되지 않은 일반 텍스트/조사/부호
            if (!token.isMasked || token.isRevealed) {
                if (token.isRevealed) {
                    return (
                        <span
                            key={token.key}
                            className={`revealed-word ${token.isNew ? 'new' : ''}`}
                        >
                            {token.displayText}
                        </span>
                    );
                }

                // 줄바꿈 처리
                if (token.text === '\n\n') {
                    return <br key={token.key} />;
                }

                return (
                    <span key={token.key} className="normal-text">
                        {token.displayText}
                    </span>
                );
            }

            // 마스킹된 단어
            return (
                <span key={token.key} className="masked-word">
                    {token.displayText}
                </span>
            );
        });
    }, [displayTokens]);

    if (!article) {
        return (
            <div className="game-board">
                <div className="game-content" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="game-board">
            {/* 헤더: 카테고리 및 진행률 */}
            <div className="game-board-header">
                <span className="game-category">{article.category}</span>

                <div className="game-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                    <span className="progress-text">
                        {progress.revealed}/{progress.total} ({progress.percentage}%)
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    <span>⏱️ {formattedTime}</span>
                    <span>🎯 {guessCount}회 시도</span>
                </div>
            </div>

            {/* 문서 본문 */}
            <div className="game-content">
                {renderedContent}
            </div>
        </div>
    );
}
