# 히든페이지 (Hidden Page)

> 🕵️ 나무위키 문서의 숨겨진 단어를 맞추는 단어 추측 게임

![Game Preview](/document/screenshots/game_preview.png)

## 🎮 게임 방법

1. 나무위키 문서가 제시됩니다. 명사는 ⬛로 숨겨져 있습니다.
2. 단어를 입력하여 숨겨진 단어를 찾으세요.
3. 모든 단어를 찾으면 게임 완료!

### 피드백 시스템

- ❄️ **Cold** - 문서에 없는 단어
- 🔥 **Warm** - 1~5개 발견
- 🎆 **Hot** - 6개 이상 발견!

## 🛠️ 기술 스택

- **Frontend**: Vite + React
- **Styling**: Vanilla CSS (다크모드, 글래스모피즘)
- **State**: React Hooks + LocalStorage

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📁 프로젝트 구조

```
hiddenpage/
├── src/
│   ├── components/      # UI 컴포넌트
│   ├── hooks/           # 커스텀 훅 (게임 로직)
│   ├── utils/           # 유틸리티 함수
│   └── data/            # 샘플 기사 데이터
├── document/            # 프로젝트 문서
└── public/              # 정적 파일
```

## 📖 문서

- [기획서](document/hiddenpage_masterplan.md)
- [개발 기록](document/DEVELOPMENT_LOG.md)

## 📄 라이선스

MIT License
