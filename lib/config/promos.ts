// 크로스 프로모션 대상 앱 목록 (config 배열).
// 앱이 늘면 항목만 추가하면 결과 페이지 하단 배너가 자동 노출된다.
// href 는 안정 커스텀 도메인(fineboll.com 서브도메인) — 호스팅 컷오버와 무관하게 유지.

export interface PromoApp {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  /** 배너 배경 힌트 컬러 */
  color: string;
}

export const PROMOS: PromoApp[] = [
  {
    // 같은 퀴즈 사용자 순환 — 문해력 다음 "언어 나이"도 재보게 (크로스프로모 스펙 v2: munhae 평시 → 신조어)
    id: "shinjo",
    emoji: "🗣️",
    title: "내 언어 나이는?",
    desc: "신조어로 재보는 언어 나이 테스트",
    href: "https://shinjo.fineboll.com",
    color: "#a24bff",
  },
  {
    // 수능 성적표 패러디 결의 온테마 — 시험 운(수능 부적)로 연결 (스펙 v2: munhae 수능시즌 → 행운부적)
    id: "bujeok",
    emoji: "🧧",
    title: "시험 운도 챙긴다면?",
    desc: "수능 대박 소원 담은 귀여운 행운부적",
    href: "https://bujeok.fineboll.com",
    color: "#ff5b3a",
  },
];
