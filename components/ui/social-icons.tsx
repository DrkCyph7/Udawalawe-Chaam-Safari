import React from 'react'

export const FacebookIcon = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="4" fill="#1877F2" />
    <path d="M15.5 12H13V24h-4V12H7V8h2V5.5C9 3.5 10 2 13.5 2H17v4h-2.5c-1 0-1.5.5-1.5 1.5V8h4l-1.5 4z" fill="#FFF" />
  </svg>
)

export const InstagramIcon = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="ig-grad" x1="12%" y1="100%" x2="88%" y2="0%">
        <stop offset="0%" stopColor="#FEDA77"/>
        <stop offset="35%" stopColor="#DD2A7B"/>
        <stop offset="100%" stopColor="#515BD4"/>
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
    <path d="M12 6.645A5.355 5.355 0 1 0 17.355 12 5.361 5.361 0 0 0 12 6.645zm0 8.8A3.444 3.444 0 1 1 15.444 12 3.448 3.448 0 0 1 12 15.445z" fill="#FFF"/>
    <path d="M16.143 5.947a1.272 1.272 0 1 0 1.272 1.272 1.274 1.274 0 0 0-1.272-1.272z" fill="#FFF"/>
    <path d="M17.142 4.95H6.858A1.91 1.91 0 0 0 4.95 6.858v10.284A1.91 1.91 0 0 0 6.858 19.05h10.284a1.91 1.91 0 0 0 1.908-1.908V6.858a1.91 1.91 0 0 0-1.908-1.908zm0 12.192H6.858v-10.284h10.284z" fill="#FFF"/>
  </svg>
)

export const YoutubeIcon = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="9 8 16 12 9 16" fill="white" />
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" />
  </svg>
)

export const TripAdvisorIcon = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="50 30 412 340" fill="none" className={className}>
    <path fill="#fcc40f" stroke="#000a12" strokeWidth="17" d="M93 202a195 151 0 0 1 326 0v56H93"/>
    <g transform="translate(256 257)">
      <g id="ta-eye" fill="#000a12">
        <path d="M-115-97h-77c0 2 22 36 19 48M0 92l-31-47V0H2"/>
        <circle cx="-97" r="97"/>
        <circle cx="-97" r="78" fill="#fff"/>
        <circle cx="-97" r="50"/>
        <circle cx="-97" r="33" fill="#fff"/>
      </g>
      <use href="#ta-eye" transform="scale(-1 1)"/>
      <circle cx="-97" r="17" fill="#ef6a45"/>
      <circle cx="97" r="17" fill="#00b087"/>
    </g>
  </svg>
)
