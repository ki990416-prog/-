import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import ItemCard from '../components/ItemCard'
import { Empty, ErrorAlert, Loading } from '../components/Status'
import WeatherNote from '../components/WeatherNote'
import { fetchPlaces } from '../api/client'
import { useAppStore } from '../store/useAppStore'

const TYPES = { '': '전체', 12: '관광지', 14: '문화시설', 15: '축제·행사' }

// 다크 투어리즘 추천 검색어 — 실제로 결과가 나오는 것만 모았어요
const PRESETS = ['4·3', '알뜨르', '진지동굴', '유배', '항일', '평화']

export default function Places() {
  const addFavorite = useAppStore((s) => s.addFavorite)   // STEP 5에서 사용
  const [keyword, setKeyword] = useState('4·3')
  const [type, setType] = useState('')
  const [places, setPlaces] = useState([])               // ① 데이터
  const [loading, setLoading] = useState(true)           // ② 로딩
  const [error, setError] = useState('')                 // ③ 에러

  // 검색어를 직접 넘기면(추천 버튼) 그 값으로, 아니면 입력창 값으로 검색
  async function search(e, kw = keyword) {
    e?.preventDefault?.()                                // 폼 제출 시 새로고침 막기
    setLoading(true); setError('')
    try { setPlaces(await fetchPlaces(kw, type)) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { search() }, [])                      // 처음 한 번 자동 검색

  function pick(kw) { setKeyword(kw); search(null, kw) }

  return (
    <>
      <PageHeader icon="geo-alt" title="기억의 장소" subtitle="한국관광공사 TourAPI — 제주의 아픈 역사가 남은 곳" />
      <Alert variant="secondary" className="small">
        <i className="bi bi-heart me-2" />
        이곳들은 관광지이기 전에 <b>추모와 기억의 공간</b>입니다. 조용히, 존중하는 마음으로 방문해 주세요.
      </Alert>
      <WeatherNote />
      <Form onSubmit={search} className="mb-2">
        <InputGroup>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)} style={{ maxWidth: 140 }}>
            {Object.entries(TYPES).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </Form.Select>
          <Form.Control value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 (예: 4·3, 알뜨르)" />
          <Button type="submit"><i className="bi bi-search" /></Button>
        </InputGroup>
      </Form>
      <div className="mb-4 d-flex flex-wrap gap-2">
        {PRESETS.map((kw) => (
          <Badge key={kw} bg={kw === keyword ? 'primary' : 'secondary'} role="button" className="fw-normal fs-6"
            onClick={() => pick(kw)}>{kw}</Badge>
        ))}
      </div>

      <ErrorAlert error={error} />
      {loading ? <Loading /> : places.length === 0 ? <Empty /> : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {places.map((p) => (
            <Col key={p.id}>
              <ItemCard title={p.title} subtitle={p.addr} image={p.image} badge={TYPES[p.type] ?? '장소'}
                onSave={() => addFavorite({ source: 'tour', id: p.id, title: p.title })} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
