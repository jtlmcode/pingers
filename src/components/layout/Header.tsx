'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Trophy, Users, Calendar, Image, BookOpen, LogIn, Settings } from 'lucide-react'
import { Logo } from '@/components/ui'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/players', label: 'Players', icon: Users },
  { href: '/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/gallery', label: 'Gallery', icon: Image },
  { href: '/the-code', label: 'The Code', icon: BookOpen },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pingers-dark/95 backdrop-blur-sm border-b border-pingers-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'bg-pingers-lime/20 text-pingers-lime'
                      : 'text-pingers-cream/70 hover:text-pingers-cream hover:bg-pingers-dark-lighter'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Auth Button (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-pingers-gold hover:bg-pingers-gold/10 transition-colors"
            >
              <Settings size={18} />
              <span>Admin</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-pingers-cream/70 hover:text-pingers-lime transition-colors"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-pingers-cream hover:bg-pingers-dark-lighter transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-pingers-dark border-t border-pingers-dark-lighter">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'bg-pingers-lime/20 text-pingers-lime'
                      : 'text-pingers-cream/70 hover:text-pingers-cream hover:bg-pingers-dark-lighter'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-4 border-t border-pingers-dark-lighter space-y-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-pingers-gold hover:bg-pingers-gold/20 transition-colors"
              >
                <Settings size={20} />
                <span>Admin</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-pingers-lime hover:bg-pingers-lime/20 transition-colors"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
