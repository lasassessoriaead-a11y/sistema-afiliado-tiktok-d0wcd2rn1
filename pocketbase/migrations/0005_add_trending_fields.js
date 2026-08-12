// Add trending fields to products + seed trending data for the 10 existing products.
// New fields: trending_score (number), trending_position (number), source (text).
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    // 1) Add new fields (guarded so re-running is safe)
    if (!col.fields.getByName('trending_score')) {
      col.fields.add(
        new NumberField({
          name: 'trending_score',
          min: 0,
          max: 100,
          onlyInt: true,
        }),
      )
    }
    if (!col.fields.getByName('trending_position')) {
      col.fields.add(
        new NumberField({
          name: 'trending_position',
          min: 0,
          onlyInt: true,
        }),
      )
    }
    if (!col.fields.getByName('source')) {
      col.fields.add(
        new TextField({
          name: 'source',
          max: 200,
        }),
      )
    }
    app.save(col)

    // 2) Seed trending data for the 10 existing products, by name.
    //    Source: "TikTok Shop Trending" for all.
    const trending = [
      {
        name: 'Brilho Labial Tinted Viral',
        trending_score: 98,
        trending_position: 1,
      },
      {
        name: 'Mega Hair Extensão Clipe 100% Humano',
        trending_score: 95,
        trending_position: 2,
      },
      {
        name: 'Mini Massajeador Facial Lift Facial 3D',
        trending_score: 92,
        trending_position: 3,
      },
      {
        name: 'Kit Organizador de Maquiagem Acrílico',
        trending_score: 88,
        trending_position: 4,
      },
      {
        name: 'Lixador de Unhas Elétrico Profissional',
        trending_score: 85,
        trending_position: 5,
      },
      {
        name: 'Garrafa Térmica Inteligente com Display de Temperatura',
        trending_score: 82,
        trending_position: 6,
      },
      {
        name: 'Carregador Magnético 3 em 1 Sem Fio',
        trending_score: 78,
        trending_position: 7,
      },
      {
        name: 'Purificador de Ar USB Portátil para Carro',
        trending_score: 75,
        trending_position: 8,
      },
      {
        name: 'Escorredor de Louça Dobrável de Silicone',
        trending_score: 72,
        trending_position: 9,
      },
      {
        name: 'Organizador de Gavetas Dobrável (Kit com 12)',
        trending_score: 68,
        trending_position: 10,
      },
    ]

    trending.forEach((t) => {
      let record = null
      try {
        record = app.findFirstRecordByData('products', 'name', t.name)
      } catch (_) {}
      if (!record) return
      record.set('trending_score', t.trending_score)
      record.set('trending_position', t.trending_position)
      record.set('source', 'TikTok Shop Trending')
      app.save(record)
    })

    // 3) Index for sorting by trending position
    col.addIndex('idx_products_trending', false, 'trending_position', '')
    app.save(col)
  },
  (app) => {
    // revert: drop the index + fields (data loss is acceptable on revert)
    const col = app.findCollectionByNameOrId('products')
    try {
      col.removeIndex('idx_products_trending')
    } catch (_) {}
    ;['trending_score', 'trending_position', 'source'].forEach((f) => {
      try {
        col.fields.removeByName(f)
      } catch (_) {}
    })
    app.save(col)
  },
)
