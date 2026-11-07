'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

interface CollectionTile {
  id: string;
  categoryKey: string;
  name: string;
  subtitle: string;
  image: string;
  alt: string;
  objectPosition?: string;
}

const tiles: CollectionTile[] = [
  {
    id: 'tile-vestidos',
    categoryKey: 'vestidos',
    name: 'VESTIDOS',
    subtitle: 'Estampados e fluidos',
    image: '/brands/precioza/processed/precioza-vestido-ondas.webp',
    alt: 'Vestido longo estampado em ondas terrosas',
    objectPosition: 'center 20%',
  },
  {
    id: 'tile-trico',
    categoryKey: 'trico-croche',
    name: 'TRICÔ',
    subtitle: 'Malhas e tramas autorais',
    image: '/brands/precioza/processed/precioza-trico-cores-arara.webp',
    alt: 'Tricôs em bege, rosé e vinho',
    objectPosition: 'center 30%',
  },
  {
    id: 'tile-croche',
    categoryKey: 'trico-croche',
    name: 'CROCHÊ',
    subtitle: 'Detalhes feitos à mão',
    image: '/brands/precioza/processed/precioza-croche-detalhe-2.webp',
    alt: 'Busto em crochê e casaco rendado',
    objectPosition: 'center center',
  },
  {
    id: 'tile-conjuntos',
    categoryKey: 'conjuntos-macacoes',
    name: 'CONJUNTOS',
    subtitle: 'Looks completos atemporais',
    image: '/brands/precioza/processed/precioza-conjunto-listrado.webp',
    alt: 'Conjunto listrado com calça clara',
    objectPosition: 'center 20%',
  },
];

interface CollectionSectionProps {
  onSelectCategory?: (categoryKey: string) => void;
}

export default function CollectionSection({ onSelectCategory }: CollectionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Reveal do Título e Descrição
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // 2. Reveal dos Tiles com Stagger e Clip-path
      if (tilesRef.current) {
        const tileItems = tilesRef.current.children;
        gsap.fromTo(
          tileItems,
          {
            clipPath: 'inset(10% 0% 0% 0%)',
            y: 40,
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tilesRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTileClick = (categoryKey: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    }
    window.dispatchEvent(new CustomEvent('precioza-filter-category', { detail: categoryKey }));
    scrollTo('#catalogo', { offset: -80, duration: 1.2 });
  };

  return (
    <section
      ref={sectionRef}
      id="colecao"
      className="relative w-full bg-ivory text-ink py-24 md:py-32 border-b border-ivory-line"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        
        {/* Cabeçalho da Seção (Exatamente como na Referência Thread) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-20">
          
          {/* Lado Esquerdo: Kicker + Título Grande */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-ink-soft">
                A Coleção
              </span>
              <span className="inline-block w-14 h-[1px] bg-ivory-line" />
            </div>

            <h2
              ref={titleRef}
              className="font-serif font-light text-ink text-[36px] sm:text-[44px] md:text-[52px] leading-[1.04] tracking-tight motion-ready"
            >
              Tecidos que vestem bem. <br className="hidden sm:inline" />
              Peças para voltar a usar.
            </h2>
          </div>

          {/* Lado Direito: Parágrafo Alinhado */}
          <div className="max-w-sm">
            <p className="font-sans text-[13px] md:text-[14px] text-ink-soft leading-relaxed">
              Uma curadoria de malhas retilíneas, vestidos e detalhes manuais em crochê.
              Cada modelo desenvolvido para oferecer textura marcante e caimento leve às estações.
            </p>
          </div>
        </div>

        {/* Grade de 4 Tiles Retos (Proporção ~1 : 1.05 da Referência) */}
        <div
          ref={tilesRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() => handleTileClick(tile.categoryKey)}
              className="group cursor-pointer flex flex-col motion-ready"
            >
              {/* Imagem do Tile Retangular Sem Borda e Cantos Retos */}
              <div className="relative w-full aspect-[1/1.05] overflow-hidden bg-ivory-line/40">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  style={{ objectPosition: tile.objectPosition || 'center center' }}
                />
              </div>

              {/* Legenda: Nome Caixa-Alta + Subtítulo Itálico com Linha Fina */}
              <div className="pt-4 flex flex-col">
                <span className="font-sans font-medium text-[11px] uppercase tracking-[0.24em] text-ink transition-colors duration-200 group-hover:text-gold-deep">
                  {tile.name}
                </span>

                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-serif italic text-[14px] md:text-[15px] text-ink-soft">
                    {tile.subtitle}
                  </span>
                  <span className="inline-block flex-1 max-w-[48px] h-[1px] bg-ivory-line transition-all duration-300 group-hover:max-w-[64px] group-hover:bg-gold-deep" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
