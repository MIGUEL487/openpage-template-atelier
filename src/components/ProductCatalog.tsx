'use client';

import { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Product, ProductCategory } from '@/types';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const catalogData = siteConfig.brandContent.catalog;
  const categories = siteConfig.brandContent.catalogCategories;
  const products = siteConfig.brandContent.products;

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="catalogo"
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-3 block">
              {catalogData.kicker}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight">
              {catalogData.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-atelier-stone max-w-xl mt-3 leading-relaxed font-light">
              {catalogData.description}
            </p>
          </div>

          <div className="text-xs font-sans text-atelier-stone uppercase tracking-widest flex items-center space-x-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Exibindo {filteredProducts.length} de {products.length} peças</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12 pb-4 border-b border-atelier-border/60">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all duration-200 ${
                  isActive
                    ? 'bg-atelier-noir text-atelier-bg shadow-sm font-medium'
                    : 'bg-atelier-bg hover:bg-atelier-sand/30 text-atelier-noir border border-atelier-border/80'
                }`}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer flex flex-col justify-between rounded-2xl overflow-hidden bg-atelier-bg border border-atelier-border/70 hover:border-atelier-stone hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image Frame */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-atelier-sand/15">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-editorial filter contrast-[1.02]"
                  style={{ objectPosition: product.objectPosition || 'center' }}
                />
                <div className="absolute top-3 left-3 bg-atelier-bg/95 backdrop-blur-sm text-atelier-noir text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
                  {product.categoryLabel}
                </div>
                {product.needsOriginal && (
                  <div className="absolute top-3 right-3 bg-atelier-noir/70 text-atelier-bg text-[9px] px-2 py-0.5 rounded">
                    Demo
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-atelier-stone font-sans block mb-1">
                    {product.tagline}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-atelier-noir group-hover:text-atelier-stone transition-colors mb-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-atelier-stone/85 line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-atelier-border/60 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="font-medium text-atelier-noir text-sm block">
                      {product.formattedPrice}
                    </span>
                    {product.formattedPrice.includes('confirmar') && (
                      <span className="text-[10px] text-atelier-stone uppercase tracking-wider block">
                        Sob consulta
                      </span>
                    )}
                  </div>
                  <span className="text-atelier-stone group-hover:text-atelier-noir flex items-center transition-colors">
                    <span>Detalhes</span>
                    <ArrowUpRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
