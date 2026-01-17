import { BookOpen, AlertCircle, Target, Trophy, Gavel } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { PINGERS_CODE } from '@/lib/utils'

export default function TheCodePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-pingers-lime/20 flex items-center justify-center">
              <BookOpen className="text-pingers-lime" size={40} />
            </div>
          </div>
          <Badge variant="gold" size="lg" className="mb-4">Community Standards</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-pingers-cream mb-4">
            THE PINGERS CODE
          </h1>
          <p className="text-xl text-pingers-lime font-bold italic mb-6">
            RULE HARD. PLAY HARDER.
          </p>
          <p className="text-pingers-cream/60 max-w-2xl mx-auto">
            These are the sacred laws of Pingers. Follow them, respect them, live by them.
            The wall is watching.
          </p>
        </div>
      </section>

      {/* The Code */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {PINGERS_CODE.map((item) => (
              <Card
                key={item.number}
                variant="bordered"
                className="flex items-center gap-6 p-6 hover:border-pingers-lime/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-pingers-lime/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-pingers-lime">
                    {item.number}
                  </span>
                </div>
                <p className="text-xl text-pingers-cream font-medium">
                  {item.rule}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-16 px-4 bg-pingers-dark-lighter/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="lime" size="lg" className="mb-4">Official Rules</Badge>
            <h2 className="text-3xl font-black text-pingers-cream">
              PINGERS RULES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Game Objective */}
            <Card variant="elevated">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-pingers-lime" size={24} />
                <h3 className="text-lg font-bold text-pingers-lime uppercase">
                  Game Objective
                </h3>
              </div>
              <div className="space-y-3 text-pingers-cream/80">
                <p><strong className="text-pingers-cream">WALL = TABLE = IN</strong></p>
                <p>Hit = Point to Opponent</p>
                <p>Miss = Point to Opponent</p>
              </div>
            </Card>

            {/* Scoring */}
            <Card variant="elevated">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-pingers-lime" size={24} />
                <h3 className="text-lg font-bold text-pingers-lime uppercase">
                  Scoring
                </h3>
              </div>
              <div className="space-y-3 text-pingers-cream/80">
                <p><strong className="text-pingers-cream">First to 21 (WIN BY 2)</strong></p>
                <p>Server gets point for every opponent error</p>
                <p>Receiver scores if server misses</p>
              </div>
            </Card>

            {/* Serving */}
            <Card variant="elevated">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="text-pingers-lime" size={24} />
                <h3 className="text-lg font-bold text-pingers-lime uppercase">
                  Serving
                </h3>
              </div>
              <div className="space-y-3 text-pingers-cream/80">
                <p><strong className="text-pingers-cream">LEGAL SERVE</strong></p>
                <p>Table first = Wall = Table = In</p>
                <p className="text-sm text-pingers-cream/60">
                  SECOND SERVE RULE: If first serve hits net and lands in, re-serve.
                  Second fault = point to opponent.
                </p>
              </div>
            </Card>

            {/* Setup */}
            <Card variant="elevated">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-pingers-lime" size={24} />
                <h3 className="text-lg font-bold text-pingers-lime uppercase">
                  Setup & Equipment
                </h3>
              </div>
              <div className="space-y-3 text-pingers-cream/80">
                <p><strong className="text-pingers-cream">THE WALL</strong></p>
                <p>Regulation size wooden table</p>
                <p>Wall-flush net</p>
                <p><strong className="text-pingers-gold">3-STAR BALLS ONLY</strong></p>
                <p className="text-sm text-pingers-cream/60">Quality equipment required</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Serve Rotation */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card variant="gold" className="text-center p-8">
            <h3 className="text-xl font-bold text-pingers-gold mb-4">
              SERVE ROTATION
            </h3>
            <p className="text-3xl font-black text-pingers-cream mb-4">
              SWAP EVERY 10 SERVES
            </p>
            <p className="text-pingers-cream/60">
              After every 10 points (combined), the serve switches to the other player.
              This ensures fairness and keeps the game flowing.
            </p>
          </Card>
        </div>
      </section>

      {/* Smash Responsibly */}
      <section className="py-16 px-4 bg-pingers-dark-lighter/30 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-pingers-cream mb-4">
            SMASH RESPONSIBLY
          </h2>
          <p className="text-pingers-cream/60 mb-8">
            Pingers is not just a game. It&apos;s a way of life. Play with honor,
            compete with passion, and always respect the wall.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="lime">NO ARGUING, EVER</Badge>
            <Badge variant="lime">CALL YOUR EDGES</Badge>
            <Badge variant="lime">WIN CLEAN</Badge>
          </div>
        </div>
      </section>

      {/* The Wall Decides */}
      <section className="py-16 px-4 text-center">
        <p className="text-4xl md:text-5xl font-black text-pingers-cream/20">
          THE WALL DECIDES
        </p>
      </section>
    </div>
  )
}
