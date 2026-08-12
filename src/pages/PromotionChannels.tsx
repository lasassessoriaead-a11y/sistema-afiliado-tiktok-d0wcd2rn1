import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { type PromotionChannel, getPromotionChannels } from '@/services/promotion-channels'
import { Facebook, MessageCircle, Send, ExternalLink, Users, Copy, Info } from 'lucide-react'

const typeMeta: Record<
  PromotionChannel['type'],
  { icon: typeof Facebook; color: string; bg: string }
> = {
  Facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-100' },
  Telegram: { icon: Send, color: 'text-sky-600', bg: 'bg-sky-100' },
  WhatsApp: { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100' },
}

export default function PromotionChannels() {
  const [channels, setChannels] = useState<PromotionChannel[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = async () => {
    try {
      setChannels(await getPromotionChannels())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('promotion_channels', () => {
    load()
  })

  const copyMessage = async (msg: string, name: string) => {
    try {
      await navigator.clipboard.writeText(msg)
      toast({ title: 'Mensagem copiada!', description: `Pronta para colar em "${name}".` })
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' })
    }
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    )

  const grouped = (['Facebook', 'Telegram', 'WhatsApp'] as const).map((t) => ({
    type: t,
    items: channels.filter((c) => c.type === t),
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Canais de Divulgação</h1>
        <p className="text-muted-foreground">
          Grupos e comunidades onde afiliados divulgam produtos do TikTok Shop — com mensagens
          prontas para copiar e colar.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Como usar estes canais</p>
            <p className="text-muted-foreground">
              Substitua <code className="bg-muted px-1 rounded">[NOME DO PRODUTO]</code> e{' '}
              <code className="bg-muted px-1 rounded">[PREÇO]</code> nas mensagens prontas pelos
              dados reais do seu produto. Não poste links de afiliado diretamente em grupos do
              WhatsApp — prefira direcionar para a sua bio do TikTok.
            </p>
          </div>
        </CardContent>
      </Card>

      {grouped.map(({ type, items }) => {
        const meta = typeMeta[type]
        const Icon = meta.icon
        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${meta.color}`} />
              <h2 className="text-lg font-semibold">{type}</h2>
              <Badge variant="secondary">{items.length} canais</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((c) => {
                const TypeIcon = typeMeta[c.type].icon
                return (
                  <Card key={c.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base leading-snug">{c.name}</CardTitle>
                        <span
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${typeMeta[c.type].bg}`}
                        >
                          <TypeIcon className={`w-4 h-4 ${typeMeta[c.type].color}`} />
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {c.members}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Mensagem pronta
                        </p>
                        <p className="text-sm bg-muted rounded-md p-3 whitespace-pre-wrap leading-relaxed">
                          {c.ready_message}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Como entrar e postar
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {c.how_to_join}
                        </p>
                      </div>
                      <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyMessage(c.ready_message, c.name)}
                        >
                          <Copy className="w-4 h-4 mr-2" /> Copiar mensagem
                        </Button>
                        <Button asChild size="sm" className="flex-1">
                          <a href={c.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" /> Acessar grupo
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
