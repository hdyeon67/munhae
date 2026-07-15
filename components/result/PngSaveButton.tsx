"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/** 성적표 PNG 저장 — /api/og 이미지를 받아 다운로드. fmt: story(9:16) | feed(1:1) */
export function PngSaveButton({ fmt, label }: { fmt: "story" | "feed"; label: string }) {
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      const d = new URLSearchParams(window.location.search).get("d") ?? "";
      const res = await fetch(`/api/og?d=${encodeURIComponent(d)}&fmt=${fmt}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `문해력-성적표-${fmt}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      track("share_click", { channel: "png" });
    } catch {
      /* 저장 실패는 조용히 무시 */
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={save}
      disabled={busy}
      className="rounded-xl border-2 border-ink/12 bg-white py-3 text-sm font-bold text-ink transition active:translate-y-[1px] disabled:opacity-60"
    >
      {busy ? "저장 중…" : label}
    </button>
  );
}
