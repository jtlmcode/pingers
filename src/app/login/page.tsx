'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, User, LogIn } from 'lucide-react'
import { Logo, Button, Card, Input } from '@/components/ui'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement actual auth
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark" />

      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card variant="elevated" className="p-8">
          {/* Toggle */}
          <div className="flex mb-8 bg-pingers-dark rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                isLogin
                  ? 'bg-pingers-lime text-pingers-dark'
                  : 'text-pingers-cream/60 hover:text-pingers-cream'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                !isLogin
                  ? 'bg-pingers-lime text-pingers-dark'
                  : 'text-pingers-cream/60 hover:text-pingers-cream'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-pingers-cream/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-pingers-cream/40"
                  />
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="input-dark pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-pingers-cream/40"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-dark pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-pingers-cream/40"
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-dark pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-pingers-cream/80 mb-2">
                  Player Nickname
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder='e.g., "The Mongoose"'
                    className="input-dark"
                    required={!isLogin}
                  />
                </div>
                <p className="text-xs text-pingers-cream/40 mt-1">
                  This will be your legendary Pingers name
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              <LogIn size={20} />
              {isLogin ? 'Sign In' : 'Join Pingers'}
            </Button>
          </form>

          {isLogin && (
            <p className="text-center text-pingers-cream/40 text-sm mt-6">
              Forgot your password?{' '}
              <a href="#" className="text-pingers-lime hover:underline">
                Reset it
              </a>
            </p>
          )}
        </Card>

        {/* Tagline */}
        <p className="text-center text-pingers-cream/40 text-sm mt-8 uppercase tracking-wider">
          The Wall Decides
        </p>
      </div>
    </div>
  )
}
