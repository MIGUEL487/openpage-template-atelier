'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  const lookbookData = siteConfig.brandContent.lookbook;
  const lookbookItems = siteConfig.brandContent.lookbookItems;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = itemsContainerRef.current?.querySelectorAll('.lookbook-entry');
      if (items) {
        items.forEach((item) => {
          const img = item.querySelector('.lookbook-img');
          const numberEl = item.querySelector('.lookbook-number');

          // Parallax contido na imagem
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          // Numeração grande dourada que acompanha o scroll (Seção 5.3 item 6)
          if (numberEl) {
            gsap.fromTo(
              numberEl,
              { y: -20, opacity: 0.15 },
              {
                y: 20,
                opacity: 0.35,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.2,
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lookbook"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-bg-base border-b border-line overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium mb-3">
            <span className="w-8 h-[1px] bg-gold" />
            <span>{lookbookData.kicker}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] text-ivory tracking-tight">
            {lookbookData.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone mt-4 leading-relaxed font-light">
            {lookbookData.description}
          </p>
        </div>

        {/* Asymmetric Gallery Grid with alternating layout & large golden numerals */}
        <div ref={itemsContainerRef} className="space-y-24 lg:space-y-32">
          {lookbookItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className="lookbook-entry relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Large Golden Watermark Numeral */}
                <div
                  className={`lookbook-number pointer-events-none absolute -top-8 font-serif text-7xl sm:text-8xl md:text-9xl text-gold font-light select-none z-0 ${
                    isEven ? 'right-4 lg:right-1/2' : 'left-4 lg:left-1/2'
                  }`}
                >
                  0{index + 1}
                </div>

                {/* Image Frame */}
                <div
                  className={`relative z-10 w-full overflow-hidden rounded-xl shadow-2xl bg-bg-raised border border-line ${
                    isEven ? 'lg:col-span-7' : 'lg:col-span-7 lg:order-2'
                  } ${
                    item.aspect === 'landscape'
                      ? 'aspect-[16/10]'
                      : item.aspect === 'portrait'
                      ? 'aspect-[3/4]'
                      : 'aspect-square'
                  }`}
                >
                  <div className="lookbook-img relative w-full h-[114%] -top-[7%] will-change-transform">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover filter contrast-[1.03] saturate-[0.96]"
                      style={{ objectPosition: item.objectPosition || 'center' }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-gold-light bg-bg-base/80 backdrop-blur-md px-3 py-1 border border-line rounded">
                    {item.subtitle}
                  </div>
                </div>

                {/* Editorial Notes */}
                <div
                  className={`relative z-10 space-y-5 lg:col-span-5 ${
                    isEven ? 'lg:pl-6' : 'lg:col-span-5 lg:order-1 lg:pr-6'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-ultra text-gold-deep font-sans block">
                    Silhueta 0{index + 1} · {item.yarn}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-ivory leading-tight">
                    {item.title}
                  </h3>
                  <blockquote className="font-serif italic text-base sm:text-lg text-gold-light border-l-2 border-gold/50 pl-4 py-1 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <p className="font-sans text-xs sm:text-sm text-stone leading-relaxed font-light">
                    O caimento foi concebido para conferir liberdade de movimento, traduzindo o equilíbrio
                    entre conforto térmico e elegância estruturada.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
