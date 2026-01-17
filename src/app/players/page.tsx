import { Suspense } from 'react'
import { Users, Trophy, LayoutGrid, List } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Badge, Button } from '@/components/ui'
import { PlayerCard, Leaderboard } from '@/components/players'

async function getPlayers() {
  const players = await prisma.player.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { wins: 'desc' },
      { losses: 'asc' },
    ],
  })
  return players
}

function PlayersLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-96 rounded-xl bg-pingers-dark-card animate-pulse"
        />
      ))}
    </div>
  )
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Users className="text-pingers-lime" size={40} />
            <div>
              <Badge variant="founding" size="sm">Founding Season</Badge>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-pingers-cream mb-4">
            THE PLAYERS
          </h1>
          <p className="text-xl text-pingers-cream/60 max-w-2xl">
            Meet the legends of Pingers. The Founding Season members who started it all.
            Defence as strong as their moustaches.
          </p>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12 px-4 bg-pingers-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="h-96 animate-pulse bg-pingers-dark-card rounded-xl" />}>
            <Leaderboard players={players} />
          </Suspense>
        </div>
      </section>

      {/* Players Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-pingers-cream">
              All Players ({players.length})
            </h2>
          </div>

          <Suspense fallback={<PlayersLoading />}>
            {players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    showStats={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Users size={64} className="mx-auto text-pingers-cream/20 mb-4" />
                <h3 className="text-xl font-bold text-pingers-cream mb-2">
                  No Players Yet
                </h3>
                <p className="text-pingers-cream/60 mb-6">
                  Be the first to join the Pingers championship!
                </p>
                <Button variant="primary">Join Now</Button>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  )
}
