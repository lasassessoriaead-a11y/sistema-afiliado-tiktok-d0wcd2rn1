import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartContainer } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getProducts } from '@/services/products'
import { getTrackingRecords, createTrackingRecord } from '@/services/tracking'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { Plus } from 'lucide-react'

const sources = ['Link da bio', 'Link do vídeo', 'Story', 'Outro']

export default function Commissions() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    date: '',
    product: '',
    source: '',
    clicks: '',
    orders: '',
    commission: '',
  })

  const load = async () => {
    try {
      const [p, t] = await Promise.all([getProducts(), getTrackingRecords()])
      setProducts(p)
      setRecords(t)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('tracking', () => {
    load()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createTrackingRecord({
        owner: user?.id,
        date: form.date,
        product: form.product,
        source: form.source,
        clicks: Number(form.clicks),
        orders: Number(form.orders),
        commission: Number(form.commission),
      })
      setForm({ date: '', product: '', source: '', clicks: '', orders: '', commission: '' })
    } catch (err) {
      setFieldErrors(extractFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  const totalCommission = records.reduce((s, r) => s + (r.commission || 0), 0)
  const totalClicks = records.reduce((s, r) => s + (r.clicks || 0), 0)
  const totalOrders = records.reduce((s, r) => s + (r.orders || 0), 0)
  const chartData = records.map((r) => ({
    date: new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    comissao: r.commission || 0,
  }))

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Comissões</h1>
        <p className="text-muted-foreground">Registre e acompanhe seus ganhos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Cliques</p>
            <p className="text-2xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Pedidos</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Comissão Total</p>
            <p className="text-2xl font-bold text-green-600">R$ {totalCommission.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Registrar Comissão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            <div className="space-y-1">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              {fieldErrors.date && <p className="text-xs text-destructive">{fieldErrors.date}</p>}
            </div>
            <div className="space-y-1">
              <Label>Produto</Label>
              <Select value={form.product} onValueChange={(v) => setForm({ ...form, product: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.product && (
                <p className="text-xs text-destructive">{fieldErrors.product}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Origem</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.source && (
                <p className="text-xs text-destructive">{fieldErrors.source}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="clicks">Cliques</Label>
              <Input
                id="clicks"
                type="number"
                min="0"
                value={form.clicks}
                onChange={(e) => setForm({ ...form, clicks: e.target.value })}
                required
              />
              {fieldErrors.clicks && (
                <p className="text-xs text-destructive">{fieldErrors.clicks}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="orders">Pedidos</Label>
              <Input
                id="orders"
                type="number"
                min="0"
                value={form.orders}
                onChange={(e) => setForm({ ...form, orders: e.target.value })}
                required
              />
              {fieldErrors.orders && (
                <p className="text-xs text-destructive">{fieldErrors.orders}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="commission">Comissão (R$)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                step="0.01"
                value={form.commission}
                onChange={(e) => setForm({ ...form, commission: e.target.value })}
                required
              />
              {fieldErrors.commission && (
                <p className="text-xs text-destructive">{fieldErrors.commission}</p>
              )}
            </div>
            <Button type="submit" disabled={submitting} className="md:col-span-3 lg:col-span-6">
              {submitting ? 'Salvando...' : 'Registrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comissões por Data</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ comissao: { label: 'Comissão', color: 'hsl(var(--primary))' } }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="comissao" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-sm">{r.expand?.product?.name || '—'}</TableCell>
                  <TableCell className="text-sm">{r.source}</TableCell>
                  <TableCell>{r.clicks}</TableCell>
                  <TableCell>{r.orders}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    R$ {(r.commission || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
