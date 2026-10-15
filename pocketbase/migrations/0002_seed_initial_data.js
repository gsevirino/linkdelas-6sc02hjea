migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const catCol = app.findCollectionByNameOrId('categories')
    const provCol = app.findCollectionByNameOrId('providers')
    const revCol = app.findCollectionByNameOrId('reviews')

    // 1. Seed Owner / Admin User
    let ownerUser
    try {
      ownerUser = app.findAuthRecordByEmail('_pb_users_auth_', 'gislaine.sevirino@gmail.com')
    } catch (_) {
      ownerUser = new Record(usersCol)
      ownerUser.setEmail('gislaine.sevirino@gmail.com')
      ownerUser.setPassword('Skip@Pass')
      ownerUser.setVerified(true)
      ownerUser.set('name', 'Gislaine Sevirino')
      ownerUser.set('role', 'cliente')
      ownerUser.set('city', 'São Paulo')
      ownerUser.set('state', 'SP')
      ownerUser.set('status', 'approved')
      ownerUser.set('verified', true)
      app.save(ownerUser)
    }

    // 2. Seed Categories
    const categoryDefs = [
      { name: 'Autocuidado', slug: 'autocuidado', icon: 'Sparkles' },
      { name: 'Beleza', slug: 'beleza', icon: 'Scissors' },
      { name: 'Bem-estar', slug: 'bem-estar', icon: 'Heart' },
      { name: 'Gestão do lar', slug: 'gestao-do-lar', icon: 'Home' },
      { name: 'Saúde e estética', slug: 'saude-e-estetica', icon: 'Activity' },
      { name: 'Moda e personal styling', slug: 'moda-e-personal-styling', icon: 'ShoppingBag' },
    ]

    const catMap = {}
    for (const c of categoryDefs) {
      let catRecord
      try {
        catRecord = app.findFirstRecordByData('categories', 'slug', c.slug)
      } catch (_) {
        catRecord = new Record(catCol)
        catRecord.set('name', c.name)
        catRecord.set('slug', c.slug)
        catRecord.set('icon', c.icon)
        app.save(catRecord)
      }
      catMap[c.slug] = catRecord.id
    }

    // 3. Seed Providers (6 women: 2 destaque, 2 profissional, 2 essencial)
    const providerDefs = [
      {
        email: 'camila.estetica@conexaofeminina.com',
        name: 'Camila Fernandes',
        phone: '(11) 98765-4321',
        city: 'São Paulo',
        state: 'SP',
        locations_served: 'Zona Sul, Zona Oeste e Jardins - SP',
        plan: 'destaque',
        status: 'approved',
        verified: true,
        categorySlugs: ['saude-e-estetica', 'autocuidado'],
        service_description:
          'Especialista em tratamentos faciais avançados, limpeza de pele profunda, drenagem linfática pós-operatória e massagens relaxantes com aromaterapia. Atendimento domiciliar exclusivo para mulheres e em estúdio próprio em Moema.',
        bio: 'Fisioterapeuta dermatofuncional com mais de 8 anos de experiência e pós-graduação em cosmetologia aplicada.',
        rating_avg: 4.9,
        review_count: 24,
        reviews: [
          {
            clientName: 'Mariana Souza',
            rating: 5,
            comment:
              'Atendimento impecável! A drenagem me salvou no pós-parto, com todo cuidado e pontualidade.',
          },
          {
            clientName: 'Luciana Prado',
            rating: 5,
            comment: 'Super profissional, produtos de primeira linha e ambiente muito acolhedor.',
          },
        ],
      },
      {
        email: 'beatriz.organizacao@conexaofeminina.com',
        name: 'Beatriz Nogueira',
        phone: '(21) 99123-5678',
        city: 'Rio de Janeiro',
        state: 'RJ',
        locations_served: 'Zona Sul, Barra da Tijuca e Tijuca - RJ',
        plan: 'destaque',
        status: 'approved',
        verified: true,
        categorySlugs: ['gestao-do-lar'],
        service_description:
          'Personal Organizer especializada em closets, cozinhas planejadas, despensas e organização pós-mudança. Metodologia que devolve a leveza ao lar e economiza tempo da mulher moderna.',
        bio: 'Certificada pela ANPOP, com mais de 150 residências transformadas em espaços funcionais e harmoniosos.',
        rating_avg: 5.0,
        review_count: 31,
        reviews: [
          {
            clientName: 'Renata Vasconcelos',
            rating: 5,
            comment:
              'Transformou minha casa depois da mudança! Super organizada, pontual e muito respeitosa.',
          },
        ],
      },
      {
        email: 'juliana.styling@conexaofeminina.com',
        name: 'Juliana Duarte',
        phone: '(31) 98456-7890',
        city: 'Belo Horizonte',
        state: 'MG',
        locations_served: 'Belo Horizonte e Nova Lima - MG',
        plan: 'profissional',
        status: 'approved',
        verified: true,
        categorySlugs: ['moda-e-personal-styling', 'autocuidado'],
        service_description:
          'Consultoria de imagem e estilo, análise de coloração pessoal, detox de guarda-roupa e montagem de looks para eventos e trabalho. Foco no empoderamento feminino pela autenticidade do vestir.',
        bio: 'Consultora de moda com formação no IED e vivência de 6 anos no mercado de styling em BH.',
        rating_avg: 4.8,
        review_count: 18,
        reviews: [
          {
            clientName: 'Carla Mendes',
            rating: 5,
            comment:
              'Descobrir minha paleta com a Juliana mudou a forma como me vejo no espelho. Amei!',
          },
        ],
      },
      {
        email: 'patricia.beleza@conexaofeminina.com',
        name: 'Patrícia Albuquerque',
        phone: '(41) 99876-1234',
        city: 'Curitiba',
        state: 'PR',
        locations_served: 'Batel, Bigorrilho e Juvevê - Curitiba',
        plan: 'profissional',
        status: 'approved',
        verified: true,
        categorySlugs: ['beleza'],
        service_description:
          "Maquiadora e visagista especializada em noivas, formandas e produções executivas. Penteados sofisticados e maquiagem duradoura com técnicas à prova d'água e produtos importados.",
        bio: 'Mais de 10 anos realçando a beleza única de cada mulher para seus dias mais inesquecíveis.',
        rating_avg: 4.9,
        review_count: 27,
        reviews: [
          {
            clientName: 'Fernanda Lopes',
            rating: 5,
            comment:
              'A Patrícia fez minha make de noiva e ficou simplesmente perfeita até a última dança.',
          },
        ],
      },
      {
        email: 'aline.bemestar@conexaofeminina.com',
        name: 'Aline Moreira',
        phone: '(11) 97654-3210',
        city: 'São Paulo',
        state: 'SP',
        locations_served: 'Pinheiros, Vila Madalena e Perdizes - SP',
        plan: 'essencial',
        status: 'approved',
        verified: false,
        categorySlugs: ['bem-estar', 'autocuidado'],
        service_description:
          'Instrutora de Yoga Integrativa, meditação guiada e terapeuta de Reiki. Aulas particulares e em pequenos grupos para controle de ansiedade, estresse e alinhamento postural.',
        bio: 'Praticante dedicada há 7 anos com formação na Índia e em São Paulo, dedicada à saúde mental feminina.',
        rating_avg: 4.7,
        review_count: 12,
        reviews: [
          {
            clientName: 'Priscila Ramos',
            rating: 5,
            comment:
              'As práticas de respiração e yoga com a Aline trouxeram muita paz para a minha rotina caótica.',
          },
        ],
      },
      {
        email: 'gabriela.massoterapia@conexaofeminina.com',
        name: 'Gabriela Prado',
        phone: '(21) 98321-6547',
        city: 'Rio de Janeiro',
        state: 'RJ',
        locations_served: 'Copacabana, Ipanema e Botafogo - RJ',
        plan: 'essencial',
        status: 'approved',
        verified: false,
        categorySlugs: ['autocuidado', 'saude-e-estetica'],
        service_description:
          'Massoterapia ayurvédica, liberação miofascial e reflexologia podal. Atendimento domiciliar com maca portátil profissional, óleos vegetais puros e músicas relaxantes.',
        bio: 'Terapeuta corporal formada pelo Instituto Brasileiro de Terapias Holísticas com foco na saúde da mulher.',
        rating_avg: 4.6,
        review_count: 9,
        reviews: [
          {
            clientName: 'Talita Santos',
            rating: 5,
            comment:
              'A Gabriela é um anjo, mãos de fada! Aliviou todas as minhas tensões no pescoço.',
          },
        ],
      },
    ]

    for (const p of providerDefs) {
      let pUser
      try {
        pUser = app.findAuthRecordByEmail('_pb_users_auth_', p.email)
      } catch (_) {
        pUser = new Record(usersCol)
        pUser.setEmail(p.email)
        pUser.setPassword('Skip@Pass')
        pUser.setVerified(true)
        pUser.set('name', p.name)
        pUser.set('role', 'prestadora')
        pUser.set('phone', p.phone)
        pUser.set('city', p.city)
        pUser.set('state', p.state)
        pUser.set('bio', p.bio)
        pUser.set('plan', p.plan)
        pUser.set('status', p.status)
        pUser.set('verified', p.verified)
        const catIds = p.categorySlugs.map((s) => catMap[s]).filter(Boolean)
        pUser.set('categories', catIds)
        app.save(pUser)
      }

      // Provider record
      let provRecord
      try {
        provRecord = app.findFirstRecordByData('providers', 'user', pUser.id)
      } catch (_) {
        provRecord = new Record(provCol)
        provRecord.set('user', pUser.id)
        const catIds = p.categorySlugs.map((s) => catMap[s]).filter(Boolean)
        provRecord.set('categories', catIds)
        provRecord.set('service_description', p.service_description)
        provRecord.set('city', p.city)
        provRecord.set('state', p.state)
        provRecord.set('locations_served', p.locations_served)
        provRecord.set('rating_avg', p.rating_avg)
        provRecord.set('review_count', p.review_count)
        app.save(provRecord)

        // Seed sample reviews using ownerUser as client
        if (ownerUser && p.reviews) {
          for (const rev of p.reviews) {
            const revRec = new Record(revCol)
            revRec.set('client', ownerUser.id)
            revRec.set('provider', pUser.id)
            revRec.set('rating', rev.rating)
            revRec.set('comment', rev.comment)
            try {
              app.save(revRec)
            } catch (_) {}
          }
        }
      }
    }
  },
  (app) => {
    // down migration
  },
)
