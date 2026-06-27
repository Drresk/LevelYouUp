'use client'

import { useState, useEffect } from 'react'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Check, Trash2, Calendar } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { CalendarEvent } from '@/types'
import { cn } from '@/lib/utils/cn'

const TYPE_LABEL = { task: 'Tarefa', reminder: 'Lembrete', event: 'Evento' }
const TYPE_COLOR = { task: 'text-blue-400 bg-blue-400/10', reminder: 'text-yellow-400 bg-yellow-400/10', event: 'text-primary bg-primary-muted' }

function urgencyColor(dateStr: string): string {
  const d = new Date(dateStr)
  if (isPast(d) && !isToday(d)) return 'border-l-danger'
  if (isToday(d)) return 'border-l-warning'
  if (isTomorrow(d)) return 'border-l-primary'
  return 'border-l-surface-3'
}

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'task', date: format(new Date(), 'yyyy-MM-dd'), time: '', recurrence: 'none', notify_before: '' })
  const [tab, setTab] = useState<'upcoming' | 'all'>('upcoming')

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    const res = await fetch('/api/calendar')
    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, time: form.time || null, notify_before: form.notify_before ? parseInt(form.notify_before) : null }),
    })
    setShowForm(false)
    setForm({ title: '', type: 'task', date: format(new Date(), 'yyyy-MM-dd'), time: '', recurrence: 'none', notify_before: '' })
    loadEvents()
  }

  async function toggleComplete(event: CalendarEvent) {
    await fetch('/api/calendar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: event.id, completed: !event.completed }),
    })
    setEvents((prev) => prev.map((e) => e.id === event.id ? { ...e, completed: !e.completed } : e))
  }

  async function handleDelete(id: string) {
    await fetch('/api/calendar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const displayed = tab === 'upcoming'
    ? events.filter((e) => !e.completed && !isPast(new Date(e.date + 'T23:59:59'))).slice(0, 20)
    : events

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">📅 Calendário</h1>
            <p className="text-text-muted text-sm mt-0.5">{events.filter((e) => !e.completed).length} pendentes</p>
          </div>
          <button onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105">
            <Plus size={16} /> Novo
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-surface border border-primary/30 rounded-2xl p-5 mb-6 space-y-3">
            <h3 className="font-bold text-white">Novo evento</h3>
            <input type="text" placeholder="Título do evento" required
              value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white placeholder:text-text-dim text-sm focus:outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                className="bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                <option value="task">Tarefa</option>
                <option value="reminder">Lembrete</option>
                <option value="event">Evento</option>
              </select>
              <select value={form.recurrence} onChange={(e) => setForm(f => ({ ...f, recurrence: e.target.value }))}
                className="bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                <option value="none">Sem recorrência</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" required value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                className="bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary" />
              <input type="time" value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))}
                className="bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary" />
            </div>
            <select value={form.notify_before} onChange={(e) => setForm(f => ({ ...f, notify_before: e.target.value }))}
              className="w-full bg-surface-2 border border-surface-3 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
              <option value="">Sem notificação</option>
              <option value="15">15 min antes</option>
              <option value="60">1 hora antes</option>
              <option value="1440">1 dia antes</option>
            </select>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-2 text-text-muted hover:text-white text-sm font-medium transition-all">Cancelar</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black text-sm font-bold transition-all">Criar</button>
            </div>
          </form>
        )}

        <div className="flex bg-surface rounded-xl p-1 mb-6">
          <button onClick={() => setTab('upcoming')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'upcoming' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>Próximos</button>
          <button onClick={() => setTab('all')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'all' ? 'bg-surface-3 text-white' : 'text-text-muted'}`}>Todos</button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-white">Nenhum evento</p>
            <p className="text-sm">Crie um evento ou use o chat!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((event) => (
              <div key={event.id} className={cn('bg-surface border border-surface-3 rounded-xl px-4 py-3 flex items-center gap-3 border-l-4', urgencyColor(event.date))}>
                {event.type === 'task' && (
                  <button onClick={() => toggleComplete(event)} className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0', event.completed ? 'bg-primary border-primary' : 'border-surface-3 hover:border-primary')}>
                    {event.completed && <Check size={10} className="text-black" />}
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium truncate', event.completed ? 'text-text-muted line-through' : 'text-white')}>{event.title}</p>
                  <p className="text-xs text-text-muted">
                    {format(new Date(event.date), "d 'de' MMM", { locale: ptBR })}
                    {event.time && ` às ${event.time.slice(0, 5)}`}
                    {event.recurrence !== 'none' && ` · ${event.recurrence}`}
                  </p>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full flex-shrink-0', TYPE_COLOR[event.type as keyof typeof TYPE_COLOR])}>
                  {TYPE_LABEL[event.type as keyof typeof TYPE_LABEL]}
                </span>
                <button onClick={() => handleDelete(event.id)} className="text-text-dim hover:text-danger transition-colors flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
