import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPostingCalendar } from '@/services/posting-calendar'
import { useRealtime } from '@/hooks/use-realtime'

const dayOrder: Record<string, number> = {
  Domingo: 0,
  'Segunda-feira': 1,
  'Terça-feira': 2,
  'Quarta-feira': 3,
  'Quinta-feira': 4,
  'Sexta-feira': 5,
  Sábado: 6,
}

export default function Calendar() {
  const [calendar, setCalendar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setCalendar(await getPostingCalendar())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('posting_calendar', () => {
    load()
  })

  const sorted = [...calendar].sort((a, b) => (dayOrder[a.day] ?? 99) - (dayOrder[b.day] ?? 99))

  if (loading) return <Skeleton className="h-64" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Calendário</h1>
        <p className="text-muted-foreground">Cronograma semanal de postagens</p>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Dia</TableHead>
              <TableHead className="w-24">Horário</TableHead>
              <TableHead>Tipo de Conteúdo</TableHead>
              <TableHead>CTA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((c) => (
              <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{c.day}</TableCell>
                <TableCell>{c.time}</TableCell>
                <TableCell className="text-sm">{c.content_type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.cta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
