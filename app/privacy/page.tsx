import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "문해력 모의고사는 개인정보를 서버에 저장하지 않습니다.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      <header className="mb-6">
        <Link href="/" className="text-ink-faint text-sm">
          ← 홈으로
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-ink">개인정보처리방침</h1>
      </header>

      <section className="text-ink-soft space-y-5 text-[15px] leading-relaxed">
        <div>
          <h2 className="mb-1.5 font-semibold text-ink">1. 수집하는 정보</h2>
          <p>
            문해력 모의고사는 회원가입이 없으며 별도의 데이터베이스를 두지 않아요. 성적표에 표시할
            닉네임은 <b className="text-ink">선택 입력</b>이며 <b className="text-ink">서버에 저장되지
            않고</b>, 브라우저에서 결과를 구성하는 데에만 쓰여요. 이름·생년월일 등 개인정보는 아예
            입력받지 않아요.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-semibold text-ink">2. 결과 공유 방식</h2>
          <p>
            결과는 응답·시드·닉네임을 인코딩한 URL(<code className="text-sm">?d=</code>)에만 담겨요.
            링크를 받은 사람은 동일한 성적표를 볼 수 있으나, 그 정보가 우리 서버에 남지는 않아요.
            링크를 공유하지 않으면 아무 데도 전달되지 않아요.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-semibold text-ink">3. 광고·분석</h2>
          <p>
            서비스 운영을 위해 광고(Google AdSense·카카오 애드핏) 또는 방문 통계 도구(PostHog·
            Cloudflare Web Analytics)가 도입될 수 있어요. 통계 도구는 쿠키를 쓰지 않는 방식으로
            운영하며, 이벤트에는 닉네임 등 개인을 식별할 수 있는 값을 전송하지 않고 등급·영역 구간
            같은 비식별 정보만 다뤄요.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-semibold text-ink">4. 문의</h2>
          <p>운영: EDEN APPWORKS (fineboll 연구소)</p>
        </div>

        <p className="text-ink-faint pt-2 text-sm">최종 갱신: 2026-07-15</p>
      </section>
    </main>
  );
}
