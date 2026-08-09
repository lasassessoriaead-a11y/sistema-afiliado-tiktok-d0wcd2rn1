import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Clock, Tag, MessageSquare, Megaphone, Film } from 'lucide-react'
import { getScripts } from '@/services/scripts'
import { useRealtime } from '@/hooks/use-realtime'

export default function Content() {
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setScripts(await getScripts())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('scripts', () => {
    load()
  })

  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Conteúdo</h1>
        <p className="text-muted-foreground">Roteiros prontos para seus vídeos</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {scripts.map((s) => {
          const product = s.expand?.product
          return (
            <AccordionItem key={s.id} value={s.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <Film className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-medium">{s.title}</p>
                    {product && <p className="text-xs text-muted-foreground">{product.name}</p>}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <Megaphone className="w-3 h-3" /> Gancho
                  </p>
                  <p className="text-sm">{s.hook}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Desenvolvimento
                  </p>
                  <p className="text-sm">{s.development}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">CTA</p>
                  <p className="text-sm font-medium text-primary">{s.cta}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <MessageSquare className="w-3 h-3" /> Legenda
                  </p>
                  <p className="text-sm">{s.caption}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  {s.hashtags?.split(' ').map((h: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {h}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Melhor horário:</span>
                  <span className="font-medium">{s.best_time}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
