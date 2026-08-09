import pb from '@/lib/pocketbase/client'

export const chatWithAgent = (message: string, conversationId: string | null) =>
  pb.send('/backend/v1/agent/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversation_id: conversationId }),
    headers: { 'Content-Type': 'application/json' },
  })
