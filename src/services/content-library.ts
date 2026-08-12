import pb from '@/lib/pocketbase/client'

export interface OutreachScript {
  id: string
  tone: string
  channel: string
  message: string
}

export const getOutreachScripts = () =>
  pb.collection('outreach_scripts').getFullList<OutreachScript>({ sort: 'created' })

export interface NewsletterEdition {
  id: string
  edition_number: number
  subject: string
  product_of_week: string
  hook_trending: string
  quick_tip: string
  behind_scenes: string
  cta_text: string
}

export const getNewsletterEditions = () =>
  pb.collection('newsletter_editions').getFullList<NewsletterEdition>({ sort: 'edition_number' })
