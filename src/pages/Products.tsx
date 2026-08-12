import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getProducts } from '@/services/products'
import { useRealtime } from '@/hooks/use-realtime'

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

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="text-muted-foreground">Catálogo de produtos para afiliação</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="hover:shadow-lg transition-shadow duration-300">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
