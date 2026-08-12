import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Rocket, TrendingUp, Trophy, ListChecks } from 'lucide-react'

interface Phase {
  id: string
  title: string
  range: string
  icon: typeof Rocket
  color: string
  goal: string
  tasks: string[]
}

const phases: Phase[] = [
  {
    id: 'fundacao',
    title: 'Fundação',
    range: 'Dias 1-10',
    icon: Rocket,
    color: 'text-blue-500',
    goal: 'Montar a base: conta, produtos, outreach e primeiros vídeos de teste.',
    tasks: [
      'Criar conta de afiliado no TikTok Shop e ativar a sacola de produtos no perfil',
      'Configurar a bio com link de direcionamento (use o template pronto em "Funil")',
      'Selecionar e afiliar aos 10 produtos do catálogo (use a aba "Produtos")',
      'Priorizar o Produto Hero (#1 trending) nos primeiros vídeos',
      'Salvar as 3 iscas digitais e configurar o link na bio',
      'Gravar e publicar 5 vídeos de teste (1 por dia, dias 6-10)',
      'Enviar 20 ações de outreach por dia: pedir amostras, entrar em grupos, comentar em posts (total 100 ações)',
      'Entrar em 5 grupos de afiliados no Facebook, Telegram e WhatsApp',
      'Comentar em 10 posts de criadores do nicho por dia (networking)',
      'Pedir amostras grátis para 5 marcas usando os scripts de outreach',
    ],
  },
  {
    id: 'momentum',
    title: 'Momentum',
    range: 'Dias 11-20',
    icon: TrendingUp,
    color: 'text-orange-500',
    goal: 'Ganhar tração: mais conteúdo, testar formatos e fazer a primeira live.',
    tasks: [
      'Publicar 20 novos conteúdos (2 por dia: vídeos + stories)',
      'Testar 3 formatos diferentes: unboxing, review honesto e antes/depois',
      'Fazer a primeira sessão de live (15-20 min) usando um roteiro pronto',
      'Analisar as métricas da semana 1 (cliques, pedidos, comissões) no Dashboard',
      'Identificar os 2 formatos com melhor performance e dobrar a aposta',
      'Aumentar o outreach para 30 ações por dia (grupos, DMs, comentários)',
      'Responder TODOS os comentários dos vídeos em até 1h (engajamento)',
      'Repostar os melhores momentos dos vídeos como stories',
      'Enviar follow-up para as marcas que não responderam ao seeding',
      'Configurar o calendário de postagens da próxima semana',
    ],
  },
  {
    id: 'otimizacao',
    title: 'Otimização',
    range: 'Dias 21-30',
    icon: Trophy,
    color: 'text-purple-500',
    goal: 'Escalar o que funciona: lives frequentes, foco nos vencedores e parcerias diretas.',
    tasks: [
      'Fazer 3 lives por semana (terça, quinta e sábado — horários de pico)',
      'Focar todo o conteúdo nos 3 produtos com melhor performance',
      'Pausar os produtos com baixa conversão (menos de 2 vendas no período)',
      'Fechar as primeiras parcerias diretas com marcas (product seeding)',
      'Receber e gravar conteúdo com as primeiras amostras grátis',
      'Configurar Spark Ads: autorizar suas marcas a usar seus vídeos como anúncio',
      'Duplicar o formato de vídeo com melhor retenção (criar variações)',
      'Analisar o ROAS (retorno sobre investimento de tempo) por produto',
      'Enviar a primeira edição da newsletter semanal para sua lista',
      'Fazer o balanço do mês: comissões totais, produtos campeões e plano do próximo mês',
    ],
  },
]

const STORAGE_KEY = 'plan30_progress_v1'

export default function Plan30Days() {
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

  const totalTasks = phases.reduce((s, p) => s + p.tasks.length, 0)
  const totalDone = phases.reduce(
    (s, p) => s + p.tasks.filter((_, i) => completed[`${p.id}-${i}`]).length,
    0,
  )
  const overallPct = Math.round((totalDone / totalTasks) * 100)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-primary" /> Plano de 30 Dias
        </h1>
        <p className="text-muted-foreground">
          Do zero às primeiras vendas consistentes em 30 dias. 3 fases com checklists interativos —
          seu progresso fica salvo no navegador.
        </p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Progresso Geral
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {totalDone}/{totalTasks} tarefas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallPct} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{overallPct}% concluído</p>
        </CardContent>
      </Card>

      {/* Phases */}
      {phases.map((phase) => {
        const done = phase.tasks.filter((_, i) => completed[`${phase.id}-${i}`]).length
        const pct = Math.round((done / phase.tasks.length) * 100)
        const Icon = phase.icon
        return (
          <div key={phase.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon className={`w-6 h-6 ${phase.color}`} />
              <div>
                <h2 className="text-lg font-semibold">
                  Fase: {phase.title}{' '}
                  <Badge variant="secondary" className="ml-1">
                    {phase.range}
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground">{phase.goal}</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progresso da fase</span>
                    <span className="font-medium">
                      {done}/{phase.tasks.length} · {pct}%
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
                <div className="space-y-2">
                  {phase.tasks.map((task, i) => {
                    const key = `${phase.id}-${i}`
                    const isChecked = !!completed[key]
                    return (
                      <div
                        key={key}
                        className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                          isChecked ? 'bg-muted/40' : 'hover:bg-muted/30'
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(key)}
                          className="mt-1"
                        />
                        <p
                          className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
