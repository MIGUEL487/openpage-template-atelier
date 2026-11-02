'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(siteConfig.whatsapp.defaultMessage);
    const url = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-editorial ${
        isScrolled
          ? 'bg-atelier-bg/85 backdrop-blur-md border-b border-atelier-border/60 py-3.5 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brandmark */}
        <a
          href="#"
          className="group flex flex-col items-start focus:outline-none focus-visible:ring-1 focus-visible:ring-atelier-noir"
        >
          <span className="font-serif text-2xl tracking-[0.22em] text-atelier-noir font-normal transition-colors group-hover:text-atelier-stone">
            {siteConfig.name}
          </span>
          <span className="text-[9px] uppercase tracking-ultra text-atelier-stone/80 font-sans -mt-0.5">
            Malharia Contemporânea
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {siteConfig.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-widest text-atelier-noir/80 hover:text-atelier-noir transition-colors duration-200 relative py-1 group focus:outline-none focus-visible:underline"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-atelier-noir transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* WhatsApp & Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest border border-atelier-noir/20 bg-atelier-noir text-atelier-bg hover:bg-atelier-noir/90 px-4 py-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-atelier-noir active:scale-95"
            aria-label="Iniciar consulta pelo WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Consultoria</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-atelier-noir focus:outline-none"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-atelier-bg/95 backdrop-blur-xl border-t border-atelier-border z-40 p-8 flex flex-col justify-between animate-fadeIn">
          <nav className="flex flex-col space-y-6 pt-4">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-atelier-noir flex items-center justify-between border-b border-atelier-border/50 pb-3"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-5 h-5 text-atelier-stone/50" />
              </a>
            ))}
          </nav>

          <div className="pt-8 border-t border-atelier-border/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppClick();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-atelier-noir text-atelier-bg py-4 rounded-full text-xs uppercase tracking-widest"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Atendimento WhatsApp</span>
            </button>
            <p className="text-center text-[10px] text-atelier-stone/80 uppercase tracking-widest mt-4">
              Template Aberto · OpenPage
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
