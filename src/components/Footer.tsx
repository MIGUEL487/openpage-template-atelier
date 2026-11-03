'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { Instagram, ExternalLink, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const brand = siteConfig.brandContent;
  const { scrollTo } = useLenis();

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href, { offset: -80 });
  };

  return (
    <footer className="w-full bg-atelier-dark text-atelier-bg border-t border-atelier-stone/20 pt-16 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-atelier-stone/20">
          {/* Brand & Logo Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3.5">
              {brand.logo.avatarUrl && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-amber-300/30 flex-shrink-0 bg-neutral-900">
                  <Image
                    src={brand.logo.avatarUrl}
                    alt={brand.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] text-atelier-bg block font-normal">
                  {brand.logo.wordmark}
                </span>
                <span className="text-[10px] uppercase tracking-ultra text-amber-200/80 font-sans block">
                  {brand.logo.submark}
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-atelier-stone/90 max-w-sm leading-relaxed pt-1 font-light">
              {brand.description}
            </p>

            {/* Official Confirmed Social Links */}
            {brand.contact.instagramUrl && (
              <div className="flex items-center space-x-4 pt-2 text-xs font-sans text-atelier-stone">
                <a
                  href={brand.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-amber-200 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@preciozastore</span>
                  <ExternalLink className="w-3 h-3 text-atelier-stone/60" />
                </a>

                {brand.contact.linktreeUrl && (
                  <a
                    href={brand.contact.linktreeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 hover:text-amber-200 transition-colors"
                  >
                    <span>Linktree</span>
                    <ExternalLink className="w-3 h-3 text-atelier-stone/60" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-widest text-atelier-sand font-sans block mb-2">
              Navegação
            </span>
            <ul className="space-y-2 text-xs font-sans text-atelier-stone">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className="hover:text-atelier-bg transition-colors block py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Notice & OpenPage Prototype Info */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-300/90 font-sans block mb-2">
              Aviso Conceitual Não Oficial
            </span>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-sans text-atelier-stone leading-relaxed space-y-2">
              <p className="text-atelier-bg/90">
                {brand.legalNotice}
              </p>
              <p className="text-[10px] text-atelier-stone/70 pt-1 border-t border-white/10">
                Imagens de referência obtidas publicamente do Instagram oficial da loja. Nenhuma
                venda ou transação financeira é realizada através deste endereço.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-atelier-stone font-sans gap-4">
          <p>© {currentYear} OpenPage Luxury Demonstratives · Todos os direitos reservados.</p>
          <div className="flex items-center space-x-4 text-xs text-atelier-stone/80">
            <span>Next.js · Three.js · GSAP ScrollTrigger</span>
            <span>·</span>
            <span>Cloudflare Workers Static Assets</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
