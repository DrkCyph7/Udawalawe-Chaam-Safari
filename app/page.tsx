'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  Compass,
  Globe2,
  MapPin,
  Menu,
  Phone,
  Play,
  Star,
  X,
} from 'lucide-react'
import { GOOGLE_MAPS_URL, SOCIAL_LINKS, TRIPADVISOR_URL } from '@/lib/social-links'

/* ─── Constants ────────────────────────────────────────────────── */
const WHATSAPP = '94771234567'
const phone = '+94 77 123 4567'
const faqs: [string, string][] = [
  ['When is the best time to visit Udawalawe?', 'Udawalawe is rewarding year-round. The dry season from May to September often brings wildlife closer to water, while the green season brings dramatic landscapes and fewer visitors.'],
  ['How long is a safari?', 'Our standard morning and afternoon drives are around three to four hours. We can shape longer private drives around your route and interests.'],
  ['Can you arrange transfers?', 'Yes. Tell us where you are coming from and we will help coordinate a comfortable transfer to the park gate.'],
  ['Is this suitable for children?', 'Absolutely. We tailor the pace, vehicle and timing for families, with patient naturalist-guided drives and plenty of space to pause.'],
]

/* ─── Shared transition presets (motion.dev spring best-practices) */
const SPRING_SMOOTH = { type: 'spring', stiffness: 60, damping: 20, mass: 1 }
const SPRING_SNAPPY = { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }
const SPRING_GENTLE = { type: 'spring', stiffness: 40, damping: 18, mass: 1.2 }
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/* ─── Section reveal: fades up with blur-clear ─────────────────── */
function useRevealAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return { ref, inView }
}

function SectionReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'section',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: React.ElementType
}) {
  const { ref, inView } = useRevealAnimation()
  const reduced = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 36, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ ...SPRING_SMOOTH, delay }}
      // @ts-ignore
      as={Tag}
    >
      {children}
    </motion.div>
  )
}

/* ─── Stagger children wrapper ──────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: SPRING_SMOOTH,
  },
}

/* ─── WhatsApp CTA Button ───────────────────────────────────────── */
function WhatsAppButton({ label = 'Plan your safari' }: { label?: string }) {
  const message = encodeURIComponent('Hello, I would like to plan a safari in Udawalawe.')
  return (
    <motion.a
      className="button button-bronze"
      href={`https://wa.me/${WHATSAPP}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4, transition: SPRING_SNAPPY }}
      whileTap={{ scale: 0.96, transition: SPRING_SNAPPY }}
    >
      {label}
      <ArrowUpRight size={16} />
    </motion.a>
  )
}

/* ─── Navbar ────────────────────────────────────────────────────── */
function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <nav className="nav">
      <a className="brand" href="#top" aria-label="Wild Udawalawe home">
        <span>W</span>ILD<br />UDAWALAWE
      </a>
      <AnimatePresence>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['#experience', '#guide', '#journal', '#contact'].map((href, i) => (
            <motion.a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              whileHover={{ color: '#d1a05d', transition: { duration: 0.15 } }}
            >
              {['The experience', 'Park guide', 'Field notes', 'Contact'][i]}
            </motion.a>
          ))}
        </div>
      </AnimatePresence>
      <WhatsAppButton label="Book a drive" />
      <motion.button
        className="menu-btn"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen(!menuOpen)}
        whileTap={{ scale: 0.88, transition: SPRING_SNAPPY }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={menuOpen ? 'x' : 'menu'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </nav>
  )
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number>(0)
  const [sent, setSent] = useState(false)
  const reduced = useReducedMotion()

  /* Parallax hero */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const rawHeroY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 90])
  const heroY = useSpring(rawHeroY, { stiffness: 80, damping: 25 })
  const rawHeroScale = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 1.06])
  const heroScale = useSpring(rawHeroScale, { stiffness: 80, damping: 25 })

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Wild Udawalawe',
    description: 'Private safari experiences at the edge of Udawalawe National Park, Sri Lanka.',
    areaServed: 'Udawalawe National Park, Sri Lanka',
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram, SOCIAL_LINKS.youtube, SOCIAL_LINKS.tripadvisor],
  }

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* ── HERO ── */}
        <section className="hero" id="top" ref={heroRef}>
          <motion.div className="hero-media" style={{ y: heroY, scale: heroScale }}>
            <Image
              src="/safari-hero.png"
              alt="Elephants gathered beside a lake in Udawalawe National Park"
              fill priority sizes="100vw"
              className="hero-image"
            />
          </motion.div>
          <div className="hero-shade" />

          {/* Hero copy — blur-in entrance on mount */}
          <motion.div
            className="hero-copy"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={staggerItem} className="eyebrow">PRIVATE SAFARI EXPERIENCES · SRI LANKA</motion.p>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
                visible: {
                  opacity: 1, y: 0, filter: 'blur(0px)',
                  transition: { ...SPRING_GENTLE, delay: 0.1 },
                },
              }}
            >
              Read the<br /><em>wild</em> closely.
            </motion.h1>
            <motion.p variants={staggerItem} className="hero-text">
              Unhurried days, expert eyes and the quiet thrill of finding elephants in their natural home.
            </motion.p>
            <motion.div variants={staggerItem}>
              <WhatsAppButton />
            </motion.div>
          </motion.div>

          {/* Hero foot */}
          <motion.div
            className="hero-foot"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <span>06°26′N 80°53′E</span>
            <span>Udawalawe National Park</span>
            <span>Scroll to explore ↓</span>
          </motion.div>
        </section>

        {/* ── STATEMENT ── */}
        <SectionReveal className="statement section-pad">
          <p className="eyebrow">A DIFFERENT KIND OF GAME DRIVE</p>
          <h2>Not a checklist.<br /><em>A conversation</em><br />with the landscape.</h2>
          <div className="statement-bottom">
            <p>We are a small, local safari team based at the edge of Udawalawe. Our drives are shaped by the weather, the light and the animals in front of us — never by a fixed route.</p>
            <motion.div
              className="stats"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {[['12+', 'years in the park'], ['01—06', 'guests per jeep'], ['100%', 'locally led']].map(([val, label]) => (
                <motion.div key={label} variants={staggerItem}>
                  <strong>{val}</strong>
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* ── SPLIT STORY ── */}
        <SectionReveal className="split-story">
          <div className="story-image">
            <Image src="/safari-landscape.png" alt="Safari track through Udawalawe grassland" fill sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="story-copy">
            <p className="eyebrow">01 / THE PARK</p>
            <h2>Where the dry zone meets the deep green.</h2>
            <p>Udawalawe is one of Sri Lanka's most reliable places to see wild elephants. Beyond the open plains, its reservoirs, riverine forests and rocky ridges hold an extraordinary cast of birds, reptiles and mammals.</p>
            <motion.a
              className="text-link"
              href="#guide"
              whileHover={{ x: 4, transition: SPRING_SNAPPY }}
            >
              Meet the park <ArrowDownRight size={17} />
            </motion.a>
          </div>
        </SectionReveal>

        {/* ── EXPERIENCE ── */}
        <SectionReveal className="experience section-pad" as="section">
          <div id="experience" />
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / THE EXPERIENCE</p>
              <h2>Choose your<br /><em>kind of day.</em></h2>
            </div>
            <p>Every drive is private, flexible and guided by a naturalist who knows these roads as living, changing things.</p>
          </div>
          <motion.div
            className="experience-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {/* Card A */}
            <motion.article
              variants={staggerItem}
              className="experience-card card-dark"
              whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,.22)', transition: SPRING_SNAPPY }}
            >
              <span className="card-index">A</span>
              <Compass size={28} strokeWidth={1} />
              <h3>First light</h3>
              <p>Wake with the park. Cool air, long shadows and the first movement at the waterhole.</p>
              <motion.a href="#contact" whileHover={{ x: 3, transition: SPRING_SNAPPY }}>Morning drive <ArrowUpRight size={15} /></motion.a>
            </motion.article>
            {/* Card B */}
            <motion.article
              variants={staggerItem}
              className="experience-card card-photo"
              whileHover={{ y: -8, transition: SPRING_SNAPPY }}
            >
              <Image src="/safari-elephants.png" alt="Sri Lankan elephant in lush Udawalawe forest" fill sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="photo-overlay">
                <span className="card-index">B</span>
                <h3>Golden hour</h3>
                <p>Follow the warmth of the afternoon into a quiet, amber evening.</p>
              </div>
            </motion.article>
            {/* Card C */}
            <motion.article
              variants={staggerItem}
              className="experience-card card-olive"
              whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,.18)', transition: SPRING_SNAPPY }}
            >
              <span className="card-index">C</span>
              <h3>Full day<br /><em>out there.</em></h3>
              <p>For curious travellers who want more time, more ground and more room for the unexpected.</p>
              <motion.a href="#contact" whileHover={{ x: 3, transition: SPRING_SNAPPY }}>Build a private day <ArrowUpRight size={15} /></motion.a>
            </motion.article>
          </motion.div>
        </SectionReveal>

        {/* ── QUOTE BAND ── */}
        <SectionReveal className="quote-band">
          <p>"The best sightings are not summoned.<br />They are <em>noticed.</em>"</p>
          <span>— OUR FIELD GUIDE</span>
        </SectionReveal>

        {/* ── TIMELINE ── */}
        <SectionReveal className="timeline section-pad" delay={0.05}>
          <div id="journal" />
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / A TYPICAL MORNING</p>
              <h2>Let the day<br /><em>unfold.</em></h2>
            </div>
            <p>There is a rhythm to a good safari. We leave space for it.</p>
          </div>
          <motion.div
            className="timeline-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {[
              ['05:15', 'The gate opens', 'Coffee, a packed breakfast and the first blue light over the reservoir.'],
              ['06:30', 'Into the grasslands', 'We follow the signs: fresh tracks, alarm calls, the hush of a watching herd.'],
              ['09:00', 'Pause & observe', 'No rushing the moment. A shady tree, a thermos poured, stories shared.'],
              ['11:00', 'Back to base', 'Return with the windows down and the park still unfolding behind you.'],
            ].map(([time, title, text]) => (
              <motion.div className="timeline-row" variants={staggerItem} key={time}>
                <span>{time}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <ArrowDownRight size={18} />
              </motion.div>
            ))}
          </motion.div>
        </SectionReveal>

        {/* ── GUIDE ── */}
        <SectionReveal className="guide" delay={0.05}>
          <div id="guide" className="guide-inner">
            <p className="eyebrow">FIELD NOTES / UDAWALAWE</p>
            <h2>A little preparation<br /><em>goes a long way.</em></h2>
            <motion.div
              className="guide-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {[
                ['01', 'Bring layers', 'Mornings can be cool, afternoons bright. A light layer and sun protection make all the difference.'],
                ['02', 'Look beyond elephants', 'Keep watch for painted storks, mugger crocodiles, toque macaques and the flash of a serpent eagle.'],
                ['03', 'Leave only footprints', 'We keep a respectful distance, never feed wildlife and carry our waste back out.'],
              ].map(([n, t, p]) => (
                <motion.div variants={staggerItem} key={n}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* ── REVIEWS ── */}
        <SectionReveal className="reviews section-pad">
          <p className="eyebrow">WHAT TRAVELLERS NOTICE</p>
          <div className="review-content">
            <div className="stars">★★★★★ <span>Google reviews</span></div>
            <div className="review-actions">
              <motion.a
                className="button button-dark"
                href={GOOGLE_MAPS_URL}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -4, transition: SPRING_SNAPPY }}
                whileTap={{ scale: 0.97, transition: SPRING_SNAPPY }}
              >
                Google reviews <ArrowUpRight size={16} />
              </motion.a>
              <motion.a
                className="button button-outline"
                href={TRIPADVISOR_URL}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -4, transition: SPRING_SNAPPY }}
                whileTap={{ scale: 0.97, transition: SPRING_SNAPPY }}
              >
                View on TripAdvisor <ArrowUpRight size={16} />
              </motion.a>
            </div>
            <blockquote>"A calm, deeply knowledgeable guide. We saw elephants, crocodiles and more birds than we could name — but the real gift was how unhurried the whole morning felt."</blockquote>
            <p className="reviewer">— Recent guest, United Kingdom</p>
          </div>
        </SectionReveal>

        {/* ── CONTACT ── */}
        <SectionReveal className="contact-section section-pad">
          <div id="contact" />
          <div className="contact-intro">
            <p className="eyebrow">START A CONVERSATION</p>
            <h2>Tell us what<br /><em>you're imagining.</em></h2>
            <p>Dates, group size, where you are staying — or simply a feeling. We will come back with honest, useful advice.</p>
            <div className="contact-details">
              <a href="tel:+94771234567"><Phone size={17} /> {phone}</a>
              <a href={`https://wa.me/${WHATSAPP}`}><span className="wa-dot" /> WhatsApp us directly</a>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> Get directions</a>
              <span>Udawalawe, Sri Lanka</span>
            </div>
          </div>
          <form
            className="inquiry-form"
            onSubmit={(e) => { e.preventDefault(); setSent(true) }}
          >
            <label>Your name<input required name="name" placeholder="How should we call you?" /></label>
            <label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label>
            <label>Tell us a little about your plans<textarea required name="message" rows={4} placeholder="When are you visiting? Who are you travelling with?" /></label>
            <motion.button
              className="button button-dark"
              type="submit"
              whileHover={{ y: -4, transition: SPRING_SNAPPY }}
              whileTap={{ scale: 0.97, transition: SPRING_SNAPPY }}
            >
              {sent ? <><Check size={16} /> Thank you — we'll be in touch</> : <>Send inquiry <ArrowUpRight size={16} /></>}
            </motion.button>
          </form>
        </SectionReveal>

        {/* ── FAQ ── */}
        <SectionReveal className="faq section-pad">
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2>Questions, <em>answered.</em></h2>
          <div className="faq-list">
            {faqs.map(([question, answer], i) => (
              <div className="faq-item" key={question}>
                <motion.button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>{question}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={SPRING_SNAPPY}
                  >
                    <ChevronDown />
                  </motion.span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: SPRING_SMOOTH, opacity: { duration: 0.22 } }}
                    >
                      <p>{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* ── FINAL CTA ── */}
        <SectionReveal className="final-cta">
          <p className="eyebrow">THE PARK IS WAITING</p>
          <h2>Go where the<br /><em>quiet begins.</em></h2>
          <WhatsAppButton label="Plan your safari" />
        </SectionReveal>

        {/* ── FOOTER ── */}
        <footer>
          <a className="brand" href="#top"><span>W</span>ILD UDAWALAWE</a>
          <p>Private safari experiences<br />at the edge of the wild.</p>
          <div className="footer-socials" aria-label="Follow Wild Udawalawe">
            {[
              { href: SOCIAL_LINKS.facebook, label: 'Facebook', Icon: Globe2 },
              { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: Camera },
              { href: SOCIAL_LINKS.youtube, label: 'YouTube', Icon: Play },
              { href: SOCIAL_LINKS.tripadvisor, label: 'TripAdvisor', Icon: Star },
            ].map(({ href, label, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank" rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, color: '#d1a05d', transition: SPRING_SNAPPY }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
          <p>© 2026 Wild Udawalawe<br />Sri Lanka</p>
          <p className="footer-credit">Designed &amp; developed by<br /><a href="https://nexcy.lk" target="_blank" rel="noopener noreferrer">NexCy Technologies</a></p>
        </footer>

        {/* Mobile bottom bar */}
        <motion.div
          className="mobile-actions"
          initial={{ y: reduced ? 0 : 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, ...SPRING_SMOOTH }}
        >
          <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp</a>
          <a href="tel:+94771234567">Call us</a>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">Directions</a>
        </motion.div>
      </main>
    </MotionConfig>
  )
}
