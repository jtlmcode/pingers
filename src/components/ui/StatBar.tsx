'use client'

import { cn } from '@/lib/utils'

interface StatBarProps {
  label: string
  value: number
  maxValue?: number
  showValue?: boolean
  color?: 'lime' | 'gold' | 'red' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatBar({
  label,
  value,
  maxValue = 10,
  showValue = true,
  color = 'lime',
  size = 'md',
  className,
}: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  const colors = {
    lime: 'from-pingers-lime to-pingers-lime-light',
    gold: 'from-pingers-gold to-pingers-gold-light',
    red: 'from-red-500 to-red-400',
    blue: 'from-blue-500 to-blue-400',
  }

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-pingers-cream/80 uppercase tracking-wide">
          {label}
        </span>
        {showValue && (
          <span className="text-sm font-bold text-pingers-lime">
            {value}/{maxValue}
          </span>
        )}
      </div>
      <div
        className={cn(
          'w-full bg-pingers-dark-lighter rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface StatGridProps {
  stats: {
    defence: number
    spin: number
    serve: number
    agility: number
    physicality: number
    complainometer: number
  }
  className?: string
}

export function StatGrid({ stats, className }: StatGridProps) {
  const statConfig = [
    { key: 'defence', label: 'Defence', color: 'lime' as const },
    { key: 'spin', label: 'Spin', color: 'lime' as const },
    { key: 'serve', label: 'Serve', color: 'lime' as const },
    { key: 'agility', label: 'Agility', color: 'lime' as const },
    { key: 'physicality', label: 'Physicality', color: 'lime' as const },
    { key: 'complainometer', label: 'Complainometer', color: 'red' as const },
  ]

  return (
    <div className={cn('space-y-3', className)}>
      {statConfig.map(({ key, label, color }) => (
        <StatBar
          key={key}
          label={label}
          value={stats[key as keyof typeof stats]}
          color={color}
          size="sm"
        />
      ))}
    </div>
  )
}
