export type BrandId = 'atelier' | 'precioza';

export type ProductCategory =
  | 'cashmere'
  | 'merino'
  | 'fibras-naturais'
  | 'estruturados'
  | 'vestidos'
  | 'conjuntos-macacoes'
  | 'trico-croche'
  | 'acessorios';

export type ProductSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'U';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface BrandImageRef {
  src: string;
  alt: string;
  objectPosition?: string;
  needsOriginal?: boolean;
  maxDisplayWidth?: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  formattedPrice: string;
  tagline: string;
  description: string;
  details: string[];
  composition: string;
  gauge: string;
  image: string;
  availableSizes: ProductSize[];
  colors: ProductColor[];
  featured?: boolean;
  needsOriginal?: boolean;
  objectPosition?: string;
  maxDisplayWidth?: number;
}

export interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  yarn: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square';
  quote: string;
  needsOriginal?: boolean;
  objectPosition?: string;
  maxDisplayWidth?: number;
}

export interface BrandContent {
  brandId: BrandId;
  name: string;
  legalNotice: string;
  isConceptDemo: boolean;
  tagline: string;
  description: string;
  logo: {
    avatarUrl?: string;
    scriptUrl?: string;
    wordmark: string;
    submark: string;
  };
  contact: {
    address?: string;
    city?: string;
    instagramUrl?: string;
    linktreeUrl?: string;
    displayedPhone?: string;
  };
  hero: {
    kicker: string;
    headlineLine1: string;
    headlineLine2: string;
    description: string;
    captionTitle: string;
    captionSubtitle: string;
    bottomBarLeft: string;
    bottomBarRight: string;
    image: BrandImageRef;
    mosaicImages?: BrandImageRef[];
    marqueeText?: string;
  };
  manifesto: {
    kicker: string;
    headline: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    imageCaption: string;
    imageSubcaption: string;
    image: BrandImageRef;
    overlayImage?: BrandImageRef;
  };
  collectionStory: {
    kicker: string;
    title: string;
    subtitle: string;
    stats: { value: string; label: string; sublabel: string }[];
  };
  fabricData: {
    kicker: string;
    title: string;
    description: string;
    cards: { title: string; description: string }[];
    textureImages?: BrandImageRef[];
  };
  lookbook: {
    kicker: string;
    title: string;
    description: string;
  };
  lookbookItems: LookbookItem[];
  catalog: {
    kicker: string;
    title: string;
    description: string;
  };
  catalogCategories: { key: string; label: string }[];
  products: Product[];
  story: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    highlightTitle: string;
    highlightDescription: string;
    image: BrandImageRef;
    storeImages?: BrandImageRef[];
    storeDetails?: {
      address: string;
      hoursNotice: string;
      consultationNotice: string;
    };
  };
  careRitual: {
    title: string;
    subtitle: string;
    steps: { step: string; title: string; description: string }[];
  };
}
