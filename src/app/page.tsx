import Link from 'next/link'
import { Trophy, Users, Calendar, Star, ChevronRight, Zap } from 'lucide-react'
import { Logo, Button, Card, Badge } from '@/components/ui'
import { PINGERS_CODE } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="texture-overlay">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-pingers-dark via-pingers-dark to-pingers-dark-lighter" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pingers-lime/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pingers-lime/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Main Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="xl" showText={false} />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-pingers-cream mb-4 tracking-tight text-distressed">
            PINGERS
          </h1>
          <p className="text-xl md:text-2xl text-pingers-lime font-bold uppercase tracking-widest mb-6">
            Championship
          </p>

          {/* Tagline */}
          <p className="text-2xl md:text-4xl text-pingers-cream/90 font-bold mb-4">
            THE GREATEST GAME
          </p>
          <p className="text-2xl md:text-4xl text-pingers-lime font-bold mb-8">
            IN THE HISTORY OF GAMES
          </p>

          {/* Sub tagline */}
          <p className="text-lg md:text-xl text-pingers-cream/60 mb-12 italic">
            Pure. Uncut. Addictive.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tournaments">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Trophy size={20} />
                View Tournaments
              </Button>
            </Link>
            <Link href="/players">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Users size={20} />
                Meet the Players
              </Button>
            </Link>
          </div>

          {/* The Wall Decides */}
          <p className="mt-16 text-pingers-cream/40 uppercase tracking-[0.3em] text-sm">
            The Wall Decides
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight size={32} className="text-pingers-lime/50 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-pingers-dark-lighter/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center text-pingers-cream mb-4">
            FAST. LOUD. UNNECESSARILY COMPETITIVE.
          </h2>
          <p className="text-center text-pingers-cream/60 mb-16 max-w-2xl mx-auto">
            Teeth clenching, sweat inducing fun. Welcome to the home of Pingers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tournament Card */}
            <Card variant="bordered" hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pingers-lime/20 flex items-center justify-center">
                <Trophy size={32} className="text-pingers-lime" />
              </div>
              <h3 className="text-xl font-bold text-pingers-cream mb-3">WORLD CHAMPIONSHIP</h3>
              <p className="text-pingers-cream/60 mb-4">
                Group stage, knockouts, and finals. The complete tournament experience.
              </p>
              <Badge variant="stage">GROUP STAGE → KNOCKOUTS → FINAL</Badge>
            </Card>

            {/* Players Card */}
            <Card variant="bordered" hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pingers-lime/20 flex items-center justify-center">
                <Users size={32} className="text-pingers-lime" />
              </div>
              <h3 className="text-xl font-bold text-pingers-cream mb-3">FOUNDING SEASON</h3>
              <p className="text-pingers-cream/60 mb-4">
                Meet the legends. Track stats, head-to-head records, and player rankings.
              </p>
              <Badge variant="founding">Founding Members</Badge>
            </Card>

            {/* Stats Card */}
            <Card variant="bordered" hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pingers-lime/20 flex items-center justify-center">
                <Zap size={32} className="text-pingers-lime" />
              </div>
              <h3 className="text-xl font-bold text-pingers-cream mb-3">LIVE TRACKING</h3>
              <p className="text-pingers-cream/60 mb-4">
                Real-time scores, brackets, and statistics during tournament play.
              </p>
              <Badge variant="lime">First to 21</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* The Pingers Code Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="gold" size="lg" className="mb-4">Community Standards</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-pingers-cream">
              THE PINGERS CODE
            </h2>
            <p className="text-pingers-cream/60 mt-4">
              Rule hard. Play harder.
            </p>
          </div>

          <Card variant="elevated" className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pingers-lime to-pingers-gold" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
              {PINGERS_CODE.slice(0, 6).map((item) => (
                <div key={item.number} className="flex items-center gap-4 p-3">
                  <span className="w-8 h-8 rounded-full bg-pingers-lime/20 flex items-center justify-center text-pingers-lime font-bold text-sm">
                    {item.number}
                  </span>
                  <span className="text-pingers-cream/90">{item.rule}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-pingers-dark-lighter text-center">
              <Link href="/the-code">
                <Button variant="ghost">
                  View Full Code
                  <ChevronRight size={18} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-pingers-dark to-pingers-dark-lighter">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="w-16 h-16 mx-auto mb-6 text-pingers-gold" />
          <h2 className="text-3xl md:text-4xl font-black text-pingers-cream mb-4">
            READY TO COMPETE?
          </h2>
          <p className="text-xl text-pingers-cream/60 mb-8">
            12 players enter. Balls to the wall. Friendships tested. Heroes emerge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="gold" size="lg">
                Join PINGERS
              </Button>
            </Link>
            <Link href="/schedule">
              <Button variant="secondary" size="lg">
                <Calendar size={20} />
                View Schedule
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-pingers-cream/40 text-sm uppercase tracking-wider">
            This is it. Pingers is here.
          </p>
        </div>
      </section>
    </div>
  )
}
