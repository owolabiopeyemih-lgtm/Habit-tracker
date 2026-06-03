import { useState, useEffect } from 'react'
import {
  Archive, Trash2, Bell, ChevronRight,
  Zap, Shield, Database, Info, Smartphone,
  RotateCcw, CheckCircle2,
} from 'lucide-react'
import { useHabits, useUpdateHabit, useDeleteHabit } from '../hooks/useHabits'
import { requestNotificationPermission } from '../hooks/useNotifications'
import { clsx } from '../lib/clsx'

// ── Design primitives ────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-ink-faint uppercase tracking-[0.2em] px-1 mb-2.5 mt-0.5">
      {children}
    </p>
  )
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream-dark rounded-2xl border border-ink/[0.08] overflow-hidden divide-y divide-ink/[0.06] shadow-card">
      {children}
    </div>
  )
}

interface IconTileProps {
  icon: React.ReactNode
  color: string
  bg: string
}
function IconTile({ icon, color, bg }: IconTileProps) {
  return (
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg, color }}
    >
      {icon}
    </div>
  )
}

interface RowProps {
  iconTile: React.ReactNode
  title: string
  subtitle?: string
  right?: React.ReactNode
  onClick?: () => void
  danger?: boolean
  className?: string
}
function Row({ iconTile, title, subtitle, right, onClick, danger, className }: RowProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      {...(onClick ? { onClick, type: 'button' as const } : {})}
      className={clsx(
        'w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-100',
        onClick && !danger && 'hover:bg-white/[0.025] active:bg-white/[0.04]',
        onClick && danger && 'hover:bg-rose-light active:bg-rose-light',
        className,
      )}
    >
      {iconTile}
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-[13px] font-semibold leading-snug',
          danger ? 'text-rose' : 'text-ink',
        )}>
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">{subtitle}</p>
        )}
      </div>
      {right && (
        <div className="flex-shrink-0 flex items-center gap-1.5 text-ink-muted">
          {right}
        </div>
      )}
    </Tag>
  )
}

// Pill badge for right-side values
function ValuePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold text-ink-faint bg-void px-2.5 py-1 rounded-full border border-ink/[0.08]">
      {children}
    </span>
  )
}

// Toggle switch
function Toggle({ enabled, onToggle, disabled }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!disabled) onToggle() }}
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      className={clsx(
        'relative w-11 h-[26px] rounded-full transition-all duration-200 flex-shrink-0',
        enabled ? 'bg-leaf-600 shadow-neon-xs' : 'bg-void border border-ink/[0.12]',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <span
        className="absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: enabled ? 'translateX(21px)' : 'translateX(0)' }}
      />
    </button>
  )
}

// Expandable FAQ accordion row
function FAQRow({ iconTile, title, body }: { iconTile: React.ReactNode; title: string; body: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Row
        iconTile={iconTile}
        title={title}
        onClick={() => setOpen((v) => !v)}
        right={
          <ChevronRight
            size={14}
            className="text-ink-faint transition-transform duration-200"
            style={{ transform: open ? 'rotate(90deg)' : undefined }}
          />
        }
      />
      {open && (
        <div className="px-[3.75rem] pb-4 -mt-1 animate-fade-in">
          <p className="text-[12px] text-ink-muted leading-relaxed">{body}</p>
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────

export function Settings() {
  const { data: habits = [] } = useHabits()
  const updateHabit            = useUpdateHabit()
  const deleteHabit            = useDeleteHabit()

  const archived = habits.filter((h) => h.status === 'archived')
  const active   = habits.filter((h) => h.status === 'active')

  const [showArchived,    setShowArchived]    = useState(false)
  const [hapticEnabled,   setHapticEnabled]   = useState(true)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default')

  // Read real browser notification permission state
  useEffect(() => {
    if (!('Notification' in window)) { setNotifPermission('unsupported'); return }
    setNotifPermission(Notification.permission)
  }, [])

  const notifGranted = notifPermission === 'granted'
  const notifDenied  = notifPermission === 'denied'

  const handleNotifToggle = async () => {
    if (notifGranted) {
      // Can't revoke programmatically — guide user
      setNotifPermission('default')
      return
    }
    if (notifDenied) return
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? 'granted' : 'denied')
  }

  const handleHapticToggle = () => {
    setHapticEnabled((v) => !v)
    if ('vibrate' in navigator) navigator.vibrate(hapticEnabled ? 0 : 10)
  }

  return (
    <>
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-[10px] font-bold text-ink-faint uppercase tracking-[0.2em] mb-2">
          Configure
        </p>
        <h1 className="font-display text-[2.75rem] font-bold text-ink leading-[1.0] tracking-[-0.02em]">
          Settings<span className="text-leaf-600 text-glow">.</span>
        </h1>
      </div>

      <div className="space-y-6 pb-4">

        {/* ── Profile ─────────────────────────────────── */}
        <section>
          <SectionLabel>Profile</SectionLabel>
          <div className="bg-cream-dark rounded-2xl border border-ink/[0.08] shadow-card px-4 py-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] select-none"
                  style={{
                    background: 'linear-gradient(145deg, rgba(168,255,0,0.14) 0%, rgba(168,255,0,0.04) 100%)',
                    border: '1px solid rgba(168,255,0,0.14)',
                  }}
                >
                  🌿
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-leaf-600 border-[2.5px] border-cream-dark" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-[16px] font-bold text-ink tracking-tight">
                  Anonymous user
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[11px] text-ink-muted">
                    {active.length} active habit{active.length !== 1 ? 's' : ''}
                  </span>
                  {archived.length > 0 && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-ink-faint" />
                      <span className="text-[11px] text-ink-muted">
                        {archived.length} archived
                      </span>
                    </>
                  )}
                </div>
              </div>

              <ValuePill>Device</ValuePill>
            </div>

            {/* Habit progress bar mini */}
            {habits.length > 0 && (
              <div className="mt-4 pt-4 border-t border-ink/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-ink-faint uppercase tracking-wide">
                    Today's completion
                  </span>
                  <span className="text-[11px] font-bold text-leaf-600 tabular-nums">
                    {active.filter((h) => h.completedToday).length}/{active.length}
                  </span>
                </div>
                <div className="h-1 bg-void rounded-full overflow-hidden">
                  <div
                    className="h-full bg-leaf-600 rounded-full transition-all duration-700"
                    style={{
                      width: active.length > 0
                        ? `${Math.round((active.filter((h) => h.completedToday).length / active.length) * 100)}%`
                        : '0%',
                      boxShadow: '0 0 6px rgba(168,255,0,0.5)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Preferences ─────────────────────────────── */}
        <section>
          <SectionLabel>Preferences</SectionLabel>
          <SettingsCard>
            <Row
              iconTile={<IconTile icon={<Bell size={15} />} color="#F5A623" bg="#2A1E00" />}
              title="Push reminders"
              subtitle={
                notifDenied
                  ? 'Blocked in browser — enable in site settings'
                  : notifGranted
                    ? 'Notifications active'
                    : 'Tap to enable daily nudges'
              }
              right={
                <Toggle
                  enabled={notifGranted}
                  onToggle={handleNotifToggle}
                  disabled={notifDenied || notifPermission === 'unsupported'}
                />
              }
            />
            <Row
              iconTile={<IconTile icon={<Smartphone size={15} />} color="#06B6D4" bg="#0A2028" />}
              title="Haptic feedback"
              subtitle="Subtle vibration on habit completion"
              right={<Toggle enabled={hapticEnabled} onToggle={handleHapticToggle} />}
            />
          </SettingsCard>
        </section>

        {/* ── Data & Storage ───────────────────────────── */}
        <section>
          <SectionLabel>Data & Storage</SectionLabel>
          <SettingsCard>
            {/* Archived habits — expandable */}
            <div>
              <Row
                iconTile={<IconTile icon={<Archive size={15} />} color="#A8A29E" bg="#1C1C22" />}
                title="Archived habits"
                subtitle={archived.length > 0 ? `${archived.length} habit${archived.length !== 1 ? 's' : ''} stored` : 'No archived habits'}
                onClick={() => setShowArchived((v) => !v)}
                right={
                  <>
                    {archived.length > 0 && (
                      <span className="text-[10px] font-black text-ink-faint bg-void w-5 h-5 rounded-full flex items-center justify-center border border-ink/[0.09] tabular-nums">
                        {archived.length}
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className="text-ink-faint transition-transform duration-200"
                      style={{ transform: showArchived ? 'rotate(90deg)' : undefined }}
                    />
                  </>
                }
              />

              {/* Archived list — inline expand */}
              {showArchived && (
                <div className="border-t border-ink/[0.06] animate-fade-in">
                  {archived.length === 0 ? (
                    <div className="flex flex-col items-center py-7 gap-2">
                      <CheckCircle2 size={22} className="text-ink-faint" />
                      <p className="text-[12px] text-ink-faint">Nothing archived yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.04]">
                      {archived.map((h, i) => (
                        <div
                          key={h._id}
                          className="flex items-center gap-3 px-4 py-3 bg-void/20 animate-slide-up"
                          style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                        >
                          {/* Left accent dot */}
                          <div
                            className="absolute left-0 w-0.5 h-6 rounded-r-full opacity-50"
                            style={{ backgroundColor: h.color }}
                          />
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px] flex-shrink-0"
                            style={{ backgroundColor: h.color + '18' }}
                          >
                            {h.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-ink-soft truncate">{h.name}</p>
                            <p className="text-[10px] text-ink-faint uppercase tracking-wide mt-0.5">Archived</p>
                          </div>
                          <button
                            onClick={() => updateHabit.mutate({ id: h._id, status: 'active' })}
                            className="flex items-center gap-1 text-[11px] font-bold text-leaf-600 hover:text-leaf-700 px-2.5 py-1.5 rounded-lg hover:bg-leaf-50 transition-colors flex-shrink-0 press"
                          >
                            <RotateCcw size={11} />
                            Restore
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete "${h.name}"? This can't be undone.`)) {
                                deleteHabit.mutate(h._id)
                              }
                            }}
                            className="p-1.5 rounded-lg text-ink-faint hover:text-rose hover:bg-rose-light transition-colors flex-shrink-0 press"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Row
              iconTile={<IconTile icon={<Database size={15} />} color="#A8FF00" bg="#0F2812" />}
              title="Storage"
              subtitle="Habits are stored locally on this device"
              right={<ValuePill>Local</ValuePill>}
            />
          </SettingsCard>
        </section>

        {/* ── Help & Info ──────────────────────────────── */}
        <section>
          <SectionLabel>Help & Info</SectionLabel>
          <SettingsCard>
            <FAQRow
              iconTile={<IconTile icon={<Zap size={15} />} color="#F5A623" bg="#2A1E00" />}
              title="How streaks work"
              body="A streak counts every consecutive day you complete all your active habits. Miss a single day and it resets to zero — so consistency is everything. Your longest streak is saved permanently even after a reset."
            />
            <FAQRow
              iconTile={<IconTile icon={<Bell size={15} />} color="#818CF8" bg="#1A1830" />}
              title="Push reminders"
              body="Reminders use the browser's Web Push API and require notification permission. The app must be open or installed as a PWA to receive them. Set reminder times per-habit from the edit screen."
            />
            <FAQRow
              iconTile={<IconTile icon={<Shield size={15} />} color="#06B6D4" bg="#0A2028" />}
              title="Your data & privacy"
              body="All data is tied to this device via a unique ID stored in your browser — no account needed. Nothing leaves your device except to our server. Clearing browser site data removes the link to your habits permanently."
            />
            <Row
              iconTile={<IconTile icon={<Info size={15} />} color="#6B6B70" bg="#1C1C22" />}
              title="Version"
              right={
                <span className="text-[12px] font-bold text-ink-muted tabular-nums">1.0.0</span>
              }
            />
          </SettingsCard>
        </section>

        {/* ── Brand card ───────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-leaf-600/[0.14] bg-void">
            {/* Radial accent glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent-dim) 0%, transparent 65%)' }}
            />
            {/* Dot grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--accent-glow-xs) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />

            <div className="relative px-6 py-9 text-center">
              <p className="font-display text-[42px] font-black tracking-[-0.03em] text-ink leading-none mb-2">
                Habit<span className="text-leaf-600 text-glow">yn</span><span className="text-leaf-600 text-glow">.</span>
              </p>
              <p className="text-[12px] text-ink-muted mb-6 max-w-[180px] mx-auto leading-relaxed">
                Build routines that actually stick.
              </p>

              {/* Stats row */}
              {habits.length > 0 && (
                <div className="flex justify-center gap-6 mb-6">
                  {[
                    { value: active.length,   label: 'Active'   },
                    { value: archived.length, label: 'Archived' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <p className="font-display text-2xl font-black text-ink tabular-nums">{value}</p>
                      <p className="text-[10px] text-ink-faint uppercase tracking-wide mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="inline-flex items-center gap-2 bg-leaf-50/70 rounded-full px-3.5 py-1.5 border border-leaf-200/[0.2]">
                <span className="w-1.5 h-1.5 rounded-full bg-leaf-600 animate-dot-pulse" />
                <span className="text-leaf-600 text-[10px] font-bold uppercase tracking-wide">v1.0.0 · Stable</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
