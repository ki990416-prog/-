import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { bookColor } from './BookShelf'
import '../styles/bookshelf.css'

const q = encodeURIComponent

// 펼친 책 — 닫힌 표지가 가운데 나타났다가 왼쪽으로 넘어가며 두 쪽이 펼쳐집니다
// book: { id, title, category, writer, publisher, summary } / onClose() / onSave()
export default function OpenBook({ book, onClose, onSave }) {
  const [opened, setOpened] = useState(false)
  const closeRef = useRef(onClose)                           // 부모가 다시 그려져도 효과가 다시 실행되지 않게
  closeRef.current = onClose
  const [prevFocus] = useState(() => document.activeElement) // 덮기 버튼 autoFocus 보다 먼저, 눌렀던 책을 기억

  useEffect(() => {
    document.querySelector('.ob-close')?.focus()            // 키보드 포커스를 책 안으로 옮김
    const t = setTimeout(() => setOpened(true), 80)         // 한 박자 뒤에 펼쳐야 애니메이션이 보여요
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'                 // 뒤 화면 스크롤 잠금
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()                                  // 닫으면 눌렀던 책으로 포커스 복귀
    }
  }, [prevFocus])

  const meta = (
    <>
      <span className="ob-tag">{book.category}</span>
      {book.writer && <span className="ob-tag">저자 {book.writer}</span>}
      {book.publisher && <span className="ob-tag">{book.publisher}</span>}
    </>
  )
  const actions = (
    <>
      <div className="small mb-2" style={{ fontFamily: 'system-ui, sans-serif', color: '#6b5a45' }}>원문·관련 자료 찾아보기 (검색으로 이동)</div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button size="sm" variant="outline-dark" href={`https://search.naver.com/search.naver?query=${q(book.title + ' 제주')}`} target="_blank" rel="noopener noreferrer">
          <i className="bi bi-search me-1" />네이버
        </Button>
        <Button size="sm" variant="outline-dark" href={`https://www.google.com/search?q=${q(book.title + ' 제주')}`} target="_blank" rel="noopener noreferrer">
          <i className="bi bi-search me-1" />구글
        </Button>
      </div>
      <Button size="sm" variant="dark" onClick={onSave}><i className="bi bi-star me-1" />즐겨찾기에 꽂기</Button>
    </>
  )

  return (
    <div className="ob-overlay" role="dialog" aria-modal="true" aria-label={`${book.title} 펼친 책`} onClick={onClose}>
      <Button className="ob-close" variant="light" size="sm" onClick={onClose} autoFocus aria-label="책 덮기">
        <i className="bi bi-x-lg me-1" />덮기
      </Button>
      <div className={`ob-stage${opened ? ' opened' : ''}`} style={{ '--c': bookColor(book) }} onClick={(e) => e.stopPropagation()}>
        {/* 오른쪽 쪽: 소개 글 */}
        <div className="ob-page ob-right">
          <div className="ob-meta-m">
            <h2>{book.title}</h2>
            <div className="mb-2">{meta}</div>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{book.summary || '소개 글이 없어요.'}</p>
          <div className="ob-meta-m"><hr className="ob-rule" />{actions}</div>
        </div>

        {/* 표지: 앞면 = 책 표지, 뒷면 = 왼쪽 쪽 */}
        <div className="ob-cover">
          <div className="ob-face ob-front">
            <div className="ob-cat">{book.category}</div>
            <div className="ob-title">{book.title}</div>
            <div className="ob-orn">❖</div>
          </div>
          <div className="ob-face ob-back ob-page">
            <h2>{book.title}</h2>
            <div className="mb-2">{meta}</div>
            <hr className="ob-rule" />
            {actions}
          </div>
        </div>
      </div>
    </div>
  )
}
