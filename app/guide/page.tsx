import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "문해력 가이드",
  description:
    "문해력 테스트, 어휘력 테스트, 맞춤법 테스트, 신조어 테스트 — 영역별 이야기를 읽고 오늘의 시험지에 도전해 보세요.",
};

export default function GuideIndex() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-ink-faint text-sm">
          ← 홈으로
        </Link>
        <h1 className="font-cute mt-3 text-3xl font-extrabold text-ink">문해력 가이드</h1>
        <p className="text-ink-soft mt-2 text-[15px] leading-relaxed">
          영역별 이야기를 읽고, 오늘의 시험지로 내 문해력을 점검해 보세요.
        </p>
      </header>

      <div className="space-y-2.5">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="border-cream-deep/60 hover:border-brand/40 flex items-center gap-3 rounded-xl border bg-white/50 px-4 py-4 transition"
          >
            <span className="bg-brand/10 flex size-10 items-center justify-center rounded-lg text-xl">
              {g.emoji}
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-semibold text-ink">{g.keyword}</span>
              <span className="text-ink-faint block text-xs">{g.metaTitle}</span>
            </span>
            <span className="text-ink-faint" aria-hidden>
              ›
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
