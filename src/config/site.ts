import { BrandId, BrandContent } from '@/types';
import { atelierBrand } from './brands/atelier';
import { preciozaBrand } from './brands/precioza';

// Seleção da marca ativa com suporte à variável de ambiente NEXT_PUBLIC_BRAND
// Valor padrão: 'precioza' (para a demonstração solicitada)
// Para voltar ao template genérico do ATELIER, basta alterar para 'atelier' ou definir NEXT_PUBLIC_BRAND=atelier
const activeBrandId: BrandId =
  (process.env.NEXT_PUBLIC_BRAND as BrandId) || 'precioza';

const brandMap: Record<BrandId, BrandContent> = {
  atelier: atelierBrand,
  precioza: preciozaBrand,
};

const currentBrandContent: BrandContent = brandMap[activeBrandId] || preciozaBrand;

export const siteConfig = {
  brand: activeBrandId,
  brandContent: currentBrandContent,

  name: currentBrandContent.name,
  fullName: `${currentBrandContent.name} — ${currentBrandContent.logo.submark}`,
  tagline: currentBrandContent.tagline,
  description: currentBrandContent.description,
  url: 'https://openpage-template-atelier.mi-c-openheimer.workers.dev',

  meta: {
    author: `${currentBrandContent.name} — OpenPage Showcase`,
    keywords: [
      currentBrandContent.name,
      'malharia de luxo',
      'tricô premium',
      'moda autoral',
      'monte sião',
      'tricot refinado',
    ],
    locale: 'pt_BR',
  },

  // Configuração central e segura do WhatsApp
  // Modo demonstração ATIVADO por padrão (Regra 5):
  // Nenhuma mensagem é disparada e o número nunca é acionado a menos que NEXT_PUBLIC_WHATSAPP_LIVE='true'
  whatsapp: {
    phoneNumber: '5511999999999', // Placeholder seguro padrão
    isDemo: true,
    defaultMessage: `Olá! Gostaria de consultar informações sobre a coleção e peças apresentadas no catálogo da ${currentBrandContent.name}.`,
    generateProductMessage: (
      productName: string,
      color: string,
      size: string,
      code?: string
    ) => {
      return `Olá! Tenho interesse no ${productName} (Cor: ${color}, Tamanho: ${size}${
        code ? `, Ref: ${code}` : ''
      }) visto no catálogo demonstrativo da ${currentBrandContent.name}.`;
    },
    generateBespokeMessage: (subject: string) => {
      return `Olá! Gostaria de tirar dúvidas com a equipe da ${currentBrandContent.name} sobre: ${subject}.`;
    },
  },

  navigation: [
    { label: 'Coleção', href: '#colecao' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'O Ateliê', href: '#atelie' },
    { label: 'Contato', href: '#contato' },
  ],

  contact: {
    address: 'Monte Sião, Minas Gerais — Capital Nacional do Tricô',
    hours: 'Segunda a Sábado, 9h às 18h',
    email: 'contato@preciozatricot.com.br',
  },

  social: {
    instagram: 'https://instagram.com/preciozatricot',
  },
};
