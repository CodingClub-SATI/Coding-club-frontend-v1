import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useScrollProgress from '@/hooks/useScrollProgress.js';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home', path: '/', end: true },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Teams', path: '/teams' },
  { label: 'Projects', path: '/projects' },
  { label: 'Learning', path: '/learning' },
  { label: 'Contact', path: '/contact' },
];

function NavItems({ variant, onLinkClick }) {
  return (
    <>
    {NAV_LINKS.map(link => (
      <NavLink
        key={link.path}
        to={link.path}
        end={link.end}
        onClick={onLinkClick}
        className={({ isActive }) => `navlink ${variant} ${isActive ? 'active' : ''}`.trim()}
      >
        {link.label}
      </NavLink>
    ))}
    </>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useScrollProgress();
  const handleNavClick = () => { setMenuOpen(false); };

  return (
    <header className={`header ${progress > 1 ? 'scrolled' : ''}`}>
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={`/logo.jpg`} alt="Coding Club Logo" className="logo-img" />
          <div className="logo-text">
            <strong className="logo-name text-primary-glow">Coding Club</strong>
            <span className="logo-sub">SATI Vidisha</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <NavItems variant="desktop" onLinkClick={handleNavClick} />
        </nav>

        {/* CTA */}
        <div className="header-actions">
          <Link to="/contact" className="btn-primary header-cta">
            Join Now
          </Link>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="mobile-nav" id="mobile-nav-menu">
          <NavItems variant="mobile" onLinkClick={handleNavClick} />
        </nav>
      )}
    </header>
  );
}
