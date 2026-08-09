import pb from '@/lib/pocketbase/client'

export const getProducts = () => pb.collection('products').getFullList({ sort: 'created' })

export const getProduct = (id: string) => pb.collection('products').getOne(id)
