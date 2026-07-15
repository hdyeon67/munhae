// 동적 OG 이미지 — 링크/카톡 미리보기 + PNG 저장용 성적표 카드.
//   next/og(satori) 기반, 외부 키·CDN 불필요. bujeok 하드닝 패턴 적용:
//   - 한글 폰트는 ASSETS 의 Pretendard KS X 1001 서브셋(337KB) — 모듈 스코프 1회 로드
//   - 솔리드 배경/카드(그라데이션·섀도 없음)로 메모리 최소화
//   - Cache API 로 d(결과)별 1회만 렌더 후 엣지 캐시
//   ※ 서브셋 폰트엔 이모지 글리프가 없어 이모지는 넣지 않는다(두부 방지).
//   fmt: og(600×315) · feed(640×640, 1:1) · story(640×1138, 9:16)

import { ImageResponse } from "next/og";
import { decodeResult } from "@/lib/share/encode";
import { generatePaper, scorePaper, AREA_LABELS, type Grade } from "@/lib/munhae-engine";
import { ITEMS } from "@/lib/content/items";
import { buildResultCopy } from "@/lib/content/select";

export const runtime = "nodejs";

const FONT_PATH = "/fonts/pretendard-kr-subset.ttf";
const PAPER = "#fdfdf8";
const INK = "#23201c";
const LINE = "#d8d3c4";
const SEAL = "#c0392b";

// 수우미양가 패러디 직인 (한글 — 서브셋 폰트 안전)
const GRADE_SEAL: Record<number, string> = {
  1: "수",
  2: "우",
  3: "우",
  4: "미",
  5: "미",
  6: "양",
  7: "양",
  8: "가",
  9: "가",
};

const SIZES: Record<string, { w: number; h: number }> = {
  og: { w: 600, h: 315 },
  feed: { w: 640, h: 640 },
  story: { w: 640, h: 1138 },
};

let cachedFont: ArrayBuffer | null = null;
async function loadFont(origin: string): Promise<ArrayBuffer | null> {
  if (cachedFont) return cachedFont;
  try {
    const res = await fetch(new URL(FONT_PATH, origin), { cache: "force-cache" });
    if (!res.ok) return null;
    cachedFont = await res.arrayBuffer();
    return cachedFont;
  } catch {
    return null;
  }
}

const OG_HEADERS = {
  "Cache-Control": "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
};

export async function GET(req: Request): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const cacheKey = new Request(new URL(req.url).toString(), { method: "GET" });

  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  const res = await render(req);

  if (cache && res.ok) {
    try {
      await cache.put(cacheKey, res.clone());
    } catch {
      /* 캐시 저장 실패 무시 */
    }
  }
  return res;
}

async function render(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const d = searchParams.get("d");
  const fmt = searchParams.get("fmt") ?? "og";
  const { w, h } = SIZES[fmt] ?? SIZES.og;

  const font = await loadFont(req.url);
  const fonts = font
    ? [
        { name: "Pretendard", data: font, weight: 400 as const, style: "normal" as const },
        { name: "Pretendard", data: font, weight: 700 as const, style: "normal" as const },
      ]
    : undefined;

  const payload = d ? decodeResult(d) : null;

  // 잘못된 결과: 브랜드 카드로 폴백
  if (!payload) {
    return new ImageResponse(<BrandCard />, { width: w, height: h, fonts, headers: OG_HEADERS });
  }

  const paper = generatePaper(ITEMS, payload.seed, payload.mode);
  const grade = scorePaper(paper, payload.answers);
  const copy = buildResultCopy(grade, payload.seed);
  const name = payload.nick?.trim() || "수험생";

  const s = w / 600; // 스케일 팩터

  // 넓은 og(1.9:1)는 세로 여유가 적어 총평을 빼 고지가 잘리지 않게 한다.
  // 정사각(feed)·세로(story)는 총평까지 표시.
  return new ImageResponse(
    <Card name={name} grade={grade} summary={copy.summary} scale={s} showSummary={h >= w} tall={h > w} />,
    { width: w, height: h, fonts, headers: OG_HEADERS },
  );
}

function BrandCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Pretendard",
        fontWeight: 700,
        color: INK,
        background: PAPER,
      }}
    >
      <div style={{ display: "flex", fontSize: 46 }}>문해력 모의고사</div>
      <div style={{ display: "flex", marginTop: 12, fontSize: 22, color: "#8a8178" }}>
        오늘의 시험지 · 내 문해력은 몇 등급?
      </div>
    </div>
  );
}

function Card({
  name,
  grade,
  summary,
  scale,
  showSummary,
  tall,
}: {
  name: string;
  grade: Grade;
  summary: string;
  scale: number;
  showSummary: boolean;
  tall: boolean;
}) {
  const seal = GRADE_SEAL[grade.grade] ?? "가";
  const px = (n: number) => Math.round(n * scale);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        fontFamily: "Pretendard",
        color: INK,
        padding: px(22),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          border: `${px(2)}px solid ${LINE}`,
          borderRadius: px(10),
          padding: px(24),
          position: "relative",
        }}
      >
        {/* 붉은 직인 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: px(16),
            right: px(16),
            width: px(64),
            height: px(64),
            borderRadius: px(64),
            border: `${px(3)}px solid ${SEAL}`,
            color: SEAL,
            fontSize: px(34),
            fontWeight: 700,
          }}
        >
          {seal}
        </div>

        {/* 머리글 */}
        <div style={{ display: "flex", fontSize: px(13), color: "#8a8178", letterSpacing: px(2) }}>
          MUNHAE MOCK EXAM
        </div>
        <div style={{ display: "flex", fontSize: px(26), fontWeight: 700, marginTop: px(2) }}>
          문해력 모의고사 성적통지표
        </div>
        <div style={{ display: "flex", fontSize: px(15), marginTop: px(10) }}>
          성명 · {name}
        </div>

        {/* 등급 + 백분위 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: px(14),
            paddingBottom: px(14),
            borderBottom: `${px(1)}px solid ${LINE}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: px(13), color: "#8a8178" }}>종합 등급</div>
            <div style={{ display: "flex", fontSize: px(58), fontWeight: 700, lineHeight: 1 }}>
              {grade.grade}등급
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", fontSize: px(13), color: "#8a8178" }}>전국 상위</div>
            <div style={{ display: "flex", fontSize: px(34), fontWeight: 700, color: SEAL }}>
              {grade.percentile}%*
            </div>
          </div>
        </div>

        {/* 영역별 막대 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: px(14) }}>
          {grade.areaScores.map((a) => {
            const pct = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
            return (
              <div
                key={a.area}
                style={{ display: "flex", alignItems: "center", marginBottom: px(8) }}
              >
                <div style={{ display: "flex", width: px(56), fontSize: px(14), fontWeight: 700 }}>
                  {AREA_LABELS[a.area]}
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: px(12),
                    background: "#ffffff",
                    border: `${px(1)}px solid ${LINE}`,
                    borderRadius: px(2),
                  }}
                >
                  <div style={{ display: "flex", width: `${pct}%`, height: "100%", background: "#4a453d" }} />
                </div>
                <div style={{ display: "flex", width: px(40), justifyContent: "flex-end", fontSize: px(13), color: "#5a534c" }}>
                  {a.correct}/{a.total}
                </div>
              </div>
            );
          })}
        </div>

        {/* 총평 (feed·story 만) */}
        {showSummary && (
          <div
            style={{
              display: "flex",
              marginTop: px(tall ? 20 : 12),
              paddingTop: px(12),
              borderTop: `${px(1)}px solid ${LINE}`,
              fontSize: px(15),
              lineHeight: 1.4,
            }}
          >
            {summary}
          </div>
        )}

        {/* 워터마크 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: px(16),
            fontSize: px(11),
            color: "#8a8178",
          }}
        >
          <div style={{ display: "flex" }}>munhae.fineboll.com</div>
          <div style={{ display: "flex" }}>*백분위는 재미용 추정치</div>
        </div>
      </div>
    </div>
  );
}
