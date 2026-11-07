'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';

export default function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const photo1Ref = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Reveal do Painel Esquerdo
      gsap.fromTo(
        leftPanelRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      // 2. Revelação das Duas Fotos por Clip-path
      const photos = [photo1Ref.current, photo2Ref.current].filter(Boolean);
      if (photos.length > 0) {
        gsap.fromTo(
          photos,
          {
            clipPath: 'inset(15% 0% 0% 0%)',
            scale: 1.05,
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            opacity: 1,
            duration: 1.1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      // 3. Linha divisória vertical
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo('#visite', { offset: -80, duration: 1.2 });
  };

  return (
    <section
      ref={sectionRef}
      id="loja"
      className="relative w-full bg-bg-base border-b border-line"
    >
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px]">
        
        {/* Painel Esquerdo (~45% / 5 colunas desktop) Fundo #141311 */}
        <div
          ref={leftPanelRef}
          className="lg:col-span-5 bg-bg-raised p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-line motion-ready"
        >
          <div>
            {/* Kicker com Linha Fina Dourada */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-gold-light">
                Uma Experiência Próxima
              </span>
              <span className="inline-block w-14 h-[1px] bg-gold-deep" />
            </div>

            {/* Título Serifado em 2 Linhas */}
            <h2 className="font-serif font-light text-ivory text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] tracking-tight mb-6">
              Cuidado em cada ponto, <br />
              <span className="italic text-gold-light">acolhimento em cada visita.</span>
            </h2>

            {/* Parágrafo Simples e Honesto */}
            <p className="font-sans text-[14px] text-stone leading-relaxed mb-8 max-w-md">
              Em nossa boutique em Monte Sião, cada cliente é recebida com tempo e atenção para sentir
              a textura dos fios e provar peças com caimento preciso. Também levamos essa proximidade
              para quem escolhe e consulta modelos à distância pelo WhatsApp.
            </p>
          </div>

          {/* Link Editorial com Sublinhado */}
          <div>
            <a
              href="#visite"
              onClick={handleLinkClick}
              className="link-editorial-dark cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>Conheça a Loja</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Painel Direito (~55% / 7 colunas desktop): 2 Fotos Lado a Lado */}
        <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] lg:h-full min-h-[480px] grid grid-cols-2 bg-bg-base">
          
          {/* Foto 1: Entrada da Loja */}
          <div
            ref={photo1Ref}
            className="relative h-full w-full overflow-hidden motion-ready"
          >
            <Image
              src="/brands/precioza/processed/precioza-loja-entrada.webp"
              alt="Entrada da boutique Precioza com letreiro dourado"
              fill
              sizes="(max-width: 1024px) 50vw, 400px"
              className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Linha Divisória Vertical Fina Clara (Ivory 40%) */}
          <div
            ref={dividerRef}
            className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-ivory/40 z-10 origin-top pointer-events-none"
          />

          {/* Foto 2: Espaço Interno da Boutique com Araras */}
          <div
            ref={photo2Ref}
            className="relative h-full w-full overflow-hidden motion-ready"
          >
            <Image
              src="/brands/precioza/processed/precioza-arara-interior.webp"
              alt="Interior da boutique com araras de malharia de luxo"
              fill
              sizes="(max-width: 1024px) 50vw, 400px"
              className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
