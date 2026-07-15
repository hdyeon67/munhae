"use client";

import { useState } from "react";
import { AREA_LABELS, type Area } from "@/lib/munhae-engine";
import { track } from "@/lib/analytics";

const CHOICE_MARK = ["①", "②", "③", "④"];

export interface ReviewItem {
  area: Area;
  passage?: string;
  question: string;
  choices: string[];
  correctIndex: number;
  userIndex: number; // -1 = 미응답
  explain: string;
}

/** 오답 다시 보기 — 틀린 문항만 해설과 함께 펼쳐 본다 */
export function WrongAnswers({ items }: { items: ReviewItem[] }) {
  const [open, setOpen] = useState(false);
  const wrong = items.filter((it) => it.userIndex !== it.correctIndex);

  function toggle() {
    if (!open) track("wrong_note_view", { count: wrong.length });
    setOpen((v) => !v);
  }

  if (wrong.length === 0) {
    return (
      <p className="mt-6 rounded-xl border-2 border-dashed border-ink/15 bg-white/60 py-4 text-center text-sm text-ink-soft">
        🎉 오답이 하나도 없어요! 완벽한 성적표네요.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-xl border-2 border-ink/12 bg-white px-4 py-3 text-left text-sm font-bold text-ink"
      >
        <span>📝 오답 다시 보기 ({wrong.length})</span>
        <span className="text-ink-faint">{open ? "접기 ▲" : "펼치기 ▼"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          {wrong.map((it, i) => (
            <div key={i} className="sticker p-4">
              <span className="bg-cream-soft text-ink-soft inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                {AREA_LABELS[it.area]}
              </span>
              {it.passage && (
                <blockquote className="border-brand/40 text-ink-soft mt-2 border-l-4 pl-3 text-xs leading-relaxed">
                  {it.passage}
                </blockquote>
              )}
              <p className="mt-2 text-sm font-bold text-ink">{it.question}</p>
              <ul className="mt-2 space-y-1 text-[13px]">
                {it.choices.map((c, ci) => {
                  const isCorrect = ci === it.correctIndex;
                  const isUserWrong = ci === it.userIndex && it.userIndex !== it.correctIndex;
                  return (
                    <li
                      key={ci}
                      className={
                        isCorrect
                          ? "font-bold text-brand-deep"
                          : isUserWrong
                            ? "text-seal line-through"
                            : "text-ink-faint"
                      }
                    >
                      {CHOICE_MARK[ci]} {c}
                      {isCorrect && " ✓"}
                      {isUserWrong && " (내 답)"}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 rounded-lg bg-cream-soft/70 px-3 py-2 text-xs leading-relaxed text-ink-soft">
                💡 {it.explain}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
