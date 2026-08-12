import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User } from 'lucide-react'
import { chatWithAgent } from '@/services/agent'
import { cn } from '@/lib/utils'

const suggestions = [
  'Como aumentar minha taxa de conversão?',
  'Qual o melhor horário para postar?',
  'Como criar um gancho que prende a atenção?',
  'Quais hashtags usar hoje?',
  'Como divulgar sem ter seguidores?',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Consultant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await chatWithAgent(userMsg, conversationId)
      setConversationId(res.conversation_id)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.content }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro. Tente novamente.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold">Consultor IA</h1>
        <p className="text-muted-foreground">Converse com o Especialista em Afiliados TikTok</p>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <Bot className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p>Olá! Sou seu consultor de afiliados. Como posso ajudar?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-3 max-w-[80%]',
                  msg.role === 'user' && 'ml-auto flex-row-reverse',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-slate-200',
                  )}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={cn(
                    'rounded-lg p-3',
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Digitando...</p>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
          <form onSubmit={send} className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-2">Sugestões de perguntas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    setInput(s)
                    inputRef.current?.focus()
                  }}
                  disabled={loading}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
