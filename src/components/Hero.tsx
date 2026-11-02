'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import HeroFabricDrape from '@/components/HeroFabricDrape';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Timeline cinematográfica de entrada inicial
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // 1. Revelação elegante da imagem com máscara de clipping
      tl.fromTo(
        imageWrapperRef.current,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          scale: 1.08,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.6,
          ease: 'power4.inOut',
        },
        0.1
      );

      // 2. Revelação das linhas do título com stagger e clipping vertical
      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        {
          yPercent: 110,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.3,
          stagger: 0.18,
          ease: 'power3.out',
        },
        0.6
      );

      // 3. Entrada do subtítulo e CTAs
      tl.fromTo(
        subtitleRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        0.95
      );

      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.1
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        1.3
      );

      // 4. Transição fluida de scroll para a próxima seção (Parallax & Fade)
      gsap.to(imageWrapperRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to([titleLine1Ref.current, titleLine2Ref.current, subtitleRef.current, ctaRef.current], {
        y: -60,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-28 pb-12 px-6 lg:px-12 bg-atelier-bg overflow-hidden border-b border-atelier-border/50"
    >
      {/* 3D Atmospheric Background Layer (discreto, sutil e fluído ao fundo) */}
      <ErrorBoundary>
        <HeroFabricDrape />
      </ErrorBoundary>

      {/* Top Banner Tag / Kicker */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center text-xs tracking-ultra uppercase text-atelier-stone pt-2">
        <span>Coleção Permanente · 2026</span>
        <span className="hidden sm:inline">Edição Fibras Nobres</span>
        <span>São Paulo · Tear Autoral</span>
      </div>

      {/* Main Grid: Editorial Typography + Asymmetric Hero Photography */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8">
        {/* Left Column: Headlines & Editorial Copy */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10">
          <div className="overflow-hidden mb-2">
            <span
              ref={titleLine1Ref}
              className="block font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.02] tracking-tight text-atelier-noir"
            >
              A geometria do fio
            </span>
          </div>
          <div className="overflow-hidden mb-8">
            <span
              ref={titleLine2Ref}
              className="block font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl italic font-normal leading-[1.02] tracking-tight text-atelier-noir/90"
            >
              e o tempo da malha.
            </span>
          </div>

          <p
            ref={subtitleRef}
            className="font-sans text-sm sm:text-base text-atelier-stone max-w-xl leading-relaxed mb-10"
          >
            Peças concebidas em cashmere mongol e lã merino cardada. Uma investigação sobre calibres,
            drapeados naturais e o silêncio de silhuetas que atravessam os anos sem deformação.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <a
              href="#colecao"
              className="inline-flex items-center space-x-3 bg-atelier-noir text-atelier-bg px-7 py-3.5 rounded-full text-xs uppercase tracking-widest hover:bg-atelier-stone transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-atelier-noir group shadow-sm"
            >
              <span>Explorar Coleção</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </a>

            <a
              href="#catalogo"
              className="inline-flex items-center space-x-2 border border-atelier-border bg-transparent text-atelier-noir hover:bg-atelier-sand/20 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
            >
              <span>Catálogo & Preços</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-atelier-stone" />
            </a>
          </div>
        </div>

        {/* Right Column: Fashion Editorial Photography with Asymmetric Frame */}
        <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[480px] lg:h-[580px] flex items-center justify-center z-10">
          <div
            ref={imageWrapperRef}
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-atelier-sand/20"
          >
            <Image
              ref={imageInnerRef}
              src="/images/hero-knit.jpg"
              alt="Modelo vestindo suéter de malha em textura artesanal e tom bege claro"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-center filter saturate-[0.92] contrast-[1.04]"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/40 via-transparent to-transparent pointer-events-none" />

            {/* Micro Caption in Corner */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-[10px] tracking-widest uppercase text-atelier-bg/90 font-sans backdrop-blur-sm bg-atelier-noir/30 px-3.5 py-2 rounded-lg">
              <span>Polo Calibre 14 · Linho & Pima</span>
              <span>Atelier Silhuetas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-4 border-t border-atelier-border/40 text-xs tracking-widest uppercase text-atelier-stone/80"
      >
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-atelier-noir animate-pulse" />
          <span>Fibras 100% Naturais</span>
        </span>

        <a
          href="#manifesto"
          className="group flex items-center space-x-2 text-atelier-stone hover:text-atelier-noir transition-colors"
        >
          <span>Rolar para Descobrir</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </a>

        <span className="hidden md:inline">Tear Retilíneo de Alta Precisão</span>
      </div>
    </section>
  );
}
