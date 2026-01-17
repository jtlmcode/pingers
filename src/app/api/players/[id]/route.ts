import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
              include: { user: { select: { name: true } } },
            },
            tournament: { select: { name: true } },
          },
          orderBy: { completedAt: 'desc' },
          take: 20,
        },
        matchesAsPlayer2: {
          include: {
            player1: {
              include: { user: { select: { name: true } } },
            },
            tournament: { select: { name: true } },
          },
          orderBy: { completedAt: 'desc' },
          take: 20,
        },
        tournamentsWon: {
          select: { id: true, name: true, startDate: true },
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
        achievements: {
          include: { achievement: true },
        },
      },
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const player = await prisma.player.update({
      where: { id },
      data: body,
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}
