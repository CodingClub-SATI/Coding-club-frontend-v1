import { Link } from 'react-router';
import SocialLink from '@/components/shared/SocialLink';
import { getSocialLinks } from '@/data/socialLinks';
import styles from './Footer.module.css';

export default function Footer({ contactInfo }) {
  const socialLinks = getSocialLinks(contactInfo, 'showOnFooter');

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

            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map((link) => (
                  <SocialLink key={link.label} href={link.href} label={link.label}>
                    {link.icon}
                  </SocialLink>
                ))}
              </div>
            )}
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
              {contactInfo?.github?.url && (
                <li><a href={contactInfo.github.url} target="_blank" rel="noreferrer">GitHub Repos</a></li>
              )}
              {contactInfo?.discord?.url && (
                <li><a href={contactInfo.discord.url} target="_blank" rel="noreferrer">Discord Server</a></li>
              )}
              {contactInfo?.youtube && (
                <li><a href={contactInfo.youtube} target="_blank" rel="noreferrer">YouTube Channel</a></li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.heading}>Contact</h4>
            <div className={styles.contact}>
              {contactInfo?.email && <p><span className="text-primary-glow">✉</span> {contactInfo.email}</p>}
              {contactInfo?.phone && <p><span className="text-primary-glow">📞</span> {contactInfo.phone}</p>}
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
