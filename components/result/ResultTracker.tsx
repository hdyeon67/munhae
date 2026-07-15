"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** result_view 계측 — 등급·모드만 전송(PII 미포함). 서버 카드와 분리된 클라이언트 이펙트. */
export function ResultTracker({ grade, mode }: { grade: number; mode: "daily" | "practice" }) {
  useEffect(() => {
    track("result_view", { grade, mode });
  }, [grade, mode]);
  return null;
}
