// 제주 역사 연표 — 직접 정리한 목록입니다 (API 아님).
// 원칙: 출처로 확인한 사실만 싣고, 희생자 수나 평가·책임을 판단하는 표현은 넣지 않습니다.
//       자료마다 날짜가 다른 항목은 연도(또는 '무렵')까지만 적고, 항목마다 근거 링크를 답니다.
// era: 'joseon' 조선·유배 / 'colonial' 일제강점기 / 'p43' 4·3 / 'after' 4·3 이후

export const ERAS = [
  { key: 'all', label: '전체' },
  { key: 'joseon', label: '조선·유배' },
  { key: 'colonial', label: '일제강점기' },
  { key: 'p43', label: '4·3' },
  { key: 'after', label: '기억과 회복' },
]

const WIKI43 = { label: '위키백과 · 제주 4·3 사건', url: 'https://ko.wikipedia.org/wiki/제주_4·3_사건' }
const ARCHIVE_TL = { label: '제주4·3 아카이브 · 시대별 기록', url: 'http://43archives.or.kr/events/timeline/timeline.do' }

export const TIMELINE = [
  {
    when: '1653년', era: 'joseon', title: '하멜 일행, 제주에 표착',
    text: '네덜란드 상선 스페르베르호가 일본으로 가던 중 풍랑을 만나 제주에 닿았습니다. 정확한 날짜(음력·양력)와 표착 지점은 자료마다 다릅니다.',
    source: { label: '제주의소리', url: 'https://www.jnuri.net/mobile/article.html?no=67885' },
  },
  {
    when: '1840년', era: 'joseon', title: '추사 김정희, 대정으로 유배',
    text: '1840년에 제주 대정으로 유배되어 1848년 말까지 머물렀습니다. 이 시기에 「세한도」와 추사체가 나온 것으로 알려져 있습니다. 시작·종료 날짜는 자료마다 조금 다릅니다.',
    source: { label: '추사박물관 안내', url: 'https://www.gccity.go.kr/chusamuseum/contents.do?mId=0502000000' },
  },
  {
    when: '1931년', era: 'colonial', title: '알뜨르비행장 건설 시작',
    text: '일본 해군이 중일전쟁에 대비해 모슬포 알뜨르 일대에 비행장을 짓기 시작했고, 이후 확장되었습니다. 일부 격납고는 지금도 남아 있습니다.',
    source: { label: '서울신문', url: 'https://www.seoul.co.kr/news/2019/08/06/20190806018006' },
  },
  {
    when: '1932년 1월', era: 'colonial', title: '제주 해녀 항일운동',
    text: '구좌·성산·우도 일대 해녀들이 일제의 수탈에 맞서 시위에 나섰습니다. 1월 7일 세화 장날 시위가 본격화된 날로 전해집니다. 참여 규모와 시작 시점은 자료마다 다르게 적혀 있습니다.',
    source: { label: '서울신문', url: 'https://newsseoul.co.kr/news/view/1065595247426927' },
  },
  {
    when: '1945년 2월', era: 'colonial', title: '일본군 본토 결전 준비, 제주 포함',
    text: '일본군이 본토 방어를 위해 세운 결호작전에 제주도가 일본 밖 지역으로는 유일하게 포함되었습니다(결7호). 알뜨르 일대에 비행장·격납고·동굴 진지가 만들어졌습니다.',
    source: { label: '평화군축센터 칼럼', url: 'https://peoplepower21.org/peace/1985242' },
  },
  {
    when: '1947년 3월 1일', era: 'p43', title: '3·1절 기념 행사 뒤 경찰 발포',
    text: '3·1절 기념 제주도대회 뒤 경찰이 군중에게 발포한 사건이 일어났습니다. 당시 경찰은 정당방위라고 했고 목격자들은 달리 증언해, 이 부분은 지금도 설명이 엇갈립니다.',
    source: WIKI43,
  },
  {
    when: '1948년 4월 3일', era: 'p43', title: '무장봉기 시작',
    text: '남로당 제주도당의 무장대가 경찰지서를 공격하면서 무장봉기가 시작되었습니다. 이 날이 4·3의 이름이 되었습니다.',
    source: WIKI43,
  },
  {
    when: '1948년 11월 21일', era: 'p43', title: '제주도 전역에 계엄령',
    text: '제주도 전역에 계엄령이 실시되었습니다.',
    source: WIKI43,
  },
  {
    when: '1954년 9월 21일', era: 'p43', title: '한라산 금족령 해제',
    text: '한라산 출입 금지가 풀리면서, 1947년 3·1절 사건부터 이어진 일련의 사태가 끝난 것으로 봅니다.',
    source: WIKI43,
  },
  {
    when: '1978년', era: 'after', title: '현기영 「순이 삼촌」 발표',
    text: '4·3을 다룬 소설 「순이 삼촌」이 발표되었습니다.',
    source: WIKI43,
  },
  {
    when: '2000년 1월 12일', era: 'after', title: '제주4·3특별법 공포',
    text: '제주4·3사건 진상규명 및 희생자 명예회복에 관한 특별법이 공포되었습니다. 국가 차원의 진상 규명이 시작되는 법적 근거입니다.',
    source: WIKI43,
  },
  {
    when: '2000년 8월 28일', era: 'after', title: '진상규명 및 희생자명예회복위원회 발족',
    text: '국무총리를 위원장으로 하는 위원회가 발족했습니다.',
    source: ARCHIVE_TL,
  },
  {
    when: '2003년 10월', era: 'after', title: '진상조사보고서 발표, 대통령 사과',
    text: '10월 15일자 「제주4·3사건진상조사보고서」가 나왔고, 10월 31일 노무현 대통령이 국가권력에 의한 희생을 인정하며 공식 사과했습니다.',
    source: ARCHIVE_TL,
  },
  {
    when: '2008년 11월 10일', era: 'after', title: '제주4·3평화재단 현판식',
    text: '4·3의 기록과 평화·화해 사업을 이어갈 제주4·3평화재단이 현판을 달았습니다.',
    source: ARCHIVE_TL,
  },
  {
    when: '2014년 3월', era: 'after', title: '4월 3일, 국가 추념일로 지정',
    text: '정부가 국무회의에서 4월 3일을 4·3희생자 추념일(국가기념일)로 지정했습니다.',
    source: { label: '서울신문', url: 'https://m.go.seoul.co.kr/news/2014/03/19/20140319029018' },
  },
  {
    when: '2021년 2월', era: 'after', title: '특별법 전부개정안 국회 통과',
    text: '희생자 위자료 지급, 수형인 명예회복, 추가 진상조사의 근거를 담은 개정안이 국회를 통과했습니다(2월 26일).',
    source: { label: '서울신문', url: 'https://m.go.seoul.co.kr/news/2021/03/30/20210330012016' },
  },
  {
    when: '2025년 4월', era: 'after', title: '4·3 기록물, 유네스코 세계기록유산 등재',
    text: '진상규명과 명예회복, 화해·상생의 과정을 담은 4·3 기록물 1만4673건이 유네스코 세계기록유산에 등재되었습니다. 발표 날짜는 4월 11일 무렵으로 보도되었습니다.',
    source: { label: '뉴시스', url: 'https://www.newsis.com/view/NISX20250411_0003135395' },
  },
]
