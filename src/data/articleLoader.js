/**
 * 문서 데이터 로더
 * JSON 파일에서 형태소 분석된 문서를 로드합니다.
 */

// 문서 인덱스 (빌드 시 포함)
import articleIndex from './articles/index.json';

// 모든 문서를 동적으로 import
const articleModules = import.meta.glob('./articles/*.json', { eager: true });

/**
 * 문서 인덱스 가져오기
 */
export function getArticleIndex() {
    return articleIndex;
}

/**
 * 전체 문서 목록 가져오기
 */
export function getArticleList() {
    return articleIndex.articles;
}

/**
 * 카테고리 목록 가져오기
 */
export function getCategories() {
    return articleIndex.categories;
}

/**
 * ID로 특정 문서 가져오기
 */
export function getArticleById(id) {
    const path = `./articles/${id}.json`;
    const module = articleModules[path];
    return module ? module.default : null;
}

/**
 * 랜덤 문서 가져오기
 */
export function getRandomArticle() {
    const articles = articleIndex.articles;
    const randomIndex = Math.floor(Math.random() * articles.length);
    const article = articles[randomIndex];
    return getArticleById(article.id);
}

/**
 * 카테고리로 문서 필터링
 */
export function getArticlesByCategory(category) {
    return articleIndex.articles.filter(a => a.category === category);
}

/**
 * 오늘의 문서 가져오기 (날짜 기반 시드)
 */
export function getDailyArticle() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // 간단한 해시 함수로 날짜를 인덱스로 변환
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash = hash & hash;
    }

    const articles = articleIndex.articles;
    const index = Math.abs(hash) % articles.length;
    const article = articles[index];

    return getArticleById(article.id);
}

/**
 * 문서 토큰을 게임용 형식으로 변환
 * (기존 sampleArticles 형식과 호환)
 */
export function formatArticleForGame(article) {
    if (!article) return null;

    return {
        id: article.id,
        title: article.title,
        category: article.category,
        tokens: article.tokens.map(token => ({
            text: token.text,
            type: token.type,
            isMasked: token.isMasked
        }))
    };
}
