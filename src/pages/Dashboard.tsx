import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartContainer } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Package,
  CalendarDays,
  DollarSign,
  TrendingUp,
  History,
  Target,
  Percent,
  MousePointerClick,
  Award,
  Radio,
} from 'lucide-react'
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

  // Commission by product (chart)
  const commissionByProduct = products
    .map((p) => {
      const sum = tracking
        .filter((t) => t.product === p.id)
        .reduce((s, t) => s + (t.commission || 0), 0)
      return { name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name, comissao: sum }
    })
    .filter((d) => d.comissao > 0)
    .sort((a, b) => b.comissao - a.comissao)
    .slice(0, 6)

  // Recent activity (last 5 tracking records, already sorted -date)
  const recentActivity = tracking.slice(0, 5)

  // Monthly goal + progress
  const monthlyGoal = 500
  const now = new Date()
  const monthCommission = tracking
    .filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, t) => s + (t.commission || 0), 0)
  const goalPct = Math.min(100, Math.round((monthCommission / monthlyGoal) * 100))

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
      {/* Monthly goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" /> Meta de Ganhos do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso até R$ {monthlyGoal.toFixed(2)}</span>
            <span className="font-medium">R$ {monthCommission.toFixed(2)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{goalPct}% da meta atingida</p>
        </CardContent>
      </Card>

      {/* Professional KPIs (additive) */}
      <ProfessionalKpis products={products} tracking={tracking} />

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

      {/* Commission chart by product */}
      {commissionByProduct.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Comissões por Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ comissao: { label: 'Comissão', color: 'hsl(var(--primary))' } }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionByProduct} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    horizontal={false}
                  />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                  <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                  <Bar dataKey="comissao" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma atividade registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.expand?.product?.name || 'Produto'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.date).toLocaleDateString('pt-BR')} · {r.source} · {r.orders}{' '}
                      pedido(s)
                    </p>
                  </div>
                  <span className="font-medium text-green-600 shrink-0">
                    +R$ {(r.commission || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/** Seção adicional de KPIs profissionais (additiva, não altera nada do dashboard original). */
function ProfessionalKpis({ products, tracking }: { products: any[]; tracking: any[] }) {
  // Estimativa de visualizações: assume CTR médio de TikTok ~3% para estimar views a partir de cliques.
  const ESTIMATED_CTR = 0.03
  const totalClicks = tracking.reduce((s, t) => s + (t.clicks || 0), 0)
  const totalOrders = tracking.reduce((s, t) => s + (t.orders || 0), 0)
  const estimatedViews = totalClicks > 0 ? Math.round(totalClicks / ESTIMATED_CTR) : 0
  const overallCtr = estimatedViews > 0 ? (totalClicks / estimatedViews) * 100 : 0
  const overallCvr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0

  // Por produto: cliques, pedidos, comissão, CVR estimado e ROAS (comissão / cliques como proxy de retorno por esforço).
  const perProduct = products
    .map((p) => {
      const recs = tracking.filter((t) => t.product === p.id)
      const clicks = recs.reduce((s, t) => s + (t.clicks || 0), 0)
      const orders = recs.reduce((s, t) => s + (t.orders || 0), 0)
      const commission = recs.reduce((s, t) => s + (t.commission || 0), 0)
      const cvr = clicks > 0 ? (orders / clicks) * 100 : 0
      const roas = clicks > 0 ? commission / clicks : 0
      return {
        id: p.id,
        name: p.name,
        clicks,
        orders,
        commission,
        cvr,
        roas,
        trending_score: p.trending_score || 0,
      }
    })
    .filter((d) => d.clicks > 0 || d.orders > 0)

  const bestRoas = perProduct.slice().sort((a, b) => b.roas - a.roas)[0]

  // Top 3 produtos do momento por trending_score
  const top3 = products
    .slice()
    .sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0))
    .slice(0, 3)

  // Meta de lives da semana (2/3 feitas) — localStorage para progresso simples
  const livesGoal = 3
  const livesDone =
    typeof window !== 'undefined'
      ? Number(window.localStorage.getItem('dashboard_lives_done') || '0')
      : 0

  const kpiCards = [
    {
      label: 'Taxa de Conversão (estimada)',
      value: `${overallCvr.toFixed(1)}%`,
      sub: `${totalOrders} pedidos / ${totalClicks} cliques`,
      icon: Percent,
      color: 'text-green-500',
    },
    {
      label: 'CTR (Click-Through Rate)',
      value: `${overallCtr.toFixed(1)}%`,
      sub: `${totalClicks} cliques / ~${estimatedViews.toLocaleString('pt-BR')} views`,
      icon: MousePointerClick,
      color: 'text-cyan-500',
    },
    {
      label: 'Melhor ROAS',
      value: bestRoas ? `R$ ${bestRoas.roas.toFixed(2)}` : '—',
      sub: bestRoas ? bestRoas.name.slice(0, 28) : 'Sem dados ainda',
      icon: Award,
      color: 'text-yellow-500',
    },
    {
      label: 'Meta de Lives da Semana',
      value: `${livesDone}/${livesGoal}`,
      sub: 'Lives feitas esta semana',
      icon: Radio,
      color: 'text-red-500',
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5" /> KPIs Profissionais
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <p className="text-2xl font-bold">{k.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
                </div>
                <k.icon className={`w-7 h-7 ${k.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top 3 produtos do momento (por trending_score) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> Top 3 Produtos do Momento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {top3.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 ${
                      i === 0
                        ? 'bg-yellow-400 text-yellow-950'
                        : i === 1
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-orange-400 text-orange-950'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium truncate">{p.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    score {(p.trending_score || 0).toString()}
                  </span>
                  <span className="text-sm text-green-600 font-medium">{p.commission_margin}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversão estimada por produto */}
      {perProduct.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5" /> Conversão Estimada por Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {perProduct
                .slice()
                .sort((a, b) => b.cvr - a.cvr)
                .map((d) => (
                  <div key={d.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate">{d.name}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">
                        {d.cvr.toFixed(1)}% CVR · {d.orders} pedido(s) · R${' '}
                        {d.commission.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, d.cvr * 10)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
