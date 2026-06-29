'use client'
import { useState, useEffect } from 'react'

function AdblockOverlay() {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const adEl = document.querySelector('.kakao_ad_area')
      if (!adEl || (adEl as HTMLElement).style.display === 'none') {
        setBlocked(true)
      }
    }, 500)
  }, [])

  const recheck = () => {
    window.location.reload()
  }

  if (!blocked) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.92)', zIndex: 99999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '40px 36px',
        maxWidth: 420, width: '90%', textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#111' }}>
          광고 차단이 감지되었습니다
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Ad Blocker Detected</p>
        <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8, marginBottom: 24 }}>
          이 서비스는 광고 수익으로 무료 운영됩니다.<br />
          광고 차단 프로그램을 해제한 후 이용해 주세요.<br /><br />
          <small>This service is free thanks to ads.<br />
          Please disable your ad blocker to continue.</small>
        </p>
        <button onClick={recheck} style={{
          background: '#111', color: '#fff', border: 'none',
          borderRadius: 8, padding: '12px 28px', fontSize: 14,
          cursor: 'pointer'
        }}>
          해제했어요 / I've disabled it
        </button>
      </div>
    </div>
  )
}

const TARGETS = ['상사', '클라이언트', '동료', '친구/후배']
const EXAMPLES = [
  '바쁘신 거 아는데 혹시 시간 되시면 봐주실 수 있을까요?',
  '제가 잘 몰라서 그런데 혹시 제 생각이 틀렸을까요?',
  '아 그렇군요, 맞아요 사실 저도 그렇게 생각했어요',
  '죄송한데 혹시 이건 좀 어렵지 않을까요 ㅠㅠ',
]

export default function Home() {
  const [text, setText] = useState('')
  const [target, setTarget] = useState('상사')
  const [level, setLevel] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ translation: string; tip: string } | null>(null)
  const [original, setOriginal] = useState('')

  const translate = async () => {
    if (!text.trim()) return
    setLoading(true)
    setOriginal(text)
    setResult(null)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target, level }),
        signal: AbortSignal.timeout(15000),
      })
      const data = await res.json()
      if (data.error) {
        setResult({ translation: data.error, tip: '' })
      } else {
        setResult(data)
      }
    } catch (e) {
      setResult({ translation: '번역 실패 ㅠ 다시 시도해봐', tip: '' })
    }
    setLoading(false)
  }

  return (
    <>
    <AdblockOverlay />
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">싫은소리못하는사람의마음의소리 🎃</h1>
          <p className="text-sm text-gray-400">쿠션어로 포장된 말 → 진짜 하고 싶었던 말로 번역</p>
        </div>

        <textarea
          className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-orange-300 bg-white mb-3"
          rows={4}
          placeholder="여기에 쿠션어 붙여넣기..."
          value={text}
          onChange={e => setText(e.target.value.slice(0, 500))}
        />
        <div className="text-right text-xs mb-2" style={{ color: text.length > 450 ? '#e24b4a' : '#9ca3af' }}>
          {text.length} / 500
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">예시 문장</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setText(ex)} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
                {ex.slice(0, 18)}…
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>순한맛 🌱</span>
            <span className="font-medium text-gray-700">{level}/5</span>
            <span>핵폭탄 💥</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full accent-orange-400" />
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-2">상대방</p>
          <div className="flex gap-2 flex-wrap">
            {TARGETS.map(t => (
              <button key={t} onClick={() => setTarget(t)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${target === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 px-3 py-2 rounded-lg bg-orange-50 border border-orange-100 text-xs text-orange-400">
          ⚠️ 해당 마음의 소리로 불필요한 감정싸움이 일어날 수 있으니 주의 바랍니다
        </div>

        <button onClick={translate} disabled={loading || !text.trim()} className="w-full py-3 rounded-xl bg-orange-400 hover:bg-orange-500 disabled:opacity-40 text-white font-medium transition-colors mb-6">
          {loading ? '번역 중...' : '🎃 단호박어로 번역'}
        </button>

        {(loading || result) && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 border-b border-gray-100">마음속 원본 공개</div>
            <div className="p-4 grid grid-cols-[1fr_20px_1fr] gap-3 items-start">
              <div>
                <p className="text-xs text-gray-400 mb-2">내가 한 말</p>
                <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{original}</div>
              </div>
              <div className="flex items-center justify-center pt-6 text-gray-300">→</div>
              <div>
                <p className="text-xs text-gray-400 mb-2">진짜 하고 싶었던 말 🎃</p>
                <div className="text-sm bg-orange-50 border border-orange-200 text-orange-900 rounded-xl p-3 leading-relaxed min-h-[70px]">
                  {loading ? <span className="text-orange-300">번역 중...</span> : result?.translation}
                </div>
              </div>
            </div>
            {result?.tip && <div className="px-4 pb-4 text-xs text-gray-400">💡 {result.tip}</div>}
          </div>
        )}

        {/* Adfit 광고 */}
<div className="mt-6 text-center" suppressHydrationWarning
  dangerouslySetInnerHTML={{
    __html: `<ins class="kakao_ad_area" style="display:none;width:100%;" data-ad-unit="DAN-PnCthXBLfPz3GaZm" data-ad-width="320" data-ad-height="100"></ins>`
  }}
/>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/photobrush_kor" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @photobrush_kor
            </a>
            <a href="/privacy" className="hover:text-gray-600 transition-colors">
              개인정보처리방침
            </a>
          </div>
          <a href="https://cushion-nu.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
            개떡같이 말해도 찰떡같이로 이동
          </a>
        </div>

      </div>
    </main>
    </>
  )
}
