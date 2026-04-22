'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/* ─── Ticker Component ─── */
function RateTicker({ rates }) {
  if (!rates) return null;

  const items = [
    { label: 'Gold 24K', value: `₹${rates.gold24k?.toLocaleString('en-IN')}`, unit: '/10g', change: '+0.42%', dir: 'up' },
    { label: 'Gold 22K', value: `₹${rates.gold22k?.toLocaleString('en-IN')}`, unit: '/10g', change: '+0.38%', dir: 'up' },
    { label: 'Gold 18K', value: `₹${rates.gold18k?.toLocaleString('en-IN')}`, unit: '/10g', change: '+0.31%', dir: 'up' },
    { label: 'Silver', value: `₹${rates.silverGram?.toLocaleString('en-IN')}`, unit: '/g', change: '-0.12%', dir: 'down' },
    { label: 'Silver (1 kg)', value: `₹${rates.silverKg?.toLocaleString('en-IN')}`, unit: '/kg', change: '-0.12%', dir: 'down' },
  ];

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        {allItems.map((item, i) => (
          <div className="ticker-item" key={i}>
            <span className="ticker-label">{item.label}</span>
            <span className="ticker-value">{item.value}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{item.unit}</span>
            <span className={`ticker-change ${item.dir}`}>{item.dir === 'up' ? '▲' : '▼'} {item.change}</span>
            {i < allItems.length - 1 && <span className="ticker-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Navbar Component ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className="navbar" style={scrolled ? { boxShadow: '0 4px 30px rgba(0,0,0,0.6)' } : {}}>
      <div className="logo-wrap">
        <span className="logo-name">MANISH</span>
        <span className="logo-tagline">Jewellery · Est. 1985</span>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#rates">Gold Rates</a></li>
        <li><a href="#collections">Collections</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><Link href="/admin" className="nav-cta">Admin Panel</Link></li>
      </ul>
    </nav>
  );
}

/* ─── Hero Component ─── */
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">Crafting Timeless Elegance Since 1985</div>
        <h1 className="hero-title">
          Where Gold Meets <span>Artistry</span>
        </h1>
        <p className="hero-subtitle">Handcrafted jewellery for life's most precious moments</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Collections
          </button>
          <button className="btn-outline" onClick={() => document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' })}>
            Today's Gold Rate
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Carousel Component ─── */
const SLIDES = [
  {
    img: '/col1.png',
    label: 'Bridal Collection',
    title: 'Royal Bridal Sets',
    desc: 'Exquisite gold and diamond sets crafted for your most memorable day.',
  },
  {
    img: '/col2.png',
    label: 'Heritage Gold',
    title: 'Traditional Gold Bangles',
    desc: 'Timeless designs inspired by Indian heritage — worn across generations.',
  },
  {
    img: '/col3.png',
    label: 'Diamonds',
    title: 'Diamond Solitaires',
    desc: 'Brilliance that lasts forever. Ethically sourced, masterfully set.',
  },
];

function Carousel() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  const next = useCallback(() => setActive(p => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive(p => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  const resetTimer = (fn) => {
    clearInterval(intervalRef.current);
    fn();
    intervalRef.current = setInterval(next, 5000);
  };

  return (
    <section className="carousel-section" id="showcase">
      <div className="section-header">
        <div className="section-label">Featured Collections</div>
        <h2 className="section-title">Crafted for Every Occasion</h2>
        <div className="ornament">⸻ ✦ ⸻</div>
      </div>
      <div className="carousel-wrapper">
        <div className="carousel-track-outer">
          <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {SLIDES.map((slide, i) => (
              <div className="carousel-slide" key={i}>
                <img src={slide.img} alt={slide.title} />
                <div className="carousel-caption">
                  <div className="carousel-caption-label">{slide.label}</div>
                  <h3 className="carousel-caption-title">{slide.title}</h3>
                  <p className="carousel-caption-desc">{slide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="carousel-nav carousel-prev" onClick={() => resetTimer(prev)} aria-label="Previous slide">‹</button>
        <button className="carousel-nav carousel-next" onClick={() => resetTimer(next)} aria-label="Next slide">›</button>
        <div className="carousel-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === active ? 'active' : ''}`}
              onClick={() => resetTimer(() => setActive(i))}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Rates Section ─── */
function RatesSection({ rates, loading }) {
  const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  const cards = [
    { icon: '🥇', metal: 'Gold 24K', purity: '999 — 24 Carat Pure Gold', price: fmt(rates?.gold24k), unit: 'per 10 grams', change: '+₹320', dir: 'up' },
    { icon: '⭐', metal: 'Gold 22K', purity: '916 — Standard Hallmark Gold', price: fmt(rates?.gold22k), unit: 'per 10 grams', change: '+₹293', dir: 'up' },
    { icon: '💛', metal: 'Gold 18K', purity: '750 — 18 Carat Gold', price: fmt(rates?.gold18k), unit: 'per 10 grams', change: '+₹220', dir: 'up' },
    { icon: '🥈', metal: 'Silver', purity: '999 — Fine Silver', price: fmt(rates?.silverGram), unit: 'per gram', change: '-₹0.11', dir: 'down' },
    { icon: '📦', metal: 'Silver (1 Kg)', purity: '999 — Fine Silver Bulk', price: fmt(rates?.silverKg), unit: 'per kilogram', change: '-₹110', dir: 'down' },
  ];

  return (
    <section className="rates-section" id="rates">
      <div className="section-header">
        <div className="section-label">Live Market Rates</div>
        <h2 className="section-title">Today's Gold & Silver Rates in India</h2>
        <div className="ornament">⸻ ✦ ⸻</div>
        {rates && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
            {rates.source === 'live' ? '🟢 Live rates from market' : rates.source === 'manual' ? '🟡 Rates updated by store' : '⚪ Demo rates'}
            {' · '} Last updated: {rates.updatedAt ? new Date(rates.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'} IST
          </p>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gold)' }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>⏳</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fetching latest rates…</p>
        </div>
      ) : (
        <div className="rates-grid">
          {cards.map((card, i) => (
            <div className="rate-card" key={i}>
              <div className="rate-icon">{card.icon}</div>
              <div className="rate-metal">{card.metal}</div>
              <div className="rate-purity">{card.purity}</div>
              <div className="rate-price">{card.price}</div>
              <div className="rate-unit">{card.unit}</div>
              <span className={`rate-change ${card.dir}`}>
                {card.dir === 'up' ? '▲' : '▼'} {card.change} today
              </span>
              <div className="rate-updated">GST & making charges extra</div>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: 'var(--text-muted)' }}>
        * Rates are indicative. Final price may vary based on design, making charges & applicable taxes.
      </p>
    </section>
  );
}

/* ─── Collections Section ─── */
const COLLECTIONS = [
  { img: '/col1.png', tag: 'Bridal', name: 'Bridal Gold Sets', desc: 'Royal bridal collections' },
  { img: '/col2.png', tag: 'Traditional', name: 'Gold Bangles', desc: 'Heritage-inspired designs' },
  { img: '/col3.png', tag: 'Contemporary', name: 'Diamond Rings', desc: 'Modern solitaire rings' },
];

function Collections() {
  return (
    <section className="collections-section" id="collections">
      <div className="section-header">
        <div className="section-label">Our Collections</div>
        <h2 className="section-title">Jewellery for Every Chapter of Life</h2>
        <div className="ornament">⸻ ✦ ⸻</div>
      </div>
      <div className="collections-grid">
        {COLLECTIONS.map((col, i) => (
          <div className="collection-card" key={i}>
            <img src={col.img} alt={col.name} />
            <div className="collection-overlay">
              <div className="collection-tag">{col.tag}</div>
              <h3 className="collection-name">{col.name}</h3>
              <div className="collection-cta">Explore →</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Features Section ─── */
function Features() {
  const items = [
    { icon: '🏅', title: 'BIS Hallmarked', desc: 'Every piece is BIS hallmarked guaranteeing purity and quality you can trust.' },
    { icon: '💎', title: 'Certified Diamonds', desc: 'All diamonds are GIA/IGI certified for cut, clarity, carat and colour.' },
    { icon: '🔄', title: 'Lifetime Exchange', desc: 'Exchange your old gold jewellery at the best rates — no questions asked.' },
    { icon: '🛡️', title: 'GST Transparent', desc: 'Clear, transparent billing with proper GST invoices for every purchase.' },
    { icon: '✂️', title: 'Custom Design', desc: 'Work with our craftsmen to design bespoke jewellery just for you.' },
    { icon: '🚚', title: 'Insured Delivery', desc: 'Fully insured home delivery with real-time tracking for all orders.' },
  ];

  return (
    <section className="features-section" id="about">
      <div className="section-header">
        <div className="section-label">Why Manish Jewellery</div>
        <h2 className="section-title">Four Decades of Trust & Craftsmanship</h2>
        <div className="ornament">⸻ ✦ ⸻</div>
      </div>
      <div className="features-grid">
        {items.map((item, i) => (
          <div className="feature-item" key={i}>
            <div className="feature-icon">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const reviews = [
    { text: 'Absolutely stunning bridal set! The craftsmanship is impeccable and the gold quality is exactly as promised. Our family has been buying here for 20 years.', author: 'Priya Sharma', location: 'Jaipur', stars: 5 },
    { text: 'The custom design service is exceptional. They created my mother\'s exact vision for her anniversary gift. Pure 22K, beautifully hallmarked. Highly recommend!', author: 'Rahul Mehta', location: 'Mumbai', stars: 5 },
    { text: 'Best gold rates in the city, always transparent about making charges. The staff are patient and knowledgeable. Bought my wife\'s engagement ring here.', author: 'Ankit Verma', location: 'Delhi', stars: 5 },
  ];

  return (
    <section className="testimonials-section" id="reviews">
      <div className="section-header">
        <div className="section-label">Customer Stories</div>
        <h2 className="section-title">Trusted by Thousands of Families</h2>
        <div className="ornament">⸻ ✦ ⸻</div>
      </div>
      <div className="testimonials-grid">
        {reviews.map((r, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">{r.text}</p>
            <div className="testimonial-stars">{'★'.repeat(r.stars)}</div>
            <div className="testimonial-author">{r.author}</div>
            <div className="testimonial-location">{r.location}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-name">MANISH</div>
          <div className="logo-tagline">Jewellery · Est. 1985</div>
          <div className="footer-divider" />
          <p className="footer-desc">
            Four decades of crafting timeless jewellery with unmatched purity and artisanal excellence.
            Trusted by generations of families across India.
          </p>
        </div>
        <div>
          <div className="footer-heading">Collections</div>
          <ul className="footer-list">
            <li><a href="#">Bridal Sets</a></li>
            <li><a href="#">Gold Necklaces</a></li>
            <li><a href="#">Diamond Rings</a></li>
            <li><a href="#">Gold Bangles</a></li>
            <li><a href="#">Silver Jewellery</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">Services</div>
          <ul className="footer-list">
            <li><a href="#">Custom Design</a></li>
            <li><a href="#">Gold Exchange</a></li>
            <li><a href="#">Jewellery Repair</a></li>
            <li><a href="#">Valuation</a></li>
            <li><a href="#">Home Delivery</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">Contact</div>
          <ul className="footer-list">
            <li><a href="tel:+919876543210">📞 +91 98765 43210</a></li>
            <li><a href="mailto:info@manishjewellery.in">✉ info@manishjewellery.in</a></li>
            <li><a href="#">📍 Main Bazaar, Jaipur, Rajasthan</a></li>
            <li><a href="#">🕐 Mon–Sun: 10 AM – 9 PM</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Manish Jewellery. All rights reserved.</span>
        <span style={{ color: 'var(--gold-dark)' }}>✦ Crafted with Excellence ✦</span>
        <span>BIS Hallmark · GST Certified · ISO 9001</span>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rates')
      .then(r => r.json())
      .then(data => { setRates(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <RateTicker rates={rates} />
      <Navbar />
      <main>
        <Hero />
        <Carousel />
        <RatesSection rates={rates} loading={loading} />
        <Collections />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
