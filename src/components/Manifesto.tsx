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
  const mainPhotoRef = useRef<HTMLDivElement>(null);
  const overlayPhotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Revelação controlada do título e parágrafos
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
            stagger: 0.16,
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

      // 2. Revelação da imagem principal com clip e parallax
      if (mainPhotoRef.current) {
        gsap.fromTo(
          mainPhotoRef.current,
          { clipPath: 'inset(10% 0% 10% 0%)', opacity: 0.5 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mainPhotoRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        gsap.to(mainPhotoRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // 3. Foto sobreposta com deslocamento oposto (Seção 5.3 item 3)
      if (overlayPhotoRef.current) {
        gsap.fromTo(
          overlayPhotoRef.current,
          { opacity: 0, scale: 0.92, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
            delay: 0.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mainPhotoRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );

        gsap.to(overlayPhotoRef.current, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const manifestoData = siteConfig.brandContent.manifesto;

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-bg-raised border-b border-line overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Kicker */}
        <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold mb-6 font-sans font-medium">
          <span className="w-8 h-[1px] bg-gold" />
          <span>{manifestoData.kicker}</span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.14] text-ivory max-w-4xl mb-14 tracking-tight"
        >
          {manifestoData.headline}
        </h2>

        {/* 2-Column Content + Dual Photography with Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Text Paragraphs */}
          <div
            ref={textColsRef}
            className="lg:col-span-6 space-y-6 text-sm sm:text-base text-stone leading-relaxed font-sans"
          >
            <p className="first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-gold first-letter:leading-none">
              {manifestoData.paragraph1}
            </p>
            <p>{manifestoData.paragraph2}</p>
            <div className="pt-4 border-t border-line">
              <p className="italic text-ivory font-serif text-lg sm:text-xl text-gold-light leading-relaxed">
                &ldquo;{manifestoData.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Dual Image Accent with Layering */}
          <div className="lg:col-span-6 relative pb-12 sm:pb-16">
            {/* Foto Principal (Fachada da Loja) */}
            <div
              ref={mainPhotoRef}
              className="relative w-full max-w-[480px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-bg-base border border-line will-change-transform ml-auto"
            >
              <Image
                src={manifestoData.image.src}
                alt={manifestoData.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
                style={{ objectPosition: manifestoData.image.objectPosition || 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-bg-base/85 backdrop-blur-md rounded-lg border border-line text-[11px] font-sans">
                <span className="font-medium text-ivory block">{manifestoData.imageCaption}</span>
                <span className="text-gold text-[10px] uppercase tracking-wider">
                  {manifestoData.imageSubcaption}
                </span>
              </div>
            </div>

            {/* Foto Sobreposta (Cliente com Sacolas / Atendimento) */}
            {manifestoData.overlayImage && (
              <div
                ref={overlayPhotoRef}
                className="absolute -bottom-4 left-0 sm:left-4 w-44 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-gold/40 bg-bg-soft will-change-transform z-10"
              >
                <Image
                  src={manifestoData.overlayImage.src}
                  alt={manifestoData.overlayImage.alt}
                  fill
                  sizes="220px"
                  className="object-cover object-top filter contrast-[1.03] saturate-[0.96]"
                  style={{ objectPosition: manifestoData.overlayImage.objectPosition || 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
