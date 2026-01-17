import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error fetching tournament:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
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

    // Handle date conversions
    const updateData: any = { ...body }
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.registrationDeadline) updateData.registrationDeadline = new Date(body.registrationDeadline)

    const tournament = await prisma.tournament.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error updating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to update tournament' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.tournament.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tournament:', error)
    return NextResponse.json(
      { error: 'Failed to delete tournament' },
      { status: 500 }
    )
  }
}
