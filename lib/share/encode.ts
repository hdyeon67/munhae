// 결과 공유 인코딩 — ?d= base64url.
// DB 없이 URL 만으로 결과를 재현한다. 개인정보(이름·생일)는 저장하지 않고,
// 재현에 필요한 값(모드·시드·답안)과 성적표 이름 칸에 쓸 닉네임(짧은 표시용)만 담는다.
// btoa/atob + TextEncoder/TextDecoder 로 브라우저·Cloudflare Workers·Node 공용.

export interface ResultPayload {
  /** 'd' = 오늘의 시험지(날짜 시드), 'p' = 랜덤 연습(?s= 정수 시드) */
  mode: "daily" | "practice";
  /** 시험지 시드 (재현 핵심) */
  seed: number;
  /** 오늘의 시험지 날짜 "YYYY-MM-DD" (표기용, daily 만) */
  date?: string;
  /** 문항별 고른 선택지 인덱스(0~3), 미응답은 -1 */
  answers: number[];
  /** 성적표 이름 칸 표시용 닉네임(선택, 짧게) */
  nick?: string;
}

const MAX_ANSWERS = 20;
const MAX_NICK = 12;

/** 문자열 → base64url */
function b64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** base64url → 문자열 */
function b64urlDecode(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** 결과 payload → ?d= 값 */
export function encodeResult(p: ResultPayload): string {
  const compact = {
    v: 1,
    m: p.mode === "daily" ? "d" : "p",
    s: p.seed >>> 0,
    d: p.date,
    a: p.answers.slice(0, MAX_ANSWERS).map((n) => (Number.isInteger(n) ? n : -1)),
    n: p.nick ? p.nick.slice(0, MAX_NICK) : undefined,
  };
  return b64urlEncode(JSON.stringify(compact));
}

/** ?d= 값 → 결과 payload. 형식이 어긋나면 null */
export function decodeResult(d: string): ResultPayload | null {
  try {
    const o = JSON.parse(b64urlDecode(d)) as Record<string, unknown>;
    if (o.v !== 1) return null;
    if (o.m !== "d" && o.m !== "p") return null;
    if (typeof o.s !== "number" || !Number.isFinite(o.s)) return null;
    if (!Array.isArray(o.a) || o.a.length === 0 || o.a.length > MAX_ANSWERS) return null;
    const answers = o.a.map((n) => (typeof n === "number" && Number.isInteger(n) ? n : -1));
    const nick = typeof o.n === "string" ? o.n.slice(0, MAX_NICK) : undefined;
    const date = typeof o.d === "string" ? o.d : undefined;
    return {
      mode: o.m === "d" ? "daily" : "practice",
      seed: o.s >>> 0,
      date,
      answers,
      nick,
    };
  } catch {
    return null;
  }
}
