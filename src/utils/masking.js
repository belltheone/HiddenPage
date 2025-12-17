/**
 * 마스킹 유틸리티 함수
 * 형태소 분석된 토큰을 기반으로 마스킹/공개 처리
 */

/**
 * 마스킹된 텍스트 표시용 컴포넌트 데이터 생성
 * @param {Array} tokens - 형태소 분석된 토큰 배열
 * @param {Set} revealedWords - 공개된 단어 Set
 * @param {string} newWord - 방금 공개된 단어 (하이라이트용)
 * @returns {Array} 렌더링용 토큰 배열
 */
export function processTokensForDisplay(tokens, revealedWords, newWord = null) {
    return tokens.map((token, index) => {
        // 마스킹 대상이 아닌 경우 그대로 표시
        if (!token.isMasked) {
            return {
                ...token,
                displayText: token.text,
                isRevealed: false,
                isNew: false,
                key: index
            };
        }

        // 마스킹 대상인 경우
        const normalizedText = normalizeWord(token.text);
        const isRevealed = revealedWords.has(normalizedText);
        const isNew = newWord && normalizedText === normalizeWord(newWord);

        return {
            ...token,
            displayText: isRevealed ? token.text : getMaskedDisplay(token.text),
            isRevealed,
            isNew,
            key: index
        };
    });
}

/**
 * 단어 정규화 (비교용)
 * @param {string} word - 정규화할 단어
 * @returns {string} 정규화된 단어
 */
export function normalizeWord(word) {
    return word.toLowerCase().trim();
}

/**
 * 마스킹 표시 문자 생성
 * @param {string} text - 원본 텍스트
 * @returns {string} 마스킹된 표시 (글자수만큼 ⬛)
 */
export function getMaskedDisplay(text) {
    // 글자 수만큼 ⬛ 표시
    return '⬛'.repeat(text.length);
}

/**
 * 입력 단어가 문서에 몇 개 존재하는지 확인
 * @param {string} inputWord - 사용자 입력 단어
 * @param {Array} tokens - 형태소 분석된 토큰 배열
 * @returns {Object} { count: 매칭 개수, indices: 매칭된 인덱스들 }
 */
export function checkWordMatch(inputWord, tokens) {
    const normalizedInput = normalizeWord(inputWord);
    const matches = [];

    tokens.forEach((token, index) => {
        if (token.isMasked && normalizeWord(token.text) === normalizedInput) {
            matches.push(index);
        }
    });

    return {
        count: matches.length,
        indices: matches
    };
}

/**
 * 피드백 레벨 결정
 * @param {number} matchCount - 매칭된 단어 수
 * @returns {string} 'cold' | 'warm' | 'hot' | 'none'
 */
export function getFeedbackLevel(matchCount) {
    if (matchCount === 0) return 'cold';
    if (matchCount >= 1 && matchCount <= 5) return 'warm';
    if (matchCount > 5) return 'hot';
    return 'none';
}

/**
 * 피드백 메시지 생성
 * @param {string} level - 피드백 레벨
 * @param {number} count - 매칭 개수
 * @returns {string} 피드백 메시지
 */
export function getFeedbackMessage(level, count) {
    switch (level) {
        case 'cold':
            return '❄️ 이 단어는 문서에 없습니다';
        case 'warm':
            return `🔥 ${count}개의 단어를 찾았습니다!`;
        case 'hot':
            return `🎆 대박! ${count}개의 단어를 찾았습니다!`;
        default:
            return '';
    }
}

/**
 * 전체 마스킹된 단어 중 공개된 비율 계산
 * @param {Array} tokens - 형태소 분석된 토큰 배열
 * @param {Set} revealedWords - 공개된 단어 Set
 * @returns {Object} { revealed: 공개 수, total: 전체 수, percentage: 백분율 }
 */
export function calculateProgress(tokens, revealedWords) {
    const maskedTokens = tokens.filter(t => t.isMasked);
    const uniqueMaskedWords = new Set(maskedTokens.map(t => normalizeWord(t.text)));

    let revealedCount = 0;
    uniqueMaskedWords.forEach(word => {
        if (revealedWords.has(word)) {
            revealedCount++;
        }
    });

    const total = uniqueMaskedWords.size;
    const percentage = total > 0 ? Math.round((revealedCount / total) * 100) : 0;

    return {
        revealed: revealedCount,
        total,
        percentage
    };
}

/**
 * 게임 완료 여부 확인
 * @param {Array} tokens - 형태소 분석된 토큰 배열
 * @param {Set} revealedWords - 공개된 단어 Set
 * @returns {boolean} 모든 단어가 공개되었는지 여부
 */
export function isGameComplete(tokens, revealedWords) {
    const { percentage } = calculateProgress(tokens, revealedWords);
    return percentage === 100;
}
