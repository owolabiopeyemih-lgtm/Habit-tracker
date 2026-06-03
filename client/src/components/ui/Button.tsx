import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from '../../lib/clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:   'bg-leaf-600 text-void font-bold shadow-neon-sm hover:bg-leaf-700 hover:shadow-neon active:scale-[0.96] active:shadow-neon-xs',
  secondary: 'bg-cream-dark text-ink border border-white/10 hover:bg-void hover:border-white/20 shadow-card active:scale-[0.97]',
  ghost:     'text-ink-muted hover:bg-void/50 hover:text-ink-soft active:scale-[0.97]',
  danger:    'bg-rose text-white hover:opacity-90 shadow-sm active:scale-[0.97]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8  px-3   text-[11px] rounded-xl  gap-1.5',
  md: 'h-10 px-4   text-[13px] rounded-xl  gap-2',
  lg: 'h-12 px-6   text-[14px] rounded-2xl gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
