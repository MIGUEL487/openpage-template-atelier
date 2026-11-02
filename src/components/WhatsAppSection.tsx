'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { MessageCircle, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function WhatsAppSection() {
  const [selectedSubject, setSelectedSubject] = useState('Consultoria de Tamanho e Caimento');

  const subjects = [
    'Consultoria de Tamanho e Caimento',
    'Criação de Peça Sob Medida',
    'Dúvidas sobre Fiação e Calibres',
    'Disponibilidade de Cores Especiais',
  ];

  const generatedBespokeMessage = siteConfig.whatsapp.generateBespokeMessage(selectedSubject);

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(generatedBespokeMessage);
    const url = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contato"
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-noir text-atelier-bg overflow-hidden"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D9C8B3_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-ultra text-atelier-sand/80 font-sans block mb-3">
            Atendimento Consultivo · Ateliê
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-bg tracking-tight leading-[1.12]">
            Uma conversa direta com quem entende o fio.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-atelier-sand/80 mt-4 leading-relaxed">
            Nossos consultores têxteis auxiliam você a escolher a gramatura exata para seu estilo de vida,
            orientam sobre medidas milimétricas e recebem pedidos para personalização.
          </p>
        </div>

        {/* Interactive Consultation Card */}
        <div className="bg-atelier-dark/80 backdrop-blur-md rounded-2xl border border-atelier-stone/30 p-8 sm:p-12 max-w-3xl mx-auto shadow-2xl">
          <div className="mb-8">
            <label className="block text-xs uppercase tracking-widest text-atelier-sand font-sans font-medium mb-3">
              Selecione o assunto do seu contato:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((subj) => {
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`p-3.5 rounded-xl text-xs text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'border-atelier-sand bg-atelier-sand/15 text-atelier-bg font-medium'
                        : 'border-atelier-stone/30 hover:border-atelier-stone text-atelier-sand/70'
                    }`}
                  >
                    <span>{subj}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-atelier-sand flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Preview */}
          <div className="p-4 bg-black/40 rounded-xl border border-atelier-stone/20 mb-8">
            <span className="block text-[10px] uppercase tracking-widest text-atelier-stone font-sans mb-1.5">
              Pré-visualização da mensagem WhatsApp:
            </span>
            <p className="font-sans text-xs italic text-atelier-sand/90">
              &ldquo;{generatedBespokeMessage}&rdquo;
            </p>
          </div>

          {/* Primary WhatsApp Button */}
          <div className="space-y-4">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full flex items-center justify-center space-x-3 bg-atelier-sand hover:bg-atelier-sand/90 text-atelier-dark py-4 px-8 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 shadow-lg active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Iniciar Conversa no WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-atelier-stone pt-2">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-atelier-sand/80" />
                <span>Atendimento humano e atencioso</span>
              </span>
              <span className="hidden sm:inline">·</span>
              <span>Horário: Seg a Sex, das 10h às 19h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
