migrate(
  (app) => {
    const products = new Collection({
      name: 'products',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['Beleza', 'Casa', 'Cozinha', 'Organização'],
          maxSelect: 1,
        },
        { name: 'average_price', type: 'number', required: true },
        { name: 'commission_margin', type: 'number', required: true },
        { name: 'why_sell', type: 'text', required: true },
        { name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_products_category ON products (category)'],
    })
    app.save(products)

    const productsId = app.findCollectionByNameOrId('products').id

    const scripts = new Collection({
      name: 'scripts',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'product',
          type: 'relation',
          required: true,
          collectionId: productsId,
          maxSelect: 1,
        },
        { name: 'hook', type: 'text', required: true },
        { name: 'development', type: 'text', required: true },
        { name: 'cta', type: 'text', required: true },
        { name: 'caption', type: 'text', required: true },
        { name: 'hashtags', type: 'text', required: true },
        { name: 'best_time', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_scripts_product ON scripts (product)'],
    })
    app.save(scripts)

    const leadMagnets = new Collection({
      name: 'lead_magnets',
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
          values: ['Guia', 'Checklist', 'E-book'],
          maxSelect: 1,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'full_text', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(leadMagnets)

    const profileBio = new Collection({
      name: 'profile_bio',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'bio_text', type: 'text', required: true },
        { name: 'profile_link', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(profileBio)

    const whatsappMessages = new Collection({
      name: 'whatsapp_messages',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'order', type: 'number', required: true, onlyInt: true },
        { name: 'message_text', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_whatsapp_order ON whatsapp_messages (`order`)'],
    })
    app.save(whatsappMessages)

    const postingCalendar = new Collection({
      name: 'posting_calendar',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'day', type: 'text', required: true },
        { name: 'time', type: 'text', required: true },
        { name: 'content_type', type: 'text', required: true },
        { name: 'cta', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(postingCalendar)

    const usersId = '_pb_users_auth_'

    const tracking = new Collection({
      name: 'tracking',
      type: 'base',
      listRule: "@request.auth.id != '' && owner = @request.auth.id",
      viewRule: "@request.auth.id != '' && owner = @request.auth.id",
      createRule: "@request.auth.id != '' && owner = @request.auth.id",
      updateRule: "@request.auth.id != '' && owner = @request.auth.id",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'product',
          type: 'relation',
          required: true,
          collectionId: productsId,
          maxSelect: 1,
        },
        {
          name: 'source',
          type: 'select',
          required: true,
          values: ['Link da bio', 'Link do vídeo', 'Story', 'Outro'],
          maxSelect: 1,
        },
        { name: 'clicks', type: 'number', required: true, min: 0 },
        { name: 'orders', type: 'number', required: true, min: 0 },
        { name: 'commission', type: 'number', required: true, min: 0 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_tracking_owner ON tracking (owner)',
        'CREATE INDEX idx_tracking_date ON tracking (date)',
      ],
    })
    app.save(tracking)

    const actionPlan = new Collection({
      name: 'action_plan',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'order', type: 'number', required: true, onlyInt: true },
        { name: 'step', type: 'text', required: true },
        { name: 'detail', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_action_order ON action_plan (`order`)'],
    })
    app.save(actionPlan)

    const planProgress = new Collection({
      name: 'plan_progress',
      type: 'base',
      listRule: "@request.auth.id != '' && owner = @request.auth.id",
      viewRule: "@request.auth.id != '' && owner = @request.auth.id",
      createRule: "@request.auth.id != '' && owner = @request.auth.id",
      updateRule: "@request.auth.id != '' && owner = @request.auth.id",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'completed_steps', type: 'json', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(planProgress)
  },
  (app) => {
    ;[
      'plan_progress',
      'action_plan',
      'tracking',
      'posting_calendar',
      'whatsapp_messages',
      'profile_bio',
      'lead_magnets',
      'scripts',
      'products',
    ].forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        if (col) app.delete(col)
      } catch (_) {}
    })
  },
)
