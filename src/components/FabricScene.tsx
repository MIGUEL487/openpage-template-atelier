'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
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
  const photo1Ref = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLDivElement>(null);
  const photo3Ref = useRef<HTMLDivElement>(null);
  const photo4Ref = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);

  // 1. Lazy loading & descarte do contexto WebGL com IntersectionObserver
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

  // 2. Parallax em camadas das fotos reais de arara e crochê (Seção 5.3 item 5)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (photo1Ref.current) {
        gsap.to(photo1Ref.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      if (photo2Ref.current) {
        gsap.to(photo2Ref.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      if (photo3Ref.current) {
        gsap.to(photo3Ref.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        });
      }

      if (photo4Ref.current) {
        gsap.to(photo4Ref.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3. Inicialização e destruição do WebGL vinculada estritamente à visibilidade da seção
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
      console.warn('[FabricScene] Erro ao instanciar WebGL:', e);
      setHasWebGL(false);
      return;
    }

    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.25)
      : Math.min(window.devicePixelRatio || 1, 1.5);

    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Geometria têxtil procedural
    const geometry = new THREE.PlaneGeometry(5.0, 3.2, isMobile ? 24 : 44, isMobile ? 18 : 34);

    const colorBase = '#B19462';
    const colorShadow = '#231B0E';
    const colorSheen = '#D6BC8B';

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColorBase: { value: new THREE.Color(colorBase) },
      uColorShadow: { value: new THREE.Color(colorShadow) },
      uColorSheen: { value: new THREE.Color(colorSheen) },
    };

    const vertexShader = `
      uniform float uTime;
      uniform float uScroll;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float w1 = sin(pos.x * 2.0 + uTime * 0.4) * cos(pos.y * 1.6 + uTime * 0.3) * 0.14;
        float w2 = cos(pos.x * 3.5 - uTime * 0.2) * sin(pos.y * 2.2 + uTime * 0.25) * 0.05;
        float scrollWave = sin(pos.y * 2.0 + uScroll * 3.0) * 0.10;

        pos.z += w1 + w2 + scrollWave;

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
        vec3 lightDir = normalize(vec3(1.0, 2.0, 2.5));
        vec3 viewDir = normalize(-vPosition);

        float NdotL = dot(normal, lightDir);
        float diffuse = clamp(NdotL * 0.5 + 0.5, 0.0, 1.0);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.35;

        vec3 tone = mix(uColorShadow, uColorBase, diffuse);
        vec3 finalColor = mix(tone, uColorSheen, fresnel);

        float alpha = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) *
                      smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

        gl_FragColor = vec4(finalColor, alpha * 0.22);
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
    mesh.position.set(-0.2, 0, 0);
    scene.add(mesh);

    let rafId: number | null = null;
    let isDisposed = false;
    const clock = new THREE.Clock();

    const render = () => {
      if (isDisposed) return;
      if (!prefersReducedMotion) {
        const delta = clock.getDelta();
        uniforms.uTime.value += Math.min(delta, 0.1) * 0.5;
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self: any) => {
        uniforms.uScroll.value = self.progress;
      },
    });

    return () => {
      isDisposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      trigger.kill();

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      try {
        const gl = renderer.getContext();
        const loseExt = gl.getExtension('WEBGL_lose_context');
        loseExt?.loseContext();
      } catch {}

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isInViewport, modelUrl]);

  const fabricData = siteConfig.brandContent.fabricData;
  const textures = fabricData.textureImages || [
    { src: '/brands/precioza/processed/precioza-trico-cores-arara.webp', alt: 'Cores de tricô' },
    { src: '/brands/precioza/processed/precioza-trico-pecas-arara.webp', alt: 'Peças em destaque' },
    { src: '/brands/precioza/processed/precioza-croche-detalhe.webp', alt: 'Crochê vazado' },
    { src: '/brands/precioza/processed/precioza-croche-detalhe-2.webp', alt: 'Detalhe do ponto' },
  ];

  return (
    <section
      id="textura"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 px-6 lg:px-12 bg-bg-raised border-b border-line overflow-hidden"
    >
      {/* 3D Atmospheric Canvas Layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-90"
        aria-hidden="true"
      >
        {!hasWebGL && (
          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-gold/25 to-transparent blur-3xl" />
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-3 text-xs uppercase tracking-ultra text-gold font-sans font-medium mb-3">
            <span className="w-6 h-[1px] bg-gold" />
            <span>{fabricData.kicker}</span>
            <span className="w-6 h-[1px] bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-ivory tracking-tight">
            {fabricData.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone mt-4 leading-relaxed font-light">
            {fabricData.description}
          </p>
        </div>

        {/* Colagem Fotográfica de Texturas com Parallax em Camadas (Seção 4 & 5.3) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div
            ref={photo1Ref}
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line bg-bg-base shadow-xl will-change-transform"
          >
            <Image
              src={textures[0].src}
              alt={textures[0].alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>

          <div
            ref={photo2Ref}
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line bg-bg-base shadow-xl md:mt-8 will-change-transform"
          >
            <Image
              src={textures[1].src}
              alt={textures[1].alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>

          <div
            ref={photo3Ref}
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line bg-bg-base shadow-xl will-change-transform"
          >
            <Image
              src={textures[2].src}
              alt={textures[2].alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>

          <div
            ref={photo4Ref}
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line bg-bg-base shadow-xl md:mt-8 will-change-transform"
          >
            <Image
              src={textures[3].src}
              alt={textures[3].alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center filter contrast-[1.03] saturate-[0.96]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Spec Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fabricData.cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-bg-soft border border-line shadow-sm hover:border-gold/50 transition-all duration-300 space-y-3"
            >
              <div className="w-8 h-8 rounded bg-bg-base flex items-center justify-center text-gold-light text-xs font-serif border border-line">
                0{idx + 1}
              </div>
              <h3 className="font-serif text-lg text-ivory">{card.title}</h3>
              <p className="font-sans text-xs text-stone leading-relaxed font-light">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
