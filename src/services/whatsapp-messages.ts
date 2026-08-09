import pb from '@/lib/pocketbase/client'

export const getWhatsappMessages = () =>
  pb.collection('whatsapp_messages').getFullList({ sort: 'order' })
