'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { container: 'w-10 h-10', paddle: 24, text: 'text-lg' },
    md: { container: 'w-16 h-16', paddle: 40, text: 'text-2xl' },
    lg: { container: 'w-24 h-24', paddle: 60, text: 'text-4xl' },
    xl: { container: 'w-32 h-32', paddle: 80, text: 'text-5xl' },
  }

  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Circular badge with paddle */}
      <div
        className={cn(
          s.container,
          'relative rounded-full badge-circle flex items-center justify-center'
        )}
      >
        {/* Paddle SVG */}
        <svg
          width={s.paddle}
          height={s.paddle}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Paddle face */}
          <ellipse
            cx="45"
            cy="35"
            rx="30"
            ry="32"
            fill="#A4B745"
            className="drop-shadow-lg"
          />
          {/* Paddle texture lines */}
          <ellipse
            cx="45"
            cy="35"
            rx="26"
            ry="28"
            fill="none"
            stroke="#8A9A3A"
            strokeWidth="1"
            opacity="0.5"
          />
          {/* Handle */}
          <rect
            x="38"
            y="62"
            width="14"
            height="28"
            rx="3"
            fill="#A4B745"
            className="drop-shadow-lg"
          />
          <rect
            x="40"
            y="65"
            width="10"
            height="22"
            rx="2"
            fill="#8A9A3A"
            opacity="0.3"
          />
          {/* Ball */}
          <circle
            cx="78"
            cy="25"
            r="12"
            fill="#f5f5f0"
            className="drop-shadow-md"
          />
          <ellipse
            cx="78"
            cy="25"
            rx="10"
            ry="10"
            fill="none"
            stroke="#ddd"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              s.text,
              'font-black tracking-tight text-pingers-cream text-distressed'
            )}
            style={{ fontStyle: 'italic' }}
          >
            PINGERS
          </span>
          {size !== 'sm' && (
            <span className="text-pingers-lime text-xs uppercase tracking-widest">
              Championship
            </span>
          )}
        </div>
      )}
    </div>
  )
}
