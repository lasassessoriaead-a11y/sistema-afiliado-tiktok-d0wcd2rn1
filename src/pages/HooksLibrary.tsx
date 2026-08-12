import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { getHooks, HOOK_CATEGORIES, type HookItem } from '@/services/hooks-library'
import { Copy, Lightbulb } from 'lucide-react'

const categoryColors: Record<string, string> = {
  Curiosidade: 'bg-purple-100 text-purple-700',
  'Choque/Surpresa': 'bg-red-100 text-red-700',
  'Problema/Solução': 'bg-blue-100 text-blue-700',
  'Antes/Depois': 'bg-green-100 text-green-700',
  'TikTok Made Me Buy It': 'bg-pink-100 text-pink-700',
  'POV/Storytelling': 'bg-indigo-100 text-indigo-700',
  'Urgência/Escassez': 'bg-orange-100 text-orange-700',
  Comparação: 'bg-teal-100 text-teal-700',
}

export default function HooksLibrary() {
  const [hooks, setHooks] = useState<HookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const { toast } = useToast()

  const load = async () => {
    try {
      setHooks(await getHooks())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])
  useRealtime('hooks_library', () => {
    load()
  })

  const filtered = useMemo(
    () => (activeCategory === 'all' ? hooks : hooks.filter((h) => h.category === activeCategory)),
    [hooks, activeCategory],
  )

  const copyHook = async (hook: HookItem) => {
    try {
      await navigator.clipboard.writeText(hook.hook_text)
      toast({ title: 'Hook copiado!', description: 'Cole direto no seu roteiro de vídeo.' })
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'destructive' })
    }
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" /> Biblioteca de Hooks
        </h1>
        <p className="text-muted-foreground">
          Swipe file com {hooks.length} ganchos testados para prender a audiência nos 3 primeiros
          segundos do seu vídeo. Copie e adapte para qualquer produto.
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="all">Todos ({hooks.length})</TabsTrigger>
          {HOOK_CATEGORIES.map((cat) => {
            const count = hooks.filter((h) => h.category === cat).length
            return (
              <TabsTrigger key={cat} value={cat}>
                {cat} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((hook) => (
          <Card key={hook.id} className="flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <Badge className={categoryColors[hook.category] || 'bg-gray-100 text-gray-700'}>
                  {hook.category}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => copyHook(hook)}>
                  <Copy className="w-4 h-4" /> Copiar
                </Button>
              </div>
              <p className="font-medium leading-snug text-base">"{hook.hook_text}"</p>
              <div className="mt-auto pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Exemplo de uso</p>
                <p className="text-sm text-muted-foreground">{hook.example}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Nenhum hook nesta categoria ainda.</p>
      )}
    </div>
  )
}
