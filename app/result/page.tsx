import type { Metadata } from "next";
import Link from "next/link";
import { generatePaper, scorePaper, AREA_LABELS } from "@/lib/munhae-engine";
import { ITEMS } from "@/lib/content/items";
import { buildResultCopy } from "@/lib/content/select";
import { decodeResult } from "@/lib/share/encode";
import { formatKoreanDate } from "@/lib/date";
import { ReportCard } from "@/components/result/ReportCard";
import { WrongAnswers, type ReviewItem } from "@/components/result/WrongAnswers";
import { ResultActions } from "@/components/result/ResultActions";
import { ResultTracker } from "@/components/result/ResultTracker";
import { CrossPromo } from "@/components/CrossPromo";
import { AdBottomMobile } from "@/components/AdRails";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}): Promise<Metadata> {
  const { d } = await searchParams;
  const payload = d ? decodeResult(d) : null;

  // 결과는 개인 응답 기반이라 색인 제외. OG 이미지는 공유 미리보기용.
  const base: Metadata = { title: "성적표", robots: { index: false, follow: true } };
  if (!d || !payload) return base;

  const grade = scorePaper(generatePaper(ITEMS, payload.seed, payload.mode), payload.answers);
  const ogImage = `/api/og?d=${encodeURIComponent(d)}`;
  const title = `문해력 ${grade.grade}등급 · 전국 상위 ${grade.percentile}%`;
  const description = "오늘의 시험지 풀고 내 문해력 등급 확인 · 친구랑 같은 시험지로 비교해요.";

  return {
    ...base,
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 600, height: 315 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const payload = d ? decodeResult(d) : null;

  if (!payload) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="text-lg font-bold text-ink">성적표를 불러올 수 없어요</p>
        <p className="text-ink-soft mt-2 text-sm">링크가 손상되었거나 만료된 형식이에요.</p>
        <Link
          href="/"
          className="bg-brand mt-6 rounded-xl border-2 border-ink px-6 py-3 font-bold text-white shadow-popsm"
        >
          오늘의 시험지 풀러 가기
        </Link>
      </main>
    );
  }

  const paper = generatePaper(ITEMS, payload.seed, payload.mode);
  const grade = scorePaper(paper, payload.answers);
  const copy = buildResultCopy(grade, payload.seed);

  const name = payload.nick?.trim() || "수험생";
  const dateText =
    payload.mode === "daily" && payload.date
      ? `${formatKoreanDate(payload.date)} 시행`
      : "연습 시험지";

  const review: ReviewItem[] = paper.items.map((it, i) => ({
    area: it.area,
    passage: it.passage,
    question: it.question,
    choices: it.choices,
    correctIndex: it.answerIndex,
    userIndex: payload.answers[i] ?? -1,
    explain: it.explain,
  }));

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <ResultTracker grade={grade.grade} mode={payload.mode} />

      <div className="animate-fade-up">
        <ReportCard name={name} dateText={dateText} grade={grade} copy={copy} />
      </div>

      {/* 영역 코멘트 — "어휘는 1등급, 신조어는 9등급" 대비 포인트 */}
      <div className="mt-4 space-y-1.5">
        {copy.areaComments.map((c) => (
          <p key={c.area} className="text-ink-soft text-[13px] leading-relaxed">
            <span className="text-ink font-bold">{AREA_LABELS[c.area]}</span> · {c.text}
          </p>
        ))}
      </div>

      <ResultActions />

      <WrongAnswers items={review} />

      {/* 모바일 하단 광고(320×100) — 단위 ID 있을 때만. 결과 페이지 슬롯 ≤2 */}
      <AdBottomMobile className="mt-8 flex justify-center" />

      {/* 크로스 프로모션 */}
      <div className="mt-8">
        <CrossPromo />
      </div>

      <p className="text-ink-faint/80 mt-8 text-center text-[11px] leading-relaxed">
        재미·참고용 · 공인 시험이 아닙니다 · 백분위는 추정치입니다
        <br />
        개인정보는 저장하지 않으며, 결과는 링크 안에만 담겨요
      </p>
    </main>
  );
}
