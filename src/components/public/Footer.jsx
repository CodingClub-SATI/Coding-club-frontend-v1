import { Link } from 'react-router';
import { clubInfo } from '@/data/clubInfo';
import SocialLink from '@/components/shared/SocialLink';
import { SOCIAL_LINKS } from '@/data/socialLinks';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="section-divider" />
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img 
                src={'/logo.jpg'} 
                alt="Coding Club SATI Logo" 
                className={styles.logoImg} 
              />
              <span className={styles.logoText}>Coding Club 
                <span className="text-primary-glow"> SATI</span>
              </span>
            </div>
            <p className={styles.tagline}>{clubInfo.tagline}</p>

            <div className={styles.socials}>
              {SOCIAL_LINKS.map((link) => (
                <SocialLink key={link.label} href={link.href} label={link.label}>
                  {link.icon}
                </SocialLink>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className={styles.linksWrapper}>
              {[['Home', '/'], ['Events', '/events'], ['Gallery', '/gallery'], ['Teams', '/teams'], ['Projects', '/projects']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={styles.heading}>Resources</h4>
            <ul className={styles.linksWrapper}>
              {[['Learning Hub', '/learning'], ['Contact Us', '/contact']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
              <li><a href={clubInfo.socials.github} target="_blank" rel="noreferrer">GitHub Repos</a></li>
              <li><a href={clubInfo.socials.discord} target="_blank" rel="noreferrer">Discord Server</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.heading}>Contact</h4>
            <div className={styles.contact}>
              <p><span className="text-primary-glow">✉</span> {clubInfo.email}</p>
              <p><span className="text-primary-glow">📞</span> {clubInfo.phone}</p>
              <p className={styles.address}>
                SATI Vidisha, Madhya Pradesh, India
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Coding Club SATI. All rights reserved.</p>
          <p>Designed & Developed by <span className="text-primary-glow">Coding Club SATI</span></p>
        </div>
      </div>
    </footer>
  );
}