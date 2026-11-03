import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Semântica Preto + Dourado (Precioza Tricot)
        'bg-base': '#0B0B0A',      // fundo principal (preto quente)
        'bg-raised': '#141311',    // seções alternadas, cards
        'bg-soft': '#1C1A17',      // superfícies, modal, inputs
        'line': '#2A2723',         // divisores/bordas sutis
        'gold': '#B19462',         // dourado acento primário (amostrado do logo)
        'gold-light': '#D6BC8B',   // hover, realces, textos de destaque
        'gold-deep': '#8A7248',    // linhas finas, ícones discretos
        'ivory': '#F3EDE2',        // texto principal sobre preto
        'stone': '#A39B8E',        // texto secundário (contraste ≥ 4.5:1)

        // Mapeamento retrocompatível para classes existentes
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
        serif: ['var(--font-cormorant)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.28em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
