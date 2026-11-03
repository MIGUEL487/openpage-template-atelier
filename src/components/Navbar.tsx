'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { MessageCircle, Menu, X, ArrowUpRight, AlertCircle, Copy, Check } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedBanner, setCopiedBanner] = useState(false);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href, { offset: -80 });
  };

  const handleConsultancyClick = () => {
    const message = siteConfig.whatsapp.defaultMessage;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopiedBanner(true);
      setTimeout(() => setCopiedBanner(false), 3000);
    }

    const isLive = process.env.NEXT_PUBLIC_WHATSAPP_LIVE === 'true';
    const hasLivePhone =
      siteConfig.whatsapp.phoneNumber &&
      siteConfig.whatsapp.phoneNumber !== '5511999999999';

    if (isLive && hasLivePhone) {
      const url = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const brand = siteConfig.brandContent;

  return (
    <>
      {/* 0. Banner Fixo Discreto de Demonstração Não Oficial (Regra 4) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-atelier-noir text-atelier-bg/90 text-[10px] sm:text-[11px] py-1.5 px-4 font-sans tracking-wider flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-medium tracking-widest uppercase">
            {brand.isConceptDemo
              ? 'Proposta Conceitual Não Oficial · Demonstração OpenPage'
              : 'Template Demonstrativo OpenPage · ATELIER'}
          </span>
          <span className="hidden md:inline text-atelier-stone">|</span>
          <span className="hidden md:inline text-atelier-stone">
            {brand.isConceptDemo
              ? 'Ambiente de estudo e validação sem vínculo comercial ativo'
              : 'Arquitetura para marcas autorais'}
          </span>
        </div>

        {copiedBanner && (
          <span className="hidden sm:inline-flex items-center text-emerald-400 text-[10px] font-sans">
            <Check className="w-3 h-3 mr-1" />
            Mensagem copiada para a área de transferência!
          </span>
        )}
      </div>

      {/* Main Header / Navbar */}
      <header
        className={`fixed top-[28px] sm:top-[30px] left-0 right-0 z-40 transition-all duration-300 ease-editorial ${
          isScrolled
            ? 'bg-atelier-bg/90 backdrop-blur-md border-b border-atelier-border/70 py-3 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Wordmark (Regra 2.1: tipográfico neutro em Cormorant) */}
          <a
            href="#"
            onClick={(e) => handleNavClick('#top', e)}
            className="group flex flex-col items-start focus:outline-none focus-visible:ring-1 focus-visible:ring-atelier-noir"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.24em] text-atelier-noir font-normal transition-colors group-hover:text-atelier-stone">
              {brand.logo.wordmark}
            </span>
            <span className="text-[9px] uppercase tracking-ultra text-atelier-stone font-sans -mt-0.5">
              {brand.logo.submark}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className="text-xs uppercase tracking-widest text-atelier-noir/80 hover:text-atelier-noir transition-colors duration-200 relative py-1 group focus:outline-none focus-visible:underline"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-atelier-noir transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Consultation Demo Action */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={handleConsultancyClick}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest border border-atelier-noir/20 bg-atelier-noir text-atelier-bg hover:bg-atelier-stone px-4 py-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-atelier-noir active:scale-95 shadow-sm"
              aria-label="Abrir modo de consulta"
              title="Copiar mensagem demonstrativa de atendimento"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consultoria</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-atelier-noir focus:outline-none"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[85px] bg-atelier-bg/95 backdrop-blur-xl border-t border-atelier-border z-40 p-8 flex flex-col justify-between">
            <nav className="flex flex-col space-y-5 pt-2">
              {siteConfig.navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className="font-serif text-2xl text-atelier-noir flex items-center justify-between border-b border-atelier-border/50 pb-3"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-5 h-5 text-atelier-stone/50" />
                </a>
              ))}
            </nav>

            <div className="space-y-3 pt-6 border-t border-atelier-border">
              <button
                onClick={handleConsultancyClick}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl bg-atelier-noir text-atelier-bg font-sans text-xs uppercase tracking-widest"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Consultar Coleção (Demo)</span>
              </button>
              <p className="text-[10px] text-center text-atelier-stone">
                Demonstração conceitual OpenPage · Nenhuma compra real
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
