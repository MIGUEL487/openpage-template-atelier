'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isWebGLAvailable } from '@/utils/webgl';
import { siteConfig } from '@/config/site';

export default function HeroFabricDrape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    // 1. Verificação isolada de WebGL sem vazamento
    if (!isWebGLAvailable()) {
      return;
    }
    setHasWebGL(true);

    const container = containerRef.current;
    if (!container) return;

    // Prefers-reduced-motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // 2. Dimensões
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 3. Cena e Câmera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    // 4. Renderer seguro com parâmetros otimizados para performance
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile, // Desativa antialias no mobile para economizar GPU
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch (e) {
      console.warn('[Hero 3D Drape] Não foi possível inicializar WebGLRenderer:', e);
      setHasWebGL(false);
      return;
    }

    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.25)
      : Math.min(window.devicePixelRatio || 1, 1.5);

    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 5. Geometria de Drapeado Têxtil Suave
    const segX = isMobile ? 24 : 48;
    const segY = isMobile ? 18 : 36;
    const geometry = new THREE.PlaneGeometry(5.2, 3.4, segX, segY);

    // Calibração de cores para tema escuro e dourado (Seção 3)
    const colorBase = '#B19462'; // Dourado principal da Precioza
    const colorShadow = '#2E2413'; // Sombra mineral quente
    const colorSheen = '#D6BC8B'; // Brilho de seda dourada suave

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorBase: { value: new THREE.Color(colorBase) },
      uColorShadow: { value: new THREE.Color(colorShadow) },
      uColorSheen: { value: new THREE.Color(colorSheen) },
    };

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

        // Ondulações lentíssimas e elegantes de seda/cashmere
        float waveA = sin(pos.x * 1.8 + uTime * 0.45) * cos(pos.y * 1.4 + uTime * 0.35) * 0.18;
        float waveB = cos(pos.x * 3.2 - uTime * 0.25) * sin(pos.y * 2.6 + uTime * 0.3) * 0.06;

        // Resposta suave ao ponteiro
        float dist = distance(uv, uMouse);
        float ripple = exp(-dist * 5.0) * sin(dist * 16.0 - uTime * 1.5) * 0.04;

        // Leve rotação e elevação com o scroll
        float scrollDip = sin(pos.y * 1.8 + uScroll * 2.5) * 0.15;

        pos.z += waveA + waveB + ripple + scrollDip;

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
        vec3 lightDir = normalize(vec3(1.5, 2.5, 3.0));
        vec3 viewDir = normalize(-vPosition);

        // Iluminação difusa suave para tecido nobre
        float NdotL = dot(normal, lightDir);
        float diffuse = clamp(NdotL * 0.5 + 0.5, 0.0, 1.0);

        // Brilho aveludado leve (sheen de malharia/seda)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.35;

        vec3 tone = mix(uColorShadow, uColorBase, diffuse);
        vec3 finalColor = mix(tone, uColorSheen, fresnel);

        // Desvanecimento suave nas bordas para blend atmosférico sobre fundo preto
        float alpha = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                      smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

        // Opacidade baixa (<= 0.28) sobre preto
        gl_FragColor = vec4(finalColor, alpha * 0.26);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0.6, 0.1, 0);
    mesh.rotation.z = -0.06;
    scene.add(mesh);

    // 6. Loop de Renderização com controle de RAF inteligente
    let rafId: number | null = null;
    let isDisposed = false;
    let isVisible = true;
    let targetMouse = new THREE.Vector2(0.5, 0.5);
    let currentMouse = new THREE.Vector2(0.5, 0.5);
    const clock = new THREE.Clock();

    const render = () => {
      if (isDisposed) return;

      if (isVisible && !prefersReducedMotion) {
        const delta = clock.getDelta();
        uniforms.uTime.value += Math.min(delta, 0.1) * 0.6;

        // Interpolação suave do mouse (lerp)
        currentMouse.lerp(targetMouse, 0.04);
        uniforms.uMouse.value.copy(currentMouse);

        renderer.render(scene, camera);
      }

      rafId = requestAnimationFrame(render);
    };

    const startRaf = () => {
      if (rafId === null) {
        clock.start();
        rafId = requestAnimationFrame(render);
      }
    };

    const stopRaf = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    startRaf();

    // 7. Pausa de renderização quando fora de vista via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startRaf();
          } else {
            stopRaf();
          }
        });
      },
      { rootMargin: '100px' }
    );
    observer.observe(container);

    // 8. Otimização de Mouse Move com Throttling
    let mouseTimeout: NodeJS.Timeout | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseTimeout) return;
      mouseTimeout = setTimeout(() => {
        mouseTimeout = null;
      }, 30);

      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      targetMouse.set(x, y);
    };

    if (!isTouch && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // 9. Conexão ao ScrollTrigger para aceleração e rotação suave
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self: any) => {
        uniforms.uScroll.value = self.progress;
      },
    });

    // 10. Pause no tab blur / retorno de visibilidade da página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRaf();
      } else if (isVisible) {
        startRaf();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 11. Redimensionamento seguro com debounce
    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!containerRef.current || isDisposed) return;
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // 12. Tratamento do contexto WebGL perdido
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      stopRaf();
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);

    // Cleanup completo
    return () => {
      isDisposed = true;
      stopRaf();
      if (mouseTimeout) clearTimeout(mouseTimeout);
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      observer.disconnect();
      trigger.kill();

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      try {
        const gl = renderer.getContext();
        const loseExt = gl.getExtension('WEBGL_lose_context');
        loseExt?.loseContext();
      } catch {
        // Ignora se já estiver liberado
      }

      if (container.contains(canvasEl)) {
        container.removeChild(canvasEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-gold/30 to-transparent blur-3xl" />
        </div>
      )}
    </div>
  );
}
