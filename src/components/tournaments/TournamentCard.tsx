'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, Trophy, Clock } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { cn, formatDate, TOURNAMENT_STAGES } from '@/lib/utils'

interface TournamentCardProps {
  tournament: {
    id: string
    name: string
    description?: string | null
    venue: string
    startDate: Date
    endDate?: Date | null
    status: string
    maxParticipants: number
    image?: string | null
    champion?: {
      nickname: string
      user: { name: string | null }
    } | null
    _count?: {
      participants: number
    }
  }
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function TournamentCard({
  tournament,
  variant = 'default',
  className,
}: TournamentCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="lime">Upcoming</Badge>
      case 'registration':
        return <Badge variant="lime">Registration Open</Badge>
      case 'group_stage':
        return <Badge variant="stage">Group Stage</Badge>
      case 'knockouts':
        return <Badge variant="gold">Knockouts</Badge>
      case 'final':
        return <Badge variant="gold">Final</Badge>
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/tournaments/${tournament.id}`}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl bg-pingers-dark-card hover:bg-pingers-dark-lighter transition-all',
          className
        )}
      >
        <div className="w-16 h-16 rounded-lg bg-pingers-dark-lighter flex items-center justify-center flex-shrink-0">
          <Trophy className="text-pingers-lime" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-pingers-cream truncate">{tournament.name}</h3>
          <p className="text-sm text-pingers-cream/60">{formatDate(tournament.startDate)}</p>
        </div>
        {getStatusBadge(tournament.status)}
      </Link>
    )
  }

  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <Card
        variant={variant === 'featured' ? 'gold' : 'bordered'}
        hover
        className={cn('overflow-hidden', className)}
      >
        {/* Image */}
        <div className="relative h-48 -mx-6 -mt-6 mb-6 bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark overflow-hidden">
          {tournament.image ? (
            <Image
              src={tournament.image}
              alt={tournament.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy size={64} className="text-pingers-lime/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-pingers-dark via-pingers-dark/50 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {getStatusBadge(tournament.status)}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-black text-pingers-cream">{tournament.name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Description */}
          {tournament.description && (
            <p className="text-pingers-cream/60 text-sm line-clamp-2">
              {tournament.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-pingers-cream/80">
              <Calendar size={16} className="text-pingers-lime" />
              <span className="text-sm">{formatDate(tournament.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-pingers-cream/80">
              <MapPin size={16} className="text-pingers-lime" />
              <span className="text-sm truncate">{tournament.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-pingers-cream/80">
              <Users size={16} className="text-pingers-lime" />
              <span className="text-sm">
                {tournament._count?.participants || 0}/{tournament.maxParticipants}
              </span>
            </div>
            {tournament.status === 'completed' && tournament.champion && (
              <div className="flex items-center gap-2 text-pingers-gold">
                <Trophy size={16} />
                <span className="text-sm font-bold truncate">
                  {tournament.champion.nickname}
                </span>
              </div>
            )}
          </div>

          {/* Registration Status */}
          {tournament.status === 'registration' && (
            <div className="pt-4 border-t border-pingers-dark-lighter">
              <div className="flex items-center justify-between">
                <span className="text-pingers-lime text-sm font-medium">Registration Open</span>
                <Badge variant="lime" size="sm">
                  {tournament.maxParticipants - (tournament._count?.participants || 0)} spots left
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
