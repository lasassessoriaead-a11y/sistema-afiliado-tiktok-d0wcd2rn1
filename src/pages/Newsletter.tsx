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
import { getNewsletterEditions, type NewsletterEdition } from '@/services/content-library'
import { Mail, Copy, Settings, CheckCircle2 } from 'lucide-react'

const setupInstructions = [
  {
    tool: 'Mailchimp (gratuito até 500 contatos)',
    steps: [
      'Crie conta gratuita em mailchimp.com',
      'Vá em "Audience" > "Create Audience" e nomeie como "Afiliados TikTok"',
      'Crie um formulário de inscrição (Signup forms) e cole o link na sua bio do TikTok',
      'Vá em "Campaigns" > "Create Campaign" > "Email" e escolha o template em branco',
      'Cole o conteúdo de cada edição (abaixo) no editor',
      'Agende o envio para toda terça às 9h (dia de pico de abertura de emails)',
      'No plano gratuito você pode enviar até 1.000 emails/mês — suficiente para começar',
    ],
  },
  {
    tool: 'ConvertKit (gratuito até 1.000 contatos)',
    steps: [
      'Crie conta gratuita em convertkit.com',
      'Crie uma "Landing Page" com o título "Dicas Semanais de Afiliado TikTok"',
      'Configure a sequência de boas-vindas automática',
      'Crie um "Broadcast" para cada edição da newsletter',
      'ConvertKit é melhor para creators — tem automações gratuitas',
    ],
  },
  {
    tool: 'Brevo (gratuito até 300 emails/dia)',
    steps: [
      'Crie conta gratuita em brevo.com',
      'Vá em "Contatos" > "Criar uma lista" chamada "Newsletter Afiliados"',
      'Crie um formulário de inscrição e adicione à sua bio',
      'Vá em "Campanhas" > "Criar campanha" e cole o conteúdo da edição',
      'Plano gratuito: 300 emails/dia ilimitados — ideal para crescer sem custo',
    ],
  },
]

const recommendedTool =
  'Recomendamos começar com o Mailchimp (gratuito até 500 contatos) ou Brevo (300 emails/dia grátis). Ambos têm templates prontos e formulários de inscrição fáceis de embutir na bio do TikTok. Para quem quer automações mais avançadas (sequências de boas-vindas, segmentação), ConvertKit é a melhor opção gratuita.'

export default function Newsletter() {
  const [editions, setEditions] = useState<NewsletterEdition[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = async () => {
    try {
      setEditions(await getNewsletterEditions())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('newsletter_editions', () => {
    load()
  })

  const copyEdition = async (ed: NewsletterEdition) => {
    const text = `ASSUNTO: ${ed.subject}

═══════════════════════════════
🔥 PRODUTO DA SEMANA
═══════════════════════════════
${ed.product_of_week}

═══════════════════════════════
🎯 HOOK TRENDING
═══════════════════════════════
${ed.hook_trending}

═══════════════════════════════
⚡ DICA RÁPIDA
═══════════════════════════════
${ed.quick_tip}

═══════════════════════════════
👀 BASTIDORES (meus resultados da semana)
═══════════════════════════════
${ed.behind_scenes}

═══════════════════════════════
👉 ${ed.cta_text}
═══════════════════════════════`
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Edição copiada!',
        description: `Edição #${ed.edition_number} pronta para colar no seu editor de email.`,
      })
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
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-500" /> Newsletter Semanal
        </h1>
        <p className="text-muted-foreground">
          Newsletter pronta para enviar toda semana. 4 edições completas (1 mês de conteúdo) +
          instruções de configuração gratuita em Mailchimp, ConvertKit ou Brevo.
        </p>
      </div>

      {/* Structure */}
      <Card>
        <CardHeader>
          <CardTitle>📐 Estrutura de Cada Edição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 border border-muted">
              <p className="font-medium text-sm">🔥 Produto da Semana</p>
              <p className="text-xs text-muted-foreground mt-1">
                Destaque de 1 produto com maior potencial de conversão no momento.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-muted">
              <p className="font-medium text-sm">🎯 Hook Trending</p>
              <p className="text-xs text-muted-foreground mt-1">
                O gancho que está bombando no TikTok — para usar nos vídeos da semana.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-muted">
              <p className="font-medium text-sm">⚡ Dica Rápida</p>
              <p className="text-xs text-muted-foreground mt-1">
                1 tática prática por edição para aplicar imediatamente.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-muted">
              <p className="font-medium text-sm">👀 Bastidores</p>
              <p className="text-xs text-muted-foreground mt-1">
                Seus resultados da semana — para criar conexão e autoridade com a audiência.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">📬 4 Edições Prontas (1 mês de conteúdo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editions.map((ed) => (
            <Card key={ed.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">Edição #{ed.edition_number}</CardTitle>
                  <Badge variant="secondary">Semana {ed.edition_number}</Badge>
                </div>
                <p className="text-sm font-medium text-primary">{ed.subject}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    🔥 Produto da Semana
                  </p>
                  <p className="text-sm mt-0.5">{ed.product_of_week}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">🎯 Hook Trending</p>
                  <p className="text-sm mt-0.5">{ed.hook_trending}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">⚡ Dica Rápida</p>
                  <p className="text-sm mt-0.5">{ed.quick_tip}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">👀 Bastidores</p>
                  <p className="text-sm mt-0.5">{ed.behind_scenes}</p>
                </div>
                <div className="pt-2 border-t mt-2">
                  <p className="text-xs font-semibold text-muted-foreground">👉 CTA</p>
                  <p className="text-sm mt-0.5">{ed.cta_text}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                  onClick={() => copyEdition(ed)}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copiar edição completa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tool recommendation */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Ferramenta recomendada para começar (gratuita)</p>
            <p className="text-muted-foreground">{recommendedTool}</p>
          </div>
        </CardContent>
      </Card>

      {/* Setup instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" /> Como Configurar (passo a passo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {setupInstructions.map((s) => (
              <AccordionItem key={s.tool} value={s.tool} className="border-0">
                <AccordionTrigger className="text-sm">{s.tool}</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {s.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
