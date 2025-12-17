🎨 Design System: 히든페이지 (Hidden Page)

Version: 2.0 (Deep Dive & Implementation Spec)
Tech Stack: Next.js 16, Tailwind CSS, Shadcn/ui, Hugeicons
Philosophy: "Intellectual Noir & High Contrast" (지적인 긴장감)

1. 🛠 Tailwind Configuration (Design Tokens)

tailwind.config.ts 설정입니다. 가독성을 최우선으로 하되, 느와르 영화 같은 대비를 줍니다.

1.1. Theme Colors

colors: {
  background: {
    DEFAULT: "#F2F0E9", // Paper: 오래된 서류 종이색
    dark: "#121212",    // Noir: 암실 배경
  },
  foreground: {
    DEFAULT: "#1A1A1A", // Ink: 잉크 블랙
    dark: "#E0E0E0",    // Smoke: 연기색 텍스트
  },
  mask: {
    DEFAULT: "#000000", // Redacted: 완전한 검정 (Light Mode)
    dark: "#2C2C2C",    // Redacted: 다크 그레이 (Dark Mode)
  },
  highlight: {
    hot: "#FF3B30",   // Crimson: 결정적 단서
    warm: "#FFCC00",  // Amber: 주변 단서
    cold: "#007AFF",  // Azure: 관련 없음
    selection: "#B4D5FE" // 드래그 선택 색상
  }
}


1.2. Typography Details

텍스트 중심 서비스이므로 타이포그래피 설정이 매우 구체적이어야 합니다.

fontFamily: {
  serif: ['"RIDIBatang"', '"Merriweather"', 'serif'], // 본문
  sans: ['"Pretendard"', 'sans-serif'], // UI
  mono: ['"D2Coding"', '"JetBrains Mono"', 'monospace'], // 입력창, 데이터
}


2. 📱 Component Architecture

2.1. The Document Viewer (핵심 본문 영역)

ScrollArea 내부의 텍스트 렌더링 규칙입니다.

Container:

max-w-[680px] (PC 기준 최적의 독서 폭).

mx-auto (중앙 정렬).

px-6 py-12 (여유로운 패딩).

Text Style:

font-serif text-[17px] md:text-[19px] (모바일/PC 크기 차별화).

leading-[1.8] (줄 간격을 넓게 하여 호흡 조절).

text-justify break-keep (양쪽 정렬 및 단어 단위 줄바꿈).

The Redacted Block (마스킹):

Base: bg-mask text-transparent rounded-[2px] px-[1px] select-none cursor-help.

Interaction: 마우스 오버 시 opacity-90 (살짝 옅어짐).

Revealed State:

Animation: transition-all duration-700 ease-in-out.

Style: bg-transparent text-foreground decoration-wavy decoration-highlight-warm.

2.2. The Command Bar (입력 인터페이스)

화면 하단에 고정된 입력창은 '타자기' 혹은 '터미널'의 느낌을 줍니다.

Structure:

<div className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur border-t border-foreground/10 z-40">
  <div className="max-w-3xl mx-auto flex items-center h-16 px-4">
    {/* Input */}
  </div>
</div>


Input Field:

font-mono text-lg tracking-wider.

caret-highlight-hot (커서 색상을 붉은색으로 하여 긴장감 부여).

placeholder:text-foreground/30 (매우 옅게).

Feedback Animation:

Error (Shake): animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both].

Success (Flash): 입력창 배경이 bg-highlight-warm/20으로 0.2초간 번쩍임.

2.3. The Minimap (우측 정보 띠)

PC 화면 우측에 고정되는 시각적 네비게이터입니다.

Style: w-2 h-full fixed right-2 top-0 bg-foreground/5 rounded-full my-4.

Dots:

사용자가 찾은 단어의 위치를 absolute로 매핑.

w-1.5 h-1.5 rounded-full bg-highlight-hot.

클릭 시 해당 위치로 smooth scroll.

3. 🧩 Ad Integration Design (수익화 UX)

광고가 콘텐츠를 방해하지 않으면서도 자연스럽게 시선이 머물도록 설계합니다.

3.1. Sticky Vertical Banner (PC)

Position: 본문 컨테이너(680px)의 양옆 여백(Gutter) 중앙.

Style:

w-[160px] h-[600px] sticky top-24.

Frame: border border-foreground/10 p-1 bg-background (신문 광고란 같은 프레임).

Label: 상단에 text-[10px] font-sans text-foreground/40 uppercase tracking-widest로 "SPONSORED" 명시.

3.2. Adaptive Bottom Banner (Mobile/PC)

Mobile: 입력창(Command Bar) 바로 위에 위치.

w-full h-[50px] bg-gray-100 flex justify-center items-center border-t border-foreground/5.

키보드가 올라올 때 (visualViewport resize 이벤트 감지) 광고 영역도 키보드 위로 밀려 올라가야 함.

4. ✨ Motion & Transitions

4.1. Text Reveal (잉크 번짐 효과)

단어가 공개될 때, 단순히 나타나는 것이 아니라 종이에 잉크가 스며드는 느낌을 줍니다.

Trigger: 정답 매칭 시.

Transition: color 0.5s ease-in, background-color 0.8s ease-out.

Sequence:

배경색(bg-mask)이 서서히 투명해짐.

동시에 글자색(text-transparent)이 text-foreground로 변함.

Optional: 중요한 단어는 scale(1.1) -> scale(1.0)의 미세한 팝업 효과 추가.

4.2. Auto-Scroll Focus

중요 단어(Hot Keyword) 발견 시 해당 위치로 이동하는 애니메이션입니다.

Behavior: window.scrollTo({ top: targetY, behavior: 'smooth' }).

Cubic-bezier: 부드러운 가속/감속을 위해 cubic-bezier(0.65, 0, 0.35, 1) 적용 권장.

5. 📱 Icons (Hugeicons-react)

가늘고 날카로운 Stroke 1.5 스타일을 사용하여 지적인 느낌을 강조합니다.

Search/Investigation: <SearchVisualIcon />, <EyeIcon />

Documents: <File01Icon />, <TextFontIcon />

Analysis: <ChartHistogramIcon /> (통계), <Analytics01Icon />

Navigation: <ArrowRight01Icon /> (제출), <Menu01Icon /> (사이드바)