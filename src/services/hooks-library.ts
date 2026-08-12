import pb from '@/lib/pocketbase/client'

export interface HookItem {
  id: string
  category: string
  hook_text: string
  example: string
}

export const HOOK_CATEGORIES = [
  'Curiosidade',
  'Choque/Surpresa',
  'Problema/Solução',
  'Antes/Depois',
  'TikTok Made Me Buy It',
  'POV/Storytelling',
  'Urgência/Escassez',
  'Comparação',
] as const

export const getHooks = () =>
  pb.collection('hooks_library').getFullList<HookItem>({ sort: 'category,-created' })
