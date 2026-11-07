import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/config/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Semântica Preto + Dourado + Marfim (Referência Thread / Atelier adaptada)
        'bg-base': '#0B0B0A',      // preto quente (fundo hero, blocos escuros)
        'bg-raised': '#141311',    // preto secundário elevado (cards, painel loja)
        'bg-soft': '#1C1A17',      // superfícies de apoio, modal, inputs
        'line': '#2A2723',         // divisores/linhas 1px sobre escuro
        'gold': '#B19462',         // dourado primário (amostrado do logo)
        'gold-light': '#D6BC8B',   // hover dourado, realces
        'gold-deep': '#8A7248',    // linhas finas douradas, kickers sobre escuro
        'ivory': '#F3EDE2',        // marfim (fundo da seção coleção/lookbook e texto claro sobre escuro)
        'ivory-line': '#D9CFBF',   // linha fina 1px sobre marfim
        'ink': '#16140F',          // texto escuro principal sobre marfim
        'ink-soft': '#6B645A',     // texto secundário escuro sobre marfim
        'stone': '#A39B8E',        // texto secundário claro sobre escuro (contraste ≥ 4.5:1)

        // Retrocompatibilidade
        atelier: {
          bg: '#0B0B0A',
          ecru: '#141311',
          sand: '#B19462',
          stone: '#A39B8E',
          noir: '#F3EDE2',
          dark: '#0B0B0A',
          border: '#2A2723',
          subtle: '#1C1A17',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.22em',
        ultra: '0.26em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
