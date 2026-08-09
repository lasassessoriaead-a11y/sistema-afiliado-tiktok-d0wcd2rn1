import pb from '@/lib/pocketbase/client'

export const getPostingCalendar = () =>
  pb.collection('posting_calendar').getFullList({ sort: 'created' })
