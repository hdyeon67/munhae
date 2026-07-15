// 시험지 생성 — 시드로부터 영역 비율 고정 추출 → 순서 셔플 → 선택지 셔플·정답 재매핑.
// 모든 단계가 결정적: 같은 (pool, seed) 는 항상 같은 Paper.

import { fnv1a, seededSample, seededShuffle } from "./hash";
import { AREA_RATIO } from "./curve";
import { AREAS, type Area, type Item, type Paper, type PaperMode, type ShuffledItem } from "./types";

/**
 * KST 날짜 문자열("YYYY-MM-DD")을 오늘의 시험지 시드로 변환.
 * 날짜는 호출부에서 주입한다(테스트 결정성을 위해 엔진은 new Date() 를 쓰지 않는다).
 */
export function dateSeed(kstDate: string): number {
  return fnv1a(`munhae|daily|${kstDate}`);
}

/** pool 을 영역별로 그룹화 */
function groupByArea(pool: readonly Item[]): Record<Area, Item[]> {
  const groups = { vocab: [], spelling: [], reading: [], slang: [] } as Record<Area, Item[]>;
  for (const item of pool) groups[item.area].push(item);
  return groups;
}

/**
 * 문항의 선택지를 (시험지 시드 + 문항 id)로 결정적 셔플하고 정답 위치를 재매핑.
 * 인덱스 순열을 셔플해 적용하므로 선택지 텍스트가 중복돼도 정답 추적이 정확하다.
 * 같은 날짜(시드)에는 모든 사용자가 같은 선택지 순서를 본다.
 */
function shuffleChoices(item: Item, paperSeed: number): ShuffledItem {
  const choiceSeed = fnv1a(`${paperSeed}|${item.id}`);
  const perm = seededShuffle(
    item.choices.map((_, i) => i),
    choiceSeed,
  );
  const choices = perm.map((origIdx) => item.choices[origIdx]);
  const answerIndex = perm.indexOf(item.answerIndex);
  return { ...item, choices, answerIndex };
}

/**
 * 시험지 생성.
 * 1) 영역별로 AREA_RATIO 만큼 비복원 추출(영역마다 파생 시드가 달라 상관 없음)
 * 2) 뽑힌 문항 순서를 셔플
 * 3) 각 문항의 선택지 셔플 + answerIndex 재매핑
 */
export function generatePaper(pool: readonly Item[], seed: number, mode: PaperMode): Paper {
  const groups = groupByArea(pool);

  // 1) 영역 비율 고정 추출 (AREAS 순서)
  const selected: Item[] = [];
  for (const area of AREAS) {
    const areaSeed = fnv1a(`${seed}|area|${area}`);
    selected.push(...seededSample(groups[area], AREA_RATIO[area], areaSeed));
  }

  // 2) 문항 순서 셔플
  const ordered = seededShuffle(selected, fnv1a(`${seed}|order`));

  // 3) 선택지 셔플 + 정답 재매핑
  const items = ordered.map((item) => shuffleChoices(item, seed));

  return { seed, mode, items };
}
