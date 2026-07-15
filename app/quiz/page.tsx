import { Suspense } from "react";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export const metadata = {
  title: "응시 중",
};

// 오늘의 시험지 시드가 날짜(KST)에 의존하므로 정적 프리렌더 금지 — SSR/클라 날짜 불일치 방지.
export const dynamic = "force-dynamic";

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-md px-5 py-10 text-center text-ink-faint">불러오는 중…</div>}
    >
      <QuizRunner />
    </Suspense>
  );
}
