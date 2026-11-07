'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CollectionSection from '@/components/CollectionSection';
import ApproachSection from '@/components/ApproachSection';
import HighlightsSection from '@/components/HighlightsSection';
import LookbookSection from '@/components/LookbookSection';
import ProductCatalog from '@/components/ProductCatalog';
import StoreVisitSection from '@/components/StoreVisitSection';
import InstagramStrip from '@/components/InstagramStrip';
import Footer from '@/components/Footer';
import { Product } from '@/types';

const ProductModal = dynamic(() => import('@/components/ProductModal'), {
  ssr: false,
});

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-bg-base text-ivory">
      {/* 4.0 Navbar com Logo Script Dourado, Busca e Barra de Leitura */}
      <Navbar />

      {/* 4.1 Hero (80-90vh) com Mosaico Fotográfico de 3 Colunas e Título em 2 Linhas */}
      <Hero />

      {/* 4.2 A Coleção (Fundo Marfim) — 4 Tiles com Legendas em Caixa-Alta + Itálico */}
      <CollectionSection onSelectCategory={(cat) => {
        window.dispatchEvent(new CustomEvent('precioza-filter-category', { detail: cat }));
      }} />

      {/* 4.3 Abordagem / A Loja (Bloco Dividido) — Texto #141311 à Esquerda, 2 Fotos à Direita */}
      <ApproachSection />

      {/* 5.4 Destaques (Fundo Preto) — 4 Peças com Pin Horizontal no Desktop */}
      <HighlightsSection onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 5.5 Lookbook (Fundo Marfim) — 4 Entradas Alternadas com Numeração Dourada 01-04 */}
      <LookbookSection />

      {/* 5.6 Catálogo Completo (Fundo #141311) — Abas de Texto, 15 Peças, Busca e Modal */}
      <ProductCatalog onSelectProduct={(product) => setSelectedProduct(product)} />

      {/* 5.7 Visite a Loja (Fundo Preto) — Split Invertido, Endereço Oficial e Google Maps */}
      <StoreVisitSection />

      {/* 5.8 Faixa Instagram (Fundo Marfim) — 6 Fotos Quadradas @preciozastore */}
      <InstagramStrip />

      {/* 5.9 Rodapé (Fundo Preto) — Logo Script Dourado, Links e Créditos */}
      <Footer />

      {/* Modal de Detalhes da Peça com Integração Direta ao WhatsApp Oficial */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
