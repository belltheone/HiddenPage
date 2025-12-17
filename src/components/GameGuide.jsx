/**
 * 게임 가이드 컴포넌트 (상단 고정)
 * 게임 방법을 게임 영역 상단에 항상 표시
 */
export default function GameGuide() {
    return (
        <div className="game-guide">
            <div className="guide-title">
                <span className="guide-icon">🕵️</span>
                <span>게임 방법</span>
            </div>

            <div className="guide-content">
                <div className="guide-item">
                    <span className="guide-step">1</span>
                    <span>명사는 <strong>⬛</strong>로 숨겨져 있습니다</span>
                </div>
                <div className="guide-item">
                    <span className="guide-step">2</span>
                    <span>단어를 입력해서 숨겨진 단어를 찾으세요</span>
                </div>
                <div className="guide-item">
                    <span className="guide-step">3</span>
                    <span>모든 단어를 찾으면 게임 완료!</span>
                </div>
            </div>

            <div className="guide-feedback">
                <span className="feedback-cold">❄️ Cold</span>
                <span className="feedback-warm">🔥 Warm</span>
                <span className="feedback-hot">🎆 Hot</span>
            </div>
        </div>
    );
}
