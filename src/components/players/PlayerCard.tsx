'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge, StatGrid } from '@/components/ui'
import { cn, getWinPercentage, getStreakDisplay } from '@/lib/utils'

interface PlayerCardProps {
  player: {
    id: string
    nickname: string
    tagline?: string | null
    photo?: string | null
    isFoundingSeason: boolean
    wins: number
    losses: number
    currentStreak: number
    statDefence: number
    statSpin: number
    statServe: number
    statAgility: number
    statPhysicality: number
    statComplainometer: number
    user: {
      name: string | null
    }
  }
  variant?: 'default' | 'compact' | 'featured'
  showStats?: boolean
  className?: string
}

export function PlayerCard({
  player,
  variant = 'default',
  showStats = true,
  className,
}: PlayerCardProps) {
  const winPct = getWinPercentage(player.wins, player.losses)
  const nameParts = player.user.name?.split(' ') || ['Unknown']
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')

  if (variant === 'compact') {
    return (
      <Link
        href={`/players/${player.id}`}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl bg-pingers-dark-card hover:bg-pingers-dark-lighter transition-all',
          className
        )}
      >
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-pingers-dark-lighter overflow-hidden flex-shrink-0">
          {player.photo ? (
            <Image
              src={player.photo}
              alt={player.nickname}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-pingers-lime font-bold">
              {player.nickname[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-pingers-cream font-bold truncate">
            &quot;{player.nickname}&quot;
          </p>
          <p className="text-pingers-cream/60 text-sm">{player.user.name}</p>
        </div>

        {/* Record */}
        <div className="text-right">
          <p className="text-pingers-lime font-bold">{winPct}%</p>
          <p className="text-pingers-cream/60 text-sm">
            {player.wins}W - {player.losses}L
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/players/${player.id}`}
      className={cn(
        'block rounded-xl overflow-hidden player-card-bg card-hover',
        variant === 'featured' && 'ring-2 ring-pingers-gold',
        className
      )}
    >
      {/* Player Image */}
      <div className="relative h-64 bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark">
        {player.photo ? (
          <Image
            src={player.photo}
            alt={player.nickname}
            fill
            className="object-cover object-top grayscale-[30%]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl font-black text-pingers-lime/20">
              {player.nickname[0]}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pingers-dark via-pingers-dark/50 to-transparent" />

        {/* Founding Season Badge */}
        {player.isFoundingSeason && (
          <div className="absolute top-4 right-4">
            <Badge variant="founding" size="sm">Founding Season</Badge>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-lg text-pingers-cream/80">{firstName}</p>
          <h3 className="text-2xl font-black text-white">
            &quot;<span className="text-pingers-cream">{player.nickname}</span>&quot;
          </h3>
          {lastName && (
            <p className="text-xl font-bold text-pingers-lime">{lastName}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tagline */}
        {player.tagline && (
          <p className="text-pingers-cream/60 italic mb-4 text-sm">
            {player.tagline}
          </p>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-pingers-lime">{player.wins}</p>
            <p className="text-xs text-pingers-cream/60 uppercase">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pingers-cream">{player.losses}</p>
            <p className="text-xs text-pingers-cream/60 uppercase">Losses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pingers-gold">{winPct}%</p>
            <p className="text-xs text-pingers-cream/60 uppercase">Win Rate</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex justify-between items-center py-2 border-t border-pingers-dark-lighter">
          <span className="text-pingers-cream/60 text-sm">Current Streak</span>
          <Badge variant={player.currentStreak > 0 ? 'lime' : 'default'} size="sm">
            {getStreakDisplay(player.currentStreak)}
          </Badge>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="mt-4 pt-4 border-t border-pingers-dark-lighter">
            <StatGrid
              stats={{
                defence: player.statDefence,
                spin: player.statSpin,
                serve: player.statServe,
                agility: player.statAgility,
                physicality: player.statPhysicality,
                complainometer: player.statComplainometer,
              }}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
