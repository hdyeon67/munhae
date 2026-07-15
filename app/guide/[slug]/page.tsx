import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, GUIDE_SLUGS } from "@/lib/content/guides";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(decodeURIComponent(slug));
  if (!guide) return { title: "가이드" };
  return {
    title: guide.metaTitle,
    description: guide.description,
    openGraph: { title: guide.metaTitle, description: guide.description },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = getGuide(decodeURIComponent(slug));
  if (!guide) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <nav className="text-ink-faint mb-5 text-sm">
        <Link href="/guide" className="hover:text-brand">
          가이드
        </Link>
        <span className="mx-1.5">›</span>
        <span>{guide.keyword}</span>
      </nav>

      <header className="mb-6">
        <div className="bg-brand/10 mb-3 inline-flex size-12 items-center justify-center rounded-2xl text-2xl">
          {guide.emoji}
        </div>
        <h1 className="text-[26px] font-extrabold leading-snug text-ink">{guide.title}</h1>
      </header>

      <p className="text-ink-soft mb-7 text-[15px] leading-relaxed">{guide.lead}</p>

      {/* 상단 CTA */}
      <Link
        href="/quiz"
        className="bg-brand hover:bg-brand-deep mb-8 block w-full rounded-xl py-4 text-center text-lg font-bold text-white shadow-popsm transition"
      >
        오늘의 시험지 풀어보기 →
      </Link>

      <article className="space-y-6">
        {guide.sections.map((s) => (
          <section key={s.h}>
            <h2 className="mb-2 text-lg font-bold text-ink">{s.h}</h2>
            <p className="text-ink-soft text-[15px] leading-relaxed">{s.p}</p>
          </section>
        ))}
      </article>

      <section className="mt-9">
        <h2 className="mb-3 text-lg font-bold text-ink">자주 묻는 질문</h2>
        <div className="space-y-3">
          {guide.faq.map((f) => (
            <div key={f.q} className="border-cream-deep/60 bg-cream-soft/50 rounded-2xl border p-4">
              <p className="mb-1.5 text-[15px] font-semibold text-ink">Q. {f.q}</p>
              <p className="text-ink-soft text-sm leading-relaxed">A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <Link
        href="/quiz"
        className="bg-brand hover:bg-brand-deep mt-9 block w-full rounded-xl py-4 text-center text-lg font-bold text-white shadow-popsm transition"
      >
        지금 오늘의 시험지 풀어보기 →
      </Link>

      <p className="text-ink-faint mt-6 text-center text-xs leading-relaxed">
        문해력 모의고사는 재미·참고용 엔터테인먼트예요. 공인 시험이 아니며, 성적표의 백분위는
        추정치입니다.
      </p>
    </main>
  );
}
