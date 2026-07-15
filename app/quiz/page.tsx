import { Suspense } from "react";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export const metadata = {
  title: "응시 중",
};

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-md px-5 py-10 text-center text-ink-faint">불러오는 중…</div>}
    >
      <QuizRunner />
    </Suspense>
  );
}
