'use client';

import Image from 'next/image';
import { atelierStory, careGuide } from '@/data/editorial';
import { Sparkles } from 'lucide-react';

export default function AtelierStory() {
  return (
    <section
      id="atelie"
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28">
          {/* Left: Artisan Loom Image */}
          <div className="lg:col-span-5 relative w-full h-[420px] sm:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-atelier-sand/20">
            <Image
              src="/images/artisan-loom.jpg"
              alt="Ateliê de tecelagem com fios e tear artesanal"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center filter saturate-[0.9] contrast-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 text-atelier-bg text-xs tracking-widest uppercase">
              <span>Oficina de Tear Retilíneo · São Paulo</span>
            </div>
          </div>

          {/* Right: Heritage Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans block mb-2">
              {atelierStory.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight leading-[1.15]">
              {atelierStory.title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-atelier-stone leading-relaxed">
              {atelierStory.paragraph1}
            </p>
            <p className="font-sans text-sm sm:text-base text-atelier-stone leading-relaxed">
              {atelierStory.paragraph2}
            </p>

            {/* Transparent Demo Highlight Box */}
            <div className="p-6 rounded-xl bg-atelier-sand/20 border border-atelier-border/80 space-y-2 mt-8">
              <div className="flex items-center space-x-2 text-atelier-noir font-serif text-base font-normal">
                <Sparkles className="w-4 h-4 text-atelier-stone" />
                <span>{atelierStory.highlightBox.title}</span>
              </div>
              <p className="font-sans text-xs text-atelier-stone/90 leading-relaxed">
                {atelierStory.highlightBox.description}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Care Guide (O Ritual do Cuidado) */}
        <div className="pt-16 border-t border-atelier-border/60">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans block mb-2">
              Preservação da Malha Nobre
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-atelier-noir">
              O ritual do cuidado para peças eternas.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-atelier-stone mt-2">
              O cashmere e a lã merino são fibras vivas com propriedades autolimpantes. Siga estas
              etapas para garantir maciez contínua.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {careGuide.map((item) => (
              <div
                key={item.step}
                className="p-6 bg-atelier-bg rounded-xl border border-atelier-border/60 space-y-3"
              >
                <span className="font-serif text-2xl text-atelier-sand block font-light">
                  {item.step}
                </span>
                <h4 className="font-serif text-base text-atelier-noir font-medium">
                  {item.title}
                </h4>
                <p className="font-sans text-xs text-atelier-stone leading-relaxed">
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
