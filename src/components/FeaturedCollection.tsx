'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collectionStory } from '@/data/editorial';
import { products } from '@/data/products';
import { Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedCollectionProps {
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedCollection({ onSelectProduct }: FeaturedCollectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.from(Array.from(cards), {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="colecao"
      ref={sectionRef}
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-bg border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header da Coleção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-atelier-border/60 gap-8">
          <div>
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-2 block">
              {collectionStory.kicker}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight">
              {collectionStory.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-atelier-stone max-w-xl mt-3 leading-relaxed">
              {collectionStory.subtitle}
            </p>
          </div>

          <a
            href="#catalogo"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-atelier-noir hover:text-atelier-stone transition-colors group"
          >
            <span>Ver Catálogo Completo ({products.length} Peças)</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Estatísticas e Critérios de Fiação */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 py-8 px-6 bg-atelier-ecru rounded-2xl border border-atelier-border/40">
          {collectionStory.stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl text-atelier-noir block">
                {stat.value}
              </span>
              <span className="font-sans text-xs text-atelier-stone leading-snug block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Grid Assimétrico de Peças em Destaque */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer flex flex-col justify-between rounded-xl overflow-hidden bg-atelier-ecru/50 border border-atelier-border/40 hover:border-atelier-stone/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-atelier-sand/10">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-editorial filter contrast-[1.02]"
                />
                <div className="absolute top-3 left-3 bg-atelier-bg/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] uppercase tracking-widest text-atelier-noir font-sans">
                  {product.categoryLabel}
                </div>
              </div>

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

                <div className="pt-3 border-t border-atelier-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    {product.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-black/15"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-[10px] text-atelier-stone/80 ml-1">
                      {product.colors.length} cores
                    </span>
                  </div>

                  <span className="text-atelier-noir group-hover:underline inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider font-medium">
                    <span>Consultar</span>
                    <ArrowUpRight className="w-3 h-3" />
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
