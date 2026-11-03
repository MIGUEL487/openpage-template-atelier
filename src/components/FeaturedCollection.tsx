'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';
import { Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedCollectionProps {
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedCollection({ onSelectProduct }: FeaturedCollectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const collectionStory = siteConfig.brandContent.collectionStory;
  const products = siteConfig.brandContent.products;
  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          Array.from(cards),
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="colecao"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-bg border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header da Coleção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-atelier-border/60 gap-8">
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

        {/* Estatísticas e Critérios de Fiação / Produção */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-8 px-6 bg-atelier-ecru rounded-2xl border border-atelier-border/40">
          {collectionStory.stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl text-atelier-noir block">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-atelier-stone font-sans block">
                {stat.label}
              </span>
              <span className="text-[10px] text-atelier-stone/70 font-sans block">
                {stat.sublabel}
              </span>
            </div>
          ))}
        </div>

        {/* Featured Products Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer flex flex-col justify-between rounded-2xl overflow-hidden bg-atelier-ecru/30 border border-atelier-border/60 hover:border-atelier-stone hover:shadow-xl transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-atelier-sand/15">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-editorial filter contrast-[1.02]"
                  style={{ objectPosition: product.objectPosition || 'center' }}
                />
                <div className="absolute top-3 left-3 bg-atelier-bg/90 backdrop-blur-sm text-atelier-noir text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
                  {product.categoryLabel}
                </div>
                {product.needsOriginal && (
                  <div className="absolute top-3 right-3 bg-atelier-noir/70 text-atelier-bg text-[9px] px-2 py-0.5 rounded">
                    Demo
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-atelier-stone block mb-1">
                    {product.tagline}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-atelier-noir group-hover:text-atelier-stone transition-colors mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-atelier-stone/90 line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-atelier-border/50 text-xs font-sans">
                  <span className="font-medium text-atelier-noir text-sm">
                    {product.formattedPrice}
                  </span>
                  <span className="text-atelier-stone flex items-center group-hover:text-atelier-noir transition-colors">
                    <span>Consultar</span>
                    <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
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
