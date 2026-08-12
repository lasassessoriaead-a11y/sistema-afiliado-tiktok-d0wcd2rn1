import { useEffect, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProducts, searchTrendingProducts } from '@/services/products'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'

// Position badge colors: gold (#1), silver (#2), bronze (#3), gray (#4+)
const positionBadgeClass = (position: number) => {
  if (position === 1) return 'bg-yellow-400 text-yellow-950 border-yellow-500'
  if (position === 2) return 'bg-gray-200 text-gray-800 border-gray-400'
  if (position === 3) return 'bg-orange-400 text-orange-950 border-orange-500'
  return 'bg-gray-100 text-gray-600 border-gray-300'
}

// Trending bar color by score
const trendingBarClass = (score: number) => {
  if (score >= 80) return 'bg-red-500'
  if (score >= 70) return 'bg-orange-500'
  return 'bg-gray-400'
}

const categoryColors: Record<string, string> = {
  Beleza: 'bg-pink-100 text-pink-700',
  Casa: 'bg-blue-100 text-blue-700',
  Cozinha: 'bg-orange-100 text-orange-700',
  Organização: 'bg-green-100 text-green-700',
  'Bem-estar': 'bg-teal-100 text-teal-700',
  'Acessórios Tech': 'bg-purple-100 text-purple-700',
  Utilidades: 'bg-amber-100 text-amber-700',
}

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trendingView, setTrendingView] = useState(true)
  const [searching, setSearching] = useState(false)
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const { toast } = useToast()

  const load = async () => {
    try {
      setProducts(await getProducts())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('products', () => {
    load()
  })

  const handleSearchTrending = async () => {
    setSearching(true)
    try {
      const res = await searchTrendingProducts()
      const list = res?.products || []
      setTrendingProducts(
        list
          .slice()
          .sort((a: any, b: any) => (a.trending_position || 0) - (b.trending_position || 0)),
      )
      toast({
        title: 'Busca concluída',
        description: `${list.length} produtos em alta encontrados no TikTok Shop.`,
      })
    } catch (e) {
      console.error(e)
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível atualizar os produtos em alta agora.',
        variant: 'destructive',
      })
    } finally {
      setSearching(false)
    }
  }

  // The list currently displayed depends on the active view.
  const displayed = trendingView && trendingProducts.length > 0 ? trendingProducts : products

  const showSkeletons = loading || (trendingView && searching && trendingProducts.length === 0)

  if (showSkeletons)
    return (
      <div className="space-y-6 animate-fade-in">
        <TrendingHeader
          searching={searching}
          onSearch={handleSearchTrending}
          trendingView={trendingView}
          setTrendingView={setTrendingView}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <TrendingHeader
        searching={searching}
        onSearch={handleSearchTrending}
        trendingView={trendingView}
        setTrendingView={setTrendingView}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((p) => {
          const score = Number(p.trending_score || 0)
          const position = Number(p.trending_position || 0)
          const showTrending = trendingView && position > 0
          return (
            <Card key={p.id} className="hover:shadow-lg transition-shadow duration-300 relative">
              {showTrending && (
                <div className="absolute -top-2 -left-2 z-10">
                  <Badge className={`border ${positionBadgeClass(position)} shadow-sm`}>
                    #{position}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base leading-snug">{p.name}</CardTitle>
                  <Badge className={categoryColors[p.category] || 'bg-gray-100 text-gray-700'}>
                    {p.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preço médio</span>
                  <span className="font-medium">R$ {(p.average_price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comissão</span>
                  <span className="font-medium text-green-600">{p.commission_margin}%</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Por que vender</p>
                  <p className="text-sm leading-relaxed">{p.why_sell}</p>
                </div>
                {showTrending && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium">
                        {score >= 80 ? '🔥 Em alta' : score >= 70 ? '📈 Crescendo' : 'Tendência'}
                      </span>
                      <span className="text-muted-foreground">{score}/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${trendingBarClass(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function TrendingHeader({
  searching,
  onSearch,
  trendingView,
  setTrendingView,
}: {
  searching: boolean
  onSearch: () => void
  trendingView: boolean
  setTrendingView: (v: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="text-muted-foreground">Catálogo de produtos para afiliação</p>
      </div>

      <div className="rounded-xl border bg-gradient-to-r from-pink-50 via-red-50 to-orange-50 dark:from-pink-950/30 dark:via-red-950/30 dark:to-orange-950/30 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🔥</span>
              Produtos em Alta no TikTok Shop
            </h2>
            <p className="text-sm text-muted-foreground">
              Os mais vendidos e mais visitados — atualizado agora
            </p>
          </div>
          <Button onClick={onSearch} disabled={searching} className="shrink-0">
            {searching ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar produtos em alta
              </>
            )}
          </Button>
        </div>

        <Tabs
          value={trendingView ? 'trending' : 'catalog'}
          onValueChange={(v) => setTrendingView(v === 'trending')}
        >
          <TabsList>
            <TabsTrigger value="trending">Em Alta</TabsTrigger>
            <TabsTrigger value="catalog">Catálogo Completo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
