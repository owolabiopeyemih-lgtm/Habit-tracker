import { CATEGORY_META } from '../../lib/constants'
import type { HabitCategory } from '../../types'
import { clsx } from '../../lib/clsx'

interface Props {
  selected: HabitCategory | 'all'
  onChange: (cat: HabitCategory | 'all') => void
  counts: Partial<Record<HabitCategory | 'all', number>>
}

export function CategoryFilter({ selected, onChange, counts }: Props) {
  const categories: Array<{ key: HabitCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k as HabitCategory, label: v.label })),
  ]

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
      {categories.map(({ key, label }) => {
        const count   = counts[key]
        if (key !== 'all' && !count) return null
        const meta    = key !== 'all' ? CATEGORY_META[key] : null
        const isActive = selected === key

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={clsx(
              'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold',
              'transition-all duration-200 press-sm',
              isActive
                ? 'text-void'
                : 'bg-cream-dark border border-ink/[0.08] text-ink-muted hover:border-ink/[0.15] hover:text-ink-soft',
            )}
            style={isActive
              ? {
                  backgroundColor: key === 'all' ? 'var(--accent)' : (meta?.color ?? 'var(--accent)'),
                  boxShadow: `0 0 10px ${key === 'all' ? 'var(--accent-glow-xs)' : (meta?.color ?? 'var(--accent)') + '44'}`,
                }
              : undefined
            }
          >
            {label}
            {count !== undefined && (
              <span className={clsx(
                'rounded-full text-[9px] font-black w-4 h-4 flex items-center justify-center tabular-nums',
                isActive ? 'bg-black/20' : 'bg-ink/[0.07] text-ink-faint',
              )}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
