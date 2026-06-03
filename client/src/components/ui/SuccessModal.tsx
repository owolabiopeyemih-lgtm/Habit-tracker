import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export interface CreatedHabitInfo {
  name: string
  icon: string
  color: string
  frequencyLabel: string
}

interface Props {
  open: boolean
  habit: CreatedHabitInfo | null
  onClose: () => void
}

const AUTO_DISMISS_MS = 3000
const RING_R          = 32
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R // ≈ 201

export function SuccessModal({ open, habit, onClose }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return
    timerRef.current = setTimeout(onClose, AUTO_DISMISS_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [open, onClose])

  if (!open || !habit) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Habit created successfully"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/65 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-[300px] bg-cream-dark rounded-[28px] border border-ink/[0.09] shadow-lifted text-center animate-modal-in overflow-hidden">

        {/* Subtle top neon gradient */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${habit.color}18 0%, transparent 70%)` }}
        />

        {/* Dismiss button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 z-10 w-7 h-7 flex items-center justify-center rounded-xl text-ink-faint hover:text-ink hover:bg-void/60 transition-colors duration-150"
        >
          <X size={13} strokeWidth={2} />
        </button>

        <div className="px-8 pt-10 pb-7">
          {/* ── Animated ring + icon ─────────────────── */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[84px] h-[84px]">

              {/* Outer neon halo pulse */}
              <div
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${habit.color}20 0%, transparent 70%)`,
                  animation: 'neon-pulse 2s ease-in-out infinite',
                }}
              />

              {/* SVG ring — draws itself in */}
              <svg
                viewBox="0 0 84 84"
                className="absolute inset-0 w-full h-full -rotate-90"
                aria-hidden
              >
                {/* Track */}
                <circle
                  cx="42" cy="42" r={RING_R}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="2.5"
                />
                {/* Animated arc */}
                <circle
                  cx="42" cy="42" r={RING_R}
                  fill="none"
                  stroke="#A8FF00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE}
                  style={{
                    animation: 'circle-draw 0.65s cubic-bezier(0.16, 1, 0.3, 1) 80ms forwards',
                    filter:    'drop-shadow(0 0 5px rgba(168,255,0,0.75))',
                  }}
                />
              </svg>

              {/* Habit icon — spring bounce in */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-[28px] animate-bounce-in"
                  style={{
                    backgroundColor: habit.color + '1A',
                    animationDelay:  '120ms',
                  }}
                >
                  {habit.icon}
                </div>
              </div>
            </div>
          </div>

          {/* ── Status badge ─────────────────────────── */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 animate-scale-in"
            style={{
              backgroundColor: '#A8FF0015',
              border:          '1px solid rgba(168,255,0,0.2)',
              animationDelay:  '250ms',
            }}
          >
            {/* Mini checkmark */}
            <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 flex-shrink-0" aria-hidden>
              <path
                d="M1 4l2.5 2.5L9 1"
                stroke="#A8FF00" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="text-[10px] font-bold text-leaf-600 uppercase tracking-[0.12em]">
              Habit created
            </span>
          </div>

          {/* ── Habit name + frequency ───────────────── */}
          <div
            className="mb-7 animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            <p className="font-display text-[22px] font-bold text-ink tracking-tight leading-tight mb-1.5">
              {habit.name}
            </p>
            <p className="text-[12px] text-ink-muted">{habit.frequencyLabel}</p>
          </div>

          {/* ── Auto-dismiss countdown bar ───────────── */}
          <div className="h-[3px] bg-void rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: '#A8FF00',
                boxShadow:       '0 0 6px rgba(168,255,0,0.6)',
                transformOrigin: 'left center',
                animation:       `countdown ${AUTO_DISMISS_MS}ms linear forwards`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
