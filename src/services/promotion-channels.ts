import pb from '@/lib/pocketbase/client'

export interface PromotionChannel {
  id: string
  type: 'Facebook' | 'Telegram' | 'WhatsApp'
  name: string
  link: string
  members: string
  ready_message: string
  how_to_join: string
  created: string
  updated: string
}

export const getPromotionChannels = () =>
  pb.collection('promotion_channels').getFullList<PromotionChannel>({ sort: 'type,created' })
