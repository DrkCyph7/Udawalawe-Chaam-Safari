'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import type { Transition, Variants } from 'framer-motion'
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
import { BlurText } from '@/components/ui/BlurText'
import { CountUp } from '@/components/ui/CountUp'
import { GradientText } from '@/components/ui/GradientText'

/* ─── Constants ────────────────────────────────────────────────── */
const WHATSAPP = '94772783223'
const phone = '+94 77 278 3223'
const faqs: [string, string][] = [
  ['When is the best time to visit Udawalawe National Park?', 'Udawalawe National Park is rewarding year-round, with elephant sightings on nearly every drive. The dry season from May to September often brings larger herds closer to the reservoir, while the green season (October to January) brings dramatic landscapes, migratory birds and fewer visitors.'],
  ['How long is a safari at Udawalawe?', 'Our standard morning and afternoon drives are approximately three to four hours inside the park. We also offer full-day private safaris for those who want to explore further. The park is open daily from 6:00 AM to 6:00 PM.'],
  ['Can you arrange hotel transfers to Udawalawe?', 'Yes. Whether you are coming from Ella, Mirissa, Galle, Colombo or anywhere else in Sri Lanka, we can help coordinate a comfortable private transfer directly to the Udawalawe park gate.'],
  ['Is a Udawalawe safari suitable for children?', 'Absolutely. Udawalawe is one of the most family-friendly national parks in Sri Lanka. We tailor the pace and timing for families, with patient naturalist-guided drives and plenty of space for children to enjoy the wildlife safely from the jeep.'],
]

/* ─── Typed transition presets ──────────────────────────────────── */
const SPRING_SMOOTH: Transition = { type: 'spring', stiffness: 60, damping: 20, mass: 1 }
const SPRING_SNAPPY: Transition = { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }
const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 40, damping: 18, mass: 1.2 }
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Hero Variants (Framer Motion — enhanced) ───────────────────── */
const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const heroEyebrow: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { ...SPRING_SMOOTH, delay: 0.1 },
  },
}

/* ─── Hero H1 — word-grouped character animation ─────────────────────
   Characters animate individually BUT are wrapped per-word in a
   `display:inline-block; white-space:nowrap` span so the browser
   never breaks a word mid-character at a line boundary.              */
function HeroH1({ text1, text2 }: { text1: string; text2: string }) {
  const charVariants: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: -45, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 16,
        delay: 0.3 + i * 0.04,
      },
    }),
  }

  function renderLine(text: string, charOffset: number) {
    const words = text.split(' ')
    let charIndex = charOffset
    return words.map((word, wi) => {
      const chars = Array.from(word)
      const wordStart = charIndex
      charIndex += chars.length + 1 // +1 for the space
      return (
        <span
          key={wi}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {chars.map((c, ci) => (
            <motion.span
              key={ci}
              custom={wordStart + ci}
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              {c}
            </motion.span>
          ))}
          {/* Space after every word except last */}
          {wi < words.length - 1 && (
            <motion.span
              custom={wordStart + chars.length}
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              {' '}
            </motion.span>
          )}
        </span>
      )
    })
  }

  const charCount1 = Array.from(text1).length + 1

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      style={{ perspective: 800 }}
      aria-label={`${text1} ${text2}`}
    >
      <span style={{ display: 'block' }}>
        {renderLine(text1, 0)}
      </span>
      <em style={{ display: 'block' }}>
        {renderLine(text2, charCount1)}
      </em>
    </motion.h1>
  )
}

/* ─── Section reveal (generic) ──────────────────────────────────── */
function SectionReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const reduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 36, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ ...SPRING_SMOOTH, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Animated line (for timeline) ─────────────────────────────── */
function AnimatedLine({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="timeline-progress-line"
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.2 }}
      style={{ transformOrigin: 'left' }}
    />
  )
}

/* ─── WhatsApp CTA Button ───────────────────────────────────────── */
function WhatsAppButton({ label = 'Plan your safari' }: { label?: string }) {
  const message = encodeURIComponent('Hello, I would like to plan a safari in Udawalawe.')
  return (
    <motion.a
      className="button button-bronze"
      href={`https://wa.me/${WHATSAPP}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
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
  const navLabels = ['The experience', 'Park guide', 'Field notes', 'Contact']
  const navHrefs = ['#experience', '#guide', '#journal', '#contact']

  return (
    <nav className="nav">
      <a className="brand" href="#top" aria-label="Chaam Safari & Tours home">
        <span>C</span>HAAM<br />SAFARI &amp; TOURS
      </a>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navHrefs.map((href, i) => (
          <motion.a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            whileHover={{ color: '#d1a05d', transition: { duration: 0.15 } }}
          >
            {navLabels[i]}
          </motion.a>
        ))}
      </div>
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
  const { scrollY } = useScroll()
  const rawHeroY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 90])
  const heroY = useSpring(rawHeroY, { stiffness: 80, damping: 25 })
  const rawHeroScale = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 1.06])
  const heroScale = useSpring(rawHeroScale, { stiffness: 80, damping: 25 })

  /* Timeline inView */
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineInView = useInView(timelineRef, { once: true, margin: '-40px 0px' })

  /* Stagger container */
  const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  }
  const staggerItem: Variants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: SPRING_SMOOTH },
  }

  return (
    <MotionConfig reducedMotion="user">
      <main>

        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* ── HERO ── */}
        <section className="hero" id="top">
          <motion.div className="hero-media" style={{ y: heroY, scale: heroScale }}>
            <Image
              src="/safari-hero.png"
              alt="Herd of wild Sri Lankan elephants drinking at the Udawalawe reservoir at sunrise — Udawalawe National Park, Sri Lanka"
              fill
              priority
              sizes="100vw"
              className="hero-image"
            />
          </motion.div>
          <div className="hero-shade" />

          <motion.div
            className="hero-copy"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow — blur + fade stagger */}
            <motion.p variants={heroEyebrow} className="eyebrow">
              PRIVATE SAFARI EXPERIENCES · SRI LANKA
            </motion.p>

            {/* H1 — character-by-character cinematic reveal */}
            <HeroH1 text1="Read the" text2="wild closely." />

            {/* Hero subtext — slide up with blur */}
            <motion.p
              className="hero-text"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ ...SPRING_GENTLE, delay: 1.1 }}
            >
              Unhurried days, expert eyes and the quiet thrill of finding elephants in their natural home.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ ...SPRING_SMOOTH, delay: 1.35 }}
            >
              <WhatsAppButton />
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-foot"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <span>6°28′N 80°54′E</span>
            <span>Udawalawe National Park</span>
            <span>Scroll to explore ↓</span>
          </motion.div>
        </section>

        {/* ── STATEMENT ── */}
        <SectionReveal className="statement section-pad">
          <p className="eyebrow">A DIFFERENT KIND OF GAME DRIVE</p>
          {/* BlurText word-by-word reveal on the headline */}
          <h2 aria-label="Not a checklist. A conversation with the landscape.">
            <BlurText
              text="Not a checklist."
              animateBy="words"
              delay={0.08}
              block
            />
            <BlurText
              text="A conversation"
              animateBy="words"
              delay={0.08}
              block
            />
            <em style={{ display: 'block' }}>
              <BlurText
                text="with the landscape."
                animateBy="words"
                delay={0.08}
              />
            </em>
          </h2>
          <div className="statement-bottom">
            <p>We are a small, locally owned safari team based at the edge of Udawalawe National Park. Our drives are shaped by the season, the light and the animals in front of us — never by a fixed route or a ticking clock.</p>
            {/* Stats with CountUp */}
            <motion.div
              className="stats"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {([
                { raw: 12, display: '12', suffix: '+', label: 'years in the park' },
                { raw: 6, display: '01—06', suffix: '', label: 'guests per jeep', isRange: true },
                { raw: 100, display: '100', suffix: '%', label: 'locally led' },
              ] as { raw: number; display: string; suffix: string; label: string; isRange?: boolean }[]).map(({ raw, display, suffix, label, isRange }) => (
                <motion.div key={label} variants={staggerItem}>
                  <strong>
                    {isRange
                      ? '01—06'
                      : <CountUp to={raw} suffix={suffix} stiffness={45} damping={18} />
                    }
                  </strong>
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* ── SPLIT STORY ── */}
        <SectionReveal className="split-story">
          <div className="story-image">
            <Image
              src="/safari-landscape.png"
              alt="Jeep safari track winding through golden grasslands of Udawalawe National Park with distant mountains, Sri Lanka"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow">01 / THE PARK</p>
            <h2>
              <BlurText
                text="Where the dry zone meets the deep green."
                animateBy="words"
                delay={0.06}
              />
            </h2>
            <p>Udawalawe is one of Sri Lanka&apos;s most reliable places to see wild Asian elephants — home to over 500 individuals. Beyond the open plains, its reservoirs, riverine forests and rocky ridges shelter spotted deer, water buffalo, crocodiles and over 200 bird species.</p>
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
        <SectionReveal className="experience section-pad">
          <div id="experience" />
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / THE EXPERIENCE</p>
              <h2>
                Choose your<br />
                <em>
                  <BlurText
                    text="kind of day."
                    animateBy="words"
                    delay={0.09}
                  />
                </em>
              </h2>
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
            <motion.article
              variants={staggerItem}
              className="experience-card card-dark"
              whileHover={{ y: -10, boxShadow: '0 28px 56px rgba(0,0,0,.28)', transition: SPRING_SNAPPY }}
            >
              <span className="card-index">A</span>
              <Compass size={28} strokeWidth={1} />
              <h3>First light</h3>
              <p>Wake with the park. Cool air, long shadows and the first movement at the waterhole.</p>
              <motion.a href="#contact" whileHover={{ x: 3, transition: SPRING_SNAPPY }}>
                Morning drive <ArrowUpRight size={15} />
              </motion.a>
            </motion.article>

            <motion.article
              variants={staggerItem}
              className="experience-card card-photo"
              whileHover={{ y: -10, transition: SPRING_SNAPPY }}
            >
              <Image
                src="/safari-elephants.png"
                alt="Close-up of a wild Sri Lankan elephant feeding in the riverine forests of Udawalawe National Park"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="photo-overlay">
                <span className="card-index">B</span>
                <h3>Golden hour</h3>
                <p>Follow the warmth of the afternoon into a quiet, amber evening.</p>
              </div>
            </motion.article>

            <motion.article
              variants={staggerItem}
              className="experience-card card-olive"
              whileHover={{ y: -10, boxShadow: '0 28px 56px rgba(0,0,0,.22)', transition: SPRING_SNAPPY }}
            >
              <span className="card-index">C</span>
              <h3>Full day<br /><em>out there.</em></h3>
              <p>For curious travellers who want more time, more ground and more room for the unexpected.</p>
              <motion.a href="#contact" whileHover={{ x: 3, transition: SPRING_SNAPPY }}>
                Build a private day <ArrowUpRight size={15} />
              </motion.a>
            </motion.article>
          </motion.div>
        </SectionReveal>

        {/* ── QUOTE BAND — GradientText shimmer on em ── */}
        <SectionReveal className="quote-band">
          <p>
            &ldquo;The best sightings are not summoned.<br />
            They are{' '}
            <em>
              <GradientText
                colors={['#24372a', '#3d6b4f', '#24372a', '#5a8a6a', '#24372a']}
                speed={4}
              >
                noticed.
              </GradientText>
            </em>
            &rdquo;
          </p>
          <span>— OUR FIELD GUIDE</span>
        </SectionReveal>

        {/* ── TIMELINE ── */}
        <SectionReveal className="timeline section-pad" delay={0.05}>
          <div id="journal" />
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / A TYPICAL MORNING</p>
              <h2>
                Let the day<br />
                <em>
                  <BlurText
                    text="unfold."
                    animateBy="chars"
                    delay={0.06}
                  />
                </em>
              </h2>
            </div>
            <p>There is a rhythm to a good safari. We leave space for it.</p>
          </div>
          <div ref={timelineRef}>
            <AnimatedLine inView={timelineInView} />
            <motion.div
              className="timeline-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {([
                ['05:45', 'Meet at the gate', 'Coffee, a packed breakfast and the first blue light over the Udawalawe reservoir.'],
                ['06:00', 'Into the grasslands', 'The gate opens. We follow fresh tracks, alarm calls and the hush of a watching herd.'],
                ['09:00', 'Pause & observe', 'No rushing the moment. A shady tree, a thermos poured, stories shared.'],
                ['11:00', 'Back to base', 'Return with the windows down and the park still unfolding behind you.'],
                // Note: Udawalawe National Park gates open at 6:00 AM and close at 6:00 PM daily.
              ] as [string, string, string][]).map(([time, title, text]) => (
                <motion.div
                  className="timeline-row"
                  variants={staggerItem}
                  key={time}
                >
                  <span>{time}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                  <ArrowDownRight size={18} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* ── GUIDE ── */}
        <SectionReveal className="guide" delay={0.05}>
          <div id="guide" className="guide-inner">
            <p className="eyebrow">FIELD NOTES / UDAWALAWE</p>
            <h2>
              <BlurText
                text="A little preparation goes a long way."
                animateBy="words"
                delay={0.07}
              />
            </h2>
            <motion.div
              className="guide-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {([
                ['01', 'Bring layers', 'Mornings can be cool, afternoons bright. A light layer and sun protection make all the difference.'],
                ['02', 'Look beyond elephants', 'Keep watch for painted storks, mugger crocodiles, spotted deer, water buffalo, toque macaques and the flash of a crested serpent eagle.'],
                ['03', 'Leave only footprints', 'We keep a respectful distance, never feed wildlife and carry all waste back out of the park.'],
              ] as [string, string, string][]).map(([n, t, p]) => (
                <motion.div
                  variants={staggerItem}
                  key={n}
                  whileHover={{ y: -6, transition: SPRING_SNAPPY }}
                >
                  <span className="guide-number">
                    <GradientText
                      colors={['#d1a05d', '#f0d8a0', '#b47b42', '#e8c88a', '#d1a05d']}
                      speed={6}
                    >
                      {n}
                    </GradientText>
                  </span>
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
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, transition: SPRING_SNAPPY }}
                whileTap={{ scale: 0.97, transition: SPRING_SNAPPY }}
              >
                Google reviews <ArrowUpRight size={16} />
              </motion.a>
              <motion.a
                className="button button-outline"
                href={TRIPADVISOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, transition: SPRING_SNAPPY }}
                whileTap={{ scale: 0.97, transition: SPRING_SNAPPY }}
              >
                View on TripAdvisor <ArrowUpRight size={16} />
              </motion.a>
            </div>
            {/* Blockquote — plain JSX so curly quotes render correctly */}
            <blockquote>
              “A calm, deeply knowledgeable guide. We saw elephants, crocodiles
              and more birds than we could name — but the real gift was how
              unhurried the whole morning felt.”
            </blockquote>
            <p className="reviewer">— Recent guest, United Kingdom</p>
          </div>
        </SectionReveal>

        {/* ── CONTACT ── */}
        <SectionReveal className="contact-section section-pad">
          <div id="contact" />
          <div className="contact-intro">
            <p className="eyebrow">START A CONVERSATION</p>
            <h2>
              Tell us what<br />
              <em>
                <BlurText
                  text="you're imagining."
                  animateBy="words"
                  delay={0.08}
                />
              </em>
            </h2>
            <p>Dates, group size, where you are staying — or simply an idea. We will come back with honest, practical advice and help you plan the perfect Udawalawe safari.</p>
            <div className="contact-details">
              <a href="tel:+94772783223"><Phone size={17} /> {phone}</a>
              <a href={`https://wa.me/${WHATSAPP}`}><span className="wa-dot" /> WhatsApp us directly</a>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> Get directions</a>
              <span>Udawalawe, Sri Lanka</span>
            </div>
          </div>
          <form className="inquiry-form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <label>Your name<input required name="name" autoComplete="name" placeholder="How should we call you?" /></label>
            <label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label>
            <label>Tell us a little about your plans<textarea required name="message" rows={4} placeholder="When are you visiting? How many people? Any special interests?" /></label>
            <motion.button
              className="button button-dark"
              type="submit"
              whileHover={{ y: -4, transition: SPRING_SNAPPY }}
              whileTap={{ scale: 0.97, transition: SPRING_SNAPPY }}
            >
              {sent
                ? <><Check size={16} /> Thank you — we&apos;ll be in touch</>
                : <>Send inquiry <ArrowUpRight size={16} /></>}
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
                      transition={{
                        height: SPRING_SMOOTH,
                        opacity: { duration: 0.22 },
                      }}
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
          <h2>
            Go where the<br />
            <em>
              <BlurText
                text="quiet begins."
                animateBy="words"
                delay={0.1}
              />
            </em>
          </h2>
          <WhatsAppButton label="Plan your safari" />
        </SectionReveal>

        {/* ── FOOTER ── */}
        <footer>
          <a className="brand" href="#top"><span>C</span>HAAM SAFARI &amp; TOURS</a>
          <p>Private safari experiences<br />at the edge of the wild.</p>
          <div className="footer-socials" aria-label="Follow Chaam Safari & Tours">
            {(
              [
                { href: SOCIAL_LINKS.facebook, label: 'Facebook', Icon: Globe2 },
                { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: Camera },
                { href: SOCIAL_LINKS.youtube, label: 'YouTube', Icon: Play },
                { href: SOCIAL_LINKS.tripadvisor, label: 'TripAdvisor', Icon: Star },
              ] as { href: string; label: string; Icon: React.ComponentType<{ size?: number }> }[]
            ).map(({ href, label, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, color: '#d1a05d', transition: SPRING_SNAPPY }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
          <p>© 2026 Chaam Safari &amp; Tours<br />Sri Lanka</p>
          <p className="footer-credit">
            Designed &amp; developed by<br />
            <a href="https://nexcy.lk" target="_blank" rel="noopener noreferrer">NexCy Technologies</a>
          </p>
        </footer>

        {/* Mobile bottom bar */}
        <motion.div
          className="mobile-actions"
          initial={{ y: reduced ? 0 : 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, ...SPRING_SMOOTH }}
        >
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="tel:+94772783223">Call us</a>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">Directions</a>
        </motion.div>
      </main>
    </MotionConfig>
  )
}
