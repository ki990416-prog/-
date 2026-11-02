import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Form, InputGroup } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import BookShelf from '../components/BookShelf'
import OpenBook from '../components/OpenBook'
import { Empty, ErrorAlert, Loading } from '../components/Status'
import { fetchHistory } from '../api/client'
import { useAppStore } from '../store/useAppStore'

// 역사 자료 — 제주특별자치도 역사자료 정보 API (옛 기록·고문헌)를 책장으로 보여줍니다
// ※ API 가 주는 열람 주소·표지 이미지는 현재 사이트에서 열리지 않아, 책을 펼치면 앱 안에서 소개 글을 보여줘요
export default function History() {
  const addFavorite = useAppStore((s) => s.addFavorite)
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState([])
  const [category, setCategory] = useState('전체')
  const [open, setOpen] = useState(null)        // 펼친 책
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
      <PageHeader icon="journal-text" title="역사 자료" subtitle="제주특별자치도 역사자료 정보 — 책장에서 옛 기록을 꺼내 보세요" />
      <Alert variant="secondary" className="small">
        <i className="bi bi-info-circle me-2" />
        탐라순력도, 조선왕조실록 등 <b>옛 기록과 문헌</b>(유배 기록 포함)의 소개를 제공합니다. 책등을 눌러 책을 펼쳐 보세요. 4·3 관련 자료는 포함되어 있지 않아요.
        <div className="mt-2">
          4·3 기록은{' '}
          <a href="http://43archives.or.kr/" target="_blank" rel="noopener noreferrer" className="fw-bold">
            제주4·3 아카이브(제주4·3평화재단)<i className="bi bi-box-arrow-up-right ms-1 small" />
          </a>
          에서 볼 수 있어요. <span className="text-muted">(보안 연결 없이 열리는 사이트입니다)</span>
        </div>
      </Alert>
      <Form onSubmit={search} className="mb-2">
        <InputGroup>
          <Form.Control value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="예: 유배, 실록, 탐라" />
          <Button type="submit"><i className="bi bi-search" /></Button>
        </InputGroup>
      </Form>
      {categories.length > 2 && (
        <div className="mb-3 d-flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge key={c} bg={c === category ? 'primary' : 'secondary'} role="button" className="fw-normal fs-6"
              onClick={() => setCategory(c)}>{c}</Badge>
          ))}
        </div>
      )}
      <ErrorAlert error={error} />
      {loading ? <Loading /> : shown.length === 0 ? <Empty text="꽂힌 책이 없어요" /> : (
        <BookShelf books={shown} onOpen={setOpen} />
      )}

      {open && (
        <OpenBook book={open} onClose={() => setOpen(null)}
          onSave={() => addFavorite({ source: 'history', id: open.id, title: open.title })} />
      )}
    </>
  )
}
