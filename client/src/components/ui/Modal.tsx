import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    /* Trap focus — focus close button on open */
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  /* Block body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop — always dark regardless of theme */}
      <div
        className="absolute inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: 'var(--overlay-bg)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`relative w-full ${sizes[size]} bg-cream-dark rounded-3xl border border-ink/[0.09] shadow-lifted flex flex-col max-h-[92dvh] animate-modal-in`}>
        {/* Drag handle — mobile hint */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08]">
          <h2 id="modal-title" className="font-display text-xl font-bold text-ink tracking-tight">
            {title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-muted hover:bg-void/60 hover:text-ink transition-colors duration-150"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  )
}
