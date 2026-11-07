'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { Search, Menu, X, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
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

      // 2. Estado de scroll
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
    const sections = ['colecao', 'loja', 'destaques', 'lookbook', 'catalogo', 'visite'];
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
    setSearchOpen(false);
    scrollTo(href, { offset: -80, duration: 1.2 });
  };

  const handleWhatsAppClick = () => {
    const message = siteConfig.whatsapp.defaultMessage;
    const url = siteConfig.whatsapp.getWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      setSearchOpen(!searchOpen);
      if (!searchOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 150);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    scrollTo('#catalogo', { offset: -80, duration: 1.2 });
    window.dispatchEvent(new CustomEvent('precioza-filter-search', { detail: searchQuery }));
  };

  const brand = siteConfig.brandContent;

  return (
    <>
      {/* Barra de progresso de leitura no topo (2px dourado) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-line pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gold w-full origin-left scale-x-0 transition-transform duration-75 ease-out"
        />
      </div>

      {/* Header Fino ~74px Estilo Thread / Atelier */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          isScrolled
            ? 'bg-bg-base/95 backdrop-blur-md border-b border-line shadow-sm'
            : 'bg-bg-base border-b border-line/60'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 h-[74px] flex items-center justify-between">
          {/* Logo à Esquerda (Script Dourado) */}
          <a
            href="#top"
            onClick={(e) => handleNavClick('#top', e)}
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-gold"
            aria-label="Precioza Tricot — Voltar ao topo"
          >
            <div className="relative w-[130px] md:w-[150px] h-[34px]">
              <Image
                src={brand.logo.scriptUrl || '/brands/precioza/processed/precioza-logo-script-dourado.png'}
                alt={brand.name}
                fill
                priority
                className="object-contain object-left transition-opacity duration-300 group-hover:opacity-85"
                sizes="(max-width: 768px) 130px, 150px"
              />
            </div>
          </a>

          {/* Navegação Desktop à Direita */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#colecao"
              onClick={(e) => handleNavClick('#colecao', e)}
              className={`text-[11px] uppercase tracking-[0.24em] font-sans transition-colors duration-200 ${
                activeSection === 'colecao' ? 'text-gold' : 'text-ivory hover:text-gold'
              }`}
            >
              A Coleção
            </a>
            <a
              href="#loja"
              onClick={(e) => handleNavClick('#loja', e)}
              className={`text-[11px] uppercase tracking-[0.24em] font-sans transition-colors duration-200 ${
                activeSection === 'loja' ? 'text-gold' : 'text-ivory hover:text-gold'
              }`}
            >
              A Loja
            </a>
            <a
              href="#destaques"
              onClick={(e) => handleNavClick('#destaques', e)}
              className={`text-[11px] uppercase tracking-[0.24em] font-sans transition-colors duration-200 ${
                activeSection === 'destaques' ? 'text-gold' : 'text-ivory hover:text-gold'
              }`}
            >
              Destaques
            </a>
            <a
              href="#lookbook"
              onClick={(e) => handleNavClick('#lookbook', e)}
              className={`text-[11px] uppercase tracking-[0.24em] font-sans transition-colors duration-200 ${
                activeSection === 'lookbook' ? 'text-gold' : 'text-ivory hover:text-gold'
              }`}
            >
              Lookbook
            </a>
            <a
              href="#catalogo"
              onClick={(e) => handleNavClick('#catalogo', e)}
              className={`text-[11px] uppercase tracking-[0.24em] font-sans transition-colors duration-200 ${
                activeSection === 'catalogo' ? 'text-gold' : 'text-ivory hover:text-gold'
              }`}
            >
              Catálogo
            </a>

            {/* Ícone de Busca / Lupa Fina */}
            <button
              onClick={handleToggleSearch}
              className="text-ivory hover:text-gold transition-colors duration-200 p-2 focus:outline-none focus:ring-1 focus:ring-gold"
              aria-label="Abrir pesquisa de peças"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Link WhatsApp Discreto com Linha */}
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-sans text-ivory hover:text-gold transition-colors duration-200 pl-4 border-l border-line focus:outline-none focus:ring-1 focus:ring-gold"
              aria-label="Falar no WhatsApp oficial"
            >
              <MessageCircle className="w-3.5 h-3.5 text-gold stroke-[1.5]" />
              <span>WhatsApp</span>
            </button>
          </nav>

          {/* Controles Mobile */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={handleToggleSearch}
              className="p-2 text-ivory hover:text-gold transition-colors focus:outline-none"
              aria-label="Buscar no catálogo"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory hover:text-gold transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown de Busca Integrada */}
        {searchOpen && (
          <div className="bg-bg-raised border-t border-b border-line px-6 py-4 animate-fadeIn">
            <div className="max-w-[1360px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search className="w-4 h-4 text-stone stroke-[1.5]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por vestido, tricô, cor ou detalhe..."
                  className="w-full bg-transparent border-none text-ivory placeholder-stone text-sm focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="btn-thread-dark !py-2 !px-4 text-[10px]"
                >
                  Filtrar →
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-stone hover:text-ivory text-xs px-2"
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Menu Mobile em Tela Cheia (Fundo Preto #0B0B0A, Tipografia Serifada Grande) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-bg-base flex flex-col justify-between px-8 py-24 lg:hidden animate-fadeIn">
          <div className="flex flex-col gap-8 mt-6">
            <span className="kicker-line-gold text-[10px] uppercase tracking-[0.26em] text-stone">
              Navegação
            </span>
            <div className="flex flex-col gap-6">
              {[
                { label: 'A Coleção', href: '#colecao' },
                { label: 'A Loja', href: '#loja' },
                { label: 'Destaques', href: '#destaques' },
                { label: 'Lookbook', href: '#lookbook' },
                { label: 'Catálogo', href: '#catalogo' },
                { label: 'Visite a Loja', href: '#visite' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className="font-serif text-3xl text-ivory hover:text-gold transition-colors tracking-wide"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-line flex flex-col gap-4">
            <button
              onClick={handleWhatsAppClick}
              className="btn-thread-dark w-full !py-4 justify-between"
            >
              <span>Consultar no WhatsApp</span>
              <MessageCircle className="w-4 h-4 text-gold" />
            </button>
            <p className="text-xs text-stone text-center font-sans tracking-widest uppercase">
              Monte Sião · Minas Gerais
            </p>
          </div>
        </div>
      )}
    </>
  );
}
