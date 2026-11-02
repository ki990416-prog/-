# 기억의 길 · 제주

> 제주의 아픈 역사 현장을 존중하는 마음으로 찾아가는, 공공데이터 기반 AI 해설 가이드

제주대 청년도약 부트캠프 1기 BOOT UP · 2일 개별 과제 (제주 IP × 공공데이터 × AI 에이전트)

- **배포 주소**: https://shine-0821.vercel.app
- **GitHub**: https://github.com/ki990416-prog/-

---

## 1. 기획 의도

**제주 다크 투어리즘** — 4·3, 일제강점기 군사시설, 유배의 역사처럼 *아픈 기억이 남은 장소*를 여행하는 사람을 위한 서비스입니다.

- **누구를 위해**: 4·3 유적지나 알뜨르비행장 같은 곳을 처음 찾는 여행객과 학생
- **어떤 가치**: 장소만 나열하지 않고, ① 지금 가도 되는지(날씨), ② 그곳이 어떤 기록과 이어지는지(옛 문헌), ③ 어떻게 방문해야 하는지(추모 공간에 대한 안내)를 함께 알려 줍니다.
- **지키려는 원칙**: 아픈 역사를 다루는 만큼 *자료에 없는 사실, 날짜, 통계(특히 희생자 수)는 지어내지 않고*, 선정적이거나 가벼운 표현을 쓰지 않습니다.

### 기억의 노래 (직접 만든 IP)
홈 화면에는 4·3을 주제로 직접 만든 노래 「네 글자로」를 넣었습니다. (장르 레게, 작사 가드너, 「No Woman, No Cry」에서 영감, **AI 작곡 툴을 활용해 제작**)

---

## 2. 화면 구성

| 메뉴 | 내용 | 데이터 |
|---|---|---|
| **홈** | 기획 의도, 기억의 노래(영상), 서비스 동작 체크, 날씨 배지 | 기상청 |
| **기억의 장소** | `4·3`, `알뜨르`, `진지동굴`, `유배`, `항일`, `평화` 추천 검색어로 장소 검색, 사진, 날씨 기반 방문 안내 | 한국관광공사 + 기상청 |
| **역사 자료** | 옛 기록·문헌을 **책장**으로 보여 주고, 책을 꺼내 누르면 펼쳐짐 | 제주특별자치도 역사자료 |
| **AI 해설사** | 질문하면 AI가 도구를 골라 호출하고, 호출한 도구 목록과 함께 답함 | 위 API 3개를 도구로 사용 |
| **내 기록** | 저장한 장소·자료 목록 (닉네임으로 구분) | Supabase |

---

## 3. 사용한 공공데이터 API (3개)

| # | API | 제공 기관 | 우리 서비스에서 | 키 |
|---|---|---|---|---|
| ① | 국문 관광정보 서비스 (TourAPI, `KorService2`) | 한국관광공사 | 4·3 유적, 기념관, 일제 진지동굴 등 **장소·사진** 검색 | 필요 |
| ② | 단기예보 조회서비스 (`VilageFcstInfoService_2.0`) | 기상청 | 제주시·서귀포시 **앞으로 6시간 예보**, 방문 안내 | 필요 |
| ③ | 역사자료 정보 (`JejuHistoricalRecordService`) | 제주특별자치도 | 탐라순력도, 조선왕조실록, 유배 기록 등 **옛 문헌 소개** | 불필요 |

### 직접 확인한 사실과 겪은 문제
- **① TourAPI — `areaCode=39`로는 0건이었습니다.** 지역 코드를 `lDongRegnCd=50`(제주 법정동 코드)으로 바꾸자 결과가 나왔습니다. `4·3` 검색에서 제주4·3평화공원, 주정공장수용소 4·3역사관, 북촌마을 4·3길, 신촌 4·3 성터가 조회됩니다. 반대로 곤을동, 무등이왓 같은 일부 유적은 검색되지 않아, 추천 검색어는 *실제로 결과가 나오는 것만* 넣었습니다.
- **② 기상청 — 첫 예보가 이미 지난 시각이었습니다.** 발표 시각 이후 예보가 와서(예: 11시인데 09시 예보), *지금 시각 이후의 예보만* 쓰도록 서버에서 걸렀습니다.
- **③ 역사자료 — API가 준 링크와 이미지가 모두 죽어 있었습니다.** 열람 주소(`commucity/…html`)는 `jeju.go.kr`에서 404 본문이 나오고, 표지 이미지 경로는 후보 7곳이 실제·가짜 파일을 구분하지 못했습니다. 그래서 깨진 링크 대신 **앱 안에서 소개 글을 보여 주고 검색 링크로 이어지게** 했습니다. 또한 이 API는 조선시대 중심 문헌이라 **4·3 자료는 들어 있지 않으며**, 화면과 에이전트 모두 이를 솔직하게 알립니다. (전체 26건 중 `test` 더미 1건 제외, 25건)

---

## 4. AI 에이전트 — 「기억의 길」 해설사

LLM(`claude-sonnet-5-5`)이 질문을 보고 **필요한 API 도구를 스스로 골라 호출**하고, 그 결과로만 답합니다. 화면에는 호출한 도구 목록이 배지로 표시됩니다.

| 도구 | 하는 일 | 연결된 API |
|---|---|---|
| `search_places` | 4·3·알뜨르·유배 등 장소 검색 | ① 한국관광공사 |
| `get_weather` | 제주시/서귀포시 날씨 조회 | ② 기상청 |
| `search_history` | 옛 기록·유배 문헌 검색 | ③ 제주 역사자료 |

**시스템 지시문의 핵심**: 도구 결과에 없는 장소·날짜·숫자는 지어내지 않기 / 도구에 없는 사실은 "자료에 없다"고 말하고 공식 기념시설에서 확인하도록 안내 / 4·3 옛 기록은 도구에 없다고 솔직히 말하기 / 존중하는 말투와 방문 에티켓 / 비가 오면 실내 전시관 제안 / 5문장 이내.

**안전·비용 장치**: 루프 최대 5회, `max_tokens` 1024, 대화 기록 최근 10개(user로 시작하도록 정리), 질문 500자 제한, 도구 결과에서 이미지·좌표 제거.

### 테스트 결과 (체크포인트 6)

| # | 질문 | 기대 | 결과 |
|---|---|---|---|
| 1 | 제주시 지금 날씨 어때? | `get_weather` 1회 | ⏳ 실제 Claude 키로 아직 미실시 |
| 2 | 알뜨르비행장은 어떤 곳이야? | `search_places` 호출, 결과 기반 답 | ⏳ 미실시 |
| 3 | 서귀포에 비 오면 4·3 관련해서 실내에서 볼 수 있는 곳 추천해줘 | 도구 2개 이상 연속 호출 | ⏳ 미실시 |
| 4 | 제주에 있는 에펠탑 알려줘 | 지어내지 않고 "없음" | ⏳ 미실시 |

> 가짜 Claude 응답으로 **에이전트 루프 자체**는 검증했습니다(도구 연속 호출, 5회 상한, 알 수 없는 도구·오류 처리, 기록 정리, 키 없음 안내 — 12개 항목 통과). 실제 모델의 도구 선택과 "지어내지 않음"은 Claude 키 수령 후 위 표에 캡처와 함께 기록합니다.

---

## 5. 구조

```
api/        Vercel 서버 함수 (/api/파일이름) — 비밀 키는 여기서만 사용
  agent.js  에이전트 (도구 3개 + 루프)      tour.js / weather.js / history.js  API 프록시
server/     공공데이터 호출 함수 (화면용 api/ 와 에이전트가 함께 사용)
  tour.js   weather.js   history.js   heritage.js(국가유산청, 4번째 API 후보)
src/
  main.jsx            테마(Bootswatch darkly) + 라우터 시작
  router.jsx          메뉴(NAV_ITEMS) + 주소별 페이지
  layouts/            공통 틀(메뉴·푸터·알림)
  store/              Zustand 전역 상태 (닉네임·알림·즐겨찾기·에이전트 대화)
  lib/supabase.js     Supabase 연결
  api/client.js       화면 → /api 호출
  pages/              Home · Places · History · Agent · My · NotFound
  components/         ItemCard · BookShelf · OpenBook · WeatherNote · YouTubeEmbed …
```

**기술**: Vite + React 19 + React Router + Zustand + Bootstrap 5(Bootswatch `darkly`) + Supabase + Vercel 서버 함수 + Anthropic SDK

**왜 `/api` 서버 함수를 거치나**: ① 공공데이터·Claude 키를 브라우저에 노출하지 않기 위해, ② 브라우저 직접 호출 시 생기는 CORS 문제를 피하기 위해, ③ 같은 API 함수를 화면과 에이전트 도구가 함께 쓰기 위해서입니다.

---

## 6. Supabase 저장

즐겨찾기(`favorites` 테이블)에 닉네임, 출처(`tour` / `history`), 항목 ID, 제목을 저장하고, 새로고침해도 남습니다. 같은 닉네임·출처·항목은 **중복 저장되지 않습니다.**

```sql
create table favorites (
  id bigint generated always as identity primary key,
  nickname text not null,
  source text not null,       -- 'tour' | 'history'
  item_id text not null,
  title text not null,
  created_at timestamptz default now()
);
alter table favorites enable row level security;
create policy "read all"   on favorites for select using (true);
create policy "insert all" on favorites for insert with check (true);
```

> ⚠️ 위 정책은 실습용(누구나 읽고 쓰기)입니다. 로그인이 없어 **닉네임이 같으면 같은 기록이 보이고**, 삭제 기능은 일부러 넣지 않았습니다. 실제 서비스라면 Supabase Auth로 로그인한 사용자만 쓰게 바꿔야 합니다.

---

## 7. 실행하기

```bash
npm install
cp .env.example .env.local     # 값 채우기 (Windows: copy .env.example .env.local)
vercel dev                     # 화면 + /api 서버 함수 (http://localhost:3000)
```
`npm run dev`는 화면만 띄우며 `/api`를 실행하지 않습니다.

### 환경변수 (`.env.local`, Vercel → Settings → Environment Variables)

| 이름 | 용도 | 비고 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase Project URL | `https://<프로젝트ID>.supabase.co` (대시보드 주소 아님) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon(publishable) 키 | 브라우저에 들어가는 공개 값 |
| `DATA_GO_KR_KEY` | 공공데이터포털 Decoding 키 | **`VITE_` 금지** |
| `ANTHROPIC_API_KEY` | 에이전트용 Claude 키 | **`VITE_` 금지**, 코드·GitHub에 올리지 않기 |

`VITE_`로 시작하는 값만 브라우저에 들어갑니다. `.env.local`은 `.gitignore`(`*.local`)로 GitHub에서 제외됩니다.

---

## 8. 알려진 한계

- **에이전트 실제 테스트 미완료** (위 표 참고, 키 수령 후 기록).
- 역사 자료 API에는 **4·3 관련 자료와 표지 이미지가 없습니다.** 책 모양 표지는 대체 디자인입니다.
- 날씨는 제주시·서귀포시 **두 지점**의 격자 좌표만 지원하며, 장소별 날씨는 아닙니다.
- 닉네임 기반 저장이라 **개인 기록의 비밀이 보장되지 않습니다.**
- 홈의 노래 소리 재생은 배포 환경에서 직접 확인이 필요합니다.

---

## 9. 데이터 출처와 제작 과정

- 한국관광공사 「국문 관광정보 서비스」, 기상청 「단기예보 조회서비스」, 제주특별자치도 「역사자료 정보」 (공공데이터포털 data.go.kr)
- 노래 「네 글자로」: 작사 가드너, AI 작곡 툴 활용
- 개발 과정에서 AI 코딩 도구(Claude Code)의 도움을 받았고, 각 API 응답과 화면 동작은 실제 호출로 확인했습니다.

> 이곳들은 관광지이기 전에 **추모와 기억의 공간**입니다. 조용히, 존중하는 마음으로 방문해 주세요.
