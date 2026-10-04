import { ArrowDownRight, ArrowUpRight, Menu, Milk, ScanLine } from 'lucide-react'
import pastureHero from '../assets/pasture-hero.png'

const links = [
  ['home', 'Home'],
  ['about', 'Our project'],
  ['detection', 'Breed finder'],
  ['analysis', 'Milk analysis'],
]

export default function Header({ onToggleSidebar }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <header id="home" className="site-header">
      <nav className="top-nav" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); scrollTo('home') }}>
          <span className="brand-mark"><Milk size={21} strokeWidth={2.2} /></span>
          <span><strong>Pashu<span>Pehchan</span></strong><small>FIELD NOTES · INDIA</small></span>
        </a>
        <div className="nav-links">
          {links.map(([id, label]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
        </div>
        <button className="nav-cta" onClick={() => scrollTo('detection')}>Identify a breed <ArrowUpRight size={16} /></button>
        <button className="mobile-menu" onClick={onToggleSidebar} aria-label="Open menu"><Menu size={21} /></button>
      </nav>

      <div className="hero-panel" style={{ backgroundImage: `linear-gradient(90deg, rgba(27,22,18,.78) 0%, rgba(27,22,18,.48) 43%, rgba(27,22,18,.08) 100%), url(${pastureHero})` }}>
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><i /> A closer look at India’s native breeds</span>
          <h1>Know the breed.<br /><em>Care a little better.</em></h1>
          <p>One clear photo can tell you a lot. Meet PashuPehchan, a field guide to the cattle and buffalo breeds raised across India.</p>
          <div className="hero-actions">
            <button className="button-dark" onClick={() => scrollTo('detection')}>Find a breed <ArrowUpRight size={17} /></button>
            <button className="button-text" onClick={() => scrollTo('about')}>Explore the project <ArrowDownRight size={17} /></button>
          </div>
        </div>
        <div className="hero-caption"><span>01 / 12</span><i /> GIR · GUJARAT</div>
        <div className="hero-stamp"><span>ROOTED IN</span><strong>INDIA</strong><small>12 BREEDS · ONE FIELD GUIDE</small></div>
      </div>

      <div className="welcome-strip">
        <div className="welcome-kicker"><span>THE PASHUPEHCHAN FIELD GUIDE</span><span>EST. 2025 — 26</span></div>
        <div className="welcome-content">
          <div><p className="eyebrow">Good care starts with knowing</p><h2>Every breed has<br />a story worth knowing.</h2></div>
          <p>From the red coats of Gir country to the sturdy buffaloes of the north, discover the animals, their origins, and what makes each one special.</p>
          <button className="round-link" onClick={() => scrollTo('about')} aria-label="Explore breed stories"><ArrowDownRight size={22} /></button>
        </div>
        <div className="welcome-decoration">12 <span>BREEDS</span></div>
      </div>
    </header>
  )
}
