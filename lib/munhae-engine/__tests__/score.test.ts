import { describe, it, expect } from "vitest";
import {
  generatePaper,
  scorePaper,
  gradeForRatio,
  parodyPercentile,
  GRADE_CURVE,
  PERCENTILE_BAND,
  dateSeed,
} from "../index";
import { FIXTURE_POOL, sampleSeeds } from "./fixtures";

describe("채점·등급", () => {
  const paper = generatePaper(FIXTURE_POOL, dateSeed("2026-07-15"), "daily");
  const allCorrect = paper.items.map((it) => it.answerIndex);
  const allWrong = paper.items.map((it) => (it.answerIndex + 1) % 4);

  it("등급 커브 경계값 — 컷 정확히 만족하면 해당 등급, 살짝 미달이면 다음 등급", () => {
    const eps = 1e-6;
    GRADE_CURVE.forEach(({ grade, minRatio }, i) => {
      expect(gradeForRatio(minRatio)).toBe(grade);
      const next = GRADE_CURVE[i + 1];
      if (next && minRatio > 0) {
        expect(gradeForRatio(minRatio - eps)).toBe(next.grade);
      }
    });
  });

  it("만점 → 1등급, 영점 → 9등급", () => {
    expect(scorePaper(paper, allCorrect).grade).toBe(1);
    expect(scorePaper(paper, allCorrect).raw).toBe(10);
    expect(scorePaper(paper, allWrong).grade).toBe(9);
    expect(scorePaper(paper, allWrong).raw).toBe(0);
  });

  it("영역별 소점수 합 = 원점수, total 합 = 10", () => {
    for (const seed of sampleSeeds()) {
      const p = generatePaper(FIXTURE_POOL, seed, "daily");
      // 절반만 맞히는 임의의 결정적 답안
      const answers = p.items.map((it, i) => (i % 2 === 0 ? it.answerIndex : (it.answerIndex + 1) % 4));
      const g = scorePaper(p, answers);
      const correctSum = g.areaScores.reduce((s, a) => s + a.correct, 0);
      const totalSum = g.areaScores.reduce((s, a) => s + a.total, 0);
      expect(correctSum).toBe(g.raw);
      expect(totalSum).toBe(10);
    }
  });

  it("패러디 백분위 — 결정적이고 등급 밴드 안, 0<p<100", () => {
    for (let grade = 1; grade <= 9; grade++) {
      for (const seed of [1, 42, 12345, dateSeed("2026-11-19")]) {
        const p1 = parodyPercentile(grade, seed);
        const p2 = parodyPercentile(grade, seed);
        expect(p1).toBe(p2); // 결정적
        const [lo, hi] = PERCENTILE_BAND[grade];
        expect(p1).toBeGreaterThanOrEqual(lo);
        expect(p1).toBeLessThanOrEqual(hi);
        expect(p1).toBeGreaterThan(0);
        expect(p1).toBeLessThan(100);
      }
    }
  });

  it("scorePaper 결과가 시드에 대해 결정적", () => {
    const g1 = JSON.stringify(scorePaper(paper, allCorrect));
    const g2 = JSON.stringify(scorePaper(paper, allCorrect));
    expect(g1).toBe(g2);
  });
});
