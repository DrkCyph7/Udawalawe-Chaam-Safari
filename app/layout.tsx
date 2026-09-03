import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wild Udawalawe | Private Safari Experiences in Sri Lanka',
  description: 'Unhurried, locally led safari experiences at the edge of Udawalawe National Park, Sri Lanka.',
  metadataBase: new URL('https://wildudawalawe.com'),
  alternates: { canonical: '/' },
  openGraph: { title: 'Wild Udawalawe', description: 'Read the wild closely.', url: '/', siteName: 'Wild Udawalawe', type: 'website', images: ['/safari-hero.png'] },
  twitter: { card: 'summary_large_image', title: 'Wild Udawalawe', description: 'Private safari experiences in Sri Lanka.', images: ['/safari-hero.png'] },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#1f392b', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
