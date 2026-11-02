export const siteConfig = {
  name: 'ATELIER',
  fullName: 'ATELIER — Malharia Contemporânea',
  tagline: 'A geometria do fio e o tempo da malha.',
  description:
    'Template demonstrativo da OpenPage para malharias e ateliês de tricô de alto padrão. Peças em cashmere mongol, lã merino cardada e fibras botânicas.',
  url: 'https://openpage-atelier.pages.dev',
  
  // Configuração central e única do WhatsApp
  // Se vazio ou placeholder, o sistema ativa o modo demonstração elegante
  whatsapp: {
    phoneNumber: '5511999999999', // Altere aqui para o número oficial do seu ateliê
    isDemo: true, // Mantém aviso visual discreto de que é um template demonstrativo
    defaultMessage: 'Olá! Gostaria de conhecer o catálogo da ATELIER e consultar a disponibilidade das peças da nova coleção.',
    generateProductMessage: (productName: string, color: string, size: string, code?: string) => {
      return `Olá! Gostaria de consultar a disponibilidade do ${productName} (Cor: ${color}, Tamanho: ${size}${code ? `, Ref: ${code}` : ''}) apresentado no catálogo ATELIER.`;
    },
    generateBespokeMessage: (subject: string) => {
      return `Olá! Tenho interesse no atendimento sob medida da ATELIER a respeito de: ${subject}.`;
    },
  },

  navigation: [
    { label: 'Coleção', href: '#colecao' },
    { label: 'O Tecido 3D', href: '#tecido-3d' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'O Ateliê', href: '#atelie' },
  ],

  meta: {
    author: 'OpenPage & MIGUEL487',
    locale: 'pt_BR',
    keywords: [
      'malharia contemporanea',
      'trico premium',
      'cashmere',
      'la merino',
      'moda autoral',
      'quiet luxury',
      'openpage template',
      'atelie de trico'
    ],
  },
};
