import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournamentId')
    const playerId = searchParams.get('playerId')

    const where: any = {}
    if (tournamentId) where.tournamentId = tournamentId
    if (playerId) {
      where.OR = [{ player1Id: playerId }, { player2Id: playerId }]
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        player1: {
          include: { user: { select: { name: true } } },
        },
        player2: {
          include: { user: { select: { name: true } } },
        },
        winner: {
          include: { user: { select: { name: true } } },
        },
        tournament: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tournamentId,
      groupId,
      player1Id,
      player2Id,
      stage,
      bracketPosition,
      scheduledTime,
    } = body

    const match = await prisma.match.create({
      data: {
        tournamentId,
        groupId,
        player1Id,
        player2Id,
        stage: stage || 'group',
        bracketPosition,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        status: 'scheduled',
      },
      include: {
        player1: {
          include: { user: { select: { name: true } } },
        },
        player2: {
          include: { user: { select: { name: true } } },
        },
      },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}
