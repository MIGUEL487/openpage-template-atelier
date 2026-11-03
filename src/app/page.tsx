'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
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
    <div className="w-full h-[550px] bg-atelier-ecru flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-atelier-stone/20 border-t-atelier-stone animate-spin" />
    </div>
  ),
});

const ProductModal = dynamic(() => import('@/components/ProductModal'), {
  ssr: false,
});

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-atelier-bg text-atelier-noir">
      {/* 0. Navegação Fixa com Blur e Banner Conceitual */}
      <Navbar />

      {/* 1. Hero Cinematográfico com GSAP e 3D Atmosférico de Fundo */}
      <Hero />

      {/* 2. Manifesto da Marca & Estudo de Identidade */}
      <Manifesto />

      {/* 3. Destaques da Coleção (Silhuetas & Presença) */}
      <FeaturedCollection onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 4. Three.js: Camada 3D Atmosférica e Cards Estruturais */}
      <ErrorBoundary>
        <FabricScene />
      </ErrorBoundary>

      {/* 5. Caderno Visual · Lookbook Editorial */}
      <Lookbook />

      {/* 6. Catálogo Completo com Filtros e Seletor de Peças */}
      <ProductCatalog onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 7. A Experiência da Boutique em Monte Sião & Cuidados */}
      <AtelierStory />

      {/* 8. Atendimento Consultivo via WhatsApp (Modo Demonstração) */}
      <WhatsAppSection />

      {/* 9. Rodapé Editorial de Alto Padrão com Aviso Conceitual */}
      <Footer />

      {/* Modal Interativo de Consulta do Produto com Geração Contextual */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
