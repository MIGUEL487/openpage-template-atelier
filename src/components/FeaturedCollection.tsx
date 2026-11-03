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
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const collectionStory = siteConfig.brandContent.collectionStory;
  const products = siteConfig.brandContent.products;
  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Desktop (>= 1024px): Seção com PIN e Rolagem Horizontal dos Cards (Seção 5.3 item 4)
      mm.add('(min-width: 1024px)', () => {
        const track = horizontalTrackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const totalScroll = track.scrollWidth - window.innerWidth + 120;

        gsap.to(track, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            start: 'top top',
            end: () => `+=${Math.max(totalScroll, 1200)}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      });

      // 2. Mobile e Tablet (< 1024px): Grade Vertical com Entrada Suave
      mm.add('(max-width: 1023px)', () => {
        const cards = trackChildren();
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const trackChildren = () => {
    return horizontalTrackRef.current?.querySelectorAll('.product-card');
  };

  return (
    <section
      id="colecao"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-24 px-6 lg:px-12 bg-bg-base border-b border-line overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-10">
        {/* Header da Coleção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-line gap-6">
          <div>
            <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium mb-3">
              <span className="w-8 h-[1px] bg-gold" />
              <span>{collectionStory.kicker}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-ivory tracking-tight">
              {collectionStory.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-stone max-w-xl mt-3 leading-relaxed">
              {collectionStory.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-3">
            <a
              href="#catalogo"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors group"
            >
              <span>Ver Catálogo Completo ({products.length} Peças)</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Barra de Progresso do Pin Horizontal (Desktop) */}
            <div className="hidden lg:block w-48 h-[2px] bg-line overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gold w-full origin-left scale-x-0 transition-transform duration-75 ease-out"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pista Horizontal dos Cards (Desktop) / Grade Vertical (Mobile) */}
      <div className="w-full overflow-visible">
        <div
          ref={horizontalTrackRef}
          className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0 w-full lg:w-max will-change-transform max-w-7xl mx-auto lg:max-w-none"
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="product-card group cursor-pointer w-full lg:w-[380px] flex-shrink-0 flex flex-col justify-between p-4 bg-bg-raised rounded-xl border border-line hover:border-gold/60 transition-all duration-300 shadow-xl"
            >
              {/* Moldura da Imagem */}
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-bg-soft mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] filter contrast-[1.03] saturate-[0.96]"
                  style={{ objectPosition: product.objectPosition || 'center 20%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Badge Dourada de Categoria */}
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 bg-bg-base/80 backdrop-blur-md text-gold-light border border-line rounded">
                  {product.categoryLabel}
                </span>

                {/* Status Sob Consulta */}
                <span className="absolute top-3 right-3 text-[10px] tracking-wider px-2 py-1 bg-bg-base/80 text-stone border border-line rounded">
                  {product.formattedPrice}
                </span>
              </div>

              {/* Informações da Peça */}
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

                {/* Linha Fina de Destaque no Hover */}
                <div className="h-[1px] w-full bg-line group-hover:bg-gold/60 transition-colors mt-2" />
                <div className="flex items-center justify-between text-[11px] text-gold-deep pt-1">
                  <span>{product.gauge}</span>
                  <span className="text-stone uppercase text-[10px] tracking-widest">Consultar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
