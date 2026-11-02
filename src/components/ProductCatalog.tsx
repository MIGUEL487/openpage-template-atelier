'use client';

import { useState } from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import { Product, ProductCategory } from '@/types';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const categories: { key: ProductCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Todas as Peças' },
    { key: 'cashmere', label: 'Cashmere Puro' },
    { key: 'merino', label: 'Lã Merino' },
    { key: 'fibras-naturais', label: 'Fibras Botânicas' },
    { key: 'estruturados', label: 'Estruturados & Casacos' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="catalogo"
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-bg border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-3 block">
              Catálogo de Peças · Ateliê
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight">
              A coleção completa de malharia.
            </h2>
            <p className="font-sans text-sm sm:text-base text-atelier-stone max-w-xl mt-3 leading-relaxed">
              Consulte detalhes de fiação, calibres e solicite atendimento personalizado diretamente com
              nossos tecelões através do WhatsApp.
            </p>
          </div>

          <div className="text-xs font-sans text-atelier-stone uppercase tracking-widest flex items-center space-x-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Exibindo {filteredProducts.length} de {products.length} criações</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-14 pb-4 border-b border-atelier-border/60">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all duration-200 ${
                  isActive
                    ? 'bg-atelier-noir text-atelier-bg shadow-sm font-medium'
                    : 'bg-atelier-ecru hover:bg-atelier-sand/30 text-atelier-noir border border-atelier-border/80'
                }`}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer flex flex-col justify-between rounded-xl overflow-hidden bg-atelier-ecru/40 border border-atelier-border/60 hover:border-atelier-stone hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image Frame */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-atelier-sand/15">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-editorial filter contrast-[1.02]"
                />
                <div className="absolute top-3 left-3 bg-atelier-bg/95 backdrop-blur-sm text-atelier-noir text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
                  {product.categoryLabel}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3 className="font-serif text-lg text-atelier-noir group-hover:text-atelier-stone transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-sans text-sm font-medium text-atelier-noir/90">
                      {product.formattedPrice}
                    </span>
                  </div>
                  <p className="text-xs text-atelier-stone line-clamp-2 leading-relaxed mb-4">
                    {product.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-atelier-border/50 flex items-center justify-between text-xs">
                  {/* Color dots preview */}
                  <div className="flex items-center space-x-1.5">
                    {product.colors.map((color, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                    <span className="text-[10px] text-atelier-stone ml-1">
                      {product.colors.length} cores
                    </span>
                  </div>

                  <span className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider text-atelier-noir font-medium group-hover:underline">
                    <span>Ver Detalhes</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
