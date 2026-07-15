// 채점·등급 — 원점수 + 난이도 가중 → 등급 커브 → 1~9등급, 영역별 소점수, 패러디 백분위.
// 전부 결정적: 같은 (paper, answers) 는 항상 같은 Grade.

import { fnv1a, mulberry32 } from "./hash";
import { DIFFICULTY_WEIGHT, GRADE_CURVE, PERCENTILE_BAND } from "./curve";
import { AREAS, type AreaScore, type Grade, type Paper } from "./types";

/** 가중 정답 비율(0~1)을 등급 커브로 1~9등급 변환 */
export function gradeForRatio(ratio: number): number {
  const r = Math.max(0, Math.min(1, ratio));
  for (const { grade, minRatio } of GRADE_CURVE) {
    if (r >= minRatio) return grade;
  }
  // GRADE_CURVE 마지막 항목의 minRatio 가 0 이므로 여기 도달하지 않음(방어적 반환)
  return GRADE_CURVE[GRADE_CURVE.length - 1].grade;
}

/**
 * 패러디 백분위("전국 상위 O.O%") — 등급 밴드 안에서 시드로 결정적으로 한 점을 뽑는다.
 * 재미용 추정치이며 실제 통계가 아니다(카드에 각주 필수, 이는 UI Phase 몫).
 */
export function parodyPercentile(grade: number, seed: number): number {
  const band = PERCENTILE_BAND[grade] ?? PERCENTILE_BAND[9];
  const [lo, hi] = band;
  const r = mulberry32(fnv1a(`${seed}|pct|${grade}`));
  const value = lo + r * (hi - lo);
  return Math.round(value * 10) / 10; // 소수점 1자리
}

/**
 * 시험지 채점.
 * @param answers 각 문항에 고른 선택지 인덱스(미응답은 -1 또는 범위 밖 값)
 */
export function scorePaper(paper: Paper, answers: readonly number[]): Grade {
  let raw = 0;
  let weightedCorrect = 0;
  let weightedTotal = 0;

  const areaAcc: Record<string, { correct: number; total: number }> = {};
  for (const area of AREAS) areaAcc[area] = { correct: 0, total: 0 };

  paper.items.forEach((item, i) => {
    const w = DIFFICULTY_WEIGHT[item.difficulty];
    weightedTotal += w;
    areaAcc[item.area].total += 1;

    const correct = answers[i] === item.answerIndex;
    if (correct) {
      raw += 1;
      weightedCorrect += w;
      areaAcc[item.area].correct += 1;
    }
  });

  const ratio = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;
  const grade = gradeForRatio(ratio);
  const percentile = parodyPercentile(grade, paper.seed);

  const areaScores: AreaScore[] = AREAS.map((area) => ({
    area,
    correct: areaAcc[area].correct,
    total: areaAcc[area].total,
  }));

  return {
    raw,
    weighted: Math.round(weightedCorrect * 100) / 100,
    grade,
    percentile,
    areaScores,
  };
}
