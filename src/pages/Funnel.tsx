import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Link as LinkIcon, MessageCircle, Copy, ExternalLink } from 'lucide-react'
import { getLeadMagnets } from '@/services/lead-magnets'
import { getProfileBio } from '@/services/profile-bio'
import { getWhatsappMessages } from '@/services/whatsapp-messages'
import { useToast } from '@/hooks/use-toast'

export default function Funnel() {
  const [magnets, setMagnets] = useState<any[]>([])
  const [bio, setBio] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const [m, b, w] = await Promise.all([
          getLeadMagnets(),
          getProfileBio(),
          getWhatsappMessages(),
        ])
        setMagnets(m)
        setBio(b[0] || null)
        setMessages(w)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: 'Copiado!', description: 'Texto copiado para a área de transferência.' })
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Funil de Captura</h1>
        <p className="text-muted-foreground">Materiais prontos para conversão</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" /> Iscas Digitais
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {magnets.map((m) => (
            <div key={m.id} className="border rounded-lg p-4 space-y-2">
              <Badge variant="secondary">{m.type}</Badge>
              <p className="font-medium text-sm">{m.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-line">
                {m.full_text}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => copyText(m.full_text)}
              >
                <Copy className="w-3 h-3 mr-1" /> Copiar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      {bio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" /> Bio do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm flex-1">{bio.bio_text}</p>
              <Button size="sm" variant="outline" onClick={() => copyText(bio.bio_text)}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <a
              href={bio.profile_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> {bio.profile_link}
            </a>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Mensagens de WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start justify-between gap-4 border rounded-lg p-3"
            >
              <div className="flex gap-3">
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                  {msg.order}
                </span>
                <p className="text-sm">{msg.message_text}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => copyText(msg.message_text)}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
