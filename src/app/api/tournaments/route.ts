import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
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

    return NextResponse.json(tournaments)
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      venue,
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants,
      groupCount,
      image,
    } = body

    const tournament = await prisma.tournament.create({
      data: {
        name,
        description,
        venue: venue || 'The Home of Pingers',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : null,
        maxParticipants: maxParticipants || 16,
        groupCount: groupCount || 4,
        image,
        status: 'upcoming',
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}
