"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fallbackContent, getPublicContent, type SticeContent } from "../lib/stice";

const heroSlides = [
  {
    image: "https://40yrs.costech.or.tz/wp-content/uploads/2026/02/DSC_6315-min.jpg",
    eyebrow: "28–30 October 2026 · Dar es Salaam",
    title: "Four decades of ideas. One bold road ahead.",
    text: "COSTECH@40 brings research, policy, industry and investment together to shape Tanzania's knowledge-driven future.",
  },
  {
    image: "https://40yrs.costech.or.tz/wp-content/uploads/2026/02/1O1A4091-scaled-1.jpg",
    eyebrow: "Tanzania's national STI platform",
    title: "Where evidence becomes action.",
    text: "Meet the people turning scientific knowledge into scalable solutions for Vision 2050.",
  },
  {
    image: "https://40yrs.costech.or.tz/wp-content/uploads/2026/02/DSC_6831-min.jpg",
    eyebrow: "Research · Innovation · Enterprise",
    title: "Build the next chapter with us.",
    text: "Share your contribution, explore new partnerships and discover innovations made for Tanzania.",
  },
];

const proceedings = [
  {
    edition: "9th STICE",
    title: "Research for a climate-resilient future",
    stat: "76 papers",
    year: "2026",
    report: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/9th-STICE-Report.pdf",
    proceedings: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/9th-STICE-Proceedings.pdf",
  },
  {
    edition: "8th STICE",
    title: "Science, technology and innovation in practice",
    stat: "National forum",
    year: "2024",
    report: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/8th-STICE-Report.pdf",
    proceedings: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/8th-STICE-Proceedings.pdf",
  },
];

function formatMoney(amount?: number, currency = "TZS") {
  if (!amount) return "Contact us";
  return `${currency} ${new Intl.NumberFormat("en-TZ", { maximumFractionDigits: 0 }).format(amount)}`;
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "right" ? "→" : "←"}</span>;
}

export default function PublicSite() {
  const [content, setContent] = useState<SticeContent>(fallbackContent);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getPublicContent(controller.signal)
      .then(setContent)
      .catch(() => setContent(fallbackContent))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const current = heroSlides[slide];
  const areas = useMemo(() => [...content.thematicAreas].sort((a, b) => a.sortOrder - b.sortOrder), [content.thematicAreas]);
  const sponsors = useMemo(
    () => [...content.sponsorshipPackages].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder),
    [content.sponsorshipPackages],
  );
  const theme = content.mainTheme || fallbackContent.mainTheme!;
  const venue = content.venue || fallbackContent.venue!;
  const call = content.callForSubmission || fallbackContent.callForSubmission!;

  function moveSlide(next: number) {
    setSlide((next + heroSlides.length) % heroSlides.length);
  }

  return (
    <main className="site-shell">
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <div className="utility-agency">
            <img src="/costech-logo.png" alt="COSTECH logo" />
            <p>Tanzania Commission for Science and Technology (COSTECH)</p>
          </div>
          <div>
            <a href="mailto:costech40@costech.or.tz">costech40@costech.or.tz</a>
            <span className="utility-dot" />
            <a href="tel:+255765991133">+255 765 991 133</a>
            <Link href="/admin" className="admin-link">Admin portal</Link>
          </div>
        </div>
      </div>

      <header className="main-header">
        <div className="site-container nav-wrap">
          <a href="#top" className="brand" aria-label="COSTECH at 40 home">
            <img src="/costech-logo.png" alt="COSTECH logo" />
            <span className="brand-rule" />
            <span className="brand-copy"><strong>COSTECH@40</strong><small>National Summit 2026</small></span>
          </a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
            <span /><span /><span />
          </button>
          <nav className={menuOpen ? "primary-nav nav-open" : "primary-nav"} aria-label="Main navigation">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#themes" onClick={() => setMenuOpen(false)}>Themes</a>
            <a href="#programme" onClick={() => setMenuOpen(false)}>Programme</a>
            <a href="#proceedings" onClick={() => setMenuOpen(false)}>Proceedings</a>
            <a href="#sponsor" onClick={() => setMenuOpen(false)}>Partnership</a>
            <Link href="/submit" className="nav-cta">Submit contribution <Arrow /></Link>
          </nav>
        </div>
      </header>

      <section id="top" className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="hero-images" aria-live="polite">
          {heroSlides.map((item, index) => (
            <div
              key={item.image}
              className={`hero-image ${index === slide ? "hero-image-active" : ""}`}
              style={{ backgroundImage: `url(${item.image})` }}
              aria-hidden={index !== slide}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-pattern" />
        <div className="site-container hero-inner">
          <div key={slide} className="hero-content">
            <p className="eyebrow light"><span />{current.eyebrow}</p>
            <h1>{current.title}</h1>
            <p className="hero-lead">{current.text}</p>
            <div className="hero-actions">
              <Link href="/submit" className="button button-gold">Submit your contribution <Arrow /></Link>
              <a href="#about" className="button button-ghost">Explore the summit</a>
            </div>
          </div>
          <div className="hero-sidecard">
            <div className="sidecard-date"><strong>28</strong><span>— 30</span><small>October 2026</small></div>
            <div className="sidecard-copy"><span>Hosted at</span><strong>JNICC</strong><small>Dar es Salaam, Tanzania</small></div>
          </div>
        </div>
        <div className="site-container hero-controls">
          <div className="slide-count"><strong>0{slide + 1}</strong><span>/ 0{heroSlides.length}</span></div>
          <div className="slide-progress" aria-hidden="true"><span key={slide} /></div>
          <div className="slide-buttons">
            <button onClick={() => moveSlide(slide - 1)} aria-label="Previous slide"><Arrow direction="left" /></button>
            <button onClick={() => moveSlide(slide + 1)} aria-label="Next slide"><Arrow /></button>
          </div>
        </div>
      </section>

      <section className="event-ribbon">
        <div className="site-container event-ribbon-grid">
          <div><span>01</span><p><small>Summit dates</small><strong>28–30 October 2026</strong></p></div>
          <div><span>02</span><p><small>Location</small><strong>JNICC, Dar es Salaam</strong></p></div>
          <div><span>03</span><p><small>Submission deadline</small><strong>15 August 2026</strong></p></div>
          <a href="#programme">View summit overview <Arrow /></a>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="site-container about-grid">
          <div className="about-visual reveal-card">
            <img src="https://40yrs.costech.or.tz/wp-content/uploads/2026/02/IMG_1998co.jpg" alt="Scientists and innovators at a COSTECH event" />
            <div className="about-badge"><strong>40</strong><span>years advancing<br />Tanzania's STI agenda</span></div>
            <div className="photo-caption">Science · Technology · Innovation</div>
          </div>
          <div className="about-copy">
            <p className="eyebrow"><span />About the summit</p>
            <h2>{theme.title}<br /><em>{theme.subtitle}</em></h2>
            <p className="section-lead">{theme.description}</p>
            <p>
              The COSTECH@40 Summit commemorates four decades of leadership in research coordination, innovation and evidence-informed national development. More than a conference, it is a national platform for strategic dialogue, policy engagement, partnerships and implementation-oriented solutions.
            </p>
            <div className="about-points">
              <div><strong>01</strong><span>Connect research, policy, industry and investment.</span></div>
              <div><strong>02</strong><span>Showcase Tanzanian innovations ready to scale.</span></div>
              <div><strong>03</strong><span>Accelerate Vision 2050 through practical action.</span></div>
            </div>
            <a href="#themes" className="text-link">Discover the focus areas <Arrow /></a>
          </div>
        </div>
      </section>

      <section id="themes" className="section themes-section">
        <div className="site-container">
          <div className="section-heading split-heading">
            <div><p className="eyebrow light"><span />Four pathways to transformation</p><h2>Thematic areas</h2></div>
            <p>The programme follows the systems that will define Tanzania's competitive, resilient and knowledge-led future.</p>
          </div>
          <div className="theme-grid">
            {areas.map((area, index) => (
              <article className="theme-card" key={area.id || area.title}>
                <div className="theme-number">{area.icon?.match(/^\d/) ? area.icon : `0${index + 1}`}</div>
                <h3>{area.title}</h3>
                <p>{area.summary || area.description}</p>
                <div className="theme-card-foot"><span>Explore focus</span><Arrow /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programme" className="section experience-section">
        <div className="site-container experience-grid">
          <div className="experience-copy">
            <p className="eyebrow"><span />The summit experience</p>
            <h2>Ideas designed to move.</h2>
            <p className="section-lead">Three days of exchange, demonstration and partnership—built around outcomes, not ceremony.</p>
            <div className="programme-list">
              {[
                ["01", "Policy & investment dialogues", "Align decision-makers, funders and innovators around national priorities."],
                ["02", "Innovation showcases", "Experience technologies, prototypes and implementation models first-hand."],
                ["03", "Cross-sector forums", "Build commercial, institutional and research partnerships that last."],
                ["04", "National STI launches", "Mark new milestones including NISSTI and the COSTECH STI Complex."],
              ].map(([number, title, text]) => (
                <div key={number}><span>{number}</span><p><strong>{title}</strong><small>{text}</small></p></div>
              ))}
            </div>
          </div>
          <div className="experience-visual">
            <img src="https://40yrs.costech.or.tz/wp-content/uploads/2026/02/DSC_6831-min-1.jpg" alt="STICE conference participants in discussion" />
            <div className="experience-quote"><span>“</span><p>Knowledge becomes powerful when it reaches people, policy and production.</p></div>
          </div>
        </div>
      </section>

      <section className="section submission-banner">
        <div className="site-container submission-inner">
          <div className="submission-copy">
            <p className="eyebrow light"><span />Open call</p>
            <h2>{call.title}</h2>
            <p>{call.subtitle || call.description}</p>
            <div className="submission-meta">
              <div><small>Submission opens</small><strong>01 July 2026</strong></div>
              <div><small>Initial call closes</small><strong>15 August 2026</strong></div>
              <div><small>Abstract length</small><strong>Up to 300 words</strong></div>
            </div>
          </div>
          <div className="submission-action">
            <span className="submission-ring">10<small>th</small></span>
            <p>STICE contribution portal</p>
            <Link href="/submit" className="button button-gold">Start a submission <Arrow /></Link>
            <a href={call.guidelineDocumentUrl || "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/Call-for-contribution_COSTECH@40-Summit-details.pdf"} target="_blank" rel="noreferrer" className="download-link">Download submission guide</a>
          </div>
        </div>
      </section>

      <section id="proceedings" className="section proceedings-section">
        <div className="site-container">
          <div className="section-heading split-heading dark-copy">
            <div><p className="eyebrow"><span />Knowledge archive</p><h2>STICE proceedings</h2></div>
            <p>Explore the evidence, discussion and recommendations from recent national STI conferences.</p>
          </div>
          <div className="proceedings-grid">
            {proceedings.map((item, index) => (
              <article className="proceeding-card" key={item.edition}>
                <div className="proceeding-cover">
                  <div className={`cover-art cover-${index + 1}`}><span>{item.year}</span><strong>{item.edition}</strong><small>Proceedings</small></div>
                </div>
                <div className="proceeding-copy">
                  <p className="card-kicker">{item.stat}</p>
                  <h3>{item.title}</h3>
                  <div className="document-links">
                    <a href={item.proceedings} target="_blank" rel="noreferrer">Proceedings <Arrow /></a>
                    <a href={item.report} target="_blank" rel="noreferrer">Conference report <Arrow /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsor" className="section sponsor-section">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="eyebrow"><span />Shape the future with us</p>
            <h2>Become a summit partner</h2>
            <p>Put your organization at the centre of Tanzania's science, technology and innovation transformation.</p>
          </div>
          <div className="sponsor-grid">
            {sponsors.slice(0, 3).map((packageItem) => (
              <article className={`sponsor-card ${packageItem.featured ? "sponsor-featured" : ""}`} key={packageItem.id || packageItem.name}>
                {packageItem.featured && <div className="featured-label">Main partnership</div>}
                <p className="card-kicker">{packageItem.name}</p>
                <h3>{packageItem.headline || `${packageItem.name} Partner`}</h3>
                <div className="package-price">{formatMoney(packageItem.amount, packageItem.currency)}</div>
                <p>{packageItem.description}</p>
                <ul>{packageItem.benefits.slice(0, 4).map((benefit) => <li key={benefit}><span>✓</span>{benefit}</li>)}</ul>
                <a href={`mailto:${packageItem.contactEmail || "costech40@costech.or.tz"}`} className="text-link">Discuss partnership <Arrow /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="venue-section">
        <div className="venue-image" style={{ backgroundImage: `url(${venue.imageUrl || fallbackContent.venue!.imageUrl})` }} />
        <div className="venue-overlay" />
        <div className="site-container venue-content">
          <p className="eyebrow light"><span />{venue.title}</p>
          <h2>{venue.venueName}</h2>
          <p>{venue.address && `${venue.address}, `}{venue.city}, {venue.country}</p>
          <a href={venue.mapUrl || "https://maps.google.com/?q=JNICC+Dar+es+Salaam"} target="_blank" rel="noreferrer" className="button button-ghost">View on map <Arrow /></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container footer-top">
          <div className="footer-brand">
            <div className="footer-brand-lockup">
              <img src="/costech-logo.png" alt="COSTECH logo" />
              <span><strong>COSTECH@40</strong><small>National Summit 2026</small></span>
            </div>
            <p>From legacy to future: advancing science, technology and innovation for Tanzania's Vision 2050.</p>
          </div>
          <div><h3>Summit</h3><a href="#about">About</a><a href="#themes">Thematic areas</a><a href="#programme">Programme</a><a href="#sponsor">Partnership</a></div>
          <div><h3>Participate</h3><Link href="/submit">Submit contribution</Link><a href="#proceedings">Proceedings</a><a href="https://costech.or.tz" target="_blank" rel="noreferrer">COSTECH</a><Link href="/admin">Admin portal</Link></div>
          <div><h3>Contact</h3><a href="mailto:costech40@costech.or.tz">costech40@costech.or.tz</a><a href="mailto:dg@costech.or.tz">dg@costech.or.tz</a><a href="tel:+255765991133">+255 765 991 133</a><p>Ali Hassan Mwinyi Road,<br />Kijitonyama, Dar es Salaam</p></div>
        </div>
        <div className="site-container footer-bottom"><p>© 2026 Tanzania Commission for Science and Technology.</p><span>{loading ? "Connecting to summit content…" : "Content synchronized with marathond"}</span></div>
      </footer>
    </main>
  );
}
