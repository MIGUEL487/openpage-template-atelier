# ATELIER — Malharia Contemporânea
### Template Demonstrativo OpenPage · Luxury Knitwear Experience

[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare_Workers_Static_Assets-F38020?logo=cloudflare&logoColor=white)](https://openpage-template-atelier.mi-c-openheimer.workers.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://gsap.com/)

---

## 🌐 Demonstração Online

- **Link oficial no Cloudflare:** [https://openpage-template-atelier.mi-c-openheimer.workers.dev](https://openpage-template-atelier.mi-c-openheimer.workers.dev)
- **Repositório GitHub:** [https://github.com/MIGUEL487/openpage-template-atelier](https://github.com/MIGUEL487/openpage-template-atelier)

---

## 🏛️ Conceito e Direção Criativa

O **ATELIER — Malharia Contemporânea** é um modelo demonstrativo de alta costura desenvolvido para a plataforma **OpenPage**, concebido para ateliês, tecelagens autorais e malharias finas.

- **Estética:** *Quiet Luxury Meets Digital Art* — inspirada no acabamento editorial de marcas como COS, Jacquemus e The Row.
- **Paleta Cromática:**
  - Off-white (`#F6F3ED`) e Cru (`#FAF8F5`)
  - Bege areia mineral (`#D9C8B3`)
  - Preto suave (`#20201E`) e Grafite profundo (`#161615`)
  - Cinza pedra quente (`#89847E`)
- **Tipografia:** Contraste intencional entre o classicismo da família serif *Cormorant Garamond* nos títulos e a precisão técnica da *Inter* no corpo e microdados.
- **Arquitetura Comercial:** Foco em consultoria sob medida e catálogo com geração de mensagens contextuais de WhatsApp. **Não há checkout nem carrinho financeiro**, respeitando o modelo de atendimento próximo e consultivo de ateliês de luxo.

---

## 🧵 The Fabric — Experiência 3D com Three.js

O elemento central da experiência é a seção interativa **The Fabric**, desenvolvida com **Three.js** e shaders GLSL personalizados:

1. **Simulação de Tecido em Tempo Real:** Geometria deformada proceduralmente via vertex shader com ondas harmônicas sobrepostas, simulando o comportamento tátil de uma manta de cashmere ou lã merino.
2. **Microtextura & Sheen:** Fragment shader com cálculo de difusão aveludada (*Half-Lambert*) e iluminação especular (*Fresnel*) para reproduzir o brilho sedoso das fibras naturais.
3. **Sincronização com ScrollTrigger:** A torção, rotação da câmera e o drapeado do tecido respondem ao avanço do scroll do visitante.
4. **Interação com Ponteiro:** O tecido reage suavemente à passagem do cursor ou toque em dispositivos móveis.
5. **Eficiência Energética:** O loop de animação é automaticamente pausado via `IntersectionObserver` quando a seção sai do campo de visão.

---

## ⚡ Motion Design & Rolagem Fluida

- **GSAP 3 + ScrollTrigger:** Transições cinematográficas de entrada no hero com máscaras de clipping, revelações por linha de texto e efeitos de parallax nos editoriais do lookbook.
- **Lenis Smooth Scroll:** Rolagem inercial de alta precisão sincronizada ao ticker do GSAP (`gsap.ticker.add((time) => lenis.raf(time * 1000))`), garantindo um único loop RAF sem engasgos.
- **Acessibilidade:** Suporte total a `prefers-reduced-motion`, com degradação graciosa para transições instantâneas quando solicitado pelo sistema operacional.

---

## 📦 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (Exportação Estática) |
| Biblioteca UI | React 19 & TypeScript |
| Estilização | Tailwind CSS |
| Motor 3D | Three.js (WebGL com Custom Shaders) |
| Coreografia de Movimento | GSAP 3 & ScrollTrigger |
| Rolagem Suave | Lenis |
| Ícones | Lucide React |
| Deploy & Edge CDN | Cloudflare Workers Static Assets |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ (recomendado Node 20 ou 22)
- npm ou pnpm

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/MIGUEL487/openpage-template-atelier.git
cd openpage-template-atelier

# 2. Instalar dependências
npm install

# 3. Rodar em ambiente de desenvolvimento
npm run dev

# Acesse no navegador: http://localhost:3000
```

### Build e Exportação Estática

```bash
npm run build
```
O build estático otimizado é gerado na pasta `./out`.

---

## ☁️ Deploy no Cloudflare

O projeto está configurado para publicação no Cloudflare via **Wrangler**:

```bash
npx wrangler deploy --config wrangler.json
```

A configuração em `wrangler.json` utiliza **Workers Static Assets**, entregando todos os recursos com cache global e latência mínima.

---

## 📷 Licenças e Atribuição de Ativos

- **Fotografia:** Todas as imagens editoriais de moda e tecelagem foram obtidas de criadores licenciados no Unsplash (uso comercial e não comercial livre).
- **Copywriting:** Todos os textos, nomes de produtos, categorias, manifestos e descrições técnicas foram criados exclusivamente para este projeto em português brasileiro (`pt-BR`).

---

## ✒️ Créditos

- **Projeto:** OpenPage — Template A: ATELIER
- **Desenvolvimento:** [MIGUEL487](https://github.com/MIGUEL487)
- **Licença:** MIT
