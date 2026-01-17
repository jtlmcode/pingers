import { Suspense } from 'react'
import { Trophy, Calendar, Plus } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Badge, Button } from '@/components/ui'
import { TournamentCard } from '@/components/tournaments'
import Link from 'next/link'

async function getTournaments() {
  const tournaments = await prisma.tournament.findMany({
    include: {
      champion: {
        include: {
          user: { select: { name: true } },
        },
      },
      _count: {
        select: { participants: true },
      },
    },
    orderBy: { startDate: 'desc' },
  })
  return tournaments
}

function TournamentsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-80 rounded-xl bg-pingers-dark-card animate-pulse"
        />
      ))}
    </div>
  )
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments()

  const activeTournaments = tournaments.filter(
    (t) => !['completed', 'upcoming'].includes(t.status)
  )
  const upcomingTournaments = tournaments.filter((t) => t.status === 'upcoming')
  const completedTournaments = tournaments.filter((t) => t.status === 'completed')

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Trophy className="text-pingers-gold" size={40} />
                <Badge variant="stage" size="lg">
                  GROUP STAGE → KNOCKOUTS → FINAL
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-pingers-cream mb-4">
                TOURNAMENTS
              </h1>
              <p className="text-xl text-pingers-cream/60 max-w-2xl">
                12 players enter. Balls to the wall. Friendships tested. Heroes emerge.
                Winner takes the glory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Tournaments */}
      {activeTournaments.length > 0 && (
        <section className="py-12 px-4 bg-pingers-dark-lighter/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-pingers-lime animate-pulse" />
              <h2 className="text-2xl font-bold text-pingers-cream">
                Live Tournaments
              </h2>
            </div>
            <Suspense fallback={<TournamentsLoading />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTournaments.map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    variant="featured"
                  />
                ))}
              </div>
            </Suspense>
          </div>
        </section>
      )}

      {/* Upcoming Tournaments */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="text-pingers-lime" size={24} />
              <h2 className="text-2xl font-bold text-pingers-cream">
                Upcoming ({upcomingTournaments.length})
              </h2>
            </div>
          </div>

          <Suspense fallback={<TournamentsLoading />}>
            {upcomingTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-pingers-dark-card rounded-xl">
                <Calendar size={48} className="mx-auto text-pingers-cream/20 mb-4" />
                <h3 className="text-lg font-bold text-pingers-cream mb-2">
                  No Upcoming Tournaments
                </h3>
                <p className="text-pingers-cream/60 mb-4">
                  Check back soon for the next championship!
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* Completed Tournaments */}
      {completedTournaments.length > 0 && (
        <section className="py-12 px-4 bg-pingers-dark-lighter/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="text-pingers-gold" size={24} />
              <h2 className="text-2xl font-bold text-pingers-cream">
                Past Champions ({completedTournaments.length})
              </h2>
            </div>
            <Suspense fallback={<TournamentsLoading />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            </Suspense>
          </div>
        </section>
      )}

      {/* Empty State */}
      {tournaments.length === 0 && (
        <section className="py-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <Trophy size={64} className="mx-auto text-pingers-cream/20 mb-6" />
            <h2 className="text-2xl font-bold text-pingers-cream mb-4">
              No Tournaments Yet
            </h2>
            <p className="text-pingers-cream/60 mb-8">
              The first PINGERS World Championship is coming soon. Get ready to compete!
            </p>
            <Link href="/the-code">
              <Button variant="secondary">
                Learn The Rules
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
