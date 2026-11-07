'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';
import { MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function StoreVisitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [textColRef.current, imageColRef.current],
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleWhatsApp = () => {
    const message = siteConfig.whatsapp.generateBespokeMessage('Visita à boutique em Monte Sião');
    window.open(siteConfig.whatsapp.getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      id="visite"
      className="relative w-full bg-bg-base border-b border-line text-ivory"
    >
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        
        {/* Painel Fotográfico à Esquerda (~55% / 7 colunas desktop) */}
        <div
          ref={imageColRef}
          className="lg:col-span-7 relative h-[380px] sm:h-[460px] lg:h-full min-h-[440px] bg-bg-raised border-b lg:border-b-0 lg:border-r border-line overflow-hidden motion-ready"
        >
          <Image
            src="/brands/precioza/processed/precioza-cliente-sacolas.webp"
            alt="Cliente na boutique Precioza Tricot com sacolas da marca"
            fill
            sizes="(max-width: 1024px) 100vw, 750px"
            className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Painel de Texto e Endereço à Direita (~45% / 5 colunas desktop) Fundo #141311 */}
        <div
          ref={textColRef}
          className="lg:col-span-5 bg-bg-raised p-8 sm:p-12 md:p-16 flex flex-col justify-between motion-ready"
        >
          <div>
            {/* Kicker com Linha Fina Dourada */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-gold-light">
                Nossa Boutique
              </span>
              <span className="inline-block w-14 h-[1px] bg-gold-deep" />
            </div>

            {/* Título Serifado */}
            <h2 className="font-serif font-light text-ivory text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] tracking-tight mb-6">
              Visite nosso espaço <br />
              <span className="italic text-gold-light">em Monte Sião.</span>
            </h2>

            {/* Endereço Oficial Real */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <p className="font-sans text-sm text-ivory leading-relaxed">
                    R. Juscelino Kubitscheck de Oliveira, 602
                  </p>
                  <p className="font-sans text-sm text-stone">
                    Centro · Monte Sião, MG, 37580-000
                  </p>
                </div>
              </div>

              {/* Link Google Maps */}
              <div className="pt-2">
                <a
                  href={siteConfig.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-editorial-dark inline-flex items-center gap-2 group"
                >
                  <span>Como Chegar no Google Maps</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-stone font-sans leading-relaxed mb-8">
              Deseja confirmar a disponibilidade de uma peça antes de sua visita?
              Fale com antecedência com nossa equipe pelo WhatsApp.
            </p>
          </div>

          {/* Botões de Contato */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-line">
            <button
              onClick={handleWhatsApp}
              className="btn-thread-dark flex-1 !py-3.5 justify-center"
            >
              <MessageCircle className="w-4 h-4 text-gold" />
              <span>Falar no WhatsApp</span>
              <span>→</span>
            </button>

            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-thread-dark !py-3.5 justify-center"
            >
              <Instagram className="w-4 h-4 text-gold" />
              <span>@preciozastore</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
