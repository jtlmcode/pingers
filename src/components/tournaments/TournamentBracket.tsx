'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'

interface Match {
  id: string
  player1: {
    id: string
    nickname: string
    user: { name: string | null }
  }
  player2: {
    id: string
    nickname: string
    user: { name: string | null }
  }
  player1Score: number
  player2Score: number
  winnerId: string | null
  status: string
  bracketPosition: number | null
  stage: string
}

interface TournamentBracketProps {
  matches: Match[]
  stage: 'knockouts' | 'semi_final' | 'final' | 'consolation_semi' | 'consolation_final'
  title: string
  className?: string
}

export function TournamentBracket({
  matches,
  stage,
  title,
  className,
}: TournamentBracketProps) {
  const filteredMatches = matches
    .filter((m) => m.stage === stage)
    .sort((a, b) => (a.bracketPosition || 0) - (b.bracketPosition || 0))

  if (filteredMatches.length === 0) return null

  return (
    <div className={cn('', className)}>
      <h3 className="text-lg font-bold text-pingers-lime uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <BracketMatch key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}

function BracketMatch({ match }: { match: Match }) {
  const isComplete = match.status === 'completed'
  const isPlayer1Winner = match.winnerId === match.player1.id
  const isPlayer2Winner = match.winnerId === match.player2.id

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border',
        match.stage === 'final'
          ? 'border-pingers-gold bg-pingers-gold/5'
          : 'border-pingers-dark-lighter bg-pingers-dark-card'
      )}
    >
      {/* Player 1 */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 border-b border-pingers-dark-lighter',
          isComplete && isPlayer1Winner && 'bg-pingers-lime/10'
        )}
      >
        <div className="flex items-center gap-3">
          {isComplete && isPlayer1Winner && (
            <span className="w-2 h-2 rounded-full bg-pingers-lime" />
          )}
          <Link
            href={`/players/${match.player1.id}`}
            className="hover:text-pingers-lime transition-colors"
          >
            <span className={cn(
              'font-medium',
              isComplete && isPlayer1Winner ? 'text-pingers-cream' : 'text-pingers-cream/70'
            )}>
              &quot;{match.player1.nickname}&quot;
            </span>
          </Link>
        </div>
        <span
          className={cn(
            'text-xl font-bold',
            isComplete && isPlayer1Winner ? 'text-pingers-lime' : 'text-pingers-cream/50'
          )}
        >
          {match.player1Score}
        </span>
      </div>

      {/* Player 2 */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3',
          isComplete && isPlayer2Winner && 'bg-pingers-lime/10'
        )}
      >
        <div className="flex items-center gap-3">
          {isComplete && isPlayer2Winner && (
            <span className="w-2 h-2 rounded-full bg-pingers-lime" />
          )}
          <Link
            href={`/players/${match.player2.id}`}
            className="hover:text-pingers-lime transition-colors"
          >
            <span className={cn(
              'font-medium',
              isComplete && isPlayer2Winner ? 'text-pingers-cream' : 'text-pingers-cream/70'
            )}>
              &quot;{match.player2.nickname}&quot;
            </span>
          </Link>
        </div>
        <span
          className={cn(
            'text-xl font-bold',
            isComplete && isPlayer2Winner ? 'text-pingers-lime' : 'text-pingers-cream/50'
          )}
        >
          {match.player2Score}
        </span>
      </div>

      {/* Match Status */}
      {!isComplete && (
        <div className="px-4 py-2 bg-pingers-dark-lighter text-center">
          <Badge variant="lime" size="sm">
            {match.status === 'in_progress' ? 'Live' : 'Upcoming'}
          </Badge>
        </div>
      )}
    </div>
  )
}

interface GroupStandingsProps {
  group: {
    id: string
    name: string
    participants: {
      id: string
      player: {
        id: string
        nickname: string
        user: { name: string | null }
      }
      groupWins: number
      groupLosses: number
      groupPointsFor: number
      groupPointsAgainst: number
    }[]
  }
  className?: string
}

export function GroupStandings({ group, className }: GroupStandingsProps) {
  const sortedParticipants = [...group.participants].sort((a, b) => {
    // Sort by wins first
    if (b.groupWins !== a.groupWins) return b.groupWins - a.groupWins
    // Then by point difference
    const aDiff = a.groupPointsFor - a.groupPointsAgainst
    const bDiff = b.groupPointsFor - b.groupPointsAgainst
    return bDiff - aDiff
  })

  return (
    <div className={cn('bg-pingers-dark-card rounded-xl overflow-hidden', className)}>
      <div className="bg-pingers-dark-lighter px-4 py-3 border-b border-pingers-dark">
        <h3 className="font-bold text-pingers-lime">{group.name}</h3>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs uppercase text-pingers-cream/60 border-b border-pingers-dark-lighter">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Player</th>
            <th className="px-4 py-2 text-center">W</th>
            <th className="px-4 py-2 text-center">L</th>
            <th className="px-4 py-2 text-center">PF</th>
            <th className="px-4 py-2 text-center">PA</th>
            <th className="px-4 py-2 text-center">+/-</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((participant, index) => {
            const diff = participant.groupPointsFor - participant.groupPointsAgainst
            const qualifies = index < 2 // Top 2 qualify

            return (
              <tr
                key={participant.id}
                className={cn(
                  'border-b border-pingers-dark-lighter/50',
                  qualifies && 'bg-pingers-lime/5'
                )}
              >
                <td className="px-4 py-3">
                  <span className={cn(
                    'font-bold',
                    qualifies ? 'text-pingers-lime' : 'text-pingers-cream/60'
                  )}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/players/${participant.player.id}`}
                    className="font-medium text-pingers-cream hover:text-pingers-lime transition-colors"
                  >
                    &quot;{participant.player.nickname}&quot;
                  </Link>
                </td>
                <td className="px-4 py-3 text-center font-bold text-pingers-lime">
                  {participant.groupWins}
                </td>
                <td className="px-4 py-3 text-center text-pingers-cream/80">
                  {participant.groupLosses}
                </td>
                <td className="px-4 py-3 text-center text-pingers-cream/80">
                  {participant.groupPointsFor}
                </td>
                <td className="px-4 py-3 text-center text-pingers-cream/80">
                  {participant.groupPointsAgainst}
                </td>
                <td className={cn(
                  'px-4 py-3 text-center font-bold',
                  diff > 0 ? 'text-pingers-lime' : diff < 0 ? 'text-red-400' : 'text-pingers-cream/60'
                )}>
                  {diff > 0 ? '+' : ''}{diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
