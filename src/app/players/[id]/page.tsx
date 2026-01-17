import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trophy, Target, Flame, Calendar, Swords } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Badge, Button, Card, StatGrid } from '@/components/ui'
import { cn, getWinPercentage, getStreakDisplay, formatDate } from '@/lib/utils'

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

async function getPlayer(id: string) {
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      matchesAsPlayer1: {
        include: {
          player2: {
            include: {
              user: { select: { name: true } },
            },
          },
          tournament: { select: { name: true } },
        },
        orderBy: { completedAt: 'desc' },
        take: 10,
      },
      matchesAsPlayer2: {
        include: {
          player1: {
            include: {
              user: { select: { name: true } },
            },
          },
          tournament: { select: { name: true } },
        },
        orderBy: { completedAt: 'desc' },
        take: 10,
      },
      tournamentsWon: {
        select: { id: true, name: true, startDate: true },
        orderBy: { startDate: 'desc' },
      },
      headToHeadAsPlayer1: {
        include: {
          player2: {
            include: { user: { select: { name: true } } },
          },
        },
      },
      headToHeadAsPlayer2: {
        include: {
          player1: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  })
  return player
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params
  const player = await getPlayer(id)

  if (!player) {
    notFound()
  }

  const nameParts = player.user.name?.split(' ') || ['Unknown']
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')
  const winPct = getWinPercentage(player.wins, player.losses)
  const totalGames = player.wins + player.losses
  const avgPointsScored = totalGames > 0 ? (player.totalPointsScored / totalGames).toFixed(1) : '0'
  const avgPointsAgainst = totalGames > 0 ? (player.totalPointsAgainst / totalGames).toFixed(1) : '0'

  // Combine recent matches
  const recentMatches = [
    ...player.matchesAsPlayer1.map((m) => ({
      ...m,
      opponent: m.player2,
      playerScore: m.player1Score,
      opponentScore: m.player2Score,
      won: m.winnerId === player.id,
    })),
    ...player.matchesAsPlayer2.map((m) => ({
      ...m,
      opponent: m.player1,
      playerScore: m.player2Score,
      opponentScore: m.player1Score,
      won: m.winnerId === player.id,
    })),
  ]
    .filter((m) => m.status === 'completed')
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 10)

  // Combine head to head records
  const h2hRecords = [
    ...player.headToHeadAsPlayer1.map((h) => ({
      opponent: h.player2,
      wins: h.player1Wins,
      losses: h.player2Wins,
    })),
    ...player.headToHeadAsPlayer2.map((h) => ({
      opponent: h.player1,
      wins: h.player2Wins,
      losses: h.player1Wins,
    })),
  ].sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses))

  return (
    <div className="min-h-screen">
      {/* Hero Section with Player Image */}
      <section className="relative bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/players">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
              All Players
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Player Image */}
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              {player.photo ? (
                <Image
                  src={player.photo}
                  alt={player.nickname}
                  fill
                  className="object-cover object-top grayscale-[30%]"
                />
              ) : (
                <div className="w-full h-full bg-pingers-dark-card flex items-center justify-center">
                  <span className="text-[200px] font-black text-pingers-lime/10">
                    {player.nickname[0]}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-pingers-dark via-transparent to-transparent" />

              {/* Founding Badge */}
              {player.isFoundingSeason && (
                <div className="absolute top-4 right-4">
                  <Badge variant="founding">Founding Season</Badge>
                </div>
              )}
            </div>

            {/* Player Info */}
            <div>
              {/* Name */}
              <p className="text-2xl text-pingers-cream/80 mb-2">{firstName}</p>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                &quot;<span className="text-pingers-cream">{player.nickname}</span>&quot;
              </h1>
              {lastName && (
                <p className="text-3xl font-bold text-pingers-lime mb-6">{lastName}</p>
              )}

              {/* Tagline */}
              {player.tagline && (
                <p className="text-xl text-pingers-cream/60 italic mb-8">
                  {player.tagline}
                </p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card variant="bordered" className="text-center py-4">
                  <p className="text-3xl font-black text-pingers-lime">{player.wins}</p>
                  <p className="text-sm text-pingers-cream/60 uppercase">Wins</p>
                </Card>
                <Card variant="bordered" className="text-center py-4">
                  <p className="text-3xl font-black text-pingers-cream">{player.losses}</p>
                  <p className="text-sm text-pingers-cream/60 uppercase">Losses</p>
                </Card>
                <Card variant="bordered" className="text-center py-4">
                  <p className="text-3xl font-black text-pingers-gold">{winPct}%</p>
                  <p className="text-sm text-pingers-cream/60 uppercase">Win Rate</p>
                </Card>
                <Card variant="bordered" className="text-center py-4">
                  <p className={cn(
                    'text-3xl font-black',
                    player.currentStreak > 0 ? 'text-pingers-lime' : player.currentStreak < 0 ? 'text-red-500' : 'text-pingers-cream/40'
                  )}>
                    {getStreakDisplay(player.currentStreak)}
                  </p>
                  <p className="text-sm text-pingers-cream/60 uppercase">Streak</p>
                </Card>
              </div>

              {/* Championships */}
              {player.tournamentsWon.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="text-pingers-gold" size={24} />
                  <span className="text-pingers-gold font-bold">
                    {player.tournamentsWon.length}x Champion
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Analytics */}
      <section className="py-12 px-4 bg-pingers-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Stats */}
            <Card variant="elevated" className="lg:col-span-1">
              <h2 className="text-xl font-bold text-pingers-cream mb-6 flex items-center gap-2">
                <Target className="text-pingers-lime" size={20} />
                Skill Profile
              </h2>
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
            </Card>

            {/* Advanced Stats */}
            <Card variant="elevated" className="lg:col-span-2">
              <h2 className="text-xl font-bold text-pingers-cream mb-6 flex items-center gap-2">
                <Flame className="text-pingers-lime" size={20} />
                Analytics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Total Games</p>
                  <p className="text-2xl font-bold text-pingers-cream">{totalGames}</p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Avg Points Scored</p>
                  <p className="text-2xl font-bold text-pingers-lime">{avgPointsScored}</p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Avg Points Against</p>
                  <p className="text-2xl font-bold text-pingers-cream">{avgPointsAgainst}</p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Point Diff</p>
                  <p className={cn(
                    'text-2xl font-bold',
                    player.totalPointsScored - player.totalPointsAgainst > 0 ? 'text-pingers-lime' : 'text-red-400'
                  )}>
                    {player.totalPointsScored - player.totalPointsAgainst > 0 ? '+' : ''}
                    {player.totalPointsScored - player.totalPointsAgainst}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Best Win Streak</p>
                  <p className="text-2xl font-bold text-pingers-gold">{player.longestWinStreak}</p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Worst Lose Streak</p>
                  <p className="text-2xl font-bold text-red-400">{player.longestLoseStreak}</p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Total Points Scored</p>
                  <p className="text-2xl font-bold text-pingers-cream">{player.totalPointsScored}</p>
                </div>
                <div>
                  <p className="text-sm text-pingers-cream/60 uppercase mb-1">Total Points Against</p>
                  <p className="text-2xl font-bold text-pingers-cream">{player.totalPointsAgainst}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Head to Head Records */}
      {h2hRecords.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-pingers-cream mb-6 flex items-center gap-2">
              <Swords className="text-pingers-lime" size={24} />
              Head to Head Records
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {h2hRecords.map((record) => (
                <Link
                  key={record.opponent.id}
                  href={`/players/${record.opponent.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-pingers-dark-card hover:bg-pingers-dark-lighter transition-colors"
                >
                  <div>
                    <p className="font-bold text-pingers-cream">
                      &quot;{record.opponent.nickname}&quot;
                    </p>
                    <p className="text-sm text-pingers-cream/60">{record.opponent.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'text-xl font-bold',
                      record.wins > record.losses ? 'text-pingers-lime' : record.wins < record.losses ? 'text-red-400' : 'text-pingers-cream'
                    )}>
                      {record.wins} - {record.losses}
                    </p>
                    <p className="text-xs text-pingers-cream/60">
                      {getWinPercentage(record.wins, record.losses)}% win rate
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <section className="py-12 px-4 bg-pingers-dark-lighter/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-pingers-cream mb-6 flex items-center gap-2">
              <Calendar className="text-pingers-lime" size={24} />
              Recent Matches
            </h2>
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl',
                    match.won
                      ? 'bg-pingers-lime/10 border-l-4 border-pingers-lime'
                      : 'bg-red-500/10 border-l-4 border-red-500'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={match.won ? 'lime' : 'default'} size="sm">
                      {match.won ? 'W' : 'L'}
                    </Badge>
                    <div>
                      <p className="font-bold text-pingers-cream">
                        vs &quot;{match.opponent.nickname}&quot;
                      </p>
                      <p className="text-sm text-pingers-cream/60">
                        {match.tournament?.name || 'Practice Match'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-pingers-cream">
                      {match.playerScore} - {match.opponentScore}
                    </p>
                    {match.completedAt && (
                      <p className="text-xs text-pingers-cream/60">
                        {formatDate(match.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Championship Trophies */}
      {player.tournamentsWon.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-pingers-cream mb-6 flex items-center gap-2">
              <Trophy className="text-pingers-gold" size={24} />
              Championships
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {player.tournamentsWon.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="p-6 rounded-xl bg-gradient-to-r from-pingers-gold/20 to-pingers-dark-card border border-pingers-gold/30 hover:border-pingers-gold transition-colors"
                >
                  <Trophy className="text-pingers-gold mb-3" size={32} />
                  <h3 className="font-bold text-pingers-cream text-lg">{tournament.name}</h3>
                  <p className="text-pingers-cream/60 text-sm">{formatDate(tournament.startDate)}</p>
                  <Badge variant="winner" size="sm" className="mt-3">
                    Champion
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
