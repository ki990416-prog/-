import { useState } from 'react'

// 유튜브 영상 — 처음에는 썸네일만 보여주고, 누르면 영상을 불러옵니다 (페이지가 빠르고, 재생 전에는 유튜브로 정보가 가지 않아요)
export default function YouTubeEmbed({ id, title }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className="yt-facade" onClick={() => setPlaying(true)} aria-label={`${title} 재생`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="yt-play"><i className="bi bi-play-fill" /></span>
        </button>
      )}
    </div>
  )
}
