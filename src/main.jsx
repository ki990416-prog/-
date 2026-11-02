import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// ── 디자인 ───────────────────────────────────────────────
// Bootstrap 5 + Bootswatch 'flatly'(밝은 바탕) 위에, theme.css 에서 동백(4·3의 상징꽃) 색으로 덧칠합니다.
// 테마 미리보기: https://bootswatch.com
import 'bootswatch/dist/flatly/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/theme.css'

import { router } from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
