import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create founding season players
  const players = [
    {
      email: 'luke@pingers.com',
      name: 'Luke McGarian',
      nickname: 'The Mongoose',
      tagline: 'Nothing gets past the Mongoose.',
      statDefence: 9,
      statSpin: 7,
      statServe: 6,
      statAgility: 9,
      statPhysicality: 8,
      statComplainometer: 3,
      wins: 15,
      losses: 5,
    },
    {
      email: 'simon@pingers.com',
      name: 'Simon Wall',
      nickname: 'The Greig',
      tagline: 'Defence as strong as his moustache. Respect the wall.',
      statDefence: 10,
      statSpin: 5,
      statServe: 7,
      statAgility: 6,
      statPhysicality: 7,
      statComplainometer: 2,
      wins: 12,
      losses: 8,
    },
    {
      email: 'phil@pingers.com',
      name: 'Phil Cann',
      nickname: 'The Shit',
      tagline: 'Consistently inconsistent. Still turned up.',
      statDefence: 5,
      statSpin: 6,
      statServe: 5,
      statAgility: 7,
      statPhysicality: 9,
      statComplainometer: 8,
      wins: 8,
      losses: 12,
    },
    {
      email: 'jack@pingers.com',
      name: 'Jack Thompson',
      nickname: 'The Hammer',
      tagline: 'Smashes first. Asks questions never.',
      statDefence: 4,
      statSpin: 8,
      statServe: 9,
      statAgility: 7,
      statPhysicality: 9,
      statComplainometer: 6,
      wins: 11,
      losses: 9,
    },
    {
      email: 'dave@pingers.com',
      name: 'Dave Richards',
      nickname: 'The Wall',
      tagline: 'Returns everything. Eventually.',
      statDefence: 8,
      statSpin: 4,
      statServe: 6,
      statAgility: 5,
      statPhysicality: 6,
      statComplainometer: 4,
      wins: 9,
      losses: 11,
    },
    {
      email: 'mike@pingers.com',
      name: 'Mike Stevens',
      nickname: 'The Spin Doctor',
      tagline: 'Ball goes everywhere but where you expect.',
      statDefence: 6,
      statSpin: 10,
      statServe: 8,
      statAgility: 6,
      statPhysicality: 5,
      statComplainometer: 5,
      wins: 10,
      losses: 10,
    },
    {
      email: 'tom@pingers.com',
      name: 'Tom Williams',
      nickname: 'The Silent Assassin',
      tagline: 'Quiet at the table. Loud on the scoreboard.',
      statDefence: 7,
      statSpin: 7,
      statServe: 8,
      statAgility: 8,
      statPhysicality: 6,
      statComplainometer: 1,
      wins: 13,
      losses: 7,
    },
    {
      email: 'chris@pingers.com',
      name: 'Chris Brown',
      nickname: 'The Rookie',
      tagline: 'New to the game. Already a legend.',
      statDefence: 5,
      statSpin: 5,
      statServe: 5,
      statAgility: 8,
      statPhysicality: 7,
      statComplainometer: 7,
      wins: 6,
      losses: 14,
    },
  ]

  const hashedPassword = await bcrypt.hash('pingers123', 12)

  // Create users and players
  const createdPlayers = []
  for (const playerData of players) {
    const user = await prisma.user.upsert({
      where: { email: playerData.email },
      update: {},
      create: {
        email: playerData.email,
        name: playerData.name,
        password: hashedPassword,
        role: 'player',
        player: {
          create: {
            nickname: playerData.nickname,
            tagline: playerData.tagline,
            isFoundingSeason: true,
            statDefence: playerData.statDefence,
            statSpin: playerData.statSpin,
            statServe: playerData.statServe,
            statAgility: playerData.statAgility,
            statPhysicality: playerData.statPhysicality,
            statComplainometer: playerData.statComplainometer,
            wins: playerData.wins,
            losses: playerData.losses,
            totalPointsScored: (playerData.wins + playerData.losses) * 18,
            totalPointsAgainst: (playerData.wins + playerData.losses) * 15,
            longestWinStreak: Math.floor(playerData.wins / 3),
            longestLoseStreak: Math.floor(playerData.losses / 4),
            currentStreak: playerData.wins > playerData.losses ? 2 : -1,
          },
        },
      },
      include: { player: true },
    })
    createdPlayers.push(user.player!)
    console.log(`Created player: ${playerData.nickname}`)
  }

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@pingers.com' },
    update: {},
    create: {
      email: 'admin@pingers.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('Created admin user')

  // Create a completed tournament
  const completedTournament = await prisma.tournament.create({
    data: {
      name: 'PINGERS WORLD CHAMPIONSHIP I',
      description: 'The inaugural Pingers World Championship. 12 players enter. One champion emerges.',
      venue: 'The Home of Pingers',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-15'),
      status: 'completed',
      maxParticipants: 12,
      groupCount: 4,
      championId: createdPlayers[0]!.id, // The Mongoose wins!
    },
  })
  console.log('Created completed tournament')

  // Create upcoming tournament
  const upcomingTournament = await prisma.tournament.create({
    data: {
      name: 'PINGERS DOWN UNDER',
      description: 'Not that kind of Pingers. 12 players enter. Balls to the wall. Friendships tested.',
      venue: 'The Home of Pingers',
      startDate: new Date('2025-02-07'),
      registrationDeadline: new Date('2025-02-01'),
      status: 'registration',
      maxParticipants: 12,
      groupCount: 4,
    },
  })

  // Add participants to upcoming tournament
  for (const player of createdPlayers) {
    await prisma.tournamentParticipant.create({
      data: {
        tournamentId: upcomingTournament.id,
        playerId: player.id,
      },
    })
  }
  console.log('Created upcoming tournament with participants')

  // Create some head-to-head records
  for (let i = 0; i < createdPlayers.length - 1; i++) {
    for (let j = i + 1; j < createdPlayers.length; j++) {
      const p1 = createdPlayers[i]!
      const p2 = createdPlayers[j]!

      await prisma.headToHead.create({
        data: {
          player1Id: p1.id,
          player2Id: p2.id,
          player1Wins: Math.floor(Math.random() * 5) + 1,
          player2Wins: Math.floor(Math.random() * 5) + 1,
        },
      })
    }
  }
  console.log('Created head-to-head records')

  // Create achievements
  const achievements = [
    { name: 'Champion', description: 'Won a tournament', icon: '👑', tier: 'gold' },
    { name: 'Founding Member', description: 'Founding Season player', icon: '⭐', tier: 'gold' },
    { name: 'Ball Breaker', description: 'Most aggressive player', icon: '💥', tier: 'gold' },
    { name: 'Stone Cold Defender', description: 'Best defensive stats', icon: '🛡️', tier: 'gold' },
    { name: 'The Mongoose', description: 'Returns everything', icon: '🦡', tier: 'gold' },
    { name: 'Spin Doctor', description: 'Master of spin', icon: '🌀', tier: 'silver' },
    { name: 'Smooth Operator', description: 'Consistent performer', icon: '😎', tier: 'silver' },
    { name: 'First Blood', description: 'Won first tournament match', icon: '🩸', tier: 'bronze' },
    { name: 'Casual Legend', description: 'Participation award', icon: '🏆', tier: 'bronze' },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    })
  }
  console.log('Created achievements')

  // Award founding member achievement to all players
  const foundingAchievement = await prisma.achievement.findUnique({
    where: { name: 'Founding Member' },
  })

  if (foundingAchievement) {
    for (const player of createdPlayers) {
      await prisma.playerAchievement.create({
        data: {
          playerId: player.id,
          achievementId: foundingAchievement.id,
        },
      })
    }
    console.log('Awarded founding member achievements')
  }

  // Create practice sessions
  const practiceDates = [
    new Date('2025-01-20T18:00:00'),
    new Date('2025-01-27T18:00:00'),
    new Date('2025-02-03T18:00:00'),
  ]

  for (const date of practiceDates) {
    await prisma.practiceSession.create({
      data: {
        name: 'Weekly Practice',
        description: 'Regular practice session. All skill levels welcome.',
        venue: 'The Home of Pingers',
        date,
        duration: 120,
      },
    })
  }
  console.log('Created practice sessions')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
