export type ProductCategory = 'cashmere' | 'merino' | 'fibras-naturais' | 'estruturados';

export interface ProductColor {
  name: string;
  hex: string;
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
  availableSizes: ('PP' | 'P' | 'M' | 'G' | 'GG')[];
  colors: ProductColor[];
  featured?: boolean;
}

export interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  yarn: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square';
  quote: string;
}
