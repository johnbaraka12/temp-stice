"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fallbackContent, getPublicContent, type SticeContent } from "../lib/stice";

const programmeUrl = "/documents/costech40-public-programme.pdf";

const heroSlides = [
  {
    image: "/images/stice-update-forum.jpeg",
    eyebrow: "17–18 November 2026 · Dar es Salaam",
    title: "Four decades of ideas. One bold road ahead.",
    text: "COSTECH@40 brings research, policy, industry and investment together at Mlimani City Conference Centre to shape Tanzania's knowledge-driven future.",
  },
  {
    image: "/images/stice-update-speaker.jpeg",
    eyebrow: "From Legacy to Future",
    title: "Where evidence becomes action.",
    text: "Two focused days connect scientific knowledge, national priorities and the partnerships that will move Tanzania towards Vision 2050.",
  },
  {
    image: "/images/stice-update-exhibition.jpeg",
    eyebrow: "Research · Innovation · Enterprise",
    title: "Meet the people building what comes next.",
    text: "Explore Tanzanian innovation, join strategic dialogue and build collaborations across research, government, industry and society.",
  },
];

const dayOneSchedule = [
  ["07:30", "Arrival and registration"],
  ["08:30", "Welcome remarks and summit objectives"],
  ["08:45", "Panel 1 — Science for Tanzania's Prosperity"],
  ["10:30", "Panel 2 — Tanzania's Interests in Global Science"],
  ["11:30", "Panel 3 — National Evidence for National Progress"],
  ["14:00", "Panel 4 — Innovation for Industrial Growth and Jobs"],
  ["15:30", "Women in Science Forum"],
  ["TBA", "Media Awards"],
];

const panelActivities = [
  {
    title: "Science for Tanzania's Prosperity",
    summary: "How science, research and national capabilities can advance inclusive prosperity across Tanzania.",
  },
  {
    title: "Tanzania's Interests in Global Science",
    summary: "Positioning national priorities, partnerships and representation within the global science ecosystem.",
  },
  {
    title: "National Evidence for National Progress",
    summary: "Strengthening national decisions through coordinated research, trusted data and actionable evidence.",
  },
  {
    title: "Innovation for Industrial Growth and Jobs",
    summary: "Turning ideas and technology into productive industries, competitive enterprises and quality employment.",
  },
];

const dayTwoHighlights = [
  "Guest arrivals, registration, breakfast and entertainment",
  "Guest of Honour tours the science, technology and innovation exhibition",
  "COSTECH's 40-year report and stakeholder recommendations towards Vision 2050",
  "Zanzibar Government remarks and the Minister's welcome to the Guest of Honour",
  "Launch of the preliminary National Research Coordination Report",
  "STI leadership awards followed by the Guest of Honour address",
  "Group photos, lunch, exhibition and investment and market networking",
];

const mediaStories = [
  { video: "/media/summit-voice-knowledge-economy.mp4", poster: "/media/summit-voice-knowledge-economy-poster.png", kicker: "Summit conversation 01", title: "The knowledge economy", text: "Why research, skills and innovation matter to Tanzania's next growth chapter." },
  { video: "/media/summit-voice-costech40.mp4", poster: "/media/summit-voice-costech40-poster.png", kicker: "Summit conversation 02", title: "Forty years of progress", text: "A broadcast reflection on COSTECH's contribution and the national milestone ahead." },
  { video: "/media/summit-voice-preview.mp4", poster: "/media/summit-voice-preview-poster.png", kicker: "Summit conversation 03", title: "The official summit preview", text: "What visitors can expect from the national gathering at Mlimani City." },
];

const proceedings = [
  { edition: "9th STICE", title: "Research for a climate-resilient future", stat: "76 papers", year: "2026", report: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/9th-STICE-Report.pdf", proceedings: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/9th-STICE-Proceedings.pdf" },
  { edition: "8th STICE", title: "Science, technology and innovation in practice", stat: "National forum", year: "2024", report: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/8th-STICE-Report.pdf", proceedings: "https://40yrs.costech.or.tz/wp-content/uploads/2026/07/8th-STICE-Proceedings.pdf" },
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
    getPublicContent(controller.signal).then(setContent).catch(() => setContent(fallbackContent)).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const current = heroSlides[slide];
  const sponsors = useMemo(() => [...content.sponsorshipPackages].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder), [content.sponsorshipPackages]);
  const theme = content.mainTheme || fallbackContent.mainTheme!;

  function moveSlide(next: number) {
    setSlide((next + heroSlides.length) % heroSlides.length);
  }

  return (
    <main className="site-shell">
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <div className="utility-agency"><img src="/costech-logo.png" alt="COSTECH logo" /><p>Tanzania Commission for Science and Technology (COSTECH)</p></div>
          <div><a href="mailto:costech40@costech.or.tz">costech40@costech.or.tz</a><span className="utility-dot" /><a href="tel:+255765991133">+255 765 991 133</a><Link href="/admin" className="admin-link">Admin portal</Link></div>
        </div>
      </div>

      <header className="main-header">
        <div className="site-container nav-wrap">
          <a href="#top" className="brand" aria-label="COSTECH at 40 home"><img src="/costech-logo.png" alt="COSTECH logo" /><span className="brand-rule" /><span className="brand-copy"><strong>COSTECH@40</strong><small>National Summit 2026</small></span></a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /><span /></button>
          <nav className={menuOpen ? "primary-nav nav-open" : "primary-nav"} aria-label="Main navigation">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#themes" onClick={() => setMenuOpen(false)}>Themes</a><a href="#programme" onClick={() => setMenuOpen(false)}>Programme</a><a href="#media" onClick={() => setMenuOpen(false)}>Media</a><a href="#sponsor" onClick={() => setMenuOpen(false)}>Partnership</a>
            <a href={programmeUrl} target="_blank" rel="noreferrer" className="nav-cta">Official programme <Arrow /></a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="hero-images" aria-live="polite">{heroSlides.map((item, index) => <div key={item.image} className={`hero-image ${index === slide ? "hero-image-active" : ""}`} style={{ backgroundImage: `url(${item.image})` }} aria-hidden={index !== slide} />)}</div>
        <div className="hero-overlay" /><div className="hero-pattern" />
        <div className="site-container hero-inner">
          <div key={slide} className="hero-content"><p className="eyebrow light"><span />{current.eyebrow}</p><h1>{current.title}</h1><p className="hero-lead">{current.text}</p><div className="hero-actions"><a href={programmeUrl} target="_blank" rel="noreferrer" className="button button-gold">View official programme <Arrow /></a><a href="#media" className="button button-ghost">Watch summit stories</a></div></div>
          <div className="hero-sidecard"><div className="sidecard-date"><strong>17</strong><span>— 18</span><small>November 2026</small></div><div className="sidecard-copy"><span>Hosted at</span><strong>Mlimani City</strong><small>Dar es Salaam, Tanzania</small></div></div>
        </div>
        <div className="site-container hero-controls"><div className="slide-count"><strong>0{slide + 1}</strong><span>/ 0{heroSlides.length}</span></div><div className="slide-progress" aria-hidden="true"><span key={slide} /></div><div className="slide-buttons"><button onClick={() => moveSlide(slide - 1)} aria-label="Previous slide"><Arrow direction="left" /></button><button onClick={() => moveSlide(slide + 1)} aria-label="Next slide"><Arrow /></button></div></div>
      </section>

      <section className="event-ribbon"><div className="site-container event-ribbon-grid"><div><span>01</span><p><small>Summit dates</small><strong>17–18 November 2026</strong></p></div><div><span>02</span><p><small>Location</small><strong>Mlimani City, Dar es Salaam</strong></p></div><div><span>03</span><p><small>Participation</small><strong>Free with registration</strong></p></div><a href="#programme">Explore the programme <Arrow /></a></div></section>

      <section id="about" className="section about-section">
        <div className="site-container about-grid">
          <div className="about-visual reveal-card"><img src="/images/stice-update-exhibition.jpeg" alt="COSTECH leaders visiting an innovation exhibition" /><div className="about-badge"><strong>40</strong><span>years advancing<br />Tanzania's STI agenda</span></div><div className="photo-caption">Science · Technology · Innovation</div></div>
          <div className="about-copy"><p className="eyebrow"><span />About the summit</p><h2>{theme.title}<br /><em>{theme.subtitle}</em></h2><p className="section-lead">{theme.description}</p><p>The COSTECH@40 Summit commemorates four decades of leadership in research coordination, innovation and evidence-informed national development. More than a conference, it is a national platform for strategic dialogue, policy engagement, partnerships and implementation-oriented solutions.</p><div className="about-points"><div><strong>01</strong><span>Connect research, policy, industry and investment.</span></div><div><strong>02</strong><span>Showcase Tanzanian innovations ready to scale.</span></div><div><strong>03</strong><span>Accelerate Vision 2050 through practical action.</span></div></div><a href="#programme" className="text-link">See the two-day programme <Arrow /></a></div>
        </div>
      </section>

      <section id="themes" className="section themes-section">
        <div className="site-container"><div className="section-heading split-heading"><div><p className="eyebrow light"><span />Day One · Four national conversations</p><h2>Panel activity themes</h2></div><p>The four official panel activities move from national prosperity and global science to evidence-led progress, industrial growth and jobs.</p></div><div className="theme-grid">{panelActivities.map((panel, index) => <article className="theme-card" key={panel.title}><div className="theme-number">{`0${index + 1}`}</div><h3>{panel.title}</h3><p>{panel.summary}</p><div className="theme-card-foot"><span>Day One panel</span><Arrow /></div></article>)}</div></div>
      </section>

      <section id="programme" className="section programme-section">
        <div className="site-container">
          <div className="section-heading split-heading dark-copy programme-heading"><div><p className="eyebrow"><span />Official public programme</p><h2>Two days built for action.</h2></div><div className="programme-intro"><p>Dialogue, evidence, innovation and national leadership come together across a focused two-day programme.</p><span className="programme-version">Updated 15 November 2026 · 5 pages</span><a href={programmeUrl} target="_blank" rel="noreferrer" className="text-link">Download the updated programme <Arrow /></a></div></div>
          <div className="schedule-grid">
            <article className="schedule-card schedule-card-primary"><div className="schedule-day"><span>Day 01</span><p><strong>Tuesday</strong><small>17 November 2026</small></p></div><div className="schedule-timeline">{dayOneSchedule.map(([time, title]) => <div key={`${time}-${title}`}><time>{time}</time><p>{title}</p></div>)}</div></article>
            <article className="schedule-card schedule-card-secondary"><div className="schedule-day"><span>Day 02</span><p><strong>Wednesday</strong><small>18 November 2026</small></p></div><div className="guest-note"><small>Guest of Honour</small><strong>Hon. Dr. Mwigulu Lameck Nchemba</strong><span>Prime Minister of the United Republic of Tanzania</span></div><ol className="day-two-list">{dayTwoHighlights.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></article>
          </div>
        </div>
      </section>

      <section id="media" className="section media-section">
        <div className="site-container">
          <div className="section-heading split-heading media-heading"><div><p className="eyebrow light"><span />Summit in motion</p><h2>See the ideas behind the gathering.</h2></div><p>Meet the innovators, listen to the public conversation and arrive with a clear view of why COSTECH@40 matters now.</p></div>
          <div className="media-feature"><div className="feature-video-shell"><video controls playsInline preload="metadata" poster="/media/costech-innovation-showcase-poster.png" aria-label="COSTECH innovation showcase highlight"><source src="/media/costech-innovation-showcase.mp4" type="video/mp4" /></video></div><div className="feature-video-copy"><p className="card-kicker">Featured film</p><h3>Innovation made in Tanzania</h3><p>A field look at the people and practical ideas turning science and technology into solutions for communities, services and enterprise.</p><div><span>45 sec highlight</span><span>Innovation showcase</span></div></div></div>
          <div className="media-story-grid">{mediaStories.map((story) => <article className="media-story-card" key={story.video}><video controls playsInline preload="metadata" poster={story.poster} aria-label={story.title}><source src={story.video} type="video/mp4" /></video><div><p className="card-kicker">{story.kicker}</p><h3>{story.title}</h3><p>{story.text}</p></div></article>)}</div>
        </div>
      </section>

      <section id="participate" className="section participation-banner">
        <div className="site-container participation-grid">
          <div className="participation-copy"><p className="eyebrow light"><span />Be part of COSTECH@40</p><h2>Come ready to learn, connect and build.</h2><p>Participation is free. Join Tanzania's science, technology and innovation community at Mlimani City Conference Centre on 17–18 November 2026.</p><div className="participation-meta"><div><small>Dates</small><strong>17–18 Nov 2026</strong></div><div><small>Venue</small><strong>Mlimani City</strong></div><div><small>City</small><strong>Dar es Salaam</strong></div></div><div className="participation-actions"><a href={programmeUrl} target="_blank" rel="noreferrer" className="button button-gold">Download programme <Arrow /></a><a href="mailto:costech40@costech.or.tz" className="button button-ghost">Contact the summit team</a></div></div>
          <figure className="participation-poster"><img src="/media/summit-registration.png" alt="COSTECH at 40 Summit free participation and registration information" /><figcaption>Scan the official poster QR code for participation details.</figcaption></figure>
        </div>
      </section>

      <section id="proceedings" className="section proceedings-section">
        <div className="site-container"><div className="section-heading split-heading dark-copy"><div><p className="eyebrow"><span />Knowledge archive</p><h2>STICE proceedings</h2></div><p>Explore the evidence, discussion and recommendations from recent national STI conferences.</p></div><div className="proceedings-grid">{proceedings.map((item, index) => <article className="proceeding-card" key={item.edition}><div className="proceeding-cover"><div className={`cover-art cover-${index + 1}`}><span>{item.year}</span><strong>{item.edition}</strong><small>Proceedings</small></div></div><div className="proceeding-copy"><p className="card-kicker">{item.stat}</p><h3>{item.title}</h3><div className="document-links"><a href={item.proceedings} target="_blank" rel="noreferrer">Proceedings <Arrow /></a><a href={item.report} target="_blank" rel="noreferrer">Conference report <Arrow /></a></div></div></article>)}</div></div>
      </section>

      <section id="sponsor" className="section sponsor-section">
        <div className="site-container"><div className="section-heading centered-heading"><p className="eyebrow"><span />Shape the future with us</p><h2>Become a summit partner</h2><p>Put your organization at the centre of Tanzania's science, technology and innovation transformation.</p></div><div className="sponsor-grid">{sponsors.slice(0, 3).map((packageItem) => <article className={`sponsor-card ${packageItem.featured ? "sponsor-featured" : ""}`} key={packageItem.id || packageItem.name}>{packageItem.featured && <div className="featured-label">Main partnership</div>}<p className="card-kicker">{packageItem.name}</p><h3>{packageItem.headline || `${packageItem.name} Partner`}</h3><div className="package-price">{formatMoney(packageItem.amount, packageItem.currency)}</div><p>{packageItem.description}</p><ul>{packageItem.benefits.slice(0, 4).map((benefit) => <li key={benefit}><span>✓</span>{benefit}</li>)}</ul><a href={`mailto:${packageItem.contactEmail || "costech40@costech.or.tz"}`} className="text-link">Discuss partnership <Arrow /></a></article>)}</div></div>
      </section>

      <section className="venue-section"><div className="venue-image" style={{ backgroundImage: "url(/images/stice-update-forum.jpeg)" }} /><div className="venue-overlay" /><div className="site-container venue-content"><p className="eyebrow light"><span />The summit venue</p><h2>Mlimani City Conference Centre</h2><p>Sam Nujoma Road, Dar es Salaam, United Republic of Tanzania</p><a href="https://maps.google.com/?q=Mlimani+City+Conference+Centre+Dar+es+Salaam" target="_blank" rel="noreferrer" className="button button-ghost">View on map <Arrow /></a></div></section>

      <footer className="site-footer">
        <div className="site-container footer-top"><div className="footer-brand"><div className="footer-brand-lockup"><img src="/costech-logo.png" alt="COSTECH logo" /><span><strong>COSTECH@40</strong><small>National Summit 2026</small></span></div><p>From legacy to future: advancing science, technology and innovation for Tanzania's Vision 2050.</p></div><div><h3>Summit</h3><a href="#about">About</a><a href="#themes">Thematic areas</a><a href="#programme">Programme</a><a href="#media">Media</a></div><div><h3>Participate</h3><a href={programmeUrl} target="_blank" rel="noreferrer">Official programme</a><a href="#participate">Participation details</a><a href="#proceedings">Proceedings</a><Link href="/admin">Admin portal</Link></div><div><h3>Contact</h3><a href="mailto:costech40@costech.or.tz">costech40@costech.or.tz</a><a href="mailto:dg@costech.or.tz">dg@costech.or.tz</a><a href="tel:+255765991133">+255 765 991 133</a><p>Ali Hassan Mwinyi Road,<br />Kijitonyama, Dar es Salaam</p></div></div>
        <div className="site-container footer-bottom"><p>© 2026 Tanzania Commission for Science and Technology.</p><span>{loading ? "Connecting to summit content…" : "Content synchronized with marathond"}</span></div>
      </footer>
    </main>
  );
}
