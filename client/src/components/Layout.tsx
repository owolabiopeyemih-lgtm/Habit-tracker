import { type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, BarChart2, Settings, Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/theme'
import { clsx } from '../lib/clsx'

const navItems = [
  { to: '/',         icon: LayoutDashboard, label: 'Today'    },
  { to: '/progress', icon: BarChart2,       label: 'Progress' },
  { to: '/settings', icon: Settings,        label: 'Settings' },
]

export function Layout({ children }: { children: ReactNode }) {
  const location        = useLocation()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ─── Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-40">
        <div className="bg-cream/90 backdrop-blur-xl border-b border-ink/[0.07]">
          <div className="max-w-xl mx-auto px-5 h-[60px] flex items-center justify-between">

            {/* Wordmark */}
            <div className="flex items-center gap-1">
              <span className="font-display text-[22px] font-bold tracking-[-0.02em] text-ink leading-none">
                Habit<span className="text-leaf-600 text-glow">yn</span>
              </span>
              <span className="w-[5px] h-[5px] rounded-full bg-leaf-600 shadow-neon-xs animate-dot-pulse mb-[3px] ml-0.5" />
            </div>

            {/* Right slot */}
            <div className="flex items-center gap-2.5">

              {/* ── Theme icon button ───────────────────── */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border border-ink/[0.10] bg-cream-dark hover:bg-cream text-ink-muted hover:text-ink transition-all duration-150 press flex-shrink-0"
              >
                {isDark
                  ? <Sun  size={15} strokeWidth={2} />
                  : <Moon size={15} strokeWidth={2} />
                }
              </button>

            </div>
          </div>
        </div>
        {/* Gradient fade under header */}
        <div className="h-4 bg-gradient-to-b from-cream to-transparent pointer-events-none" />
      </header>

      {/* ─── Page content ────────────────────────────── */}
      <main className="flex-1 max-w-xl mx-auto w-full px-5 pt-2 pb-36 animate-fade-in">
        {children}
      </main>

      {/* ─── Floating pill nav ───────────────────────── */}
      <div className="fixed bottom-5 inset-x-0 flex justify-center z-40 pointer-events-none px-5">
        <nav
          className="pointer-events-auto flex items-center gap-0.5 bg-cream-dark/98 backdrop-blur-2xl rounded-[22px] p-1.5 border border-ink/[0.08] shadow-lifted"
          style={{ minWidth: 230 }}
        >
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to)
            return (
              <NavLink key={to} to={to} end={to === '/'} className="flex-1">
                <div
                  className={clsx(
                    'relative flex items-center justify-center gap-1.5 px-4 py-[10px] rounded-[16px] text-[11px] font-bold transition-all duration-200 press-sm',
                    isActive
                      ? 'bg-leaf-600 text-void shadow-neon-xs'
                      : 'text-ink-muted hover:text-ink-soft',
                  )}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <span className="animate-fade-in whitespace-nowrap">{label}</span>
                  )}
                </div>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
