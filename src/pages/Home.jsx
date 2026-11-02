import { useEffect, useState } from 'react'
import { Badge, Card, Col, Form, Row } from 'react-bootstrap'
import { ping } from '../api/client'
import { isSupabaseReady, supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'
import WeatherBadge from '../components/WeatherBadge'
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

// 홈 = 기획 소개 + "동작 체크" 대시보드
// STEP 0~1 에서 이 화면의 체크가 모두 초록색이 되어야 다음 단계로 넘어갑니다.
export default function Home() {
  const nickname = useAppStore((s) => s.nickname)
  const setNickname = useAppStore((s) => s.setNickname)
  const [db, setDb] = useState(isSupabaseReady
    ? { state: 'wait', msg: '확인 중...' }
    : { state: 'fail', msg: '.env.local 에 VITE_SUPABASE_URL / ANON_KEY 를 넣으세요' })
  const [api, setApi] = useState({ state: 'wait', msg: '확인 중...' })

  useEffect(() => {
    // ① Supabase 연결 확인
    if (isSupabaseReady) supabase.from('favorites').select('id').limit(1).then(({ error }) =>
      setDb(error ? { state: 'fail', msg: error.message } : { state: 'ok', msg: '연결 OK' }))

    // ② 서버 함수(/api) 확인
    ping()
      .then((d) => setApi({ state: 'ok', msg: `OK · 공공데이터 키 ${d.hasDataKey ? '있음' : '없음'} · Claude 키 ${d.hasClaudeKey ? '있음' : '없음'}` }))
      .catch(() => setApi({ state: 'fail', msg: 'npm run dev 가 아니라 vercel dev 로 실행했는지 확인' }))
  }, [])

  return (
    <>
      <section className="hero rounded-4 p-4 p-md-5 mb-4">
        <Badge bg="light" text="dark" className="mb-3">제주 다크 투어리즘</Badge>
        <h1 className="fw-bold">기억의 길 · 제주</h1>
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
                <Badge key={text} bg="dark" className="border fw-normal"><i className={`bi bi-${icon} me-1`} />{text}</Badge>
              ))}
            </div>
            <a className="btn btn-sm btn-outline-light" href={`https://youtu.be/${SONG.id}`} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-youtube me-1" />유튜브에서 보기
            </a>
          </Col>
        </Row>
      </section>

      <h5 className="fw-bold mb-3"><i className="bi bi-clipboard-check me-2" />동작 체크</h5>
      <Row xs={1} md={3} className="g-3">
        <Col><Check title="React · 라우터" state="ok" msg="이 화면이 보이면 OK" /></Col>
        <Col><Check title="Supabase" {...db} /></Col>
        <Col><Check title="서버 함수 /api" {...api} /></Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="fs-6 fw-bold"><i className="bi bi-database me-2" />Store(Zustand) 확인</Card.Title>
          <Form.Control placeholder="닉네임을 입력하세요" value={nickname}
            onChange={(e) => setNickname(e.target.value)} style={{ maxWidth: 320 }} />
          <Form.Text>입력하면 오른쪽 위 메뉴에도 바로 보이고, 새로고침해도 남아 있습니다.</Form.Text>
        </Card.Body>
      </Card>
    </>
  )
}

function Check({ title, state, msg }) {
  const icon = { ok: 'check-circle-fill text-success', fail: 'x-circle-fill text-danger', wait: 'hourglass-split text-muted' }[state]
  return (
    <Card className="h-100">
      <Card.Body>
        <div className="fw-bold mb-1"><i className={`bi bi-${icon} me-2`} />{title}</div>
        <div className="small text-muted">{msg}</div>
      </Card.Body>
    </Card>
  )
}
