import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Trophy, MapPin, Calendar, Users, Crown } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Badge, Button, Card } from '@/components/ui'
import { GroupStandings, TournamentBracket } from '@/components/tournaments'
import { cn, formatDate, formatDateTime, TOURNAMENT_STAGES } from '@/lib/utils'

interface TournamentPageProps {
  params: Promise<{ id: string }>
}

async function getTournament(id: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      champion: {
        include: {
          user: { select: { name: true } },
        },
      },
      consolationChampion: {
        include: {
          user: { select: { name: true } },
        },
      },
      participants: {
        include: {
          player: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { seed: 'asc' },
      },
      groups: {
        include: {
          participants: {
            include: {
              player: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      },
      matches: {
        include: {
          player1: {
            include: {
              user: { select: { name: true } },
            },
          },
          player2: {
            include: {
              user: { select: { name: true } },
            },
          },
          winner: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
        orderBy: [{ stage: 'asc' }, { bracketPosition: 'asc' }],
      },
    },
  })
  return tournament
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { id } = await params
  const tournament = await getTournament(id)

  if (!tournament) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'registration':
        return 'text-pingers-lime'
      case 'group_stage':
      case 'knockouts':
        return 'text-pingers-gold'
      case 'final':
        return 'text-pingers-gold'
      case 'completed':
        return 'text-pingers-cream/60'
      default:
        return 'text-pingers-cream'
    }
  }

  const groupMatches = tournament.matches.filter((m) => m.stage === 'group')
  const knockoutMatches = tournament.matches.filter((m) =>
    ['quarter_final', 'semi_final', 'final', 'consolation_semi', 'consolation_final'].includes(m.stage)
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/tournaments">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
              All Tournaments
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Tournament Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              {tournament.image ? (
                <Image
                  src={tournament.image}
                  alt={tournament.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-pingers-dark-card flex items-center justify-center">
                  <Trophy size={120} className="text-pingers-lime/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-pingers-dark via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <Badge
                  variant={tournament.status === 'completed' ? 'default' : 'lime'}
                  size="lg"
                >
                  {TOURNAMENT_STAGES[tournament.status as keyof typeof TOURNAMENT_STAGES] || tournament.status}
                </Badge>
              </div>
            </div>

            {/* Tournament Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-pingers-cream mb-6">
                {tournament.name}
              </h1>

              {tournament.description && (
                <p className="text-xl text-pingers-cream/60 mb-8">
                  {tournament.description}
                </p>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card variant="bordered" className="flex items-center gap-3 py-4">
                  <Calendar className="text-pingers-lime" size={24} />
                  <div>
                    <p className="text-xs text-pingers-cream/60 uppercase">Date</p>
                    <p className="text-pingers-cream font-medium">
                      {formatDate(tournament.startDate)}
                    </p>
                  </div>
                </Card>
                <Card variant="bordered" className="flex items-center gap-3 py-4">
                  <MapPin className="text-pingers-lime" size={24} />
                  <div>
                    <p className="text-xs text-pingers-cream/60 uppercase">Venue</p>
                    <p className="text-pingers-cream font-medium">{tournament.venue}</p>
                  </div>
                </Card>
                <Card variant="bordered" className="flex items-center gap-3 py-4">
                  <Users className="text-pingers-lime" size={24} />
                  <div>
                    <p className="text-xs text-pingers-cream/60 uppercase">Players</p>
                    <p className="text-pingers-cream font-medium">
                      {tournament.participants.length}/{tournament.maxParticipants}
                    </p>
                  </div>
                </Card>
                <Card variant="bordered" className="flex items-center gap-3 py-4">
                  <Trophy className="text-pingers-gold" size={24} />
                  <div>
                    <p className="text-xs text-pingers-cream/60 uppercase">Status</p>
                    <p className={cn('font-medium', getStatusColor(tournament.status))}>
                      {TOURNAMENT_STAGES[tournament.status as keyof typeof TOURNAMENT_STAGES] || tournament.status}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Champion Display */}
              {tournament.status === 'completed' && tournament.champion && (
                <Card variant="gold" className="flex items-center gap-4">
                  <Crown className="text-pingers-gold" size={40} />
                  <div>
                    <p className="text-xs text-pingers-gold uppercase tracking-wider">Champion</p>
                    <Link
                      href={`/players/${tournament.champion.id}`}
                      className="text-2xl font-black text-pingers-cream hover:text-pingers-gold transition-colors"
                    >
                      &quot;{tournament.champion.nickname}&quot;
                    </Link>
                    <p className="text-pingers-cream/60">{tournament.champion.user.name}</p>
                  </div>
                </Card>
              )}

              {/* Registration CTA */}
              {tournament.status === 'registration' && (
                <div className="mt-6">
                  <Button variant="primary" size="lg" className="w-full">
                    Register Now
                  </Button>
                  <p className="text-center text-pingers-cream/60 text-sm mt-2">
                    {tournament.maxParticipants - tournament.participants.length} spots remaining
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Group Stage */}
      {tournament.groups.length > 0 && (
        <section className="py-12 px-4 bg-pingers-dark-lighter/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Badge variant="stage" size="lg">GROUP STAGE</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournament.groups.map((group) => (
                <GroupStandings key={group.id} group={group} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Group Stage Matches */}
      {groupMatches.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-pingers-cream mb-6">Group Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupMatches.map((match) => (
                <Card key={match.id} variant="bordered" className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Link
                      href={`/players/${match.player1.id}`}
                      className={cn(
                        'font-medium hover:text-pingers-lime transition-colors',
                        match.winnerId === match.player1.id ? 'text-pingers-lime' : 'text-pingers-cream/70'
                      )}
                    >
                      &quot;{match.player1.nickname}&quot;
                    </Link>
                    <span className={cn(
                      'text-xl font-bold',
                      match.winnerId === match.player1.id ? 'text-pingers-lime' : 'text-pingers-cream/50'
                    )}>
                      {match.player1Score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/players/${match.player2.id}`}
                      className={cn(
                        'font-medium hover:text-pingers-lime transition-colors',
                        match.winnerId === match.player2.id ? 'text-pingers-lime' : 'text-pingers-cream/70'
                      )}
                    >
                      &quot;{match.player2.nickname}&quot;
                    </Link>
                    <span className={cn(
                      'text-xl font-bold',
                      match.winnerId === match.player2.id ? 'text-pingers-lime' : 'text-pingers-cream/50'
                    )}>
                      {match.player2Score}
                    </span>
                  </div>
                  {match.status !== 'completed' && (
                    <div className="mt-2 pt-2 border-t border-pingers-dark-lighter text-center">
                      <Badge variant="lime" size="sm">
                        {match.status === 'in_progress' ? 'Live' : 'Upcoming'}
                      </Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Knockout Stage */}
      {knockoutMatches.length > 0 && (
        <section className="py-12 px-4 bg-pingers-dark-lighter/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Badge variant="gold" size="lg">KNOCKOUTS</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <TournamentBracket
                matches={knockoutMatches as any}
                stage="quarter_final"
                title="Quarter Finals"
              />
              <TournamentBracket
                matches={knockoutMatches as any}
                stage="semi_final"
                title="Semi Finals"
              />
              <TournamentBracket
                matches={knockoutMatches as any}
                stage="final"
                title="Final"
              />
            </div>

            {/* Consolidation */}
            {knockoutMatches.some((m) => m.stage.includes('consolation')) && (
              <div className="mt-12 pt-12 border-t border-pingers-dark-lighter">
                <h3 className="text-xl font-bold text-pingers-cream mb-6">Consolidation Round</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <TournamentBracket
                    matches={knockoutMatches as any}
                    stage="consolation_semi"
                    title="Consolation Semi"
                  />
                  <TournamentBracket
                    matches={knockoutMatches as any}
                    stage="consolation_final"
                    title="Consolidation Final"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Participants List */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-pingers-cream mb-6">
            Participants ({tournament.participants.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tournament.participants.map((p) => (
              <Link
                key={p.id}
                href={`/players/${p.player.id}`}
                className="p-4 rounded-xl bg-pingers-dark-card hover:bg-pingers-dark-lighter transition-colors text-center"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-pingers-dark-lighter flex items-center justify-center">
                  <span className="text-pingers-lime font-bold">
                    {p.player.nickname[0]}
                  </span>
                </div>
                <p className="font-medium text-pingers-cream text-sm truncate">
                  &quot;{p.player.nickname}&quot;
                </p>
                {p.seed && (
                  <p className="text-xs text-pingers-cream/60">Seed #{p.seed}</p>
                )}
                {p.finalPosition && (
                  <Badge
                    variant={p.finalPosition === 1 ? 'winner' : 'default'}
                    size="sm"
                    className="mt-2"
                  >
                    #{p.finalPosition}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Consolation Champion */}
      {tournament.consolationChampion && (
        <section className="py-12 px-4 bg-pingers-dark-lighter/30">
          <div className="max-w-7xl mx-auto">
            <Card variant="bordered" className="flex items-center gap-4 max-w-md">
              <Trophy className="text-gray-400" size={32} />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Consolidation Champion
                </p>
                <Link
                  href={`/players/${tournament.consolationChampion.id}`}
                  className="text-xl font-bold text-pingers-cream hover:text-pingers-lime transition-colors"
                >
                  &quot;{tournament.consolationChampion.nickname}&quot;
                </Link>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
