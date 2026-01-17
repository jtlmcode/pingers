'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Users, Search } from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'

interface Player {
  id: string
  nickname: string
  tagline: string | null
  photo: string | null
  isFoundingSeason: boolean
  wins: number
  losses: number
  statDefence: number
  statSpin: number
  statServe: number
  statAgility: number
  statPhysicality: number
  statComplainometer: number
  user: {
    name: string | null
    email: string | null
  }
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      setPlayers(data)
    } catch (error) {
      console.error('Failed to fetch players:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/players/${id}`, { method: 'DELETE' })
      setPlayers(players.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete player:', error)
    }
  }

  const filteredPlayers = players.filter(p =>
    p.nickname.toLowerCase().includes(search.toLowerCase()) ||
    p.user.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-pingers-dark-lighter to-pingers-dark py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft size={18} />
              Back to Admin
            </Button>
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Users className="text-pingers-lime" size={36} />
              <div>
                <h1 className="text-3xl font-black text-pingers-cream">
                  MANAGE PLAYERS
                </h1>
                <p className="text-pingers-cream/60">{players.length} players registered</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Add Player
            </Button>
          </div>
        </div>
      </section>

      {/* Search & List */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-pingers-cream/40" />
              <input
                type="text"
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark pl-10"
              />
            </div>
          </div>

          {/* Players Table */}
          {loading ? (
            <div className="text-center py-12 text-pingers-cream/60">Loading...</div>
          ) : (
            <div className="bg-pingers-dark-card rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-pingers-cream/60 border-b border-pingers-dark-lighter">
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Nickname</th>
                    <th className="px-6 py-4 text-center">W/L</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="border-b border-pingers-dark-lighter/50 hover:bg-pingers-dark-lighter/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-pingers-cream">{player.user.name}</p>
                          <p className="text-xs text-pingers-cream/60">{player.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-pingers-lime">&quot;{player.nickname}&quot;</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-pingers-lime">{player.wins}</span>
                        <span className="text-pingers-cream/40"> / </span>
                        <span className="text-pingers-cream/80">{player.losses}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {player.isFoundingSeason && (
                          <Badge variant="founding" size="sm">Founding</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPlayer(player)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(player.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPlayers.length === 0 && (
                <div className="text-center py-12 text-pingers-cream/60">
                  No players found
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {(showAddModal || editingPlayer) && (
        <PlayerModal
          player={editingPlayer}
          onClose={() => {
            setShowAddModal(false)
            setEditingPlayer(null)
          }}
          onSave={() => {
            fetchPlayers()
            setShowAddModal(false)
            setEditingPlayer(null)
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="max-w-md w-full">
            <h3 className="text-xl font-bold text-pingers-cream mb-4">Delete Player?</h3>
            <p className="text-pingers-cream/60 mb-6">
              This action cannot be undone. All player data including match history will be deleted.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(deleteConfirm)} className="flex-1">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

interface PlayerModalProps {
  player: Player | null
  onClose: () => void
  onSave: () => void
}

function PlayerModal({ player, onClose, onSave }: PlayerModalProps) {
  const [formData, setFormData] = useState({
    name: player?.user.name || '',
    email: player?.user.email || '',
    nickname: player?.nickname || '',
    tagline: player?.tagline || '',
    photo: player?.photo || '',
    isFoundingSeason: player?.isFoundingSeason ?? true,
    wins: player?.wins || 0,
    losses: player?.losses || 0,
    statDefence: player?.statDefence || 5,
    statSpin: player?.statSpin || 5,
    statServe: player?.statServe || 5,
    statAgility: player?.statAgility || 5,
    statPhysicality: player?.statPhysicality || 5,
    statComplainometer: player?.statComplainometer || 5,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (player) {
        // Update existing player
        await fetch(`/api/players/${player.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: formData.nickname,
            tagline: formData.tagline,
            photo: formData.photo,
            isFoundingSeason: formData.isFoundingSeason,
            wins: Number(formData.wins),
            losses: Number(formData.losses),
            statDefence: Number(formData.statDefence),
            statSpin: Number(formData.statSpin),
            statServe: Number(formData.statServe),
            statAgility: Number(formData.statAgility),
            statPhysicality: Number(formData.statPhysicality),
            statComplainometer: Number(formData.statComplainometer),
          }),
        })
      } else {
        // Create new player via registration
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: 'pingers123', // Default password
            name: formData.name,
            nickname: formData.nickname,
          }),
        })
      }
      onSave()
    } catch (error) {
      console.error('Failed to save player:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card variant="elevated" className="max-w-2xl w-full my-8">
        <h3 className="text-xl font-bold text-pingers-cream mb-6">
          {player ? 'Edit Player' : 'Add New Player'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-dark"
                required
                disabled={!!player}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-dark"
                required
                disabled={!!player}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Nickname</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="input-dark"
                placeholder='e.g., "The Mongoose"'
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Photo URL</label>
              <input
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                className="input-dark"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="input-dark"
              placeholder="e.g., Nothing gets past the Mongoose."
            />
          </div>

          {/* Record */}
          {player && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Wins</label>
                <input
                  type="number"
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) })}
                  className="input-dark"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Losses</label>
                <input
                  type="number"
                  value={formData.losses}
                  onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) })}
                  className="input-dark"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Stats */}
          {player && (
            <div>
              <label className="block text-sm font-medium text-pingers-lime mb-3 uppercase tracking-wider">
                Player Stats (1-10)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'statDefence', label: 'Defence' },
                  { key: 'statSpin', label: 'Spin' },
                  { key: 'statServe', label: 'Serve' },
                  { key: 'statAgility', label: 'Agility' },
                  { key: 'statPhysicality', label: 'Physicality' },
                  { key: 'statComplainometer', label: 'Complainometer' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-pingers-cream/60 mb-1">{label}</label>
                    <input
                      type="number"
                      value={(formData as any)[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
                      className="input-dark"
                      min="1"
                      max="10"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Founding Season */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFoundingSeason}
              onChange={(e) => setFormData({ ...formData, isFoundingSeason: e.target.checked })}
              className="w-5 h-5 rounded border-pingers-dark-lighter bg-pingers-dark-lighter text-pingers-lime focus:ring-pingers-lime"
            />
            <span className="text-pingers-cream">Founding Season Member</span>
          </label>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving} className="flex-1">
              {player ? 'Save Changes' : 'Create Player'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
