// 사이트 기본 정보. 배포 도메인은 munhae.fineboll.com.

export const SITE = {
  name: "문해력 모의고사",
  domain: "munhae.fineboll.com",
  description:
    "매일 바뀌는 오늘의 시험지 10문항으로 보는 문해력 테스트. 어휘·맞춤법·독해·신조어를 풀고 수능 성적표 패러디 카드를 받아 친구와 비교하세요. 재미·참고용 콘텐츠입니다.",
} as const;

/** 절대 URL 베이스 (OG/공유용). 환경변수 없으면 배포 도메인 기준. */
export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  return `https://${SITE.domain}`;
}
