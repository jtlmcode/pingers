'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn, getWinPercentage, getStreakDisplay } from '@/lib/utils'

interface LeaderboardPlayer {
  id: string
  nickname: string
  photo?: string | null
  isFoundingSeason: boolean
  wins: number
  losses: number
  currentStreak: number
  totalPointsScored: number
  totalPointsAgainst: number
  user: {
    name: string | null
  }
}

interface LeaderboardProps {
  players: LeaderboardPlayer[]
  className?: string
}

export function Leaderboard({ players, className }: LeaderboardProps) {
  // Sort by win percentage, then by total wins
  const sortedPlayers = [...players].sort((a, b) => {
    const aWinPct = getWinPercentage(a.wins, a.losses)
    const bWinPct = getWinPercentage(b.wins, b.losses)
    if (bWinPct !== aWinPct) return bWinPct - aWinPct
    return b.wins - a.wins
  })

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-pingers-gold/20 to-transparent border-l-4 border-pingers-gold'
      case 2:
        return 'bg-gradient-to-r from-gray-400/10 to-transparent border-l-4 border-gray-400'
      case 3:
        return 'bg-gradient-to-r from-amber-700/10 to-transparent border-l-4 border-amber-700'
      default:
        return ''
    }
  }

  const getStreakIcon = (streak: number) => {
    if (streak > 0) return <TrendingUp size={14} className="text-pingers-lime" />
    if (streak < 0) return <TrendingDown size={14} className="text-red-500" />
    return <Minus size={14} className="text-pingers-cream/40" />
  }

  return (
    <div className={cn('bg-pingers-dark-card rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-pingers-dark-lighter px-6 py-4 border-b border-pingers-dark">
        <div className="flex items-center gap-3">
          <Trophy className="text-pingers-gold" size={24} />
          <h2 className="text-xl font-bold text-pingers-cream">Leaderboard</h2>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-pingers-cream/60 border-b border-pingers-dark-lighter">
              <th className="px-6 py-3 w-16">Rank</th>
              <th className="px-6 py-3">Player</th>
              <th className="px-6 py-3 text-center">W</th>
              <th className="px-6 py-3 text-center">L</th>
              <th className="px-6 py-3 text-center">Win %</th>
              <th className="px-6 py-3 text-center">PF</th>
              <th className="px-6 py-3 text-center">PA</th>
              <th className="px-6 py-3 text-center">Streak</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const rank = index + 1
              const winPct = getWinPercentage(player.wins, player.losses)

              return (
                <tr
                  key={player.id}
                  className={cn(
                    'border-b border-pingers-dark-lighter/50 hover:bg-pingers-dark-lighter/30 transition-colors',
                    getRankStyle(rank)
                  )}
                >
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'font-bold text-lg',
                        rank === 1 && 'text-pingers-gold',
                        rank === 2 && 'text-gray-400',
                        rank === 3 && 'text-amber-700',
                        rank > 3 && 'text-pingers-cream/60'
                      )}
                    >
                      {rank}
                    </span>
                  </td>

                  {/* Player */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/players/${player.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-pingers-dark-lighter overflow-hidden flex-shrink-0">
                        {player.photo ? (
                          <Image
                            src={player.photo}
                            alt={player.nickname}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pingers-lime font-bold text-sm">
                            {player.nickname[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-pingers-cream">
                          &quot;{player.nickname}&quot;
                        </p>
                        <p className="text-xs text-pingers-cream/60">{player.user.name}</p>
                      </div>
                      {player.isFoundingSeason && (
                        <Badge variant="founding" size="sm" className="ml-2">
                          F
                        </Badge>
                      )}
                    </Link>
                  </td>

                  {/* Wins */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-pingers-lime">{player.wins}</span>
                  </td>

                  {/* Losses */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-pingers-cream/80">{player.losses}</span>
                  </td>

                  {/* Win Percentage */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        'font-bold',
                        winPct >= 60 && 'text-pingers-lime',
                        winPct >= 40 && winPct < 60 && 'text-pingers-cream',
                        winPct < 40 && 'text-red-400'
                      )}
                    >
                      {winPct}%
                    </span>
                  </td>

                  {/* Points For */}
                  <td className="px-6 py-4 text-center text-pingers-cream/60">
                    {player.totalPointsScored}
                  </td>

                  {/* Points Against */}
                  <td className="px-6 py-4 text-center text-pingers-cream/60">
                    {player.totalPointsAgainst}
                  </td>

                  {/* Streak */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getStreakIcon(player.currentStreak)}
                      <span
                        className={cn(
                          'font-medium',
                          player.currentStreak > 0 && 'text-pingers-lime',
                          player.currentStreak < 0 && 'text-red-400',
                          player.currentStreak === 0 && 'text-pingers-cream/40'
                        )}
                      >
                        {getStreakDisplay(player.currentStreak)}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {players.length === 0 && (
        <div className="px-6 py-12 text-center text-pingers-cream/60">
          No players yet. Be the first to join!
        </div>
      )}
    </div>
  )
}
