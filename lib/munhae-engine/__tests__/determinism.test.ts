import { describe, it, expect } from "vitest";
import { generatePaper, dateSeed } from "../index";
import { FIXTURE_POOL, sampleSeeds } from "./fixtures";

describe("결정성 — 같은 시드는 항상 같은 시험지", () => {
  it("generatePaper 1000회 반복 완전 동일 (daily)", () => {
    const seed = dateSeed("2026-07-15");
    const first = JSON.stringify(generatePaper(FIXTURE_POOL, seed, "daily"));
    for (let i = 0; i < 1000; i++) {
      expect(JSON.stringify(generatePaper(FIXTURE_POOL, seed, "daily"))).toBe(first);
    }
  });

  it("랜덤 연습 모드(?s=) 시드 재현성 — 같은 정수 시드 → 같은 문항·순서·선택지", () => {
    const seed = 987654;
    const a = generatePaper(FIXTURE_POOL, seed, "practice");
    const b = generatePaper(FIXTURE_POOL, seed, "practice");
    expect(a.items.map((it) => it.id)).toEqual(b.items.map((it) => it.id));
    a.items.forEach((it, i) => {
      expect(it.choices).toEqual(b.items[i].choices);
      expect(it.answerIndex).toBe(b.items[i].answerIndex);
    });
  });

  it("dateSeed 는 날짜별로 안정적이면서 서로 다르다", () => {
    expect(dateSeed("2026-07-15")).toBe(dateSeed("2026-07-15"));
    expect(dateSeed("2026-07-15")).not.toBe(dateSeed("2026-07-16"));
  });

  it("다른 시드는 다른 시험지를 만든다 (상수가 아님)", () => {
    const papers = new Set(sampleSeeds().map((s) => JSON.stringify(generatePaper(FIXTURE_POOL, s, "practice"))));
    expect(papers.size).toBeGreaterThan(50);
  });
});
