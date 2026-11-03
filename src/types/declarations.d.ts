declare module 'next' {
  export type Metadata = {
    title?: string | { default: string; template: string };
    description?: string;
    authors?: Array<{ name: string; url?: string }>;
    keywords?: string[];
    robots?: any;
    openGraph?: any;
    twitter?: any;
    icons?: any;
    alternates?: any;
  };
  export type NextConfig = {
    output?: string;
    images?: {
      unoptimized?: boolean;
      remotePatterns?: any[];
    };
    trailingSlash?: boolean;
    typescript?: {
      ignoreBuildErrors?: boolean;
    };
    eslint?: {
      ignoreDuringBuilds?: boolean;
    };
  };
}

declare module 'next/image' {
  import * as React from 'react';
  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    quality?: number;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
  }
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/dynamic' {
  import * as React from 'react';
  export interface DynamicOptions {
    ssr?: boolean;
    loading?: () => React.ReactNode;
  }
  export default function dynamic<P = {}>(
    dynamicOptions: () => Promise<{ default: React.ComponentType<P> }>,
    options?: DynamicOptions
  ): React.ComponentType<P>;
}

declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  export type Metadata = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'next/types.js' {
  export type AppProps = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'gsap/ScrollTrigger' {
  export class ScrollTrigger {
    static register(core: any): void;
    static create(vars: any): any;
    static refresh(safe?: boolean): void;
    static update(): void;
    static getAll(): any[];
    static getById(id: string): any;
    static killAll(): void;
    static matchMedia(vars: any): any;
    static batch(targets: any, vars: any): any;
    progress: number;
    direction: number;
    kill(reset?: boolean): void;
  }
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (event: any) => void,
      onError?: (event: any) => void
    ): void;
  }
}
