import { Suspense } from 'react'
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Badge, Button, Card } from '@/components/ui'
import { formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'

async function getScheduleData() {
  const [upcomingTournaments, practiceSessions] = await Promise.all([
    prisma.tournament.findMany({
      where: {
        status: { in: ['upcoming', 'registration'] },
      },
      include: {
        _count: { select: { participants: true } },
      },
      orderBy: { startDate: 'asc' },
      take: 5,
    }),
    prisma.practiceSession.findMany({
      where: {
        date: { gte: new Date() },
      },
      include: {
        attendances: {
          include: {
            player: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
      take: 10,
    }),
  ])
  return { upcomingTournaments, practiceSessions }
}

export default async function SchedulePage() {
  const { upcomingTournaments, practiceSessions } = await getScheduleData()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="text-pingers-lime" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-pingers-cream mb-4">
            SCHEDULE
          </h1>
          <p className="text-xl text-pingers-cream/60 max-w-2xl">
            Upcoming tournaments and practice sessions. Mark your calendar and come get some.
          </p>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-pingers-cream mb-6 flex items-center gap-3">
            <Badge variant="lime">Tournaments</Badge>
          </h2>

          {upcomingTournaments.length > 0 ? (
            <div className="space-y-4">
              {upcomingTournaments.map((tournament) => (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <Card
                    variant="bordered"
                    hover
                    className="flex items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6">
                      {/* Date Box */}
                      <div className="w-20 h-20 rounded-xl bg-pingers-lime/20 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black text-pingers-lime">
                          {new Date(tournament.startDate).getDate()}
                        </span>
                        <span className="text-xs text-pingers-lime uppercase">
                          {new Date(tournament.startDate).toLocaleDateString('en-AU', { month: 'short' })}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-xl font-bold text-pingers-cream mb-1">
                          {tournament.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-pingers-cream/60">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {tournament.venue}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {tournament._count.participants}/{tournament.maxParticipants} players
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant={tournament.status === 'registration' ? 'lime' : 'default'}>
                        {tournament.status === 'registration' ? 'Registration Open' : 'Upcoming'}
                      </Badge>
                      <ChevronRight className="text-pingers-cream/40" size={20} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card variant="bordered" className="text-center py-12">
              <Calendar size={48} className="mx-auto text-pingers-cream/20 mb-4" />
              <h3 className="text-lg font-bold text-pingers-cream mb-2">
                No Upcoming Tournaments
              </h3>
              <p className="text-pingers-cream/60">
                Check back soon for the next championship!
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Practice Sessions */}
      <section className="py-12 px-4 bg-pingers-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-pingers-cream mb-6 flex items-center gap-3">
            <Badge variant="stage">Practice Sessions</Badge>
          </h2>

          {practiceSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {practiceSessions.map((session) => {
                const confirmedCount = session.attendances.filter(
                  (a) => a.status === 'confirmed' || a.status === 'attended'
                ).length

                return (
                  <Card key={session.id} variant="bordered" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-pingers-cream">{session.name}</h3>
                        <p className="text-sm text-pingers-cream/60">{session.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-pingers-cream/80 text-sm">
                        <Calendar size={14} className="text-pingers-lime" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center gap-2 text-pingers-cream/80 text-sm">
                        <Clock size={14} className="text-pingers-lime" />
                        {new Date(session.date).toLocaleTimeString('en-AU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {session.duration && ` (${session.duration} min)`}
                      </div>
                      <div className="flex items-center gap-2 text-pingers-cream/80 text-sm">
                        <MapPin size={14} className="text-pingers-lime" />
                        {session.venue}
                      </div>
                      <div className="flex items-center gap-2 text-pingers-cream/80 text-sm">
                        <Users size={14} className="text-pingers-lime" />
                        {confirmedCount} confirmed
                      </div>
                    </div>

                    {/* Attendees */}
                    {session.attendances.length > 0 && (
                      <div className="pt-4 border-t border-pingers-dark-lighter">
                        <p className="text-xs text-pingers-cream/60 uppercase mb-2">Attending</p>
                        <div className="flex flex-wrap gap-2">
                          {session.attendances
                            .filter((a) => a.status === 'confirmed')
                            .slice(0, 5)
                            .map((attendance) => (
                              <span
                                key={attendance.id}
                                className="text-xs px-2 py-1 bg-pingers-dark rounded-full text-pingers-lime"
                              >
                                {attendance.player.nickname}
                              </span>
                            ))}
                          {session.attendances.filter((a) => a.status === 'confirmed').length > 5 && (
                            <span className="text-xs px-2 py-1 bg-pingers-dark rounded-full text-pingers-cream/60">
                              +{session.attendances.filter((a) => a.status === 'confirmed').length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button variant="secondary" size="sm" className="w-full mt-4">
                      RSVP
                    </Button>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card variant="bordered" className="text-center py-12">
              <Clock size={48} className="mx-auto text-pingers-cream/20 mb-4" />
              <h3 className="text-lg font-bold text-pingers-cream mb-2">
                No Practice Sessions Scheduled
              </h3>
              <p className="text-pingers-cream/60">
                Practice sessions will appear here when scheduled.
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-pingers-cream mb-4">
          Want to play?
        </h2>
        <p className="text-pingers-cream/60 mb-6">
          Join Pingers to get notified about upcoming events.
        </p>
        <Link href="/login">
          <Button variant="primary">Join Now</Button>
        </Link>
      </section>
    </div>
  )
}
