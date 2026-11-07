'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Product, ProductColor, ProductSize } from '@/types';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { X, MessageCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

function ProductModalDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const { stop: stopLenis, start: startLenis } = useLenis();
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Padrão', hex: '#B19462' }
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.availableSizes[0] || 'U'
  );

  const contextualMessage = siteConfig.whatsapp.generateProductMessage(
    product.name,
    selectedColor.name,
    selectedSize,
    product.id
  );

  const handleClose = () => {
    if (modalContainerRef.current && backdropRef.current) {
      gsap.to(modalContainerRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.98,
        duration: 0.25,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement;
    stopLenis();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (backdropRef.current && modalContainerRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        modalContainerRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusables = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      startLenis();
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, []);

  const handleWhatsAppConsultation = () => {
    const url = siteConfig.whatsapp.getWhatsAppUrl(contextualMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-bg-base/85 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal Box com Cantos Retos e Borda Fina de 1px */}
      <div
        ref={modalContainerRef}
        data-lenis-prevent
        className="relative w-full max-w-4xl bg-bg-soft border border-line text-ivory z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Botão Fechar Reto */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 border border-line bg-bg-base text-ivory hover:text-gold hover:border-gold transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
          aria-label="Fechar detalhes da peça"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Imagem do Produto Sem Borda e Cantos Retos */}
          <div className="md:col-span-5 relative min-h-[360px] md:min-h-full bg-bg-raised border-b md:border-b-0 md:border-r border-line">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
              style={{ objectPosition: product.objectPosition || 'center 20%' }}
            />
            <div className="absolute top-4 left-4 bg-bg-base/90 text-gold-light text-[10px] uppercase tracking-[0.24em] px-3 py-1 border border-line">
              {product.categoryLabel}
            </div>
          </div>

          {/* Especificações e Ação Direta para o WhatsApp */}
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Cabeçalho do Produto */}
              <div className="border-b border-line pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.26em] text-gold-deep font-sans block mb-1">
                  Referência: {product.id}
                </span>
                <h3 id="modal-product-title" className="font-serif text-2xl sm:text-3xl text-ivory font-light">
                  {product.name}
                </h3>
                <span className="font-serif italic text-sm text-stone block mt-1">
                  {product.tagline}
                </span>
              </div>

              <p className="text-[13px] text-stone leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

              {/* Informações de Composição e Trama */}
              <div className="p-4 bg-bg-base border border-line space-y-1.5 mb-6 text-xs text-stone font-sans">
                <div>
                  <strong className="text-ivory font-medium">Composição:</strong> {product.composition}
                </div>
                <div>
                  <strong className="text-ivory font-medium">Acabamento / Trama:</strong> {product.gauge}
                </div>
                <div>
                  <strong className="text-ivory font-medium">Origem:</strong> Malharia de Monte Sião - MG
                </div>
              </div>

              {/* Seletor de Cores */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-stone">
                    Tonalidade:
                  </span>
                  <span className="text-[11px] font-sans text-gold-light">
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`p-1 border transition-all ${
                          isSelected ? 'border-gold' : 'border-line hover:border-stone'
                        }`}
                        title={color.name}
                        aria-label={`Selecionar cor ${color.name}`}
                      >
                        <span
                          className="block w-6 h-6 border border-black/40"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Tamanhos com Cantos Retos */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-stone">
                    Tamanho Disponível:
                  </span>
                  <span className="text-[11px] font-sans text-stone">
                    {selectedSize === 'U' ? 'Tamanho Único' : `Tamanho ${selectedSize}`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-sans transition-all border ${
                          isSelected
                            ? 'bg-gold text-bg-base border-gold font-medium'
                            : 'bg-bg-base text-stone hover:text-ivory border-line'
                        }`}
                      >
                        {size === 'U' ? 'Único (U)' : size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ação: Botão WhatsApp Retangular com Mensagem Contextual */}
            <div className="space-y-3 pt-6 border-t border-line">
              <button
                onClick={handleWhatsAppConsultation}
                className="btn-thread-dark w-full !py-4 justify-center"
              >
                <MessageCircle className="w-4 h-4 text-gold" />
                <span>Consultar Disponibilidade no WhatsApp</span>
                <span>→</span>
              </button>

              <p className="text-[11px] text-stone text-center font-sans tracking-wide">
                Atendimento direto com a consultoria da Precioza Tricot · Monte Sião - MG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;
  return <ProductModalDialog product={product} onClose={onClose} key={product.id} />;
}
