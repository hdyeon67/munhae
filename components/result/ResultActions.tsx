"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { PngSaveButton } from "./PngSaveButton";
import { KakaoShareButton } from "./KakaoShareButton";

/** 결과 페이지 CTA — 공유(링크·PNG·카카오)·연습·친구 초대·프리미엄(잠금).
 *  프리미엄 해금·광고는 Phase 5. */
export function ResultActions() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }

  async function copy(text: string, msg: string) {
    try {
      await navigator.clipboard.writeText(text);
      flash(msg);
    } catch {
      flash("복사에 실패했어요");
    }
  }

  function copyResultLink() {
    track("share_click", { channel: "link" });
    copy(window.location.href, "결과 링크를 복사했어요!");
  }

  function inviteFriend() {
    track("cta_friend_click");
    // 친구는 랜딩(루트)부터 시작 — 소개·날짜 확인 + 닉네임 입력 후 응시
    copy(window.location.origin, "친구에게 보낼 링크를 복사했어요!");
  }

  function playAgain() {
    // 랜덤 연습 시드(앱 계층) — 시드는 URL에 담겨 결정적으로 재현된다
    const seed = Math.floor(Math.random() * 0xffffffff) >>> 0;
    router.push(`/quiz?s=${seed}`);
  }

  function premiumLock() {
    track("premium_lock_click");
    flash("프리미엄 오답노트는 준비 중이에요!");
  }

  return (
    <div className="relative mt-6 space-y-3">
      {/* 공유 — 링크 · 스토리 PNG · 피드 PNG */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={copyResultLink}
          className="rounded-xl border-2 border-ink/12 bg-white py-3 text-sm font-bold text-ink transition active:translate-y-[1px]"
        >
          🔗 링크
        </button>
        <PngSaveButton fmt="story" label="🖼️ 스토리" />
        <PngSaveButton fmt="feed" label="🖼️ 피드" />
      </div>

      {/* 카카오 (키 있을 때만 노출) */}
      <KakaoShareButton
        title="문해력 모의고사 성적표"
        description="내 문해력은 몇 등급? 오늘의 시험지 풀고 등급 비교해요."
      />

      {/* 친구 CTA */}
      <button
        onClick={inviteFriend}
        className="bg-brand hover:bg-brand-deep w-full rounded-xl border-2 border-ink py-4 text-base font-bold text-white shadow-popsm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        👀 친구는 몇 등급? 오늘의 시험지 풀게 하기
      </button>

      {/* 한 번 더 */}
      <button
        onClick={playAgain}
        className="w-full rounded-xl border-2 border-ink/15 bg-white py-3.5 text-sm font-bold text-ink transition active:translate-y-[1px]"
      >
        🎲 한 번 더 풀기 (랜덤 연습 시험지)
      </button>

      {/* 프리미엄(잠금) */}
      <button
        onClick={premiumLock}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/12 bg-white/60 py-3.5 text-sm font-medium text-ink-faint"
      >
        🔒 프리미엄 오답노트 <span className="rounded bg-ink/10 px-1.5 py-0.5 text-[10px]">준비 중</span>
      </button>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit rounded-full bg-ink px-4 py-2 text-sm text-white shadow-pop">
          {toast}
        </div>
      )}
    </div>
  );
}
