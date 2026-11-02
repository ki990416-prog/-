import { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import { fetchWeather } from '../api/client'

const PLACES = ['제주시', '서귀포시']

// 앞으로 몇 시간의 예보로 "야외 유적지에 가도 될지" 한 줄로 알려줍니다
function advise(list) {
  const rain = list.some((w) => w.rain !== '없음')
  const maxPop = Math.max(...list.map((w) => w.pop))
  if (rain || maxPop >= 60) return { variant: 'warning', icon: 'cloud-rain', text: '비 예보가 있어요. 야외 유적지보다 실내 전시관(문화시설)을 먼저 둘러보세요.' }
  if (maxPop >= 30) return { variant: 'info', icon: 'umbrella', text: '구름이 많고 비 올 가능성이 조금 있어요. 우산을 챙기세요.' }
  return { variant: 'success', icon: 'sun', text: '야외 유적지를 걷기 좋은 날씨예요.' }
}

export default function WeatherNote() {
  const [data, setData] = useState(null)   // { 제주시: [...], 서귀포시: [...] }
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all(PLACES.map((p) => fetchWeather(p)))
      .then((lists) => setData(Object.fromEntries(PLACES.map((p, i) => [p, lists[i]]))))
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <Alert variant="secondary" className="small">날씨를 불러오지 못했어요: {error}</Alert>
  if (!data) return <div className="small text-muted mb-3"><Spinner size="sm" className="me-2" />날씨 확인 중...</div>

  const all = PLACES.flatMap((p) => data[p])
  const tip = advise(all)
  return (
    <Alert variant={tip.variant} className="small">
      <div className="fw-bold mb-1"><i className={`bi bi-${tip.icon} me-2`} />{tip.text}</div>
      {PLACES.map((p) => {
        const now = data[p][0]
        const maxPop = Math.max(...data[p].map((w) => w.pop))
        return <span key={p} className="me-3">{p} {now.temp}℃ {now.sky} · 앞으로 6시간 강수확률 최대 {maxPop}%</span>
      })}
    </Alert>
  )
}
