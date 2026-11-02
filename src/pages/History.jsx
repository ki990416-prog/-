import { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import ItemCard from '../components/ItemCard'
import { Empty, ErrorAlert, Loading } from '../components/Status'
import { fetchHistory } from '../api/client'
import { useAppStore } from '../store/useAppStore'

const short = (s = '', n = 110) => (s.length > n ? s.slice(0, n) + '…' : s)

// 역사 자료 — 제주특별자치도 역사자료 정보 API (옛 기록·고문헌)
export default function History() {
  const addFavorite = useAppStore((s) => s.addFavorite)
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function search(e) {
    e?.preventDefault()
    setLoading(true); setError('')
    try { setList(await fetchHistory(keyword)) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { search() }, [])

  return (
    <>
      <PageHeader icon="journal-text" title="역사 자료" subtitle="제주특별자치도 역사자료 정보 — 옛 기록과 문헌" />
      <Alert variant="secondary" className="small">
        <i className="bi bi-info-circle me-2" />
        이 API는 탐라순력도, 조선왕조실록 등 <b>옛 기록과 문헌</b>(유배 기록 포함)을 제공합니다. 4·3 관련 자료는 포함되어 있지 않아요.
      </Alert>
      <Form onSubmit={search} className="mb-4">
        <InputGroup>
          <Form.Control value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="예: 유배, 실록, 탐라" />
          <Button type="submit"><i className="bi bi-search" /></Button>
        </InputGroup>
      </Form>
      <ErrorAlert error={error} />
      {loading ? <Loading /> : list.length === 0 ? <Empty /> : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {list.map((h) => (
            <Col key={h.id}>
              <ItemCard title={h.title} subtitle={short(h.summary)} badge={h.writer || '문헌'}
                onSave={() => addFavorite({ source: 'history', id: h.id, title: h.title })} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
