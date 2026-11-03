'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Sparkles, MapPin, Info } from 'lucide-react';

export default function AtelierStory() {
  const brand = siteConfig.brandContent;
  const story = brand.story;
  const careRitual = brand.careRitual;

  return (
    <section
      id="atelie"
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-bg border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          {/* Left: Boutique or Artisan Loom Image */}
          <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden shadow-xl bg-atelier-sand/20 border border-atelier-border/60">
            <Image
              src={story.image.src}
              alt={story.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center filter saturate-[0.95] contrast-[1.03]"
              style={{ objectPosition: story.image.objectPosition || 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-atelier-bg text-xs tracking-wider flex items-center space-x-2 bg-atelier-noir/50 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span className="font-sans text-[11px]">{brand.contact.city || 'Monte Sião · Minas Gerais'}</span>
            </div>
            {story.image.needsOriginal && (
              <div className="absolute top-4 right-4 bg-atelier-noir/70 text-atelier-bg text-[9px] px-2 py-0.5 rounded">
                Slot de Alta Resolução
              </div>
            )}
          </div>

          {/* Right: Heritage / Boutique Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans block mb-2">
              {story.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight leading-[1.14]">
              {story.title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-atelier-stone leading-relaxed font-light">
              {story.paragraph1}
            </p>
            <p className="font-sans text-sm sm:text-base text-atelier-stone leading-relaxed font-light">
              {story.paragraph2}
            </p>

            {/* Highlight Box */}
            <div className="p-6 rounded-2xl bg-atelier-ecru/80 border border-atelier-border/80 space-y-2 mt-6">
              <div className="flex items-center space-x-2 text-atelier-noir font-serif text-base font-normal">
                <Sparkles className="w-4 h-4 text-atelier-stone" />
                <span>{story.highlightTitle}</span>
              </div>
              <p className="font-sans text-xs text-atelier-stone/90 leading-relaxed font-light">
                {story.highlightDescription}
              </p>
            </div>

            {/* Store Address Banner if available */}
            {story.storeDetails && (
              <div className="p-4 rounded-xl bg-atelier-sand/15 border border-atelier-border/70 text-xs font-sans text-atelier-stone space-y-1">
                <div className="flex items-center space-x-2 text-atelier-noir font-medium">
                  <MapPin className="w-3.5 h-3.5 text-atelier-stone" />
                  <span>Localização da Loja Física:</span>
                </div>
                <p className="pl-5 text-atelier-noir/90 font-medium">{story.storeDetails.address}</p>
                <p className="pl-5 text-[11px] text-atelier-stone/80">{story.storeDetails.hoursNotice}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Care Guide (O Ritual do Cuidado) */}
        <div className="pt-14 border-t border-atelier-border/60">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans block mb-2">
              {careRitual.title}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-atelier-noir">
              {careRitual.subtitle}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-atelier-stone mt-2 font-light">
              Cuidados essenciais para garantir que suas peças em tricô e fibras especiais mantenham
              sua textura, cor e caimento por muitas estações.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {careRitual.steps.map((item) => (
              <div
                key={item.step}
                className="p-6 bg-atelier-ecru/60 rounded-2xl border border-atelier-border/70 space-y-3"
              >
                <span className="font-serif text-2xl text-atelier-stone block font-light">
                  {item.step}
                </span>
                <h4 className="font-serif text-base text-atelier-noir font-medium">
                  {item.title}
                </h4>
                <p className="font-sans text-xs text-atelier-stone leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
