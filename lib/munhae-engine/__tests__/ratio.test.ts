import { describe, it, expect } from "vitest";
import { generatePaper, AREA_RATIO, PAPER_SIZE, AREAS } from "../index";
import { FIXTURE_POOL, sampleSeeds } from "./fixtures";

describe("영역 비율 — 항상 어휘3·맞춤법3·독해2·신조어2", () => {
  const seeds = sampleSeeds();

  it("모든 표본에서 문항 10개 · 영역 비율 3-3-2-2 고정", () => {
    for (const seed of seeds) {
      const paper = generatePaper(FIXTURE_POOL, seed, "daily");
      expect(paper.items).toHaveLength(PAPER_SIZE);

      const counts: Record<string, number> = { vocab: 0, spelling: 0, reading: 0, slang: 0 };
      for (const it of paper.items) counts[it.area] += 1;
      for (const area of AREAS) {
        expect(counts[area]).toBe(AREA_RATIO[area]);
      }
    }
  });

  it("한 시험지 안에 중복 문항이 없다", () => {
    for (const seed of seeds) {
      const ids = generatePaper(FIXTURE_POOL, seed, "daily").items.map((it) => it.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
