import pb from '@/lib/pocketbase/client'

export const getPlanProgress = async (userId: string) => {
  try {
    return await pb.collection('plan_progress').getFirstListItem(`owner = "${userId}"`)
  } catch {
    return null
  }
}

export const createPlanProgress = (data: { owner: string; completed_steps: number[] }) =>
  pb.collection('plan_progress').create(data)

export const updatePlanProgress = (id: string, data: { completed_steps: number[] }) =>
  pb.collection('plan_progress').update(id, data)
