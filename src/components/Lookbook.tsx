'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lookbookItems } from '@/data/editorial';

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = itemsContainerRef.current?.querySelectorAll('.lookbook-entry');
      if (items) {
        items.forEach((item) => {
          const img = item.querySelector('.lookbook-img');
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
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
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-20">
          <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-3 block">
            Caderno Visual · Lookbook
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] text-atelier-noir tracking-tight">
            Diálogo entre o corpo, o ar e a matéria.
          </h2>
          <p className="font-sans text-sm sm:text-base text-atelier-stone mt-4 leading-relaxed">
            Fotografias editoriais captadas sob iluminação difusa natural. Cada silhueta expressa o
            comportamento térmico e o peso das fibras puras em movimento livre.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div ref={itemsContainerRef} className="space-y-28 lg:space-y-36">
          {lookbookItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={`lookbook-entry grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Frame */}
                <div
                  className={`relative w-full overflow-hidden rounded-2xl shadow-xl bg-atelier-sand/20 ${
                    isEven ? 'lg:col-span-7' : 'lg:col-span-7 lg:order-2'
                  } ${
                    item.aspect === 'landscape'
                      ? 'aspect-[16/10]'
                      : item.aspect === 'portrait'
                      ? 'aspect-[3/4]'
                      : 'aspect-square'
                  }`}
                >
                  <div className="lookbook-img relative w-full h-[120%] -top-[10%]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center filter saturate-[0.94] contrast-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-atelier-bg bg-atelier-noir/40 backdrop-blur-sm px-3 py-1 rounded">
                    {item.subtitle}
                  </div>
                </div>

                {/* Text & Fiber Details */}
                <div
                  className={`space-y-6 ${
                    isEven ? 'lg:col-span-5' : 'lg:col-span-5 lg:order-1'
                  }`}
                >
                  <div>
                    <span className="text-xs uppercase tracking-widest text-atelier-stone font-sans block mb-2">
                      {item.yarn}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-atelier-noir tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="font-serif italic text-base sm:text-lg text-atelier-noir/80 leading-relaxed border-l-2 border-atelier-sand pl-4">
                    “{item.quote}”
                  </p>

                  <div className="pt-2 text-xs font-sans text-atelier-stone/80 uppercase tracking-widest">
                    <span>Fotografia de Campanha · Acervo ATELIER</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
