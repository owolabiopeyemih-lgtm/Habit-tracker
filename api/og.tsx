import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0F0F14',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Neon radial glow — right side */}
        <div
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0,
            width: '55%',
            background: 'radial-gradient(ellipse at 80% 50%, rgba(168,255,0,0.10) 0%, transparent 65%)',
          }}
        />

        {/* Vertical divider */}
        <div style={{
          position: 'absolute',
          left: 660, top: 60, bottom: 60,
          width: 1,
          background: 'rgba(255,255,255,0.06)',
        }} />

        {/* ── LEFT COLUMN ─────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '72px 64px', width: 660 }}>

          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
            <div style={{
              width: 52, height: 52,
              background: '#1C1C22',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* H letter via nested divs */}
              <div style={{ display: 'flex', position: 'relative', width: 26, height: 26 }}>
                <div style={{ position: 'absolute', left: 0,  top: 0, width: 7, height: 26, background: '#A8FF00', borderRadius: 2 }} />
                <div style={{ position: 'absolute', right: 0, top: 0, width: 7, height: 26, background: '#A8FF00', borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 0,  top: 10, width: 26, height: 6,  background: '#A8FF00', borderRadius: 2 }} />
              </div>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'rgba(240,240,238,0.9)', letterSpacing: '-0.5px' }}>
              Habityn
            </span>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#A8FF00', marginLeft: -4, marginBottom: 8 }} />
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontSize: 82, fontWeight: 900, color: '#F0F0EE', lineHeight: 1.0, letterSpacing: '-3px' }}>
              Build Better
            </span>
            <span style={{ fontSize: 82, fontWeight: 900, color: '#A8FF00', lineHeight: 1.0, letterSpacing: '-3px' }}>
              Habits.
            </span>
          </div>

          {/* Tagline */}
          <p style={{ fontSize: 20, color: 'rgba(240,240,238,0.45)', marginTop: 28, lineHeight: 1.5, letterSpacing: '-0.3px' }}>
            Track your daily routines with clarity and momentum
          </p>

          {/* Habit mockup pills */}
          <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 40 }}>
            {[
              { icon: '💧', label: 'Drink water',  done: true  },
              { icon: '📚', label: 'Read 20 pages', done: false },
              { icon: '🏃', label: 'Morning run',  done: false, accent: true },
            ].map((h) => (
              <div
                key={h.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 16px',
                  background: h.accent ? 'rgba(168,255,0,0.08)' : '#1C1C22',
                  borderRadius: 999,
                  border: h.accent ? '1px solid rgba(168,255,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: 16 }}>{h.icon}</span>
                <span style={{ fontSize: 13, fontFamily: 'system-ui', fontWeight: 600, color: h.accent ? '#A8FF00' : 'rgba(240,240,238,0.65)' }}>
                  {h.label}
                </span>
                {h.done && (
                  <div style={{ width: 20, height: 20, borderRadius: 999, background: '#A8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, color: '#0F0F14', fontWeight: 900 }}>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────── */}
        <div style={{
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: 540,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}>
          {/* Streak badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#1C1C22',
            borderRadius: 999,
            padding: '10px 20px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontFamily: 'system-ui', fontSize: 15, fontWeight: 700, color: '#F5A623' }}>
              14 day streak
            </span>
          </div>

          {/* Progress ring (SVG) */}
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute' }}>
              {/* Track */}
              <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
              {/* Arc — 72% of 603 ≈ 434 */}
              <circle
                cx="110" cy="110" r="96"
                fill="none"
                stroke="#A8FF00"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="434 169"
                transform="rotate(-90 110 110)"
              />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: '#F0F0EE', lineHeight: 1, letterSpacing: '-2px' }}>72%</span>
              <span style={{ fontFamily: 'system-ui', fontSize: 13, color: 'rgba(240,240,238,0.4)', letterSpacing: '1px', marginTop: 4 }}>
                TODAY'S GOAL
              </span>
            </div>
          </div>

          {/* Stats card */}
          <div style={{
            display: 'flex',
            background: '#1C1C22',
            borderRadius: 18,
            padding: '18px 0',
            width: 300,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[
              { value: '8',   label: 'HABITS',    accent: false },
              { value: '5/7', label: 'THIS WEEK', accent: true  },
              { value: '21d', label: 'BEST',      accent: false },
            ].map((s, i) => (
              <div key={s.label} style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: s.accent ? '#A8FF00' : '#F0F0EE', letterSpacing: '-1px' }}>
                  {s.value}
                </span>
                <span style={{ fontFamily: 'system-ui', fontSize: 9, color: 'rgba(240,240,238,0.35)', letterSpacing: '1px', marginTop: 4 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    ),
    { width: 1200, height: 630 }
  )
}
