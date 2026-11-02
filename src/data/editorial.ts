import { LookbookItem } from '@/types';

export const manifesto = {
  kicker: 'Manifesto · O Tempo da Malha',
  headline: 'Não produzimos para a pressa das estações. Tecemos para a permanência.',
  lead:
    'Existe uma matemática paciente no encontro do fio com a agulha. Cada ponto carrega ar, memória e a decisão deliberada de desacelerar.',
  body: [
    'Enquanto a indústria convencional acelera ciclos efêmeros e costuras plásticas, nosso ateliê investiga o peso exato de cada calibre, a pureza das fibras animais de tosquia ética e o silêncio de uma silhueta que dispensa logotipos.',
    'Acreditamos que o verdadeiro luxo reside naquilo que não grita: no toque imperceptivelmente quente de um cashmere cardado à beira da montanha, no caimento honesto de um fio que respeita o corpo e na dignidade de uma peça feita para atravessar décadas mantendo sua forma original.',
  ],
  quote: '“A malha é a arquitetura mais íntima: aquela que se molda à respiração.”',
  author: 'Caderno de Criação ATELIER · 2026',
};

export const collectionStory = {
  kicker: 'Coleção Permanente · Vol. 01',
  title: 'Origens & Silêncio',
  subtitle:
    'Um estudo sobre volumes desconstruídos, paleta mineral e a precisão milimétrica dos pontos artesanais.',
  stats: [
    { value: '15.5µ', label: 'Micragem da fibra de cashmere mongol' },
    { value: '7 a 14', label: 'Variação de calibres para todas as estações' },
    { value: '100%', label: 'Origem natural rastreada e tosquia ética' },
    { value: '0', label: 'Fibras sintéticas ou tingimento com metais pesados' },
  ],
};

export const lookbookItems: LookbookItem[] = [
  {
    id: 'lb-1',
    title: 'O Respiro da Trama',
    subtitle: 'Look 01 · Pullover Altamira sobre linho cru',
    yarn: 'Lã Merino Extrafina 19.5µ · Calibre 5',
    image: '/images/lookbook-1.jpg',
    aspect: 'portrait',
    quote: 'Textura tridimensional em ponto semente desenhada para captar a luz natural do amanhecer.',
  },
  {
    id: 'lb-2',
    title: 'A Escultura do Peso',
    subtitle: 'Look 02 · Casaco 3/4 Canelado Arcos',
    yarn: 'Lã Merino Cardada Virgem · Calibre 3',
    image: '/images/lookbook-2.jpg',
    aspect: 'landscape',
    quote: 'Volume estruturado que dispensa entretelas sintéticas, mantendo caimento escultural.',
  },
  {
    id: 'lb-3',
    title: 'Fluidez Mineral',
    subtitle: 'Look 03 · Cardigan Selene em Cashmere',
    yarn: 'Cashmere Penteado 4 cabos · Calibre 7',
    image: '/images/lookbook-3.jpg',
    aspect: 'portrait',
    quote: 'Ombros caídos e linhas assimétricas concebidas para sobreposições táteis.',
  },
  {
    id: 'lb-4',
    title: 'O Toque na Pele',
    subtitle: 'Look 04 · Suéter Ulan em Gola Rulê',
    yarn: 'Cashmere Mongol Grau A · Calibre 12',
    image: '/images/lookbook-4.jpg',
    aspect: 'square',
    quote: 'Acabamento sem costuras que abraça a silhueta com suavidade imperceptível.',
  },
];

export const atelierStory = {
  badge: 'Herança & Ofício Artesanal',
  title: 'Onde a tradição têxtil encontra o design contemporâneo.',
  paragraph1:
    'Fundado com a premissa de resgatar o valor do tear e da malharia fina, nosso espaço de produção une teares retilíneos de precisão milimétrica a técnicas manuais de remalhação ponto a ponto. Cada painel de malha é desenhado em proporções exatas, gerando resíduo têxtil virtualmente nulo.',
  paragraph2:
    'Todas as fibras que selecionamos têm procedência comprovada: o cashmere vem de rebanhos livres na Mongólia Interior com certificação de bem-estar animal; a lã merino provém de fazendas sustentáveis com regeneração de pastagens. Não usamos poliéster, poliamida ou acrílico em nossas composições principais.',
  highlightBox: {
    title: 'Template Demonstrativo OpenPage',
    description:
      'Este website é um modelo conceitual demonstrativo concebido pela OpenPage para ateliês, tecelagens e malharias autorais. Permite personalização completa de catálogo, visualização tridimensional e canal de atendimento consultivo via WhatsApp.',
  },
};

export const careGuide = [
  {
    step: '01',
    title: 'Lavagem suave',
    description: 'Lave à mão em água fria com sabão neutro para lãs. Evite torcer a peça.',
  },
  {
    step: '02',
    title: 'Secagem horizontal',
    description: 'Retire o excesso de água em uma toalha e seque à sombra na horizontal para não deformar.',
  },
  {
    step: '03',
    title: 'Descanso do fio',
    description: 'Alterne os dias de uso para que a fibra animal retorne naturalmente à sua elasticidade.',
  },
  {
    step: '04',
    title: 'Armazenamento',
    description: 'Nunca pendure em cabides convencionais. Dobre delicadamente com saquinho de algodão.',
  },
];
