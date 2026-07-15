// 계측 헬퍼 (analytics-spec.md 준수, app="munhae")
//   메인: PostHog(쿠키리스 memory persistence) · 보조: Cloudflare Web Analytics
//   원칙: 개인정보 미저장 — 이벤트 속성에 닉네임·입력값 절대 포함 금지.
//         등급·영역 구간 등 비식별 값만 허용.
//
// PostHog 스크립트는 키가 있을 때만 로드되므로(Phase 5 AnalyticsProvider),
// 키가 없으면 track() 은 안전한 no-op 이다.

type PostHog = { capture: (event: string, props?: Record<string, unknown>) => void };

declare global {
  interface Window {
    posthog?: PostHog;
  }
}

/** munhae 이벤트 (dev 프롬프트 §계측) */
export type AnalyticsEvent =
  | "landing_view"
  | "quiz_start"
  | "quiz_complete"
  | "result_view"
  | "share_click"
  | "cta_friend_click"
  | "cross_banner_click"
  | "premium_lock_click"
  | "wrong_note_view";

/** 이벤트 전송 (키 없으면 no-op). PII 금지 — 호출부에서 비식별 속성만 전달할 것 */
export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.posthog?.capture(event, { app: "munhae", ...props });
  } catch {
    /* 계측 실패는 조용히 무시 */
  }
}

/** 소요 시간(초) → 구간 문자열 (duration_band) */
export function durationBand(seconds: number): string {
  if (seconds < 60) return "0-60";
  if (seconds < 120) return "60-120";
  if (seconds < 240) return "120-240";
  return "240+";
}

/** document.referrer → 유입 유형 분류 */
export function referrerType(): "sns" | "search" | "cross" | "direct" {
  if (typeof document === "undefined") return "direct";
  const ref = document.referrer;
  if (!ref) return "direct";
  let host = "";
  try {
    host = new URL(ref).hostname;
  } catch {
    return "direct";
  }
  if (/(t\.co|twitter|x\.com|instagram|threads|facebook|kakao|band|tiktok|youtube)/i.test(host))
    return "sns";
  if (/(google|naver|daum|bing|yahoo|duckduckgo)/i.test(host)) return "search";
  if (/fineboll\.com$/i.test(host)) return "cross";
  return "direct";
}
