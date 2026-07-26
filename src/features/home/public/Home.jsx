import { useLoaderData, Link } from 'react-router';
import { clubInfo } from '@/data/clubInfo';
import AnimatedCounter from '@/features/home/components/AnimatedCounter';
import TypingText from '@/features/home/components/TypingText';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import styles from './Home.module.css';

const STATS_CONFIG = [
  { label: "Active Members", icon: "👥", dataKey: "activeMembers" },
  { label: "Events", icon: "📅", dataKey: "totalEvents" },
  { label: "Projects", icon: "🚀", dataKey: "studentProjects" },
];

function ClubMascot() {
  return (
    <div className={styles.mascotContainer}>
      <div className={styles.mascotGlowRing} />
      <div className={styles.mascotInner}>
        <svg aria-hidden="true" width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="56" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="8 4" />
          <circle cx="60" cy="60" r="44" stroke="var(--brand-secondary)" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="18" fill="none" stroke="var(--brand-accent)" strokeWidth="1.5"/>
          <path d="M42 60l12 14 24-28" stroke="var(--brand-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className={`${styles.hudBadge} ${styles.hudTop}`}><span>⚡</span> Fast Learning</div>
      <div className={`${styles.hudBadge} ${styles.hudBottom}`}><span>💡</span> Innovation</div>
      <div className={`${styles.hudBadge} ${styles.hudRight}`}><span>&lt;/&gt;</span></div>
    </div>
  );
}

export default function Home() {
  const liveStats = useLoaderData();

  const displayStats = STATS_CONFIG.map((stat) => {
    const value = liveStats[stat.dataKey] || 0;
    return { ...stat, value, suffix: value > 0 ? '+' : '' };
  });

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className={styles.heroSection}>
        <div className={styles.heroGridOverlay} />
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} />
              <span>SATI VIDISHA · MP · INDIA</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              <span className={`${styles.heroTitleMain} text-primary-glow`}>CODING CLUB</span>
              <span className={styles.heroTitleSub}>
                <TypingText texts={['SATI VIDISHA', 'BUILD · INNOVATE', 'CODE · COFFEE', 'BEYOND CLASSROOMS']} />
              </span>
            </h1>
            
            <p className={styles.heroDesc}>{clubInfo.description}</p>
            
            <div className={styles.heroCtas}>
              <Button Component={Link} to="/learning" variant="filled">
                Learning Resources
              </Button>
              <Button Component={Link} to="/events" variant="outline" tone="secondary">
                Explore Events
              </Button>
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <ClubMascot />
          </div>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollDot} />
          SCROLL
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className={styles.aboutSection} id="about">
        <div className="container">
          <Reveal Component="h2" className="section-title">
            About <span className="text-primary-glow">Coding Club</span> SATI
          </Reveal>
          
          <p className="section-subtitle">A dynamic and vibrant technical community dedicated to fostering knowledge.</p>
          
          <Reveal delay={150}>
            <Glasscard>
              <p>The club brings together passionate students eager to explore the ever-evolving world of technology...</p>
            </Glasscard>
          </Reveal>
        </div>
      </section>

      {/* Director Quote */}
      <section className="section">
        <div className="container">
          <Reveal Component={Glasscard} className={styles.directorCard}>
            <div className={styles.quoteMark} aria-hidden="true">"</div>
            <blockquote>
              Our mission is to bridge the gap between academic curriculum and industry demands. We empower students to build real-world solutions and foster a culture of continuous learning.
            </blockquote>
            <div className={styles.directorAttribution}>
              <div className={styles.directorAvatar} aria-hidden="true">NV</div>
              <div>
                <div className={styles.directorName}>Dr. Neha Verma</div>
                <div className={styles.directorRole}>Faculty Mentor</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className={styles.statsSection}>
        <div className="container">
          <Reveal Component="h2" className="section-title">
            Club Stats & <span className="text-primary-glow">Achievements</span>
          </Reveal>
          
          <div className={styles.statsGrid}>
            {displayStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <Glasscard className={styles.statCard}>
                  <div className={styles.statIcon}>{stat.icon}</div>
                  <div className={styles.statNumber}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </Glasscard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA  */}
      <section className="section">
        <div className="container">
          <Reveal Component={Glasscard} className={styles.ctaBox}>
            <div className={styles.ctaPulse} aria-hidden="true" />
            <h2>Ready to <span className="text-primary-glow">Level Up?</span></h2>
            <p>Join the community, participate in hackathons, and build your network.</p>
            <Button Component={Link} to="/events" variant="filled">
              View Upcoming Events
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}