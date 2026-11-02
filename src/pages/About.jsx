import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

// 서비스 소개 — 만든 이유, 로고(CI)와 색, 지키는 원칙, 데이터 출처, 한계
// 새로 지어낸 내용 없이, README 와 화면에서 이미 확인한 사실만 정리했습니다.

const COLORS = [
  { name: '연두·초록', css: 'var(--leaf)', text: '제주의 푸른 초목과 평화', use: '바탕, 메뉴·연표 선, 로고 글자' },
  { name: '동백 다홍', css: 'var(--camellia)', text: '제주의 아픔과 사랑 (4·3의 상징꽃)', use: '버튼, 지도 핀, 선택 표시' },
  { name: '하늘색', css: 'var(--sky)', text: '제주의 하늘과 바다, 포용과 연대', use: '메뉴 아래 선, 뉴스, 연표의 "기억과 회복"' },
]

const PRINCIPLES = [
  ['patch-check', '지어내지 않아요', 'AI 해설사는 도구가 가져온 자료에만 근거해 답하고, 자료에 없는 장소·날짜·숫자(특히 희생자 수)는 말하지 않도록 만들었습니다.'],
  ['link-45deg', '출처를 밝혀요', '연표의 항목마다 근거 링크를 달았고, 날짜가 자료마다 다르면 연도까지만 적었습니다. 뉴스는 제목만 보여 주고 원문으로 연결합니다.'],
  ['chat-heart', '존중하는 말로 말해요', '아픈 역사를 가볍거나 자극적으로 다루지 않습니다. 정치적 평가나 책임을 단정하는 표현은 쓰지 않습니다.'],
  ['flower1', '추모의 공간임을 잊지 않아요', '이곳들은 관광지이기 전에 추모와 기억의 공간입니다. 조용히, 존중하는 마음으로 방문하고 시설별 관람 안내를 따라 주세요.'],
]

const SOURCES = [
  ['한국관광공사 국문 관광정보 서비스 (TourAPI)', '장소 검색, 사진, 지도 좌표', 'https://www.data.go.kr'],
  ['기상청 단기예보 조회서비스', '제주시·서귀포시 날씨와 방문 안내', 'https://www.data.go.kr'],
  ['제주특별자치도 역사자료 정보', '옛 기록·문헌 소개 (책장)', 'https://www.data.go.kr'],
  ['구글 뉴스 검색 결과', '제주 역사 뉴스 제목 모음 (공식 공공 API 아님)', 'https://news.google.com'],
  ['OpenStreetMap', '지도 타일', 'https://www.openstreetmap.org/copyright'],
]

export default function About() {
  return (
    <>
      <PageHeader icon="info-circle" title="서비스 소개" subtitle="기억하고 · 화해하고 · 함께 가는 제주" />

      <Card className="mb-4">
        <Card.Body className="text-center">
          <img src="/logo.webp" alt="기억의 길 · 제주 로고 — 기억하고 · 화해하고 · 함께 가는 제주" className="about-logo" />
        </Card.Body>
      </Card>

      <section className="mb-5">
        <h4 className="fw-bold mb-3"><i className="bi bi-signpost-2 me-2 text-primary" />만든 이유</h4>
        <p>
          제주에는 4·3, 일제강점기의 군사시설, 유배의 역사처럼 <b>아픈 기억이 남은 장소</b>가 많습니다.
          그런데 그곳을 찾아가려는 사람은 장소 정보, 날씨, 옛 기록, 관련 소식을 여러 곳에서 따로따로 찾아야 합니다.
        </p>
        <p className="mb-0">
          <b>기억의 길 · 제주</b>는 흩어진 공공데이터와 기록을 한곳에 모아, 이런 장소를 <b>존중하는 마음으로 찾아가도록 돕는</b> 서비스입니다.
          장소만 알려 주는 데서 그치지 않고, 지금 가도 되는지(날씨), 그곳이 어떤 기록과 이어지는지(연표·옛 문헌),
          어떻게 방문하면 좋은지(추모 공간 안내)를 함께 전합니다.
        </p>
      </section>

      <section className="mb-5">
        <h4 className="fw-bold mb-3"><i className="bi bi-heart me-2 text-primary" />우리가 지키는 원칙</h4>
        <Row xs={1} md={2} className="g-3">
          {PRINCIPLES.map(([icon, title, text]) => (
            <Col key={title}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title className="fs-6 fw-bold"><i className={`bi bi-${icon} me-2 text-primary`} />{title}</Card.Title>
                  <Card.Text className="small mb-0">{text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <h4 className="fw-bold mb-3"><i className="bi bi-palette me-2 text-primary" />로고와 색</h4>
        <p>
          로고에는 돌하르방, 한라산, 동백, 바다를 담았습니다. 슬로건은 <b>"기억하고 · 화해하고 · 함께 가는 제주"</b>입니다.
          화면의 색도 세 가지 의미를 따릅니다.
        </p>
        <Row xs={1} md={3} className="g-3">
          {COLORS.map((c) => (
            <Col key={c.name}>
              <Card className="h-100">
                <div className="about-swatch" style={{ background: c.css }} aria-hidden="true" />
                <Card.Body>
                  <Card.Title className="fs-6 fw-bold">{c.name}</Card.Title>
                  <Card.Text className="small mb-1">{c.text}</Card.Text>
                  <Card.Text className="small text-muted mb-0">쓰는 곳: {c.use}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <h4 className="fw-bold mb-3"><i className="bi bi-database me-2 text-primary" />데이터 출처</h4>
        <ul className="list-unstyled mb-3">
          {SOURCES.map(([name, use, url]) => (
            <li key={name} className="mb-2">
              <a href={url} target="_blank" rel="noopener noreferrer" className="fw-bold">{name}</a>
              <span className="text-muted small"> — {use}</span>
            </li>
          ))}
        </ul>
        <p className="small mb-0">
          4·3의 공식 기록과 관람 안내는 <a href="http://43archives.or.kr/" target="_blank" rel="noopener noreferrer">제주4·3 아카이브</a>와{' '}
          <a href="https://jeju43peace.or.kr/" target="_blank" rel="noopener noreferrer">제주4·3평화공원 홈페이지</a>(제주4·3평화재단)에서 확인해 주세요.
        </p>
      </section>

      <section className="mb-5">
        <h4 className="fw-bold mb-3"><i className="bi bi-exclamation-circle me-2 text-primary" />알려진 한계</h4>
        <ul className="mb-0">
          <li>역사 자료 API에는 <b>4·3 관련 자료가 없습니다.</b> 그래서 4·3은 직접 정리한 연표와 공식 사이트 링크로 안내합니다.</li>
          <li>연표는 직접 정리했습니다. 항목마다 근거를 달았지만, 정확한 날짜와 통계는 공식 기관의 최신 자료를 확인해 주세요.</li>
          <li>지도 핀 위치는 한국관광공사 좌표 기준이라 실제와 조금 다를 수 있습니다.</li>
          <li>뉴스는 외부 언론사 기사입니다. 내용과 논조는 각 언론사의 것이며 이 서비스의 입장이 아닙니다.</li>
          <li>날씨는 제주시·서귀포시 두 지점 기준이며, 닉네임 기반 저장이라 개인 기록의 비밀이 보장되지 않습니다.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="fw-bold mb-3"><i className="bi bi-people me-2 text-primary" />만든 사람과 과정</h4>
        <p className="mb-2">
          제주대 청년도약 부트캠프 1기 수강생의 개별 과제로 만들었습니다. 홈의 노래 「네 글자로」는 직접 만든 4·3 노래이며, AI 작곡 툴을 활용해 제작했습니다.
        </p>
        <p className="small text-muted mb-0">
          개발 과정에서 AI 코딩 도구(Claude Code)의 도움을 받았고, 각 데이터와 화면 동작은 실제 호출로 확인했습니다.{' '}
          <Link to="/">홈으로 돌아가기</Link>
        </p>
      </section>
    </>
  )
}
