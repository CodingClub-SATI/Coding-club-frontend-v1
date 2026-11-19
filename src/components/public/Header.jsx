import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Bell } from 'lucide-react';
import useScrollProgress from '@/hooks/useScrollProgress.js';
import Updates from '@/features/updates/public/Updates';
import styles from './Header.module.css';

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
        className={({ isActive }) => `${styles.navlink} ${styles[variant]} ${isActive ? styles.active : ''}`.trim()}
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
    <header className={`${styles.header} ${progress > 1 ? styles.scrolled : ''}`.trim()}>
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={`/logo.jpg`} alt="Coding Club Logo" className={styles.logoImg} />
          <div className={styles.logoText}>
            <strong className={`${styles.logoName} text-primary-glow`}>Coding Club</strong>
            <span className={styles.logoSub}>SATI Vidisha</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <NavItems variant="desktop" onLinkClick={handleNavClick} />
        </nav>

        {/* Announcement CTA */}
        <div className={styles.headerActions}>
          <button 
            type="button" 
            onClick={() => setIsUpdatesOpen(true)}
            className={styles.announcementTrigger}
            aria-label="View Important Updates"
            title="Club Announcements & Notices"
          >
            <span className={styles.bellContainer}>
              <Bell size={16} className={styles.bellIcon} />
              <span className={styles.liveBeacon} aria-hidden="true">
                <span className={styles.beaconPing} />
                <span className={styles.beaconDot} />
              </span>
            </span>
            <span className={styles.announcementText}>Updates</span>
          </button>
          <button
            type="button"
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`.trim()}
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
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className={styles.mobileNav} id="mobile-nav-menu">
          <NavItems variant="mobile" onLinkClick={handleNavClick} />
        </nav>
      )}
    </header>

    {isUpdatesOpen && <Updates onClose={() => setIsUpdatesOpen(false)} />}
  </>
  );
}