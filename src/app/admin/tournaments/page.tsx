'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Trophy, Calendar, MapPin, Users } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'

interface Tournament {
  id: string
  name: string
  description: string | null
  venue: string
  startDate: string
  endDate: string | null
  registrationDeadline: string | null
  status: string
  maxParticipants: number
  groupCount: number
  image: string | null
  championId: string | null
  champion?: {
    nickname: string
  } | null
  _count?: {
    participants: number
  }
}

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments')
      const data = await res.json()
      setTournaments(data)
    } catch (error) {
      console.error('Failed to fetch tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tournaments/${id}`, { method: 'DELETE' })
      setTournaments(tournaments.filter(t => t.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete tournament:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default">Upcoming</Badge>
      case 'registration':
        return <Badge variant="lime">Registration Open</Badge>
      case 'group_stage':
        return <Badge variant="stage">Group Stage</Badge>
      case 'knockouts':
        return <Badge variant="gold">Knockouts</Badge>
      case 'final':
        return <Badge variant="gold">Final</Badge>
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

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
              <Trophy className="text-pingers-gold" size={36} />
              <div>
                <h1 className="text-3xl font-black text-pingers-cream">
                  MANAGE TOURNAMENTS
                </h1>
                <p className="text-pingers-cream/60">{tournaments.length} tournaments</p>
              </div>
            </div>
            <Button variant="gold" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Create Tournament
            </Button>
          </div>
        </div>
      </section>

      {/* Tournaments List */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-pingers-cream/60">Loading...</div>
          ) : (
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} variant="bordered" className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-6">
                    {/* Date Box */}
                    <div className="w-16 h-16 rounded-xl bg-pingers-gold/20 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black text-pingers-gold">
                        {new Date(tournament.startDate).getDate()}
                      </span>
                      <span className="text-xs text-pingers-gold uppercase">
                        {new Date(tournament.startDate).toLocaleDateString('en-AU', { month: 'short' })}
                      </span>
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-pingers-cream">{tournament.name}</h3>
                        {getStatusBadge(tournament.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-pingers-cream/60">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {tournament.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {tournament._count?.participants || 0}/{tournament.maxParticipants}
                        </span>
                        {tournament.champion && (
                          <span className="flex items-center gap-1 text-pingers-gold">
                            <Trophy size={14} />
                            {tournament.champion.nickname}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTournament(tournament)}
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(tournament.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}

              {tournaments.length === 0 && (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-pingers-cream/20 mb-4" />
                  <h3 className="text-lg font-bold text-pingers-cream mb-2">No Tournaments</h3>
                  <p className="text-pingers-cream/60 mb-4">Create your first tournament to get started.</p>
                  <Button variant="gold" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    Create Tournament
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTournament) && (
        <TournamentModal
          tournament={editingTournament}
          onClose={() => {
            setShowAddModal(false)
            setEditingTournament(null)
          }}
          onSave={() => {
            fetchTournaments()
            setShowAddModal(false)
            setEditingTournament(null)
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="max-w-md w-full">
            <h3 className="text-xl font-bold text-pingers-cream mb-4">Delete Tournament?</h3>
            <p className="text-pingers-cream/60 mb-6">
              This action cannot be undone. All tournament data including matches and results will be deleted.
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

interface TournamentModalProps {
  tournament: Tournament | null
  onClose: () => void
  onSave: () => void
}

function TournamentModal({ tournament, onClose, onSave }: TournamentModalProps) {
  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    description: tournament?.description || '',
    venue: tournament?.venue || 'The Home of Pingers',
    startDate: tournament?.startDate ? tournament.startDate.split('T')[0] : '',
    endDate: tournament?.endDate ? tournament.endDate.split('T')[0] : '',
    registrationDeadline: tournament?.registrationDeadline ? tournament.registrationDeadline.split('T')[0] : '',
    status: tournament?.status || 'upcoming',
    maxParticipants: tournament?.maxParticipants || 12,
    groupCount: tournament?.groupCount || 4,
    image: tournament?.image || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = tournament ? `/api/tournaments/${tournament.id}` : '/api/tournaments'
      const method = tournament ? 'PATCH' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxParticipants: Number(formData.maxParticipants),
          groupCount: Number(formData.groupCount),
        }),
      })
      onSave()
    } catch (error) {
      console.error('Failed to save tournament:', error)
    } finally {
      setSaving(false)
    }
  }

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'registration', label: 'Registration Open' },
    { value: 'group_stage', label: 'Group Stage' },
    { value: 'knockouts', label: 'Knockouts' },
    { value: 'final', label: 'Final' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card variant="elevated" className="max-w-2xl w-full my-8">
        <h3 className="text-xl font-bold text-pingers-cream mb-6">
          {tournament ? 'Edit Tournament' : 'Create Tournament'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Tournament Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-dark"
              placeholder="e.g., PINGERS WORLD CHAMPIONSHIP II"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-dark min-h-[80px]"
              placeholder="12 players enter. Balls to the wall..."
            />
          </div>

          {/* Venue & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">
                <MapPin size={14} className="inline mr-1" />
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="input-dark"
                placeholder="The Home of Pingers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">
                <Calendar size={14} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">End Date (optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Registration Deadline</label>
              <input
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="input-dark"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-dark"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Max Players</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="input-dark"
                min="4"
                max="32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Groups</label>
              <input
                type="number"
                value={formData.groupCount}
                onChange={(e) => setFormData({ ...formData, groupCount: parseInt(e.target.value) })}
                className="input-dark"
                min="2"
                max="8"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-pingers-cream/80 mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="input-dark"
              placeholder="https://..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gold" isLoading={saving} className="flex-1">
              {tournament ? 'Save Changes' : 'Create Tournament'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
