// 결과 문구 선택 로직 — 시드 기반 결정적 선택. 같은 (grade/area 점수, seed) → 항상 같은 문구.

import { deriveIndex, type Area, type AreaScore, type Grade } from "@/lib/munhae-engine";
import { AREA_COMMENTS, GRADE_SUMMARIES, type Band } from "./copy";

/** 영역 정답 비율 → 구간(상/중/하) */
export function bandForAreaScore(correct: number, total: number): Band {
  if (total <= 0) return "low";
  const ratio = correct / total;
  if (ratio >= 0.75) return "high";
  if (ratio >= 0.4) return "mid";
  return "low";
}

/** 등급 총평 선택 (grade 1~9) */
export function selectGradeSummary(grade: number, seed: number): string {
  const pool = GRADE_SUMMARIES[grade] ?? GRADE_SUMMARIES[9];
  return pool[deriveIndex(seed, "grade-summary", pool.length)];
}

/** 특정 영역 코멘트 선택 */
export function selectAreaComment(area: Area, correct: number, total: number, seed: number): string {
  const band = bandForAreaScore(correct, total);
  const pool = AREA_COMMENTS[area][band];
  return pool[deriveIndex(seed, `area-${area}-${band}`, pool.length)];
}

/** 성적표 코멘트 한 벌 — 등급 총평 + 영역별 코멘트(AREAS 순서) */
export interface ResultCopy {
  summary: string;
  areaComments: { area: Area; band: Band; text: string }[];
}

export function buildResultCopy(grade: Grade, seed: number): ResultCopy {
  return {
    summary: selectGradeSummary(grade.grade, seed),
    areaComments: grade.areaScores.map((a: AreaScore) => ({
      area: a.area,
      band: bandForAreaScore(a.correct, a.total),
      text: selectAreaComment(a.area, a.correct, a.total, seed),
    })),
  };
}
