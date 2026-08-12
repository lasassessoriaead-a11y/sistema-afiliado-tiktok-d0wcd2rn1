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
import { getOutreachScripts, type OutreachScript } from '@/services/content-library'
import { Mail, Copy, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react'

const emailTemplate = `Assunto: Parceria de product seeding — [SEU PERFIL] x [MARCA]

Prezado(a) time da [MARCA],

Meu nome é [SEU NOME], sou criador(a) de conteúdo no TikTok (@[SEU PERFIL]) com foco em [SEU NICHO]. Tenho [X] mil seguidores engajados e média de [Y] mil visualizações por vídeo.

Acompanho a [MARCA] e acredito que o produto [NOME DO PRODUTO] tem enorme potencial com meu público — que é 80% [faixa etária/gênero] alinhado ao produto.

Gostaria de propor uma parceria de product seeding:
• Solicito 1 amostra do [PRODUTO] para criação de conteúdo orgânico
• Em troca ofereço: 1 vídeo principal no TikTok, 2 stories e menção na bio por 7 dias
• Todo conteúdo seguirá as diretrizes da marca e pode ser usado por vocês

Já sou afiliado(a) de vocês no TikTok Shop e gerei [Z] vendas no último mês — anexo mídia kit com métricas.

Agradeço a atenção e fico à disposição.

Atenciosamente,
[SEU NOME]
@[SEU PERFIL] | [SEU EMAIL]`

const seedBrands = [
  {
    name: 'Vult Cosmética',
    link: 'https://www.vult.com.br',
    note: 'Programa de creators ativo, envia amostras para afiliados com provas de venda.',
  },
  {
    name: 'Eudora',
    link: 'https://www.eudora.com.br',
    note: 'Marcas de beleza com product seeding para criadores de nicho.',
  },
  {
    name: 'Sallve',
    link: 'https://www.sallve.com.br',
    note: 'Skincare digital-native, responde bem a criadores com audiência jovem.',
  },
  {
    name: 'Simple Organic',
    link: 'https://www.simpleorganic.com.br',
    note: 'Cosmética natural — busca creators alinhados ao posicionamento.',
  },
  {
    name: 'Boticário',
    link: 'https://www.boticario.com.br',
    note: 'Programa oficial de creators com amostras e comissão.',
  },
  {
    name: 'Quem Disse, Berenice?',
    link: 'https://www.quemdisseberenice.com.br',
    note: 'Beleza com programa de influência para micro e nano creators.',
  },
  {
    name: 'Jequiti',
    link: 'https://www.jequiti.com.br',
    note: 'Beleza e bem-estar, abre seeding para afiliados do TikTok Shop.',
  },
  {
    name: 'Nativa SPA',
    link: 'https://www.nativaspa.com.br',
    note: 'Bem-estar e aromacologia, aceita pitches de creators via DM.',
  },
  {
    name: 'Adcos',
    link: 'https://www.adcos.com.br',
    note: 'Dermocosméticos, programa para creators com foco em skincare.',
  },
  {
    name: 'Labskin',
    link: 'https://www.labskin.com.br',
    note: 'Skincare clínica, product seeding para criadores de nicho beleza.',
  },
]

export default function Outreach() {
  const [scripts, setScripts] = useState<OutreachScript[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = async () => {
    try {
      setScripts(await getOutreachScripts())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('outreach_scripts', () => {
    load()
  })

  const copyMessage = async (msg: string, label: string) => {
    try {
      await navigator.clipboard.writeText(msg)
      toast({ title: 'Mensagem copiada!', description: `Pronta para colar — ${label}.` })
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' })
    }
  }

  const toneColors: Record<string, string> = {
    Formal: 'bg-blue-100 text-blue-700',
    Casual: 'bg-green-100 text-green-700',
    'Baseado em dados': 'bg-purple-100 text-purple-700',
    'Curto e direto': 'bg-orange-100 text-orange-700',
    'Follow-up': 'bg-pink-100 text-pink-700',
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-500" /> Scripts de Outreach
        </h1>
        <p className="text-muted-foreground">
          Scripts prontos para pedir amostras grátis às marcas (product seeding). Copie, adapte com
          seus dados e suas métricas reais, e envie via TikTok DM, Instagram DM ou email.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Dica de ouro</p>
            <p className="text-muted-foreground">
              Marcas respondem criadores que já trazem resultado. Antes de pedir amostra, seja
              afiliado da marca por 1-2 semanas e gere ao menos 5 vendas. Mostre os números na
              mensagem — a taxa de resposta dobra.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Message scripts */}
      <div>
        <h2 className="text-lg font-semibold mb-3">💬 5 Scripts de Mensagem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((s) => (
            <Card key={s.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{s.tone}</CardTitle>
                  <div className="flex gap-1">
                    <Badge variant="outline">{s.channel}</Badge>
                    <Badge className={toneColors[s.tone] || 'bg-gray-100'}>{s.tone}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <p className="text-sm bg-muted rounded-md p-3 whitespace-pre-wrap leading-relaxed">
                  {s.message}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                  onClick={() => copyMessage(s.message, s.tone)}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copiar mensagem
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Email template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" /> Template de Email para Outreach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="text-sm bg-muted rounded-md p-4 whitespace-pre-wrap leading-relaxed font-sans">
            {emailTemplate}
          </pre>
          <Button onClick={() => copyMessage(emailTemplate, 'Template de email')}>
            <Copy className="w-4 h-4 mr-2" /> Copiar template de email
          </Button>
        </CardContent>
      </Card>

      {/* Brands list */}
      <div>
        <h2 className="text-lg font-semibold mb-1">🏷️ 10 Marcas que Oferecem Amostras Grátis</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Marcas com programas de creators / product seeding no TikTok Shop Brasil. Acesse o site,
          encontre o programa de creators e aplique com seus números de afiliado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {seedBrands.map((b) => (
            <Card key={b.name}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.note}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={b.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Follow-up strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Quando Mandar Follow-up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="timing" className="border-0">
              <AccordionTrigger className="text-sm">Tempo ideal de espera</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Espere 5 dias úteis antes do follow-up. Marcas recebem dezenas de pitches por dia —
                o follow-up mostra persistência sem ser inconveniente. Use o tom "Follow-up" acima.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="channels" className="border-0">
              <AccordionTrigger className="text-sm">Em qual canal insistir</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Se mandou por email e não respondeu, tente Instagram DM da marca no follow-up.
                Multi-canal aumenta a taxa de resposta em 60%.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nos" className="border-0">
              <AccordionTrigger className="text-sm">Quantos follow-ups mandar</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                No máximo 2 follow-ups (3 contatos no total). Depois disso, espere 30 dias e tente
                novamente com novos números de desempenho. Respeitar o "não" mantém a porta aberta.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
