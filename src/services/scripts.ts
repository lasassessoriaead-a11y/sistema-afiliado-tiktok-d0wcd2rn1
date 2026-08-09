import pb from '@/lib/pocketbase/client'

export const getScripts = () =>
  pb.collection('scripts').getFullList({ sort: 'created', expand: 'product' })

export const getScript = (id: string) => pb.collection('scripts').getOne(id, { expand: 'product' })
