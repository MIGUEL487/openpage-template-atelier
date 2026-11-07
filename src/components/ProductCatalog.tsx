'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { siteConfig } from '@/config/site';
import { Product } from '@/types';
import { Search } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(Flip);

    const handleCategoryEvent = (e: CustomEvent<string>) => {
      if (e.detail) {
        setSelectedCategory(e.detail);
      }
    };

    const handleSearchEvent = (e: CustomEvent<string>) => {
      if (typeof e.detail === 'string') {
        setSearchFilter(e.detail);
      }
    };

    window.addEventListener('precioza-filter-category' as any, handleCategoryEvent);
    window.addEventListener('precioza-filter-search' as any, handleSearchEvent);

    return () => {
      window.removeEventListener('precioza-filter-category' as any, handleCategoryEvent);
      window.removeEventListener('precioza-filter-search' as any, handleSearchEvent);
    };
  }, []);

  const catalogData = siteConfig.brandContent.catalog;
  const categories = siteConfig.brandContent.catalogCategories;
  const products = siteConfig.brandContent.products;

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'todos' || selectedCategory === 'all' || p.category === selectedCategory;

    const matchesSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (categoryKey: string) => {
    if (categoryKey === selectedCategory) return;

    const state = Flip.getState('.catalog-card');
    setSelectedCategory(categoryKey);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.02,
        absolute: false,
        onEnter: (elements: any) =>
          gsap.fromTo(
            elements,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          ),
      });
    });
  };

  return (
    <section
      id="catalogo"
      className="relative w-full py-24 md:py-32 bg-bg-raised border-b border-line text-ivory"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Cabeçalho do Catálogo */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-gold-light">
                {catalogData.kicker}
              </span>
              <span className="inline-block w-14 h-[1px] bg-gold-deep" />
            </div>
            <h2 className="font-serif font-light text-ivory text-[36px] sm:text-[44px] md:text-[52px] leading-[1.04] tracking-tight">
              {catalogData.title}
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-stone max-w-xl mt-3 leading-relaxed">
              {catalogData.description}
            </p>
          </div>

          {/* Campo de Busca no Catálogo */}
          <div className="relative w-full max-w-xs border-b border-line pb-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-stone stroke-[1.5]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar peça ou tecido..."
              className="w-full bg-transparent border-none text-xs text-ivory placeholder-stone focus:outline-none font-sans"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="text-stone hover:text-ivory text-xs px-1"
                aria-label="Limpar filtro"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Abas de Filtros de Texto com Sublinhado Dourado (Sem Pills) */}
        <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-14 pb-4 border-b border-line">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`relative py-2 text-[11px] uppercase tracking-[0.24em] font-sans transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-ivory font-medium' : 'text-stone hover:text-ivory'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-gold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Contagem */}
        <div className="text-[11px] font-sans uppercase tracking-[0.22em] text-stone mb-8">
          Exibindo {filteredProducts.length} de {products.length} modelos
        </div>

        {/* Grade de 4 Colunas de Cards Retos Sem Borda */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-stone font-sans text-sm">
            Nenhuma peça encontrada para os filtros selecionados.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="catalog-card flex flex-col group cursor-pointer"
              >
                {/* Imagem Proporção 3:4 com Cantos Retos */}
                <div className="relative w-full aspect-[3/4] bg-bg-soft overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    style={{ objectPosition: product.objectPosition || 'center 20%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Informações da Peça */}
                <div className="pt-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-ivory group-hover:text-gold transition-colors block line-clamp-1">
                      {product.name}
                    </span>
                    <span className="font-serif italic text-[14px] text-stone mt-1 block line-clamp-1">
                      {product.tagline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-line/60">
                    <span className="text-[12px] font-sans text-stone tracking-wide">
                      Consulte
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="btn-thread-dark !py-1 !px-3 text-[10px]"
                    >
                      <span>Ver Detalhes</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
