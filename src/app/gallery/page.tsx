import { Suspense } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Trophy, Star } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Badge, Card } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

async function getGalleryData() {
  const [images, champions] = await Promise.all([
    prisma.galleryImage.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.tournament.findMany({
      where: { status: 'completed', championId: { not: null } },
      include: {
        champion: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    }),
  ])
  return { images, champions }
}

export default async function GalleryPage() {
  const { images, champions } = await getGalleryData()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="text-pingers-gold" size={40} />
            <Badge variant="gold" size="lg">Wall of Fame</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-pingers-cream mb-4">
            GALLERY OF CHAMPIONS
          </h1>
          <p className="text-xl text-pingers-cream/60 max-w-2xl">
            The legends who conquered the wall. Their names etched in Pingers history forever.
          </p>
        </div>
      </section>

      {/* Champions Wall */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-pingers-cream mb-8 flex items-center gap-3">
            <Star className="text-pingers-gold" size={24} />
            Tournament Champions
          </h2>

          {champions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {champions.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                >
                  <Card
                    variant="gold"
                    hover
                    className="relative overflow-hidden h-full"
                  >
                    {/* Gold gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pingers-gold/10 to-transparent" />

                    <div className="relative">
                      {/* Trophy Icon */}
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pingers-gold to-pingers-gold-light flex items-center justify-center shadow-lg shadow-pingers-gold/30">
                        <Trophy className="text-pingers-dark" size={40} />
                      </div>

                      {/* Tournament Name */}
                      <h3 className="text-xl font-bold text-pingers-cream text-center mb-2">
                        {tournament.name}
                      </h3>
                      <p className="text-pingers-cream/60 text-center text-sm mb-4">
                        {formatDate(tournament.startDate)}
                      </p>

                      {/* Champion */}
                      {tournament.champion && (
                        <div className="text-center pt-4 border-t border-pingers-gold/30">
                          <p className="text-xs text-pingers-gold uppercase tracking-wider mb-1">
                            Champion
                          </p>
                          <p className="text-2xl font-black text-pingers-cream">
                            &quot;{tournament.champion.nickname}&quot;
                          </p>
                          <p className="text-pingers-cream/60">
                            {tournament.champion.user.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-pingers-dark-card rounded-xl">
              <Trophy size={64} className="mx-auto text-pingers-cream/20 mb-4" />
              <h3 className="text-xl font-bold text-pingers-cream mb-2">
                No Champions Yet
              </h3>
              <p className="text-pingers-cream/60">
                The first tournament champion will be crowned soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 px-4 bg-pingers-dark-lighter/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-pingers-cream mb-8 flex items-center gap-3">
            <ImageIcon className="text-pingers-lime" size={24} />
            Photo Gallery
          </h2>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={image.url}
                    alt={image.caption || 'Gallery image'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pingers-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {image.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="gold" size="sm">Featured</Badge>
                    </div>
                  )}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-pingers-cream text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-pingers-dark-card rounded-xl">
              <ImageIcon size={64} className="mx-auto text-pingers-cream/20 mb-4" />
              <h3 className="text-xl font-bold text-pingers-cream mb-2">
                No Photos Yet
              </h3>
              <p className="text-pingers-cream/60">
                Championship photos will appear here after tournaments.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tagline */}
      <section className="py-16 px-4 text-center">
        <p className="text-pingers-cream/40 uppercase tracking-[0.3em] text-sm">
          The Greatest Game in the History of Games
        </p>
      </section>
    </div>
  )
}
