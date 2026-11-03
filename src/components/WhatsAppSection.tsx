'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { MessageCircle, ArrowUpRight, CheckCircle2, ShieldCheck, Copy, Info } from 'lucide-react';

export default function WhatsAppSection() {
  const brand = siteConfig.brandContent;
  const isPrecioza = brand.brandId === 'precioza';

  const defaultSubject = isPrecioza
    ? 'Consultar Disponibilidade de Vestidos & Modelos'
    : 'Consultoria de Tamanho e Caimento';

  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [demoBannerShown, setDemoBannerShown] = useState(false);

  const subjects = isPrecioza
    ? [
        'Consultar Disponibilidade de Vestidos & Modelos',
        'Dúvidas sobre Caimento e Medidas',
        'Peças em Tricô e Crochê Artesanal',
        'Localização e Atendimento na Boutique em Monte Sião',
      ]
    : [
        'Consultoria de Tamanho e Caimento',
        'Criação de Peça Sob Medida',
        'Dúvidas sobre Fiação e Calibres',
        'Disponibilidade de Cores Especiais',
      ];

  const generatedBespokeMessage = siteConfig.whatsapp.generateBespokeMessage(selectedSubject);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedBespokeMessage);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = generatedBespokeMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
      return true;
    } catch {
      return false;
    }
  };

  const handleConsultationClick = async () => {
    await copyToClipboard();

    const isLive = process.env.NEXT_PUBLIC_WHATSAPP_LIVE === 'true';
    const hasLivePhone =
      siteConfig.whatsapp.phoneNumber &&
      siteConfig.whatsapp.phoneNumber !== '5511999999999';

    if (isLive && hasLivePhone) {
      const encoded = encodeURIComponent(generatedBespokeMessage);
      const url = `https://wa.me/${siteConfig.whatsapp.phoneNumber}?text=${encoded}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setDemoBannerShown(true);
    }
  };

  return (
    <section
      id="contato"
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-noir text-atelier-bg overflow-hidden"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D9C8B3_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-ultra text-atelier-sand/80 font-sans block mb-3">
            Atendimento Consultivo · {brand.name}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-bg tracking-tight leading-[1.14]">
            {isPrecioza
              ? 'Atendimento atencioso e personalizado.'
              : 'Uma conversa direta com quem entende o fio.'}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-atelier-sand/80 mt-3 leading-relaxed font-light">
            {isPrecioza
              ? 'Tire dúvidas sobre modelos, cores e disponibilidade com a equipe da loja de Monte Sião através do WhatsApp.'
              : 'Nossos consultores têxteis auxiliam você a escolher a gramatura exata para seu estilo de vida.'}
          </p>
        </div>

        {/* Interactive Consultation Card */}
        <div className="bg-atelier-dark/90 backdrop-blur-md rounded-2xl border border-atelier-stone/30 p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl">
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-atelier-sand font-sans font-medium mb-3">
              Selecione o assunto do seu contato:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {subjects.map((subj) => {
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`p-3 rounded-xl text-xs text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'border-atelier-sand bg-atelier-sand/15 text-atelier-bg font-medium'
                        : 'border-atelier-stone/30 hover:border-atelier-stone text-atelier-sand/70'
                    }`}
                  >
                    <span className="line-clamp-2">{subj}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Preview */}
          <div className="p-4 bg-black/40 rounded-xl border border-atelier-stone/20 mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-[10px] uppercase tracking-widest text-atelier-stone font-sans">
                Mensagem contextual preparada:
              </span>
              <button
                onClick={copyToClipboard}
                className="text-[10px] text-atelier-sand hover:text-white flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedNotice ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="font-sans text-xs italic text-atelier-sand/90">
              &ldquo;{generatedBespokeMessage}&rdquo;
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-3">
            <button
              onClick={handleConsultationClick}
              className="w-full flex items-center justify-center space-x-2.5 bg-atelier-sand hover:bg-atelier-sand/90 text-atelier-dark py-3.5 px-6 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 shadow-lg active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Consultar via WhatsApp (Demonstração)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Demonstration Banner */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start space-x-2.5">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-medium block">
                  {copiedNotice
                    ? 'Mensagem copiada para a área de transferência!'
                    : 'Modo Demonstração OpenPage:'}
                </span>
                <span className="text-amber-200/70 block text-[10px]">
                  Ao clicar, a mensagem contextual é copiada. Nenhuma mensagem é disparada e nenhum
                  contato real com a loja é acionado neste template demonstrativo.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-atelier-stone pt-2">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-atelier-sand/80" />
                <span>Atendimento consultivo e respeitoso</span>
              </span>
              <span className="hidden sm:inline">·</span>
              <span>Canal demonstrativo OpenPage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
