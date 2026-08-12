import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Sparkles, Copy, CheckCircle2, TrendingUp, Shield, DollarSign } from 'lucide-react'

const sparkAdTemplate = `Oi, [NOME DA MARCA]! 👋

Sou criador(a) de conteúdo no TikTok (@[SEU PERFIL]) e já produzi vídeos orgânicos do [PRODUTO] que performaram muito bem:

• Vídeo 1: [X] mil visualizações, [Y] cliques no carrinho
• Vídeo 2: [X] mil visualizações, [Y] vendas geradas

Quero oferecer esses vídeos para vocês usarem como Spark Ads. Você ganha:
✅ Conteúdo orgânico validado (já tem prova de engajamento)
✅ 30% mais taxa de conclusão que anúncios tradicionais
✅ 142% mais engajamento que criativos de marca

Eu mantenho os direitos do vídeo e recebo a comissão das vendas geradas pelo anúncio — modelo win-win. Para autorizar, basta gerar o código de autorização de vídeo no seu TikTok Ads Manager e me enviar.

Posso também produzir novos criativos otimizados para Spark Ads. Topa conversar?

Abraço,
[SEU NOME] | @[SEU PERFIL]`

const authSteps = [
  {
    step: 1,
    title: 'Acesse o TikTok Ads Manager',
    desc: 'A marca entra em ads.tiktok.com com a conta de anúncios vinculada ao TikTok Shop.',
  },
  {
    step: 2,
    title: 'Vá em "Assets" > "Content" > "Spark Ads"',
    desc: 'Na seção de ativos, encontre a aba de conteúdo de Spark Ads.',
  },
  {
    step: 3,
    title: 'Clique em "Request Code" (solicitar código)',
    desc: 'O sistema gera um código de autorização que o criador deve usar ao publicar o vídeo.',
  },
  {
    step: 4,
    title: 'A marca envia o código ao criador',
    desc: 'Por DM, email ou WhatsApp — o criador usa o código ao publicar o vídeo orgânico.',
  },
  {
    step: 5,
    title: 'Criador publica o vídeo com o código de autorização',
    desc: 'No app do TikTok, ao publicar, ativa "Permitir uso comercial" e insere o código recebido.',
  },
  {
    step: 6,
    title: 'A marca seleciona o vídeo no Ads Manager',
    desc: 'O vídeo aparece como disponível para impulsionar como Spark Ad — basta criar a campanha.',
  },
]

const prerequisites = [
  'Vídeo com no mínimo 1.000 visualizações orgânicas (prova de engajamento inicial)',
  'Vídeo publicado há no máximo 30 dias (algoritmo prefere conteúdo recente)',
  "Qualidade mínima: 720p, áudio claro, sem marca d'água de outros apps",
  'Sem conteúdo proibido pelas políticas de anúncios do TikTok (drogas, armas, etc.)',
  'Vídeo já vinculado a um produto do TikTok Shop (carrinho amarelo)',
  'Conta do criador verificada e em dia com as políticas da plataforma',
  'Duração entre 9 e 60 segundos (ideal: 15-30s para anúncios)',
  'Engajamento mínimo: taxa de retenção acima de 50% nos primeiros 3 segundos',
]

export default function SparkAds() {
  const { toast } = useToast()

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(sparkAdTemplate)
      toast({
        title: 'Template copiado!',
        description: 'Adapte com seus números e envie às marcas.',
      })
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" /> Spark Ads
        </h1>
        <p className="text-muted-foreground">
          Anúncios que usam seus vídeos orgânicos — você mantém os direitos e ainda recebe comissão
          das vendas geradas pelo anúncio.
        </p>
      </div>

      {/* What are Spark Ads */}
      <Card>
        <CardHeader>
          <CardTitle>O que são Spark Ads?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed">
            Spark Ads são anúncios do TikTok que usam <strong>vídeos orgânicos de criadores</strong>{' '}
            em vez de criativos de marca tradicionais. A marca impulsiona um vídeo que você já
            publicou organicamente, mantendo os likes, comentários e shares originais — o que gera
            muito mais confiança e engajamento do que um anúncio frio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
              <p className="text-2xl font-bold text-green-600">+30%</p>
              <p className="text-xs text-muted-foreground">
                taxa de conclusão vs anúncios tradicionais
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">+142%</p>
              <p className="text-xs text-muted-foreground">
                mais engajamento que criativos de marca
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advantages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" /> Vantagens para o Afiliado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Você mantém os direitos do vídeo</p>
                <p className="text-xs text-muted-foreground">
                  O vídeo continua sendo seu — a marca apenas ganha permissão para impulsioná-lo
                  como anúncio por um período determinado.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Você recebe comissão das vendas do anúncio</p>
                <p className="text-xs text-muted-foreground">
                  Como o vídeo continua vinculado ao seu link de afiliado, todas as vendas geradas
                  pelo Spark Ads contam para a sua comissão — você ganha de duas formas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Aumenta seu alcance e autoridade</p>
                <p className="text-xs text-muted-foreground">
                  O vídeo impulsionado leva mais tráfego ao seu perfil, gerando novos seguidores e
                  visualizações nos seus outros conteúdos orgânicos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to authorize */}
      <Card>
        <CardHeader>
          <CardTitle>Como Autorizar (passo a passo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {authSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" /> Template para Oferecer Seus Vídeos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Envie este template às marcas cujos produtos você já divulga como afiliado. Mostre os
            números dos seus vídeos orgânicos — prova de performance é o que fecha a parceria.
          </p>
          <pre className="text-sm bg-muted rounded-md p-4 whitespace-pre-wrap leading-relaxed font-sans">
            {sparkAdTemplate}
          </pre>
          <Button onClick={copyTemplate}>
            <Copy className="w-4 h-4 mr-2" /> Copiar template
          </Button>
        </CardContent>
      </Card>

      {/* Prerequisites checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Checklist: Pré-requisitos para Spark
            Ads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prerequisites.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pay" className="border-0">
              <AccordionTrigger className="text-sm">
                Eu cobro da marca para ceder o vídeo?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Como afiliado, você já recebe a comissão das vendas geradas pelo anúncio — esse é o
                seu ganho principal. Se quiser cobrar uma taxa adicional pela cessão, negocie
                diretamente, mas para começar o modelo comissionado costuma ser mais atrativo para
                as marcas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="remove" className="border-0">
              <AccordionTrigger className="text-sm">Posso revogar a autorização?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Sim. Você pode revogar a autorização a qualquer momento nas configurações de
                privacidade do TikTok. A campanha de Spark Ad é pausada imediatamente.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multiple" className="border-0">
              <AccordionTrigger className="text-sm">
                Posso autorizar várias marcas?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Sim, cada vídeo pode ter um código de autorização por marca. Mas evite autorizar o
                mesmo vídeo para marcas concorrentes — pode gerar conflito de interesse.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
