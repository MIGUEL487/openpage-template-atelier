import type { Metadata } from 'next';
import SmoothScroll from '@/components/SmoothScroll';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: `${siteConfig.fullName} · Proposta Conceitual OpenPage`,
  description: siteConfig.description,
  authors: [{ name: siteConfig.meta.author }],
  keywords: siteConfig.meta.keywords,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: `${siteConfig.name} — Proposta Conceitual Não Oficial`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: 'OpenPage Luxury Demonstratives',
    locale: siteConfig.meta.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Proposta Conceitual`,
    description: siteConfig.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-atelier-bg text-atelier-noir font-sans min-h-screen antialiased selection:bg-atelier-sand selection:text-atelier-noir overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
