import pb from '@/lib/pocketbase/client'

export const getProfileBio = () => pb.collection('profile_bio').getFullList()
