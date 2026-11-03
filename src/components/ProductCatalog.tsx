'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { siteConfig } from '@/config/site';
import { Product } from '@/types';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(Flip);
  }, []);

  const catalogData = siteConfig.brandContent.catalog;
  const categories = siteConfig.brandContent.catalogCategories;
  const products = siteConfig.brandContent.products;

  const filteredProducts =
    selectedCategory === 'todos' || selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleCategoryChange = (categoryKey: string) => {
    if (categoryKey === selectedCategory) return;

    // Captura o estado dos cards antes da atualização do DOM com Flip (Seção 5.3 item 7)
    const state = Flip.getState('.catalog-card');
    setSelectedCategory(categoryKey);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.03,
        absolute: false,
        onEnter: (elements: any) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
          ),
      });
    });
  };

  return (
    <section
      id="catalogo"
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-bg-raised border-b border-line overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium mb-3">
              <span className="w-8 h-[1px] bg-gold" />
              <span>{catalogData.kicker}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-ivory tracking-tight">
              {catalogData.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-stone max-w-xl mt-3 leading-relaxed font-light">
              {catalogData.description}
            </p>
          </div>

          <div className="text-xs font-sans text-gold-deep uppercase tracking-widest flex items-center space-x-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
            <span>Exibindo {filteredProducts.length} de {products.length} peças</span>
          </div>
        </div>

        {/* Filter Pills com Flip (Seção 5.3 item 7) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12 pb-4 border-b border-line">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all duration-200 ${
                  isActive
                    ? 'bg-gold text-bg-base font-semibold shadow-md'
                    : 'bg-bg-soft text-stone hover:text-ivory border border-line hover:border-gold/40'
                }`}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="catalog-card group cursor-pointer flex flex-col justify-between p-4 bg-bg-base rounded-xl border border-line hover:border-gold/60 transition-all duration-300 shadow-xl"
            >
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-bg-soft mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] filter contrast-[1.03] saturate-[0.96]"
                  style={{ objectPosition: product.objectPosition || 'center 20%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 bg-bg-base/80 backdrop-blur-md text-gold-light border border-line rounded">
                  {product.categoryLabel}
                </div>

                <div className="absolute top-3 right-3 text-[10px] tracking-wider px-2 py-1 bg-bg-base/80 text-stone border border-line rounded">
                  {product.formattedPrice}
                </div>
              </div>

              <div className="flex flex-col space-y-2 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-ivory group-hover:text-gold-light transition-colors">
                    {product.name}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-stone group-hover:text-gold transition-colors" />
                </div>
                <p className="text-xs text-stone font-sans line-clamp-2 font-light">
                  {product.tagline}
                </p>

                <div className="h-[1px] w-full bg-line group-hover:bg-gold/60 transition-colors mt-2" />
                <div className="flex items-center justify-between text-[11px] text-gold-deep pt-1">
                  <span>{product.gauge}</span>
                  <span className="text-stone uppercase text-[10px] tracking-widest">Ver Detalhes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
