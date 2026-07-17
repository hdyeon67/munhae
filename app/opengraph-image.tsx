// 홈/기본 공유용 OG 이미지 — 카톡·SNS 링크 미리보기.
//   성적통지표 패러디: 종이 아이보리 + 먹 + 붉은 직인. 캐릭터 없이 타이포+틀+직인.
//   한글은 public 의 Pretendard KS X 1001 서브셋을 빌드타임에 fs 로 로드(두부 방지).
//   서브셋에 없을 수 있는 이모지·특수문자는 쓰지 않는다.
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "문해력 모의고사 — 오늘의 문해력 시험지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = readFileSync(
  join(process.cwd(), "public/fonts/pretendard-kr-subset.ttf"),
);

const PAPER = "#fdfdf8";
const INK = "#23201c";
const INK_SOFT = "#5a534c";
const LINE = "#d8d3c4";
const SEAL = "#c0392b";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: PAPER,
          padding: 48,
          fontFamily: "Pretendard",
        }}
      >
        {/* 성적통지표 테두리 프레임 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            border: `3px solid ${INK}`,
            padding: "56px 64px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 30,
                color: INK_SOFT,
                letterSpacing: 8,
                paddingBottom: 6,
                borderBottom: `2px solid ${LINE}`,
                width: 500,
                whiteSpace: "nowrap",
              }}
            >
              오늘의 문해력 시험지
            </div>
            <div
              style={{
                fontSize: 108,
                fontWeight: 700,
                color: INK,
                marginTop: 26,
                lineHeight: 1.1,
              }}
            >
              문해력 모의고사
            </div>
            <div style={{ fontSize: 36, color: INK_SOFT, marginTop: 24 }}>
              매일 열 문항 · 이 분 컷 · 수능 성적표 패러디
            </div>
          </div>

          {/* 붉은 직인 */}
          <div
            style={{
              position: "absolute",
              right: 56,
              bottom: 52,
              width: 132,
              height: 132,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `6px solid ${SEAL}`,
              borderRadius: 24,
              color: SEAL,
              fontSize: 60,
              fontWeight: 700,
              transform: "rotate(-8deg)",
            }}
          >
            채점
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }],
    },
  );
}
