// munhae-engine 도메인 타입
// 프레임워크 무의존. 출제/채점 전 과정이 이 타입 위에서 결정적으로 동작한다.

/** 문항 영역 4종 */
export type Area = "vocab" | "spelling" | "reading" | "slang";

/** 영역 순서(성적표·비율 계산의 기준 순서) */
export const AREAS: readonly Area[] = ["vocab", "spelling", "reading", "slang"] as const;

/** 영역 한글 라벨 (UI·성적표용) */
export const AREA_LABELS: Record<Area, string> = {
  vocab: "어휘",
  spelling: "맞춤법",
  reading: "독해",
  slang: "신조어",
};

/** 난이도 1~3 */
export type Difficulty = 1 | 2 | 3;

/** 시험지 생성 모드 — 오늘의 시험지(날짜 시드) vs 랜덤 연습(?s= 정수 시드) */
export type PaperMode = "daily" | "practice";

/**
 * 문항 원본 스키마 (문항 풀 데이터).
 * choices 는 원본 순서, answerIndex 는 그 순서 기준 0-based 정답 위치.
 */
export interface Item {
  id: string;
  area: Area;
  question: string;
  /** 독해 영역의 짧은 지문(선택). 그 외 영역은 없음 */
  passage?: string;
  choices: string[]; // 4지선다
  answerIndex: number; // 0-based
  explain: string; // 해설 1문장
  difficulty: Difficulty;
}

/**
 * 시험지에 실린 문항 — 선택지가 (시험지 시드 + 문항 id)로 결정적 셔플되고
 * answerIndex 가 셔플된 위치로 재매핑된 상태.
 */
export interface ShuffledItem extends Item {
  /** 셔플된 선택지 순서 */
  choices: string[];
  /** 셔플된 choices 기준으로 재매핑된 정답 위치 (0-based) */
  answerIndex: number;
}

/** 생성된 시험지 */
export interface Paper {
  seed: number;
  mode: PaperMode;
  items: ShuffledItem[]; // 10문항, 순서까지 확정
}

/** 영역별 소점수 */
export interface AreaScore {
  area: Area;
  correct: number;
  total: number;
}

/** 채점 결과 */
export interface Grade {
  /** 원점수(맞힌 문항 수, 0~10) */
  raw: number;
  /** 난이도 가중 점수 */
  weighted: number;
  /** 1(최상)~9(최하) 등급 */
  grade: number;
  /** 패러디 백분위 "전국 상위 O.O%" 수치 (재미용 추정치, 실통계 아님) */
  percentile: number;
  /** 영역별 소점수 (AREAS 순서) */
  areaScores: AreaScore[];
}
