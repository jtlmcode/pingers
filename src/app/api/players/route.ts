import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ wins: 'desc' }, { losses: 'asc' }],
    })

    return NextResponse.json(players)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      nickname,
      tagline,
      photo,
      statDefence,
      statSpin,
      statServe,
      statAgility,
      statPhysicality,
      statComplainometer,
    } = body

    const player = await prisma.player.create({
      data: {
        userId,
        nickname,
        tagline,
        photo,
        statDefence: statDefence || 5,
        statSpin: statSpin || 5,
        statServe: statServe || 5,
        statAgility: statAgility || 5,
        statPhysicality: statPhysicality || 5,
        statComplainometer: statComplainometer || 5,
        isFoundingSeason: true,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}
