import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import ItemCard from '../components/ItemCard'
import { Empty, ErrorAlert, Loading } from '../components/Status'
import { fetchHistory } from '../api/client'
import { useAppStore } from '../store/useAppStore'

const short = (s = '', n = 110) => (s.length > n ? s.slice(0, n) + '…' : s)
const q = encodeURIComponent

// 역사 자료 — 제주특별자치도 역사자료 정보 API (옛 기록·고문헌)
// ※ API 가 주는 열람 주소·표지 이미지는 현재 사이트에서 열리지 않아, 카드를 누르면 앱 안에서 상세를 보여줘요
export default function History() {
  const addFavorite = useAppStore((s) => s.addFavorite)
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState([])
  const [category, setCategory] = useState('전체')
  const [open, setOpen] = useState(null)        // 상세 창에 보여줄 자료
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function search(e) {
    e?.preventDefault()
    setLoading(true); setError('')
    try { setList(await fetchHistory(keyword)); setCategory('전체') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { search() }, [])

  const categories = useMemo(() => ['전체', ...new Set(list.map((h) => h.category))], [list])
  const shown = category === '전체' ? list : list.filter((h) => h.category === category)

  return (
    <>
      <PageHeader icon="journal-text" title="역사 자료" subtitle="제주특별자치도 역사자료 정보 — 옛 기록과 문헌" />
      <Alert variant="secondary" className="small">
        <i className="bi bi-info-circle me-2" />
        이 API는 탐라순력도, 조선왕조실록 등 <b>옛 기록과 문헌</b>(유배 기록 포함)의 소개를 제공합니다. 카드를 눌러 자세히 보세요. 4·3 관련 자료는 포함되어 있지 않아요.
      </Alert>
      <Form onSubmit={search} className="mb-2">
        <InputGroup>
          <Form.Control value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="예: 유배, 실록, 탐라" />
          <Button type="submit"><i className="bi bi-search" /></Button>
        </InputGroup>
      </Form>
      {categories.length > 2 && (
        <div className="mb-4 d-flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge key={c} bg={c === category ? 'primary' : 'secondary'} role="button" className="fw-normal fs-6"
              onClick={() => setCategory(c)}>{c}</Badge>
          ))}
        </div>
      )}
      <ErrorAlert error={error} />
      {loading ? <Loading /> : shown.length === 0 ? <Empty /> : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {shown.map((h) => (
            <Col key={h.id}>
              <ItemCard title={h.title} subtitle={short(h.summary)} badge={h.writer ? `${h.category} · ${h.writer}` : h.category}
                placeholder="book" onOpen={() => setOpen(h)}
                onSave={() => addFavorite({ source: 'history', id: h.id, title: h.title })} />
            </Col>
          ))}
        </Row>
      )}

      <Modal show={!!open} onHide={() => setOpen(null)} centered scrollable>
        {open && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fs-5"><i className="bi bi-book me-2" />{open.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3 d-flex flex-wrap gap-2">
                <Badge bg="secondary">{open.category}</Badge>
                {open.writer && <Badge bg="dark" className="border">저자 {open.writer}</Badge>}
                {open.publisher && <Badge bg="dark" className="border">{open.publisher}</Badge>}
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{open.summary || '소개 글이 없어요.'}</p>
              <hr />
              <div className="small text-muted mb-2">원문·관련 자료를 더 찾아보려면 (검색 결과로 이동해요)</div>
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-light" href={`https://search.naver.com/search.naver?query=${q(open.title + ' 제주')}`} target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-search me-1" />네이버
                </Button>
                <Button size="sm" variant="outline-light" href={`https://www.google.com/search?q=${q(open.title + ' 제주')}`} target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-search me-1" />구글
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-primary" onClick={() => addFavorite({ source: 'history', id: open.id, title: open.title })}>
                <i className="bi bi-star me-1" />즐겨찾기
              </Button>
              <Button variant="secondary" onClick={() => setOpen(null)}>닫기</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  )
}
