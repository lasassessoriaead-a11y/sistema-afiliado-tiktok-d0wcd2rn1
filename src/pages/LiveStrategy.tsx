import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { getLiveScripts, type LiveScript } from '@/services/live-scripts'
import { Radio, CalendarDays, CheckCircle2, MessageCircle, Clock, Copy } from 'lucide-react'

const weeklySchedule = [
  {
    day: 'Terça-feira',
    time: '19:00',
    reason: 'Pico de audiência noturna — público de compras online.',
  },
  {
    day: 'Quinta-feira',
    time: '12:00',
    reason: 'Horário de almoço — alto tráfego do público 25-45 anos.',
  },
  {
    day: 'Sábado',
    time: '18:00',
    reason: 'Fim de semana — maior tempo médio de visualização ao vivo.',
  },
]

const preLiveChecklist = [
  'Iluminação frontal (ring light ou janela) — sem sombra no rosto',
  'Enquadramento limpo, fundo organizado, sem distrações',
  'Link do produto salvo e testado no carrinho amarelo',
  'Script revisado e impresso/aberto no segundo dispositivo',
  'Bateria do celular 100% ou carregador conectado',
  'Conexão Wi-Fi estável (teste a internet antes)',
  'Produto em mãos + amostra extra para demonstração',
  'Bio do TikTok atualizada com link do produto',
  'Áudio testado — microfone claro, sem eco',
  'Avisar nos stories 1h antes para construir audiência',
]

const engagementTips = [
  {
    title: 'Responda comentários em tempo real',
    desc: 'Nomeie o seguidor pelo @ e responda em voz alta. Pessoas que são respondidas compram 3x mais.',
  },
  {
    title: 'Fixe o link do produto',
    desc: 'Use o pin de comentário para fixar o link do carrinho no topo do chat da live.',
  },
  {
    title: 'Use enquetes',
    desc: 'Crie enquetes ("qual cor você prefere?") para gerar interação e aumentar o alcance da live.',
  },
  {
    title: 'CTA a cada 5 minutos',
    desc: 'Repita o call to action ("link na bio / carrinho amarelo") a cada 5 minutos para captar quem entra no meio.',
  },
  {
    title: 'Crie escassez real',
    desc: 'Mostre o contador de estoque na tela. Frases como "só mais 5 unidades" convertem.',
  },
  {
    title: 'Grave a live',
    desc: 'Salve a transmissão como vídeo — você pode recortar os melhores momentos para posts orgânicos.',
  },
]

export default function LiveStrategy() {
  const [scripts, setScripts] = useState<LiveScript[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = async () => {
    try {
      setScripts(await getLiveScripts())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('live_scripts', () => {
    load()
  })

  const copyScript = async (script: LiveScript) => {
    const text = `🎬 ${script.title} (${script.duration_min} min)\n\n【ABERTURA】\n${script.opening}\n\n【APRESENTAÇÃO】\n${script.presentation}\n\n【DEMONSTRAÇÃO】\n${script.demonstration}\n\n【OBJEÇÕES】\n${script.objections}\n\n【OFERTAS】\n${script.offers}\n\n【CTA】\n${script.cta}`
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Roteiro copiado!', description: `"${script.title}" pronto para colar.` })
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' })
    }
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Radio className="w-6 h-6 text-red-500" /> Estratégia de Lives
        </h1>
        <p className="text-muted-foreground">
          LIVES convertem 5-12% vs 3-6% dos vídeos e geram 10x mais receita. Os top 0,5% dos
          afiliados fazem lives 2-3x por semana.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-red-600">5-12%</p>
            <p className="text-sm text-muted-foreground mt-1">Taxa de conversão em lives</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-orange-200">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-orange-600">10x</p>
            <p className="text-sm text-muted-foreground mt-1">Mais receita que vídeos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-yellow-950/30 dark:to-pink-950/30 border-yellow-200">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-pink-600">2-3x</p>
            <p className="text-sm text-muted-foreground mt-1">Lives por semana (top 0,5%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Calendário Semanal de Lives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklySchedule.map((s) => (
            <div
              key={s.day}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-muted"
            >
              <Badge className="shrink-0 bg-primary text-primary-foreground">{s.day}</Badge>
              <div className="flex-1">
                <p className="font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {s.time}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.reason}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pre-live checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Checklist Pré-Live
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {preLiveChecklist.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" /> Dicas de Engajamento ao Vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {engagementTips.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 border border-muted">
                <p className="font-medium text-sm">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live scripts */}
      <div>
        <h2 className="text-lg font-semibold mb-3">🎬 5 Roteiros Completos de Live</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cada roteiro tem 15-20 minutos e inclui abertura, apresentação, demonstração ao vivo,
          respostas a objeções, ofertas relâmpago e CTA.
        </p>
        <div className="space-y-3">
          {scripts.map((script) => (
            <Card key={script.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold">{script.title}</h3>
                    <Badge variant="secondary" className="mt-1">
                      <Clock className="w-3 h-3 mr-1" /> {script.duration_min} min
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyScript(script)}>
                    <Copy className="w-4 h-4 mr-2" /> Copiar roteiro
                  </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="opening" className="border-0">
                    <AccordionTrigger className="text-sm py-2">
                      🎤 Abertura (gancho 3s)
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {script.opening}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="presentation" className="border-0">
                    <AccordionTrigger className="text-sm py-2">
                      📦 Apresentação do produto
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {script.presentation}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="demo" className="border-0">
                    <AccordionTrigger className="text-sm py-2">
                      👁️ Demonstração ao vivo
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {script.demonstration}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="objections" className="border-0">
                    <AccordionTrigger className="text-sm py-2">
                      💬 Respostas a objeções
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {script.objections}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="offers" className="border-0">
                    <AccordionTrigger className="text-sm py-2">
                      ⚡ Ofertas relâmpago
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {script.offers}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="cta" className="border-0">
                    <AccordionTrigger className="text-sm py-2">🎯 Call to action</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {script.cta}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
