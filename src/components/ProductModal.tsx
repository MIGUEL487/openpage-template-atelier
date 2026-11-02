'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product, ProductColor } from '@/types';
import { siteConfig } from '@/config/site';
import { X, MessageCircle, Check, Info } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || 'M');
  const [showCopiedNotice, setShowCopiedNotice] = useState(false);

  const generatedMessage = siteConfig.whatsapp.generateProductMessage(
    product.name,
    selectedColor.name,
    selectedSize,
    product.id
  );

  const handleWhatsAppInquiry = () => {
    const encoded = encodeURIComponent(generatedMessage);
    const url = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setShowCopiedNotice(true);
    setTimeout(() => setShowCopiedNotice(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-atelier-dark/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-4xl bg-atelier-bg rounded-2xl shadow-2xl border border-atelier-border overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-atelier-bg/80 text-atelier-noir hover:bg-atelier-sand/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-atelier-noir"
          aria-label="Fechar modal de detalhes do produto"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Image */}
          <div className="md:col-span-5 relative min-h-[320px] md:min-h-full bg-atelier-sand/20">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center filter saturate-[0.95]"
            />
            <div className="absolute top-4 left-4 bg-atelier-noir/70 backdrop-blur-sm text-atelier-bg text-[10px] uppercase tracking-widest px-3 py-1 rounded">
              {product.categoryLabel}
            </div>
          </div>

          {/* Right: Specifications & WhatsApp Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Product Header */}
              <div className="flex items-baseline justify-between border-b border-atelier-border/60 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-ultra text-atelier-stone font-sans block mb-1">
                    Código: {product.id}
                  </span>
                  <h3 id="modal-title" className="font-serif text-2xl sm:text-3xl text-atelier-noir">
                    {product.name}
                  </h3>
                </div>
                <span className="font-sans text-xl font-medium text-atelier-noir">
                  {product.formattedPrice}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-atelier-stone leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Composition & Gauge Badge */}
              <div className="p-3.5 bg-atelier-ecru rounded-xl border border-atelier-border/60 space-y-1 mb-6 text-xs text-atelier-noir/80 font-sans">
                <div>
                  <strong className="text-atelier-noir font-medium">Composição:</strong> {product.composition}
                </div>
                <div>
                  <strong className="text-atelier-noir font-medium">Calibre:</strong> {product.gauge}
                </div>
              </div>

              {/* Selectors: Color */}
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-widest text-atelier-noir font-sans font-medium mb-2">
                  Cor Selecionada: <span className="text-atelier-stone font-normal">{selectedColor.name}</span>
                </label>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                          isSelected
                            ? 'border-atelier-noir bg-atelier-noir text-atelier-bg font-medium'
                            : 'border-atelier-border bg-white/60 text-atelier-noir hover:border-atelier-stone'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selectors: Size */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-widest text-atelier-noir font-sans font-medium">
                    Tamanho: <span className="text-atelier-stone font-normal">{selectedSize}</span>
                  </label>
                  <span className="text-[10px] text-atelier-stone underline cursor-default">
                    Modelagem com folga natural
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {product.availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-lg text-xs font-medium uppercase transition-all flex items-center justify-center border ${
                          isSelected
                            ? 'border-atelier-noir bg-atelier-noir text-atelier-bg'
                            : 'border-atelier-border bg-white text-atelier-noir hover:border-atelier-stone'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generated WhatsApp Message Preview */}
              <div className="p-4 bg-atelier-sand/15 rounded-xl border border-atelier-border/80 mb-6">
                <div className="flex items-center justify-between text-[11px] font-sans text-atelier-stone uppercase tracking-wider mb-2">
                  <span className="flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5 text-atelier-stone" />
                    <span>Mensagem que será enviada</span>
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="hover:text-atelier-noir underline text-[10px]"
                  >
                    {showCopiedNotice ? 'Copiado!' : 'Copiar texto'}
                  </button>
                </div>
                <p className="font-sans text-xs italic text-atelier-noir/90 bg-white/70 p-2.5 rounded-lg border border-atelier-border/40">
                  &ldquo;{generatedMessage}&rdquo;
                </p>
              </div>
            </div>

            {/* Actions: Direct WhatsApp Contact */}
            <div className="pt-2 border-t border-atelier-border/60">
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full flex items-center justify-center space-x-3 bg-atelier-noir hover:bg-atelier-stone text-atelier-bg py-4 px-6 rounded-full text-xs uppercase tracking-widest transition-all duration-200 shadow-md active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>Consultar Disponibilidade no WhatsApp</span>
              </button>

              <p className="text-center text-[10px] text-atelier-stone/80 uppercase tracking-widest mt-3">
                Atendimento consultivo direto pelo ateliê · Sem carrinho de compras
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
