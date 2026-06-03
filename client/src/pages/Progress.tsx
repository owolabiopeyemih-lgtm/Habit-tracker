import { useState } from 'react'
import { TrendingUp, Calendar, Target, CheckSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useProgress } from '../hooks/useProgress'
import { useHabits } from '../hooks/useHabits'
import { WeeklyChart } from '../components/progress/WeeklyChart'
import { StatCard } from '../components/progress/StatCard'
import { clsx } from '../lib/clsx'

type Period = 'week' | 'month'

/* ── Skeletons ──────────────────────────────────────────────── */
function SkeletonRect({ h = 'h-28', rounded = 'rounded-2xl' }: { h?: string; rounded?: string }) {
  return <div className={`${h} ${rounded} bg-cream-dark border border-white/5 skeleton`} />
}

/* ── Streak motivation copy ─────────────────────────────────── */
function streakCopy(n: number) {
  if (n === 0)  return 'Start a streak today'
  if (n === 1)  return 'Day one — let\'s go!'
  if (n < 4)   return 'Building momentum'
  if (n < 7)   return 'Almost a week!'
  if (n < 14)  return 'One week strong'
  if (n < 30)  return 'Two weeks of discipline'
  if (n < 60)  return 'Monthly milestone 🏆'
  return 'Legendary consistency 🔥'
}

/* ── Main page ──────────────────────────────────────────────── */
export function Progress() {
  const [period, setPeriod]               = useState<Period>('week')
  const [selectedHabit, setSelectedHabit] = useState<string | undefined>()

  const { data: stats, isLoading } = useProgress(period, selectedHabit)
  const { data: habits = [] }      = useHabits()

  const active = habits.filter((h) => h.status === 'active')

  /* Derived chart header info */
  const dateRange = stats?.daily.length
    ? `${format(parseISO(stats.daily[0].date), 'MMM d')} – ${format(parseISO(stats.daily[stats.daily.length - 1].date), 'MMM d')}`
    : ''

  const totalCheckIns  = stats?.daily.reduce((s, d) => s + d.completed, 0) ?? 0
  const completionRate = period === 'week' ? (stats?.weeklyRate ?? 0) : (stats?.monthlyRate ?? 0)
  const last7          = stats?.daily.slice(-7) ?? []

  return (
    <>
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-7">
        <p className="text-[10px] font-bold text-ink-faint uppercase tracking-[0.2em] mb-2">
          Overview
        </p>
        <h1 className="font-display text-[2.75rem] font-bold text-ink leading-[1.0] tracking-[-0.02em]">
          Progress<span className="text-leaf-600 text-glow">.</span>
        </h1>
        <p className="text-[13px] text-ink-muted mt-1.5">Your consistency at a glance</p>
      </div>

      {/* ── Period toggle ────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-void border border-ink/[0.08] p-1 rounded-2xl">
          {(['week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                'px-5 py-2 rounded-[14px] text-[12px] font-bold transition-all duration-200 press-sm',
                period === p
                  ? 'bg-leaf-600 text-void shadow-neon-xs'
                  : 'text-ink-muted hover:text-ink-soft',
              )}
            >
              {p === 'week' ? 'This week' : 'This month'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Habit filter chips ───────────────────────── */}
      {active.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          <button
            onClick={() => setSelectedHabit(undefined)}
            className={clsx(
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 press-sm',
              !selectedHabit
                ? 'bg-leaf-600 text-void border-transparent shadow-neon-xs'
                : 'bg-cream-dark border-ink/[0.09] text-ink-muted hover:border-ink/20',
            )}
          >
            All habits
          </button>
          {active.map((h) => (
            <button
              key={h._id}
              onClick={() => setSelectedHabit(h._id)}
              className={clsx(
                'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 press-sm',
                selectedHabit === h._id
                  ? 'text-void border-transparent'
                  : 'bg-cream-dark border-ink/[0.09] text-ink-muted hover:border-ink/20',
              )}
              style={
                selectedHabit === h._id
                  ? { backgroundColor: h.color, boxShadow: `0 0 10px ${h.color}55` }
                  : undefined
              }
            >
              {h.icon} {h.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading ──────────────────────────────────── */}
      {isLoading && (
        <div className="space-y-3 animate-fade-in">
          <SkeletonRect h="h-36" rounded="rounded-3xl" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonRect /><SkeletonRect />
            <SkeletonRect /><SkeletonRect />
          </div>
          <SkeletonRect h="h-56" rounded="rounded-3xl" />
        </div>
      )}

      {/* ── Empty state ──────────────────────────────── */}
      {!isLoading && (!stats || active.length === 0) && (
        <div className="flex flex-col items-center text-center pt-10 pb-6 animate-fade-in">
          {/* Decorative partial ring */}
          <div className="relative w-28 h-28 mx-auto mb-7">
            <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
              <circle cx="56" cy="56" r="46" fill="none"
                stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
              <circle cx="56" cy="56" r="46" fill="none"
                stroke="#A8FF00" strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46 * 0.22} ${2 * Math.PI * 46 * 0.78}`}
                style={{ opacity: 0.35, filter: 'drop-shadow(0 0 6px rgba(168,255,0,0.4))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[36px]">
              📊
            </div>
          </div>

          <h3 className="font-display text-[22px] font-bold text-ink mb-2 tracking-tight">
            No data yet
          </h3>
          <p className="text-[13px] text-ink-muted leading-relaxed max-w-[260px]">
            Create habits and check in daily — your progress charts will appear here.
          </p>

          {/* Ghost preview cards */}
          <div className="w-full mt-8 grid grid-cols-2 gap-3 pointer-events-none select-none opacity-30">
            {['🔥 Streak', '📈 Rate', '📅 Days', '✅ Check-ins'].map((label) => (
              <div key={label} className="bg-cream-dark rounded-2xl border border-white/5 p-4 h-24">
                <div className="h-2 skeleton rounded-full w-6 mb-3" />
                <div className="h-6 skeleton rounded-lg w-12 mb-1.5" />
                <div className="h-1.5 skeleton rounded-full w-16" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Data ─────────────────────────────────────── */}
      {!isLoading && stats && active.length > 0 && (
        <div className="space-y-4 animate-fade-in">

          {/* ── Streak hero card ─────────────────────── */}
          <div className="relative overflow-hidden bg-cream-dark rounded-3xl border border-ink/[0.08] px-6 py-5 shadow-card">
            {/* Neon glow backdrop */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: stats.currentStreak > 0
                  ? 'radial-gradient(ellipse at 10% 50%, rgba(var(--color-amber),0.08) 0%, transparent 60%)'
                  : 'none',
              }}
            />

            <div className="relative flex items-center gap-5">
              {/* Streak number */}
              <div className="flex-shrink-0">
                <div className="flex items-end gap-2 leading-none mb-1">
                  <span className="font-display text-[3.5rem] font-black text-ink tracking-tight tabular-nums">
                    {stats.currentStreak}
                  </span>
                  {stats.currentStreak > 0 && (
                    <span className="text-3xl mb-1 animate-flame-pulse">🔥</span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-ink-muted uppercase tracking-[0.12em]">
                  day streak
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: stats.currentStreak > 0 ? '#F5A623' : '#3A3A42' }}>
                  {streakCopy(stats.currentStreak)}
                </p>
              </div>

              <div className="flex-1" />

              {/* Last 7 days mini-calendar */}
              {last7.length > 0 && (
                <div className="flex-shrink-0">
                  <p className="text-[9px] font-bold text-ink-faint uppercase tracking-[0.12em] text-right mb-2">
                    Last {last7.length} days
                  </p>
                  <div className="flex gap-1.5">
                    {last7.map((day, i) => {
                      const isPerfect = day.total > 0 && day.completed === day.total
                      const isPartial = day.completed > 0 && !isPerfect
                      const isMissed  = day.total > 0 && day.completed === 0
                      return (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          <div
                            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[10px] font-black transition-all duration-200"
                            style={
                              isPerfect
                                ? { backgroundColor: 'var(--accent)', color: 'rgb(var(--color-void))', boxShadow: 'var(--shadow-neon-xs)' }
                                : isPartial
                                  ? { backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }
                                  : isMissed
                                    ? { backgroundColor: 'rgba(255,77,109,0.1)', color: '#FF4D6D' }
                                    : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#3A3A42' }
                            }
                          >
                            {isPerfect ? '✓' : isPartial ? '~' : isMissed ? '·' : '·'}
                          </div>
                          <span className="text-[8px] font-bold text-ink-faint">
                            {format(parseISO(day.date), 'EEEEE')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Best streak compare — only show if not currently at best */}
            {stats.longestStreak > 0 && stats.currentStreak < stats.longestStreak && (
              <div className="relative mt-4 pt-4 border-t border-ink/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-ink-faint">Personal best</span>
                <span className="text-[11px] font-bold text-ink-muted">
                  {stats.longestStreak}d
                  <span className="text-ink-faint font-normal ml-1">
                    ({stats.longestStreak - stats.currentStreak}d to beat it)
                  </span>
                </span>
              </div>
            )}
            {stats.currentStreak > 0 && stats.currentStreak >= stats.longestStreak && (
              <div className="relative mt-4 pt-4 border-t border-ink/[0.06] flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-leaf-600 flex items-center justify-center shadow-neon-xs flex-shrink-0">
                  <svg viewBox="0 0 8 6" className="w-2 h-2">
                    <path d="M0.5 3l2 2L7.5 0.5" stroke="#08080E" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <span className="text-[11px] text-leaf-600 font-bold">New personal best!</span>
              </div>
            )}
          </div>

          {/* ── Stat cards 2×2 ───────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Longest streak"
              value={`${stats.longestStreak}d`}
              icon={<TrendingUp size={15} />}
              accent="#A8FF00"
              accentBg="#0F2812"
              compare={stats.longestStreak > 0 ? 'Personal best' : undefined}
            />
            <StatCard
              label={period === 'week' ? 'Weekly rate' : 'Monthly rate'}
              value={`${completionRate}%`}
              icon={<Target size={15} />}
              accent="#818CF8"
              accentBg="#1A1830"
              sub={completionRate >= 80 ? 'Excellent!' : completionRate >= 50 ? 'Keep going' : 'Room to grow'}
            />
            <StatCard
              label="Active days"
              value={stats.daily.filter((d) => d.completed > 0).length}
              sub={`of ${stats.daily.length} days`}
              icon={<Calendar size={15} />}
              accent="#F472B6"
              accentBg="#2D0A1F"
            />
            <StatCard
              label="Check-ins"
              value={totalCheckIns}
              sub={period === 'week' ? 'this week' : 'this month'}
              icon={<CheckSquare size={15} />}
              accent="#06B6D4"
              accentBg="#0A2028"
            />
          </div>

          {/* ── Daily chart ──────────────────────────── */}
          <div className="bg-cream-dark rounded-3xl border border-ink/[0.08] p-5 shadow-card">
            {/* Card header */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[16px] font-bold text-ink">Daily completions</h3>
                {dateRange && (
                  <p className="text-[11px] text-ink-faint mt-0.5">{dateRange}</p>
                )}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 mt-1">
                {[
                  { color: '#2A2A30', label: 'Missed'    },
                  { color: '#55BB00', label: 'Partial'   },
                  { color: '#A8FF00', label: 'Perfect'   },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1 text-[9px] font-semibold text-ink-faint">
                    <span
                      className="w-2 h-2 rounded-[3px] inline-block flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <WeeklyChart data={stats.daily} />
          </div>

          {/* ── Habit breakdown ──────────────────────── */}
          {!selectedHabit && active.length > 1 && (
            <div className="bg-cream-dark rounded-3xl border border-ink/[0.08] p-5 shadow-card">
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="font-display text-[16px] font-bold text-ink">Habit breakdown</h3>
                <span className="text-[10px] font-bold text-ink-faint uppercase tracking-wide">
                  {period === 'week' ? 'This week' : 'This month'}
                </span>
              </div>

              <div className="space-y-4">
                {active
                  .slice()
                  .sort((a, b) => b.completionRate - a.completionRate)
                  .map((h, i) => {
                    const isPerfect = h.completionRate === 100
                    return (
                      <div
                        key={h._id}
                        className="flex items-center gap-3 animate-fade-up"
                        style={{ animationDelay: `${i * 55}ms`, animationFillMode: 'both' }}
                      >
                        {/* Rank */}
                        <span className="text-[10px] font-black text-ink-faint w-4 text-right flex-shrink-0 tabular-nums">
                          {i + 1}
                        </span>

                        {/* Icon */}
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                          style={{ backgroundColor: h.color + '22' }}
                        >
                          {h.icon}
                        </div>

                        {/* Name + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-1.5">
                            <span className="text-[12px] font-semibold text-ink truncate">
                              {h.name}
                            </span>
                            <span
                              className="text-[11px] font-black tabular-nums flex-shrink-0"
                              style={{ color: h.color }}
                            >
                              {h.completionRate}%
                            </span>
                          </div>
                          <div className="h-[5px] bg-void rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${h.completionRate}%`,
                                backgroundColor: h.color,
                                boxShadow: isPerfect ? `0 0 8px ${h.color}80` : `0 0 4px ${h.color}50`,
                                transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                                transitionDelay: `${i * 70}ms`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Perfect badge */}
                        {isPerfect && (
                          <div
                            className="flex-shrink-0 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-void"
                            style={{ backgroundColor: h.color, boxShadow: `0 0 8px ${h.color}60` }}
                          >
                            PERFECT
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>

              {/* Footer — overall rate */}
              <div className="mt-5 pt-4 border-t border-ink/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-ink-faint">Overall</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1 bg-void rounded-full overflow-hidden">
                    <div
                      className="h-full bg-leaf-600 rounded-full"
                      style={{
                        width: `${completionRate}%`,
                        boxShadow: 'var(--shadow-neon-xs)',
                        transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-black text-leaf-600 tabular-nums">
                    {completionRate}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
