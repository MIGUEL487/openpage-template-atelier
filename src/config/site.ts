import { BrandId, BrandContent } from '@/types';
import { atelierBrand } from './brands/atelier';
import { preciozaBrand } from './brands/precioza';

// Seleção da marca ativa com suporte à variável de ambiente NEXT_PUBLIC_BRAND
// Valor padrão: 'precioza' (com kill switch seguro para 'atelier')
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
    author: `${currentBrandContent.name} · Monte Sião - MG`,
    keywords: [
      currentBrandContent.name,
      'malharia de luxo',
      'tricô premium',
      'moda autoral',
      'monte sião',
      'tricot refinado',
      'alta malharia',
      'vestidos tricot',
    ],
    locale: 'pt_BR',
  },

  // Configuração central e real do WhatsApp da loja (Regra 3 & 4)
  // Autorizado pela loja: número 5535992287718, isDemo: false
  whatsapp: {
    phoneNumber: '5535992287718',
    isDemo: false,
    defaultMessage: `Olá! Gostaria de consultar informações sobre as peças e coleções da ${currentBrandContent.name}.`,
    generateProductMessage: (
      productName: string,
      color: string,
      size: string,
      code?: string
    ) => {
      return `Olá! Tenho interesse no ${productName} (Cor: ${color}, Tamanho: ${size}${
        code ? `, Ref: ${code}` : ''
      }) apresentado no site da ${currentBrandContent.name}.`;
    },
    generateBespokeMessage: (subject: string) => {
      return `Olá! Gostaria de tirar dúvidas com a equipe da ${currentBrandContent.name} sobre: ${subject}.`;
    },
    getWhatsAppUrl: (message: string) => {
      return `https://wa.me/5535992287718?text=${encodeURIComponent(message)}`;
    },
  },

  navigation: [
    { label: 'Coleção', href: '#colecao' },
    { label: 'A Loja', href: '#loja' },
    { label: 'Destaques', href: '#destaques' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Contato', href: '#contato' },
  ],

  contact: {
    address: 'R. Juscelino Kubitscheck de Oliveira, 602, Centro, Monte Sião, MG, 37580-000',
    city: 'Monte Sião - MG',
    googleMapsUrl: 'https://maps.google.com/?q=R.+Juscelino+Kubitscheck+de+Oliveira,+602,+Centro,+Monte+Si%C3%A3o+-+MG,+37580-000',
    phone: '(35) 99228-7718',
  },

  social: {
    instagram: 'https://www.instagram.com/preciozastore/',
    instagramHandle: '@preciozastore',
  },
};
