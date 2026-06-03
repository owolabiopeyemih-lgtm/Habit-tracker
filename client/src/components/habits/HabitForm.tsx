import { useState } from 'react'
import type { HabitWithStreak, HabitCategory, HabitFrequency } from '../../types'
import { CATEGORY_META, HABIT_COLORS, HABIT_ICONS } from '../../lib/constants'
import { Button } from '../ui/Button'
import { useCreateHabit, useUpdateHabit } from '../../hooks/useHabits'
import { requestNotificationPermission, subscribeHabitReminder } from '../../hooks/useNotifications'
import { clsx } from '../../lib/clsx'

export interface CreatedPayload {
  name: string
  icon: string
  color: string
  frequencyLabel: string
}

interface Props {
  habit?: HabitWithStreak
  onClose: () => void
  onCreated?: (payload: CreatedPayload) => void
}

const FREQUENCIES: { value: HabitFrequency; label: string; sub: string }[] = [
  { value: 'daily',    label: 'Every day', sub: 'No days off'  },
  { value: 'weekdays', label: 'Weekdays',  sub: 'Mon – Fri'    },
  { value: 'weekends', label: 'Weekends',  sub: 'Sat & Sun'    },
  { value: 'custom',   label: 'Custom',    sub: 'Pick your days' },
]

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold text-ink-faint uppercase tracking-[0.16em] mb-2">
      {children}
    </label>
  )
}

/* ── Period-of-day helper ─────────────────────────────── */
function timeOfDay(h: number) {
  if (h >= 5  && h < 12) return { label: 'Morning',   icon: '🌅' }
  if (h >= 12 && h < 17) return { label: 'Afternoon', icon: '☀️'  }
  if (h >= 17 && h < 21) return { label: 'Evening',   icon: '🌆' }
  return                          { label: 'Night',    icon: '🌙' }
}

/* ── Simple time picker ───────────────────────────────── */
function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [hRaw] = value.split(':').map(Number)
  const h      = isNaN(hRaw) ? 8 : hRaw
  const isPM   = h >= 12
  const { label, icon } = timeOfDay(h)

  return (
    <div className="mt-3 space-y-2 animate-fade-in">
      {/* Native input — browser handles the actual editing */}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-ink/[0.10] bg-cream text-[15px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-leaf-600/50 focus:border-leaf-600/40 transition-all duration-150"
      />

      {/* Period label — specific to the exact hour, never ambiguous */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-[15px] leading-none">{icon}</span>
        <span className="text-[12px] font-semibold text-ink-muted">{label}</span>
        <span
          className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: isPM ? 'rgba(129,140,248,0.15)' : 'rgba(245,166,35,0.15)',
            color:           isPM ? '#818CF8'                  : '#F5A623',
          }}
        >
          {isPM ? 'PM' : 'AM'} · {label}
        </span>
      </div>
    </div>
  )
}

export function HabitForm({ habit, onClose, onCreated }: Props) {
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()

  const [name, setName]                       = useState(habit?.name ?? '')
  const [description, setDescription]         = useState(habit?.description ?? '')
  const [category, setCategory]               = useState<HabitCategory>(habit?.category ?? 'health')
  const [color, setColor]                     = useState(habit?.color ?? HABIT_COLORS[0])
  const [icon, setIcon]                       = useState(habit?.icon ?? HABIT_ICONS[0])
  const [frequency, setFrequency]             = useState<HabitFrequency>(habit?.frequency ?? 'daily')
  const [customDays, setCustomDays]           = useState<number[]>(habit?.customDays ?? [1, 2, 3, 4, 5])
  const [reminderEnabled, setReminderEnabled] = useState(habit?.reminderEnabled ?? false)
  const [reminderTime, setReminderTime]       = useState(habit?.reminderTime ?? '08:00')
  const [step, setStep]                       = useState(0)

  const isPending = createHabit.isPending || updateHabit.isPending

  const toggleDay = (d: number) =>
    setCustomDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])

  const handleSubmit = async () => {
    if (!name.trim()) return
    const payload = {
      name: name.trim(), description: description.trim(),
      category, color, icon, frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      reminderEnabled, reminderTime: reminderEnabled ? reminderTime : undefined,
    }
    const onSuccess = async (id: string, isNew: boolean) => {
      if (reminderEnabled) {
        const granted = await requestNotificationPermission()
        if (granted) await subscribeHabitReminder(id, reminderTime)
      }
      if (isNew && onCreated) {
        onCreated({
          name:           name.trim(),
          icon,
          color,
          frequencyLabel: FREQUENCIES.find((f) => f.value === frequency)?.label ?? frequency,
        })
      }
      onClose()
    }
    if (habit) {
      updateHabit.mutate({ id: habit._id, ...payload }, { onSuccess: (h) => onSuccess(h._id, false) })
    } else {
      createHabit.mutate(payload, { onSuccess: (h) => onSuccess(h._id, true) })
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-ink/[0.10] bg-cream text-[13px] font-medium text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-leaf-600/50 focus:border-leaf-600/40 transition-all duration-150"

  return (
    <div>
      {/* Step dots */}
      <div className="flex items-center gap-1.5 mb-6">
        {[0, 1].map((s) => (
          <div
            key={s}
            className={clsx(
              'rounded-full transition-all duration-300',
              s === step
                ? 'w-6 h-1.5 bg-leaf-600 shadow-neon-xs'
                : s < step
                  ? 'w-3 h-1.5 bg-leaf-400'
                  : 'w-3 h-1.5 bg-cream-dark border border-ink/[0.10]',
            )}
          />
        ))}
        <span className="text-[10px] text-ink-faint ml-1 font-bold">{step + 1} / 2</span>
      </div>

      {/* ── Step 0 ─────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <FieldLabel>Habit name</FieldLabel>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run, Read 20 pages…"
              className={inputCls}
            />
          </div>

          <div>
            <FieldLabel>Why this habit? <span className="normal-case font-normal opacity-60">(optional)</span></FieldLabel>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this change for you?"
              className={clsx(inputCls, 'resize-none')}
            />
          </div>

          {/* Icon picker */}
          <div>
            <FieldLabel>Icon</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={clsx(
                    'w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all duration-150 press',
                    icon === ic
                      ? 'ring-2 ring-leaf-600 shadow-neon-xs scale-[1.08]'
                      : 'bg-cream border border-ink/[0.10] hover:border-ink/[0.20]',
                  )}
                  style={icon === ic ? { backgroundColor: color + '22' } : undefined}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <FieldLabel>Color</FieldLabel>
            <div className="flex gap-2.5 flex-wrap">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={clsx(
                    'w-7 h-7 rounded-full transition-all duration-150 press',
                    color === c ? 'ring-2 ring-offset-2 ring-offset-cream-dark scale-110' : 'hover:scale-110',
                  )}
                  style={{ backgroundColor: c, ...(color === c ? { ringColor: c } : {}) }}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <FieldLabel>Category</FieldLabel>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setCategory(k as HabitCategory)}
                  className={clsx(
                    'py-2 px-1 rounded-xl text-[11px] font-bold border transition-all duration-150 press',
                    category === k
                      ? 'text-void border-transparent'
                      : 'bg-cream border-ink/[0.10] text-ink-muted hover:border-ink/[0.20]',
                  )}
                  style={category === k ? { backgroundColor: v.color, boxShadow: `0 0 8px ${v.color}55` } : undefined}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full press" size="lg" onClick={() => setStep(1)} disabled={!name.trim()}>
            Continue →
          </Button>
        </div>
      )}

      {/* ── Step 1 ─────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          {/* Frequency */}
          <div>
            <FieldLabel>Frequency</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={clsx(
                    'py-3 px-3 rounded-xl text-left border transition-all duration-150 press',
                    frequency === f.value
                      ? 'bg-leaf-600 border-transparent shadow-neon-xs'
                      : 'bg-cream border-ink/[0.10] hover:border-ink/[0.20]',
                  )}
                >
                  <div className={clsx('text-[13px] font-bold', frequency === f.value ? 'text-void' : 'text-ink')}>
                    {f.label}
                  </div>
                  <div className={clsx('text-[11px] mt-0.5', frequency === f.value ? 'text-void/60' : 'text-ink-faint')}>
                    {f.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {frequency === 'custom' && (
            <div>
              <FieldLabel>Which days</FieldLabel>
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={clsx(
                      'flex-1 py-2.5 rounded-xl text-[11px] font-bold border transition-all duration-150 press',
                      customDays.includes(i)
                        ? 'bg-leaf-600 text-void border-transparent shadow-neon-xs'
                        : 'bg-void border-white/[0.08] text-ink-muted hover:border-white/20',
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reminder */}
          <div className="bg-cream rounded-2xl p-4 border border-ink/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-ink">Daily reminder</p>
                <p className="text-[11px] text-ink-muted mt-0.5">Push notification to check in</p>
              </div>
              <button
                onClick={() => setReminderEnabled((v) => !v)}
                aria-checked={reminderEnabled}
                role="switch"
                className={clsx(
                  'relative w-11 h-6 rounded-full transition-all duration-250',
                  reminderEnabled ? 'bg-leaf-600 shadow-neon-xs' : 'bg-cream-dark border border-ink/[0.12]',
                )}
              >
                <span className={clsx(
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-250',
                  reminderEnabled ? 'translate-x-5' : 'translate-x-0',
                )} />
              </button>
            </div>
            {reminderEnabled && (
              <TimePicker value={reminderTime} onChange={setReminderTime} />
            )}
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-ink/[0.08] bg-cream">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: color + '22' }}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[13px] text-ink truncate">{name || 'Your habit'}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                {FREQUENCIES.find((f) => f.value === frequency)?.label}
              </p>
            </div>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => setStep(0)} className="flex-1 press">
              ← Back
            </Button>
            <Button size="lg" onClick={handleSubmit} loading={isPending} className="flex-1 press">
              {habit ? 'Save changes' : 'Create habit'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
