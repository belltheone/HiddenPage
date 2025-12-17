/**
 * 통계 모달 컴포넌트
 * 사용자의 전체 게임 통계 표시
 */
export default function StatsModal({ stats, onClose }) {
    return (
        <div className="stats-modal" onClick={onClose}>
            <div className="stats-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="stats-title">📊 내 통계</h2>

                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">{stats.totalGames}</div>
                        <div className="stat-label">플레이 횟수</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">
                            {stats.totalGames > 0
                                ? Math.round((stats.totalWins / stats.totalGames) * 100)
                                : 0}%
                        </div>
                        <div className="stat-label">승률</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{stats.currentStreak}</div>
                        <div className="stat-label">현재 연승</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{stats.maxStreak}</div>
                        <div className="stat-label">최고 연승</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{stats.averageGuesses || '-'}</div>
                        <div className="stat-label">평균 시도</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{stats.totalWins}</div>
                        <div className="stat-label">완료한 게임</div>
                    </div>
                </div>

                <button className="stats-close" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
}
