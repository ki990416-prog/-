import { useEffect } from 'react'
import { Alert, Col, Form, Row } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'
import ItemCard from '../components/ItemCard'
import { Empty, Loading } from '../components/Status'
import { useAppStore } from '../store/useAppStore'

const SOURCE_LABEL = { tour: '기억의 장소', history: '역사 자료', heritage: '국가유산' }

// 내 기록 — store 의 favorites 를 그대로 보여줍니다 (Supabase favorites 테이블)
export default function My() {
  const { nickname, setNickname, favorites, favLoading, loadFavorites } = useAppStore()

  // 닉네임을 치는 동안 글자마다 조회하지 않도록 잠깐 멈추면 조회
  useEffect(() => {
    const t = setTimeout(loadFavorites, 400)
    return () => clearTimeout(t)
  }, [nickname, loadFavorites])

  return (
    <>
      <PageHeader icon="bookmark-heart" title="내 기록" subtitle="내가 저장한 장소와 역사 자료" />
      <Alert variant="secondary" className="small">
        <i className="bi bi-info-circle me-2" />
        로그인 없이 <b>닉네임</b>으로 기록을 구분해요. 같은 닉네임이면 다른 기기에서도 보입니다. 닉네임을 비우면 '익명' 기록이 보여요.
      </Alert>
      <Form.Control className="mb-4" style={{ maxWidth: 320 }} placeholder="닉네임"
        value={nickname} onChange={(e) => setNickname(e.target.value)} />
      {favLoading ? <Loading /> : favorites.length === 0 ? <Empty text="아직 저장한 항목이 없어요. 기억의 장소·역사 자료에서 ☆ 즐겨찾기를 눌러 보세요" /> : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {favorites.map((f) => (
            <Col key={f.id}>
              <ItemCard title={f.title} badge={SOURCE_LABEL[f.source] ?? f.source}
                subtitle={new Date(f.created_at).toLocaleString('ko-KR')} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
