# 문해력 모의고사 (munhae)

매일 바뀌는 "오늘의 시험지" 10문항으로 어휘·맞춤법·독해·신조어 문해력을 점검하고,
수능 9등급 성적표를 패러디한 카드를 받아 공유하는 테스트 서비스.

- 배포: https://munhae.fineboll.com (Cloudflare Workers · OpenNext)
- 스택: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- 원칙: DB 없음 · 실시간 AI 호출 없음 · 모든 출제/채점은 결정적 로직 · 개인정보 미저장
  (결과는 URL `?d=` base64url 안에만 담김)

## 구조

```
lib/munhae-engine/   결정적 출제·채점 엔진 (프레임워크 무의존)
  hash.ts            fnv1a·mulberry32·seededShuffle·seededSample·deriveIndex
  paper.ts           generatePaper(3-3-2-2 추출·순서/선택지 셔플·정답 재매핑)·dateSeed
  score.ts           scorePaper(등급 커브)·parodyPercentile
  curve.ts           AREA_RATIO·GRADE_CURVE·PERCENTILE_BAND·DIFFICULTY_WEIGHT (튜닝 상수)
lib/content/         items.ts(60문항)·copy.ts(문구 144)·select.ts·guides.ts(SEO 4종)
lib/share/encode.ts  결과 URL 인코딩(?d=)
lib/config/          flags.ts(env)·promos.ts(크로스배너)·site.ts
lib/analytics/       track() (PostHog 쿠키리스, 키 없으면 no-op)
app/                 / 랜딩 · /quiz 응시 · /result 성적표 · /guide · /about · /privacy
                     /api/og 동적 OG·PNG(satori) · sitemap.ts · robots.ts
```

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest (엔진·인코딩 단위 테스트)
```

## 기능 플래그 (전부 env, 미설정 시 비활성)

`.env.example` 참고. 결제·광고·카카오·계측은 키가 있을 때만 켜진다.

- `PAYMENT_ENABLED` — 프리미엄 오답노트 해금(사업자등록 후)
- `NEXT_PUBLIC_ADS_ENABLED` + `NEXT_PUBLIC_ADSENSE_CLIENT` — 애드센스
- `NEXT_PUBLIC_ADFIT_UNIT_*` — 카카오 애드핏(PC 좌우 160×600, 모바일 320×100)
- `NEXT_PUBLIC_KAKAO_JS_KEY` — 카카오톡 공유 버튼
- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_CF_BEACON_TOKEN` — 계측

## 배포 (Cloudflare Workers · OpenNext)

레시피: `goodday/docs/cloudflare-migration.md`. 커스텀 도메인은 `wrangler.jsonc` 의
`routes`(munhae.fineboll.com).

```bash
npm run cf:build     # OpenNext 빌드 (.open-next 생성)
npm run cf:deploy    # Cloudflare 업로드
```

> ⚠️ **배포 함정 (bujeok에서 확인):** `cf:deploy` 는 재빌드하지 않는다.
> 코드 변경 후에는 반드시 **`npm run cf:build && npm run cf:deploy`** 순서로 실행할 것.
> (populate-cache 문제로 빌드 없이 deploy 하면 이전 산출물이 올라감)

미리보기: `npm run cf:preview`.

## 결정성·테스트

- 같은 시드(날짜 또는 `?s=`) → 항상 같은 10문항·같은 순서·같은 선택지 배치
- 선택지는 (시드+문항id)로 셔플 후 answerIndex 재매핑 → 원본 정답 위치 쏠림 무력화
- `npm test`: 결정성(1000회 동일)·영역비율 3-3-2-2·선택지 정답 분포·등급 경계값·
  인코딩 왕복 검증

## 크로스 프로모션

결과 페이지 하단 배너는 `lib/config/promos.ts` 배열로 관리. 현재: saju·케미체크·좋은날·행운부적.

> 📌 **행운부적(bujeok) 쪽에도 이 앱 추가 필요:**
> `bujeok/lib/config/promos.ts` 의 `PROMOS` 에 munhae 항목
> (`{ id:"munhae", title:"내 문해력은 몇 등급?", href:"https://munhae.fineboll.com", ... }`)
> 을 추가하면 행운부적 결과 페이지에서도 이 앱이 교차 노출된다.

## 계측 (analytics-spec.md, app="munhae")

`landing_view · quiz_start · quiz_complete(duration_band) · result_view(grade) ·
share_click(channel) · cta_friend_click · cross_banner_click · premium_lock_click ·
wrong_note_view`. PII(닉네임 등) 미전송 — 등급·구간만.

## 출시 전 남은 확인 (콘텐츠)

- 어휘 A05·A11·A14 표준국어대사전(stdict) 재대조
- 신조어 D10(럭키비키)·D15(테토남) 최신성 재확인
- 키 해금: 카카오 JS 키 · 애드센스(루트 fineboll.com 승인) · PostHog
