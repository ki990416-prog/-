import { useEffect, useState } from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import { fetchNews } from '../api/client'

const TOPICS = ['4·3 추모', '4·3 유적지', '평화·교육', '일제강점기', '유배']

const fmt = (iso) => (iso ? iso.slice(0, 10).replaceAll('-', '.') : '')

// 홈의 "제주 역사 뉴스" — 제목·언론사·날짜만 보여 주고, 누르면 원문(새 탭)으로 이동
export default function NewsSection() {
  const [topic, setTopic] = useState(TOPICS[0])
  const [state, setState] = useState({ loading: true, items: [], error: '' })

  useEffect(() => {
    let alive = true
    setState({ loading: true, items: [], error: '' })
    fetchNews(topic)
      .then((items) => alive && setState({ loading: false, items, error: '' }))
      .catch((e) => alive && setState({ loading: false, items: [], error: e.message }))
    return () => { alive = false }   // 주제를 빠르게 바꿔도 마지막 선택의 결과만 보이게
  }, [topic])

  return (
    <section className="mb-5">
      <h5 className="fw-bold"><i className="bi bi-newspaper me-2" />제주 역사 뉴스</h5>
      <p className="small text-muted mb-2">
        외부 언론사 기사의 제목만 모아 보여 줍니다. 기사 내용과 논조는 각 언론사의 것이며 이 서비스의 입장이 아닙니다.
      </p>
      <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="뉴스 주제">
        {TOPICS.map((t) => (
          <Badge key={t} as="button" type="button" pill bg={t === topic ? 'primary' : 'secondary'}
            className="border-0 fw-normal px-3 py-2" aria-pressed={t === topic} onClick={() => setTopic(t)}>
            {t}
          </Badge>
        ))}
      </div>

      {state.loading ? (
        <div className="text-muted small">뉴스를 불러오는 중...</div>
      ) : state.error ? (
        <div className="text-muted small"><i className="bi bi-info-circle me-1" />지금은 뉴스를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</div>
      ) : state.items.length === 0 ? (
        <div className="text-muted small">최근 1년간 이 주제의 기사가 없어요.</div>
      ) : (
        <ListGroup>
          {state.items.map((n) => (
            <ListGroup.Item key={n.link} action href={n.link} target="_blank" rel="noopener noreferrer"
              className="d-flex justify-content-between align-items-start gap-3">
              <span>{n.title}</span>
              <span className="small text-muted text-nowrap text-end">
                {n.source}<br />{fmt(n.date)}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <div className="small text-muted mt-2">출처: 구글 뉴스 검색 결과 · 누르면 해당 언론사 기사로 이동합니다.</div>
    </section>
  )
}
