import { useEffect, useMemo, useState } from 'react'
import '../styles/bookshelf.css'

// 책 색(어두운 테마에 어울리는 가죽 느낌)
const COLORS = ['#7b2d2d', '#2f4a6b', '#3d5a3a', '#6b4a2e', '#4b2e6b', '#8a6d2f', '#2d5a5a', '#5a2d4a']
const ORDER = ['국가관찬문서', '지방관찬문서', '읍지류', '사찬문서', '문헌']

// 문자열 → 항상 같은 숫자 (같은 책은 늘 같은 색·크기)
const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
export const bookColor = (b) => COLORS[hash(b.id + b.title) % COLORS.length]

// 화면 폭에 따라 한 선반에 꽂을 책 수
function useBooksPerRow() {
  const query = '(min-width: 768px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide ? 14 : 5
}

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

// 책장 — 분류마다 선반 하나, 책 한 권 = 자료 하나. 누르면 onOpen(book)
export default function BookShelf({ books, onOpen }) {
  const perRow = useBooksPerRow()
  const shelves = useMemo(() => {
    const groups = {}
    for (const b of books) (groups[b.category] ??= []).push(b)
    return Object.entries(groups).sort(([a], [b]) => (ORDER.indexOf(a) + 99) % 99 - (ORDER.indexOf(b) + 99) % 99)
  }, [books])

  return (
    <div className="shelf-wall">
      {shelves.map(([category, list]) => (
        <section key={category} aria-label={category}>
          <h6 className="shelf-label fw-bold">{category} <small>· {list.length}권</small></h6>
          {chunk(list, perRow).map((row, r) => (
            <div className="shelf-row" key={r}>
              {row.map((b) => {
                const h = hash(b.title)
                const style = { '--c': bookColor(b), '--h': `${146 + (h % 5) * 11}px`, '--w': `${34 + (h % 4) * 4}px` }
                const label = b.title.length > 12 ? b.title.slice(0, 11) + '…' : b.title
                return (
                  <button key={b.id} type="button" className="spine" style={style} title={b.title}
                    aria-label={`${b.title} 책 꺼내기`} onClick={() => onOpen(b)}>
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
