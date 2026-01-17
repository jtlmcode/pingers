'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-pingers-dark border-t border-pingers-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="md" showText={true} />
            <p className="mt-4 text-pingers-cream/60 max-w-md">
              THE GREATEST GAME IN THE HISTORY OF GAMES. Pure, uncut, addictive table tennis.
            </p>
            <p className="mt-2 text-pingers-lime font-bold italic">
              THE WALL DECIDES.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-pingers-lime font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/players" className="text-pingers-cream/60 hover:text-pingers-lime transition-colors">
                  Players
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-pingers-cream/60 hover:text-pingers-lime transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-pingers-cream/60 hover:text-pingers-lime transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-pingers-cream/60 hover:text-pingers-lime transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/the-code" className="text-pingers-cream/60 hover:text-pingers-lime transition-colors">
                  The Pingers Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-pingers-lime font-bold uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-pingers-dark-lighter text-pingers-cream/60 hover:text-pingers-lime hover:bg-pingers-dark-card transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-pingers-dark-lighter text-pingers-cream/60 hover:text-pingers-lime hover:bg-pingers-dark-card transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-pingers-dark-lighter text-pingers-cream/60 hover:text-pingers-lime hover:bg-pingers-dark-card transition-all"
              >
                <Twitter size={20} />
              </a>
            </div>
            <p className="mt-4 text-sm text-pingers-cream/40">
              SMASH RESPONSIBLY
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-pingers-dark-lighter flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-pingers-cream/40 text-sm">
            &copy; {new Date().getFullYear()} PINGERS Championship. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-pingers-cream/40">3-STAR BALLS ONLY</span>
            <span className="text-pingers-lime">•</span>
            <span className="text-pingers-cream/40">WALL-FLUSH NET</span>
            <span className="text-pingers-lime">•</span>
            <span className="text-pingers-cream/40">REGULATION SIZE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
