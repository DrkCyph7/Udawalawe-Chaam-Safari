import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SOCIAL_LINKS } from '@/lib/social-links'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chaam Safari & Tours | Private Safari Experiences in Sri Lanka',
  description: 'Unhurried, locally led safari experiences at the edge of Udawalawe National Park, Sri Lanka.',
  metadataBase: new URL('https://www.udawalawesafarijeep.lk'),
  alternates: { canonical: '/' },
  openGraph: { title: 'Chaam Safari & Tours', description: 'Read the wild closely.', url: '/', siteName: 'Chaam Safari & Tours', type: 'website', images: ['https://www.udawalawesafarijeep.lk/safari-hero.png'] },
  twitter: { card: 'summary_large_image', title: 'Chaam Safari & Tours', description: 'Private safari experiences in Sri Lanka.', images: ['https://www.udawalawesafarijeep.lk/safari-hero.png'] },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#1f392b', userScalable: true }

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Chaam Safari & Tours',
  description: 'Private safari experiences at the edge of Udawalawe National Park, Sri Lanka.',
  url: 'https://www.udawalawesafarijeep.lk',
  telephone: '+94 77 278 3223',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Udawalawe',
    addressRegion: 'Sabaragamuwa Province',
    addressCountry: 'LK',
  },
  areaServed: 'Udawalawe National Park, Sri Lanka',
  sameAs: [
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.tripadvisor,
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
