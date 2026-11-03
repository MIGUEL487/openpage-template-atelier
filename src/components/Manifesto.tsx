'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textColsRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Revelação controlada com fromTo e once: true (nunca fica invisível)
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 88%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (textColsRef.current?.children) {
        gsap.fromTo(
          Array.from(textColsRef.current.children),
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.18,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textColsRef.current,
              start: 'top 85%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 2. Parallax sutil na imagem do manifesto sem expor extremidades
      if (photoCardRef.current && sectionRef.current) {
        gsap.fromTo(
          photoCardRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const manifestoData = siteConfig.brandContent.manifesto;

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Kicker */}
        <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-atelier-stone mb-6">
          <span className="w-8 h-[1px] bg-atelier-stone/50" />
          <span>{manifestoData.kicker}</span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.14] text-atelier-noir max-w-4xl mb-14 tracking-tight"
        >
          {manifestoData.headline}
        </h2>

        {/* 2-Column Content + Offset Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Text Paragraphs */}
          <div ref={textColsRef} className="lg:col-span-7 space-y-6 text-sm sm:text-base text-atelier-stone leading-relaxed font-sans">
            <p className="first-letter:font-serif first-letter:text-4xl first-letter:float-left first-letter:mr-3 first-letter:text-atelier-noir first-letter:leading-none">
              {manifestoData.paragraph1}
            </p>
            <p>{manifestoData.paragraph2}</p>
            <p className="italic text-atelier-noir font-serif text-base sm:text-lg pt-2 border-t border-atelier-border/60">
              &ldquo;{manifestoData.quote}&rdquo;
            </p>
          </div>

          {/* Editorial Image Accent */}
          <div className="lg:col-span-5 relative">
            <div
              ref={photoCardRef}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-atelier-sand/20 border border-atelier-border/60"
            >
              <Image
                src={manifestoData.image.src}
                alt={manifestoData.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter saturate-[0.95]"
                style={{ objectPosition: manifestoData.image.objectPosition || 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-atelier-bg/85 backdrop-blur-md rounded-xl text-[11px] font-sans text-atelier-noir">
                <span className="font-medium block">{manifestoData.imageCaption}</span>
                <span className="text-atelier-stone text-[10px]">{manifestoData.imageSubcaption}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
