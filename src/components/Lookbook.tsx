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
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lookbook"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-bg border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-3 block">
            {lookbookData.kicker}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] text-atelier-noir tracking-tight">
            {lookbookData.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-atelier-stone mt-4 leading-relaxed font-light">
            {lookbookData.description}
          </p>
        </div>

        {/* Asymmetric Gallery Grid with calibrated spacing and alternate layout */}
        <div ref={itemsContainerRef} className="space-y-20 lg:space-y-24">
          {lookbookItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className="lookbook-entry grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Image Frame */}
                <div
                  className={`relative w-full overflow-hidden rounded-2xl shadow-xl bg-atelier-sand/20 border border-atelier-border/60 ${
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
                      className="object-cover filter saturate-[0.96] contrast-[1.02]"
                      style={{ objectPosition: item.objectPosition || 'center' }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-atelier-bg bg-atelier-noir/60 backdrop-blur-sm px-3 py-1 rounded">
                    {item.subtitle}
                  </div>
                  {item.needsOriginal && (
                    <div className="absolute top-4 right-4 text-[9px] text-atelier-bg/90 bg-atelier-noir/70 px-2 py-0.5 rounded">
                      Demo
                    </div>
                  )}
                </div>

                {/* Editorial Notes */}
                <div
                  className={`space-y-5 lg:col-span-5 ${
                    isEven ? 'lg:pl-4' : 'lg:col-span-5 lg:order-1 lg:pr-4'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-ultra text-atelier-stone font-sans block">
                    Silhueta 0{index + 1} · {item.yarn}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-atelier-noir leading-tight">
                    {item.title}
                  </h3>
                  <blockquote className="font-serif italic text-base sm:text-lg text-atelier-noir/80 border-l-2 border-atelier-stone/40 pl-4 py-1 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <p className="font-sans text-xs sm:text-sm text-atelier-stone leading-relaxed font-light">
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
