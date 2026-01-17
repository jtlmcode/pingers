import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { player1Score, player2Score, status } = body

    // Get current match
    const currentMatch = await prisma.match.findUnique({
      where: { id },
    })

    if (!currentMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Determine winner if match is being completed
    let winnerId = currentMatch.winnerId
    if (status === 'completed' && player1Score !== undefined && player2Score !== undefined) {
      winnerId = player1Score > player2Score
        ? currentMatch.player1Id
        : currentMatch.player2Id
    }

    // Update match
    const match = await prisma.match.update({
      where: { id },
      data: {
        player1Score: player1Score ?? currentMatch.player1Score,
        player2Score: player2Score ?? currentMatch.player2Score,
        status: status ?? currentMatch.status,
        winnerId,
        startedAt: status === 'in_progress' && !currentMatch.startedAt
          ? new Date()
          : currentMatch.startedAt,
        completedAt: status === 'completed' ? new Date() : currentMatch.completedAt,
      },
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
      },
    })

    // If match completed, update player stats
    if (status === 'completed' && winnerId) {
      const loserId = winnerId === match.player1Id ? match.player2Id : match.player1Id
      const winnerScore = winnerId === match.player1Id ? player1Score : player2Score
      const loserScore = winnerId === match.player1Id ? player2Score : player1Score

      // Update winner stats
      await prisma.player.update({
        where: { id: winnerId },
        data: {
          wins: { increment: 1 },
          currentStreak: {
            increment: 1, // Will need to handle negative streaks
          },
          totalPointsScored: { increment: winnerScore },
          totalPointsAgainst: { increment: loserScore },
        },
      })

      // Update loser stats
      await prisma.player.update({
        where: { id: loserId },
        data: {
          losses: { increment: 1 },
          currentStreak: 0, // Reset on loss (simplified)
          totalPointsScored: { increment: loserScore },
          totalPointsAgainst: { increment: winnerScore },
        },
      })

      // Update head to head
      await updateHeadToHead(winnerId, loserId)

      // Update tournament participant stats if in a tournament group stage
      if (match.tournamentId && match.stage === 'group') {
        await updateGroupStats(match.tournamentId, winnerId, loserId, winnerScore, loserScore)
      }
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

async function updateHeadToHead(winnerId: string, loserId: string) {
  // Ensure consistent ordering for lookup
  const [p1, p2] = [winnerId, loserId].sort()
  const winnerIsP1 = winnerId === p1

  const existing = await prisma.headToHead.findUnique({
    where: {
      player1Id_player2Id: {
        player1Id: p1,
        player2Id: p2,
      },
    },
  })

  if (existing) {
    await prisma.headToHead.update({
      where: { id: existing.id },
      data: winnerIsP1
        ? { player1Wins: { increment: 1 } }
        : { player2Wins: { increment: 1 } },
    })
  } else {
    await prisma.headToHead.create({
      data: {
        player1Id: p1,
        player2Id: p2,
        player1Wins: winnerIsP1 ? 1 : 0,
        player2Wins: winnerIsP1 ? 0 : 1,
      },
    })
  }
}

async function updateGroupStats(
  tournamentId: string,
  winnerId: string,
  loserId: string,
  winnerScore: number,
  loserScore: number
) {
  // Update winner's group stats
  await prisma.tournamentParticipant.updateMany({
    where: {
      tournamentId,
      playerId: winnerId,
    },
    data: {
      groupWins: { increment: 1 },
      groupPointsFor: { increment: winnerScore },
      groupPointsAgainst: { increment: loserScore },
    },
  })

  // Update loser's group stats
  await prisma.tournamentParticipant.updateMany({
    where: {
      tournamentId,
      playerId: loserId,
    },
    data: {
      groupLosses: { increment: 1 },
      groupPointsFor: { increment: loserScore },
      groupPointsAgainst: { increment: winnerScore },
    },
  })
}
