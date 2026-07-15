// Phase 1 테스트용 합성 픽스처 풀.
// 실제 60문항(docs/munhae-items-draft.md)은 Phase 2에서 변환해 교체한다.
// 정답 위치를 일부러 편향(대부분 ②=index 1)시켜, 선택지 셔플이 쏠림을 무력화하는지 검증한다.

import { AREAS, type Area, type Difficulty, type Item } from "../types";

const PER_AREA = 8; // 영역별 8문항 = 총 32문항 (오늘의 시험지 3-3-2-2 추출에 충분)

function makeItem(area: Area, n: number): Item {
  const id = `${area}-${String(n).padStart(2, "0")}`;
  // 편향: 대부분 정답을 index 1 로, 일부만 다른 위치로 → 원본 데이터 쏠림 재현
  const answerIndex = n % 4 === 0 ? 3 : 1;
  const difficulty = ((n % 3) + 1) as Difficulty;
  return {
    id,
    area,
    question: `${id} 질문`,
    choices: [`${id}-c0`, `${id}-c1`, `${id}-c2`, `${id}-c3`],
    answerIndex,
    explain: `${id} 해설`,
    difficulty,
  };
}

/** 32문항 합성 풀 */
export const FIXTURE_POOL: Item[] = AREAS.flatMap((area) =>
  Array.from({ length: PER_AREA }, (_, i) => makeItem(area, i + 1)),
);

/** 결정적 와이드 시드 표본 (플래키 방지 — Math.random 미사용) */
export function sampleSeeds(): number[] {
  const seeds: number[] = [];
  for (let a = 0; a < 40; a++) {
    for (let b = 0; b < 10; b++) {
      seeds.push(a * 7919 + b * 104729 + 12345);
    }
  }
  return seeds;
}
