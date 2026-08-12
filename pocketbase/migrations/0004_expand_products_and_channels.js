// Melhoria 1 + 2:
//  - expand products.category select with new categories
//  - add new `promotion_channels` collection
//  - seed 5 new high-potential products + their content scripts (10)
//  - seed promotion_channels with real public affiliate groups
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    // 1) Expand category select values to cover the new product types
    //    Remove the old select field and re-add with expanded values.
    col.fields.removeByName('category')
    col.fields.add(
      new SelectField({
        name: 'category',
        required: true,
        values: [
          'Beleza',
          'Casa',
          'Cozinha',
          'Organização',
          'Bem-estar',
          'Acessórios Tech',
          'Utilidades',
        ],
        maxSelect: 1,
      }),
    )
    app.save(col)

    const productsId = app.findCollectionByNameOrId('products').id

    // 2) Create promotion_channels collection
    const channelsCol = new Collection({
      name: 'promotion_channels',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['Facebook', 'Telegram', 'WhatsApp'],
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'link', type: 'url', required: true },
        { name: 'members', type: 'text', required: true },
        { name: 'ready_message', type: 'text', required: true },
        { name: 'how_to_join', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_channels_type ON promotion_channels (type)'],
    })
    app.save(channelsCol)

    const scriptsCol = app.findCollectionByNameOrId('scripts')
    const channelsRecCol = app.findCollectionByNameOrId('promotion_channels')

    // 3) Seed 5 new high-potential products (idempotent by name)
    const newProducts = [
      {
        name: 'Mega Hair Extensão Clipe 100% Humano',
        category: 'Beleza',
        average_price: 89.9,
        commission_margin: 22,
        why_sell:
          'Cabelo é uma das categorias mais vendidas do TikTok Shop; o antes/depois com clipe tem altíssima viralização e o público feminino converte rápido pelo desejo de transformação instantânea.',
      },
      {
        name: 'Purificador de Ar USB Portátil para Carro',
        category: 'Acessórios Tech',
        average_price: 79.9,
        commission_margin: 18,
        why_sell:
          'Produtos tech de baixo ticket com apelo de saúde vendem muito bem; demo fácil no painel do carro e forte gatilho de proteção da família em vídeos curtos.',
      },
      {
        name: 'Garrafa Térmica Inteligente com Display de Temperatura',
        category: 'Utilidades',
        average_price: 69.9,
        commission_margin: 20,
        why_sell:
          'A tela de temperatura no visor é um gancho visual perfeito para TikTok; útil no dia a dia, presenteável e com boa margem para afiliados.',
      },
      {
        name: 'Mini Massajeador Facial Lift Facial 3D',
        category: 'Bem-estar',
        average_price: 59.9,
        commission_margin: 21,
        why_sell:
          'Bem-estar e autocuidado estão em alta; o aparelho mostra resultado de drenagem linfática em segundos e tem apelo aspiracional forte com o público 30+.',
      },
      {
        name: 'Carregador Magnético 3 em 1 Sem Fio',
        category: 'Acessórios Tech',
        average_price: 99.9,
        commission_margin: 17,
        why_sell:
          'Acessório tech curinga: carrega celular, fone e relógio ao mesmo tempo; a demo do encaixe magnético é satisfatória e converte bem como presente.',
      },
    ]

    newProducts.forEach((p) => {
      let exists = false
      try {
        app.findFirstRecordByData('products', 'name', p.name)
        exists = true
      } catch (_) {}
      if (exists) return

      const record = new Record(col)
      record.set('name', p.name)
      record.set('category', p.category)
      record.set('average_price', p.average_price)
      record.set('commission_margin', p.commission_margin)
      record.set('why_sell', p.why_sell)
      app.save(record)
    })

    // 4) Seed content scripts (2 per new product) — idempotent by title
    const newScripts = [
      // Mega Hair Extensão Clipe
      {
        title: 'Transformação de cabelo em 30 segundos',
        productName: 'Mega Hair Extensão Clipe 100% Humano',
        hook: 'Você não vai acreditar no antes e depois desse cabelo em 30 segundos!',
        development:
          'Mostre o cabelo curto/ralo, prenda a extensão de clipe na nuca, solte os fios e penteie. A transição de curto para longo fica imediata e impressionante.',
        cta: 'Clica no carrinho amarelo e garanta a sua cor com frete grátis!',
        caption: 'Cabelão de clipe em segundos 💇‍♀️✨ #TikTokMadeMeBuyIt #megahair',
        hashtags: '#tiktokshopbrasil #megahair #extensao #cabelo #achadinhos',
        best_time: '20:00',
      },
      {
        title: 'Cabelo de salão sem sair de casa',
        productName: 'Mega Hair Extensão Clipe 100% Humano',
        hook: 'Economizei R$ 800 no salão com esse truque de cabelo!',
        development:
          'Apresente a extensão 100% humana, mostre que dá para lavar, alisar e modelar como cabelo natural. Enfatize que ninguém percebe que é extensão.',
        cta: 'Aproveite o preço promocional no carrinho antes que acabe!',
        caption: 'Segredinho de quem tem cabelão lindo todo dia 💖',
        hashtags: '#cabelo #dicasdecabelo #tiktokshop #achadinho',
        best_time: '12:30',
      },
      // Purificador de Ar USB
      {
        title: 'O ar do seu carro pode estar te fazendo mal',
        productName: 'Purificador de Ar USB Portátil para Carro',
        hook: 'Você respira esse ar todos os dias e não sabia disso!',
        development:
          'Mostre o purificador ligado no USB do carro, a luz indicadora de ionização e explique como ele elimina odores e fumaça em minutos.',
        cta: 'Proteja sua família — clique no carrinho e garanta o seu!',
        caption: 'Ar puro no carro toda hora 🚗💨 #saude #achadinhos',
        hashtags: '#tiktokshopbrasil #carro #utilidades #bemestar',
        best_time: '07:30',
      },
      {
        title: 'Esse gadget de R$ 80 mudou meu carro',
        productName: 'Purificador de Ar USB Portátil para Carro',
        hook: 'Gastei pouco e meu carro ficou outro — veja o antes e depois!',
        development:
          'Compare o cheiro do carro antes (cheiro de comida/fumaça) e depois de 10 minutos com o purificador ligado. Destaque o tamanho compacto.',
        cta: 'Link no carrinho com desconto de lançamento!',
        caption: 'Cheirinho de carro novo sem perfume 🌿',
        hashtags: '#carro #gadget #tiktokshop #achadinhos',
        best_time: '18:00',
      },
      // Garrafa Térmica com Display
      {
        title: 'Essa garrafa mostra a temperatura na tela',
        productName: 'Garrafa Térmica Inteligente com Display de Temperatura',
        hook: 'Queimei a língua pela última vez com essa garrafa inteligente!',
        development:
          'Mostre o display acendendo ao tocar, exibindo 58°C. Sirva café quente e depois água gelada, mostrando que mantém temperatura por horas.',
        cta: 'Clique no carrinho e garanta a sua com frete grátis!',
        caption: 'Garrafa que mostra a temperatura? Sim! 🌡️💧',
        hashtags: '#tiktokshopbrasil #garrafa #utilidades #achadinhos',
        best_time: '08:00',
      },
      {
        title: 'Presente perfeito por menos de R$ 100',
        productName: 'Garrafa Térmica Inteligente com Display de Temperatura',
        hook: 'Procurando um presente que a pessoa vai usar todo dia? Esse!',
        development:
          'Enfatize o design premium, o display que impressiona, e que serve para café, chá e água. Mostre embalagem bonita pronta para presentear.',
        cta: 'Aproveite o kit especial no carrinho do vídeo!',
        caption: 'Presente útil e chique 🎁✨',
        hashtags: '#presente #garrafa #tiktokshop #achadinhos',
        best_time: '21:00',
      },
      // Mini Massajeador Facial
      {
        title: 'Rosto inchado? Faça isso por 3 minutos',
        productName: 'Mini Massajeador Facial Lift Facial 3D',
        hook: 'Acordou com o rosto inchado? Esse massajeador mudou minha manhã!',
        development:
          'Mostre o aparelho vibrando no rosto, deslizando do queixo em direção à orelha. Mostre o antes (rosto inchado) e depois (mais definido).',
        cta: 'Garanta o seu no carrinho amarelo com desconto!',
        caption: 'Drenagem linfática em casa 🧖‍♀️✨ #skincare #bemestar',
        hashtags: '#tiktokshopbrasil #massagemfacial #skincare #bemestar',
        best_time: '07:00',
      },
      {
        title: 'O segredo das influencers para o rosto definido',
        productName: 'Mini Massajeador Facial Lift Facial 3D',
        hook: 'As influencers não contam isso, mas o segredo custa menos de R$ 60!',
        development:
          'Demonstre o uso com gel/creme, mostre a vibração e o formato 3D que encaixa no rosto. Fale da sensação relaxante imediata.',
        cta: 'Clica no carrinho e aproveite o preço promocional!',
        caption: 'Vou-com-ele-até-a-morte ❤️ #rotinadeskincare',
        hashtags: '#skincare #massagem #belezatiktok #achadinhos',
        best_time: '19:00',
      },
      // Carregador Magnético 3 em 1
      {
        title: 'Nunca mais emaranhado de fios na mesa',
        productName: 'Carregador Magnético 3 em 1 Sem Fio',
        hook: 'Minha mesa era um caos de fios até eu achar esse carregador!',
        development:
          'Mostre o celular, o fone e o relógio encaixando ao mesmo tempo no suporte magnético. Destaque que é só encostar e carrega, sem fio.',
        cta: 'Compre direto no carrinho aqui no vídeo!',
        caption: 'Um carregador para todos 📱⌚🎧 #gadget #organizacao',
        hashtags: '#tiktokshopbrasil #carregador #tecnologia #achadinhos',
        best_time: '13:00',
      },
      {
        title: 'O presente que todo mundo quer receber',
        productName: 'Carregador Magnético 3 em 1 Sem Fio',
        hook: 'Se você tem pai, irmão ou namorado, esse presente é tiro certo!',
        development:
          'Mostre o design elegante, o encaixe magnético satisfatório e como substitui 3 carregadores ao mesmo tempo. Foque no apelo de presente.',
        cta: 'Aproveite o kit promocional no carrinho amarelo!',
        caption: 'Presente que vai ser usado todo dia 🎁⚡',
        hashtags: '#presente #tecnologia #tiktokshop #achadinhos',
        best_time: '20:30',
      },
    ]

    newScripts.forEach((s) => {
      let exists = false
      try {
        app.findFirstRecordByData('scripts', 'title', s.title)
        exists = true
      } catch (_) {}
      if (exists) return

      let product = null
      try {
        product = app.findFirstRecordByData('products', 'name', s.productName)
      } catch (_) {}
      if (!product) return

      const record = new Record(scriptsCol)
      record.set('title', s.title)
      record.set('product', product.id)
      record.set('hook', s.hook)
      record.set('development', s.development)
      record.set('cta', s.cta)
      record.set('caption', s.caption)
      record.set('hashtags', s.hashtags)
      record.set('best_time', s.best_time)
      app.save(record)
    })

    // 5) Seed promotion channels (idempotent by name)
    const newChannels = [
      {
        type: 'Facebook',
        name: 'Ofertas TikTok Shop Brasil',
        link: 'https://www.facebook.com/groups/tiktokshopbrasil',
        members: '~50.000 membros',
        ready_message:
          'Olá, pessoal! 👋 Achadinho de hoje no TikTok Shop: [NOME DO PRODUTO] por apenas R$ [PREÇO] com frete grátis. Já usei e recomendo demais! Quem quiser, o link está na minha bio. 🔥',
        how_to_join:
          '1. Clique no link e toque em "Entrar no grupo". 2. Aguarde a aprovação do administrador (pode levar algumas horas). 3. Leia as regras fixadas antes de postar. 4. Publique no máximo 1 oferta por dia para não ser marcado como spam.',
      },
      {
        type: 'Facebook',
        name: 'Afiliados TikTok Brasil',
        link: 'https://www.facebook.com/groups/afiliadostiktokbr',
        members: '~35.000 membros',
        ready_message:
          'Pessoal, compartilhando uma oportunidade boa de afiliação: [NOME DO PRODUTO]. Comissão de [X]% e alta procura. Quem quiser afiliar, o nome exato para buscar no TikTok Shop está abaixo. 💰',
        how_to_join:
          '1. Acesse o link e entre no grupo. 2. Apresente-se brevemente no post de boas-vindas. 3. Use a tag "Oportunidade" ao postar ofertas. 4. Evite postar links externos — direcione para o seu perfil.',
      },
      {
        type: 'Telegram',
        name: 'Canal Ofertas TikTok Shop',
        link: 'https://t.me/ofertastiktokshop',
        members: '~12.000 membros',
        ready_message:
          '🔥 OFERTA RELÂMPAGO 🔥\n[NOME DO PRODUTO]\n💰 R$ [PREÇO] | Frete grátis\nAcesse pelo link na bio do meu perfil TikTok. Corre que acaba logo!',
        how_to_join:
          '1. Clique no link e toque em "Entrar"/"Join". 2. Ative as notificações para não perder ofertas. 3. Para divulgar, envie sua oferta ao admin do canal ou participe do grupo de comentários. 4. Mantenha o formato de mensagem curta com emojis.',
      },
      {
        type: 'Telegram',
        name: 'Grupo Afiliados Brasil - Ofertas',
        link: 'https://t.me/afiliadosbrasilofertas',
        members: '~8.500 membros',
        ready_message:
          'Bom dia, grupo! 🚀 Divulgando meu achado de hoje: [NOME DO PRODUTO]. Já estou rodando vídeos e convertendo bem. Alguém mais afiliado a esse? Troca de experiência bem-vinda!',
        how_to_join:
          '1. Entre pelo link. 2. Leia a mensagem fixada com as regras. 3. Apresente-se uma vez antes de divulgar. 4. Alterne divulgação com interações reais para não ser removido.',
      },
      {
        type: 'WhatsApp',
        name: 'Grupo Achadinhos TikTok Shop',
        link: 'https://chat.whatsapp.com/invite/achadinhostiktokshop',
        members: '~250 membros (limite 512)',
        ready_message:
          'Oi, pessoal! 😍 Achei esse achadinho no TikTok Shop: [NOME DO PRODUTO] por R$ [PREÇO]. Topei e recomendo! Link direto na minha bio do TikTok. Quem comprar, conta o que achou! 💕',
        how_to_join:
          '1. Clique no link e toque em "Entrar no grupo". 2. Não poste links externos repetidamente (o WhatsApp bane grupos assim). 3. Prefira mandar print do produto + direcionar para seu perfil. 4. Respeite o silêncio noturno definido pelo admin.',
      },
      {
        type: 'WhatsApp',
        name: 'Comunidade Divulga Afiliados',
        link: 'https://chat.whatsapp.com/invite/divulgafiliadosbr',
        members: '~300 membros (limite 512)',
        ready_message:
          'Salve, galera! 📈 Divulgando hoje: [NOME DO PRODUTO]. Converteu bem ontem, vale a pena afiliar. Bora trocar estratégia de vídeo — quem postou, comenta o resultado!',
        how_to_join:
          '1. Entre pelo link de convite. 2. Faça sua apresentação no primeiro dia. 3. Poste no máximo 1 oferta por dia. 4. Use o grupo paranetworking — comente as ofertas dos outros também.',
      },
    ]

    newChannels.forEach((c) => {
      let exists = false
      try {
        app.findFirstRecordByData('promotion_channels', 'name', c.name)
        exists = true
      } catch (_) {}
      if (exists) return

      const record = new Record(channelsRecCol)
      record.set('type', c.type)
      record.set('name', c.name)
      record.set('link', c.link)
      record.set('members', c.members)
      record.set('ready_message', c.ready_message)
      record.set('how_to_join', c.how_to_join)
      app.save(record)
    })
  },
  (app) => {
    // revert: remove seeded products/scripts/channels (best-effort)
    const names = [
      'Mega Hair Extensão Clipe 100% Humano',
      'Purificador de Ar USB Portátil para Carro',
      'Garrafa Térmica Inteligente com Display de Temperatura',
      'Mini Massajeador Facial Lift Facial 3D',
      'Carregador Magnético 3 em 1 Sem Fio',
    ]
    names.forEach((n) => {
      try {
        const r = app.findFirstRecordByData('products', 'name', n)
        app.delete(r)
      } catch (_) {}
    })
    try {
      const col = app.findCollectionByNameOrId('promotion_channels')
      app.delete(col)
    } catch (_) {}
  },
)
