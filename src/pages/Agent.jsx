import { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import { useAppStore } from '../store/useAppStore'

const TOOL_LABEL = { search_places: '장소 검색', get_weather: '날씨 조회', search_history: '옛 기록 검색' }
const TOOL_ICON = { search_places: 'geo-alt', get_weather: 'cloud-sun', search_history: 'journal-text' }

// 체크포인트 6 테스트 질문 (다크 투어 버전)
const EXAMPLES = [
  '제주시 지금 날씨 어때?',
  '알뜨르비행장은 어떤 곳이야?',
  '서귀포에 비 오면 4·3 관련해서 실내에서 볼 수 있는 곳 추천해줘',
  '제주에 있는 에펠탑 알려줘',
]

const argText = (args) => Object.values(args ?? {}).filter(Boolean).join(', ')

export default function Agent() {
  const messages = useAppStore((s) => s.messages)
  const loading = useAppStore((s) => s.chatLoading)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const [input, setInput] = useState('')
  const bottom = useRef(null)

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, loading])

  function ask(text) {
    if (!text.trim() || loading) return
    sendMessage(text)
    setInput('')
  }

  return (
    <>
      <PageHeader icon="robot" title="AI 해설사" subtitle="공공데이터 API 3개를 도구로 쓰는 에이전트" />
      <Alert variant="secondary" className="small">
        <i className="bi bi-info-circle me-2" />
        장소·날씨·옛 기록을 <b>도구로 직접 확인</b>한 내용만 답합니다. 자료에 없는 사실은 지어내지 않아요.
      </Alert>
      <Card className="chat-box mb-3">
        <Card.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {messages.length === 0 && (
            <div>
              <div className="text-muted mb-2">예시 질문을 눌러 보세요</div>
              <div className="d-flex flex-column gap-2 align-items-start">
                {EXAMPLES.map((q) => (
                  <Button key={q} size="sm" variant="outline-secondary" disabled={loading} onClick={() => ask(q)}>{q}</Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.steps?.length > 0 && (
                <div className="mb-2">
                  <div className="small text-muted mb-1"><i className="bi bi-tools me-1" />에이전트가 호출한 도구</div>
                  <div className="d-flex flex-wrap gap-1">
                    {m.steps.map((s, k) => (
                      <Badge key={k} bg={s.error ? 'danger' : 'secondary'} className="fw-normal" title={s.error ?? JSON.stringify(s.args)}>
                        <i className={`bi bi-${TOOL_ICON[s.tool] ?? 'gear'} me-1`} />
                        {TOOL_LABEL[s.tool] ?? s.tool}({argText(s.args)}) → {s.error ? '오류' : `${s.count}건`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {m.text}
            </div>
          ))}
          {loading && <div className="small text-muted"><Spinner size="sm" className="me-2" />에이전트가 도구를 사용하는 중...</div>}
          <div ref={bottom} />
        </Card.Body>
      </Card>
      <Form onSubmit={(e) => { e.preventDefault(); ask(input) }}>
        <InputGroup>
          <Form.Control value={input} onChange={(e) => setInput(e.target.value)} placeholder="질문을 입력하세요" maxLength={500} />
          <Button type="submit" disabled={loading}><i className="bi bi-send" /></Button>
        </InputGroup>
      </Form>
    </>
  )
}
