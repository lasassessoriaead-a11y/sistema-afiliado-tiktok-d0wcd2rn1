import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2 } from 'lucide-react'
import { getActionPlan } from '@/services/action-plan'
import { getPlanProgress, createPlanProgress, updatePlanProgress } from '@/services/plan-progress'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'

export default function PlanDay1() {
  const { user } = useAuth()
  const [steps, setSteps] = useState<any[]>([])
  const [completed, setCompleted] = useState<number[]>([])
  const [progressId, setProgressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    try {
      const [planSteps, progress] = await Promise.all([getActionPlan(), getPlanProgress(user.id)])
      setSteps(planSteps)
      if (progress) {
        setProgressId(progress.id)
        setCompleted(progress.completed_steps || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('plan_progress', () => {
    load()
  })

  const toggleStep = async (order: number) => {
    const newCompleted = completed.includes(order)
      ? completed.filter((s) => s !== order)
      : [...completed, order]
    setCompleted(newCompleted)
    try {
      if (progressId) {
        await updatePlanProgress(progressId, { completed_steps: newCompleted })
      } else {
        const created = await createPlanProgress({ owner: user!.id, completed_steps: newCompleted })
        setProgressId(created.id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const progressPct = steps.length > 0 ? Math.round((completed.length / steps.length) * 100) : 0

  if (loading) return <Skeleton className="h-64" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Plano Dia 1</h1>
        <p className="text-muted-foreground">Seu plano de ação para começar hoje</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Progresso
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {completed.length}/{steps.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPct} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{progressPct}% concluído</p>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {steps.map((step) => (
          <Card key={step.id} className={completed.includes(step.order) ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={completed.includes(step.order)}
                  onCheckedChange={() => toggleStep(step.order)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {step.order}
                    </span>
                    <p
                      className={`font-medium ${completed.includes(step.order) ? 'line-through' : ''}`}
                    >
                      {step.step}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{step.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
