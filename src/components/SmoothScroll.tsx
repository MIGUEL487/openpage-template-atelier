'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LenisContextType {
  lenis: Lenis | null;
  velocity: number;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  velocity: 0,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [velocity, setVelocity] = useState<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Registra plugins no GSAP e configura ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // 2. Respeita prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    // 3. Inicializa Lenis (Secão 5.1 do plano)
    // lerp ~0.09, smoothWheel: true, syncTouch: false (scroll nativo no toque)
    const lenis = new Lenis({
      lerp: 0.09,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoResize: true,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // 4. Sincroniza Lenis com o ScrollTrigger e atualiza velocidade
    const onScroll = (e: any) => {
      ScrollTrigger.update();
      if (typeof e.velocity === 'number') {
        setVelocity(e.velocity);
      }
    };
    lenis.on('scroll', onScroll);

    // 5. Conecta o ticker do GSAP ao RAF do Lenis (um único loop compartilhado)
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // 6. Atualização robusta e debounced do ScrollTrigger
    let refreshTimeout: NodeJS.Timeout | null = null;
    const scheduleRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    if (document.fonts) {
      document.fonts.ready.then(scheduleRefresh).catch(() => scheduleRefresh());
    }

    if (document.readyState === 'complete') {
      scheduleRefresh();
    } else {
      window.addEventListener('load', scheduleRefresh, { once: true });
    }

    // 7. Interceptação global de âncoras para scroll suave com compensação da navbar (-80px)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      if (href === '#' || href === '#top') {
        e.preventDefault();
        lenis.scrollTo(0, { offset: 0, duration: 1.2 });
        return;
      }

      if (href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, velocity, scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
