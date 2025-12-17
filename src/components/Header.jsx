import { useState, useEffect } from 'react';

/**
 * 헤더 컴포넌트
 * 로고, 다크모드 토글, 통계/도움말 버튼 포함
 */
export default function Header({ onShowStats, onShowHelp }) {
    const [isDark, setIsDark] = useState(false);

    // 초기 다크모드 상태 확인
    useEffect(() => {
        const savedTheme = localStorage.getItem('hiddenpage_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);
    }, []);

    // 다크모드 토글
    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
        localStorage.setItem('hiddenpage_theme', newIsDark ? 'dark' : 'light');
    };

    return (
        <header className="header">
            <div className="header-logo">
                <span className="header-logo-icon">🕵️</span>
                <span>히든페이지</span>
            </div>

            <div className="header-actions">
                <button
                    className="header-btn"
                    onClick={toggleDarkMode}
                    aria-label={isDark ? '라이트 모드' : '다크 모드'}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>
                <button
                    className="header-btn"
                    onClick={onShowHelp}
                    aria-label="게임 방법"
                >
                    ❓
                </button>
                <button
                    className="header-btn"
                    onClick={onShowStats}
                    aria-label="통계 보기"
                >
                    📊
                </button>
            </div>
        </header>
    );
}
