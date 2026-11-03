'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import HeroFabricDrape from '@/components/HeroFabricDrape';
import ErrorBoundary from '@/components/ErrorBoundary';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mosaicCol1Ref = useRef<HTMLDivElement>(null);
  const mosaicCol2Ref = useRef<HTMLDivElement>(null);
  const mosaicCol3Ref = useRef<HTMLDivElement>(null);
  const mosaicCol4Ref = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const { velocity } = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Timeline de Entrada (Reveal por Máscara e Stagger)
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Título revelado por linhas
      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
        0.2
      );

      // Subtítulo e CTAs
      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.5
      );

      tl.fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.7
      );

      // Entrada das colunas do mosaico com clip escalonado
      const columns = [
        mosaicCol1Ref.current,
        mosaicCol2Ref.current,
        mosaicCol3Ref.current,
        mosaicCol4Ref.current,
      ].filter(Boolean);

      tl.fromTo(
        columns,
        {
          clipPath: 'inset(100% 0% 0% 0%)',
          scale: 1.05,
          opacity: 0,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          opacity: 1,
          duration: 1.3,
          stagger: 0.12,
          ease: 'power3.inOut',
        },
        0.4
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0 },
        1.1
      );

      // 2. Parallax em Sentidos Opostos nas Colunas do Mosaico (Seção 5.3 item 2)
      // Colunas 1 e 3 descem ligeiramente, Colunas 2 e 4 sobem suavemente
      if (mosaicCol1Ref.current && mosaicCol3Ref.current) {
        gsap.to([mosaicCol1Ref.current, mosaicCol3Ref.current], {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      }

      if (mosaicCol2Ref.current && mosaicCol4Ref.current) {
        gsap.to([mosaicCol2Ref.current, mosaicCol4Ref.current], {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      }

      // 3. Efeito de Scroll no Wrapper Pai de Texto (sem conflito com a entrada)
      gsap.fromTo(
        contentWrapperRef.current,
        { y: 0, opacity: 1 },
        {
          y: -40,
          opacity: 0.2,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'center top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 4. Velocidade do Marquee reagindo ao Lenis Velocity
  useEffect(() => {
    if (!marqueeTrackRef.current) return;
    const boost = Math.abs(velocity || 0) * 0.08;
    const baseSpeed = 25; // segundos por ciclo
    const dynamicSpeed = Math.max(10, baseSpeed - boost);
    marqueeTrackRef.current.style.animationDuration = `${dynamicSpeed}s`;
  }, [velocity]);

  const heroData = siteConfig.brandContent.hero;
  const mosaic = heroData.mosaicImages || [
    heroData.image,
    heroData.image,
    heroData.image,
    heroData.image,
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 px-6 lg:px-12 bg-bg-base overflow-hidden border-b border-line"
    >
      {/* 3D Atmospheric Background Layer (Drapeado dourado escuro suave) */}
      <ErrorBoundary>
        <HeroFabricDrape />
      </ErrorBoundary>

      {/* Main Grid Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Typography & Storytelling (wrapper independente) */}
        <div
          ref={contentWrapperRef}
          className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8"
        >
          {/* Kicker Dourado */}
          <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium">
            <span className="w-8 h-[1px] bg-gold" />
            <span>{heroData.kicker}</span>
          </div>

          {/* Editorial Display Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-normal leading-[1.08] tracking-tight text-ivory">
            <span className="block overflow-hidden py-1">
              <span ref={titleLine1Ref} className="inline-block will-change-transform">
                {heroData.headlineLine1}
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span
                ref={titleLine2Ref}
                className="inline-block italic font-light text-gold-light will-change-transform"
              >
                {heroData.headlineLine2}
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-sans text-sm sm:text-base text-stone max-w-xl leading-relaxed font-light"
          >
            {heroData.description}
          </p>

          {/* CTAs Primário Dourado & Secundário Contorno */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2"
          >
            <a
              href="#colecao"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold text-bg-base font-semibold text-xs uppercase tracking-widest hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/10 group"
            >
              <span>Explorar Peças</span>
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-bg-base" />
            </a>

            <a
              href="#catalogo"
              className="inline-flex items-center justify-center px-8 py-4 bg-bg-raised/80 backdrop-blur-sm text-gold border border-gold/40 text-xs uppercase tracking-widest hover:border-gold hover:text-gold-light hover:bg-bg-soft transition-all duration-300"
            >
              <span>Catálogo & Fio</span>
            </a>
          </div>
        </div>

        {/* Right: Mosaico Fotográfico em Colunas com Parallax Oposto (Seção 4) */}
        <div className="lg:col-span-6 relative grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 items-center max-h-[580px] overflow-hidden py-4">
          {/* Coluna 1 */}
          <div
            ref={mosaicCol1Ref}
            className="relative aspect-[3/5] sm:aspect-[3/6] rounded-lg overflow-hidden border border-line bg-bg-raised shadow-xl will-change-transform"
          >
            <Image
              src={mosaic[0].src}
              alt={mosaic[0].alt}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-top filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Coluna 2 */}
          <div
            ref={mosaicCol2Ref}
            className="relative aspect-[3/5] sm:aspect-[3/6] rounded-lg overflow-hidden border border-line bg-bg-raised shadow-xl -mt-6 sm:-mt-8 will-change-transform"
          >
            <Image
              src={mosaic[1].src}
              alt={mosaic[1].alt}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-top filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Coluna 3 */}
          <div
            ref={mosaicCol3Ref}
            className="relative aspect-[3/5] sm:aspect-[3/6] rounded-lg overflow-hidden border border-line bg-bg-raised shadow-xl will-change-transform hidden sm:block"
          >
            <Image
              src={mosaic[2].src}
              alt={mosaic[2].alt}
              fill
              sizes="25vw"
              className="object-cover object-top filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Coluna 4 */}
          <div
            ref={mosaicCol4Ref}
            className="relative aspect-[3/5] sm:aspect-[3/6] rounded-lg overflow-hidden border border-line bg-bg-raised shadow-xl -mt-6 sm:-mt-8 will-change-transform hidden sm:block"
          >
            <Image
              src={mosaic[3].src}
              alt={mosaic[3].alt}
              fill
              sizes="25vw"
              className="object-cover object-top filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Marquee Têxtil Dourado com Reatividade ao Scroll */}
      <div className="relative z-10 w-full overflow-hidden border-y border-line py-2.5 my-4 bg-bg-raised/40">
        <div
          ref={marqueeTrackRef}
          className="flex whitespace-nowrap animate-marquee font-sans text-[11px] uppercase tracking-[0.25em] text-gold-deep"
        >
          <span className="mx-4">{heroData.marqueeText || 'PRECIOZA TRICOT — MONTE SIÃO — '}</span>
          <span className="mx-4">{heroData.marqueeText || 'PRECIOZA TRICOT — MONTE SIÃO — '}</span>
          <span className="mx-4">{heroData.marqueeText || 'PRECIOZA TRICOT — MONTE SIÃO — '}</span>
          <span className="mx-4">{heroData.marqueeText || 'PRECIOZA TRICOT — MONTE SIÃO — '}</span>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Origins */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-2 text-[11px] uppercase tracking-ultra text-stone font-sans"
      >
        <span className="hidden sm:inline">{heroData.bottomBarLeft}</span>
        <a
          href="#manifesto"
          className="flex items-center space-x-2 text-gold-light hover:text-ivory transition-colors mx-auto sm:mx-0 group"
        >
          <span>Conhecer a Marca</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 text-gold" />
        </a>
        <span className="hidden sm:inline">{heroData.bottomBarRight}</span>
      </div>
    </section>
  );
}
