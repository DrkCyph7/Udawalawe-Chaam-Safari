/**
 * app/loading.tsx
 *
 * Next.js App Router automatically uses this as the Suspense fallback
 * for the root route. It displays a pixel-perfect skeleton that mirrors
 * every section of the real page — same backgrounds, same grid layouts,
 * same spacing — so the transition from loading → content feels instant.
 *
 * All styles live in globals.css under the "SKELETON LOADING" block.
 */

import type React from 'react'

export default function Loading() {
  return (
    <>
      {/* ── NAV ── */}
      <div className="sk-nav" aria-hidden="true">
        <div className="sk sk-nav-brand" />
        <div className="sk-nav-links">
          <div className="sk sk-nav-link" />
          <div className="sk sk-nav-link" />
          <div className="sk sk-nav-link" />
          <div className="sk sk-nav-link" />
        </div>
        <div className="sk sk-nav-btn" />
      </div>

      {/* ── HERO ── */}
      <div className="sk-hero" aria-hidden="true">
        <div className="sk sk-hero-bg" />
        <div className="sk-hero-copy">
          <div className="sk sk-eyebrow" />
          <div className="sk sk-hero-h1-l1" />
          <div className="sk sk-hero-h1-l2" />
          <div className="sk sk-hero-p" />
          <div className="sk sk-hero-p2" />
          <div className="sk sk-hero-btn" />
        </div>
        <div className="sk-hero-foot">
          <div className="sk sk-hero-foot-item" />
          <div className="sk sk-hero-foot-item" style={{ width: 160 }} />
          <div className="sk sk-hero-foot-item" style={{ width: 120 }} />
        </div>
      </div>

      {/* ── STATEMENT ── */}
      <div className="sk-statement" aria-hidden="true">
        <div className="sk sk-eyebrow" style={{ '--sk-base': '#d5d0c5' } as React.CSSProperties} />
        <div className="sk sk-h2-lg" />
        <div className="sk sk-h2-lg2" />
        <div className="sk-statement-bottom">
          <div className="sk sk-p-line" />
          <div className="sk sk-p-line" />
          <div className="sk sk-p-line" />
          <div className="sk-stats">
            {[0, 1, 2].map(i => (
              <div className="sk-stat" key={i}>
                <div className="sk sk-stat-num" />
                <div className="sk sk-stat-label" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SPLIT STORY ── */}
      <div className="sk-split" aria-hidden="true">
        <div className="sk sk-story-img" />
        <div className="sk-story-copy">
          <div className="sk sk-eyebrow-light" />
          <div className="sk sk-h2-md" />
          <div className="sk sk-h2-md2" />
          <div className="sk sk-p-light" />
          <div className="sk sk-p-light2" />
          <div className="sk sk-link" />
        </div>
      </div>

      {/* ── EXPERIENCE ── */}
      <div className="sk-experience" aria-hidden="true">
        <div className="sk-section-heading">
          <div className="sk-sh-left">
            <div className="sk sk-eyebrow" style={{ '--sk-base': '#b8b2a8' } as React.CSSProperties} />
            <div className="sk sk-h2-sm" />
            <div className="sk sk-h2-sm2" />
          </div>
          <div className="sk-sh-right">
            <div className="sk sk-sh-p" />
            <div className="sk sk-sh-p2" style={{ marginTop: 10 }} />
          </div>
        </div>
        <div className="sk-card-grid">
          <div className="sk sk-card" />
          <div className="sk sk-card" />
          <div className="sk sk-card" />
        </div>
      </div>

      {/* ── QUOTE BAND ── */}
      <div className="sk-quote" aria-hidden="true">
        <div className="sk sk-q-line" />
        <div className="sk sk-q-line2" />
        <div className="sk sk-q-attr" />
      </div>

      {/* ── TIMELINE ── */}
      <div className="sk-timeline" aria-hidden="true">
        <div className="sk-section-heading">
          <div className="sk-sh-left">
            <div className="sk sk-eyebrow" style={{ '--sk-base': '#d5d0c5' } as React.CSSProperties} />
            <div className="sk sk-h2-sm" />
            <div className="sk sk-h2-sm2" />
          </div>
          <div className="sk-sh-right">
            <div className="sk sk-sh-p" />
          </div>
        </div>
        <div className="sk-tl-list">
          {[0, 1, 2, 3].map(i => (
            <div className="sk-tl-row" key={i}>
              <div className="sk sk-tl-time" />
              <div className="sk-tl-body">
                <div className="sk sk-tl-title" />
                <div className="sk sk-tl-text" />
                <div className="sk sk-tl-text2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GUIDE ── */}
      <div className="sk-guide" aria-hidden="true">
        <div className="sk sk-guide-h-eyebrow" />
        <div className="sk sk-guide-h2" />
        <div className="sk sk-guide-h22" />
        <div className="sk-guide-grid">
          {[0, 1, 2].map(i => (
            <div className="sk-guide-item" key={i}>
              <div className="sk sk-guide-num" />
              <div className="sk sk-guide-title" />
              <div className="sk sk-guide-p" />
              <div className="sk sk-guide-p2" />
              <div className="sk sk-guide-p3" />
            </div>
          ))}
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div className="sk-reviews" aria-hidden="true">
        <div className="sk sk-eyebrow" style={{ '--sk-base': '#b5afa8' } as React.CSSProperties} />
        <div className="sk-review-content">
          <div className="sk sk-stars" />
          <div className="sk-review-btns">
            <div className="sk sk-review-btn" />
            <div className="sk sk-review-btn" style={{ width: 180 }} />
          </div>
          <div className="sk sk-bq-line" style={{ marginTop: 30 }} />
          <div className="sk sk-bq-line2" />
          <div className="sk sk-bq-line3" />
          <div className="sk sk-reviewer" />
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div className="sk-contact" aria-hidden="true">
        <div className="sk-contact-intro">
          <div className="sk sk-eyebrow" style={{ '--sk-base': '#d5d0c5' } as React.CSSProperties} />
          <div className="sk sk-contact-h2" />
          <div className="sk sk-contact-h22" />
          <div className="sk sk-contact-p" />
          <div className="sk sk-contact-p2" />
          <div className="sk-contact-links">
            <div className="sk sk-contact-link" />
            <div className="sk sk-contact-link" style={{ width: 140 }} />
            <div className="sk sk-contact-link" style={{ width: 120 }} />
          </div>
        </div>
        <div className="sk-contact-form">
          <div className="sk-field">
            <div className="sk sk-label" style={{ width: 70 }} />
            <div className="sk-input" />
          </div>
          <div className="sk-field">
            <div className="sk sk-label" style={{ width: 140 }} />
            <div className="sk-input" />
          </div>
          <div className="sk-field">
            <div className="sk sk-label" style={{ width: 180 }} />
            <div className="sk sk-textarea" />
          </div>
          <div className="sk sk-submit" />
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="sk-faq" aria-hidden="true">
        <div className="sk sk-faq-h2" />
        <div className="sk-faq-list">
          {[72, 65, 58, 51].map((w, i) => (
            <div className="sk-faq-item" key={i}>
              <div className="sk sk-faq-q" style={{ width: `${w}%` }} />
              <div className="sk sk-faq-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="sk-cta" aria-hidden="true">
        <div className="sk sk-cta-eyebrow" />
        <div className="sk sk-cta-h2" />
        <div className="sk sk-cta-h22" />
        <div className="sk sk-cta-btn" />
      </div>

      {/* ── FOOTER ── */}
      <div className="sk-footer" aria-hidden="true">
        <div className="sk-footer-brand">
          <div className="sk sk-footer-logo" />
          <div className="sk sk-footer-tagline" />
        </div>
        <div className="sk-footer-socials">
          {[0, 1, 2, 3].map(i => (
            <div className="sk sk-social-icon" key={i} />
          ))}
        </div>
        <div className="sk-footer-copy">
          <div className="sk sk-footer-p" />
          <div className="sk sk-footer-p2" />
        </div>
        <div className="sk-footer-copy" style={{ alignItems: 'flex-end' }}>
          <div className="sk sk-footer-p" style={{ width: 110 }} />
          <div className="sk sk-footer-p2" style={{ width: 80 }} />
        </div>
      </div>
    </>
  )
}
