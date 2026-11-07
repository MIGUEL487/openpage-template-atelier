'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';

interface LookbookEntry {
  number: string;
  title: string;
  subtitle: string;
  quote: string;
  image: string;
  alt: string;
  isImageLeft: boolean;
}

const entries: LookbookEntry[] = [
  {
    number: '01',
    title: 'Vestido Rosé Costas Nuas',
    subtitle: 'Tricot Canelado Fino',
    quote: 'O equilíbrio entre a sutileza do tom rosé e a ousadia do decote nas costas.',
    image: '/brands/precioza/processed/precioza-vestido-rosa-costas.webp',
    alt: 'Vestido rosa, vista de costas',
    isImageLeft: true,
  },
  {
    number: '02',
    title: 'Conjunto Listrado Resort',
    subtitle: 'Linho & Malharia Suave',
    quote: 'Linhas verticais clássicas que alongam a postura com elegância despretensiosa.',
    image: '/brands/precioza/processed/precioza-conjunto-listrado.webp',
    alt: 'Conjunto listrado com calça clara',
    isImageLeft: false,
  },
  {
    number: '03',
    title: 'Vestido com Busto em Crochê',
    subtitle: 'Crochê Artesanal & Malha Fluida',
    quote: 'O saber manual do crochê traduzido em acabamentos minuciosos e atemporais.',
    image: '/brands/precioza/processed/precioza-croche-detalhe.webp',
    alt: 'Vestido com busto em crochê',
    isImageLeft: true,
  },
  {
    number: '04',
    title: 'Vestido Longo Ondas Terrosas',
    subtitle: 'Jacquard Retilíneo',
    quote: 'Movimento fluido inspirado nas curvas e relevos naturais de Minas Gerais.',
    image: '/brands/precioza/processed/precioza-vestido-ondas.webp',
    alt: 'Vestido longo estampado em ondas',
    isImageLeft: false,
  },
];

export default function LookbookSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row) => {
        if (!row) return;

        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleConsultWhatsApp = (title: string) => {
    const message = siteConfig.whatsapp.generateProductMessage(title, 'Padrão', 'Consulte');
    window.open(siteConfig.whatsapp.getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      className="relative w-full bg-ivory text-ink py-24 md:py-32 border-b border-ivory-line"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Cabeçalho do Lookbook */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-ink-soft">
                Caderno Editorial
              </span>
              <span className="inline-block w-14 h-[1px] bg-ivory-line" />
            </div>
            <h2 className="font-serif font-light text-ink text-[36px] sm:text-[44px] md:text-[52px] leading-[1.04] tracking-tight">
              Harmonia entre fios e silhuetas.
            </h2>
          </div>
          <p className="font-sans text-[13px] text-ink-soft max-w-sm leading-relaxed">
            Composições que unem conforto, caimento impecável e a personalidade única do tricô mineiro.
          </p>
        </div>

        {/* 4 Entradas Alternadas (Zigue-zague Editorial) */}
        <div className="flex flex-col gap-24 md:gap-32">
          {entries.map((entry, index) => (
            <div
              key={entry.number}
              ref={(el) => {
                rowsRef.current[index] = el;
              }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center motion-ready ${
                entry.isImageLeft ? '' : 'lg:grid-flow-dense'
              }`}
            >
              {/* Coluna da Imagem */}
              <div
                className={`lg:col-span-6 relative aspect-[3/4] max-h-[560px] w-full overflow-hidden bg-ivory-line/30 ${
                  entry.isImageLeft ? 'lg:col-start-1' : 'lg:col-start-7'
                }`}
              >
                <Image
                  src={entry.image}
                  alt={entry.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
                />
              </div>

              {/* Coluna de Texto com Numeração Dourada */}
              <div
                className={`lg:col-span-6 flex flex-col justify-center ${
                  entry.isImageLeft ? 'lg:col-start-7 lg:pl-8' : 'lg:col-start-1 lg:pr-8'
                }`}
              >
                {/* Numeração Grande Dourada */}
                <span className="font-serif text-[64px] md:text-[80px] font-light text-gold-deep/80 leading-none mb-4 select-none">
                  {entry.number}
                </span>

                {/* Título e Subtítulo */}
                <h3 className="font-serif text-[28px] sm:text-[34px] md:text-[38px] text-ink font-light leading-tight mb-2">
                  {entry.title}
                </h3>
                <span className="font-sans text-[11px] uppercase tracking-[0.24em] text-ink-soft font-medium mb-6">
                  {entry.subtitle}
                </span>

                {/* Frase em Itálico Serifado com Linha Fina */}
                <div className="border-l border-gold-deep/40 pl-6 my-4">
                  <p className="font-serif italic text-[18px] md:text-[20px] text-ink leading-relaxed">
                    &ldquo;{entry.quote}&rdquo;
                  </p>
                </div>

                {/* Ação: Consultar Peça */}
                <div className="mt-6">
                  <button
                    onClick={() => handleConsultWhatsApp(entry.title)}
                    className="btn-thread-light cursor-pointer group"
                  >
                    <span>Consultar Peça</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
