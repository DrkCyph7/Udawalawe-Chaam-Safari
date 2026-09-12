import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'Udawalawe Wild Safari Tours | Chaam Safari Sri Lanka'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const bgImage = readFileSync(join(process.cwd(), 'public', 'safari-hero.png'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1f392b',
        }}
      >
        <img
          src={`data:image/png;base64,${bgImage.toString('base64')}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt="background"
        />
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backgroundImage: 'linear-gradient(to top, rgba(16, 28, 21, 0.9), rgba(16, 28, 21, 0.2))',
          }}
        />

        {/* Content Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '40px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          {/* Main Title */}
          <h1
            style={{
              fontSize: '84px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              color: '#ffffff',
              fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            Udawalawe Wild Safari
          </h1>

          <h2
            style={{
              fontSize: '46px',
              fontWeight: 500,
              color: '#d1a05d',
              margin: '0 0 60px 0',
              fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Private Jeep Tours in Sri Lanka
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px 48px',
              backgroundColor: 'rgba(16, 28, 21, 0.8)',
              borderRadius: '9999px',
              border: '2px solid rgba(209, 160, 93, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              CHAAM SAFARI & TOURS
            </span>
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#d1a05d',
                borderRadius: '50%',
                margin: '0 24px',
              }}
            />
            <span
              style={{
                fontSize: '28px',
                fontWeight: 400,
                color: '#e5e7eb',
              }}
            >
              www.udawalawesafarijeep.lk
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
