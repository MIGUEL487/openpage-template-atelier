'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FabricScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detecção segura de WebGL
    try {
      const testGl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!testGl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // Configuração de dimensões
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Cena Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161615); // Fundo escuro luxuoso para contraste do tecido

    // Câmera com perspectiva suave
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // Renderer WebGL
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Resolução e segmentação conforme o dispositivo
    const isMobile = window.innerWidth < 768;
    const segmentsX = isMobile ? 48 : 84;
    const segmentsY = isMobile ? 36 : 64;

    // Geometria de plano para a malha têxtil
    const geometry = new THREE.PlaneGeometry(4.8, 3.2, segmentsX, segmentsY);

    // Uniforms do Shader
    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorBase: { value: new THREE.Color('#D9C8B3') }, // Bege cashmere
      uColorShadow: { value: new THREE.Color('#4A4036') }, // Sombra quente
      uColorSheen: { value: new THREE.Color('#FAF8F5') }, // Brilho de seda/fibra
      uLightPos: { value: new THREE.Vector3(2.5, 3.0, 4.0) },
    };

    // Vertex Shader: Ondulação física de tecido + torção e expansão pelo scroll
    const vertexShader = `
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Ondulações orgânicas de tecido
        float wave1 = sin(pos.x * 2.2 + uTime * 1.2) * cos(pos.y * 1.8 + uTime * 0.9) * 0.24;
        float wave2 = cos(pos.x * 4.5 - uTime * 0.8) * sin(pos.y * 3.6 + uTime * 1.1) * 0.08;
        
        // Efeito de interação suave com mouse
        float distToMouse = distance(uv, uMouse);
        float mouseRipple = exp(-distToMouse * 7.0) * sin(distToMouse * 24.0 - uTime * 3.0) * 0.12;

        // Progressão pelo Scroll: dobra, torção e drapeado dinâmico
        float scrollFold = sin(pos.y * 2.5 + uScroll * 4.0) * (0.35 + uScroll * 0.4);
        float scrollTwist = (pos.x * 0.25) * sin(uScroll * 3.1415);

        pos.z += wave1 + wave2 + mouseRipple + scrollFold;
        pos.x += scrollTwist;

        // Rotação suave no espaço 3D conforme rolagem
        float angle = uScroll * 0.55;
        float c = cos(angle);
        float s = sin(angle);
        mat2 rotY = mat2(c, -s, s, c);
        pos.xz = rotY * pos.xz;

        vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Fragment Shader: Simulação de microtrama de tricô (ponto canelado/arroz) e iluminação difusa aveludada
    const fragmentShader = `
      uniform float uTime;
      uniform float uScroll;
      uniform vec3 uColorBase;
      uniform vec3 uColorShadow;
      uniform vec3 uColorSheen;
      uniform vec3 uLightPos;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPos - vPosition);
        vec3 viewDir = normalize(-vPosition);

        // Difusão com transição suave (Half-Lambert para fibras translúcidas de lã/cashmere)
        float NdotL = dot(normal, lightDir);
        float diffuse = clamp(NdotL * 0.65 + 0.35, 0.0, 1.0);

        // Brilho especular sutil aveludado (Sheen/Fresnel têxtil)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.2);

        // Microtextura procedural de malharia (Gauge 12)
        vec2 weaveCoord = vUv * vec2(90.0, 60.0);
        float knitPattern = sin(weaveCoord.x) * cos(weaveCoord.y) * 0.12;

        // Composição de cor luxuosa
        vec3 baseTone = mix(uColorShadow, uColorBase, diffuse + knitPattern);
        vec3 finalColor = mix(baseTone, uColorSheen, fresnel * 0.45);

        // Leve dissolução nas bordas artísticas do scroll
        float edgeAlpha = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x) *
                          smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);

        gl_FragColor = vec4(finalColor, edgeAlpha * (1.0 - uScroll * 0.18));
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animação de Scroll via GSAP ScrollTrigger
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        uniforms.uScroll.value = self.progress;
        // Rotação sincronizada
        mesh.rotation.z = self.progress * 0.28;
      },
    });

    // Interação com o ponteiro (mouse/touch)
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));

      gsap.to(uniforms.uMouse.value, {
        x: normX,
        y: normY,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Loop de renderização com controle de visibilidade (IntersectionObserver)
    let isVisible = true;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const render = () => {
      if (isVisible) {
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        uniforms.uTime.value = elapsedTime;

        // Rotação suave passiva da câmera
        camera.position.x = Math.sin(elapsedTime * 0.25) * 0.15;
        camera.position.y = Math.cos(elapsedTime * 0.2) * 0.1;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Redimensionamento
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup completo
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      scrollTriggerInstance.kill();

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="tecido-3d"
      ref={containerRef}
      className="relative w-full min-h-[95vh] lg:min-h-screen bg-atelier-dark text-atelier-bg flex flex-col justify-between overflow-hidden px-6 lg:px-16 py-20 select-none"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {/* Background Canvas WebGL */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing z-0"
          aria-label="Superfície têxtil interativa tridimensional em Three.js"
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
          style={{ backgroundImage: `url('/images/texture-weave.jpg')` }}
          aria-label="Fallback estático de textura têxtil"
        />
      )}

      {/* Camada de Gradiente Suave para Integração Editorial */}
      <div className="absolute inset-0 bg-gradient-to-t from-atelier-dark via-transparent to-atelier-dark/70 pointer-events-none z-10" />

      {/* Cabeçalho da Seção */}
      <div className="relative z-20 max-w-4xl pt-8 pointer-events-none">
        <span className="inline-block text-xs uppercase tracking-ultra text-atelier-sand/80 font-sans mb-3">
          Experiência 3D · The Fabric
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-atelier-bg">
          O toque da trama sob a luz mineral.
        </h2>
      </div>

      {/* Interação e Controles Centrais */}
      <div className="relative z-20 my-auto pointer-events-none flex flex-col items-center justify-center">
        <div
          className={`px-5 py-2.5 rounded-full border border-atelier-sand/20 bg-atelier-dark/60 backdrop-blur-md text-xs tracking-widest uppercase transition-opacity duration-500 ${
            isInteracting ? 'opacity-30' : 'opacity-85'
          }`}
        >
          Arraste o cursor ou toque para ondular a fibra
        </div>
      </div>

      {/* Rodapé da Seção com Especificações Têxteis */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-atelier-stone/20 text-xs font-sans text-atelier-sand/75 pointer-events-none">
        <div>
          <span className="block text-atelier-bg uppercase tracking-widest font-medium mb-1">
            Fiação & Tensão
          </span>
          <p className="leading-relaxed">
            Ponto canelado duplo com fiação de 2 cabos. O peso do drapeado reage dinamicamente ao movimento.
          </p>
        </div>
        <div>
          <span className="block text-atelier-bg uppercase tracking-widest font-medium mb-1">
            Topologia Procedural
          </span>
          <p className="leading-relaxed">
            Malha tridimensional contínua em WebGL renderizada em tempo real com atenuação de luz física.
          </p>
        </div>
        <div>
          <span className="block text-atelier-bg uppercase tracking-widest font-medium mb-1">
            Geometria Sem Desperdício
          </span>
          <p className="leading-relaxed">
            Cada forma no ateliê é programada em teares retilíneos para eliminar sobras de matéria-prima.
          </p>
        </div>
      </div>
    </section>
  );
}
