migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'luka2510@hotmail.com')
    } catch (_) {
      const userRec = new Record(users)
      userRec.setEmail('luka2510@hotmail.com')
      userRec.setPassword('Skip@Pass')
      userRec.setVerified(true)
      userRec.set('name', 'Afiliado TikTok')
      app.save(userRec)
    }

    const productsCol = app.findCollectionByNameOrId('products')
    const prodData = [
      {
        name: 'Lixador de Unhas Elétrico Profissional',
        category: 'Beleza',
        average_price: 89.9,
        commission_margin: 18,
        why_sell:
          'Item de beleza viral com alto ticket médio e comissão generosa; resolve um problema comum (unhas mal feitas) e gera desejo imediato em vídeo de antes/depois.',
      },
      {
        name: 'Organizador de Gavetas Dobrável (Kit com 12)',
        category: 'Organização',
        average_price: 39.9,
        commission_margin: 15,
        why_sell:
          "Produto de organização com apelo visual forte para 'terapia de casa'; volume baixo de dúvidas e alta taxa de compra por impulso.",
      },
      {
        name: 'Brilho Labial Tinted Viral',
        category: 'Beleza',
        average_price: 29.9,
        commission_margin: 20,
        why_sell:
          'Efeito gloss em vídeo gera milhões de views; preço de entrada baixo e comissão alta, ideal para conversão de primeira compra.',
      },
      {
        name: 'Escorredor de Louça Dobrável de Silicone',
        category: 'Cozinha',
        average_price: 59.9,
        commission_margin: 15,
        why_sell:
          "Utilidade doméstica com demonstração clara em 15s; público de casas pequenas e 'conteúdo de cozinha' em alta.",
      },
      {
        name: 'Kit Organizador de Maquiagem Acrílico',
        category: 'Beleza',
        average_price: 49.9,
        commission_margin: 20,
        why_sell:
          "Estética de 'tela de TikTok' (tutorial de maquiagem) e alta margem; produto com forte apelo aspiracional para o público feminino.",
      },
    ]

    const pRecs = {}
    prodData.forEach((p) => {
      try {
        const existing = app.findFirstRecordByData('products', 'name', p.name)
        pRecs[p.name] = existing.id
      } catch (_) {
        const r = new Record(productsCol)
        r.set('name', p.name)
        r.set('category', p.category)
        r.set('average_price', p.average_price)
        r.set('commission_margin', p.commission_margin)
        r.set('why_sell', p.why_sell)
        app.save(r)
        pRecs[p.name] = r.id
      }
    })

    const scriptsCol = app.findCollectionByNameOrId('scripts')
    const scriptData = [
      {
        title: 'Antes e depois do lixador elétrico',
        prod: 'Lixador de Unhas Elétrico Profissional',
        hook: 'Se você faz a unha em casa, pare de cometer esse erro agora mesmo!',
        dev: 'Mostre a unha inacabada e em 5 segundos lixe suavemente com a broca. O acabamento fica profissional sem sair de casa.',
        cta: 'Clica no carrinho amarelo e garanta o seu com frete grátis!',
        cap: 'Fazer a unha em casa nunca foi tão fácil ✨ #TikTokMadeMeBuyIt #unhas #achadinhos',
        hash: '#tiktokshopbrasil #unhas #achadinhos #belezatiktok',
        time: '19:00',
      },
      {
        title: '3 truques de unha que você precisa',
        prod: 'Lixador de Unhas Elétrico Profissional',
        hook: '3 segredos de manicure que o seu salão não quer que você saiba!',
        dev: '1) Nivelar cutícula sem alicate. 2) Polimento rápido. 3) Formato perfeito em segundos com este aparelho.',
        cta: 'Link no carrinho aqui no vídeo com desconto de lançamento!',
        cap: 'Economize dezenas de reais no salão todo mês 💖',
        hash: '#dicasdebeleza #manicureemcasa #tiktokshop',
        time: '12:00',
      },
      {
        title: 'Sua gaveta é um caos? Veja isso',
        prod: 'Organizador de Gavetas Dobrável (Kit com 12)',
        hook: 'Minha gaveta era um pesadelo até eu testar essa transformação de R$ 39!',
        dev: 'Mostre a gaveta bagunçada, coloque as divisórias dobráveis e organize meias e roupas em tempo recorde.',
        cta: 'O kit vem com 12 peças, aproveite a promoção no carrinho!',
        cap: 'Terapia da organização que a sua casa precisa 📦✨',
        hash: '#organizacao #casaorganizada #achadinhos',
        time: '18:30',
      },
      {
        title: 'Organização que vende sozinha',
        prod: 'Organizador de Gavetas Dobrável (Kit com 12)',
        hook: 'Como dobrar suas roupas e dobrar seu espaço no guarda-roupa!',
        dev: 'Demonstre a dobradura e o encaixe perfeito nas colmeias. Visualmente satisfatório.',
        cta: 'Garanta o kit completo clicando no ícone do produto abaixo!',
        cap: 'Diga adeus à bagunça no closet 👗👚',
        hash: '#dicasdecasa #organizacaodegavetas #tiktokshopbrasil',
        time: '12:30',
      },
      {
        title: 'Testei o gloss mais falado do TikTok',
        prod: 'Brilho Labial Tinted Viral',
        hook: 'Procurava esse lip tint em todas as farmácias e finalmente achei no TikTok Shop!',
        dev: 'Aplicação nos lábios mostrando a transição de cor natural e o brilho espelhado sem ficar grudento.',
        cta: 'Toque no carrinho e garanta a sua cor favorita antes que esgote!',
        cap: 'Boca hidradada e com corzinha natural o dia todo 💄💋',
        hash: '#liptint #liptintviral #maquiagem #make',
        time: '20:00',
      },
      {
        title: 'O gloss que todo mundo procura',
        prod: 'Brilho Labial Tinted Viral',
        hook: 'O segredo para ter lábios volumosos por menos de 30 reais!',
        dev: 'Efeito bocão imediato, fórmula com ácido hialurônico que hidrata de verdade.',
        cta: 'Preço especial só hoje no carrinho do vídeo!',
        cap: 'Aquele toque final perfeito pra qualquer make ✨',
        hash: '#glossviral #bocao #achadinho #tiktokbeauty',
        time: '13:00',
      },
      {
        title: 'Cozinha pequena? Esse acessório resolve',
        prod: 'Escorredor de Louça Dobrável de Silicone',
        hook: 'Se a sua pia não tem espaço, você PRECISA ver esse achado!',
        dev: 'Abra o escorredor na pia, coloque pratos, depois dobre e guarde na gaveta em 3 segundos.',
        cta: 'Compre direto no TikTok Shop pelo link aqui no vídeo!',
        cap: 'Ganhe espaço na pia instantaneamente 🍽️ Silicone livre de BPA.',
        hash: '#cozinha #utilidadesdomesticas #pialimpa',
        time: '11:30',
      },
      {
        title: 'O escorredor que cabia em qualquer lugar',
        prod: 'Escorredor de Louça Dobrável de Silicone',
        hook: 'Pare de acumular louça na bancada! Essa é a solução mais inteligente.',
        dev: 'Mostre o produto em uso e como a água escorre diretamente na pia sem sujeira.',
        cta: 'Clique no carrinho amarelo para garantir o frete grátis!',
        cap: 'Sua cozinha limpa e organizada em minutos ✨',
        hash: '#cozinhaprática #achadinhoscozinha #home',
        time: '19:30',
      },
      {
        title: 'Kit de organização para sua penteadeira',
        prod: 'Kit Organizador de Maquiagem Acrílico',
        hook: 'Minha penteadeira parecia uma loja caótica antes deste organizador!',
        dev: 'Apresente cada compartimento acrílico transparente abrigando batons, pincéis e paletas de make.',
        cta: 'Aproveite o preço de atacado no carrinho abaixo!',
        cap: 'Tudo à vista e organizado na penteadeira 🌸💄',
        hash: '#penteadeira #organizadoracrilico #make',
        time: '21:00',
      },
      {
        title: 'Transforme sua rotina de make',
        prod: 'Kit Organizador de Maquiagem Acrílico',
        hook: 'Economize 10 minutos todas as manhãs ao se maquiar!',
        dev: 'Mostre como encontrar rapidamente o batom ou corretivo quando tudo está setorizado.',
        cta: 'Confira as avaliações 5 estrelas no carrinho e peça o seu!',
        cap: 'Incrível para presentear ou renovar seu cantinho 🎁',
        hash: '#cantinhodemake #penteadeiradeblogueira #tiktokshop',
        time: '17:00',
      },
    ]

    scriptData.forEach((s) => {
      try {
        app.findFirstRecordByData('scripts', 'title', s.title)
      } catch (_) {
        const pId = pRecs[s.prod]
        if (pId) {
          const r = new Record(scriptsCol)
          r.set('title', s.title)
          r.set('product', pId)
          r.set('hook', s.hook)
          r.set('development', s.dev)
          r.set('cta', s.cta)
          r.set('caption', s.cap)
          r.set('hashtags', s.hash)
          r.set('best_time', s.time)
          app.save(r)
        }
      }
    })

    const magnetsCol = app.findCollectionByNameOrId('lead_magnets')
    const magnets = [
      {
        type: 'Guia',
        title: 'Guia Rápido: Como Escolher Produtos que Vendem no TikTok Shop',
        full_text:
          '1. Busque produtos com apelo visual imediato (efeito antes/depois ou transformação em 3 segundos).\n2. Preço ideal entre R$ 29 e R$ 99 (compra por impulso fácil).\n3. Comissão acima de 15% para rentabilidade sustentável.\n4. Produtos de dor/solução (beleza, organização e cozinha dominam o algoritmo).',
      },
      {
        type: 'Checklist',
        title: 'Checklist do Vídeo Perfeito para Afiliados (15–30s)',
        full_text:
          '✅ Gancho nos primeiros 3 segundos (pergunta, polêmica ou resultado chocante).\n✅ Demonstração prática e sem enrolação (mostre o uso em movimento).\n✅ Legenda curta com palavras-chave do nicho.\n✅ Chamada para ação clara direcionando para o carrinho amarelo no vídeo.\n✅ Áudio em alta (use sons virais no fundo em volume baixo).',
      },
      {
        type: 'E-book',
        title: 'Do Zero ao Primeiro Real — Guia de 7 Dias para Afiliado Iniciante',
        full_text:
          'Dia 1: Configuração do perfil e bio com link do produto.\nDia 2: Escolha dos 5 produtos campeões.\nDia 3: Gravação dos 3 primeiros vídeos de teste.\nDia 4: Publicação no horário de pico com hashtags virais.\nDia 5: Resposta rápida a todos os comentários solicitando o link.\nDia 6: Envio de mensagem de follow-up para interessados.\nDia 7: Análise dos cliques na planilha e otimização dos melhores ganchos.',
      },
    ]
    magnets.forEach((m) => {
      try {
        app.findFirstRecordByData('lead_magnets', 'title', m.title)
      } catch (_) {
        const r = new Record(magnetsCol)
        r.set('type', m.type)
        r.set('title', m.title)
        r.set('full_text', m.full_text)
        app.save(r)
      }
    })

    const bioCol = app.findCollectionByNameOrId('profile_bio')
    try {
      app.findFirstRecordByData('profile_bio', 'profile_link', 'linktr.ee/seusite')
    } catch (_) {
      const r = new Record(bioCol)
      r.set(
        'bio_text',
        '🎯 Afiliado TikTok Shop • Trago os melhores achadinhos do dia ✨ Link com #TikTokMadeMeBuyIt 👇',
      )
      r.set('profile_link', 'linktr.ee/seusite')
      app.save(r)
    }

    const wCol = app.findCollectionByNameOrId('whatsapp_messages')
    const wMsgs = [
      'Olá! Vi que você se interessou pelos achadinhos do TikTok. Quer que eu te envie o cupom de desconto do produto que mostrei no vídeo?',
      'Oi! Passando só para avisar que aquele produto do TikTok Shop baixou de preço hoje e está com frete grátis. Quer o link direto?',
      'E aí! Tudo bem? Caso ainda esteja procurando o item de organização/beleza, separei o link oficial do TikTok Shop com garantia de entrega rápida.',
      'Oi! Se você tiver qualquer dúvida de como usar o produto ou finalizar a compra no TikTok Shop, estou à disposição aqui!',
      'Última chamada! O estoque do produto viral está nas últimas unidades com preço promocional. Segue o link direto para aproveitar: {LINK}',
    ]
    wMsgs.forEach((msg, idx) => {
      try {
        app.findFirstRecordByData('whatsapp_messages', 'message_text', msg)
      } catch (_) {
        const r = new Record(wCol)
        r.set('order', idx + 1)
        r.set('message_text', msg)
        app.save(r)
      }
    })

    const calCol = app.findCollectionByNameOrId('posting_calendar')
    const calDays = [
      {
        day: 'Segunda-feira',
        time: '19:00',
        content_type: 'Vídeo curto: Antes e depois do lixador elétrico',
        cta: 'Clica no carrinho amarelo no vídeo para pedir o seu!',
      },
      {
        day: 'Terça-feira',
        time: '12:00',
        content_type: 'Vídeo curto: Sua gaveta é um caos? Veja isso',
        cta: 'Garanta o kit no carrinho amarelo antes que acabe!',
      },
      {
        day: 'Quarta-feira',
        time: '19:00',
        content_type: 'Vídeo curto: Testei o gloss mais falado do TikTok',
        cta: 'Toque no carrinho e peça a sua cor!',
      },
      {
        day: 'Quinta-feira',
        time: '12:00',
        content_type: 'Vídeo curto: Cozinha pequena? Esse acessório resolve',
        cta: 'Compre com frete grátis no carrinho aqui do vídeo!',
      },
      {
        day: 'Sexta-feira',
        time: '19:00',
        content_type: 'Vídeo curto: Kit de organização para sua penteadeira',
        cta: 'Aproveite a promoção de sexta no carrinho abaixo!',
      },
      {
        day: 'Sábado',
        time: '11:00',
        content_type: 'Vídeo curto: 3 truques de unha que você precisa saber',
        cta: 'Link com desconto especial disponível no carrinho!',
      },
      {
        day: 'Domingo',
        time: '18:00',
        content_type: 'Vídeo curto: O gloss que todo mundo procura em estoque',
        cta: 'Garantia TikTok Shop no carrinho amarelo!',
      },
    ]
    calDays.forEach((c) => {
      try {
        app.findFirstRecordByData('posting_calendar', 'day', c.day)
      } catch (_) {
        const r = new Record(calCol)
        r.set('day', c.day)
        r.set('time', c.time)
        r.set('content_type', c.content_type)
        r.set('cta', c.cta)
        app.save(r)
      }
    })

    const actCol = app.findCollectionByNameOrId('action_plan')
    const actSteps = [
      {
        order: 1,
        step: 'Criar conta de afiliado no TikTok Shop',
        detail:
          'Acesse a aba TikTok Shop Creator no seu app e complete o cadastro básico de afiliado.',
      },
      {
        order: 2,
        step: 'Ativar sua loja e showcase de produtos',
        detail: 'Vincule sua conta e habilite a exibição da sacola de produtos no seu perfil.',
      },
      {
        order: 3,
        step: 'Escolher os 5 produtos do sistema',
        detail:
          "Acesse a aba 'Produtos' no app e selecione os 5 itens já pesquisados para divulgar.",
      },
      {
        order: 4,
        step: 'Salvar as 3 iscas digitais e configurar a Bio',
        detail: "Copie o texto da Bio pronta em 'Funil' e configure seu link de direcionamento.",
      },
      {
        order: 5,
        step: 'Gravar o primeiro vídeo (Roteiro 1)',
        detail: "Use a estrutura de Hook + Desenvolvimento + CTA fornecida na aba 'Conteúdo'.",
      },
      {
        order: 6,
        step: 'Preparar legenda, hashtags e horário',
        detail: 'Agende a postagem para as 19:00 com a legenda e hashtags copiadas do sistema.',
      },
      {
        order: 7,
        step: 'Postar o vídeo e vincular o produto no carrinho',
        detail:
          "Ao publicar no TikTok, clique em 'Adicionar Link' > 'Produto' e escolha o produto.",
      },
      {
        order: 8,
        step: 'Acompanhar cliques e registrar na Planilha de Comissões',
        detail:
          'Ao final do dia, verifique seus cliques no painel do TikTok Shop e registre no app.',
      },
    ]
    actSteps.forEach((a) => {
      try {
        app.findFirstRecordByData('action_plan', 'step', a.step)
      } catch (_) {
        const r = new Record(actCol)
        r.set('order', a.order)
        r.set('step', a.step)
        r.set('detail', a.detail)
        app.save(r)
      }
    })
  },
  (app) => {},
)
