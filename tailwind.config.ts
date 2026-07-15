import type { Config } from "tailwindcss";

// 문해력 모의고사 디자인 토큰.
// - 서비스 UI(랜딩·응시): 시안 B — 밝은 크림 + 잉크 외곽선(행운부적 결).
// - 결과 성적표 카드: 시안 A — 종이 아이보리 + 먹색 명조 + 붉은 직인.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#fff6e9",
          soft: "#fdeccf",
          deep: "#f6dcae",
        },
        ink: {
          DEFAULT: "#2b2724",
          soft: "#5a534c",
          faint: "#8a8178",
        },
        brand: {
          DEFAULT: "#3f7fdd",
          deep: "#2f66c4",
        },
        // 성적표 카드(시안 A) — 종이 아이보리 · 먹 · 직인 붉은색
        paper: {
          DEFAULT: "#fdfdf8",
          line: "#d8d3c4",
          ink: "#23201c",
        },
        seal: "#c0392b",
        // shadcn 계열 토큰
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        cute: ["Gaegu", "'Nanum Brush Script'", "Pretendard", "cursive"],
        // 성적표 카드용 명조 계열
        serif: ["'Nanum Myeongjo'", "'Batang'", "serif"],
      },
      boxShadow: {
        pop: "5px 5px 0 0 rgba(43,39,36,0.14)",
        popsm: "3px 3px 0 0 rgba(43,39,36,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
