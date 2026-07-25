import { useLoaderData, Link } from 'react-router';
import { clubInfo } from '@/data/clubInfo';
import AnimatedCounter from '@/features/home/components/AnimatedCounter';
import TypingText from '@/features/home/components/TypingText';
import Reveal from '@/components/shared/Reveal';
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
    <div className={styles.homePage}>
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
            </div>
          </div>
          
          <div className={styles.heroRight}>
            <ClubMascot />
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className={styles.aboutSection} id="about">
        <div className="container">
          {/* 3. Zero-render scroll animations abstract away IntersectionObserver logic */}
          <Reveal Component="h2" className="section-title">
            About <span className="neon-blue">Coding Club</span> SATI
          </Reveal>
          
          <p className="section-subtitle">A dynamic and vibrant technical community dedicated to fostering knowledge.</p>
          
          <Reveal delay={150} className="glass-card">
            <p>The club brings together passionate students eager to explore the ever-evolving world of technology...</p>
          </Reveal>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className={styles.statsSection}>
        <div className="container">
          <Reveal Component="h2" className="section-title">
            Club Stats & <span className="neon-blue">Achievements</span>
          </Reveal>
          
          <div className={styles.statsGrid}>
            {displayStats.map((stat, i) => (
              // Staggered delay based on index creates a clean waterfall animation effect
              <Reveal 
                key={stat.label} 
                delay={i * 100} 
                className={`${styles.statCard} glass-card`}
              >
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statNumber}>
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}