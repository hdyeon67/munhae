// KST(Asia/Seoul) 날짜 유틸. 엔진은 날짜를 인자로 받으므로, 앱 계층에서 오늘 날짜를 구한다.

/** 오늘의 KST 날짜를 "YYYY-MM-DD" 로 반환 */
export function todayKST(now: Date = new Date()): string {
  // en-CA 로케일은 YYYY-MM-DD 형식을 준다
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "2026-07-15" → "7월 15일" 표기 */
export function formatKoreanDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
}
