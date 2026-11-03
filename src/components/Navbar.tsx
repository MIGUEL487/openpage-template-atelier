'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const { scrollTo } = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Barra de progresso de leitura no topo (2px dourado)
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // 2. Estado de scroll (fundo translúcido com blur)
      setIsScrolled(scrollY > 40);

      // 3. Esconder ao rolar para baixo e reaparecer ao subir
      if (scrollY > 160) {
        if (scrollY > lastScrollYRef.current && scrollY - lastScrollYRef.current > 10) {
          setIsHidden(true);
        } else if (lastScrollYRef.current - scrollY > 8) {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }

      lastScrollYRef.current = scrollY;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });

    // 4. Seção ativa via ScrollTrigger
    const sections = ['colecao', 'lookbook', 'catalogo', 'marca', 'contato'];
    const triggers: any[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
        triggers.push(trigger);
      }
    });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href, { offset: -80, duration: 1.4 });
  };

  const handleWhatsAppClick = () => {
    const message = siteConfig.whatsapp.defaultMessage;
    const url = siteConfig.whatsapp.getWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const brand = siteConfig.brandContent;

  return (
    <>
      {/* 1. Barra de progresso de leitura dourada de 2px no topo (Seção 5.3 item 8) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-line pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gold w-full origin-left scale-x-0 transition-transform duration-75 ease-out"
        />
      </div>

      {/* 2. Header / Navbar com autohide e fundo translúcido escuro */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-editorial ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          isScrolled
            ? 'bg-bg-base/85 backdrop-blur-md border-b border-line py-3 shadow-2xl'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo Script Dourado com Next/Image */}
          <a
            href="#"
            onClick={(e) => handleNavClick('#top', e)}
            className="group flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            aria-label="Precioza Tricot - Página Inicial"
          >
            <div className="relative transition-all duration-300">
              <Image
                src="/brands/precioza/processed/precioza-logo-script-dourado.webp"
                alt="Precioza"
                width={200}
                height={70}
                priority
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9'
                }`}
              />
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {siteConfig.navigation.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`text-[12px] uppercase tracking-[0.2em] font-sans transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-gold-light font-medium'
                      : 'text-stone hover:text-ivory'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA WhatsApp Real e Menu Hambúrguer */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleWhatsAppClick}
              className="hidden sm:inline-flex items-center space-x-2 text-[11px] uppercase tracking-widest font-sans px-4 py-2 bg-gold text-bg-base font-semibold hover:bg-gold-light transition-all duration-200 shadow-sm rounded-none"
            >
              <MessageCircle className="w-3.5 h-3.5 text-bg-base fill-bg-base" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone hover:text-ivory focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-30 bg-bg-base/98 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col justify-between p-8 pt-28 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col space-y-6">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              className="text-2xl font-serif tracking-wide text-ivory hover:text-gold transition-colors flex items-center justify-between border-b border-line pb-4"
            >
              <span>{item.label}</span>
              <ArrowUpRight className="w-5 h-5 text-gold-deep" />
            </a>
          ))}
        </nav>

        <div className="pt-6 border-t border-line flex flex-col space-y-4">
          <p className="text-[11px] uppercase tracking-widest text-stone font-sans">
            {brand.contact.city || 'Monte Sião — Minas Gerais'}
          </p>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleWhatsAppClick();
            }}
            className="w-full flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-sans py-3 bg-gold text-bg-base font-semibold hover:bg-gold-light transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-bg-base fill-bg-base" />
            <span>Consultoria via WhatsApp</span>
          </button>
        </div>
      </div>
    </>
  );
}
