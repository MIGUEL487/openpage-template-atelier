'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Product, ProductColor, ProductSize } from '@/types';
import { siteConfig } from '@/config/site';
import { useLenis } from '@/components/SmoothScroll';
import { X, MessageCircle, Check, Info, Copy } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * Componente interno que renderiza os detalhes e controles do modal.
 * Montado com key={product.id} para garantir que todo o estado (cor, tamanho, avisos)
 * seja reinicializado de forma atômica e limpa ao trocar de produto.
 */
function ProductModalDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const { stop: stopLenis, start: startLenis } = useLenis();
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Padrão', hex: '#D9C8B3' }
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.availableSizes[0] || 'M'
  );
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [demoNoticeVisible, setDemoNoticeVisible] = useState(false);

  // Mensagem contextual gerada
  const contextualMessage = siteConfig.whatsapp.generateProductMessage(
    product.name,
    selectedColor.name,
    selectedSize,
    product.id
  );

  // 1. Bloqueio de scroll do body e pausa do Lenis + gestão de foco e tecla ESC
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement;
    stopLenis();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foco no botão de fechar
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap de foco simples no modal
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
  }, [onClose, stopLenis, startLenis]);

  // 2. Ação de cópia segura para a área de transferência
  const copyMessageToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contextualMessage);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = contextualMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3500);
      return true;
    } catch (err) {
      console.warn('Falha ao copiar para área de transferência:', err);
      return false;
    }
  };

  // 3. Ação do botão WhatsApp (Regra 5: Modo Demonstração Seguro)
  const handleConsultation = async () => {
    await copyMessageToClipboard();

    const isLive = process.env.NEXT_PUBLIC_WHATSAPP_LIVE === 'true';
    const hasLivePhone =
      siteConfig.whatsapp.phoneNumber &&
      siteConfig.whatsapp.phoneNumber !== '5511999999999';

    if (isLive && hasLivePhone) {
      const encoded = encodeURIComponent(contextualMessage);
      const url = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${encoded}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Sempre no modo demonstração seguro: exibe o aviso e copia
      setDemoNoticeVisible(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-atelier-dark/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={(e) => {
        // Fechar ao clicar no backdrop (fora do container)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalContainerRef}
        data-lenis-prevent
        className="relative w-full max-w-4xl bg-atelier-bg rounded-2xl shadow-2xl border border-atelier-border overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-atelier-bg/90 text-atelier-noir hover:bg-atelier-sand/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-atelier-noir"
          aria-label="Fechar janela de detalhes do produto"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Image */}
          <div className="md:col-span-5 relative min-h-[340px] md:min-h-full bg-atelier-sand/20">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover object-center filter saturate-[0.96]"
              style={{ objectPosition: product.objectPosition || 'center' }}
            />
            <div className="absolute top-4 left-4 bg-atelier-noir/80 backdrop-blur-sm text-atelier-bg text-[10px] uppercase tracking-widest px-3 py-1 rounded">
              {product.categoryLabel}
            </div>

            {product.needsOriginal && (
              <div className="absolute bottom-4 left-4 right-4 bg-atelier-noir/70 backdrop-blur-sm text-atelier-bg/90 text-[10px] px-3 py-1.5 rounded text-center">
                Visualização demonstrativa · Slot para arquivo em alta resolução
              </div>
            )}
          </div>

          {/* Right: Specifications & Demonstration Action */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Product Header */}
              <div className="flex items-baseline justify-between border-b border-atelier-border/60 pb-4 mb-4 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-ultra text-atelier-stone font-sans block mb-1">
                    Código: {product.id}
                  </span>
                  <h3 id="modal-product-title" className="font-serif text-2xl sm:text-3xl text-atelier-noir">
                    {product.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xl font-medium text-atelier-noir block">
                    {product.formattedPrice}
                  </span>
                  {product.formattedPrice.includes('confirmar') && (
                    <span className="text-[10px] text-atelier-stone uppercase tracking-wider block">
                      Sob consulta
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-atelier-stone leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Composition & Gauge Badge */}
              <div className="p-3.5 bg-atelier-ecru rounded-xl border border-atelier-border/60 space-y-1 mb-6 text-xs text-atelier-noir/85 font-sans">
                <div>
                  <strong className="text-atelier-noir font-medium">Composição:</strong> {product.composition}
                </div>
                <div>
                  <strong className="text-atelier-noir font-medium">Acabamento / Trama:</strong> {product.gauge}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-sans uppercase tracking-widest text-atelier-stone">
                    Tonalidade Selecionada:
                  </span>
                  <span className="text-xs font-sans font-medium text-atelier-noir">
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
                            ? 'border-atelier-noir scale-110 shadow-sm'
                            : 'border-transparent hover:border-atelier-border'
                        }`}
                        title={color.name}
                        aria-label={`Selecionar cor ${color.name}`}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-black/10"
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
                  <span className="text-xs font-sans uppercase tracking-widest text-atelier-stone">
                    Tamanho Disponível:
                  </span>
                  <span className="text-xs font-sans text-atelier-stone">
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
                            ? 'bg-atelier-noir text-atelier-bg font-medium shadow-sm'
                            : 'bg-atelier-ecru text-atelier-noir hover:bg-atelier-sand/30 border border-atelier-border/80'
                        }`}
                      >
                        {size === 'U' ? 'Único (U)' : size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions & WhatsApp Demonstration Notice */}
            <div className="space-y-3 pt-4 border-t border-atelier-border/60">
              {/* Contextual message preview box */}
              <div className="p-3 bg-atelier-ecru/80 rounded-xl border border-atelier-border/60 text-[11px] font-sans text-atelier-stone space-y-1">
                <div className="flex items-center justify-between text-atelier-noir font-medium">
                  <span>Mensagem contextual gerada:</span>
                  <button
                    onClick={copyMessageToClipboard}
                    className="inline-flex items-center space-x-1 text-atelier-stone hover:text-atelier-noir transition-colors"
                    title="Copiar mensagem"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedNotice ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="italic text-atelier-noir/80 line-clamp-2">
                  &ldquo;{contextualMessage}&rdquo;
                </p>
              </div>

              {/* Main Demonstration Action Button */}
              <button
                onClick={handleConsultation}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-atelier-noir text-atelier-bg hover:bg-atelier-stone font-sans text-xs uppercase tracking-widest transition-all duration-200 shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Consultar Peça via WhatsApp</span>
              </button>

              {/* Demonstration Alert Banner */}
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900/80 dark:text-amber-200/80 flex items-start space-x-2">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Ambiente de Demonstração OpenPage:</strong> Ao clicar, o texto da consulta é copiado para sua área de transferência. Nenhuma mensagem é disparada à loja.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper de controle: só monta o componente interno quando há um produto selecionado,
 * garantindo conformidade rigorosa com as Regras de Hooks do React e reset automático de estado.
 */
export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;
  return <ProductModalDialog product={product} onClose={onClose} key={product.id} />;
}
