'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { Instagram, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const brand = siteConfig.brandContent;
  const { scrollTo } = useLenis();

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href, { offset: -80, duration: 1.2 });
  };

  const handleWhatsApp = () => {
    const url = siteConfig.whatsapp.getWhatsAppUrl(siteConfig.whatsapp.defaultMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="w-full bg-bg-base text-ivory border-t border-line pt-20 pb-14 px-6 md:px-12">
      <div className="max-w-[1360px] mx-auto">
        {/* Grid Principal do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-line items-start">
          
          {/* Coluna da Marca e Logo Script Dourado (~5 colunas) */}
          <div className="md:col-span-5 space-y-6">
            <div className="relative h-12 w-48">
              <Image
                src={brand.logo.scriptUrl || '/brands/precioza/processed/precioza-logo-script-dourado.png'}
                alt={brand.name}
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>

            <p className="font-sans text-[13px] text-stone max-w-sm leading-relaxed">
              {brand.description}
            </p>

            <div className="space-y-3 pt-2 text-xs font-sans text-stone">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <span>R. Juscelino Kubitscheck de Oliveira, 602, Centro · Monte Sião - MG</span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-stone hover:text-gold transition-colors"
                >
                  <Instagram className="w-4 h-4 text-gold" />
                  <span>@preciozastore</span>
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-1.5 text-stone hover:text-gold transition-colors focus:outline-none"
                >
                  <MessageCircle className="w-4 h-4 text-gold" />
                  <span>(35) 99228-7718</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coluna 1: Navegação Editorial (~3 colunas) */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold-light font-sans block font-medium">
              Navegação
            </span>
            <ul className="space-y-3 text-xs font-sans text-stone">
              {[
                { label: 'A Coleção', href: '#colecao' },
                { label: 'A Loja', href: '#loja' },
                { label: 'Destaques', href: '#destaques' },
                { label: 'Lookbook', href: '#lookbook' },
                { label: 'Catálogo Completo', href: '#catalogo' },
                { label: 'Visite a Boutique', href: '#visite' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className="hover:text-ivory transition-colors block py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 2: Atendimento & WhatsApp (~4 colunas) Fundo #141311 com Cantos Retos */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold-light font-sans block font-medium">
              Atendimento Consultivo
            </span>
            <div className="p-6 bg-bg-raised border border-line text-xs font-sans text-stone leading-relaxed space-y-3">
              <p className="text-ivory font-medium">
                Precioza Tricot · Alta Malharia Autoral
              </p>
              <p>
                Dúvidas sobre disponibilidade, tamanhos ou detalhes de modelagem? Nossa equipe
                está à disposição para orientar cada escolha via WhatsApp.
              </p>
              <div className="pt-3 border-t border-line">
                <button
                  onClick={handleWhatsApp}
                  className="btn-thread-dark w-full !py-2.5 justify-center text-[10px]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-gold" />
                  <span>Iniciar Conversa no WhatsApp</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Créditos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone font-sans gap-4">
          <p>© {currentYear} PRECIOZA TRICOT. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3 text-stone/80 text-[10px] uppercase tracking-widest">
            <span>Monte Sião · Minas Gerais</span>
            <span>—</span>
            <span>Site por OpenPage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
