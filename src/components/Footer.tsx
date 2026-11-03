'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { Instagram, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const brand = siteConfig.brandContent;
  const { scrollTo } = useLenis();

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href, { offset: -80, duration: 1.4 });
  };

  return (
    <footer className="w-full bg-bg-base text-ivory border-t border-line pt-16 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-line items-start">
          {/* Brand & Logo Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center space-x-4">
              {brand.logo.avatarUrl && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/40 flex-shrink-0 bg-bg-soft">
                  <Image
                    src={brand.logo.avatarUrl}
                    alt="Precioza Tricot"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative h-10 w-36">
                <Image
                  src="/brands/precioza/processed/precioza-logo-script-dourado.webp"
                  alt="Precioza"
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                />
              </div>
            </div>

            <p className="font-sans text-xs text-stone max-w-sm leading-relaxed font-light">
              {brand.description}
            </p>

            {/* Location & Instagram */}
            <div className="flex flex-col space-y-2 pt-2 text-xs font-sans text-stone">
              <div className="flex items-center space-x-2 text-stone">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>Monte Sião, Minas Gerais — Capital Nacional do Tricô</span>
              </div>

              {brand.contact.instagramUrl && (
                <a
                  href={brand.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-gold hover:text-gold-light transition-colors pt-1"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@preciozatricot</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold font-sans block mb-3 font-medium">
              Navegação
            </span>
            <ul className="space-y-2.5 text-xs font-sans text-stone">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className="hover:text-ivory transition-colors block py-0.5 relative w-max after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique Details Column */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold font-sans block mb-3 font-medium">
              Atendimento & Consultoria
            </span>
            <div className="p-5 rounded-xl bg-bg-soft border border-line text-xs font-sans text-stone leading-relaxed space-y-2">
              <p className="text-ivory font-medium">
                Precioza Tricot · Moda Autoral e Malharia Nobre
              </p>
              <p className="text-stone font-light">
                Consultoria personalizada de medidas e disponibilidade via WhatsApp.
              </p>
              <div className="pt-2 border-t border-line flex items-center justify-between text-[11px]">
                <span className="text-gold-light">Horário: Seg a Sáb, 9h às 18h</span>
                <span className="text-stone">Envios Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone font-sans gap-4">
          <p>© {currentYear} Precioza Tricot · Todos os direitos reservados.</p>
          <div className="flex items-center space-x-3 text-stone">
            <span>Experiência Digital por OpenPage</span>
            <span>·</span>
            <span>Monte Sião - MG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
