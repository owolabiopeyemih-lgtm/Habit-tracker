import type { ReactNode } from 'react'
import { clsx } from '../../lib/clsx'

interface Props {
  children: ReactNode
  color?: string
  bg?: string
  className?: string
}

export function Badge({ children, color, bg, className }: Props) {
  return (
    <span
      className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className)}
      style={color ? { color, backgroundColor: bg } : undefined}
    >
      {children}
    </span>
  )
}
