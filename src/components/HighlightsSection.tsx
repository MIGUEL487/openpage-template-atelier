'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Product } from '@/types';
import { siteConfig } from '@/config/site';

interface HighlightItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  alt: string;
  category: string;
}

const highlightItems: HighlightItem[] = [
  {
    id: 'prod-04',
    name: 'MACACÃO PANTACOURT MARINHO',
    subtitle: 'Malharia encorpada de caimento estruturado',
    image: '/brands/precioza/processed/precioza-macacao-marinho.webp',
    alt: 'Macacão azul-marinho pantacourt',
    category: 'conjuntos-macacoes',
  },
  {
    id: 'prod-10',
    name: 'TRICÔ TEXTURIZADO GRAFITE',
    subtitle: 'Tramas geométricas táteis e aconchegantes',
    image: '/brands/precioza/processed/precioza-trico-pecas-arara.webp',
    alt: 'Peças de tricô em arara, cinza e preto',
    category: 'trico-croche',
  },
  {
    id: 'prod-11',
    name: 'CONJUNTO TRICÔ CREME VITRINE',
    subtitle: 'Monocromático fluido com acabamento primoroso',
    image: '/brands/precioza/processed/precioza-trico-conjunto-vitrine.webp',
    alt: 'Manequim com conjunto de tricô creme',
    category: 'conjuntos-macacoes',
  },
  {
    id: 'prod-12',
    name: 'VESTIDO CANELADO FIVELA DOURADA',
    subtitle: 'Ponto canelado elástico com aviamento metálico',
    image: '/brands/precioza/processed/precioza-vestido-creme-detalhe.webp',
    alt: 'Detalhe do cinto do vestido creme',
    category: 'vestidos',
  },
];

interface HighlightsSectionProps {
  onSelectProduct?: (product: Product) => void;
}

export default function HighlightsSection({ onSelectProduct }: HighlightsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // Desktop Pin Horizontal
    mm.add('(min-width: 1024px)', () => {
      if (!pinContainerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalWidth = track.scrollWidth - track.clientWidth;

      const pinTween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: pinContainerRef.current,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          start: 'top top',
          end: () => `+=${totalWidth + 300}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      return () => {
        pinTween.scrollTrigger?.kill();
        pinTween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleConsultClick = (item: HighlightItem) => {
    const fullProduct = siteConfig.brandContent.products.find((p) => p.id === item.id);
    if (fullProduct && onSelectProduct) {
      onSelectProduct(fullProduct);
    } else {
      const message = siteConfig.whatsapp.generateProductMessage(item.name, 'Padrão', 'Consulte', item.id);
      window.open(siteConfig.whatsapp.getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="destaques"
      className="relative w-full bg-bg-base text-ivory border-b border-line"
    >
      <div ref={pinContainerRef} className="relative w-full overflow-hidden py-24 md:py-32">
        {/* Barra de Progresso Dourada Superior da Seção de Pin */}
        <div className="hidden lg:block absolute top-0 left-0 right-0 h-[2px] bg-line z-20">
          <div
            ref={progressBarRef}
            className="h-full bg-gold w-full origin-left scale-x-0 transition-transform duration-75 ease-out"
          />
        </div>

        {/* Cabeçalho da Seção */}
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-gold-light">
                Peças em Foco
              </span>
              <span className="inline-block w-14 h-[1px] bg-gold-deep" />
            </div>
            <h2 className="font-serif font-light text-ivory text-[36px] sm:text-[44px] md:text-[50px] leading-[1.04] tracking-tight">
              Seleção da Estação
            </h2>
          </div>
          <p className="text-[13px] text-stone font-sans max-w-xs">
            Modelagens icônicas tecidas com fios de toque sedoso e presença marcante.
          </p>
        </div>

        {/* Trilho de Cards: Horizontal no Desktop, Grade no Mobile */}
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          <div
            ref={trackRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-nowrap gap-6 md:gap-8"
          >
            {highlightItems.map((item) => (
              <div
                key={item.id}
                className="w-full lg:w-[360px] flex-shrink-0 flex flex-col group cursor-pointer"
                onClick={() => handleConsultClick(item)}
              >
                {/* Imagem do Card Reto Sem Borda */}
                <div className="relative w-full aspect-[3/4] bg-bg-raised overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Informações da Peça */}
                <div className="pt-4 flex flex-col">
                  <span className="font-sans font-medium text-[11px] uppercase tracking-[0.22em] text-ivory group-hover:text-gold transition-colors">
                    {item.name}
                  </span>
                  <span className="font-serif italic text-[14px] text-stone mt-1">
                    {item.subtitle}
                  </span>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-line/60">
                    <span className="text-[12px] font-sans text-stone tracking-wide">
                      Consulte
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConsultClick(item);
                      }}
                      className="btn-thread-dark !py-1.5 !px-3 text-[10px]"
                    >
                      <span>Consultar</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
