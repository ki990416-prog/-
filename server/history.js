// 제주특별자치도 역사자료 정보 오픈API (키 불필요, XML 응답)
// 검색어 파라미터가 없어서 전체(약 26건)를 받아 서버에서 거릅니다.
import { XMLParser } from 'fast-xml-parser';

const BASE = 'http://www.jeju.go.kr/rest/JejuHistoricalRecordService/getJejuHistoricalRecordList';
const parser = new XMLParser({ parseTagValue: false }); // "47" 같은 값을 숫자로 바꾸지 않기

// 본문은 HTML 조각(&lt;p&gt;...)으로 오므로 태그와 특수문자를 걷어냅니다
const clean = (s = '') => String(s)
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;|&amp;nbsp;|&#x?[0-9a-f]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const toArray = (item) => (!item ? [] : Array.isArray(item) ? item : [item]);

// 제목이 "삼국사기/국가관찬문서" 처럼 "자료명/분류" 로 오는 경우 분류를 따로 뽑습니다
const CATEGORY = /^(국가관찬문서|지방관찬문서|읍지류|사찬문서)/;
function splitTitle(raw) {
  const i = raw.lastIndexOf('/');
  if (i > 0) {
    const m = raw.slice(i + 1).trim().match(CATEGORY);
    if (m) return { title: raw.slice(0, i).trim(), category: m[1] };
  }
  return { title: raw, category: '문헌' };
}

async function fetchPage(page) {
  const r = await fetch(`${BASE}?page=${page}`);
  const text = await r.text();
  const data = parser.parse(text);
  const root = data?.jejunetApi;
  if (!root) throw new Error('제주 역사자료 API 응답 형식이 달라요: ' + text.slice(0, 120));
  if (root.error === 'true') throw new Error('제주 역사자료 API 오류: ' + (root.resultMsg ?? ''));
  return { items: toArray(root.items?.item), total: Number(root.query?.rows) || 0, size: Number(root.query?.pageSize) || 20 }
}

export async function searchHistory({ keyword = '' } = {}) {
  const first = await fetchPage(1);
  const pages = Math.min(Math.ceil(first.total / first.size) || 1, 5); // 안전장치: 최대 5페이지
  const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => fetchPage(i + 2)));
  const all = [first, ...rest].flatMap((p) => p.items);

  const list = all
    .filter((h) => h.use !== 'false' && clean(h.eBook) && clean(h.eBook) !== 'test') // 비공개·더미 제외
    .map((h) => ({
      id: String(h.seq),
      ...splitTitle(clean(h.eBook)),
      writer: clean(h.writer),
      publisher: clean(h.publisher),
      summary: clean(h.contents),
    }));
  // ※ API 가 주는 열람 주소(url)·표지 파일명(image1)은 현재 jeju.go.kr 에서 열리지 않아 사용하지 않습니다.

  const q = keyword.trim();
  return q ? list.filter((h) => `${h.title} ${h.category} ${h.writer} ${h.summary}`.includes(q)) : list;
}
