import { useState } from 'react'
import { Plus, Flame, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { useHabits } from '../hooks/useHabits'
import { HabitCard } from '../components/habits/HabitCard'
import { CategoryFilter } from '../components/habits/CategoryFilter'
import { HabitForm } from '../components/habits/HabitForm'
import { Modal } from '../components/ui/Modal'
import { SuccessModal, type CreatedHabitInfo } from '../components/ui/SuccessModal'
import { Button } from '../components/ui/Button'
import type { HabitCategory, HabitWithStreak } from '../types'

function greeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Night owl'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* Shimmer skeleton matching HabitCard shape exactly */
function HabitSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex items-center gap-3.5 px-4 py-3.5 pl-5 rounded-2xl bg-cream-dark border border-ink/[0.07]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 rounded-full skeleton" style={{ width: '55%' }} />
        <div className="h-2.5 rounded-full skeleton" style={{ width: '28%' }} />
      </div>
      <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
    </div>
  )
}

/* Ghost mockup cards for empty state */
const MOCK_HABITS = [
  { icon: '💧', name: 'Drink 8 glasses of water', color: '#38BDF8', streak: 14, cat: 'Health'   },
  { icon: '📚', name: 'Read 20 pages',             color: '#A78BFA', streak: 7,  cat: 'Learning' },
  { icon: '🏃', name: 'Morning run',               color: '#F87171', streak: 3,  cat: 'Fitness'  },
]

/* Section divider label */
function SectionLabel({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-ink-faint">{icon}</span>
      <span className="text-[10px] font-black text-ink-faint uppercase tracking-[0.18em]">{label}</span>
      <span className="text-[10px] font-black text-ink-faint">·</span>
      <span className="text-[10px] font-black tabular-nums" style={{ color: 'var(--accent)' }}>{count}</span>
      <div className="flex-1 h-px bg-ink/[0.06]" />
    </div>
  )
}

export function Dashboard() {
  const { data: habits = [], isLoading } = useHabits()
  const [category, setCategory]         = useState<HabitCategory | 'all'>('all')
  const [createOpen, setCreateOpen]     = useState(false)
  const [editHabit, setEditHabit]       = useState<HabitWithStreak | null>(null)
  const [successHabit, setSuccessHabit] = useState<CreatedHabitInfo | null>(null)

  const active   = habits.filter((h) => h.status === 'active')
  const filtered = category === 'all' ? active : active.filter((h) => h.category === category)
  const completed = filtered.filter((h) => h.completedToday).length
  const allDone   = filtered.length > 0 && completed === filtered.length
  const pct       = active.length > 0
    ? Math.round((active.filter((h) => h.completedToday).length / active.length) * 100)
    : 0

  const topStreak = active.length > 0
    ? Math.max(...active.map((h) => h.streak))
    : 0

  const counts = active.reduce<Partial<Record<HabitCategory | 'all', number>>>((acc, h) => {
    acc['all'] = (acc['all'] ?? 0) + 1
    acc[h.category] = (acc[h.category] ?? 0) + 1
    return acc
  }, {})

  const pending = filtered.filter((h) => !h.completedToday)
  const done    = filtered.filter((h) =>  h.completedToday)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="mb-7">
        {/* Date + streak row */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-cream-dark border border-ink/[0.08] rounded-full px-3 py-1.5">
            <span className="w-[5px] h-[5px] rounded-full bg-leaf-600 animate-dot-pulse flex-shrink-0" />
            <span className="text-[10.5px] font-bold text-ink-muted uppercase tracking-[0.14em]">
              {format(new Date(), 'EEE, MMM d')}
            </span>
          </div>

          {/* Streak badge — visible when any habit has a streak */}
          {topStreak >= 2 && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 animate-fade-in"
              style={{
                backgroundColor: 'rgba(245,166,35,0.12)',
                border: '1px solid rgba(245,166,35,0.25)',
              }}
            >
              <Flame size={11} className="text-amber animate-flame-pulse" />
              <span className="text-[10.5px] font-black text-amber tabular-nums">{topStreak}d streak</span>
            </div>
          )}
        </div>

        {/* Greeting */}
        <h1 className="font-display text-[2.6rem] font-bold text-ink leading-[1.0] tracking-[-0.025em] mb-2">
          {allDone ? (
            <>All done<span className="text-leaf-600 text-glow">!</span></>
          ) : (
            <>{greeting()}<span className="text-leaf-600 text-glow">.</span></>
          )}
        </h1>

        {active.length > 0 && (
          <p className="text-[14px] text-ink-muted">
            <span className="font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{completed}</span>
            <span className="mx-1 opacity-40">/</span>
            <span>{active.length} habits complete today</span>
          </p>
        )}
      </div>

      {/* ── Progress card ────────────────────────────── */}
      {active.length > 0 && (
        <div className="mb-6 relative overflow-hidden bg-cream-dark rounded-3xl p-5 border border-ink/[0.07] shadow-card">
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, var(--accent-dim) 0%, transparent 60%)' }}
          />

          <div className="relative flex items-center gap-5">
            {/* Progress ring */}
            <div className="flex-shrink-0 relative w-[84px] h-[84px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="34" fill="none" stroke="rgb(var(--color-cream))" strokeWidth="7" />
                <circle
                  cx="42" cy="42" r="34" fill="none" strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                  style={{
                    stroke: 'var(--accent)',
                    transition: 'stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)',
                    filter: pct > 0 ? 'var(--glow-filter)' : 'none',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display text-[20px] font-black leading-none tabular-nums ${pct > 0 ? 'text-leaf-600' : 'text-ink-muted'}`}>
                  {pct}<span className="text-[12px] font-bold">%</span>
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display text-[16px] font-bold text-ink mb-0.5">Today's goal</p>
              <p className="text-[12.5px] text-ink-muted leading-snug mb-3">
                {active.filter(h => !h.completedToday).length > 0
                  ? `${active.filter(h => !h.completedToday).length} habit${active.filter(h => !h.completedToday).length > 1 ? 's' : ''} left`
                  : 'Perfect day — all done! 🎉'}
              </p>

              {/* Per-habit completion dots */}
              <div className="flex gap-1.5 flex-wrap">
                {active.map((h) => (
                  <div
                    key={h._id}
                    title={h.name}
                    className="h-1.5 rounded-full transition-all duration-500 flex-shrink-0"
                    style={{
                      width: 22,
                      backgroundColor: h.completedToday ? h.color : 'rgb(var(--color-cream))',
                      boxShadow: h.completedToday ? `0 0 5px ${h.color}70` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Divider + quick stats */}
          <div className="relative mt-4 pt-3.5 border-t border-ink/[0.06] grid grid-cols-3 gap-0">
            {[
              { label: 'Completed', value: active.filter(h => h.completedToday).length },
              { label: 'Remaining', value: active.filter(h => !h.completedToday).length },
              { label: 'Top streak', value: topStreak > 0 ? `${topStreak}d` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="font-display text-[18px] font-black text-ink tabular-nums leading-none">{value}</p>
                <p className="text-[9px] text-ink-faint uppercase tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Category filter ───────────────────────────── */}
      {active.length > 1 && (
        <div className="mb-5">
          <CategoryFilter selected={category} onChange={setCategory} counts={counts} />
        </div>
      )}

      {/* ── Habit list ────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-2.5">
          <HabitSkeleton delay={0} />
          <HabitSkeleton delay={60} />
          <HabitSkeleton delay={120} />
        </div>
      ) : active.length === 0 ? (
        /* ── Empty state ──────────────────────────────── */
        <div className="flex flex-col items-center pt-2 pb-10 text-center">
          {/* Ghost mockup cards */}
          <div className="w-full mb-8 space-y-2.5 select-none pointer-events-none" aria-hidden>
            {MOCK_HABITS.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-3.5 px-4 py-3.5 pl-5 rounded-2xl bg-cream-dark border border-ink/[0.07] animate-fade-up"
                style={{ opacity: 0.30 - i * 0.07, animationDelay: `${i * 70}ms` }}
              >
                {/* Left accent */}
                <div className="absolute left-0 w-[3px] h-6 rounded-r-full" style={{ backgroundColor: m.color }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: m.color + '18' }}>
                  {m.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-semibold text-ink">{m.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ color: m.color, backgroundColor: m.color + '18' }}>{m.cat}</span>
                    <span className="text-[10px] text-amber font-bold">🔥 {m.streak}d</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl border border-ink/[0.08] flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="w-[68px] h-[68px] rounded-3xl flex items-center justify-center mb-5 text-[30px] animate-float border border-ink/[0.07]"
            style={{ background: 'radial-gradient(circle at center, var(--accent-dim), transparent 70%)' }}
          >
            🌱
          </div>
          <h3 className="font-display text-[22px] font-bold text-ink mb-2 tracking-[-0.01em]">
            Start your journey
          </h3>
          <p className="text-[13px] text-ink-muted mb-7 max-w-[240px] leading-relaxed">
            Every great routine starts with a single habit. Add yours and build momentum.
          </p>
          <Button size="lg" onClick={() => setCreateOpen(true)} className="press gap-2">
            <Plus size={16} strokeWidth={2.5} />
            Create first habit
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center gap-2">
          <Zap size={20} className="text-ink-faint mb-1" />
          <p className="text-[13px] font-semibold text-ink-muted">No habits in this category</p>
          <p className="text-[12px] text-ink-faint">Try selecting a different filter above</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <SectionLabel
                icon={<span className="text-[12px]">○</span>}
                label="Remaining"
                count={pending.length}
              />
              <div className="space-y-2.5">
                {pending.map((habit, i) => (
                  <HabitCard key={habit._id} habit={habit} onEdit={setEditHabit} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {done.length > 0 && (
            <div>
              <SectionLabel
                icon={<span className="text-[11px]" style={{ color: 'var(--accent)' }}>✓</span>}
                label="Done"
                count={done.length}
              />
              <div className="space-y-2.5">
                {done.map((habit, i) => (
                  <HabitCard key={habit._id} habit={habit} onEdit={setEditHabit} index={i + pending.length} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FAB ──────────────────────────────────────── */}
      {active.length > 0 && (
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Add habit"
          className="fixed bottom-24 right-5 z-30 w-14 h-14 bg-leaf-600 text-void rounded-2xl shadow-neon flex items-center justify-center hover:bg-leaf-700 press transition-colors duration-150"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New habit">
        <HabitForm
          onClose={() => setCreateOpen(false)}
          onCreated={(payload) => { setCreateOpen(false); setSuccessHabit(payload) }}
        />
      </Modal>
      <Modal open={!!editHabit} onClose={() => setEditHabit(null)} title="Edit habit">
        {editHabit && <HabitForm habit={editHabit} onClose={() => setEditHabit(null)} />}
      </Modal>
      <SuccessModal open={!!successHabit} habit={successHabit} onClose={() => setSuccessHabit(null)} />
    </>
  )
}
