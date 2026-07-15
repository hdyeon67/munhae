import { StartCard } from "@/components/landing/StartCard";
import { todayKST, formatKoreanDate } from "@/lib/date";

export default function LandingPage() {
  const dateLabel = formatKoreanDate(todayKST());

  return (
    <main className="mx-auto flex min-h-[85vh] max-w-md flex-col items-center justify-center px-5 py-10">
      <div className="mb-7 text-center">
        <p className="text-brand-deep text-sm font-bold tracking-wide">역문해력 시대의 자가진단</p>
        <h1 className="font-cute mt-2 text-4xl font-bold leading-tight text-ink">
          문해력 모의고사
        </h1>
        <p className="text-ink-soft mt-3 text-[15px] leading-relaxed">
          어휘 · 맞춤법 · 독해 · 신조어 10문항.
          <br />내 문해력은 오늘 몇 등급일까요?
        </p>
      </div>

      <StartCard dateLabel={dateLabel} />

      <ul className="text-ink-faint mt-6 space-y-1 text-center text-xs leading-relaxed">
        <li>· 같은 날엔 모두 같은 시험지 → 친구랑 등급 비교</li>
        <li>· 수능 성적표 패러디 카드로 결과 공유</li>
        <li>· 이름·생일 입력 없이 바로 응시</li>
      </ul>

      <p className="text-ink-faint/80 mt-6 text-center text-[11px]">
        재미·참고용 콘텐츠입니다 · 공인 시험이 아닙니다
      </p>
    </main>
  );
}
