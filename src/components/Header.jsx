import { useState } from 'react';

/**
 * 헤더 컴포넌트
 * 로고, 통계 버튼, 도움말 버튼 포함
 */
export default function Header({ onShowStats, onShowHelp }) {
    return (
        <header className="header">
            <div className="header-logo">
                <span className="header-logo-icon">🕵️</span>
                <span>히든페이지</span>
            </div>

            <div className="header-actions">
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
