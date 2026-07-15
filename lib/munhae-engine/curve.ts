// 튜닝 상수 — 출제 비율·난이도 가중·등급 커브·패러디 백분위 밴드.
// 로직에서 분리해 여기 값만 고치면 난이도/커브를 조정할 수 있다. (bujeok LUCK/DAILY 관례)

import type { Area, Difficulty } from "./types";

/** 오늘의 시험지 영역 구성: 어휘3·맞춤법3·독해2·신조어2 = 10문항 */
export const AREA_RATIO: Record<Area, number> = {
  vocab: 3,
  spelling: 3,
  reading: 2,
  slang: 2,
};

/** 시험지 총 문항 수 (AREA_RATIO 합) */
export const PAPER_SIZE = 10;

/** 난이도 가중치 — 어려운 문항을 맞히면 더 높은 가중 점수 */
export const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  1: 1.0,
  2: 1.3,
  3: 1.6,
};

/**
 * 등급 커브 — (가중 정답 점수 / 가중 만점) 비율에 대한 등급별 하한.
 * 비율이 큰(잘한) 순서대로 1등급부터 매칭한다. 마지막(9등급)은 하한 0.
 * 수능 9등급 느낌의 완만한 곡선.
 */
export const GRADE_CURVE: ReadonlyArray<{ grade: number; minRatio: number }> = [
  { grade: 1, minRatio: 0.95 },
  { grade: 2, minRatio: 0.85 },
  { grade: 3, minRatio: 0.75 },
  { grade: 4, minRatio: 0.62 },
  { grade: 5, minRatio: 0.48 },
  { grade: 6, minRatio: 0.35 },
  { grade: 7, minRatio: 0.22 },
  { grade: 8, minRatio: 0.1 },
  { grade: 9, minRatio: 0.0 },
];

/**
 * 등급별 패러디 백분위("전국 상위 O.O%") 밴드 [상한이 더 좋은 값=작은 수].
 * 실제 수능 누적 비율을 흉내 낸 재미용 밴드 — 실통계 아님.
 * 각 등급 안에서 시드로 결정적으로 한 점을 뽑아 카드에 크게 표기한다.
 */
export const PERCENTILE_BAND: Record<number, readonly [number, number]> = {
  1: [0.5, 4],
  2: [4, 11],
  3: [11, 23],
  4: [23, 40],
  5: [40, 60],
  6: [60, 77],
  7: [77, 89],
  8: [89, 96],
  9: [96, 99.9],
};
