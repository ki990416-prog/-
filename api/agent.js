import Anthropic from '@anthropic-ai/sdk';
import { searchTour } from '../server/tour.js';
import { getWeather } from '../server/weather.js';
import { searchHistory } from '../server/history.js';

const MODEL = 'claude-sonnet-5-5'; // 수업 규칙: 더 비싼 모델로 바꾸지 않기
const MAX_TURNS = 5;               // 수업 규칙: 루프 상한 유지
const MAX_TOKENS = 1024;           // 수업 규칙: 답 길이 상한 유지
const MAX_HISTORY = 10;            // 수업 규칙: 대화 기록은 최근 10개만

const TYPE_LABEL = { 12: '관광지', 14: '문화시설', 15: '축제·행사' };

// ① 도구 설명서: Claude는 이 설명만 보고 "어떤 도구를 언제 쓸지" 결정한다
export const tools = [
  {
    name: 'search_places',
    description:
      '한국관광공사 TourAPI로 제주의 역사 현장·기념관·유적지를 검색한다. 장소 이름에 들어 있는 짧은 단어로 검색해야 잘 나온다 ' +
      '(예: "4·3", "알뜨르", "진지동굴", "유배", "항일", "평화", "기념관"). 결과가 0건이면 다른 단어로 한 번 더 시도한다. ' +
      '장소 이름·주소만 알려 주며, 역사적 사실 설명은 포함하지 않는다.',
    input_schema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: '장소 이름에 들어갈 짧은 검색어 (예: 4·3, 알뜨르)' },
        contentTypeId: { type: 'string', description: '비우면 전체. 12 관광지(야외 유적), 14 문화시설(실내 전시관·기념관), 15 축제·행사' },
      },
    },
  },
  {
    name: 'get_weather',
    description:
      '기상청 단기예보로 제주시 또는 서귀포시의 앞으로 몇 시간 기온·하늘·강수확률을 조회한다. ' +
      '야외 유적지 방문을 권하기 전, 또는 사용자가 날씨·비 이야기를 할 때 쓴다. 북부(제주시권)는 제주시, 남부(서귀포·송악산·알뜨르 일대)는 서귀포시를 고른다.',
    input_schema: {
      type: 'object',
      properties: { place: { type: 'string', enum: ['제주시', '서귀포시'] } },
      required: ['place'],
    },
  },
  {
    name: 'search_history',
    description:
      '제주특별자치도 역사자료 정보 API로 제주의 옛 기록·고문헌(탐라순력도, 조선왕조실록, 제주풍토록 등 유배 관련 기록 포함)을 검색한다. ' +
      '조선시대 중심 자료이며 4·3 관련 자료는 들어 있지 않다. 유배·옛 기록 질문에 쓴다. 검색어는 자료 제목·저자·요약에 포함된 단어.',
    input_schema: { type: 'object', properties: { keyword: { type: 'string', description: '예: 유배, 실록, 탐라' } } },
  },
];

// ② 도구 이름 → 실제 실행 함수. 결과는 비용을 줄이려고 꼭 필요한 항목만 돌려준다
const toolImpl = {
  async search_places({ keyword = '', contentTypeId = '' } = {}) {
    const type = TYPE_LABEL[contentTypeId] ? String(contentTypeId) : '';
    const list = await searchTour({ keyword, contentTypeId: type, rows: 10 });
    return list.map((p) => ({ title: p.title, addr: p.addr, type: TYPE_LABEL[p.type] ?? '기타' }));
  },
  async get_weather({ place } = {}) {
    return getWeather({ place });
  },
  async search_history({ keyword = '' } = {}) {
    const list = await searchHistory({ keyword });
    return list.slice(0, 8).map((h) => ({ title: h.title, writer: h.writer, summary: h.summary.slice(0, 160) }));
  },
};

const SYSTEM = `너는 제주 다크 투어리즘(4·3, 일제강점기 군사시설, 유배 역사 등 아픈 역사의 현장을 찾는 여행) 해설 에이전트 '기억의 길'이다.
- 장소·날씨·옛 기록은 반드시 도구로 확인한 뒤 답한다. 도구 결과에 없는 장소·사건·날짜·숫자(특히 희생자 수 같은 통계)는 절대 지어내지 않는다.
- 도구에 없는 역사적 사실은 설명하지 말고 "제가 가진 자료에는 없어요"라고 말한 뒤, 4·3평화공원 등 공식 기념시설이나 전문 기관에서 확인하도록 안내한다.
- 4·3 관련 옛 기록 자료는 search_history 에 없다. 이를 솔직히 말한다.
- 이곳들은 추모와 기억의 공간이다. 존중하는 차분한 말투를 쓰고, 선정적 표현이나 "핫플" 같은 가벼운 표현은 쓰지 않는다. 방문 에티켓(조용히, 촬영 주의)을 한마디 곁들인다.
- 야외 유적지를 권하기 전에 날씨를 확인하고, 비가 오거나 강수확률이 높으면 실내 전시관(문화시설)을 함께 제안한다.
- 도구 결과가 0건이면 없다고 말하고, 비슷한 다른 검색어를 한 번만 더 시도한다.
- 답은 한국어로, 5문장 이내로 짧게.`;

// 대화 기록 정리: 최근 10개만, 그리고 반드시 user 메시지로 시작 (assistant 로 시작하면 API 가 거절)
export function trimHistory(history) {
  const recent = (Array.isArray(history) ? history : [])
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== 'user') recent.shift();
  return recent;
}

// ③ 에이전트 루프: 생각 → 도구 호출 → 결과 확인 → (반복) → 최종 답. client 를 넘겨받아 시험하기 쉽게 분리
export async function runAgent({ client, message, history = [] }) {
  const messages = [...trimHistory(history), { role: 'user', content: message }];
  const steps = []; // 화면에 "에이전트가 무엇을 했는지" 보여주기용

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const r = await client.messages.create({ model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM, tools, messages });

    if (r.stop_reason !== 'tool_use') {
      const answer = r.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
      return { answer, steps };
    }

    messages.push({ role: 'assistant', content: r.content }); // Claude의 도구 호출 요청을 대화에 기록
    const results = [];
    for (const block of r.content) {
      if (block.type !== 'tool_use') continue;
      let result;
      let error;
      try {
        if (!toolImpl[block.name]) throw new Error(`알 수 없는 도구: ${block.name}`);
        result = await toolImpl[block.name](block.input ?? {});
      } catch (e) {
        error = e.message;
        result = { error: e.message };
      }
      steps.push({ tool: block.name, args: block.input ?? {}, count: Array.isArray(result) ? result.length : 0, ...(error && { error }) });
      results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result), ...(error && { is_error: true }) });
    }
    messages.push({ role: 'user', content: results }); // 도구 결과를 Claude에게 돌려줌
  }
  return { answer: '도구 호출이 너무 많아 중단했어요. 질문을 좁혀 주세요.', steps };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { message, history = [] } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: '질문을 입력해 주세요' });
  if (message.length > 500) return res.status(400).json({ error: '질문은 500자 이내로 입력해 주세요' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY 가 설정되지 않았어요 (.env.local / Vercel 환경변수 확인)' });

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    res.status(200).json(await runAgent({ client, message: message.trim(), history }));
  } catch (e) {
    // 429 = 호출 한도 초과, 401 = 키 오류
    res.status(e.status ?? 500).json({ error: e.status === 429 ? '사용량이 많아요. 1분 뒤 다시 시도하세요.' : e.message });
  }
}
