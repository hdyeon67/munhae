"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track, referrerType } from "@/lib/analytics";

/** 랜딩의 닉네임 입력 + 응시 시작 버튼 (시안 B 스티커 카드) */
export function StartCard({ dateLabel }: { dateLabel: string }) {
  const router = useRouter();
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track("landing_view", { referrer_type: referrerType() });
  }, []);

  function start() {
    setLoading(true);
    const q = nick.trim() ? `?n=${encodeURIComponent(nick.trim().slice(0, 12))}` : "";
    router.push(`/quiz${q}`);
  }

  return (
    <div className="sticker animate-fade-up mx-auto w-full max-w-md p-6 text-center">
      <p className="text-ink-soft text-sm font-medium">
        📅 {dateLabel} · 오늘의 시험지
      </p>
      <p className="text-ink-faint mt-1 text-xs">
        10문항 · 약 2분 · 오늘은 전국이 같은 문제!
      </p>

      <label className="mt-5 block text-left">
        <span className="text-ink-soft text-xs font-medium">
          닉네임 <span className="text-ink-faint">(선택 · 성적표 이름 칸에만 사용)</span>
        </span>
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          maxLength={12}
          placeholder="수험생"
          className="border-ink/15 focus:border-brand mt-1 w-full rounded-xl border-2 bg-white px-4 py-3 text-base outline-none transition"
        />
      </label>

      <button
        onClick={start}
        disabled={loading}
        className="bg-brand hover:bg-brand-deep mt-5 w-full rounded-xl border-2 border-ink px-6 py-4 text-lg font-bold text-white shadow-popsm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
      >
        {loading ? "시험지 펼치는 중…" : "오늘의 시험지 응시하기 ✏️"}
      </button>
    </div>
  );
}
