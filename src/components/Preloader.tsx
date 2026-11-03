'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Não rodar se o usuário já visitou nesta sessão ou prefere menos movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasVisited = sessionStorage.getItem('precioza_preloader_seen');

    if (prefersReducedMotion || hasVisited) {
      return;
    }

    setShouldRender(true);

    const timer = setTimeout(() => {
      const container = containerRef.current;
      const logo = logoRef.current;

      if (!container || !logo) return;

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('precioza_preloader_seen', 'true');
          setShouldRender(false);
        },
      });

      // Animação de entrada rápida e cortina de saída (total ~1.1s)
      tl.fromTo(
        logo,
        { opacity: 0, scale: 0.94, filter: 'blur(4px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }
      )
        .to(logo, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', delay: 0.25 })
        .to(container, {
          yPercent: -100,
          duration: 0.5,
          ease: 'power3.inOut',
        });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-base pointer-events-none select-none"
      aria-hidden="true"
    >
      <div ref={logoRef} className="flex flex-col items-center">
        <Image
          src="/brands/precioza/processed/precioza-logo-script-dourado.webp"
          alt="Precioza Tricot"
          width={280}
          height={98}
          priority
          className="w-auto h-12 md:h-16 object-contain"
        />
        <span className="mt-3 text-[10px] tracking-[0.3em] uppercase text-gold font-sans font-light">
          Alta Malharia · Monte Sião
        </span>
      </div>
    </div>
  );
}
