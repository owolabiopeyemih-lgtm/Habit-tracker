import {
  BarChart, Bar, XAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import type { DailyProgress } from '../../types'
import { format, parseISO } from 'date-fns'
import { useTheme } from '../../lib/theme'

interface Props {
  data: DailyProgress[]
}

/* ── Tooltip ─────────────────────────────────────────────────── */
const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean
  payload?: { dataKey: string; value: number }[]
  label?: string
}) => {
  if (!active || !payload?.length || !label) return null

  const completed = payload.find((p) => p.dataKey === 'completed')?.value ?? 0
  const total     = payload.find((p) => p.dataKey === 'total')?.value ?? 0
  const isPerfect = total > 0 && completed === total
  const isEmpty   = total === 0

  return (
    <div
      className="bg-cream-dark border border-ink/[0.10] rounded-2xl px-3.5 py-2.5 shadow-lifted"
      style={{ minWidth: 130 }}
    >
      <p className="text-[10px] font-bold text-ink-faint uppercase tracking-wider mb-2">
        {format(parseISO(label), 'EEE, MMM d')}
      </p>

      {isEmpty ? (
        <p className="text-[12px] text-ink-muted">No habits scheduled</p>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-ink-muted">Done</span>
            <span className="text-[13px] font-bold text-ink tabular-nums">{completed}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-ink-muted">Total</span>
            <span className="text-[13px] font-bold text-ink tabular-nums">{total}</span>
          </div>
          {isPerfect && (
            <div
              className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide rounded-full px-2 py-1"
              style={{ backgroundColor: 'rgba(168,255,0,0.12)', color: '#A8FF00' }}
            >
              <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 flex-shrink-0">
                <path d="M1 4l2.5 2.5L9 1" stroke="#A8FF00" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              Perfect day
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Chart ───────────────────────────────────────────────────── */
export function WeeklyChart({ data }: Props) {
  const { theme } = useTheme()

  // Bar colors adapt to theme: neon on dark, forest green on light
  const barPerfect = theme === 'dark' ? '#A8FF00' : '#3A8C00'
  const barPartial = theme === 'dark' ? '#55BB00' : '#5AAA20'
  const barTrack   = theme === 'dark' ? '#1C1C22' : '#E8E5E0'
  const tickColor  = theme === 'dark' ? '#3A3A42' : '#B5AEA8'

  return (
    <ResponsiveContainer width="100%" height={190}>
      <BarChart
        data={data}
        barSize={20}
        barGap={3}
        barCategoryGap="28%"
        margin={{ top: 4, right: 2, bottom: 0, left: -44 }}
      >
        <XAxis
          dataKey="date"
          tickFormatter={(v) => format(parseISO(v), 'EEEEE')}
          tick={{
            fontSize: 10,
            fill: tickColor,
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 700,
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(255,255,255,0.025)', radius: 6 }}
        />

        {/* Background (total) bars */}
        <Bar
          dataKey="total"
          fill={barTrack}
          radius={[5, 5, 3, 3]}
          isAnimationActive
          animationDuration={500}
          animationEasing="ease-out"
        />

        {/* Foreground (completed) bars */}
        <Bar
          dataKey="completed"
          radius={[5, 5, 3, 3]}
          isAnimationActive
          animationDuration={700}
          animationBegin={150}
          animationEasing="ease-out"
        >
          {data.map((entry, i) => {
            const isPerfect = entry.total > 0 && entry.completed === entry.total
            return (
              <Cell
                key={i}
                fill={isPerfect ? barPerfect : barPartial}
                opacity={entry.completed === 0 ? 0 : 1}
              />
            )
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
