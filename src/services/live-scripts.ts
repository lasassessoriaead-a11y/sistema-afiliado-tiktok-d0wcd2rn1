import pb from '@/lib/pocketbase/client'

export interface LiveScript {
  id: string
  title: string
  duration_min: number
  opening: string
  presentation: string
  demonstration: string
  objections: string
  offers: string
  cta: string
}

export const getLiveScripts = () =>
  pb.collection('live_scripts').getFullList<LiveScript>({ sort: 'created' })
