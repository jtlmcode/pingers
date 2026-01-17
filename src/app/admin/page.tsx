'use client'

import Link from 'next/link'
import { Users, Trophy, Calendar, Settings, Plus, BarChart3 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Settings className="text-pingers-lime" size={40} />
            <Badge variant="gold">Admin Panel</Badge>
          </div>
          <h1 className="text-4xl font-black text-pingers-cream mb-2">
            PINGERS ADMIN
          </h1>
          <p className="text-pingers-cream/60">
            Manage players, tournaments, and settings
          </p>
        </div>
      </section>

      {/* Admin Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Players Management */}
            <Link href="/admin/players">
              <Card variant="bordered" hover className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-pingers-lime/20 flex items-center justify-center">
                    <Users className="text-pingers-lime" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-pingers-cream">Players</h2>
                    <p className="text-pingers-cream/60 text-sm">Manage player profiles</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-pingers-cream/80">
                  <li className="flex items-center gap-2">
                    <Plus size={14} className="text-pingers-lime" />
                    Add new players
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings size={14} className="text-pingers-lime" />
                    Edit profiles & stats
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-pingers-lime" />
                    Update records
                  </li>
                </ul>
              </Card>
            </Link>

            {/* Tournaments Management */}
            <Link href="/admin/tournaments">
              <Card variant="bordered" hover className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-pingers-gold/20 flex items-center justify-center">
                    <Trophy className="text-pingers-gold" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-pingers-cream">Tournaments</h2>
                    <p className="text-pingers-cream/60 text-sm">Manage tournaments</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-pingers-cream/80">
                  <li className="flex items-center gap-2">
                    <Plus size={14} className="text-pingers-gold" />
                    Create tournaments
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar size={14} className="text-pingers-gold" />
                    Set dates & venues
                  </li>
                  <li className="flex items-center gap-2">
                    <Users size={14} className="text-pingers-gold" />
                    Manage participants
                  </li>
                </ul>
              </Card>
            </Link>

            {/* Quick Stats */}
            <Card variant="elevated" className="h-full">
              <h2 className="text-xl font-bold text-pingers-cream mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-pingers-cream/60">Total Players</span>
                  <span className="text-2xl font-bold text-pingers-lime">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pingers-cream/60">Tournaments</span>
                  <span className="text-2xl font-bold text-pingers-gold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pingers-cream/60">Total Matches</span>
                  <span className="text-2xl font-bold text-pingers-cream">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
