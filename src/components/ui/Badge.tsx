'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'lime' | 'gold' | 'founding' | 'stage' | 'winner'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-pingers-dark-lighter text-pingers-cream',
      lime: 'bg-pingers-lime/20 text-pingers-lime border border-pingers-lime/30',
      gold: 'bg-pingers-gold/20 text-pingers-gold border border-pingers-gold/30',
      founding: 'founding-badge',
      stage: 'bg-pingers-dark-lighter text-pingers-lime border-l-4 border-pingers-lime',
      winner: 'bg-gradient-to-r from-pingers-gold to-pingers-gold-light text-pingers-dark',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-semibold rounded-md uppercase tracking-wide',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
