'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Instagram } from 'lucide-react';

const instagramPhotos = [
  {
    src: '/brands/precioza/processed/precioza-vestido-creme-cinto.webp',
    alt: 'Vestido creme em modelo',
  },
  {
    src: '/brands/precioza/processed/precioza-vestido-rosa.webp',
    alt: 'Vestido rosa longo',
  },
  {
    src: '/brands/precioza/processed/precioza-macacao-marinho.webp',
    alt: 'Macacão pantacourt marinho',
  },
  {
    src: '/brands/precioza/processed/precioza-conjunto-listrado.webp',
    alt: 'Conjunto listrado com calça clara',
  },
  {
    src: '/brands/precioza/processed/precioza-croche-detalhe-2.webp',
    alt: 'Casaco rendado em crochê',
  },
  {
    src: '/brands/precioza/processed/precioza-trico-cores-arara.webp',
    alt: 'Tricôs em tons terrosos e vinho',
  },
];

export default function InstagramStrip() {
  return (
    <section className="relative w-full bg-ivory text-ink py-20 md:py-28 border-b border-ivory-line">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[11px] font-sans uppercase tracking-[0.26em] text-ink-soft">
                Acompanhe o Cotidiano
              </span>
              <span className="inline-block w-14 h-[1px] bg-ivory-line" />
            </div>
            <h2 className="font-serif font-light text-ink text-[32px] sm:text-[40px] leading-tight">
              @preciozastore
            </h2>
          </div>

          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial-light inline-flex items-center gap-2 group"
          >
            <Instagram className="w-4 h-4 text-ink-soft" />
            <span>Seguir no Instagram</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Faixa de 6 Fotos Quadradas Sem Borda */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {instagramPhotos.map((photo, i) => (
            <a
              key={i}
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden bg-ivory-line/40 group cursor-pointer block"
              aria-label={`Ver publicação ${i + 1} no Instagram da Precioza`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <Instagram className="w-6 h-6 text-ivory drop-shadow" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
