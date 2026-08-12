import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getProducts } from '@/services/products'
import {
  Smartphone,
  Store,
  Search,
  MousePointerClick,
  CheckCheck,
  Copy,
  Lightbulb,
  ClipboardList,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GuideStep {
  icon: typeof Smartphone
  title: string
  description: string
}

const steps: GuideStep[] = [
  {
    icon: Smartphone,
    title: '1. Abra o app do TikTok',
    description:
      'Abra o TikTok no celular. Na barra inferior, toque no ícone da "Loja" (carrinho) para entrar no TikTok Shop.',
  },
  {
    icon: Store,
    title: '2. Acesse o Creator Center',
    description:
      'Toque no seu perfil → no menu (≡) → "Central do Criador" / "Creator Center" → "TikTok Shop for Creators". Aceite os termos se for a primeira vez.',
  },
  {
    icon: Search,
    title: '3. Busque o produto pelo nome exato',
    description:
      'No campo de busca do Creator Center, cole o nome exato do produto (listado abaixo). Confirme pela foto e pelo preço médio.',
  },
  {
    icon: MousePointerClick,
    title: '4. Clique em "Afiliar-se" / "Promover"',
    description:
      'Na página do produto, toque em "Afiliar-se" (Get Affiliate Link) ou "Promover". Escolha o formato do link (vídeo, Live ou bio).',
  },
  {
    icon: CheckCheck,
    title: '5. Aceite os termos e confirme',
    description:
      'Leia os termos da campanha, marque a caixa de aceitação e toque em "Confirmar". Pronto — seu link de afiliado será gerado.',
  },
]

const tips = [
  'Copie o nome exato do produto antes de abrir o TikTok — evita errar a busca.',
  'Afiliado em vários produtos não atrapalha — quanto mais links, mais chances de venda.',
  'Confira sempre a % de comissão na tela de afiliação antes de confirmar.',
  'Guarde seu link de afiliado em um bloco de notas para usar nos vídeos e na bio.',
  'Só é possível afiliar se o produto estiver com o programa de afiliados ativo na sua região.',
]

const categoryColors: Record<string, string> = {
  Beleza: 'bg-pink-100 text-pink-700',
  Casa: 'bg-blue-100 text-blue-700',
  Cozinha: 'bg-orange-100 text-orange-700',
  Organização: 'bg-green-100 text-green-700',
  'Bem-estar': 'bg-teal-100 text-teal-700',
  'Acessórios Tech': 'bg-purple-100 text-purple-700',
  Utilidades: 'bg-amber-100 text-amber-700',
}

export default function AffiliationGuide() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const copyName = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name)
      toast({ title: 'Nome copiado!', description: name })
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' })
    }
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Guia de Afiliação</h1>
        <p className="text-muted-foreground">
          Passo a passo visual para se afiliar a cada produto no TikTok Shop. A única parte manual
          do sistema.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={i} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </CardContent>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                  →
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Tips */}
      <Card className="border-yellow-400/40 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Dicas e boas práticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tips.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-yellow-500 shrink-0">•</span>
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Products list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Os 10 produtos para afiliar</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Copie o nome exato de cada produto e cole na busca do Creator Center no TikTok Shop.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p, idx) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                    <Badge className={categoryColors[p.category] || 'bg-gray-100 text-gray-700'}>
                      {p.category}
                    </Badge>
                  </div>
                  <p className="font-medium leading-snug truncate">{p.name}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>R$ {(p.average_price || 0).toFixed(2)}</span>
                    <span className="text-green-600 font-medium">
                      {p.commission_margin}% comissão
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => copyName(p.name)}
                >
                  <Copy className="w-4 h-4 mr-1" /> Copiar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
