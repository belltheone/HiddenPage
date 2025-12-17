import { useState, useRef, useEffect } from 'react';

/**
 * 입력창 컴포넌트
 * 단어 입력 및 피드백 표시
 */
export default function InputBar({
    onSubmit,
    feedback,
    disabled = false
}) {
    const [inputValue, setInputValue] = useState('');
    const [animationClass, setAnimationClass] = useState('');
    const inputRef = useRef(null);

    // 피드백에 따른 애니메이션 클래스 설정
    useEffect(() => {
        if (feedback.level && feedback.level !== 'none') {
            setAnimationClass(`feedback-${feedback.level}`);

            // 애니메이션 후 클래스 제거
            const timeout = setTimeout(() => {
                setAnimationClass('');
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [feedback]);

    // 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || disabled) return;

        onSubmit(inputValue);
        setInputValue('');
        inputRef.current?.focus();
    };

    return (
        <div className="input-bar">
            <form className="input-wrapper" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    className={`input-field ${animationClass}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="단어를 입력하세요..."
                    disabled={disabled}
                    autoComplete="off"
                    autoCapitalize="none"
                />
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={disabled || !inputValue.trim()}
                >
                    확인
                </button>
            </form>

            {/* 피드백 메시지 */}
            {feedback.message && (
                <div className={`feedback-message ${feedback.level}`}>
                    {feedback.message}
                </div>
            )}

            {/* 모바일 광고 슬롯 (placeholder) */}
            <div className="mobile-ad-slot">
                <span>광고 영역 (320x50)</span>
            </div>
        </div>
    );
}
