'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import FeaturedCollection from '@/components/FeaturedCollection';
import FabricScene from '@/components/FabricScene';
import Lookbook from '@/components/Lookbook';
import ProductCatalog from '@/components/ProductCatalog';
import AtelierStory from '@/components/AtelierStory';
import WhatsAppSection from '@/components/WhatsAppSection';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import { Product } from '@/types';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-atelier-bg text-atelier-noir">
      {/* Navegação Fixa com Blur */}
      <Navbar />

      {/* 1. Hero Cinematográfico com Sequência GSAP */}
      <Hero />

      {/* 2. Manifesto da Marca & Estudo Textural */}
      <Manifesto />

      {/* 3. Coleção em Destaque (Origens & Silêncio) */}
      <FeaturedCollection onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 4. Three.js: Experiência 3D Real do Tecido (The Fabric) */}
      <FabricScene />

      {/* 5. Caderno Visual · Lookbook Editorial */}
      <Lookbook />

      {/* 6. Catálogo Completo com Filtros e Seletor de Variações */}
      <ProductCatalog onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 7. História do Ateliê & Guia de Cuidados com o Fio */}
      <AtelierStory />

      {/* 8. CTA de Atendimento Sob Medida via WhatsApp */}
      <WhatsAppSection />

      {/* 9. Rodapé Editorial de Alto Padrão */}
      <Footer />

      {/* Modal Interativo de Consulta do Produto com Geração Contextual de WhatsApp */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
