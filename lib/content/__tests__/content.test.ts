import { describe, it, expect } from "vitest";
import { generatePaper, scorePaper, AREAS, AREA_RATIO, dateSeed, type Area } from "@/lib/munhae-engine";
import { ITEMS } from "../items";
import { GRADE_SUMMARIES, AREA_COMMENTS } from "../copy";
import { bandForAreaScore, selectGradeSummary, selectAreaComment, buildResultCopy } from "../select";

// 결정적 와이드 시드 표본
function seeds(): number[] {
  const out: number[] = [];
  for (let a = 0; a < 40; a++) for (let b = 0; b < 10; b++) out.push(a * 7919 + b * 104729 + 999);
  return out;
}

describe("문항 풀 무결성 (실제 60문항)", () => {
  it("총 60문항, 영역별 15문항", () => {
    expect(ITEMS).toHaveLength(60);
    for (const area of AREAS) {
      expect(ITEMS.filter((it) => it.area === area)).toHaveLength(15);
    }
  });

  it("id 는 고유하다", () => {
    const ids = ITEMS.map((it) => it.id);
    expect(new Set(ids).size).toBe(60);
  });

  it("모든 문항: 선택지 4개 · answerIndex 0~3 범위 · 해설/질문 비어있지 않음", () => {
    for (const it of ITEMS) {
      expect(it.choices).toHaveLength(4);
      expect(it.answerIndex).toBeGreaterThanOrEqual(0);
      expect(it.answerIndex).toBeLessThan(4);
      expect(it.question.trim().length).toBeGreaterThan(0);
      expect(it.explain.trim().length).toBeGreaterThan(0);
      expect([1, 2, 3]).toContain(it.difficulty);
    }
  });

  it("독해 문항은 지문(passage)을 가지고, 그 외 영역은 없다", () => {
    for (const it of ITEMS) {
      if (it.area === "reading") expect((it.passage ?? "").trim().length).toBeGreaterThan(0);
      else expect(it.passage).toBeUndefined();
    }
  });
});

describe("실제 풀로 시험지 생성", () => {
  const ORIG_ANSWER = new Map(ITEMS.map((it) => [it.id, it.choices[it.answerIndex]]));

  it("항상 3-3-2-2, 10문항, 중복 없음", () => {
    for (const seed of seeds()) {
      const paper = generatePaper(ITEMS, seed, "daily");
      expect(paper.items).toHaveLength(10);
      const counts: Record<string, number> = { vocab: 0, spelling: 0, reading: 0, slang: 0 };
      for (const it of paper.items) counts[it.area] += 1;
      for (const area of AREAS) expect(counts[area]).toBe(AREA_RATIO[area]);
      expect(new Set(paper.items.map((it) => it.id)).size).toBe(10);
    }
  });

  it("선택지 셔플 후에도 정답 텍스트가 보존된다", () => {
    for (const seed of seeds()) {
      for (const it of generatePaper(ITEMS, seed, "daily").items) {
        expect(it.choices[it.answerIndex]).toBe(ORIG_ANSWER.get(it.id));
      }
    }
  });
});

describe("결과 문구 풀 카운트·커버리지", () => {
  it("등급 총평: 9등급 각 8변형 = 72개", () => {
    let total = 0;
    for (let g = 1; g <= 9; g++) {
      expect(GRADE_SUMMARIES[g]).toHaveLength(8);
      total += GRADE_SUMMARIES[g].length;
    }
    expect(total).toBe(72);
  });

  it("영역 코멘트: 4영역 × 3구간 각 6변형 = 72개", () => {
    let total = 0;
    for (const area of AREAS) {
      for (const band of ["high", "mid", "low"] as const) {
        expect(AREA_COMMENTS[area][band]).toHaveLength(6);
        total += AREA_COMMENTS[area][band].length;
      }
    }
    expect(total).toBe(72);
  });

  it("모든 문구는 비어있지 않다", () => {
    const all = [
      ...Object.values(GRADE_SUMMARIES).flat(),
      ...AREAS.flatMap((a) => (["high", "mid", "low"] as const).flatMap((b) => AREA_COMMENTS[a][b])),
    ];
    expect(all).toHaveLength(144);
    for (const line of all) expect(line.trim().length).toBeGreaterThan(0);
  });
});

describe("문구 선택 로직", () => {
  it("bandForAreaScore 경계", () => {
    expect(bandForAreaScore(3, 3)).toBe("high");
    expect(bandForAreaScore(2, 3)).toBe("mid"); // 0.67
    expect(bandForAreaScore(1, 3)).toBe("low"); // 0.33
    expect(bandForAreaScore(2, 2)).toBe("high");
    expect(bandForAreaScore(1, 2)).toBe("mid"); // 0.5
    expect(bandForAreaScore(0, 2)).toBe("low");
  });

  it("선택은 결정적이고 항상 해당 풀 안의 값", () => {
    for (const seed of [1, 42, 12345, dateSeed("2026-11-19")]) {
      for (let g = 1; g <= 9; g++) {
        const s = selectGradeSummary(g, seed);
        expect(s).toBe(selectGradeSummary(g, seed));
        expect(GRADE_SUMMARIES[g]).toContain(s);
      }
      for (const area of AREAS as Area[]) {
        const c = selectAreaComment(area, 2, 3, seed);
        expect(c).toBe(selectAreaComment(area, 2, 3, seed));
        expect(AREA_COMMENTS[area].mid).toContain(c);
      }
    }
  });

  it("buildResultCopy: 등급 총평 + 영역 코멘트 4개, band 가 점수와 일치", () => {
    const paper = generatePaper(ITEMS, dateSeed("2026-07-15"), "daily");
    const answers = paper.items.map((it, i) => (i % 2 === 0 ? it.answerIndex : (it.answerIndex + 1) % 4));
    const grade = scorePaper(paper, answers);
    const copy = buildResultCopy(grade, paper.seed);

    expect(GRADE_SUMMARIES[grade.grade]).toContain(copy.summary);
    expect(copy.areaComments).toHaveLength(4);
    copy.areaComments.forEach((c, i) => {
      const a = grade.areaScores[i];
      expect(c.area).toBe(a.area);
      expect(c.band).toBe(bandForAreaScore(a.correct, a.total));
      expect(AREA_COMMENTS[c.area][c.band]).toContain(c.text);
    });
  });
});
