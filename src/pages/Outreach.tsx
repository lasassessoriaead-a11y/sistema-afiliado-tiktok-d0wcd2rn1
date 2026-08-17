import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { getOutreachScripts, type OutreachScript } from '@/services/content-library'
import { Mail, Copy, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react'

const emailTemplate = `Assunto: Criador iniciante interessado em [PRODUTO] | Review honesto

Oi, equipe da [MARCA]!

Meu nome é [SEU NOME] e estou começando agora como afiliado(a) no TikTok Shop
(@[SEU PERFIL]), com conteúdo 100% focado em [SEU NICHO]. Ainda estou
construindo minha audiência, mas meu engajamento é muito alto e meu público é
super alinhado ao nicho de vocês.

O produto [NOME DO PRODUTO] me chamou muita atenção e eu adoraria testar para
fazer um review honesto no meu perfil. Por isso queria saber:

• Vocês teriam alguma amostra ou programa para criadores iniciantes?
• Em troca ofereço: 1 vídeo de review sincero no TikTok + 2 stories, seguindo
  todas as diretrizes da marca.

Sei que ainda sou um criador pequeno, mas garanto conteúdo caprichado e
verdadeiro. Caso não seja possível agora, entendo e agradeço mesmo assim! 🙏

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

  // Títulos amigáveis para os scripts de iniciante (o `tone` continua como badge)
  const scriptTitles: Record<string, string> = {
    Formal: 'Estou começando agora',
    Casual: 'Já testei produtos similares',
    'Baseado em dados': 'Conteúdo de nicho',
    'Curto e direto': 'Curto e direto (DM)',
    'Follow-up': 'Follow-up educado',
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
          Scripts prontos para pedir amostras grátis às marcas — escritos para quem está{' '}
          <strong>começando do zero</strong>, sem audiência. Tom humilde e realista: mostre
          disposição de testar e criar conteúdo honesto, sem fingir que já é conhecido. Copie,
          adapte com seus dados e envie via TikTok DM, Instagram DM ou email.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Dica de ouro para iniciantes</p>
            <p className="text-muted-foreground">
              Comece pelas marcas <strong>menores e regionais</strong> — elas têm menos concorrência
              e respondem muito mais criadores pequenos. Marcas grandes raramente respondem quem
              ainda não tem audiência. Priorize marcas brasileiras acessíveis e seja sempre honesto
              sobre o seu tamanho: transparência converte mais do que inflar números.
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
                  <CardTitle className="text-base">{scriptTitles[s.tone] || s.tone}</CardTitle>
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
          encontre o programa de creators e aplique como criador iniciante — sem medo de informar
          que está começando agora.
        </p>
        <Card className="border-amber-300 bg-amber-50 mb-3">
          <CardContent className="p-3 text-sm text-amber-900">
            ⚠️ <strong>Comece pelas marcas menores</strong> (menos concorrência). Marcas grandes
            raramente respondem criadores pequenos. Priorize marcas brasileiras/regionais, que são
            mais acessíveis e abertas a micro-criadores.
          </CardContent>
        </Card>
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
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge className="bg-blue-100 text-blue-700 shrink-0">Dia 1</Badge>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Primeiro contato.</strong> Use o script "Estou
                começando agora" ou "Conteúdo de nicho". Seja breve, honesto e mostre que já conhece
                o produto.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge className="bg-amber-100 text-amber-700 shrink-0">Dia 5</Badge>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Follow-up educado.</strong> Sem resposta? Use o
                script "Follow-up educado". Entenda a correria do dia a dia da marca e reafirme o
                interesse.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge className="bg-green-100 text-green-700 shrink-0">Dia 10</Badge>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Último follow-up.</strong> Se ainda sem
                resposta, mande um último toque e <strong>sigam em frente</strong>. Respeitar o
                "não" (ou o silêncio) mantém a porta aberta para o futuro — tente novamente em 30
                dias já com novos vídeos e métricas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
