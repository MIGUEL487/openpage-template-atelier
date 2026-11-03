import type { Metadata } from 'next';
import SmoothScroll from '@/components/SmoothScroll';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: `${siteConfig.fullName} · Monte Sião - MG`,
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
    title: `${siteConfig.fullName}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: 'Precioza Tricot',
    locale: siteConfig.meta.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.fullName}`,
    description: siteConfig.description,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark js-motion">
      <head>
        <meta name="theme-color" content="#0B0B0A" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-base text-ivory font-sans min-h-screen antialiased selection:bg-gold selection:text-bg-base overflow-x-hidden bg-grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
