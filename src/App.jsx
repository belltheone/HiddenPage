import { useState } from 'react';
import { useGame } from './hooks/useGame';
import Header from './components/Header';
import GameGuide from './components/GameGuide';
import DailyStatus from './components/DailyStatus';
import GameBoard from './components/GameBoard';
import InputBar from './components/InputBar';
import ResultScreen from './components/ResultScreen';
import StatsModal from './components/StatsModal';
import { getRandomArticle, formatArticleForGame } from './data/articleLoader';

/**
 * 히든페이지 메인 앱 컴포넌트
 */
function App() {
    // 모달 상태
    const [showStats, setShowStats] = useState(false);

    // 게임 훅
    const {
        article,
        displayTokens,
        guessCount,
        feedback,
        isComplete,
        showResult,
        progress,
        formattedTime,
        userStats,
        submitWord,
        initGame,
        closeResult
    } = useGame();

    // 새 게임 시작 (랜덤 기사)
    const handlePlayAgain = () => {
        const randomArticle = formatArticleForGame(getRandomArticle());
        initGame(randomArticle);
        closeResult();
    };

    return (
        <div className="app-container">
            {/* 헤더 */}
            <Header
                onShowStats={() => setShowStats(true)}
            />

            {/* 메인 레이아웃 (PC: 3컬럼) */}
            <main className="main-layout">
                {/* 좌측 광고 사이드바 (PC만) */}
                <aside className="ad-sidebar">
                    <div className="ad-slot">
                        <span>광고<br />160x600</span>
                    </div>
                </aside>

                {/* 게임 영역 */}
                <div className="game-area">
                    {/* 게임 가이드 (상단 고정) */}
                    <GameGuide />

                    {/* 일일 퀴즈 완료 상태 */}
                    <DailyStatus isComplete={isComplete} />

                    <GameBoard
                        article={article}
                        displayTokens={displayTokens}
                        progress={progress}
                        guessCount={guessCount}
                        formattedTime={formattedTime}
                    />
                </div>

                {/* 우측 광고 사이드바 (PC만) */}
                <aside className="ad-sidebar">
                    <div className="ad-slot">
                        <span>광고<br />160x600</span>
                    </div>
                </aside>
            </main>

            {/* 입력창 (하단 고정) */}
            <InputBar
                onSubmit={submitWord}
                feedback={feedback}
                disabled={isComplete}
            />

            {/* 결과 화면 */}
            {showResult && article && (
                <ResultScreen
                    article={article}
                    guessCount={guessCount}
                    formattedTime={formattedTime}
                    progress={progress}
                    onClose={closeResult}
                    onPlayAgain={handlePlayAgain}
                />
            )}

            {/* 통계 모달 */}
            {showStats && (
                <StatsModal
                    stats={userStats}
                    onClose={() => setShowStats(false)}
                />
            )}
        </div>
    );
}

export default App;

