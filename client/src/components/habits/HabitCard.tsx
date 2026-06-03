import { useState } from 'react'
import { Check, Flame, MoreVertical, Pencil, Archive, Trash2, Bell, BellOff } from 'lucide-react'
import type { HabitWithStreak } from '../../types'
import { CATEGORY_META } from '../../lib/constants'
import { useToggleCheckin } from '../../hooks/useCheckins'
import { useUpdateHabit, useDeleteHabit } from '../../hooks/useHabits'
import { clsx } from '../../lib/clsx'

interface Props {
  habit: HabitWithStreak
  onEdit: (habit: HabitWithStreak) => void
  index?: number
}

export function HabitCard({ habit, onEdit, index = 0 }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [popping, setPopping]   = useState(false)
  const toggleCheckin            = useToggleCheckin()
  const updateHabit              = useUpdateHabit()
  const deleteHabit              = useDeleteHabit()

  const meta        = CATEGORY_META[habit.category]
  const isCompleted = habit.completedToday

  const handleToggle = () => {
    if (toggleCheckin.isPending) return
    setPopping(true)
    setTimeout(() => setPopping(false), 420)
    toggleCheckin.mutate({ habitId: habit._id, completed: isCompleted })
    if ('vibrate' in navigator) navigator.vibrate(isCompleted ? 10 : [10, 40, 15])
  }

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 55}ms`, animationFillMode: 'both' }}
    >
      <div className={clsx(
        'group relative flex items-center gap-3.5 px-4 py-3.5 pl-5 rounded-2xl border transition-all duration-200',
        isCompleted
          ? 'bg-leaf-50 border-leaf-200/50'
          : 'bg-cream-dark border-ink/[0.07] shadow-card hover:-translate-y-0.5 hover:shadow-lifted hover:border-ink/[0.12]',
      )}>

        {/* Left accent bar — theme-aware */}
        <div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full transition-all duration-300"
          style={{
            backgroundColor: isCompleted ? 'var(--accent)' : habit.color,
            opacity: isCompleted ? 1 : 0.6,
            boxShadow: isCompleted ? 'var(--shadow-neon-xs)' : `0 0 5px ${habit.color}50`,
          }}
        />

        {/* Icon badge */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[18px] transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: habit.color + '18', color: habit.color }}
        >
          {habit.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={clsx(
            'font-semibold text-[13.5px] leading-snug truncate',
            isCompleted ? 'text-leaf-700 line-through decoration-leaf-600/50 decoration-1' : 'text-ink',
          )}>
            {habit.name}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Category badge — always uses the category's own color */}
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                color: meta.color,
                backgroundColor: meta.color + '18',
              }}
            >
              {meta.label}
            </span>

            {/* Streak */}
            {habit.streak > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber">
                <Flame size={10} className={habit.streak >= 7 ? 'animate-flame-pulse' : ''} />
                {habit.streak}d
              </span>
            )}
          </div>
        </div>

        {/* Weekly rate — desktop only */}
        <div className="hidden sm:flex flex-col items-end flex-shrink-0 gap-0.5 mr-1">
          <span className="text-[11px] font-bold text-ink-soft tabular-nums">{habit.completionRate}%</span>
          <span className="text-[9px] text-ink-faint uppercase tracking-wide">this week</span>
        </div>

        {/* Check button */}
        <button
          onClick={handleToggle}
          disabled={toggleCheckin.isPending}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={clsx(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ripple',
            'transition-all duration-150 disabled:opacity-50',
            popping ? 'animate-check-pop' : '',
            isCompleted
              ? 'bg-leaf-600 text-void shadow-neon-xs'
              : 'bg-cream border border-ink/[0.12] hover:border-leaf-600/60 hover:bg-leaf-50',
          )}
        >
          {isCompleted
            ? <Check size={16} strokeWidth={3} />
            : <span className="w-2.5 h-2.5 rounded-full border-[1.5px] border-ink-faint/60 group-hover:border-leaf-500 transition-colors duration-150" />
          }
        </button>

        {/* ⋮ Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More options"
            className="p-1.5 -mr-1 rounded-lg text-ink-faint hover:text-ink-soft hover:bg-ink/[0.05] transition-colors duration-150"
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-48 bg-cream-dark rounded-2xl border border-ink/[0.08] shadow-lifted py-1 animate-modal-in">
                {[
                  { icon: <Pencil size={13} />,  label: 'Edit habit', action: () => { onEdit(habit); setMenuOpen(false) } },
                  {
                    icon: habit.reminderEnabled ? <BellOff size={13} /> : <Bell size={13} />,
                    label: habit.reminderEnabled ? 'Mute reminder' : 'Set reminder',
                    action: () => { updateHabit.mutate({ id: habit._id, reminderEnabled: !habit.reminderEnabled }); setMenuOpen(false) },
                  },
                  {
                    icon: <Archive size={13} />,
                    label: 'Archive',
                    action: () => { updateHabit.mutate({ id: habit._id, status: 'archived' }); setMenuOpen(false) },
                  },
                ].map(({ icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] text-ink-soft hover:bg-ink/[0.05] hover:text-ink transition-colors duration-100"
                  >
                    {icon} {label}
                  </button>
                ))}
                <div className="my-1 mx-3 border-t border-ink/[0.06]" />
                <button
                  onClick={() => {
                    if (confirm(`Delete "${habit.name}"? This can't be undone.`)) deleteHabit.mutate(habit._id)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] text-rose hover:bg-rose-light transition-colors duration-100"
                >
                  <Trash2 size={13} /> Delete habit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
