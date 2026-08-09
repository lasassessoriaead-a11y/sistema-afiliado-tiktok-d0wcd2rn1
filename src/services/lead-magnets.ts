import pb from '@/lib/pocketbase/client'

export const getLeadMagnets = () => pb.collection('lead_magnets').getFullList({ sort: 'created' })
