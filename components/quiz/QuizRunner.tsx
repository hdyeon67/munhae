"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generatePaper, dateSeed, AREA_LABELS } from "@/lib/munhae-engine";
import { ITEMS } from "@/lib/content/items";
import { encodeResult } from "@/lib/share/encode";
import { todayKST } from "@/lib/date";
import { track, durationBand } from "@/lib/analytics";

const CHOICE_MARK = ["①", "②", "③", "④"];

export function QuizRunner() {
  const router = useRouter();
  const params = useSearchParams();
  const nick = params.get("n") ?? undefined;

  // 모드·시드 결정 (렌더 간 안정)
  const setup = useMemo(() => {
    const s = params.get("s");
    if (s && /^\d+$/.test(s)) {
      return { mode: "practice" as const, seed: Number(s) >>> 0, date: undefined };
    }
    const date = todayKST();
    return { mode: "daily" as const, seed: dateSeed(date), date };
  }, [params]);

  const paper = useMemo(
    () => generatePaper(ITEMS, setup.seed, setup.mode),
    [setup.seed, setup.mode],
  );

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(paper.items.length).fill(-1));
  const startedAt = useRef<number>(0);

  // 시드·모드가 바뀌면(새 시험지) 진행상태를 처음부터 리셋한다.
  // quiz→quiz 직접 이동 시에도 이전 idx/answers 가 남지 않도록 함. (윤진 QA)
  useEffect(() => {
    setIdx(0);
    setAnswers(Array(paper.items.length).fill(-1));
    startedAt.current = Date.now();
    track("quiz_start", { mode: setup.mode });
  }, [setup.seed, setup.mode, paper.items.length]);

  const item = paper.items[idx];
  const total = paper.items.length;
  const answered = answers.filter((a) => a >= 0).length;
  const progress = Math.round(((idx) / total) * 100);

  function choose(choiceIdx: number) {
    const next = answers.slice();
    next[idx] = choiceIdx;
    setAnswers(next);

    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      finish(next);
    }
  }

  function finish(finalAnswers: number[]) {
    const seconds = startedAt.current ? (Date.now() - startedAt.current) / 1000 : 0;
    track("quiz_complete", { mode: setup.mode, duration_band: durationBand(seconds) });
    const d = encodeResult({
      mode: setup.mode,
      seed: setup.seed,
      date: setup.date,
      answers: finalAnswers,
      nick,
    });
    router.push(`/result?d=${d}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-6">
      {/* 진행 바 */}
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-ink-soft">
        <button
          onClick={() => idx > 0 && setIdx(idx - 1)}
          disabled={idx === 0}
          className="disabled:opacity-30"
          aria-label="이전 문항"
        >
          ← 이전
        </button>
        <span>
          {idx + 1} / {total}
        </span>
        <span className="text-ink-faint">{setup.mode === "daily" ? "오늘의 시험지" : "연습"}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-cream-deep">
        <div
          className="bg-brand h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 문항 */}
      <div key={idx} className="animate-fade-up mt-6 flex-1">
        <span className="bg-cream-soft text-ink-soft inline-block rounded-full px-3 py-1 text-xs font-bold">
          {AREA_LABELS[item.area]}
        </span>

        {item.passage && (
          <blockquote className="border-brand/40 text-ink-soft mt-3 rounded-r-lg border-l-4 bg-white/70 px-4 py-3 text-sm leading-relaxed">
            {item.passage}
          </blockquote>
        )}

        <h2 className="mt-3 text-lg font-bold leading-snug text-ink">{item.question}</h2>

        <div className="mt-5 space-y-3">
          {item.choices.map((c, i) => {
            const selected = answers[idx] === i;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-[15px] transition active:translate-x-[1px] active:translate-y-[1px] ${
                  selected
                    ? "border-brand bg-brand/10 text-ink"
                    : "border-ink/12 hover:border-brand/50 bg-white text-ink"
                }`}
              >
                <span className={selected ? "text-brand font-bold" : "text-ink-faint"}>
                  {CHOICE_MARK[i]}
                </span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-ink-faint mt-6 text-center text-[11px]">
        답을 고르면 다음 문항으로 넘어가요 · 응답 {answered}/{total}
      </p>
    </main>
  );
}
