import './globals.css';
import Navbar from '@/components/navbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getResumeData } from '@/data/resume';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'ko';
  const DATA = getResumeData(locale);

  return {
    metadataBase: new URL(DATA.url),
    title: {
      default: DATA.name,
      template: `%s | ${DATA.name}`,
    },
    description: DATA.description,
    openGraph: {
      title: `${DATA.name}`,
      description: DATA.description,
      url: DATA.url,
      siteName: `${DATA.name}`,
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${DATA.name}`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: `${DATA.name}`,
      card: 'summary_large_image',
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      other: [
        {
          rel: 'android-chrome-192x192',
          url: '/android-chrome-192x192.png',
        },
        {
          rel: 'android-chrome-512x512',
          url: '/android-chrome-512x512.png',
        },
      ],
    },
    manifest: '/site.webmanifest',
    verification: {
      google: '',
      yandex: '',
    },
  };
}

export const dynamicParams = false;
export const dynamic = 'force-static';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = 'ko';
  const DATA = getResumeData(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={cn('bg-background mx-auto font-sans antialiased', playfairDisplay.variable)}>
        <TooltipProvider delayDuration={0}>
          {children}
          <Navbar />
        </TooltipProvider>
      </body>
    </html>
  );
}
