import pb from '@/lib/pocketbase/client'

export const getProducts = () => pb.collection('products').getFullList({ sort: 'created' })

export const getProduct = (id: string) => pb.collection('products').getOne(id)

export const searchTrendingProducts = async () => {
  const res = await pb.send('/api/refresh-trending', { method: 'GET' })
  return res
}

export const getTrendingProducts = () =>
  pb.collection('products').getFullList({
    sort: 'trending_position',
    filter: 'trending_position > 0',
  })
