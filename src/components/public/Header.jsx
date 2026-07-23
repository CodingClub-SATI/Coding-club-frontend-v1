import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import useScrollProgress from '@/hooks/useScrollProgress.js';
import Button from '@/components/shared/Button';
import Updates from '@/components/public/Updates';
import './Header.module.css';

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
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const progress = useScrollProgress();
  const handleNavClick = () => { setMenuOpen(false); };

  return (
  <>
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
        {/* TODO - make this into bell icon for recent update model box */}
        <div className="header-actions">
          <Button 
            Component="button" 
            onClick={() => setIsUpdatesOpen(true)}
            variant="outline" 
            tone="primary" 
            className="header-cta"
            aria-label="View Important Updates"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginBottom: '2px' }}
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            Updates
          </Button>
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

    {isUpdatesOpen && (<UpdatesModal onClose={() => setIsUpdatesOpen(false)} />)}
  </>
  );
}
