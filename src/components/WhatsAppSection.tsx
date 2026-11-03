'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { MessageCircle, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function WhatsAppSection() {
  const brand = siteConfig.brandContent;

  const [selectedSubject, setSelectedSubject] = useState(
    'Consultar Disponibilidade de Vestidos & Modelos'
  );

  const subjects = [
    'Consultar Disponibilidade de Vestidos & Modelos',
    'Dúvidas sobre Caimento e Medidas',
    'Peças em Tricô e Crochê Artesanal',
    'Localização e Atendimento na Boutique em Monte Sião',
  ];

  const generatedBespokeMessage = siteConfig.whatsapp.generateBespokeMessage(selectedSubject);

  const handleConsultationClick = () => {
    const url = siteConfig.whatsapp.getWhatsAppUrl(generatedBespokeMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contato"
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-bg-raised text-ivory overflow-hidden border-b border-line"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-gold/10 via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading and Brand Identity */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium">
              <span className="w-8 h-[1px] bg-gold" />
              <span>ATENDIMENTO EXCLUSIVO</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.12] text-ivory tracking-tight">
              Sua Consultoria Pessoal em Malharia de Monte Sião
            </h2>

            <p className="font-sans text-sm sm:text-base text-stone leading-relaxed font-light">
              Estamos à disposição para apresentar opções de cores, esclarecer dúvidas sobre a grade de tamanhos,
              composições de fiação e orientar no envio seguro para todo o território nacional.
            </p>

            {/* Direct Boutique Contact Specs */}
            <div className="pt-4 space-y-3 font-sans text-xs text-stone">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Atendimento humanizado diretamente pela equipe da boutique</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Orientação personalizada de medidas e caimentos</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Envio rápido e seguro para todo o Brasil</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Card */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-2xl bg-bg-soft border border-line shadow-2xl space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-gold-deep font-sans block mb-2 font-medium">
                  Selecione o Assunto de Sua Consulta
                </span>
                <div className="space-y-2 mt-3">
                  {subjects.map((subj) => {
                    const isSelected = selectedSubject === subj;
                    return (
                      <button
                        key={subj}
                        onClick={() => setSelectedSubject(subj)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-sans transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-gold/15 border-gold text-ivory font-medium'
                            : 'bg-bg-base/70 border-line text-stone hover:border-gold/40 hover:text-ivory'
                        }`}
                      >
                        <span>{subj}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Preview */}
              <div className="p-4 rounded-xl bg-bg-base/90 border border-line text-xs font-sans text-stone space-y-1.5">
                <span className="text-gold-light text-[10px] uppercase tracking-wider block font-medium">
                  Mensagem que será enviada:
                </span>
                <p className="italic text-ivory/90 leading-relaxed font-serif text-sm">
                  &ldquo;{generatedBespokeMessage}&rdquo;
                </p>
              </div>

              {/* Action Button: Opens WhatsApp directly */}
              <button
                onClick={handleConsultationClick}
                className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gold text-bg-base font-semibold hover:bg-gold-light font-sans text-xs uppercase tracking-widest transition-all duration-200 shadow-xl group"
              >
                <MessageCircle className="w-4 h-4 text-bg-base fill-bg-base" />
                <span>Iniciar Conversa no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-bg-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="text-center text-[11px] text-stone font-sans">
                <span>Número da Loja: </span>
                <span className="text-gold-light font-medium">(35) 99228-7718</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
