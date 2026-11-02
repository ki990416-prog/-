import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/map.css'

const JEJU = [33.38, 126.55]

// 기본 파란 핀 이미지는 번들러에서 경로가 깨지기 쉬워, CSS 로 그린 동백색 핀을 씁니다
const pinIcon = L.divIcon({ className: 'map-pin', html: '<i class="bi bi-geo-alt-fill"></i>', iconSize: [30, 36], iconAnchor: [15, 34], popupAnchor: [0, -30] })

// 좌표가 제주 범위 안인 것만 핀으로 (TourAPI 는 좌표를 문자열로 줍니다)
export const hasCoord = (p) => {
  const lat = Number(p.lat), lng = Number(p.lng)
  return lat > 33 && lat < 34 && lng > 126 && lng < 127
}

// 검색 결과가 바뀌면 핀이 모두 보이게 지도를 맞추고, 카드를 눌러 고른 장소(focusId)는 가운데로 보여 줍니다
function Fit({ places, focusId, markers }) {
  const map = useMap()
  useEffect(() => {
    // ※ effect 안에서 `return map.setView(...)` 처럼 값을 돌려주면 React 가 오류를 내므로 return 하지 않습니다
    if (places.length === 0) map.setView(JEJU, 9)
    else if (places.length === 1) map.setView([Number(places[0].lat), Number(places[0].lng)], 13)
    else map.fitBounds(places.map((p) => [Number(p.lat), Number(p.lng)]), { padding: [40, 40], maxZoom: 13 })
  }, [places, map])
  useEffect(() => {
    const m = markers.current[focusId]
    if (!m) return
    map.setView(m.getLatLng(), Math.max(map.getZoom(), 13), { animate: true })
    m.openPopup()
  }, [focusId, map, markers])
  return null
}

// places: [{ id, title, addr, lat, lng }] / onSave(place) / focusId: 카드에서 고른 장소 id
export default function PlacesMap({ places, onSave, focusId }) {
  const markers = useRef({})
  const pins = useMemo(() => places.filter(hasCoord), [places])   // 새 배열이 매번 생기면 지도가 계속 다시 맞춰져요

  return (
    <div className="places-map rounded-3 overflow-hidden mb-4" role="region" aria-label="장소 지도">
      <MapContainer center={JEJU} zoom={9} scrollWheelZoom={false} className="places-map-inner">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> 기여자'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pins.map((p) => (
          <Marker key={p.id} position={[Number(p.lat), Number(p.lng)]} icon={pinIcon} title={p.title}
            ref={(m) => { if (m) markers.current[p.id] = m; else delete markers.current[p.id] }}>
            <Popup>
              <div className="fw-bold mb-1">{p.title}</div>
              {p.addr && <div className="small text-muted mb-2">{p.addr}</div>}
              <button type="button" className="btn btn-sm btn-primary" onClick={() => onSave(p)}>
                <i className="bi bi-star me-1" />즐겨찾기
              </button>
            </Popup>
          </Marker>
        ))}
        <Fit places={pins} focusId={focusId} markers={markers} />
      </MapContainer>
      <div className="small text-muted px-2 py-1 map-note">
        핀 {pins.length}개 · 핀을 누르면 장소 정보가 나옵니다. 지도 위치는 한국관광공사 좌표 기준이며 실제와 조금 다를 수 있어요.
      </div>
    </div>
  )
}
