import { describe, it, expect } from "vitest";
import { encodeResult, decodeResult, type ResultPayload } from "../encode";

describe("결과 공유 인코딩 (?d=)", () => {
  const sample: ResultPayload = {
    mode: "daily",
    seed: 3123456789, // 32bit 범위 상단
    date: "2026-07-15",
    answers: [0, 1, 2, 3, 1, 1, 0, 2, 3, -1],
    nick: "수험생",
  };

  it("왕복(encode→decode)이 값을 보존한다", () => {
    const decoded = decodeResult(encodeResult(sample));
    expect(decoded).toEqual(sample);
  });

  it("한글 닉네임도 안전하게 왕복된다", () => {
    const d = decodeResult(encodeResult({ ...sample, nick: "은채짱" }));
    expect(d?.nick).toBe("은채짱");
  });

  it("연습 모드도 왕복된다", () => {
    const p: ResultPayload = { mode: "practice", seed: 42, answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] };
    const d = decodeResult(encodeResult(p));
    expect(d?.mode).toBe("practice");
    expect(d?.seed).toBe(42);
    expect(d?.date).toBeUndefined();
  });

  it("URL-safe 문자만 포함한다(+/= 없음)", () => {
    const enc = encodeResult(sample);
    expect(enc).not.toMatch(/[+/=]/);
  });

  it("깨진 입력은 null 을 반환한다", () => {
    expect(decodeResult("!!!not-base64!!!")).toBeNull();
    expect(decodeResult("")).toBeNull();
    expect(decodeResult(encodeResult({ ...sample, answers: [] }))).toBeNull();
  });

  it("닉네임/답안 길이를 제한한다", () => {
    const d = decodeResult(
      encodeResult({ ...sample, nick: "1234567890123456789", answers: sample.answers }),
    );
    expect((d?.nick ?? "").length).toBeLessThanOrEqual(12);
  });
});
