// GET /api/refresh-trending
// Simulates an automatic search for trending products on TikTok Shop.
// Re-applies the trending_score / trending_position / source data to the
// existing products and returns them ordered by trending_position.
routerAdd(
  'GET',
  '/api/refresh-trending',
  (e) => {
    try {
      // Trending data by product name (same source as the seed migration).
      // Kept inline because hook callbacks run in a separate VM pool and
      // cannot reference top-level identifiers.
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

      // Re-apply the trending data to each existing product.
      //
      // The record data-access API differs between PocketBase versions:
      //   - v0.22 exposes it on $app.dao()  -> findFirstRecordByData / saveRecord
      //   - v0.23+ removed Dao and exposes  -> $app.findFirstRecordByData / $app.save
      // Resolve the right handle once, inside the handler, so the route always
      // registers. A ReferenceError thrown while registering the route would
      // prevent it from registering at all — which is why the endpoint
      // previously returned 404 "File not found" even though the hook deployed.
      const dao = typeof $app.dao === 'function' ? $app.dao() : $app

      const findRecord = function (name, key, value) {
        try {
          return dao.findFirstRecordByData(name, key, value)
        } catch (_) {
          return null
        }
      }

      const saveRecord = function (rec) {
        if (typeof dao.saveRecord === 'function') {
          dao.saveRecord(rec)
        } else {
          dao.save(rec)
        }
      }

      const updated = []
      trending.forEach((t) => {
        const record = findRecord('products', 'name', t.name)
        if (!record) return
        record.set('trending_score', t.trending_score)
        record.set('trending_position', t.trending_position)
        record.set('source', 'TikTok Shop Trending')
        saveRecord(record)
        updated.push(record)
      })

      // Sort by trending_position ascending.
      updated.sort(function (a, b) {
        const pa = a.get('trending_position') || 0
        const pb = b.get('trending_position') || 0
        if (pa < pb) return -1
        if (pa > pb) return 1
        return 0
      })

      // Serialize records to plain JSON.
      const result = updated.map(function (r) {
        return {
          id: r.get('id'),
          name: r.get('name'),
          category: r.get('category'),
          average_price: r.get('average_price'),
          commission_margin: r.get('commission_margin'),
          why_sell: r.get('why_sell'),
          trending_score: r.get('trending_score') || 0,
          trending_position: r.get('trending_position') || 0,
          source: r.get('source') || '',
          updated: r.get('updated'),
        }
      })

      return e.json(200, {
        source: 'TikTok Shop Trending',
        refreshed_at: new Date().toISOString(),
        count: result.length,
        products: result,
      })
    } catch (err) {
      return e.json(500, {
        error: 'Falha ao atualizar produtos em alta',
        detail: String(err),
      })
    }
  },
  $apis.requireAuth(),
)
