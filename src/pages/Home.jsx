import { Badge, Col, Row } from 'react-bootstrap'
import WeatherBadge from '../components/WeatherBadge'
import NewsSection from '../components/NewsSection'
import YouTubeEmbed from '../components/YouTubeEmbed'

// 홈에 소개하는 노래 (제작자 본인 채널의 영상)
const SONG = {
  id: 'JPj0s9kb2sM',
  title: '네 글자로 🌴 | 이루기 힘든 두 글자, 그 너머의 네 글자',
  // 영상 설명의 앞부분 (직접 쓴 가사/소개)
  intro: ['얼마나 바람이 불었기에 불이 꺼지지 않았을까.', '얼마나 많은 슬픔이 있었기에 비는 계속 내렸을까.', '우리는 왜 이리 작고, 왜 이리 흔들릴까.'],
  closing: '그대, 너무 울지 말아요. 이 노래가 함께할게요.',
  credits: [
    ['music-note-list', '장르 · 레게'],
    ['pencil', '작사 · 가드너'],
    ['stars', '「No Woman, No Cry」에서 영감'],
    ['robot', 'AI 작곡 툴을 활용해 제작'],
  ],
}

// 홈 = 기획 소개 · 노래 · 공식 기관 바로가기 · 뉴스
// (서비스 동작 체크와 닉네임 입력은 푸터의 StatusBar 로 옮겼습니다)
export default function Home() {
  return (
    <>
      <section className="hero rounded-4 p-4 p-md-5 mb-4">
        <Badge bg="light" text="dark" className="mb-3">제주 다크 투어리즘</Badge>
        <h1 className="fw-bold">기억의 길 · 제주</h1>
        <p className="hero-slogan">기억하고 · <b>화해하고</b> · 함께 가는 제주</p>
        <p className="lead">제주의 아픈 역사 현장을 존중하는 마음으로 찾아가는, 공공데이터 기반 AI 해설 가이드</p>
        <WeatherBadge place="서귀포시" />
      </section>

      <section className="mb-5">
        <Row className="g-4 align-items-center">
          <Col lg={7}>
            <YouTubeEmbed id={SONG.id} title={SONG.title} />
          </Col>
          <Col lg={5}>
            <h5 className="fw-bold"><i className="bi bi-music-note-beamed me-2" />기억의 노래</h5>
            <p className="small text-muted mb-2">{SONG.title}</p>
            <blockquote className="song-quote">
              {SONG.intro.map((line) => <div key={line}>{line}</div>)}
              <div className="mt-2 fw-bold">{SONG.closing}</div>
            </blockquote>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {SONG.credits.map(([icon, text]) => (
                <Badge key={text} bg="light" text="dark" className="border fw-normal"><i className={`bi bi-${icon} me-1`} />{text}</Badge>
              ))}
            </div>
            <a className="btn btn-sm btn-outline-primary" href={`https://youtu.be/${SONG.id}`} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-youtube me-1" />유튜브에서 보기
            </a>
          </Col>
        </Row>

        <div className="peace-link mt-4 d-flex flex-wrap align-items-center justify-content-between gap-3 rounded-3 p-3">
          <div>
            <div className="fw-bold">노래로 마음이 닿았다면, 직접 찾아가 보세요</div>
            <div className="small text-muted">평화공원 홈페이지에서 기념 시설과 관람 안내를, 아카이브에서 문서·사진 등 기록을 볼 수 있어요.</div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <a className="btn btn-primary" href="https://jeju43peace.or.kr/" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-flower1 me-1" />제주4·3평화공원 홈페이지
              <i className="bi bi-box-arrow-up-right ms-2 small" />
            </a>
            <a className="btn btn-outline-primary" href="http://43archives.or.kr/" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-archive me-1" />4·3 아카이브(기록 보기)
              <i className="bi bi-box-arrow-up-right ms-2 small" />
            </a>
          </div>
        </div>
      </section>

      <NewsSection />
    </>
  )
}

