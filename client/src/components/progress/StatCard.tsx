import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  accent: string
  accentBg: string
  /** Optional comparison: e.g. "Best: 14d" */
  compare?: string
}

export function StatCard({ label, value, sub, icon, accent, accentBg, compare }: Props) {
  return (
    <div className="bg-cream-dark rounded-2xl border border-ink/[0.08] p-4 shadow-card relative overflow-hidden">
      {/* Accent radial glow — top-right corner */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center mb-3 flex-shrink-0"
          style={{ backgroundColor: accentBg }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>

        {/* Value */}
        <p className="font-display text-[1.9rem] font-black text-ink leading-none tracking-tight tabular-nums">
          {value}
        </p>

        {/* Label */}
        <p className="text-[10px] font-bold text-ink-muted mt-1.5 uppercase tracking-[0.12em]">
          {label}
        </p>

        {/* Sub / compare */}
        {(sub || compare) && (
          <p className="text-[10px] text-ink-faint mt-0.5 leading-snug">
            {compare ?? sub}
          </p>
        )}
      </div>
    </div>
  )
}
