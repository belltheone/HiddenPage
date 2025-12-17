🕵️‍♂️ 프로젝트 명세서: 히든 페이지 (Hidden Page) - Production Level

Version: 2.1 (Monetization & Ads Enhanced)
Project Name: 히든 페이지 (Hidden Page)
Core Tech: NLP (Morphological Analysis), Vector Search
Platform: Web (Mobile First / PC Responsive)

1. 🧠 핵심 로직 및 NLP 처리 (Advanced NLP)

1.1. 한국어 형태소 분석 전략 (The Tokenizer)

한국어 나무위키는 조사(은/는/이/가/을/를)가 명사와 붙어 있어 단순 split(" ")으로는 게임이 불가능합니다.

분석기: Mecab-ko (속도 최우선) 또는 Nori (Elasticsearch 기반).

전처리 프로세스 (ETL):

나무위키 텍스트 추출.

형태소 분석 수행 -> (단어, 품사) 쌍으로 분리.

마스킹 규칙:

명사(NNG, NNP), 수사(NR), 어근(XR): 마스킹 대상 (⬛).

조사(J), 어미(E), 부호(S): 공개 대상 (그대로 노출).

예시: "사과는 맛있다." -> [사과](NNG) + [는](JX) + [맛있](VA) + [다](EF) -> ⬛⬛는 맛있다.

정규화 (Normalization):

사용자가 "사과"를 입력하면 -> 본문의 "사과", "사과는", "사과를"의 어근이 모두 공개됨.

1.2. 의미적 유사도 힌트 (Semantic Hint) - Killer Feature

단순히 단어를 맞추는 것을 넘어, **"정답과 의미가 가까운 단어"**를 시각적으로 보여줍니다.

Vector DB (pgvector on Supabase):

모든 명사 단어의 임베딩 벡터를 미리 계산하여 저장.

사용자가 바나나를 입력했는데 오답임. 하지만 정답 사과와 유사도가 높음(과일).

Feedback: "정답과 78% 유사합니다! (과일 카테고리)" 메시지 출력.

2. 📡 시스템 아키텍처 (Architecture)

2.1. 데이터 파이프라인

Source: 나무위키 인기 문서 및 추천 문서 목록 크롤링.

Daily Batch: 매일 새벽 4시, 다음 날 퀴즈 데이터를 미리 가공(형태소 분석 + 벡터 임베딩)하여 daily_quiz 테이블에 적재.

On-Demand: 사용자가 플레이할 때 클라이언트는 이미 가공된 JSON(마스킹 된 구조)만 받아옴 -> 초기 로딩 속도 극대화.

2.2. 데이터베이스 스키마

-- 1. 일일 퀴즈 데이터
CREATE TABLE daily_quiz (
    date DATE PRIMARY KEY,
    article_title VARCHAR(200), -- 정답
    category VARCHAR(100), -- 힌트용 (역사, 과학 등)
    content_json JSONB, -- 형태소 분석된 전체 본문 구조
    vector_embedding VECTOR(1536) -- 제목의 임베딩 벡터 (힌트용)
);

-- 2. 유저 기록 (로컬 스토리지 + DB 하이브리드)
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY,
    total_games INTEGER,
    win_streak INTEGER,
    average_guesses FLOAT, -- 평균 시도 횟수
    last_played_date DATE
);

-- 3. 글로벌 통계 (집단 지성)
CREATE TABLE global_stats (
    date DATE PRIMARY KEY REFERENCES daily_quiz(date),
    total_players INTEGER,
    avg_guesses_to_solve INTEGER, -- 평균 정답 시도 횟수
    hardest_word VARCHAR(100) -- 사람들이 가장 늦게 찾은 단어
);


3. 🎨 UI/UX 디테일

3.1. 게임 플레이 화면

Virtual Scrolling: 나무위키 본문은 매우 길기 때문에, react-window 등을 사용하여 화면에 보이는 부분만 렌더링 (성능 최적화).

Input Bar:

화면 하단 고정.

Autocomplete (자동완성): 사용자가 이미 찾은 단어는 자동완성에서 제외.

Mini Map (우측 스크롤바):

문서 전체에서 "내가 방금 맞춘 단어"가 분포한 위치를 색깔 띠로 표시. (탐색 용이성)

3.2. 피드백 및 연출

Cold / Warm / Hot:

입력한 단어가 문서 내에 없으면: 파란색 진동 (Cold).

입력한 단어가 문서 내에 1~5개면: 노란색 (Warm).

입력한 단어가 문서 내에 20개 이상이면: 붉은색 폭죽 + 화면 스크롤 자동 이동 (Hot).

4. 💰 수익화 전략 (Monetization & Ads) [Updated]

4.1. 플랫폼별 광고 배치 (Ad Placements)

사용자 경험(UX)을 해치지 않으면서 노출을 극대화하는 반응형 광고 전략입니다.

구분

광고 위치

광고 유형

동작 방식

PC Web

좌/우측 사이드바

Vertical Banner (160x600)

메인 콘텐츠 양옆에 고정(Sticky). 스크롤 시 따라옴.

PC Web

화면 최하단

Horizontal Banner (728x90)

입력창(Input Bar) 바로 아래 고정 노출.

Mobile

화면 최하단

Mobile Banner (320x50/100)

입력창 바로 아래 고정. 키보드가 올라올 때도 유지.

공통

힌트 사용 시

Rewarded Video (전면)

결정적인 힌트 사용 시 15~30초 광고 시청 필수.

4.2. 동적 광고 새로고침 (Dynamic Ad Refresh)

게임 특성상 사용자가 화면에 오래 머물며, 반복적인 입력 행위를 합니다. 이를 수익으로 연결합니다.

Trigger: 사용자가 정답을 입력하거나(Enter), 추측을 제출할 때마다 카운트.

Logic:

매 5회~10회 시도마다 배너 광고 슬롯을 자동으로 새로고침(Refresh)하여 새로운 광고 로드.

효과: 한 게임당 평균 50번의 시도를 한다면, 광고 노출 횟수(Impressions)가 단일 접속 대비 5배~10배 증가.

주의사항: 잦은 깜빡임으로 인한 피로도를 줄이기 위해 Fade-in/out 트랜지션 적용 필수.

5. 📊 수익성 분석 (Profitability Analysis) [New]

[가정]

DAU (일일 활성 사용자): 3,000명 (초기 바이럴 성공 시 보수적 수치)

평균 플레이 시간: 10분

평균 시도 횟수: 50회 (광고 새로고침 5회 발생)

CPM (1,000회 노출당 단가): 배너 $0.5 ~ $1.5 / 보상형 $10 ~ $20 (한국 기준)

5.1. 예상 수익 (Revenue Simulation)

배너 광고 수익 (PC/Mobile 혼합):

1인당 노출 수: 5회 (새로고침) x 1.5개 (슬롯 평균) = 7.5회 노출

총 노출(Impression): 3,000명 x 7.5회 = 22,500회

예상 일수익: (22,500 / 1,000) * $1.0 (평균 CPM) = **$22.5 (약 3만 원)**

보상형 광고 수익 (힌트):

힌트 사용률: 20% (600명 시청)

예상 일수익: (600 / 1,000) * $15 (평균 eCPM) = **$9.0 (약 1.2만 원)**

👉 일 예상 수익: $31.5 (약 4.2만 원)
👉 월 예상 수익: **$945 (약 126만 원)**

5.2. 예상 비용 (Cost Simulation)

OpenAI API (Vector Embeddings):

비용 구조: text-embedding-3-small 모델 ($0.00002 / 1k tokens)

사용량:

Daily Batch (기사 1개): 10,000 토큰 미만 = $0.0002 (거의 0원)

User Hint (유사도 검색): 미리 DB에 저장된 벡터와 비교하므로 API 호출 불필요 (DB 쿼리만 발생).

월 비용: $1 미만 (사실상 0원)

Hosting & DB (Vercel + Supabase):

초기: Free Tier로 충분.

트래픽 증가 시: Vercel Pro ($20) + Supabase Pro ($25)

월 비용: $0 ~ $45 (최대 6만 원)

5.3. 손익분기점 (BEP)

월 수익(126만 원) - 월 비용(6만 원) = 순수익 약 120만 원

결론: API 비용이 거의 들지 않는 구조(캐싱 및 사전 처리) 덕분에, 트래픽이 늘어날수록 순수익률이 90% 이상인 고마진 구조입니다.

6. 📅 개발 페이즈 (Roadmap)

Phase 1 (NLP Core): 나무위키 파싱, 형태소 분석기(Mecab/Nori) 서버리스 포팅, 마스킹 로직 구현.

Phase 2 (Game Loop): 단어 입력 매칭 시스템, 가상 스크롤, 기본 UI.

Phase 3 (Ads & Optimization):

PC/Mobile 반응형 광고 슬롯 배치.

입력 이벤트(onSubmit)에 광고 새로고침(refreshAd()) 트리거 연동.

보상형 광고(힌트) 로직 구현.

Phase 4 (Social): 결과 이미지 공유, 글로벌/그룹 통계 시스템.