'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { manifesto } from '@/data/editorial';

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textColsRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrada em cascata do manifesto ao entrar no viewport
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 85%',
        },
      });

      gsap.from(textColsRef.current?.children ? Array.from(textColsRef.current.children) : [], {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textColsRef.current,
          start: 'top 80%',
        },
      });

      // Parallax sutil na imagem do manifesto
      gsap.to(photoCardRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Kicker */}
        <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-atelier-stone mb-6">
          <span className="w-8 h-[1px] bg-atelier-stone/50" />
          <span>{manifesto.kicker}</span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] text-atelier-noir max-w-4xl mb-16 tracking-tight"
        >
          {manifesto.headline}
        </h2>

        {/* 2-Column Content + Offset Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Columns: Manifesto Arguments */}
          <div ref={textColsRef} className="lg:col-span-7 space-y-8 text-atelier-noir/85">
            <p className="font-sans text-lg sm:text-xl font-light text-atelier-noir leading-relaxed">
              {manifesto.lead}
            </p>

            <div className="space-y-6 font-sans text-sm sm:text-base text-atelier-stone leading-relaxed border-l-2 border-atelier-sand/60 pl-6">
              {manifesto.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Blockquote */}
            <div className="pt-8">
              <blockquote className="font-serif italic text-xl sm:text-2xl text-atelier-noir/90 leading-snug mb-3">
                {manifesto.quote}
              </blockquote>
              <cite className="block text-xs uppercase tracking-widest text-atelier-stone font-sans not-italic">
                — {manifesto.author}
              </cite>
            </div>
          </div>

          {/* Right Column: Tactile Weave Close-up Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div
              ref={photoCardRef}
              className="relative w-full h-[440px] sm:h-[500px] rounded-xl overflow-hidden shadow-xl bg-atelier-sand/20"
            >
              <Image
                src="/images/texture-weave.jpg"
                alt="Detalhe macro de malha de lã merino mostrando a textura de ponto arroz"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover filter contrast-[1.05] saturate-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-atelier-noir/50 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-atelier-bg text-xs">
                <span className="block uppercase tracking-widest font-sans text-[10px] text-atelier-sand mb-1">
                  Estudo de Trama
                </span>
                <p className="font-serif text-sm">
                  Lã merino 19.5µ em ponto semente duplo. O respiro entre os pontos cria um microclima
                  térmico sobre o corpo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
