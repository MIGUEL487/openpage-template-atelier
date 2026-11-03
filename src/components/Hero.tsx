'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import HeroFabricDrape from '@/components/HeroFabricDrape';
import ErrorBoundary from '@/components/ErrorBoundary';
import { siteConfig } from '@/config/site';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Deixa tudo visível imediatamente se o usuário prefere movimento reduzido
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Timeline cinematográfica de entrada inicial dos elementos internos
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Revelação da imagem principal com clipping mask
      tl.fromTo(
        imageWrapperRef.current,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          scale: 1.08,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.5,
          ease: 'power4.inOut',
        },
        0.1
      );

      // Revelação das linhas do título com stagger
      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        {
          yPercent: 110,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.16,
          ease: 'power3.out',
        },
        0.5
      );

      // Entrada do subtítulo e CTAs
      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.85
      );

      tl.fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.0
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0 },
        1.2
      );

      // 2. Animação de Scroll scrub no WRAPPER PAI (responsabilidades separadas)
      // Garante que o retorno ao topo restaure 100% de opacidade e posição
      gsap.fromTo(
        contentWrapperRef.current,
        { y: 0, opacity: 1 },
        {
          y: -50,
          opacity: 0.25,
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

      // Parallax suave na imagem da hero sem cortar bordas
      gsap.fromTo(
        imageWrapperRef.current,
        { yPercent: 0 },
        {
          yPercent: 12,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const heroData = siteConfig.brandContent.hero;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-28 pb-12 px-6 lg:px-12 bg-atelier-bg overflow-hidden border-b border-atelier-border/50"
    >
      {/* 3D Atmospheric Background Layer (discreto, sutil e fluido ao fundo) */}
      <ErrorBoundary>
        <HeroFabricDrape />
      </ErrorBoundary>

      {/* Main Grid Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left: Typography & Storytelling (no container contentWrapperRef) */}
        <div ref={contentWrapperRef} className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8">
          {/* Kicker */}
          <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-atelier-stone font-sans">
            <span className="w-8 h-[1px] bg-atelier-stone/60" />
            <span>{heroData.kicker}</span>
          </div>

          {/* Editorial Display Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-atelier-noir">
            <span className="block overflow-hidden py-1">
              <span ref={titleLine1Ref} className="inline-block will-change-transform">
                {heroData.headlineLine1}
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span
                ref={titleLine2Ref}
                className="inline-block italic font-light text-atelier-stone will-change-transform"
              >
                {heroData.headlineLine2}
              </span>
            </span>
          </h1>

          {/* Subtitle & Concept */}
          <p
            ref={subtitleRef}
            className="font-sans text-sm sm:text-base text-atelier-stone max-w-xl leading-relaxed font-light"
          >
            {heroData.description}
          </p>

          {/* Action CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2"
          >
            <a
              href="#colecao"
              className="inline-flex items-center justify-center px-8 py-4 bg-atelier-noir text-atelier-bg rounded-full text-xs uppercase tracking-widest hover:bg-atelier-stone transition-all duration-300 shadow-md group"
            >
              <span>Explorar Peças</span>
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#catalogo"
              className="inline-flex items-center justify-center px-8 py-4 bg-atelier-ecru/80 backdrop-blur-sm text-atelier-noir border border-atelier-border rounded-full text-xs uppercase tracking-widest hover:bg-atelier-sand/30 transition-all duration-300"
            >
              <span>Catálogo & Fio</span>
            </a>
          </div>
        </div>

        {/* Right: Editorial Photography Showcase */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div
            ref={imageWrapperRef}
            className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-atelier-sand/20 border border-atelier-border/60 will-change-transform"
          >
            <Image
              src={heroData.image.src}
              alt={heroData.image.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
              className="object-cover object-center filter saturate-[0.96] contrast-[1.02]"
              style={{ objectPosition: heroData.image.objectPosition || 'center' }}
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/25 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-atelier-bg/85 backdrop-blur-md border border-atelier-border/80 flex items-center justify-between text-[11px] font-sans">
              <span className="text-atelier-noir font-medium tracking-wide">
                {heroData.captionTitle}
              </span>
              <span className="text-atelier-stone uppercase tracking-wider text-[10px]">
                {heroData.captionSubtitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-6 border-t border-atelier-border/40 text-[11px] uppercase tracking-ultra text-atelier-stone font-sans"
      >
        <span className="hidden sm:inline">{heroData.bottomBarLeft}</span>
        <a
          href="#manifesto"
          className="flex items-center space-x-2 text-atelier-noir hover:text-atelier-stone transition-colors mx-auto sm:mx-0 group"
        >
          <span>Rolar para Descobrir</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5" />
        </a>
        <span className="hidden sm:inline">{heroData.bottomBarRight}</span>
      </div>
    </section>
  );
}
