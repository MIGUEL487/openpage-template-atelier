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

    // Calibração de cores com base na marca ativa
    const isPrecioza = siteConfig.brand === 'precioza';
    const colorBase = isPrecioza ? '#E5D8C3' : '#D9C8B3'; // Champanhe dourado suave
    const colorShadow = isPrecioza ? '#C5B49D' : '#B8A99A'; // Sombra mineral
    const colorSheen = isPrecioza ? '#FCFAF5' : '#FAF8F5'; // Brilho de seda

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

        // Desvanecimento suave nas bordas para blend perfeito com o fundo claro
        float alpha = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                      smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

        gl_FragColor = vec4(finalColor, alpha * 0.35);
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
    mesh.position.set(-0.2, 0.1, 0);
    mesh.rotation.z = -0.05;
    scene.add(mesh);

    // 6. Integração com GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self: any) => {
        uniforms.uScroll.value = self.progress;
        mesh.rotation.z = -0.05 + self.progress * 0.12;
      },
    });

    // 7. Mouse Listener com throttling e desativado em touch
    let mouseTimeout: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      if (mouseTimeout) return;

      mouseTimeout = window.setTimeout(() => {
        mouseTimeout = null;
      }, 30);

      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = 1 - (e.clientY - rect.top) / rect.height;

      uniforms.uMouse.value.x = normX;
      uniforms.uMouse.value.y = normY;
    };

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // 8. Loop de animação com pausa real do RAF quando invisível ou aba oculta
    let isVisible = true;
    let isTabActive = document.visibilityState === 'visible';
    let isDisposed = false;
    let animId: number | null = null;
    const clock = new THREE.Clock();

    const startRaf = () => {
      if (animId !== null || isDisposed || prefersReducedMotion) return;

      const render = () => {
        if (isDisposed) return;
        if (isVisible && isTabActive) {
          uniforms.uTime.value = clock.getElapsedTime();
          renderer.render(scene, camera);
          animId = requestAnimationFrame(render);
        } else {
          animId = null;
        }
      };

      animId = requestAnimationFrame(render);
    };

    const stopRaf = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible && isTabActive) {
            startRaf();
          } else {
            stopRaf();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    const handleVisibilityChange = () => {
      isTabActive = document.visibilityState === 'visible';
      if (isTabActive && isVisible) {
        startRaf();
      } else {
        stopRaf();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!prefersReducedMotion && isVisible && isTabActive) {
      startRaf();
    } else {
      renderer.render(scene, camera);
    }

    // 9. Resize
    const handleResize = () => {
      if (isDisposed || !container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 10. Tratamento de perda e restauração de contexto WebGL
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
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-atelier-sand/40 to-transparent blur-3xl" />
        </div>
      )}
    </div>
  );
}
