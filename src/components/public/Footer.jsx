import { Link } from 'react-router';
import { Mail, Phone, MapPin, ArrowUp, ArrowUpRight } from 'lucide-react';
import { getSocialLinks } from '@/data/socialLinks';
import styles from './Footer.module.css';

export default function Footer({ contactInfo }) {
  const footerSocials = getSocialLinks(contactInfo, 'showOnFooter');
  // Fallback to any available socials if showOnFooter isn't toggled yet in admin
  const socialLinks = footerSocials.length > 0 ? footerSocials : getSocialLinks(contactInfo);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const emailAddress = contactInfo?.email || 'codingclub@satiengg.in';
  const phoneNumber = contactInfo?.phone;
  const discordUrl = contactInfo?.discord?.url || 'https://discord.gg/codingclub-sati';
  const githubUrl = contactInfo?.github?.url || 'https://github.com/CodingClub-SATI';

  return (
    <footer className={styles.footer}>
      {/* Ambient decorative glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.topBorderGlow} aria-hidden="true" />

      <div className={`container ${styles.innerContainer}`}>
        {/* Top Header Bar */}
        <div className={styles.topBar}>
          <div className={styles.brandRow}>
            <div className={styles.logoWrapper}>
              <img 
                src="/logo.jpg" 
                alt="Coding Club SATI Logo" 
                className={styles.logoImg} 
              />
            </div>
            <div className={styles.brandText}>
              <div className={styles.brandTitle}>
                Coding Club <span className="text-primary-glow">SATI</span>
              </div>
              <div className={styles.brandSub}>
                Samrat Ashok Technological Institute · Vidisha
              </div>
            </div>
          </div>

          <div className={styles.topRight}>
            <a 
              href={discordUrl} 
              target="_blank" 
              rel="noreferrer" 
              className={styles.discordPill}
              title="Join our Discord community"
            >
              <span>Join Discord</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Main 4-Column Grid */}
        <div className={styles.grid}>
          {/* Col 1: About & Socials */}
          <div className={styles.aboutCol}>
            <div className={styles.aboutBadge}>
              <span className={styles.badgeDot} />
              <span>Student Developer Community</span>
            </div>
            <p className={styles.aboutText}>
              The official technical club of SATI Vidisha. We build open-source software, host hackathons, and run peer-led workshops to empower student developers.
            </p>

            <div className={styles.socialSection}>
              <span className={styles.socialHeading}>Connect With Us</span>
              <div className={styles.socialRow}>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${styles.socialBtn} ${styles[`social_${link.key}`] || ''}`}
                    aria-label={link.label}
                    title={link.label}
                  >
                    <span className={styles.socialIconBox}>{link.icon}</span>
                    <span className={styles.socialTooltip}>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navigation</h4>
            <ul className={styles.linksList}>
              {[
                ['Home', '/'],
                ['Events & Workshops', '/events'],
                ['Student Projects', '/projects'],
                ['Core Team', '/teams'],
                ['Campus Gallery', '/gallery'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className={styles.footerLink}>
                    <span className={styles.linkDash}>–</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.linksList}>
              {[
                ['Learning Hub', '/learning'],
                ['Contact & Support', '/contact'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className={styles.footerLink}>
                    <span className={styles.linkDash}>–</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
              {githubUrl && (
                <li>
                  <a href={githubUrl} target="_blank" rel="noreferrer" className={styles.footerLink}>
                    <span className={styles.linkDash}>–</span>
                    <span>GitHub Repos</span>
                    <ArrowUpRight size={11} className={styles.externalIcon} />
                  </a>
                </li>
              )}
              {discordUrl && (
                <li>
                  <a href={discordUrl} target="_blank" rel="noreferrer" className={styles.footerLink}>
                    <span className={styles.linkDash}>–</span>
                    <span>Discord Server</span>
                    <ArrowUpRight size={11} className={styles.externalIcon} />
                  </a>
                </li>
              )}
              <li>
                <a href="https://www.satiengg.in/" target="_blank" rel="noreferrer" className={styles.footerLink}>
                  <span className={styles.linkDash}>–</span>
                  <span>SATI Official Portal</span>
                  <ArrowUpRight size={11} className={styles.externalIcon} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Base */}
          <div className={styles.campusCol}>
            <h4 className={styles.colTitle}>Campus Base</h4>
            
            <div className={styles.campusCards}>
              <div className={styles.contactCard}>
                <div className={styles.cardIconBox}>
                  <MapPin size={15} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeading}>Department of CSE</div>
                  <div className={styles.cardBody}>
                    Samrat Ashok Technological Institute<br />
                    Vidisha, Madhya Pradesh – 464001
                  </div>
                </div>
              </div>

              <a href={`mailto:${emailAddress}`} className={styles.contactCardLink}>
                <div className={styles.cardIconBox}>
                  <Mail size={15} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeading}>Official Mail Desk</div>
                  <div className={styles.cardBody}>{emailAddress}</div>
                </div>
              </a>

              {phoneNumber && (
                <a href={`tel:${phoneNumber}`} className={styles.contactCardLink}>
                  <div className={styles.cardIconBox}>
                    <Phone size={15} />
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeading}>Campus Helpline</div>
                    <div className={styles.cardBody}>{phoneNumber}</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <span>© {new Date().getFullYear()} Coding Club SATI.</span>
            <span className={styles.copySub}>Student-run technical society.</span>
          </div>

          <div className={styles.attribution}>
            <span>Crafted with</span>
            <span className={styles.heart}>♥</span>
            <span>by <strong className="text-primary-glow">SATI Student Developers</strong></span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={13} className={styles.backToTopIcon} />
          </button>
        </div>
      </div>
    </footer>
  );
}
