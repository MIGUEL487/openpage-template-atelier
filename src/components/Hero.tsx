'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';

interface HeroProps {
  mode?: 'mosaic' | 'single';
}

export default function Hero({ mode = 'mosaic' }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const kickerLineRef = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mosaicCol1Ref = useRef<HTMLDivElement>(null);
  const mosaicCol2Ref = useRef<HTMLDivElement>(null);
  const mosaicCol3Ref = useRef<HTMLDivElement>(null);

  const { scrollTo } = useLenis();
  const brand = siteConfig.brandContent;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Reveal da Linha do Kicker
      if (kickerLineRef.current) {
        gsap.fromTo(
          kickerLineRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
        );
      }

      // 2. Timeline de Revelação Editorial do Título com Máscara
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.14 },
        0.25
      );

      tl.fromTo(
        paragraphRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.55
      );

      tl.fromTo(
        ctaRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.75
      );

      // 3. Revelação das Colunas de Fotos (Clip-path Inset)
      const cols = [mosaicCol1Ref.current, mosaicCol2Ref.current, mosaicCol3Ref.current].filter(Boolean);
      if (cols.length > 0) {
        tl.fromTo(
          cols,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            scale: 1.05,
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            opacity: 1,
            duration: 1.2,
            stagger: 0.12,
            ease: 'power3.inOut',
          },
          0.35
        );

        // 4. Parallax Suave e Contido nas Colunas ao Rolar
        if (mosaicCol1Ref.current) {
          gsap.to(mosaicCol1Ref.current, {
            y: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
        if (mosaicCol2Ref.current) {
          gsap.to(mosaicCol2Ref.current, {
            y: 22,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
        if (mosaicCol3Ref.current) {
          gsap.to(mosaicCol3Ref.current, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [mode]);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo('#colecao', { offset: -80, duration: 1.2 });
  };

  const mosaicImages = brand.hero.mosaicImages || [];
  const img1 = mosaicImages[0] || brand.hero.image;
  const img2 = mosaicImages[1] || brand.hero.image;
  const img3 = mosaicImages[2] || brand.hero.image;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center bg-bg-base overflow-hidden pt-[74px]"
    >
      {/* Container Principal */}
      <div className="relative w-full max-w-[1360px] mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Bloco de Texto à Esquerda (~45% / 5 colunas desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-center z-20">
          
          {/* Kicker com Linha Fina Dourada */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-gold-light">
              Alta Malharia · Monte Sião
            </span>
            <span
              ref={kickerLineRef}
              className="inline-block w-14 h-[1px] bg-gold-deep origin-left"
            />
          </div>

          {/* Título Gigante em 2 Linhas com Máscara de Revelação */}
          <h1 className="font-serif font-light text-ivory tracking-tight text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] xl:text-[84px] leading-[0.98] mb-6">
            <span className="block overflow-hidden">
              <span ref={titleLine1Ref} className="block motion-ready">
                Peças para viver
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={titleLine2Ref} className="block italic text-gold-light motion-ready">
                bem vestida.
              </span>
            </span>
          </h1>

          {/* Parágrafo Descritivo em Serifada Elegante */}
          <p
            ref={paragraphRef}
            className="font-serif italic text-ivory/80 text-[17px] md:text-[19px] leading-relaxed max-w-md mb-8 motion-ready"
          >
            Moda feminina e tricô para o dia a dia e para as ocasiões, com conforto e presença singular.
            Conheça a produção autoral de Monte Sião.
          </p>

          {/* CTA Botão Retangular com Cantos Retos e Borda Fina */}
          <div ref={ctaRef} className="flex items-center gap-4 motion-ready">
            <a
              href="#colecao"
              onClick={handleCtaClick}
              className="btn-thread-dark group cursor-pointer"
            >
              <span>Ver a Coleção</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Bloco Fotográfico à Direita (~55% / 7 colunas desktop) */}
        <div className="lg:col-span-7 relative h-[440px] sm:h-[520px] md:h-[600px] lg:h-[680px] w-full flex items-center justify-end">
          
          {/* Gradiente de Fusão Suave no Fundo à Esquerda */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-bg-base via-bg-base/80 to-transparent z-10 pointer-events-none" />

          {/* Painel de 3 Colunas de Fotos Verticais (Mosaico da Referência) */}
          <div className="relative w-full h-full grid grid-cols-3 gap-2 md:gap-3">
            
            {/* Coluna 1 */}
            <div
              ref={mosaicCol1Ref}
              className="relative h-full w-full overflow-hidden border border-line/40 bg-bg-raised motion-ready"
            >
              <Image
                src={img1.src}
                alt={img1.alt}
                fill
                priority
                sizes="(max-width: 768px) 33vw, 240px"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Coluna 2 */}
            <div
              ref={mosaicCol2Ref}
              className="relative h-full w-full overflow-hidden border border-line/40 bg-bg-raised mt-4 md:mt-6 motion-ready"
            >
              <Image
                src={img2.src}
                alt={img2.alt}
                fill
                priority
                sizes="(max-width: 768px) 33vw, 240px"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Coluna 3 */}
            <div
              ref={mosaicCol3Ref}
              className="relative h-full w-full overflow-hidden border border-line/40 bg-bg-raised motion-ready"
            >
              <Image
                src={img3.src}
                alt={img3.alt}
                fill
                priority
                sizes="(max-width: 768px) 33vw, 240px"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
