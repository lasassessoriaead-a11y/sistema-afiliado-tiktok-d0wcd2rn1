import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  Rocket,
  TrendingUp,
  Trophy,
  Map,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Target,
  CalendarDays,
  Video,
  BarChart3,
  ListChecks,
  Lightbulb,
  ShoppingBag,
  Megaphone,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Radio,
} from 'lucide-react'

const STORAGE_KEY = 'jornada_zero_progress_v1'

// ============================================================ DADOS DAS FASES

interface ChecklistItem {
  id: string
  label: string
}

interface Phase {
  id: 'fase1' | 'fase2' | 'fase3'
  index: number
  title: string
  subtitle: string
  duration: string
  goal: string
  color: string
  accent: string
  ring: string
  bar: string
  icon: typeof Rocket
  checklists: ChecklistItem[]
}

const phases: Phase[] = [
  {
    id: 'fase1',
    index: 1,
    title: '0 → 1.000 seguidores',
    subtitle: 'Pré-Afiliação — Construindo Audiência do Nada',
    duration: '2–4 semanas',
    goal: 'Chegar a 1.000 seguidores com conteúdo de nicho, sem vender nada. Foco total em construir confiança e achar sua voz.',
    color: 'text-blue-600',
    accent: 'bg-blue-50 border-blue-200',
    ring: 'ring-blue-200',
    bar: '[&>div]:bg-blue-500',
    icon: Rocket,
    checklists: [
      {
        id: 'f1-c1',
        label: 'Criar a conta no TikTok com nome de usuário limpo e fácil de lembrar',
      },
      {
        id: 'f1-c2',
        label: 'Definir o nicho (beleza, casa, tech, organização...) — só 1 para começar',
      },
      {
        id: 'f1-c3',
        label: 'Otimizar a bio: foto, descrição clara do nicho e link (Linktree/beacons)',
      },
      { id: 'f1-c4', label: 'Estudar 10 criadores do nicho e listar os formatos que bombam' },
      { id: 'f1-c5', label: 'Gravar e postar os 14 vídeos do calendário (1 por dia)' },
      { id: 'f1-c6', label: 'Responder TODOS os comentários em até 1h nos primeiros 30 dias' },
      { id: 'f1-c7', label: 'Postar 3 stories por dia mostrando bastidores' },
      {
        id: 'f1-c8',
        label: 'Analisar watch time e retenção de cada vídeo e anotar o que funcionou',
      },
      { id: 'f1-c9', label: 'Chegar a 1.000 seguidores (meta mínima da fase)' },
    ],
  },
  {
    id: 'fase2',
    index: 2,
    title: '1.000 → 5.000 seguidores',
    subtitle: 'Afiliado Piloto — Primeiras Vendas',
    duration: '30 dias (Programa Piloto TikTok Shop)',
    goal: 'Entrar no TikTok Shop Creator, testar produtos do catálogo e fazer as primeiras vendas reais.',
    color: 'text-amber-600',
    accent: 'bg-amber-50 border-amber-200',
    ring: 'ring-amber-200',
    bar: '[&>div]:bg-amber-500',
    icon: TrendingUp,
    checklists: [
      {
        id: 'f2-c1',
        label: 'Aplicar para o TikTok Shop Affiliate Program (Creator → TikTok Shop)',
      },
      { id: 'f2-c2', label: 'Ter a conta aprovada no TikTok Shop Creator' },
      { id: 'f2-c3', label: 'Ativar a sacola de produtos no perfil (showcase)' },
      { id: 'f2-c4', label: 'Afiliar aos 10 produtos do catálogo (comece pelo #1 trending)' },
      { id: 'f2-c5', label: 'Gravar 10 vídeos de produto (1 por dia, alternando formatos)' },
      { id: 'f2-c6', label: 'Fazer a PRIMEIRA venda como afiliado' },
      { id: 'f2-c7', label: 'Atingir 5 vendas no total para liberar product seeding' },
      { id: 'f2-c8', label: 'Medir CTR, conversão por vídeo e comissão total do mês' },
      { id: 'f2-c9', label: 'Chegar a 5.000 seguidores (meta mínima da fase)' },
    ],
  },
  {
    id: 'fase3',
    index: 3,
    title: '5.000+ seguidores',
    subtitle: 'Afiliado Profissional — Escalando',
    duration: 'Contínuo',
    goal: 'Lives, Spark Ads, parcerias com marcas e diversificação de canais. Agora sim usar os scripts de outreach para pedir amostras.',
    color: 'text-green-600',
    accent: 'bg-green-50 border-green-200',
    ring: 'ring-green-200',
    bar: '[&>div]:bg-green-500',
    icon: Trophy,
    checklists: [
      { id: 'f3-c1', label: 'Fazer a primeira live de vendas (15–20 min)' },
      { id: 'f3-c2', label: 'Estabelecer 2 lives por semana (terça, quinta ou sábado)' },
      { id: 'f3-c3', label: 'Configurar Spark Ads e autorizar marcas a usar seus vídeos' },
      { id: 'f3-c4', label: 'Contactar 5 marcas usando os scripts de outreach' },
      { id: 'f3-c5', label: 'Receber a primeira amostra grátis de uma marca' },
      { id: 'f3-c6', label: 'Atingir 10 vendas/mês de forma consistente' },
      { id: 'f3-c7', label: 'Diversificar: criar Instagram e WhatsApp de público' },
      { id: 'f3-c8', label: 'Lançar a primeira newsletter semanal para sua lista' },
      { id: 'f3-c9', label: 'Fechar a primeira parceria direta (product seeding formal)' },
    ],
  },
]

// ============================================================ CONTEÚDO FASE 1

const fastFormats = [
  { name: 'Listicles', example: '"3 produtos da Shopee que todo mundo tá comprando"' },
  { name: 'Antes e Depois', example: '"como era meu quarto antes vs depois de organizar"' },
  { name: 'Resposta a comentários', example: '"me perguntaram onde comprei X..."' },
  { name: 'Unboxing simples', example: '"comprei isso por R$20, será que presta?"' },
  { name: 'Dicas rápidas', example: '"você sabia que dá pra fazer X em 10 segundos?"' },
]

const calendar14 = [
  {
    day: 1,
    idea: 'Apresentação: "Por que decidi começar no TikTok agora" — mostre seu rosto, nicho e meta',
    format: 'Storytelling',
  },
  {
    day: 2,
    idea: 'Listicle: "3 achadinhos da Shopee que mudaram minha rotina" (sem link de venda)',
    format: 'Listicle',
  },
  {
    day: 3,
    idea: 'Dica rápida: "Você sabia que dá pra fazer X em 10 segundos?"',
    format: 'Dica rápida',
  },
  { day: 4, idea: 'Antes e depois: organize um cantinho da casa em 30s', format: 'Antes/Depois' },
  { day: 5, idea: 'Resposta a comentário do dia 2 ("onde comprei?")', format: 'Resposta' },
  { day: 6, idea: 'Unboxing simples: comprei algo barato, será que presta?', format: 'Unboxing' },
  {
    day: 7,
    idea: 'Bastidor: "Como gravo meus vídeos com o celular" — mostre setup',
    format: 'Storytelling',
  },
  {
    day: 8,
    idea: 'Listicle: "5 erros que todo mundo comete ao [atividade do nicho]"',
    format: 'Listicle',
  },
  {
    day: 9,
    idea: 'Dica rápida: atalho/hack do seu nicho que quase ninguém sabe',
    format: 'Dica rápida',
  },
  { day: 10, idea: 'Antes e depois: transformação visual no seu nicho', format: 'Antes/Depois' },
  { day: 11, idea: 'Resposta a comentário recorrente da semana', format: 'Resposta' },
  { day: 12, idea: 'Unboxing: outro item barato para teste honesto', format: 'Unboxing' },
  {
    day: 13,
    idea: 'Listicle: "3 coisas que eu NÃO compraria de novo" — honestidade gera confiança',
    format: 'Listicle',
  },
  {
    day: 14,
    idea: 'Resumo: "O que aprendi em 14 dias postando no TikTok" — fechamento da fase',
    format: 'Storytelling',
  },
]

const hooksFase1 = [
  'Ninguém te conta isso sobre [seu nicho], mas eu descobri...',
  'Comecei do zero no TikTok — olha o que aprendi em 7 dias',
  '3 achadinhos baratos que mudaram minha rotina',
  'Você está fazendo [atividade do nicho] errado esse tempo todo',
  'Eu não acreditava que isso funcionava... até testar',
  'Como era minha [casa/rotina/rosto] antes vs depois de [ação]',
  'Me perguntaram onde comprei X — responde aqui',
  'Comprei isso por R$20, será que presta? (teste honesto)',
  'Você sabia que dá pra fazer [algo] em 10 segundos?',
  'O erro que todo iniciante comete no [nicho] (eu também fiz)',
  'POV: você acabou de descobrir o melhor hack de [nicho]',
  'Testei o produto mais visto do TikTok — surpresa!',
]

const metricsFase1 = [
  {
    name: 'Watch Time',
    desc: 'Tempo médio que as pessoas assistem. Meta inicial: acima de 50% do vídeo.',
  },
  { name: 'Retenção', desc: 'Quem assiste até o final. Quanto maior, mais o TikTok distribui.' },
  { name: 'Compartilhamentos', desc: 'Sinal forte de qualidade. 1 share vale mais que 10 likes.' },
]

// ============================================================ CONTEÚDO FASE 2

const tiktokShopSteps = [
  { step: '1', text: 'Abra o app do TikTok → perfil → menu (3 linhas) → "TikTok Studio".' },
  { step: '2', text: 'Toque em "TikTok Shop" ou "Criador de Shop" no menu.' },
  { step: '3', text: 'Selecione "Afiliado" (Affiliate) e não "Vendedor".' },
  { step: '4', text: 'Preencha o cadastro: categoria de conteúdo, nicho e link do perfil.' },
  {
    step: '5',
    text: 'Aguarde a aprovação (geralmente 1–3 dias úteis). Você precisa de 1.000+ seguidores.',
  },
  { step: '6', text: 'Aprovado? Vá em "Showcase" e ative a sacola de produtos no perfil.' },
  { step: '7', text: 'Busque produtos em "Products" → filtre por comissão e trending.' },
  {
    step: '8',
    text: 'Toque em "Add" para se afiliar. O link já fica disponível no carrinho amarelo.',
  },
]

const productsToTest = [
  {
    rank: 1,
    name: 'Brilho Labial Tinted Viral',
    why: 'Preço baixo (R$29,90) + comissão 20% + apelo visual altíssimo. Converte na primeira venda.',
  },
  {
    rank: 2,
    name: 'Organizador de Gavetas Dobrável',
    why: 'R$39,90 + antes/depois satisfatório. Público de casa adora.',
  },
  {
    rank: 3,
    name: 'Kit Organizador de Maquiagem Acrílico',
    why: 'Visual de "tela de TikTok", conversão alta com tutorial.',
  },
  { rank: 4, name: 'Escorredor de Louça Dobrável', why: 'Utilidade clara em 15s de demonstração.' },
  {
    rank: 5,
    name: 'Lixador de Unhas Elétrico',
    why: 'Ticket maior (R$89,90) mas antes/depois viraliza.',
  },
  {
    rank: 6,
    name: 'Mini Massajeador Facial 3D',
    why: 'Resultado visível em minutos, público 30+ com poder aquisitivo.',
  },
  {
    rank: 7,
    name: 'Garrafa Térmica com Display',
    why: 'Gancho visual (temperatura na tela), fácil de demo.',
  },
  {
    rank: 8,
    name: 'Carregador Magnético 3 em 1',
    why: 'Apelo de presente, demo satisfatória do encaixe.',
  },
  { rank: 9, name: 'Purificador de Ar USB Carro', why: 'Gatilho de saúde/família, baixo ticket.' },
  {
    rank: 10,
    name: 'Mega Hair Extensão Clipe',
    why: 'Maior comissão (22%) mas exige transformação visual forte.',
  },
]

const sellVideoTips = [
  {
    tip: 'Storytelling, não comercial',
    desc: 'Comece com uma história real ("cansei de pagar salão...") e só mostre o produto no segundo 5.',
  },
  {
    tip: 'Demonstração real',
    desc: 'Use o produto AO VIVO. Nada de embalagem parada — mostre funcionando de verdade.',
  },
  {
    tip: 'Review honesto',
    desc: 'Aponte 1 ponto negativo real. Isso aumenta a credibilidade e a conversão.',
  },
  {
    tip: 'CTA suave',
    desc: '"Link no carrinho amarelo" em vez de "COMPRE AGORA". Soa natural e converte mais.',
  },
  {
    tip: 'Antes e depois',
    desc: 'O formato que mais converte. Mostre o problema, a transformação e o resultado.',
  },
]

const metricsFase2 = [
  { name: 'Conversão', desc: '% de quem clicou e comprou. Meta inicial: 2–5%.' },
  { name: 'CTR', desc: 'Cliques no carrinho / visualizações. Meta: acima de 3%.' },
  {
    name: 'Comissão por vídeo',
    desc: 'Receita total dividida pelos vídeos do produto. Foque nos campeões.',
  },
]

// ============================================================ CONTEÚDO FASE 3

const diversification = [
  {
    channel: 'Instagram',
    desc: 'Reposte os melhores vídeos no Reels. Constrói uma segunda audiência.',
  },
  {
    channel: 'WhatsApp',
    desc: 'Grupo ou lista de transmissão com os seguidores mais fiéis. Conversão altíssima.',
  },
  {
    channel: 'Newsletter',
    desc: 'Lista de email semanal com produto da semana e dica. Dono da audiência.',
  },
]

// ============================================================ HOOK DE PROGRESSO

function useJourneyProgress() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCompleted(JSON.parse(raw))
    } catch {
      /* intentionally ignored */
    }
  }, [])

  const toggle = (key: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* intentionally ignored */
      }
      return next
    })
  }

  const reset = () => {
    setCompleted({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* intentionally ignored */
    }
  }

  return { completed, toggle, reset }
}

// ============================================================ COMPONENTE

export default function JornadaDoZero() {
  const { completed, toggle, reset } = useJourneyProgress()
  const { toast } = useToast()
  const [activePhase, setActivePhase] = useState<0 | 1 | 2>(0)
  const [openPhase, setOpenPhase] = useState<string | undefined>(phases[0].id)

  const totalTasks = useMemo(() => phases.reduce((s, p) => s + p.checklists.length, 0), [])
  const totalDone = useMemo(
    () => phases.reduce((s, p) => s + p.checklists.filter((c) => completed[c.id]).length, 0),
    [completed],
  )
  const overallPct = Math.round((totalDone / totalTasks) * 100)

  const phasePct = (p: Phase) => {
    const done = p.checklists.filter((c) => completed[c.id]).length
    return Math.round((done / p.checklists.length) * 100)
  }

  const phaseDone = (p: Phase) => p.checklists.filter((c) => completed[c.id]).length

  const goPrev = () => setActivePhase((p) => (p > 0 ? ((p - 1) as 0 | 1 | 2) : p))
  const goNext = () => setActivePhase((p) => (p < 2 ? ((p + 1) as 0 | 1 | 2) : p))

  const handleReset = () => {
    reset()
    toast({ title: 'Progresso reiniciado', description: 'Todos os checklists foram desmarcados.' })
  }

  const phase = phases[activePhase]
  const PhaseIcon = phase.icon

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="w-6 h-6 text-primary" /> Jornada do Zero
        </h1>
        <p className="text-muted-foreground mt-1">
          O roadmap completo de <strong>0 seguidores</strong> até{' '}
          <strong>afiliado profissional</strong>. Sem ilusão: você não precisa ser conhecido para
          começar — precisa seguir os passos na ordem certa. Seu progresso fica salvo no navegador.
        </p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Progresso Geral da Jornada
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {totalDone}/{totalTasks} tarefas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={overallPct} className="h-3" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{overallPct}% concluído</p>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reiniciar progresso
            </Button>
          </div>
          {/* mini barra por fase */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {phases.map((p) => (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fase {p.index}</span>
                  <span className="font-medium">{phasePct(p)}%</span>
                </div>
                <Progress value={phasePct(p)} className={cn('h-1.5', p.bar)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fase cards (navegação entre fases) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((p, i) => {
          const Icon = p.icon
          const isActive = i === activePhase
          return (
            <button
              key={p.id}
              onClick={() => setActivePhase(i as 0 | 1 | 2)}
              className={cn(
                'text-left rounded-xl border-2 p-4 transition-all hover:shadow-md',
                isActive ? cn(p.accent, 'ring-2', p.ring) : 'bg-card border-border',
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn('w-7 h-7', p.color)} />
                <Badge variant="outline">Fase {p.index}</Badge>
              </div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.subtitle}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {phaseDone(p)}/{p.checklists.length}
                  </span>
                  <span className="font-medium">{phasePct(p)}%</span>
                </div>
                <Progress value={phasePct(p)} className={cn('h-1.5', p.bar)} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Detalhe da fase ativa */}
      <Card className={cn('border-2', phase.accent)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', phase.accent)}>
                <PhaseIcon className={cn('w-6 h-6', phase.color)} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  Fase {phase.index}: {phase.title}
                  <Badge variant="secondary">{phase.duration}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{phase.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goPrev} disabled={activePhase === 0}>
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={goNext} disabled={activePhase === 2}>
                Próxima <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Objetivo */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
            <Target className={cn('w-5 h-5 shrink-0 mt-0.5', phase.color)} />
            <div>
              <p className="text-sm font-medium">Objetivo da fase</p>
              <p className="text-sm text-muted-foreground">{phase.goal}</p>
            </div>
          </div>

          {/* Progresso da fase */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progresso da fase</span>
              <span className="font-medium">
                {phaseDone(phase)}/{phase.checklists.length} · {phasePct(phase)}%
              </span>
            </div>
            <Progress value={phasePct(phase)} className={cn('h-2', phase.bar)} />
          </div>

          {/* CONTEÚDO ESPECÍFICO POR FASE */}
          {activePhase === 0 && <Fase1Content />}
          {activePhase === 1 && <Fase2Content />}
          {activePhase === 2 && <Fase3Content />}

          {/* Checklist interativo (colapsável) */}
          <Collapsible
            open={openPhase === phase.id}
            onOpenChange={(v) => setOpenPhase(v ? phase.id : undefined)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors rounded-lg">
                  <span className="flex items-center gap-2 font-medium">
                    <ListChecks className={cn('w-5 h-5', phase.color)} />
                    Checklist da Fase {phase.index}
                    <Badge variant="secondary">
                      {phaseDone(phase)}/{phase.checklists.length}
                    </Badge>
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 transition-transform',
                      openPhase === phase.id && 'rotate-180',
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-2">
                  {phase.checklists.map((item) => {
                    const isChecked = !!completed[item.id]
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-start gap-3 p-2 rounded-lg transition-colors',
                          isChecked ? 'bg-muted/40' : 'hover:bg-muted/30',
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(item.id)}
                          className="mt-1"
                        />
                        <p
                          className={cn(
                            'text-sm',
                            isChecked && 'line-through text-muted-foreground',
                          )}
                        >
                          {item.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================ FASE 1 CONTENT

function Fase1Content() {
  return (
    <div className="space-y-4">
      {/* Formatos que crescem rápido */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Video className="w-4 h-4 text-blue-500" /> Formatos de vídeo que crescem rápido (sem
          vender)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fastFormats.map((f) => (
            <div key={f.name} className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
              <p className="text-sm font-medium text-blue-900">{f.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calendário 14 dias */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4 text-blue-500" /> Calendário de 14 dias (1 ideia por dia,
          sem vender)
        </h3>
        <div className="space-y-1.5">
          {calendar14.map((d) => (
            <div key={d.day} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 text-sm">
              <Badge className="bg-blue-100 text-blue-700 shrink-0">Dia {d.day}</Badge>
              <div className="flex-1">
                <p>{d.idea}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs">
                {d.format}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Hooks testados */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-500" /> Hooks testados para crescer sem produtos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {hooksFase1.map((h, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg border border-border">
              <span className="text-blue-500 text-xs font-mono shrink-0 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm">{h}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Métricas que importam */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-blue-500" /> Métricas que importam (não vendas ainda)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {metricsFase1.map((m) => (
            <div key={m.name} className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
              <p className="text-sm font-medium text-blue-900">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ============================================================ FASE 2 CONTENT

function Fase2Content() {
  return (
    <div className="space-y-4">
      {/* Como entrar no TikTok Shop */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <ShoppingBag className="w-4 h-4 text-amber-500" /> Como entrar no TikTok Shop Affiliate
          Program
        </h3>
        <div className="space-y-1.5">
          {tiktokShopSteps.map((s) => (
            <div key={s.step} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 text-sm">
              <Badge className="bg-amber-100 text-amber-700 shrink-0">{s.step}</Badge>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Dica: você precisa de pelo menos 1.000 seguidores para ser aprovado. Por isso a Fase 1
          vem primeiro.
        </p>
      </section>

      {/* Produtos para testar primeiro */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-amber-500" /> Quais produtos testar primeiro (ordenados
          por potencial para iniciante)
        </h3>
        <div className="space-y-1.5">
          {productsToTest.map((p) => (
            <div key={p.rank} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 text-sm">
              <Badge className="bg-amber-100 text-amber-700 shrink-0">#{p.rank}</Badge>
              <div className="flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.why}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Veja a lista completa com preços e comissões na aba{' '}
          <Link to="/produtos" className="text-amber-600 underline">
            Produtos
          </Link>
          .
        </p>
      </section>

      {/* Como criar vídeos de venda que não parecem comerciais */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Video className="w-4 h-4 text-amber-500" /> Vídeos de venda que não parecem comerciais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sellVideoTips.map((t) => (
            <div key={t.tip} className="p-3 rounded-lg border border-amber-100 bg-amber-50/50">
              <p className="text-sm font-medium text-amber-900">{t.tip}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Métricas */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-amber-500" /> Métricas que importam agora
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {metricsFase2.map((m) => (
            <div key={m.name} className="p-3 rounded-lg border border-amber-100 bg-amber-50/50">
              <p className="text-sm font-medium text-amber-900">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ============================================================ FASE 3 CONTENT

function Fase3Content() {
  return (
    <div className="space-y-4">
      {/* Live de vendas */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-green-500" /> Como fazer a primeira live de vendas
        </h3>
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <p className="text-sm">
              Lives convertem 5–12% vs 3–6% dos vídeos. Comece com 15 minutos usando um roteiro
              pronto. Acesse o guia completo de estratégia de lives.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/estrategia-lives">
                Abrir <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Spark Ads */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-green-500" /> Spark Ads
        </h3>
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <p className="text-sm">
              Autorize marcas a impulsionar seus vídeos orgânicos como anúncio — você ganha alcance
              extra sem perder a autoria do conteúdo.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/spark-ads">
                Abrir <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Outreach */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Megaphone className="w-4 h-4 text-green-500" /> Agora sim: scripts de outreach para pedir
          amostras
        </h3>
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <p className="text-sm">
              Com 5.000+ seguidores e vendas consistentes, suas chances de resposta das marcas
              disparam. Use os scripts prontos (tom humilde, adaptado ao seu tamanho real).
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/outreach">
                Abrir <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Diversificação */}
      <section>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" /> Diversificação de canais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {diversification.map((d) => (
            <div key={d.channel} className="p-3 rounded-lg border border-green-100 bg-green-50/50">
              <p className="text-sm font-medium text-green-900">{d.channel}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{d.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Veja mais canais na aba{' '}
          <Link to="/canais" className="text-green-600 underline">
            Canais de Divulgação
          </Link>{' '}
          e a newsletter semanal em{' '}
          <Link to="/newsletter" className="text-green-600 underline">
            Newsletter
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
