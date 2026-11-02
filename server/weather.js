// 기상청 단기예보 조회서비스 (VilageFcstInfoService_2.0)
const BASE = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const GRID = { '제주시': [53, 38], '서귀포시': [52, 33] }; // 기상청 격자 좌표(nx, ny)
const SKY = { 1: '맑음', 3: '구름많음', 4: '흐림' };
const PTY = { 0: '없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' };

// 발표시각: 02·05·08·11·14·17·20·23시 (발표 후 약 10분 뒤부터 조회 가능)
function baseDateTime() {
  const kst = new Date(Date.now() + 9 * 3600e3 - 15 * 60e3); // 한국시간, 15분 여유
  let h = [23, 20, 17, 14, 11, 8, 5, 2].find((x) => x <= kst.getUTCHours());
  let day = kst;
  if (h === undefined) { day = new Date(kst.getTime() - 24 * 3600e3); h = 23; }
  return {
    base_date: day.toISOString().slice(0, 10).replaceAll('-', ''),
    base_time: String(h).padStart(2, '0') + '00',
  };
}

export async function getWeather({ place = '제주시' } = {}) {
  if (!GRID[place]) place = '제주시'; // 모르는 지역이면 제주시로 (이름도 제주시로 표시)
  const [nx, ny] = GRID[place];
  const params = new URLSearchParams({
    serviceKey: process.env.DATA_GO_KR_KEY,
    dataType: 'JSON', numOfRows: '300', pageNo: '1',
    nx: String(nx), ny: String(ny), ...baseDateTime(),
  });
  const r = await fetch(`${BASE}?${params}`);
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error('기상청 응답이 JSON이 아님: ' + text.slice(0, 120)); }

  const items = data?.response?.body?.items?.item ?? [];
  const slots = {}; // "날짜 시간" → { TMP, SKY, PTY, POP }
  for (const it of items) {
    const key = `${it.fcstDate} ${it.fcstTime}`;
    (slots[key] ??= {})[it.category] = it.fcstValue;
  }
  // 발표시각 이후 예보는 이미 지난 시각부터 시작하므로, 지금 시각(KST) 이후 것만 남김
  const kst = new Date(Date.now() + 9 * 3600e3);
  const now = kst.toISOString().slice(0, 10).replaceAll('-', '') + ' ' + String(kst.getUTCHours()).padStart(2, '0') + '00';
  const upcoming = Object.entries(slots).filter(([time]) => time >= now);
  return (upcoming.length ? upcoming : Object.entries(slots)).slice(0, 6).map(([time, v]) => ({
    place, time, temp: Number(v.TMP), sky: SKY[v.SKY] ?? v.SKY,
    rain: PTY[v.PTY] ?? v.PTY, pop: Number(v.POP), // pop = 강수확률(%)
  }));
}
