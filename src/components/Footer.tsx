'use client';

import { siteConfig } from '@/config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-atelier-dark text-atelier-bg border-t border-atelier-stone/20 pt-20 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-atelier-stone/20">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-3xl tracking-[0.2em] text-atelier-bg block font-normal">
              {siteConfig.name}
            </span>
            <span className="text-[10px] uppercase tracking-ultra text-atelier-sand/80 font-sans block">
              Malharia Contemporânea & Tear Autoral
            </span>
            <p className="font-sans text-xs text-atelier-stone/90 max-w-sm leading-relaxed pt-2">
              Template demonstrativo de alta costura desenvolvido para a plataforma OpenPage.
              Apresentando o encontro entre Quiet Luxury, WebGL tridimensional e atendimento consultivo.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-widest text-atelier-sand font-sans block mb-2">
              Navegação
            </span>
            <ul className="space-y-2 text-xs font-sans text-atelier-stone">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-atelier-bg transition-colors block py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / OpenPage Info */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-widest text-atelier-sand font-sans block mb-2">
              Informações do Template
            </span>
            <div className="space-y-2 text-xs font-sans text-atelier-stone leading-relaxed">
              <p>
                <strong className="text-atelier-sand">Modelo:</strong> Projeto A · ATELIER
              </p>
              <p>
                <strong className="text-atelier-sand">Plataforma:</strong> OpenPage Luxury Demonstratives
              </p>
              <p>
                <strong className="text-atelier-sand">Código & Repositório:</strong>{' '}
                <a
                  href="https://github.com/MIGUEL487/openpage-template-atelier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-atelier-bg"
                >
                  MIGUEL487/openpage-template-atelier
                </a>
              </p>
              <p className="text-[11px] text-atelier-stone/70 pt-2">
                * Todas as peças, valores e histórias apresentadas são de caráter artístico demonstrativo.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-atelier-stone font-sans gap-4">
          <p>© {currentYear} ATELIER · OpenPage. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-6 text-xs">
            <span>Desenvolvido com Next.js, Three.js & GSAP</span>
            <span>·</span>
            <span>Deploy via Cloudflare Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
