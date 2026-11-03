'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isWebGLAvailable } from '@/utils/webgl';
import { siteConfig } from '@/config/site';

interface FabricSceneProps {
  modelUrl?: string;
}

export default function FabricScene({ modelUrl }: FabricSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);

  // 1. Lazy loading & descarte do contexto WebGL com IntersectionObserver
  // Garante que apenas um contexto WebGL fique ativo por vez no navegador
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { rootMargin: '300px 0px 300px 0px', threshold: 0.01 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // 2. Inicialização e destruição do WebGL vinculada estritamente à visibilidade da seção
  useEffect(() => {
    if (!isInViewport) return;
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 550;
    const isMobile = width < 768;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch (e) {
      console.warn('[FabricScene] Erro ao instanciar WebGLRenderer:', e);
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

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Iluminação cênica suave de ateliê
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
    keyLight.position.set(3.5, 4.0, 3.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8e2d8, 0.8);
    fillLight.position.set(-3.0, -1.0, 2.0);
    scene.add(fillLight);

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.Material | null = null;
    let isDisposed = false;

    // Calibração de cores com base na marca
    const isPrecioza = siteConfig.brand === 'precioza';
    const colorBase = isPrecioza ? '#E2D5BF' : '#D9C8B3';
    const colorShadow = isPrecioza ? '#BFA98F' : '#AC9C8B';
    const colorSheen = isPrecioza ? '#FCFAF5' : '#FAF8F5';

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColorBase: { value: new THREE.Color(colorBase) },
      uColorShadow: { value: new THREE.Color(colorShadow) },
      uColorSheen: { value: new THREE.Color(colorSheen) },
    };

    if (modelUrl) {
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
        () => {
          initProceduralDrape();
        }
      );
    } else {
      initProceduralDrape();
    }

    function initProceduralDrape() {
      const segX = isMobile ? 28 : 56;
      const segY = isMobile ? 22 : 44;
      geometry = new THREE.PlaneGeometry(5.4, 3.6, segX, segY);

      const vertexShader = `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float wave1 = sin(pos.x * 1.5 + uTime * 0.4) * cos(pos.y * 1.2 + uTime * 0.3) * 0.22;
          float wave2 = cos(pos.x * 2.8 - uTime * 0.2) * sin(pos.y * 2.2 + uTime * 0.25) * 0.08;
          float scrollTwist = sin(pos.y * 1.5 + uScroll * 3.0) * 0.16;

          pos.z += wave1 + wave2 + scrollTwist;

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
          vec3 lightDir = normalize(vec3(2.0, 3.0, 3.5));
          vec3 viewDir = normalize(-vPosition);

          float NdotL = dot(normal, lightDir);
          float diffuse = clamp(NdotL * 0.5 + 0.5, 0.0, 1.0);
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.35;

          vec3 tone = mix(uColorShadow, uColorBase, diffuse);
          vec3 finalColor = mix(tone, uColorSheen, fresnel);

          float alpha = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) *
                        smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);

          gl_FragColor = vec4(finalColor, alpha * 0.32);
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
      mesh.position.set(0, 0, 0);
      sceneGroup.add(mesh);
    }

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self: any) => {
        uniforms.uScroll.value = self.progress;
        sceneGroup.rotation.y = (self.progress - 0.5) * 0.25;
      },
    });

    let animId: number | null = null;
    let isTabActive = document.visibilityState === 'visible';
    const clock = new THREE.Clock();

    const startRaf = () => {
      if (animId !== null || isDisposed || prefersReducedMotion) return;

      const render = () => {
        if (isDisposed) return;
        if (isTabActive) {
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

    const handleVisibilityChange = () => {
      isTabActive = document.visibilityState === 'visible';
      if (isTabActive) {
        startRaf();
      } else {
        stopRaf();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!prefersReducedMotion && isTabActive) {
      startRaf();
    } else {
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      if (isDisposed || !container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isDisposed = true;
      stopRaf();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      trigger.kill();

      geometry?.dispose();
      material?.dispose();
      renderer.dispose();

      try {
        const gl = renderer.getContext();
        const loseExt = gl.getExtension('WEBGL_lose_context');
        loseExt?.loseContext();
      } catch {
        // Ignora se já liberado
      }

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isInViewport, modelUrl]);

  const fabricData = siteConfig.brandContent.fabricData;

  return (
    <section
      id="tecido-3d"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-atelier-ecru border-b border-atelier-border/50 overflow-hidden"
    >
      {/* 3D Atmospheric Canvas Layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-90"
        aria-hidden="true"
      >
        {!hasWebGL && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-atelier-sand/50 to-transparent blur-3xl" />
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-ultra text-atelier-stone font-sans mb-3 block">
            {fabricData.kicker}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-atelier-noir tracking-tight">
            {fabricData.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-atelier-stone mt-4 leading-relaxed font-light">
            {fabricData.description}
          </p>
        </div>

        {/* Double-Bezel Spec Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fabricData.cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-atelier-bg/85 backdrop-blur-md border border-atelier-border/80 shadow-sm hover:border-atelier-stone transition-all duration-300 space-y-3"
            >
              <div className="w-9 h-9 rounded-xl bg-atelier-ecru flex items-center justify-center text-atelier-noir text-xs font-serif border border-atelier-border/60">
                0{idx + 1}
              </div>
              <h3 className="font-serif text-lg text-atelier-noir">{card.title}</h3>
              <p className="font-sans text-xs text-atelier-stone leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
