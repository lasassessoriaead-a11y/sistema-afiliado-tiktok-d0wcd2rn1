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
import {
  getTrackingRecords,
  createTrackingRecord,
  updateTrackingRecord,
  deleteTrackingRecord,
} from '@/services/tracking'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const sources = ['Link da bio', 'Link do vídeo', 'Story', 'Outro']

export default function Commissions() {
  const { user } = useAuth()
  const { toast } = useToast()
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
  const [editRecord, setEditRecord] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({
    date: '',
    product: '',
    source: '',
    clicks: '',
    orders: '',
    commission: '',
  })
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editErrors, setEditErrors] = useState<FieldErrors>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
  const chartData = records
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      comissao: r.commission || 0,
    }))

  const openEdit = (r: any) => {
    setEditRecord(r)
    setEditForm({
      date: r.date,
      product: r.product,
      source: r.source,
      clicks: String(r.clicks),
      orders: String(r.orders),
      commission: String(r.commission),
    })
    setEditErrors({})
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord) return
    setEditSubmitting(true)
    setEditErrors({})
    try {
      await updateTrackingRecord(editRecord.id, {
        date: editForm.date,
        product: editForm.product,
        source: editForm.source,
        clicks: Number(editForm.clicks),
        orders: Number(editForm.orders),
        commission: Number(editForm.commission),
      })
      toast({ title: 'Registro atualizado!' })
      setEditRecord(null)
    } catch (err) {
      setEditErrors(extractFieldErrors(err))
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteTrackingRecord(deleteId)
      toast({ title: 'Registro excluído.' })
      setDeleteId(null)
    } catch (e) {
      console.error(e)
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

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
                <TableHead className="text-right">Ações</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(r)}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(r.id)}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editRecord} onOpenChange={(o) => !o && setEditRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogDescription>Altere os campos e salve para atualizar.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="edit-date">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                required
              />
              {editErrors.date && <p className="text-xs text-destructive">{editErrors.date}</p>}
            </div>
            <div className="space-y-1">
              <Label>Produto</Label>
              <Select
                value={editForm.product}
                onValueChange={(v) => setEditForm({ ...editForm, product: v })}
              >
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
              {editErrors.product && (
                <p className="text-xs text-destructive">{editErrors.product}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Origem</Label>
              <Select
                value={editForm.source}
                onValueChange={(v) => setEditForm({ ...editForm, source: v })}
              >
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
              {editErrors.source && <p className="text-xs text-destructive">{editErrors.source}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-clicks">Cliques</Label>
              <Input
                id="edit-clicks"
                type="number"
                min="0"
                value={editForm.clicks}
                onChange={(e) => setEditForm({ ...editForm, clicks: e.target.value })}
                required
              />
              {editErrors.clicks && <p className="text-xs text-destructive">{editErrors.clicks}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-orders">Pedidos</Label>
              <Input
                id="edit-orders"
                type="number"
                min="0"
                value={editForm.orders}
                onChange={(e) => setEditForm({ ...editForm, orders: e.target.value })}
                required
              />
              {editErrors.orders && <p className="text-xs text-destructive">{editErrors.orders}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-commission">Comissão (R$)</Label>
              <Input
                id="edit-commission"
                type="number"
                min="0"
                step="0.01"
                value={editForm.commission}
                onChange={(e) => setEditForm({ ...editForm, commission: e.target.value })}
                required
              />
              {editErrors.commission && (
                <p className="text-xs text-destructive">{editErrors.commission}</p>
              )}
            </div>
            <DialogFooter className="sm:col-span-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditRecord(null)}
                disabled={editSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={editSubmitting}>
                {editSubmitting ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro de comissão será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
