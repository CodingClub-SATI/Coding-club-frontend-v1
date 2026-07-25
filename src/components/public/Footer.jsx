import { Link } from 'react-router';
import { clubInfo } from '@/data/clubInfo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="neon-divider" />
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <img 
                src={'/logo.jpg'} 
                alt="Coding Club SATI Logo" 
                style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
              />
              <span className={styles.footerLogoText}>Coding Club 
                <span className="neon-blue"> SATI</span>
              </span>
            </div>
            <p className={styles.footerTagline}>{clubInfo.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              {[['Home', '/'], ['Events', '/events'], ['Gallery', '/gallery'], ['Teams', '/teams'], ['Projects', '/projects']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={styles.footerHeading}>Resources</h4>
            <ul className={styles.footerLinks}>
              {[['Learning Hub', '/learning'], ['Contact Us', '/contact']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
              <li><a href={clubInfo.socials.github} target="_blank" rel="noreferrer">GitHub Repos</a></li>
              <li><a href={clubInfo.socials.discord} target="_blank" rel="noreferrer">Discord Server</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.footerHeading}>Contact</h4>
            <div className={styles.footerContact}>
              <p><span className="neon-blue">✉</span> {clubInfo.email}</p>
              <p><span className="neon-blue">📞</span> {clubInfo.phone}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '8px' }}>
                SATI Vidisha, Madhya Pradesh, India
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Coding Club SATI. All rights reserved.</p>
          <p>Designed & Developed by <span className="neon-blue">Coding Club SATI</span></p>
        </div>
      </div>
    </footer>
  );
}
