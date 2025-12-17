/**
 * 도움말 모달 컴포넌트
 * 게임 방법 설명
 */
export default function HelpModal({ onClose }) {
    return (
        <div className="stats-modal" onClick={onClose}>
            <div className="stats-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                <h2 className="stats-title">❓ 게임 방법</h2>

                <div style={{
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    lineHeight: '1.7',
                    color: 'var(--text-secondary)'
                }}>
                    <p style={{ marginBottom: 'var(--spacing-md)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>🕵️ 히든페이지</strong>는
                        나무위키 문서의 숨겨진 단어를 맞추는 게임입니다.
                    </p>

                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>📝 규칙:</strong>
                        <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: '1.2rem' }}>
                            <li>명사는 ⬛로 숨겨져 있습니다</li>
                            <li>조사, 동사, 부호는 공개됩니다</li>
                            <li>단어를 입력해서 숨겨진 단어를 찾으세요</li>
                            <li>모든 단어를 찾으면 게임 완료!</li>
                        </ul>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>🎨 피드백:</strong>
                        <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: '1.2rem' }}>
                            <li><span style={{ color: 'var(--feedback-cold)' }}>❄️ Cold</span> - 문서에 없는 단어</li>
                            <li><span style={{ color: 'var(--feedback-warm)' }}>🔥 Warm</span> - 1~5개 발견</li>
                            <li><span style={{ color: 'var(--feedback-hot)' }}>🎆 Hot</span> - 6개 이상 발견!</li>
                        </ul>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        💡 팁: 일반적인 단어(대한민국, 역사, 문화 등)부터 시도해보세요!
                    </p>
                </div>

                <button className="stats-close" onClick={onClose}>
                    게임 시작!
                </button>
            </div>
        </div>
    );
}
