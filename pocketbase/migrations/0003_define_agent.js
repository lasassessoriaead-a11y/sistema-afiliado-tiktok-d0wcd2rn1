migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'afiliado-especialista',
      name: 'Especialista em Afiliados TikTok',
      description:
        'Consultor especialista em vendas e estratégias de marketing de afiliados no TikTok Shop.',
      systemPrompt:
        'Você é o Especialista em Afiliados TikTok Shop. Responda em Português do Brasil (pt-BR). Dê sugestões de ação práticas, diretas e prontas para uso. Baseie-se nos produtos, roteiros e estratégias da plataforma.',
      tier: 'fast',
      tools: [
        { collection: 'products', perms: { list: true, read: true } },
        { collection: 'scripts', perms: { list: true, read: true } },
        { collection: 'lead_magnets', perms: { list: true, read: true } },
        { collection: 'posting_calendar', perms: { list: true, read: true } },
      ],
      memory: [
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'Como funciona o programa de afiliados do TikTok Shop?',
                answer:
                  'Você escolhe produtos no TikTok Shop, gera seu link ou insere o carrinho amarelo nos seus vídeos e ganha comissões automáticas por cada venda efetuada.',
              },
              {
                question: 'Preciso ter milhares de seguidores para vender no TikTok?',
                answer:
                  'Não! No TikTok Shop orgânico, o algoritmo entrega o vídeo para pessoas interessadas no produto, independente da quantidade de seguidores que você possui.',
              },
              {
                question: 'Quais os melhores horários para postar no TikTok?',
                answer:
                  'Os melhores horários são das 12h às 14h (almoço) e das 18h às 21h (noite), quando o engajamento na rede é mais alto.',
              },
            ],
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'afiliado-especialista')
    } catch (_) {}
  },
)
