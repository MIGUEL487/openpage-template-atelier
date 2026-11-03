'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Sparkles, MapPin } from 'lucide-react';

export default function AtelierStory() {
  const brand = siteConfig.brandContent;
  const story = brand.story;
  const careRitual = brand.careRitual;

  const storeGallery = story.storeImages || [
    { src: '/brands/precioza/processed/precioza-loja-entrada.webp', alt: 'Fachada da boutique em Monte Sião' },
    { src: '/brands/precioza/processed/precioza-arara-interior.webp', alt: 'Interior da loja com araras' },
    { src: '/brands/precioza/processed/precioza-trico-conjunto-vitrine.webp', alt: 'Vitrine da loja' },
  ];

  return (
    <section
      id="marca"
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-bg-base border-b border-line overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          {/* Left: Boutique Main Image */}
          <div className="lg:col-span-5 relative w-full h-[420px] sm:h-[500px] rounded-xl overflow-hidden shadow-2xl bg-bg-raised border border-line">
            <Image
              src={story.image.src}
              alt={story.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
              style={{ objectPosition: story.image.objectPosition || 'center 40%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-ivory text-xs tracking-wider flex items-center space-x-2 bg-bg-base/85 backdrop-blur-md p-3.5 rounded-lg border border-line">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="font-sans text-[11px] text-ivory">
                {brand.contact.city || 'Monte Sião · Minas Gerais — Capital Nacional do Tricô'}
              </span>
            </div>
          </div>

          {/* Right: Boutique Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium mb-2">
              <span className="w-8 h-[1px] bg-gold" />
              <span>{story.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-ivory tracking-tight leading-[1.14]">
              {story.title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-stone leading-relaxed font-light">
              {story.paragraph1}
            </p>
            <p className="font-sans text-sm sm:text-base text-stone leading-relaxed font-light">
              {story.paragraph2}
            </p>

            {/* Highlight Box */}
            <div className="p-6 rounded-xl bg-bg-raised border border-line space-y-2 mt-6">
              <div className="flex items-center space-x-2 text-gold-light font-serif text-lg font-normal">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>{story.highlightTitle}</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-stone leading-relaxed font-light">
                {story.highlightDescription}
              </p>
            </div>

            {/* Store Address Banner */}
            {story.storeDetails && (
              <div className="p-4 rounded-xl bg-bg-soft border border-line text-xs font-sans text-stone space-y-1">
                <div className="flex items-center space-x-2 text-ivory font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>Localização e Atendimento:</span>
                </div>
                <p className="pl-5 text-ivory font-medium">{story.storeDetails.address}</p>
                <p className="pl-5 text-[11px] text-stone">{story.storeDetails.hoursNotice}</p>
                <p className="pl-5 text-[11px] text-gold-light">{story.storeDetails.consultationNotice}</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Strip: Fotos da Loja e Vitrine (Seção 4) */}
        <div className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {storeGallery.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-line bg-bg-raised shadow-xl"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[10px] text-ivory bg-bg-base/80 backdrop-blur-md px-2.5 py-1 rounded border border-line">
                  {img.alt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Care Guide (O Ritual do Cuidado) */}
        <div className="pt-14 border-t border-line">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-ultra text-gold font-sans block mb-2 font-medium">
              {careRitual.title}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
              {careRitual.subtitle}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-stone mt-2 font-light">
              Cuidados essenciais para garantir que suas peças em tricô e fibras especiais mantenham
              sua textura, cor e caimento por muitas estações.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {careRitual.steps.map((item) => (
              <div
                key={item.step}
                className="p-6 bg-bg-raised rounded-xl border border-line space-y-3"
              >
                <span className="font-serif text-2xl text-gold block font-light">
                  {item.step}
                </span>
                <h4 className="font-serif text-lg text-ivory font-medium">
                  {item.title}
                </h4>
                <p className="font-sans text-xs text-stone leading-relaxed font-light">
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
