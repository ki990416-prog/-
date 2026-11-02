// 제주 역사 뉴스 — 구글 뉴스 검색 RSS (키 불필요, 공식 공공 API 는 아님)
// 기사 본문은 가져오지 않고 제목·언론사·날짜·링크만 보여 줍니다. 누르면 원문(새 탭)으로 이동.
import { XMLParser } from 'fast-xml-parser';

// 주제는 여기 있는 것만 허용합니다 (아무 검색어나 서버가 대신 조회하지 않도록)
export const NEWS_TOPICS = {
  '4·3 추모': '제주4·3 추모',
  '4·3 유적지': '제주4·3 유적지',
  '평화·교육': '제주4·3 평화 교육',
  '일제강점기': '제주 일제강점기 유적',
  '유배': '제주 유배 역사',
};
export const DEFAULT_TOPIC = '4·3 추모';

const parser = new XMLParser({ parseTagValue: false });
const toArray = (x) => (!x ? [] : Array.isArray(x) ? x : [x]);
const text = (v) => (typeof v === 'object' && v !== null ? String(v['#text'] ?? '') : String(v ?? '')).trim();

export async function searchNews({ topic = DEFAULT_TOPIC, limit = 8 } = {}) {
  const query = NEWS_TOPICS[topic];
  if (!query) throw new Error('지원하지 않는 주제예요: ' + topic);

  const url = 'https://news.google.com/rss/search?hl=ko&gl=KR&ceid=KR:ko&q=' + encodeURIComponent(`${query} when:1y`);
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`뉴스 서버 응답 오류 (${r.status})`);
  const root = parser.parse(await r.text())?.rss?.channel;
  if (!root) throw new Error('뉴스 응답 형식이 달라요');

  const seen = new Set();
  return toArray(root.item)
    .map((it) => {
      const source = text(it.source);
      let title = text(it.title);
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3)); // 제목 끝의 " - 언론사" 제거
      const t = Date.parse(text(it.pubDate));
      return { title, source, date: Number.isNaN(t) ? null : new Date(t).toISOString(), link: text(it.link) };
    })
    .filter((n) => n.title && n.link.startsWith('http'))
    .filter((n) => (seen.has(n.title) ? false : seen.add(n.title)))   // 같은 제목 중복 제거
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, limit);
}
