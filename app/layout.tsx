import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SOCIAL_LINKS } from '@/lib/social-links'
import PopupModal from '@/components/PopupModal'
import './globals.css'

export const metadata: Metadata = {
  title: 'Udawalawe Wild Safari Tours | Chaam Safari Sri Lanka',
  description:
    'Book a private Udawalawe safari jeep tour in Sri Lanka with Chaam Safari. Experience an unforgettable elephant safari and wildlife private tours.',
  metadataBase: new URL('https://www.udawalawesafarijeep.lk'),
  alternates: { canonical: '/' },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  keywords: [
    'Udawalawe safari',
    'Udawalawe National Park',
    'Sri Lanka safari',
    'jeep safari Sri Lanka',
    'elephant safari Sri Lanka',
    'Udawalawe jeep safari',
    'private safari Sri Lanka',
    'Chaam Safari',
    'Udawalawe wildlife',
    'best safari in Sri Lanka',
    'Udawalawe elephant watching',
    'Sri Lanka national park tour',
  ],
  openGraph: {
    title: 'Chaam Safari & Tours — Private Jeep Safari in Udawalawe, Sri Lanka',
    description:
      'Unhurried, locally led private jeep safaris at Udawalawe National Park. Wild elephants, rich birdlife and expert naturalist guides — morning, afternoon and full-day drives.',
    url: '/',
    siteName: 'Chaam Safari & Tours',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chaam Safari & Tours — Udawalawe National Park',
    description:
      'Private jeep safaris with local naturalist guides. Wild elephants, crocodiles, 200+ bird species. Book a morning, afternoon or full-day drive in Udawalawe, Sri Lanka.',
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
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1f392b',
  userScalable: true,
  width: 'device-width',
  initialScale: 1,
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Chaam Safari & Tours',
  alternateName: 'Udawalawe Chaam Safari and Tours',
  description:
    'Private jeep safari experiences at Udawalawe National Park, Sri Lanka. Expert local naturalist guides, morning and afternoon drives, wild elephant sightings.',
  url: 'https://www.udawalawesafarijeep.lk',
  telephone: '+94772783223',
  image: 'https://www.udawalawesafarijeep.lk/opengraph-image',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Udawalawe',
    addressRegion: 'Sabaragamuwa Province',
    addressCountry: 'LK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 6.4716,
    longitude: 80.8987,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Udawalawe National Park',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Udawalawe',
      addressCountry: 'LK',
    },
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '05:30',
    closes: '18:00',
  },
  sameAs: [
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.tripadvisor,
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    ratingCount: '120',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'When is the best time to visit Udawalawe National Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Udawalawe National Park is rewarding year-round, with elephant sightings on nearly every drive. The dry season from May to September often brings larger herds closer to the reservoir, while the green season (October to January) brings dramatic landscapes, migratory birds and fewer visitors.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long is a safari at Udawalawe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our standard morning and afternoon drives are approximately three to four hours inside the park. We also offer full-day private safaris for those who want to explore further. The park is open daily from 6:00 AM to 6:00 PM.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you arrange hotel transfers to Udawalawe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Whether you are coming from Ella, Mirissa, Galle, Colombo or anywhere else in Sri Lanka, we can help coordinate a comfortable private transfer directly to the Udawalawe park gate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a Udawalawe safari suitable for children?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Udawalawe is one of the most family-friendly national parks in Sri Lanka. We tailor the pace and timing for families, with patient naturalist-guided drives and plenty of space for children to enjoy the wildlife safely from the jeep.',
      },
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <PopupModal />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
