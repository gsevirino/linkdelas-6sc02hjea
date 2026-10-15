migrate(
  (app) => {
    // 1. Create categories collection first so users and providers can reference it if needed
    const categories = new Collection({
      name: 'categories',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'icon', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_categories_name ON categories (name)',
        'CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)',
      ],
    })
    app.save(categories)

    const categoriesColId = categories.id

    // 2. Extend users collection
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['cliente', 'prestadora'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('phone')) {
      users.fields.add(new TextField({ name: 'phone' }))
    }
    if (!users.fields.getByName('city')) {
      users.fields.add(new TextField({ name: 'city' }))
    }
    if (!users.fields.getByName('state')) {
      users.fields.add(new TextField({ name: 'state' }))
    }
    if (!users.fields.getByName('bio')) {
      users.fields.add(new TextField({ name: 'bio' }))
    }
    if (!users.fields.getByName('status')) {
      users.fields.add(
        new SelectField({
          name: 'status',
          values: ['pending', 'approved', 'rejected'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('plan')) {
      users.fields.add(
        new SelectField({
          name: 'plan',
          values: ['essencial', 'profissional', 'destaque'],
          maxSelect: 1,
        }),
      )
    }
    if (!users.fields.getByName('verified')) {
      users.fields.add(new BoolField({ name: 'verified' }))
    }
    if (!users.fields.getByName('categories')) {
      users.fields.add(
        new RelationField({
          name: 'categories',
          collectionId: categoriesColId,
          maxSelect: 10,
        }),
      )
    }

    // Update users rules to allow public view of providers / profiles, auth update own
    users.listRule = ''
    users.viewRule = ''
    users.createRule = ''
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'
    app.save(users)

    // 3. Create providers collection
    const providers = new Collection({
      name: 'providers',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'categories', type: 'relation', collectionId: categoriesColId, maxSelect: 10 },
        { name: 'service_description', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'locations_served', type: 'text' },
        {
          name: 'gallery',
          type: 'file',
          maxSelect: 10,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'rating_avg', type: 'number', min: 0, max: 5 },
        { name: 'review_count', type: 'number', min: 0 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_providers_user ON providers (user)',
        'CREATE INDEX idx_providers_city ON providers (city)',
        'CREATE INDEX idx_providers_state ON providers (state)',
      ],
    })
    app.save(providers)

    // 4. Create quotes collection
    const quotes = new Collection({
      name: 'quotes',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (client = @request.auth.id || provider = @request.auth.id)",
      viewRule:
        "@request.auth.id != '' && (client = @request.auth.id || provider = @request.auth.id)",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (client = @request.auth.id || provider = @request.auth.id)",
      deleteRule: "@request.auth.id != '' && client = @request.auth.id",
      fields: [
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'provider',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'category', type: 'relation', collectionId: categoriesColId, maxSelect: 1 },
        { name: 'description', type: 'text', required: true },
        { name: 'attachment', type: 'file', maxSelect: 1, maxSize: 5242880 },
        { name: 'preferred_date', type: 'date' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pendente', 'respondido', 'aprovado', 'recusado', 'concluido'],
          maxSelect: 1,
        },
        { name: 'price', type: 'number' },
        { name: 'response', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_quotes_client ON quotes (client)',
        'CREATE INDEX idx_quotes_provider ON quotes (provider)',
        'CREATE INDEX idx_quotes_status ON quotes (status)',
      ],
    })
    app.save(quotes)

    const quotesColId = quotes.id

    // 5. Create reviews collection
    const reviews = new Collection({
      name: 'reviews',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != '' && client = @request.auth.id",
      updateRule: "@request.auth.id != '' && client = @request.auth.id",
      deleteRule: "@request.auth.id != '' && client = @request.auth.id",
      fields: [
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'provider',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'quote', type: 'relation', collectionId: quotesColId, maxSelect: 1 },
        { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
        { name: 'comment', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_reviews_provider ON reviews (provider)',
        'CREATE INDEX idx_reviews_client ON reviews (client)',
      ],
    })
    app.save(reviews)

    // 6. Create messages collection
    const messages = new Collection({
      name: 'messages',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (sender = @request.auth.id || recipient = @request.auth.id)",
      viewRule:
        "@request.auth.id != '' && (sender = @request.auth.id || recipient = @request.auth.id)",
      createRule: "@request.auth.id != '' && sender = @request.auth.id",
      updateRule:
        "@request.auth.id != '' && (sender = @request.auth.id || recipient = @request.auth.id)",
      deleteRule: "@request.auth.id != '' && sender = @request.auth.id",
      fields: [
        {
          name: 'quote',
          type: 'relation',
          required: true,
          collectionId: quotesColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'sender',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        {
          name: 'recipient',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'content', type: 'text', required: true },
        { name: 'read', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_messages_quote ON messages (quote)',
        'CREATE INDEX idx_messages_sender ON messages (sender)',
        'CREATE INDEX idx_messages_recipient ON messages (recipient)',
      ],
    })
    app.save(messages)
  },
  (app) => {
    try {
      const messages = app.findCollectionByNameOrId('messages')
      app.delete(messages)
    } catch (_) {}
    try {
      const reviews = app.findCollectionByNameOrId('reviews')
      app.delete(reviews)
    } catch (_) {}
    try {
      const quotes = app.findCollectionByNameOrId('quotes')
      app.delete(quotes)
    } catch (_) {}
    try {
      const providers = app.findCollectionByNameOrId('providers')
      app.delete(providers)
    } catch (_) {}
    try {
      const categories = app.findCollectionByNameOrId('categories')
      app.delete(categories)
    } catch (_) {}
  },
)
