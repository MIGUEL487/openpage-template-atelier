'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import FeaturedCollection from '@/components/FeaturedCollection';
import Lookbook from '@/components/Lookbook';
import ProductCatalog from '@/components/ProductCatalog';
import AtelierStory from '@/components/AtelierStory';
import WhatsAppSection from '@/components/WhatsAppSection';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Product } from '@/types';

// Otimização de bundle inicial: carregamento dinâmico para componentes pesados
const FabricScene = dynamic(() => import('@/components/FabricScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] bg-bg-raised flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
    </div>
  ),
});

const ProductModal = dynamic(() => import('@/components/ProductModal'), {
  ssr: false,
});

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-bg-base text-ivory">
      {/* Preloader curto com logo dourado (≤ 1.2s, não bloqueia LCP) */}
      <Preloader />

      {/* 0. Navegação Fixa com Logo Script Dourado e Barra de Leitura */}
      <Navbar />

      {/* 1. Hero Cinematográfico com Mosaico Fotográfico, Parallax Oposto e Marquee */}
      <Hero />

      {/* 2. Manifesto da Marca & Dual Photography da Loja */}
      <Manifesto />

      {/* 3. Destaques da Coleção com Pin Horizontal no Desktop */}
      <FeaturedCollection onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 4. Textura & Malharia: Colagem de Peças e Drapeado 3D Atmosférico */}
      <ErrorBoundary>
        <FabricScene />
      </ErrorBoundary>

      {/* 5. Caderno Visual · Lookbook com Numeração Dourada */}
      <Lookbook />

      {/* 6. Catálogo com Filtros Suaves via GSAP Flip */}
      <ProductCatalog onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 7. Boutique em Monte Sião & Ritual do Cuidado */}
      <AtelierStory />

      {/* 8. Atendimento Exclusivo via WhatsApp Direto */}
      <WhatsAppSection />

      {/* 9. Rodapé Editorial com Script Dourado */}
      <Footer />

      {/* Modal Interativo com Animação GSAP e Abertura do WhatsApp da Loja */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
