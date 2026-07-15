import type { Metadata } from "next";
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { AudioPlayer } from '@/components/AudioPlayer';
import { CartSidebar } from '@/components/CartSidebar';
import './globals.css';

const siteUrl = 'https://oldisco.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
  default: 'Oldisco | Selo de CDs e Black Metal Underground',
  template: 'Oldisco | %s',
  },
  description: 'Oldisco é um selo underground dedicado a CDs, demos raras e lançamentos obscuros de black metal do mundo todo. Rádio 24/7, artigos e curadoria da cena underground.',
  openGraph: {
  type: 'website',
  siteName: 'Oldisco',
  url: siteUrl,
  title: 'Oldisco | Selo de CDs e Black Metal Underground',
  description: 'Explore demos raras e CDs de black metal underground do mundo todo. Rádio 24/7, artigos e selo especializado na cena extrema.',
  locale: 'pt_BR',
  images: [
  {
  url: `${siteUrl}/images/logo.png`,
  width: 1200,
  height: 630,
  alt: 'Oldisco - Selo de Black Metal Underground',
  },
  ],
  },
  twitter: {
  card: 'summary_large_image',
  title: 'Oldisco | CDs e Black Metal Underground',
  description: 'Selo especializado em demos raras e CDs de black metal underground. Rádio 24/7, artigos e curadoria da cena.',
  images: [`${siteUrl}/images/logo.png`],
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/logo.png" as="image" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Metal+Mania&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Inter';
              font-display: swap;
            }
            @font-face {
              font-family: 'Metal Mania';
              font-display: swap;
            }
            @font-face {
              font-family: 'JetBrains Mono';
              font-display: swap;
            }
          `,
        }} />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="google-site-verification" content="uYOo9Cj_nVlWJv8qoNUVrXQVKK9Kfvz3WAbvHmJd7Iw" />
        <link rel="alternate" hrefLang="pt-BR" href={siteUrl} />
        <link rel="alternate" hrefLang="en" href={siteUrl} />
        <script
          id="global-organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Oldisco',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                'https://www.instagram.com/demotapesdodemo_distro/',
                'https://www.youtube.com/@DemoTapesTapesDoDemo',
                'https://www.facebook.com/profile.php?id=61587720096599',
              ],
            }),
          }}
        />
        <script
          id="global-website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Oldisco',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <link rel="apple-touch-icon" sizes="57x57" href="/images/favicon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/favicon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/favicon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/favicon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/favicon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/images/favicon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/images/favicon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/favicon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/images/favicon/favicon.ico" />
        <link rel="manifest" href="/images/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/images/favicon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="text/javascript"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'pt',
                    includedLanguages: 'en,es,fr,de,it,ja,ko,zh-CN,ru,ar,pt',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>
              {children}
            </main>
            <CartSidebar />
            <AudioPlayer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
