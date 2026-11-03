import { BrandContent } from '@/types';

export const preciozaBrand: BrandContent = {
  brandId: 'precioza',
  name: 'PRECIOZA',
  legalNotice:
    'Proposta conceitual não oficial, criada pela OpenPage como estudo de design e experiência digital. Sem vínculo formal com a Precioza Tricot.',
  isConceptDemo: true,
  tagline: 'Moda feminina contemporânea e a arte do tricô em Monte Sião.',
  description:
    'Proposta conceitual não oficial desenvolvida pela OpenPage para a Precioza Tricot (Monte Sião, MG). Vestidos fluidos, conjuntos, macacões e detalhes autorais em tricô e crochê.',
  logo: {
    avatarUrl: '/brands/precioza/processed/logo-avatar.webp',
    wordmark: 'PRECIOZA',
    submark: 'Tricot & Moda Feminina · Monte Sião',
  },
  contact: {
    address: 'R. Juscelino Kubitscheck de Oliveira, 602 · Centro',
    city: 'Monte Sião · Minas Gerais',
    instagramUrl: 'https://www.instagram.com/preciozastore/',
    linktreeUrl: 'https://linktr.ee/preciozastore',
    displayedPhone: '(35) 99228-7718', // Apenas informativo no rodapé; não dispara wa.me automático
  },
  hero: {
    kicker: 'Proposta Conceitual · Monte Sião, MG',
    headlineLine1: 'Roupas que expressam',
    headlineLine2: 'presença e feminilidade.',
    description:
      'Uma experiência digital inspirada na atmosfera acolhedora da boutique em Monte Sião: vestidos de caimento impecável, conjuntos versáteis e a assinatura artesanal do tricô e crochê.',
    captionTitle: 'Vestido Longo em Tonalidade Creme',
    captionSubtitle: 'Cinto Estruturado · Imagem Referencial',
    bottomBarLeft: 'Boutique Física · Monte Sião, MG',
    bottomBarRight: 'Canal de Consulta Online via Atendimento',
    image: {
      src: '/brands/precioza/processed/cream-dress-model.webp',
      alt: 'Modelo vestindo vestido longo em tom creme com cinto estruturado',
      objectPosition: 'center 20%',
      needsOriginal: true,
      maxDisplayWidth: 297,
    },
  },
  manifesto: {
    kicker: 'Identidade & Atmosfera',
    headline: 'O encanto de Monte Sião que acompanha você de volta para casa.',
    paragraph1:
      'Para quem passeia pelas ruas históricas de Monte Sião, a visita à Precioza revela mais do que peças bem cortadas: reflete o carinho de uma boutique acolhedora, onde cada arara harmoniza cores quentes, iluminação cênica e tecidos pensados para valorizar a mulher.',
    paragraph2:
      'Esta proposta conceitual foi desenhada para encurtar as distâncias: permitir que a cliente que se apaixonou pela loja durante a viagem continue consultando novidades, lançamentos e compondo seus looks favoritos com atendimento atencioso pelo WhatsApp.',
    quote:
      'A elegância de peças pensadas para momentos reais, unindo a versatilidade de vestidos fluidos à nobreza do tricô.',
    imageCaption: 'Boutique Precioza · Monte Sião',
    imageSubcaption: 'Vitrine física e acolhimento presencial',
    image: {
      src: '/brands/precioza/processed/store-entrance.webp',
      alt: 'Fachada e vitrine da loja física Precioza com letreiro dourado em Monte Sião',
      objectPosition: 'center',
      needsOriginal: true,
      maxDisplayWidth: 297,
    },
  },
  collectionStory: {
    kicker: 'Destaques da Temporada',
    title: 'Silhuetas & Presença',
    subtitle:
      'Vestidos longos, conjuntos e peças coordenadas selecionadas para transitar com naturalidade do almoço ao ar livre aos encontros especiais.',
    stats: [
      { value: 'Monte Sião', label: 'Origem', sublabel: 'Polo tradicional de malharia' },
      { value: 'Fluidos', label: 'Modelagens', sublabel: 'Caimento suave e feminino' },
      { value: 'Tricô & Fios', label: 'Texturas', sublabel: 'Detalhes em pontos e crochê' },
      { value: 'Online', label: 'Consultoria', sublabel: 'Atendimento direto com a loja' },
    ],
  },
  fabricData: {
    kicker: 'Texturas & Acabamentos',
    title: 'A Arte da Trama & do Caimento',
    description:
      'Combinando a leveza dos tecidos planos com a textura calorosa do tricô e do crochê característicos do sul de Minas.',
    cards: [
      {
        title: 'Fluidez & Movimento',
        description:
          'Tecidos leves com drapeado natural que acompanham os passos com leveza e frescor.',
      },
      {
        title: 'Pontos & Crochê Artesanal',
        description:
          'Golas, barrados e detalhes manuais que trazem a assinatura afetiva da malharia mineira.',
      },
      {
        title: 'Versatilidade de Propostas',
        description:
          'Peças projetadas para se desdobrarem em múltiplas combinações, do salto à rasteira.',
      },
      {
        title: 'Cartela Quente & Harmônica',
        description:
          'Tons solares, marfins, azuis serenos e estampas florais desenhadas com delicadeza.',
      },
    ],
  },
  lookbook: {
    kicker: 'Caderno de Estilo · Proposta Visual',
    title: 'Composições que inspiram a rotina.',
    description:
      'Seleção de fotografias da loja demonstrando caimentos reais, estampas envolventes e a sofisticação despretensiosa das peças em movimento.',
  },
  lookbookItems: [
    {
      id: 'look-precioza-1',
      title: 'Vestido Longo Aquarelado em Tons Florais',
      subtitle: 'Fluidez Romântica',
      yarn: 'Tecido Fluido com Estampa Exclusiva',
      image: '/brands/precioza/processed/pink-dress-model.webp',
      aspect: 'portrait',
      quote: 'Cores suaves e estampa delicada para momentos que pedem leveza e celebração.',
      needsOriginal: true,
      objectPosition: 'center 20%',
    },
    {
      id: 'look-precioza-2',
      title: 'Detalhe em Crochê e Tricô Texturizado',
      subtitle: 'Toque Manual Autoral',
      yarn: 'Pontos Abertos em Fio Nobre',
      image: '/brands/precioza/processed/crochet-dress-detail.webp',
      aspect: 'landscape',
      quote: 'A riqueza dos relevos feitos no tear resgata o valor do ofício artesanal.',
      needsOriginal: true,
      objectPosition: 'center 30%',
    },
    {
      id: 'look-precioza-3',
      title: 'Vestido Longo em Nuances de Azul e Marfim',
      subtitle: 'Elegância Botânica',
      yarn: 'Caimento Amplo com Cintura Marcada',
      image: '/brands/precioza/processed/blue-pattern-model.webp',
      aspect: 'portrait',
      quote: 'Padronagem orgânica que ilumina a silhueta com frescor contemporâneo.',
      needsOriginal: true,
      objectPosition: 'center 15%',
    },
    {
      id: 'look-precioza-4',
      title: 'Macacão Pantalona em Azul Marinho',
      subtitle: 'Alfaiataria Descontraída',
      yarn: 'Linha Estruturada com Faixa',
      image: '/brands/precioza/processed/navy-jumpsuit-model.webp',
      aspect: 'portrait',
      quote: 'Praticidade sofisticada em uma única peça de corte reto e alongado.',
      needsOriginal: true,
      objectPosition: 'center 20%',
    },
  ],
  catalog: {
    kicker: 'Vitrine Demonstrativa · Catálogo',
    title: 'Peças em destaque da coleção.',
    description:
      'Navegue pelos modelos demonstrativos identificados nas araras. Medidas, tabela de cores, estoque real e valores oficiais devem ser confirmados diretamente com a equipe da Precioza.',
  },
  catalogCategories: [
    { key: 'all', label: 'Todas as Peças' },
    { key: 'vestidos', label: 'Vestidos' },
    { key: 'conjuntos-macacoes', label: 'Conjuntos & Macacões' },
    { key: 'trico-croche', label: 'Tricô & Crochê' },
    { key: 'acessorios', label: 'Acessórios & Detalhes' },
  ],
  products: [
    {
      id: 'PRZ-01',
      name: 'Vestido Longo Creme com Cinto',
      category: 'vestidos',
      categoryLabel: 'Vestidos',
      price: 0,
      formattedPrice: 'Sob consulta',
      tagline: 'Corte Evasê · Cintura Estruturada',
      description:
        'Vestido longo em tom creme com decote refinado, saia fluida e cinto combinando para valorizar a cintura com discrição.',
      details: [
        'Comprimento longo com barra ampla',
        'Acompanha cinto revestido no mesmo tecido',
        'Valores, cores e medidas: a confirmar diretamente com a loja física',
      ],
      composition: 'Composição a confirmar com a loja',
      gauge: 'Tecelagem fluida com toque macio',
      image: '/brands/precioza/processed/cream-dress-model.webp',
      availableSizes: ['P', 'M', 'G', 'U'],
      colors: [
        { name: 'Creme Marfim', hex: '#F6F3ED' },
        { name: 'Areia Suave', hex: '#D9C8B3' },
      ],
      featured: true,
      needsOriginal: true,
      objectPosition: 'center 20%',
    },
    {
      id: 'PRZ-02',
      name: 'Vestido Longo Estampado Rosa Floral',
      category: 'vestidos',
      categoryLabel: 'Vestidos',
      price: 0,
      formattedPrice: 'Sob consulta',
      tagline: 'Estampa Romântica · Movimento Leve',
      description:
        'Modelo longo estampado com nuances de rosa, coral e off-white. Ideal para dias ensolarados e eventos elegantes.',
      details: [
        'Decote feminino e alças confortáveis',
        'Estampa com transição suave de cores',
        'Disponibilidade de grade a consultar',
      ],
      composition: 'Tecido leve e respirável (consultar composição exata com a loja)',
      gauge: 'Caimento fluido de verão',
      image: '/brands/precioza/processed/pink-dress-model.webp',
      availableSizes: ['P', 'M', 'G', 'U'],
      colors: [
        { name: 'Rosa Floral', hex: '#E2B4B2' },
        { name: 'Off-White', hex: '#FAF8F5' },
      ],
      featured: true,
      needsOriginal: true,
      objectPosition: 'center 20%',
    },
    {
      id: 'PRZ-03',
      name: 'Macacão Pantalona Azul Marinho',
      category: 'conjuntos-macacoes',
      categoryLabel: 'Conjuntos & Macacões',
      price: 0,
      formattedPrice: 'Sob consulta',
      tagline: 'Alfaiataria Feminina · Corte Reto',
      description:
        'Macacão com pernas amplas estilo pantalona, amarração na cintura e decote estruturado que alonga a postura.',
      details: [
        'Fechamento discreto nas costas',
        'Faixa do próprio tecido para amarração frontal ou lateral',
        'Peça versátil para dia e noite',
      ],
      composition: 'Tecido encorpado com caimento reto (consultar etiqueta com a loja)',
      gauge: 'Toque firme com elastano sutil',
      image: '/brands/precioza/processed/navy-jumpsuit-model.webp',
      availableSizes: ['P', 'M', 'G'],
      colors: [
        { name: 'Azul Marinho', hex: '#1C2738' },
        { name: 'Preto Clássico', hex: '#20201E' },
      ],
      featured: true,
      needsOriginal: true,
      objectPosition: 'center 20%',
    },
    {
      id: 'PRZ-04',
      name: 'Vestido Longo com Estampa Botânica Azul',
      category: 'vestidos',
      categoryLabel: 'Vestidos',
      price: 0,
      formattedPrice: 'Sob consulta',
      tagline: 'Padronagem Botânica · Verão',
      description:
        'Estampa azul e branca com folhagens expressivas sobre fundo claro. Caimento fresco para composições de passeio ou festa.',
      details: [
        'Modelagem evasê confortável',
        'Busto com recorte ajustado',
        'Consultar tabela de medidas via WhatsApp da loja',
      ],
      composition: 'Composição têxtil a confirmar',
      gauge: 'Trama arejada',
      image: '/brands/precioza/processed/blue-pattern-model.webp',
      availableSizes: ['P', 'M', 'G', 'U'],
      colors: [
        { name: 'Azul Botânico', hex: '#3B5E8C' },
        { name: 'Branco Névoa', hex: '#FAF8F5' },
      ],
      featured: false,
      needsOriginal: true,
      objectPosition: 'center 15%',
    },
    {
      id: 'PRZ-05',
      name: 'Detalhe em Tricô & Crochê Artesanal',
      category: 'trico-croche',
      categoryLabel: 'Tricô & Crochê',
      price: 0,
      formattedPrice: 'Sob consulta',
      tagline: 'Trabalho Manual · Tradição de Monte Sião',
      description:
        'Peça com pontos abertos trabalhados manualmente, expressando o legado do tricô artesanal da serra mineira.',
      details: [
        'Pontos em relevo e detalhes vazados',
        'Toque caloroso e acolhedor',
        'Disponibilidade de modelos em crochê a confirmar com as vendedoras',
      ],
      composition: 'Fios nobres de malharia (a confirmar)',
      gauge: 'Ponto médio vazado',
      image: '/brands/precioza/processed/crochet-dress-detail.webp',
      availableSizes: ['P', 'M', 'G', 'U'],
      colors: [
        { name: 'Marfim Cru', hex: '#F3EFE6' },
        { name: 'Dourado Champanhe', hex: '#B8975A' },
      ],
      featured: false,
      needsOriginal: true,
      objectPosition: 'center 30%',
    },
    {
      id: 'PRZ-06',
      name: 'Conjunto Listrado Casual em Tons Claros',
      category: 'conjuntos-macacoes',
      categoryLabel: 'Conjuntos & Macacões',
      price: 0,
      formattedPrice: 'Sob consulta',
      tagline: 'Coordenação Náutica Suave',
      description:
        'Conjunto com calça reta e parte superior coordenada com listras discretas, ideal para um visual elegante sem esforço.',
      details: [
        'Listras verticais que alongam a silhueta',
        'Cós com ajuste confortável',
        'Vendido junto ou separado (confirmar política com a loja)',
      ],
      composition: 'Linho misto com viscose (a confirmar com a loja)',
      gauge: 'Textura rústica suave',
      image: '/brands/precioza/processed/striped-outfit-model.webp',
      availableSizes: ['P', 'M', 'G'],
      colors: [
        { name: 'Areia Listrado', hex: '#D9C8B3' },
        { name: 'Azul Névoa', hex: '#A8BAC8' },
      ],
      featured: false,
      needsOriginal: true,
      objectPosition: 'center 20%',
    },
  ],
  story: {
    badge: 'A Experiência da Boutique · Monte Sião',
    title: 'O carinho do atendimento mineiro no coração do tricô.',
    paragraph1:
      'Localizada na tradicional Rua Juscelino Kubitscheck de Oliveira, no centro de Monte Sião, a loja física da Precioza destaca-se pela vitrine elegante com letreiro dourado e um ambiente interno quente, com araras organizadas por cartelas harmônicas.',
    paragraph2:
      'Quem visita a loja encontra muito mais que araras cheias: encontra uma conversa atenciosa, dicas sinceras sobre caimento e a satisfação de levar peças que valorizam a beleza de cada mulher. Esta proposta digital visa transportar esse mesmo calor para a tela.',
    highlightTitle: 'Visite a Loja em Monte Sião',
    highlightDescription:
      'R. Juscelino Kubitscheck de Oliveira, 602 · Centro · Monte Sião, MG. Horários de funcionamento e agendamentos devem ser conferidos nos canais oficiais da marca.',
    image: {
      src: '/brands/precioza/processed/model-shopping-bags.webp',
      alt: 'Cliente segurando sacolas personalizadas no interior aconchegante da boutique',
      objectPosition: 'center 25%',
      needsOriginal: true,
      maxDisplayWidth: 297,
    },
    storeDetails: {
      address: 'R. Juscelino Kubitscheck de Oliveira, 602 · Centro · Monte Sião, MG · CEP 37580-000',
      hoursNotice: 'Consulte os horários oficiais diretamente no perfil @preciozastore no Instagram.',
      consultationNotice:
        'Aviso: este site é uma demonstração conceitual da OpenPage. Para compras reais, contate os canais oficiais da Precioza Tricot.',
    },
  },
  careRitual: {
    title: 'Cuidado & Durabilidade',
    subtitle: 'Preserve suas peças em tricô e tecidos delicados.',
    steps: [
      {
        step: '01',
        title: 'Lavagem com Carinho',
        description:
          'Para peças em tricô ou crochê, prefira lavagem manual com água em temperatura ambiente e sabão neutro líquido.',
      },
      {
        step: '02',
        title: 'Evite Torcer',
        description:
          'Pressione a peça suavemente entre as mãos ou com o auxílio de uma toalha macia para retirar o excesso de água.',
      },
      {
        step: '03',
        title: 'Secagem à Sombra',
        description:
          'Deixe secar na horizontal para preservar o peso e a modelagem original das tramas sem esticar os pontos.',
      },
      {
        step: '04',
        title: 'Como Guardar',
        description:
          'Peças de malharia e tricô devem ser guardadas dobradas em gavetas ou prateleiras, nunca penduradas em cabides finos.',
      },
    ],
  },
};
