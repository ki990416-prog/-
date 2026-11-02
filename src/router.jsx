import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Places from './pages/Places'
import Heritage from './pages/Heritage'
import History from './pages/History'
import Agent from './pages/Agent'
import My from './pages/My'
import About from './pages/About'
import NotFound from './pages/NotFound'

// ── 메뉴 목록 ────────────────────────────────────────────
// 페이지를 추가할 때: ① pages/에 파일 만들기 ② 아래 NAV_ITEMS 에 한 줄 추가 ③ routes 에 한 줄 추가
// 아이콘 이름: https://icons.getbootstrap.com
// ※ Places/Heritage 는 샘플 이름입니다. 자신의 주제에 맞게 바꾸세요.
export const NAV_ITEMS = [
  { to: '/', label: '홈', icon: 'house' },
  { to: '/places', label: '기억의 장소', icon: 'geo-alt' },
  { to: '/history', label: '역사 자료', icon: 'journal-text' },
  { to: '/agent', label: 'AI 해설사', icon: 'robot' },
  { to: '/my', label: '내 기록', icon: 'bookmark-heart' },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,      // 모든 페이지에 공통으로 보이는 틀(메뉴·푸터)
    errorElement: <NotFound />,   // 없는 주소로 들어오면
    children: [
      { index: true, element: <Home /> },
      { path: 'places', element: <Places /> },
      { path: 'history', element: <History /> },
      { path: 'heritage', element: <Heritage /> },   // 국가유산청 (메뉴에는 없음 — 4번째 API 후보)
      { path: 'agent', element: <Agent /> },
      { path: 'my', element: <My /> },
      { path: 'about', element: <About /> },   // 서비스 소개 (메뉴에는 없고 푸터·홈에서 연결)
    ],
  },
])
