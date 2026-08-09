import pb from '@/lib/pocketbase/client'

export const getActionPlan = () => pb.collection('action_plan').getFullList({ sort: 'order' })
