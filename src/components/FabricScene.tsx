'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { isWebGLAvailable } from '@/utils/webgl';
import { Layers, ShieldCheck, Sparkles, Sliders } from 'lucide-react';

interface FabricSceneProps {
  /**
   * Caminho opcional para modelo 3D externo (.glb / .gltf)
   * Se omitido, renderiza a escultura têxtil procedural atmosférica.
   */
  modelUrl?: string;
}

export default function FabricScene({ modelUrl }: FabricSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // 1. Verificação isolada de WebGL
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Dimensões do container
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // 3. Cena e Câmera com iluminação suave de estúdio editorial
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.6);

    // 4. Criação do Renderer com proteção total contra falha
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('[FabricScene] Erro ao instanciar WebGLRenderer:', e);
      setHasWebGL(false);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Grupo raiz para rotação coordenada
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Luzes da cena (quentes, editoriais e desaturadas)
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(3.5, 4.0, 3.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8e2d8, 0.9);
    fillLight.position.set(-3.0, -1.0, 2.0);
    scene.add(fillLight);

    // 5. Carregamento de Modelo GLTF ou Geometria Procedural de Malharia
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.Material | null = null;
    let isDisposed = false;

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColorBase: { value: new THREE.Color('#D9C8B3') }, // Bege areia de cashmere
      uColorShadow: { value: new THREE.Color('#AC9C8B') }, // Sombra suave mineral
      uColorSheen: { value: new THREE.Color('#FAF8F5') }, // Brilho de seda crua
    };

    if (modelUrl) {
      // Suporte preparado para arquivo GLB/GLTF externo fornecido pelo usuário
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf: any) => {
          if (isDisposed) return;
          const model = gltf.scene;
          model.scale.set(1.5, 1.5, 1.5);
          sceneGroup.add(model);
        },
        undefined,
        (error: any) => {
          console.warn('[FabricScene] Falha ao carregar GLTF externo, mantendo drapeado procedural:', error);
          initProceduralDrape();
        }
      );
    } else {
      initProceduralDrape();
    }

    function initProceduralDrape() {
      const isMobile = width < 768;
      const segX = isMobile ? 36 : 64;
      const segY = isMobile ? 28 : 48;
      geometry = new THREE.PlaneGeometry(5.0, 3.2, segX, segY);

      const vertexShader = `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Ondulações lentas e escultóricas de tecido de luxo
          float w1 = sin(pos.x * 1.6 + uTime * 0.35) * cos(pos.y * 1.3 + uTime * 0.28) * 0.22;
          float w2 = cos(pos.x * 2.8 - uTime * 0.2) * sin(pos.y * 2.2 + uTime * 0.25) * 0.07;
          
          // Drapeado que respira sutilmente com o scroll
          float scrollDrape = sin(pos.y * 1.5 + uScroll * 3.0) * 0.16;

          pos.z += w1 + w2 + scrollDrape;
          pos.x += (pos.y * 0.08) * sin(uScroll * 2.0);

          vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragmentShader = `
        uniform vec3 uColorBase;
        uniform vec3 uColorShadow;
        uniform vec3 uColorSheen;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 lightDir = normalize(vec3(2.5, 3.5, 3.0));
          vec3 viewDir = normalize(-vPosition);

          // Difusão refinada estilo Half-Lambert para fibras têxteis
          float NdotL = dot(normal, lightDir);
          float diffuse = clamp(NdotL * 0.55 + 0.45, 0.0, 1.0);

          // Sheen aveludado característico de lã merino e cashmere
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.42;

          vec3 baseTone = mix(uColorShadow, uColorBase, diffuse);
          vec3 finalColor = mix(baseTone, uColorSheen, fresnel);

          // Desvanecimento sutil nas bordas para integração perfeita ao fundo claro
          float edgeAlpha = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) *
                            smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);

          gl_FragColor = vec4(finalColor, edgeAlpha * 0.45);
        }
      `;

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -0.15;
      mesh.rotation.y = 0.2;
      mesh.position.set(0.3, 0, 0);
      sceneGroup.add(mesh);
    }

    // 6. GSAP ScrollTrigger para rotação lenta e sutil
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.8,
      onUpdate: (self: any) => {
        uniforms.uScroll.value = self.progress;
        sceneGroup.rotation.y = 0.2 + (self.progress - 0.5) * 0.35;
        sceneGroup.rotation.z = (self.progress - 0.5) * 0.12;
      },
    });

    // 7. Loop de Renderização com IntersectionObserver
    let isVisible = true;
    let animId: number;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const render = () => {
      if (isDisposed) return;
      if (isVisible && !prefersReducedMotion) {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      }
      animId = requestAnimationFrame(render);
    };

    if (!prefersReducedMotion) {
      render();
    } else {
      renderer.render(scene, camera);
    }

    // 8. Resize Listener
    const handleResize = () => {
      if (isDisposed || !container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    window.addEventListener('resize', handleResize);

    // 9. Context Lost Handler
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[FabricScene] WebGL Context Lost');
      setHasWebGL(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    // 10. Cleanup Seguro
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      observer.disconnect();
      trigger.kill();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  return (
    <section
      id="tecido-3d"
      className="relative w-full py-28 lg:py-36 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50 overflow-hidden"
    >
      {/* 3D Atmospheric Background Layer (Discreto, integrado e com baixa opacidade) */}
      {hasWebGL ? (
        <div
          ref={containerRef}
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40 mix-blend-multiply transition-opacity duration-1000"
          aria-hidden="true"
        />
      ) : (
        /* Fallback estático suave se WebGL não estiver disponível */
        <div
          className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center opacity-10 filter blur-sm"
          style={{ backgroundImage: `url('/images/texture-weave.jpg')` }}
          aria-hidden="true"
        />
      )}

      {/* Camada sutil de gradiente para suavizar ainda mais a transição */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-r from-atelier-ecru via-atelier-ecru/80 to-transparent" />

      {/* Conteúdo Editorial em Primeiro Plano (100% legível e não obstruído) */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-3 text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-3">
            <span className="w-8 h-[1px] bg-atelier-stone/50" />
            <span>A Arquitetura da Trama · Estudo Tridimensional</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight leading-[1.14]">
            A geometria do fio por trás do caimento natural.
          </h2>
          <p className="font-sans text-sm sm:text-base text-atelier-stone mt-4 leading-relaxed">
            Cada ponto de malha é calculado para equilibrar tensão e respiro. A simulação tridimensional ao
            fundo expressa a física da fibra em movimento: o peso que molda a silhueta sem rigidez.
          </p>
        </div>

        {/* 4 Cards Estruturais de Especificação Têxtil (Double-bezel, discretos e informativos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-1.5 rounded-2xl bg-white/40 ring-1 ring-black/5 backdrop-blur-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="p-6 rounded-[calc(1rem-0.125rem)] bg-white/70 border border-atelier-border/60 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-atelier-stone">
                <span className="font-serif text-2xl text-atelier-noir">15.5µ</span>
                <Sparkles className="w-4 h-4 text-atelier-sand" />
              </div>
              <div>
                <h3 className="font-serif text-base text-atelier-noir font-medium mb-1">
                  Cashmere Mongol Grau A
                </h3>
                <p className="font-sans text-xs text-atelier-stone leading-relaxed">
                  Micragem ultrafina selecionada nas estepes. Toque aveludado que isola a temperatura sem pesar.
                </p>
              </div>
            </div>
          </div>

          <div className="p-1.5 rounded-2xl bg-white/40 ring-1 ring-black/5 backdrop-blur-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="p-6 rounded-[calc(1rem-0.125rem)] bg-white/70 border border-atelier-border/60 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-atelier-stone">
                <span className="font-serif text-2xl text-atelier-noir">Cal. 3 a 14</span>
                <Sliders className="w-4 h-4 text-atelier-sand" />
              </div>
              <div>
                <h3 className="font-serif text-base text-atelier-noir font-medium mb-1">
                  Variação de Calibres
                </h3>
                <p className="font-sans text-xs text-atelier-stone leading-relaxed">
                  Do canelado encorpado do casaco de inverno à trama arejada da camisa polo em linho.
                </p>
              </div>
            </div>
          </div>

          <div className="p-1.5 rounded-2xl bg-white/40 ring-1 ring-black/5 backdrop-blur-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="p-6 rounded-[calc(1rem-0.125rem)] bg-white/70 border border-atelier-border/60 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-atelier-stone">
                <span className="font-serif text-2xl text-atelier-noir">0% Sobras</span>
                <Layers className="w-4 h-4 text-atelier-sand" />
              </div>
              <div>
                <h3 className="font-serif text-base text-atelier-noir font-medium mb-1">
                  Construção Fully-Fashioned
                </h3>
                <p className="font-sans text-xs text-atelier-stone leading-relaxed">
                  Cada painel é tecido na forma exata da peça diretamente no tear, eliminando retalhos.
                </p>
              </div>
            </div>
          </div>

          <div className="p-1.5 rounded-2xl bg-white/40 ring-1 ring-black/5 backdrop-blur-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="p-6 rounded-[calc(1rem-0.125rem)] bg-white/70 border border-atelier-border/60 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-atelier-stone">
                <span className="font-serif text-2xl text-atelier-noir">Ponto a Ponto</span>
                <ShieldCheck className="w-4 h-4 text-atelier-sand" />
              </div>
              <div>
                <h3 className="font-serif text-base text-atelier-noir font-medium mb-1">
                  Remalhação Artesanal
                </h3>
                <p className="font-sans text-xs text-atelier-stone leading-relaxed">
                  Costuras planas remalhadas manualmente para acabamento invisível e conforto contínuo na pele.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé informativo discreto */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-sans text-atelier-stone pt-6 border-t border-atelier-border/50 gap-4">
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-atelier-sand" />
            <span>Renderização tridimensional em tempo real via Three.js WebGL</span>
          </span>
          <span className="text-[11px] uppercase tracking-widest text-atelier-stone/80">
            Arquitetura preparada para carregamento de modelos GLTF/GLB
          </span>
        </div>
      </div>
    </section>
  );
}
