import { AREA_LABELS, type Area, type Grade } from "@/lib/munhae-engine";
import type { ResultCopy } from "@/lib/content/select";

// 수우미양가 패러디 직인 — 등급을 전통 평어 한자로
const GRADE_SEAL: Record<number, string> = {
  1: "秀",
  2: "優",
  3: "優",
  4: "美",
  5: "美",
  6: "良",
  7: "良",
  8: "可",
  9: "可",
};

export interface ReportCardProps {
  name: string;
  dateText: string;
  grade: Grade;
  copy: ResultCopy;
}

/** 시안 A — 수능 성적통지표 패러디 카드(종이 아이보리 · 먹 명조 · 붉은 직인) */
export function ReportCard({ name, dateText, grade, copy }: ReportCardProps) {
  const seal = GRADE_SEAL[grade.grade] ?? "可";

  return (
    <div className="font-serif text-paper-ink relative mx-auto w-full max-w-md overflow-hidden rounded-md border border-paper-line bg-paper shadow-pop">
      {/* 상단 머리글 */}
      <div className="border-b-2 border-double border-paper-line px-6 pb-3 pt-5 text-center">
        <p className="text-[11px] tracking-[0.3em] text-paper-ink/60">MUNHAE MOCK EXAM</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight">문해력 모의고사 성적통지표</h2>
        <p className="mt-1 text-[11px] text-paper-ink/60">{dateText}</p>
      </div>

      <div className="relative px-6 py-5">
        {/* 붉은 직인 */}
        <div className="animate-stamp-in pointer-events-none absolute right-5 top-3 select-none">
          <div className="flex size-16 items-center justify-center rounded-full border-[3px] border-seal text-seal">
            <span className="text-3xl font-extrabold leading-none">{seal}</span>
          </div>
        </div>

        {/* 성명 */}
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr>
              <th className="w-20 border border-paper-line bg-paper-line/30 px-3 py-2 text-left font-bold">
                성명
              </th>
              <td className="border border-paper-line px-3 py-2">{name}</td>
            </tr>
          </tbody>
        </table>

        {/* 종합 등급 + 패러디 백분위 */}
        <div className="mt-4 flex items-end justify-between border-b border-paper-line pb-4">
          <div>
            <p className="text-[11px] text-paper-ink/60">종합 등급</p>
            <p className="text-5xl font-extrabold leading-none">
              {grade.grade}
              <span className="text-2xl">등급</span>
            </p>
            <p className="mt-1 text-xs text-paper-ink/70">원점수 {grade.raw} / 10</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-paper-ink/60">전국 상위</p>
            <p className="text-3xl font-extrabold leading-none text-seal">
              {grade.percentile}%<span className="align-super text-sm">*</span>
            </p>
          </div>
        </div>

        {/* 영역별 막대 */}
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-bold text-paper-ink/60">영역별 성취</p>
          <div className="space-y-2">
            {grade.areaScores.map((a) => (
              <AreaBar key={a.area} area={a.area} correct={a.correct} total={a.total} />
            ))}
          </div>
        </div>

        {/* 행동발달상황(총평) */}
        <div className="mt-5 border-t border-paper-line pt-3">
          <p className="mb-1 text-[11px] font-bold text-paper-ink/60">행동발달상황</p>
          <p className="text-[13px] leading-relaxed">{copy.summary}</p>
        </div>

        {/* 워터마크·고지 */}
        <div className="mt-5 flex items-center justify-between border-t border-dashed border-paper-line pt-3 text-[10px] text-paper-ink/50">
          <span>munhae.fineboll.com</span>
          <span>*백분위는 재미용 추정치(공식 통계 아님)</span>
        </div>
      </div>
    </div>
  );
}

function AreaBar({ area, correct, total }: { area: Area; correct: number; total: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 shrink-0 font-bold">{AREA_LABELS[area]}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-sm border border-paper-line bg-white">
        <div className="h-full bg-paper-ink/75" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right tabular-nums text-paper-ink/70">
        {correct}/{total}
      </span>
    </div>
  );
}
