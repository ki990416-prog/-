import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { ping } from '../api/client'
import { isSupabaseReady, supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'

// 푸터 한쪽의 작은 상태 표시 — 예전 홈의 "동작 체크"와 "Store(닉네임) 확인"을 눈에 덜 띄게 옮겼어요
// 점 색: 초록 = 정상, 빨강 = 문제, 회색 = 확인 중 / 점에 마우스를 올리면(또는 누르면) 자세한 내용이 나옵니다
const DOT = { ok: 'text-success', fail: 'text-danger', wait: 'text-secondary' }

export default function StatusBar() {
  const nickname = useAppStore((s) => s.nickname)
  const setNickname = useAppStore((s) => s.setNickname)
  const [db, setDb] = useState(isSupabaseReady
    ? { state: 'wait', msg: '확인 중...' }
    : { state: 'fail', msg: '.env.local 에 VITE_SUPABASE_URL / ANON_KEY 를 넣으세요' })
  const [api, setApi] = useState({ state: 'wait', msg: '확인 중...' })

  useEffect(() => {
    // ① Supabase 연결 확인
    if (isSupabaseReady) supabase.from('favorites').select('id').limit(1).then(({ error }) =>
      setDb(error ? { state: 'fail', msg: error.message } : { state: 'ok', msg: '연결 OK' }))

    // ② 서버 함수(/api) 확인
    ping()
      .then((d) => setApi({ state: 'ok', msg: `OK · 공공데이터 키 ${d.hasDataKey ? '있음' : '없음'} · Claude 키 ${d.hasClaudeKey ? '있음' : '없음'}` }))
      .catch(() => setApi({ state: 'fail', msg: 'npm run dev 가 아니라 vercel dev 로 실행했는지 확인' }))
  }, [])

  const checks = [
    { name: '화면', state: 'ok', msg: 'React · 라우터 정상' },
    { name: '저장소', ...db, label: 'Supabase' },
    { name: '서버', ...api, label: '서버 함수 /api' },
  ]

  return (
    <div className="d-flex flex-wrap align-items-center gap-3 small text-muted">
      <span className="d-flex align-items-center gap-1">
        <i className="bi bi-person" aria-hidden="true" />
        <Form.Control size="sm" aria-label="닉네임" placeholder="닉네임" value={nickname}
          onChange={(e) => setNickname(e.target.value)} style={{ width: 110, fontSize: '.8rem' }}
          title="즐겨찾기를 저장하고 불러올 때 쓰는 이름이에요. 입력하면 새로고침해도 남아 있습니다." />
      </span>
      <span className="d-flex align-items-center gap-2" aria-label="서비스 상태">
        {checks.map((c) => (
          <span key={c.name} title={`${c.label ?? c.name}: ${c.msg}`} className="d-flex align-items-center gap-1" tabIndex={0}>
            <i className={`bi bi-circle-fill ${DOT[c.state]}`} style={{ fontSize: '.5rem' }} aria-hidden="true" />
            <span>{c.name}</span>
            <span className="visually-hidden">{c.state === 'ok' ? '정상' : c.state === 'fail' ? '문제 있음' : '확인 중'}</span>
          </span>
        ))}
      </span>
    </div>
  )
}
