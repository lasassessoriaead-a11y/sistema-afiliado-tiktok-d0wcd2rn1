// Reescreve os scripts de outreach com tom de INICIANTE (humilde, sem audiência),
// substituindo os scripts antigos que pareciam escritos para criadores já conhecidos.
// A collection `outreach_scripts` (criada em 0007) é apenas truncada e re-semeada.
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('outreach_scripts')

    // limpa os scripts antigos
    try {
      app.truncateCollection(col)
    } catch (_) {}

    const data = [
      {
        tone: 'Formal',
        channel: 'Email',
        message:
          'Oi, equipe da [MARCA]!\n\nEstou começando agora como afiliado(a) no TikTok Shop e sou apaixonado(a) por [CATEGORIA]. O produto [NOME DO PRODUTO] me chamou muita atenção.\n\nSei que ainda estou construindo minha audiência, mas adoraria testar [PRODUTO] e fazer um review honesto no meu perfil. Vocês teriam alguma amostra ou programa para criadores iniciantes?\n\nGaranto conteúdo caprichado, verdadeiro e que respeita a marca — mesmo com audiência pequena, meu engajamento é muito alto.\n\nAgradeço desde já pela atenção e fico à disposição.\n\nAtenciosamente,\n[SEU NOME]\n@[SEU PERFIL] | [SEU EMAIL]',
      },
      {
        tone: 'Casual',
        channel: 'Instagram DM',
        message:
          'Olá! Recentemente testei [PRODUTO CONCORRENTE/SIMILAR] e meu vídeo teve [X] visualizações. Adorei a qualidade da [MARCA] e gostaria de criar conteúdo com o [PRODUTO ESPECÍFICO]. Ainda sou um criador pequeno, mas meu engajamento é muito alto. Posso testar uma unidade? 🙌 Meu @ é @[PERFIL].',
      },
      {
        tone: 'Baseado em dados',
        channel: 'TikTok DM',
        message:
          'Oi, equipe da [MARCA]! Meu conteúdo é 100% focado em [BELEZA/CASA/TECH] e meu público (mesmo pequeno) é muito engajado nesse nicho.\n\nNos últimos vídeos tive:\n• [X] mil visualizações\n• [Y]% de retenção média\n• [Z] compartilhamentos\n\nSeu [PRODUTO] seria perfeito para um review detalhado que estou planejando. Vocês trabalham com amostras para micro-criadores? Posso comprometer 1 vídeo sincero em 30 dias.',
      },
      {
        tone: 'Curto e direto',
        channel: 'Instagram DM',
        message:
          'Oi! Sou criador(a) de conteúdo iniciante focado(a) em [NICHO]. Seu [PRODUTO] está na minha lista de desejos! 🫶 Fazem envio de amostra pra review? Mesmo com audiência pequena, garanto conteúdo de qualidade! Meu @ é @[PERFIL].',
      },
      {
        tone: 'Follow-up',
        channel: 'Email',
        message:
          'Oi, equipe da [MARCA]!\n\nMandei uma mensagem na semana passada sobre o [PRODUTO]. Entendo a correria do dia a dia! Sigo muito interessado(a) em testar e criar conteúdo honesto com o produto.\n\nSe não for possível agora, agradeço mesmo assim e seguimos em frente. 🙏 Qualquer coisa, meu @ é @[PERFIL].\n\nAbraço,\n[SEU NOME]',
      },
    ]

    data.forEach((o) => {
      let exists = false
      try {
        app.findFirstRecordByData('outreach_scripts', 'message', o.message)
        exists = true
      } catch (_) {}
      if (exists) return
      const r = new Record(col)
      r.set('tone', o.tone)
      r.set('channel', o.channel)
      r.set('message', o.message)
      app.save(r)
    })
  },
  (app) => {
    // down: não há como restaurar os textos antigos de forma confiável;
    // apenas limpa os novos para a collection não voltar com dados duplicados.
    try {
      const col = app.findCollectionByNameOrId('outreach_scripts')
      app.truncateCollection(col)
    } catch (_) {}
  },
)
