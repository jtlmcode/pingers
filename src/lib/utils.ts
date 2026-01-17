import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getWinPercentage(wins: number, losses: number): number {
  const total = wins + losses
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}

export function getPointsPerGame(totalPoints: number, gamesPlayed: number): number {
  if (gamesPlayed === 0) return 0
  return Math.round((totalPoints / gamesPlayed) * 10) / 10
}

export function getStreakDisplay(streak: number): string {
  if (streak === 0) return '-'
  if (streak > 0) return `W${streak}`
  return `L${Math.abs(streak)}`
}

export const PINGERS_TAGLINES = [
  'THE GREATEST GAME IN THE HISTORY OF GAMES',
  'THE WALL DECIDES',
  'PURE. UNCUT. ADDICTIVE.',
  'RETURNS EVERYTHING.',
  'SMASH RESPONSIBLY',
  'TEETH CLENCHING, SWEAT INDUCING FUN',
  'FAST. LOUD. UNNECESSARILY COMPETITIVE.',
  'RULE HARD. PLAY HARDER.',
  'RESPECT THE WALL.',
  'COME AND GET SOME.',
]

export function getRandomTagline(): string {
  return PINGERS_TAGLINES[Math.floor(Math.random() * PINGERS_TAGLINES.length)]
}

export const PINGERS_CODE = [
  { number: 1, rule: 'Respect the wall' },
  { number: 2, rule: 'Respect the rally' },
  { number: 3, rule: 'Call your edges (even if it hurts)' },
  { number: 4, rule: 'No arguing, ever' },
  { number: 5, rule: 'Win clean' },
  { number: 6, rule: 'Stay for the next game' },
  { number: 7, rule: 'Spectators silent during rallies' },
  { number: 8, rule: 'Leave the space better than you found it' },
]

export const TOURNAMENT_STAGES = {
  group: 'GROUP STAGE',
  round_of_16: 'ROUND OF 16',
  quarter_final: 'QUARTER FINALS',
  semi_final: 'SEMI FINALS',
  consolation_semi: 'CONSOLATION SEMI',
  consolation_final: 'CONSOLIDATION FINAL',
  final: 'FINAL',
} as const

export const ACHIEVEMENTS = [
  { name: 'Ball Breaker', description: 'Most aggressive player', icon: '💥', tier: 'gold' },
  { name: 'Stone Cold Defender', description: 'Best defensive stats', icon: '🛡️', tier: 'gold' },
  { name: 'Smooth Operator', description: 'Consistent performer', icon: '😎', tier: 'silver' },
  { name: 'Casual Legend', description: 'Participation award', icon: '🏆', tier: 'bronze' },
  { name: 'The Mongoose', description: 'Returns everything', icon: '🦡', tier: 'gold' },
  { name: 'Spin Doctor', description: 'Master of spin', icon: '🌀', tier: 'silver' },
  { name: 'First Blood', description: 'Won first tournament match', icon: '🩸', tier: 'bronze' },
  { name: 'Champion', description: 'Tournament winner', icon: '👑', tier: 'gold' },
  { name: 'Founding Member', description: 'Founding Season player', icon: '⭐', tier: 'gold' },
]
