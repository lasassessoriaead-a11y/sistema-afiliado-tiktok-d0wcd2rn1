import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, CalendarDays, DollarSign, TrendingUp } from 'lucide-react'
import { getProducts } from '@/services/products'
import { getPostingCalendar } from '@/services/posting-calendar'
import { getTrackingRecords } from '@/services/tracking'

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [calendar, setCalendar] = useState<any[]>([])
  const [tracking, setTracking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c, t] = await Promise.all([
          getProducts(),
          getPostingCalendar(),
          getTrackingRecords(),
        ])
        setProducts(p)
        setCalendar(c)
        setTracking(t)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalCommission = tracking.reduce((s, t) => s + (t.commission || 0), 0)
  const totalClicks = tracking.reduce((s, t) => s + (t.clicks || 0), 0)
  const totalOrders = tracking.reduce((s, t) => s + (t.orders || 0), 0)
  const nextPost = calendar[0]

  const stats = [
    { label: 'Produtos', value: products.length, icon: Package, color: 'text-pink-500' },
    { label: 'Cliques', value: totalClicks, icon: TrendingUp, color: 'text-cyan-500' },
    { label: 'Pedidos', value: totalOrders, icon: DollarSign, color: 'text-green-500' },
    {
      label: 'Comissão Total',
      value: `R$ ${totalCommission.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-yellow-500',
    },
  ]

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu sistema de afiliados</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" /> Próxima Postagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextPost ? (
              <div className="space-y-2">
                <p className="font-medium">
                  {nextPost.day} às {nextPost.time}
                </p>
                <p className="text-sm text-muted-foreground">{nextPost.content_type}</p>
                <p className="text-sm">{nextPost.cta}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma postagem agendada</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" /> Top Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{p.name}</span>
                  <span className="text-sm text-green-600 font-medium shrink-0 ml-2">
                    {p.commission_margin}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
