import pb from '@/lib/pocketbase/client'

export const getTrackingRecords = () =>
  pb.collection('tracking').getFullList({ sort: '-date', expand: 'product' })

export const createTrackingRecord = (data: {
  owner: string
  date: string
  product: string
  source: string
  clicks: number
  orders: number
  commission: number
}) => pb.collection('tracking').create(data)

export const deleteTrackingRecord = (id: string) => pb.collection('tracking').delete(id)

export const updateTrackingRecord = (
  id: string,
  data: {
    date: string
    product: string
    source: string
    clicks: number
    orders: number
    commission: number
  },
) =>
  pb.collection('tracking').update(id, {
    date: data.date,
    product: data.product,
    source: data.source,
    clicks: data.clicks,
    orders: data.orders,
    commission: data.commission,
  })
