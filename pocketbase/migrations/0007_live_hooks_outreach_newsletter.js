// Melhorias incrementais: novas collections de conteúdo
//  - live_scripts     (5 roteiros completos de live)
//  - hooks_library    (20+ ganchos para TikTok, por categoria)
//  - outreach_scripts (5 scripts de pedido de amostra + seeding)
//  - newsletter_editions (4 edições prontas de newsletter semanal)
// Todas read-only para o app (list/view autenticado, escrita só admin).
migrate(
  (app) => {
    // ---------------------------------------------------------------- live_scripts
    const liveScripts = new Collection({
      name: 'live_scripts',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'duration_min', type: 'number', required: true, min: 1, onlyInt: true },
        { name: 'opening', type: 'text', required: true },
        { name: 'presentation', type: 'text', required: true },
        { name: 'demonstration', type: 'text', required: true },
        { name: 'objections', type: 'text', required: true },
        { name: 'offers', type: 'text', required: true },
        { name: 'cta', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [],
    })
    app.save(liveScripts)

    // ---------------------------------------------------------------- hooks_library
    const hooksLibrary = new Collection({
      name: 'hooks_library',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          values: [
            'Curiosidade',
            'Choque/Surpresa',
            'Problema/Solução',
            'Antes/Depois',
            'TikTok Made Me Buy It',
            'POV/Storytelling',
            'Urgência/Escassez',
            'Comparação',
          ],
          maxSelect: 1,
        },
        { name: 'hook_text', type: 'text', required: true },
        { name: 'example', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_hooks_category ON hooks_library (category)'],
    })
    app.save(hooksLibrary)

    // ---------------------------------------------------------------- outreach_scripts
    const outreachScripts = new Collection({
      name: 'outreach_scripts',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'tone',
          type: 'select',
          required: true,
          values: ['Formal', 'Casual', 'Baseado em dados', 'Curto e direto', 'Follow-up'],
          maxSelect: 1,
        },
        {
          name: 'channel',
          type: 'select',
          required: true,
          values: ['TikTok DM', 'Instagram DM', 'Email'],
          maxSelect: 1,
        },
        { name: 'message', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_outreach_tone ON outreach_scripts (tone)'],
    })
    app.save(outreachScripts)

    // ---------------------------------------------------------------- newsletter_editions
    const newsletterEditions = new Collection({
      name: 'newsletter_editions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'edition_number', type: 'number', required: true, min: 1, onlyInt: true },
        { name: 'subject', type: 'text', required: true },
        { name: 'product_of_week', type: 'text', required: true },
        { name: 'hook_trending', type: 'text', required: true },
        { name: 'quick_tip', type: 'text', required: true },
        { name: 'behind_scenes', type: 'text', required: true },
        { name: 'cta_text', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_newsletter_edition ON newsletter_editions (edition_number)'],
    })
    app.save(newsletterEditions)

    // ================================================================ SEED live_scripts
    const liveCol = app.findCollectionByNameOrId('live_scripts')
    const liveData = [
      {
        title: 'Live de Lançamento: Brilho Labial Tinted Viral',
        duration_min: 18,
        opening:
          '"Gente, pare tudo! O gloss que viralizou no TikTok chegou e eu vou mostrar AO VIVO por que todo mundo está falando disso. Fica até o final que tem oferta relâmpago!" — Prenda a audiência nos 3 primeiros segundos mostrando o brilho espelhado já aplicado.',
        presentation:
          'Apresente o Brilho Labial Tinted Viral: fórmula com ácido hialurônico, efeito gloss espelhado, 12 cores disponíveis, não gruda e hidrata. Talking points: preço de R$ 29,90 (compra por impulso), comissão de 20%, #1 trending do TikTok Shop. Mostre a embalagem de perto e a paleta de cores.',
        demonstration:
          'Aplique o gloss na própria boca ao vivo, mostre o brilho em diferentes ângulos. Teste o "não gruda" colando um papel e mostrando que solta. Aplique em uma amiga com tom de pele diferente para mostrar versatilidade. Mostre o antes (lábios secos) e depois (hidratados e volumosos).',
        objections:
          '"Tá caro" → custa menos que um café da Starbucks e dura o mês todo. "E se não gostar?" → TikTok Shop tem garantia de 7 dias. "Quanto tempo demora?" → frete expresso chega em 3-5 dias úteis. "É original?" → sim, vendido direto pelo TikTok Shop com nota fiscal.',
        offers:
          'Oferta relâmpago 1 (min 5): "Só mais 5 unidades com 15% OFF nesse preço!" Oferta relâmpago 2 (min 12): "Quem comprar agora leva 2 cores pelo preço de 1 — mas só nos próximos 10 minutos!" Crie escassez real mostrando o contador de estoque na tela.',
        cta: '"O link tá na minha bio e no carrinho amarelo aqui embaixo! Clica AGORA antes que esgote. Quem comprar, manda print aqui nos comentários que eu pessoalizo a cor pra você!"',
      },
      {
        title: 'Live Antes/Depois: Lixador de Unhas Elétrico',
        duration_min: 16,
        opening:
          '"Nunca mais pague R$ 80 no salão! Vou transformar a minha unha AO VIVO em 5 segundos e você vai ver o resultado." — Comece já com a unha inacabada na câmera para criar curiosidade imediata.',
        presentation:
          'Apresente o Lixador de Unhas Elétrico Profissional: 5 brocas intercambiáveis, velocidade ajustável, bateria USB recarregável, serve para unhas naturais e em gel. Talking points: preço R$ 89,90, comissão 18%, apelo de economia (paga em 1 uso vs salão).',
        demonstration:
          'Mostre a unha crua e sem acabamento. Ligue o aparelho e lixe em movimento suave, nivelando cutícula e polindo. Mostre o resultado de perto em segundos. Demonstre a troca de brocas e como limpar o aparelho.',
        objections:
          '"Machuca?" → não, é lixamento suave, sem dor. "Serve para iniciante?" → sim, tem 5 velocidades para iniciantes. "Durável?" → bateria dura 2 horas de uso contínuo. "Tem garantia?" → 90 dias pelo TikTok Shop.',
        offers:
          'Oferta relâmpago (min 6): "Os 5 primeiros que comprarem ganham o kit com estojo de presente!" Oferta 2 (min 14): "Preço de lançamento só hoje — amanhã volta ao valor normal."',
        cta: '"Clica no carrinho amarelo aqui no vídeo! O link também está fixado na minha bio. Quem compilar, marca eu aqui pra eu ver o resultado de vocês!"',
      },
      {
        title: 'Live Organização: Kit Gavetas + Penteadeira',
        duration_min: 17,
        opening:
          '"Minha gaveta era um pesadelo — olha o antes! Vou organizar tudo AO VIVO e você vai ver a transformação mais satisfatória do dia." — Mostre a gaveta bagunçada antes de tudo.',
        presentation:
          'Apresente o Organizador de Gavetas Dobrável (Kit 12) e o Kit Organizador de Maquiagem Acrílico. Talking points: preço R$ 39,90 e R$ 49,90, comissão 15% e 20%, apelo de "terapia de casa", visual satisfatório.',
        demonstration:
          'Tire tudo da gaveta bagunçada. Encaixe as divisórias dobráveis e organize meias/roupas em tempo recorde. Depois mostre o organizador acrílico com batons, pincéis e paletas. O antes/depois visual vende sozinho.',
        objections:
          '"Cabe na minha gaveta?" → é ajustável e dobrável, serve para qualquer tamanho. "Quebra fácil?" → silicone resistente, não quebra. "Vale a pena o acrílico?" → sim, mais durável que plástico comum e não amarela.',
        offers:
          'Oferta combo (min 7): "Compre os DOIS kits com 20% OFF — só hoje na live!" Oferta relâmpago (min 13): "10 primeiros ganham frete grátis em todo o Brasil."',
        cta: '"Clica no carrinho amarelo! Vocês vão amar o resultado em casa. Manda foto depois nos comentários que eu reposto!"',
      },
      {
        title: 'Live Cozinha: Escorredor + Gadgets',
        duration_min: 15,
        opening:
          '"Sua pia é um caos igual a minha era? Olha isso!" — Mostre a pia cheia de louça e apresente a solução imediata.',
        presentation:
          'Apresente o Escorredor de Louça Dobrável de Silicone e a Garrafa Térmica Inteligente com Display. Talking points: R$ 59,90 (15%) e R$ 69,90 (20%), utilidades que resolvem dor real, demonstração clara em 15s.',
        demonstration:
          'Abra o escorredor na pia, coloque pratos e mostre a água escorrendo direto na pia. Depois dobre e guarde na gaveta. Na garrafa, mostre o display acendendo com a temperatura e sirva café quente vs água gelada.',
        objections:
          '"Cabe na minha pia?" → ajustável e dobrável. "Silicone é seguro?" → livre de BPA. "Garrafa vaza?" → vedação dupla, não vaza. "Quanto tempo mantém temperatura?" → 12h quente, 24h gelada.',
        offers:
          'Oferta relâmpago (min 8): "Compre os 2 produtos e ganhe 15% OFF no carrinho!" Oferta (min 12): "Frete grátis só durante a live — 15 minutos."',
        cta: '"Clica no carrinho amarelo no vídeo! Link também na bio. Comenta depois o que achou da organização da cozinha!"',
      },
      {
        title: 'Live Bem-Estar: Massajeador Facial + Skincare',
        duration_min: 19,
        opening:
          '"O segredo das influencers para o rosto definido custa menos de R$ 60 — vou mostrar AO VIVO o antes e depois em 3 minutos!" — Mostre o rosto de um lado inchado e do outro já definido.',
        presentation:
          'Apresente o Mini Massajeador Facial Lift Facial 3D. Talking points: R$ 59,90, comissão 21%, apelo de drenagem linfática, público 30+, resultado visível em minutos.',
        demonstration:
          'Aplique gel/creme no rosto. Use o massajeador vibrando do queixo em direção à orelha por 3 minutos. Mostre o antes (rosto inchado de um lado) e depois (mais definido). Demonstre o formato 3D que encaixa no rosto.',
        objections:
          '"Funciona mesmo?" → resultado visível em minutos, veja ao vivo. "É seguro?" → vibração suave, não agride a pele. "Precisa de creme?" → funciona melhor com gel, mas pode usar seco. "Bateria?" → USB recarregável.',
        offers:
          'Oferta relâmpago (min 6): "Os 6 primeiros ganham o kit com gel facial grátis!" Oferta (min 14): "Compre 1 e leve o segundo com 50% OFF."',
        cta: '"Clica no carrinho amarelo! Quem comprar manda print que eu ensino a rotina completa de skincare aqui nos comentários!"',
      },
    ]

    liveData.forEach((s) => {
      let exists = false
      try {
        app.findFirstRecordByData('live_scripts', 'title', s.title)
        exists = true
      } catch (_) {}
      if (exists) return
      const r = new Record(liveCol)
      r.set('title', s.title)
      r.set('duration_min', s.duration_min)
      r.set('opening', s.opening)
      r.set('presentation', s.presentation)
      r.set('demonstration', s.demonstration)
      r.set('objections', s.objections)
      r.set('offers', s.offers)
      r.set('cta', s.cta)
      app.save(r)
    })

    // ================================================================ SEED hooks_library (24 hooks)
    const hooksCol = app.findCollectionByNameOrId('hooks_library')
    const hooksData = [
      // Curiosidade
      {
        category: 'Curiosidade',
        hook_text: 'Ninguém te contou isso sobre [produto]...',
        example: 'Substitua [produto] por "o gloss viral" e mostre o brilho na sequência.',
      },
      {
        category: 'Curiosidade',
        hook_text: 'O segredo que as blogueiras escondem sobre [produto]',
        example: 'Funciona para skincare, cabelo e maquiagem.',
      },
      {
        category: 'Curiosidade',
        hook_text: 'Eu demorei 6 meses pra descobrir isso sobre [produto]',
        example: 'Cria autoridade e curiosidade ao mesmo tempo.',
      },
      // Choque/Surpresa
      {
        category: 'Choque/Surpresa',
        hook_text: 'Parece caro mas custa R$ [preço]!',
        example: 'Mostre o produto com aparência premium e revele o preço baixo.',
      },
      {
        category: 'Choque/Surpresa',
        hook_text: 'Isso acabou de chegar no Brasil...',
        example: 'Gatilho de novidade, ideal para produtos importados.',
      },
      {
        category: 'Choque/Surpresa',
        hook_text: 'Não acredito que isso existe por esse preço',
        example: 'Combine com demonstração imediata do produto.',
      },
      // Problema/Solução
      {
        category: 'Problema/Solução',
        hook_text: 'Cansei de [problema], até que achei [produto]',
        example: 'Substitua [problema] por "gaveta bagunçada" e [produto] pelo organizador.',
      },
      {
        category: 'Problema/Solução',
        hook_text: 'Se você sofre com [problema], precisa ver isso',
        example: 'Foco em dor real: cabelo ralo, unha feita em casa, pia apertada.',
      },
      {
        category: 'Problema/Solução',
        hook_text: 'Problema de [problema] resolvido em 30 segundos',
        example: 'Promessa de tempo curto gera alta retenção.',
      },
      // Antes/Depois
      {
        category: 'Antes/Depois',
        hook_text: 'Olha como estava [antes] e como ficou [depois]',
        example: 'Formato mais viral do TikTok — mostre a transformação em 3 segundos.',
      },
      {
        category: 'Antes/Depois',
        hook_text: 'O antes e depois que vai te chocar',
        example: 'Funciona para organização, skincare, cabelo e unhas.',
      },
      {
        category: 'Antes/Depois',
        hook_text: 'Não acreditei no resultado — vê com seus olhos',
        example: 'Use narração pessoal para gerar conexão.',
      },
      // TikTok Made Me Buy It
      {
        category: 'TikTok Made Me Buy It',
        hook_text: 'Vi no TikTok e tive que testar',
        example: 'Aproveite a trend #TikTokMadeMeBuyIt para alcance orgânico.',
      },
      {
        category: 'TikTok Made Me Buy It',
        hook_text: 'O produto viral que todo mundo quer',
        example: 'Mostre o produto já com alta procura para gerar prova social.',
      },
      {
        category: 'TikTok Made Me Buy It',
        hook_text: 'Comprei o produto mais visto do TikTok',
        example: 'Combine com review honesto para manter credibilidade.',
      },
      // POV/Storytelling
      {
        category: 'POV/Storytelling',
        hook_text: 'POV: você finalmente encontrou [solução]',
        example: 'Formato narrativo que gera identificação imediata.',
      },
      {
        category: 'POV/Storytelling',
        hook_text: 'Era uma vez alguém que sofria com [problema]...',
        example: 'Storytelling clássico, ideal para vídeos de 30s.',
      },
      {
        category: 'POV/Storytelling',
        hook_text: 'O dia que minha rotina mudou completamente',
        example: 'Conecte o produto a uma transformação de rotina.',
      },
      // Urgência/Escassez
      {
        category: 'Urgência/Escassez',
        hook_text: 'Esse produto vai esgotar',
        example: 'Crie urgência real mostrando o estoque baixo na tela.',
      },
      {
        category: 'Urgência/Escassez',
        hook_text: 'Últimas unidades com desconto',
        example: 'Combine com contador de tempo para máxima conversão.',
      },
      {
        category: 'Urgência/Escassez',
        hook_text: 'Só hoje nesse preço — amanhã acaba',
        example: 'Gatilho de oferta por tempo limitado.',
      },
      // Comparação
      {
        category: 'Comparação',
        hook_text: '[Produto caro] vs [produto barato] — qual vale mais?',
        example: 'Compare um item de R$ 200 com o seu de R$ 40 mostrando que o resultado é igual.',
      },
      {
        category: 'Comparação',
        hook_text: 'Testei o original e o achadinho — surpresa!',
        example: 'Formato de "versus" tem altíssima retenção.',
      },
      {
        category: 'Comparação',
        hook_text: 'O de R$ 100 ou o de R$ 30? Vem ver',
        example: 'Gatilho de economia com promessa de revelação.',
      },
    ]
    hooksData.forEach((h) => {
      let exists = false
      try {
        app.findFirstRecordByData('hooks_library', 'hook_text', h.hook_text)
        exists = true
      } catch (_) {}
      if (exists) return
      const r = new Record(hooksCol)
      r.set('category', h.category)
      r.set('hook_text', h.hook_text)
      r.set('example', h.example)
      app.save(r)
    })

    // ================================================================ SEED outreach_scripts
    const outreachCol = app.findCollectionByNameOrId('outreach_scripts')
    const outreachData = [
      {
        tone: 'Formal',
        channel: 'Email',
        message:
          'Prezado(a) [NOME DA MARCA],\n\nMeu nome é [SEU NOME], sou criador(a) de conteúdo no TikTok (@[SEU PERFIL]) com foco em [SEU NICHO]. Acompanho os produtos da [MARCA] e gostaria de propor uma parceria de product seeding.\n\nTenho [X] mil seguidores engajados e meu conteúdo tem média de [Y] mil visualizações por vídeo no nicho de [categoria do produto]. Acredito que o produto [NOME DO PRODUTO] tem enorme potencial com meu público.\n\nGostaria de solicitar uma amostra para criação de conteúdo orgânico (vídeo review + demo). Em troca, ofereço: 1 vídeo principal, 2 stories e menção na bio por 7 dias. Todo o conteúdo seguirá as diretrizes da marca.\n\nAgradeço desde já pela atenção e fico à disposição.\n\nAtenciosamente,\n[SEU NOME]\n@[SEU PERFIL] | [SEU EMAIL]',
      },
      {
        tone: 'Casual',
        channel: 'Instagram DM',
        message:
          'Oi, pessoal da [MARCA]! 😍 Tudo bem? Eu sou afiliado(a) de vocês no TikTok Shop e AMO o [NOME DO PRODUTO] — já gerei [X] vendas esse mês divulgando! Queria saber se vocês trabalham com product seeding? Adoraria receber uma amostra pra criar um vídeo bem caprichado pra vocês 🙌 Posso mandar mídia kit se precisar! Valeu!',
      },
      {
        tone: 'Baseado em dados',
        channel: 'TikTok DM',
        message:
          'Olá, [MARCA]! Sou afiliado(a) de vocês no TikTok Shop com resultados concretos:\n\n• [X] vídeos publicados sobre [PRODUTO]\n• [Y] mil visualizações totais geradas\n• [Z] vendas convertidas no último mês\n\nQuero escalar esses resultados com conteúdo patrocinado. Vocês oferecem amostras grátis para criadores com prova de performance? Posso comprometer [N] vídeos em 30 dias. Meu público é 80% [faixa etária/gênero] alinhado com o produto. Topa conversar?',
      },
      {
        tone: 'Curto e direto',
        channel: 'Instagram DM',
        message:
          'Oi, [MARCA]! Sou afiliado(a) de vocês com [X] vendas/mês. Queria uma amostra do [PRODUTO] pra gravar um vídeo review. Em troca: 1 vídeo TikTok + 2 stories + bio por 7 dias. Pode ser? 🙌 Meu @ é @[PERFIL].',
      },
      {
        tone: 'Follow-up',
        channel: 'Email',
        message:
          'Olá, [NOME DA MARCA]!\n\nPassando para dar um retorno sobre o e-mail que enviei há 5 dias sobre a parceria de product seeding para o [NOME DO PRODUTO].\n\nCompreendo que a caixa de vocês deve estar cheia, então vou ser breve: continuei divulgando o produto como afiliado e nesse período gerei mais [X] vendas orgânicas. Acredito muito no potencial de uma parceria formal.\n\nSe houver interesse, posso enviar o mídia kit atualizado com métricas dos últimos 30 dias. Qualquer resposta é bem-vinda!\n\nAbraço,\n[SEU NOME] | @[SEU PERFIL]',
      },
    ]
    outreachData.forEach((o) => {
      let exists = false
      try {
        app.findFirstRecordByData('outreach_scripts', 'message', o.message)
        exists = true
      } catch (_) {}
      if (exists) return
      const r = new Record(outreachCol)
      r.set('tone', o.tone)
      r.set('channel', o.channel)
      r.set('message', o.message)
      app.save(r)
    })

    // ================================================================ SEED newsletter_editions
    const newsCol = app.findCollectionByNameOrId('newsletter_editions')
    const newsData = [
      {
        edition_number: 1,
        subject: '🔥 O gloss que viralizou + o hook da semana',
        product_of_week:
          'Brilho Labial Tinted Viral — #1 trending do TikTok Shop (score 98). Preço R$ 29,90, comissão 20%. Por que priorizar: preço de entrada baixo + apelo visual altíssimo = conversão de primeira compra.',
        hook_trending:
          '"Parece caro mas custa R$ [preço]!" — Use com qualquer produto premium visual. Mostre o produto, faça uma pausa, revele o preço. Retenção média desse gancho: 78%.',
        quick_tip:
          'Poste vídeos às 19h e 12h — são os picos de audiência do público de compras no TikTok Brasil. Use o carrinho amarelo em TODO vídeo, mesmo os orgânicos.',
        behind_scenes:
          'Essa semana gerei R$ [X] em comissões com [Y] vídeos. O formato que mais converteu foi antes/depois (3 vendas por vídeo vs 1 dos outros formatos). Lição: invista no visual.',
        cta_text:
          'Quer o link de afiliação dos produtos desta semana? Responda este email com "QUERO" e eu te envio a lista completa com os melhores do momento.',
      },
      {
        edition_number: 2,
        subject: '📈 Live = 10x mais receita (te mostro como)',
        product_of_week:
          'Mega Hair Extensão Clipe 100% Humano — #2 trending (score 95). Comissão 22%, maior margem do catálogo. Ideal para live: o antes/depois de cabelo converte absurdamente bem em transmissão ao vivo.',
        hook_trending:
          '"Ninguém te contou isso sobre [produto]..." — Curiosidade pura. Complete com uma revelação visual nos primeiros 3 segundos. Esse hook está com taxa de cliques 40% acima da média.',
        quick_tip:
          'Faça sua primeira live esta semana. LIVES convertem 5-12% vs 3-6% dos vídeos. Os top 0,5% dos afiliados fazem 2-3 lives por semana. Comece com 15 minutos.',
        behind_scenes:
          'Fiz minha primeira live de 20 min com o lixador de unhas: 47 pessoas assistiram ao vivo, 6 compraram = 12,7% de conversão. Vídeos do mesmo produto convertem a 4%. A live vale 10x.',
        cta_text:
          'Responda "LIVE" se quer o roteiro completo de 18 minutos que usei nessa transmissão. Envio gratuitamente.',
      },
      {
        edition_number: 3,
        subject: '🎯 3 produtos para focar essa semana',
        product_of_week:
          'Mini Massajeador Facial Lift 3D — #3 trending (score 92). Comissão 21%, público 30+ com poder aquisitivo. Gancho perfeito: "O segredo das influencers custa menos de R$ 60".',
        hook_trending:
          '"POV: você finalmente encontrou [solução]" — Storytelling que gera identificação. Use para produtos de transformação (skincare, cabelo, organização). Retenção acima de 70%.',
        quick_tip:
          'Teste 3 formatos por produto: unboxing, review honesto e antes/depois. Identifique qual converte melhor e dobre a aposta nesse formato para o produto vencedor.',
        behind_scenes:
          'Análise da semana: dos 10 produtos, 3 geraram 80% da comissão. Decisão: focar todo o conteúdo dessa semana nesses 3 e pausar os demais. Menos produtos, mais profundidade.',
        cta_text:
          'Quer saber quais são seus 3 produtos com melhor performance? Acesse o Dashboard e veja a nova seção "Top 3 Produtos do Momento".',
      },
      {
        edition_number: 4,
        subject: '🚀 Product seeding: como pedir amostras grátis',
        product_of_week:
          'Kit Organizador de Maquiagem Acrílico — #4 trending (score 88). Comissão 20%, apelo aspiracional. Perfeito para parceria direta com marca: combine com o organizador de gavetas para um combo de organização.',
        hook_trending:
          '"Vi no TikTok e tive que testar" — Aproveite a trend #TikTokMadeMeBuyIt. Esse gancho ganha alcance orgânico extra porque o algoritmo empurra conteúdo dessa categoria.',
        quick_tip:
          'Esta semana, envie 5 mensagens de product seeding para marcas. Use o tom "Baseado em dados" mostrando suas vendas como afiliado. Marcas respondem criadores que já trazem resultado.',
        behind_scenes:
          'Enviei 5 mensagens de seeding essa semana, recebi 2 respostas positivas e 1 amostra confirmada. Taxa de resposta: 40%. A amostra veio do produto que eu já era afiliado — provou que dá resultado levar números.',
        cta_text:
          'Quer os 5 scripts prontos de outreach? Acesse a nova página "Outreach" na sidebar e copie o que melhor combina com seu estilo.',
      },
    ]
    newsData.forEach((n) => {
      let exists = false
      try {
        app.findFirstRecordByData('newsletter_editions', 'edition_number', n.edition_number)
        exists = true
      } catch (_) {}
      if (exists) return
      const r = new Record(newsCol)
      r.set('edition_number', n.edition_number)
      r.set('subject', n.subject)
      r.set('product_of_week', n.product_of_week)
      r.set('hook_trending', n.hook_trending)
      r.set('quick_tip', n.quick_tip)
      r.set('behind_scenes', n.behind_scenes)
      r.set('cta_text', n.cta_text)
      app.save(r)
    })
  },
  (app) => {
    ;['newsletter_editions', 'outreach_scripts', 'hooks_library', 'live_scripts'].forEach(
      (name) => {
        try {
          const col = app.findCollectionByNameOrId(name)
          if (col) app.delete(col)
        } catch (_) {}
      },
    )
  },
)
