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

  // Mensagem contextual gerada para o WhatsApp da loja
  const contextualMessage = siteConfig.whatsapp.generateProductMessage(
    product.name,
    selectedColor.name,
    selectedSize,
    product.id
  );

  // Animação de entrada e saída com GSAP (Seção 5.3 item 7)
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

    // Animação de entrada suave com GSAP
    if (backdropRef.current && modalContainerRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(
        modalContainerRef.current,
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Trap de foco
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
      previousActiveElementRef.current?.focus();
    };
  }, [stopLenis, startLenis]);

  // Ação WhatsApp Real (Regra 3: isDemo: false, abre wa.me diretamente)
  const handleWhatsAppConsultation = () => {
    const url = siteConfig.whatsapp.getWhatsAppUrl(contextualMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-bg-base/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalContainerRef}
        data-lenis-prevent
        className="relative w-full max-w-4xl bg-bg-soft rounded-2xl shadow-2xl border border-line overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-bg-base/80 text-ivory hover:text-gold hover:bg-bg-raised transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          aria-label="Fechar detalhes da peça"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Image */}
          <div className="md:col-span-5 relative min-h-[340px] md:min-h-full bg-bg-base">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
              style={{ objectPosition: product.objectPosition || 'center 20%' }}
            />
            <div className="absolute top-4 left-4 bg-bg-base/80 backdrop-blur-sm text-gold-light text-[10px] uppercase tracking-widest px-3 py-1 rounded border border-line">
              {product.categoryLabel}
            </div>
          </div>

          {/* Right: Specifications & Direct WhatsApp Action */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Product Header */}
              <div className="flex items-baseline justify-between border-b border-line pb-4 mb-4 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-ultra text-gold-deep font-sans block mb-1">
                    Referência: {product.id}
                  </span>
                  <h3 id="modal-product-title" className="font-serif text-2xl sm:text-3xl text-ivory">
                    {product.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xl font-medium text-gold block">
                    {product.formattedPrice}
                  </span>
                  <span className="text-[10px] text-stone uppercase tracking-wider block">
                    Preço sob consulta
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Composition & Gauge Badge */}
              <div className="p-3.5 bg-bg-base rounded-xl border border-line space-y-1 mb-6 text-xs text-stone font-sans">
                <div>
                  <strong className="text-ivory font-medium">Composição:</strong> {product.composition}
                </div>
                <div>
                  <strong className="text-ivory font-medium">Acabamento / Trama:</strong> {product.gauge}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-sans uppercase tracking-widest text-stone">
                    Tonalidade Selecionada:
                  </span>
                  <span className="text-xs font-sans font-medium text-gold-light">
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative p-1 rounded-full border transition-all ${
                          isSelected
                            ? 'border-gold scale-110 shadow-sm'
                            : 'border-line hover:border-gold/40'
                        }`}
                        title={color.name}
                        aria-label={`Selecionar cor ${color.name}`}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-black/30"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-sans uppercase tracking-widest text-stone">
                    Tamanho Disponível:
                  </span>
                  <span className="text-xs font-sans text-stone">
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
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-sans transition-all ${
                          isSelected
                            ? 'bg-gold text-bg-base font-semibold shadow-md'
                            : 'bg-bg-base text-stone hover:text-ivory border border-line'
                        }`}
                      >
                        {size === 'U' ? 'Único (U)' : size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions: WhatsApp Real Direct Action */}
            <div className="space-y-3 pt-4 border-t border-line">
              <button
                onClick={handleWhatsAppConsultation}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gold text-bg-base font-semibold hover:bg-gold-light font-sans text-xs uppercase tracking-widest transition-all duration-200 shadow-xl group"
              >
                <MessageCircle className="w-4 h-4 text-bg-base fill-bg-base" />
                <span>Consultar Disponibilidade no WhatsApp</span>
              </button>

              <p className="text-[11px] text-stone text-center font-sans">
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
