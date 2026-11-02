import { useState } from 'react'
import { Badge } from 'react-bootstrap'
import { ERAS, TIMELINE } from '../data/timeline'
import '../styles/timeline.css'

// 제주 역사 연표 — 시대 칩으로 거르고, 항목마다 근거 링크(새 탭)를 보여 줍니다
export default function Timeline() {
  const [era, setEra] = useState('all')
  const items = era === 'all' ? TIMELINE : TIMELINE.filter((t) => t.era === era)

  return (
    <section aria-label="제주 역사 연표">
      <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="시대">
        {ERAS.map((e) => (
          <Badge key={e.key} as="button" type="button" pill bg={e.key === era ? 'primary' : 'secondary'}
            className="border-0 fw-normal px-3 py-2" aria-pressed={e.key === era} onClick={() => setEra(e.key)}>
            {e.label}
          </Badge>
        ))}
      </div>

      <ol className="tl-list">
        {items.map((t) => (
          <li key={t.when + t.title} className={`tl-item tl-${t.era}`}>
            <div className="tl-when">{t.when}</div>
            <div className="tl-card">
              <h3 className="tl-title">{t.title}</h3>
              <p className="tl-text">{t.text}</p>
              <a className="tl-src small" href={t.source.url} target="_blank" rel="noopener noreferrer">
                <i className="bi bi-link-45deg me-1" />근거 · {t.source.label}
              </a>
            </div>
          </li>
        ))}
      </ol>

      <p className="small text-muted mt-3">
        직접 정리한 연표이며, 항목마다 근거 링크를 달았습니다. 날짜가 자료마다 다른 경우 연도나 달까지만 적었습니다.
        희생자 수 등 통계는 공식 기관의 최신 자료를 확인해 주세요.
      </p>
    </section>
  )
}
