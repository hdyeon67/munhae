import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개",
  description:
    "문해력 모의고사는 매일 바뀌는 10문항으로 어휘·맞춤법·독해·신조어 문해력을 점검하고 수능 성적표 패러디 카드를 만들어 주는 재미·참고용 서비스입니다.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-ink-faint text-sm">
          ← 홈으로
        </Link>
        <h1 className="font-cute mt-3 text-3xl font-extrabold text-ink">문해력 모의고사 소개</h1>
      </header>

      <section className="text-ink-soft space-y-5 text-[15px] leading-relaxed">
        <p>
          <b className="text-ink">문해력 모의고사</b>는 매일 바뀌는 &lsquo;오늘의 시험지&rsquo;
          10문항을 풀면, 어휘·맞춤법·독해·신조어 네 영역의 문해력을 <b className="text-brand-deep">수능
          9등급 성적표</b> 형태로 보여 주는 테스트예요.
        </p>
        <p>
          같은 날에는 전국 누구나 똑같은 시험지를 풀기 때문에 친구와 등급을 비교하기 좋고, 다음 날엔
          새 시험지가 나와요. 실시간 인공지능 호출 없이 미리 정해진 규칙과 문구로 만들어져 언제나
          빠르게 채점돼요.
        </p>

        <div className="border-cream-deep/60 bg-cream-soft/50 rounded-2xl border p-5">
          <h2 className="mb-2 text-base font-semibold text-ink">재미·참고용 안내</h2>
          <p className="text-sm">
            본 테스트는 <b>재미와 참고를 위한 엔터테인먼트</b>이며 공인 시험이 아니에요. 성적표의
            &lsquo;전국 상위 %&rsquo; 백분위는 재미를 위한 <b>추정치</b>이지 실제 통계가 아니랍니다.
            등급은 실력의 절대 평가가 아니라 그날 시험지에 대한 가벼운 결과로 즐겨 주세요.
          </p>
        </div>

        <div className="border-cream-deep/60 bg-cream-soft/50 rounded-2xl border p-5">
          <h2 className="mb-2 text-base font-semibold text-ink">개인정보 보호</h2>
          <p className="text-sm">
            이름·생년월일 같은 개인정보는 필요 없어요. 닉네임은 성적표 이름 칸에만 쓰이는 선택
            항목이고, 결과는 <b>서버에 저장되지 않고</b> URL(<code className="text-xs">?d=</code>)에만
            담겨 공유돼요. 자세한 내용은{" "}
            <Link href="/privacy" className="text-brand-deep underline underline-offset-2">
              개인정보처리방침
            </Link>
            에서 확인할 수 있어요.
          </p>
        </div>

        <p className="text-ink-faint pt-2 text-center text-sm">
          만든 곳: EDEN APPWORKS · fineboll 연구소
        </p>
      </section>
    </main>
  );
}
