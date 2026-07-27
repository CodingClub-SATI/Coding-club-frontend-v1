import { useLoaderData, Link } from 'react-router';
import { clubInfo } from '@/data/clubInfo';
import AnimatedCounter from '@/features/home/components/AnimatedCounter';
import TypingText from '@/features/home/components/TypingText';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import { BookOpen, Users, Target, Eye, Quote } from 'lucide-react';
import styles from './Home.module.css';

const STATS_CONFIG = [
  { label: "Active Members", icon: "👥", dataKey: "activeMembers" },
  { label: "Events", icon: "📅", dataKey: "totalEvents" },
  { label: "Projects", icon: "🚀", dataKey: "studentProjects" },
  { label: "Workshop", icon: "🏆", dataKey: "total Workshop"},
];

function ClubMascot() {
  return (
    <div className={styles.mascotContainer}>
      <div className={styles.mascotGlowRing} />
      <div className={styles.mascotInner}>
        <svg aria-hidden="true" width="140" height="140" viewBox="0 0 140 140" fill="none">
          {/* Outer dashed tech ring */}
          <circle cx="70" cy="70" r="64" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.5" />
          
          {/* Inner solid ring */}
          <circle cx="70" cy="70" r="48" stroke="var(--brand-secondary)" strokeWidth="1" opacity="0.7" />
          
          {/* Perfectly Centered & Scaled Coffee Mug Vector */}
          <g transform="translate(46, 42)">
            {/* Mug Body */}
            <path 
              d="M8 10H40C40 30 35 40 24 40C13 40 8 30 8 10Z" 
              fill="rgba(var(--brand-accent-rgb), 0.12)" 
              stroke="var(--brand-accent)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Mug Handle */}
            <path 
              d="M40 16C49 16 51 28 42 34" 
              stroke="var(--brand-secondary)" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            {/* Steam / Code lines rising */}
            <path 
              d="M18 1C18 -1 22 -1 22 -3" 
              stroke="var(--brand-accent)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              opacity="0.8" 
            />
            <path 
              d="M28 2C28 0 32 0 32 -2" 
              stroke="var(--brand-secondary)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              opacity="0.8" 
            />
          </g>
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
      {/* Hero */}
      <section className={`section ${styles.heroSection}`}>
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
                <TypingText texts={['SATI VIDISHA', 'BUILD · INNOVATE', 'CODE · COFFEE', 'BEYOND CLASSROOMS', 'HELLO WORLD!']} />
              </span>
            </h1>
            
            <p className={styles.heroDesc}>{clubInfo.description}</p>
            
            <div className={styles.heroCtas}>
              <Button Component={Link} to="/learning" variant="filled">
                <BookOpen size={16} /> Learning Resources
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
          SCROLL
          <span className={styles.scrollDot} />
        </div>
      </section>

      {/* About */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <Reveal Component="h2" className="section-title">
            About <span className="text-primary-glow">Coding Club</span> SATI
          </Reveal>
          
          <p className="section-subtitle">A dynamic and vibrant technical community dedicated to fostering knowledge.</p>
          
          <Reveal delay={150}>
            <Glasscard className={styles.aboutDescBox}>
              <p>
                Our club brings together students who are passionate about technology and eager to learn, build, and grow together. Through workshops, coding sessions, projects, hackathons, competitions, and collaborative activities, members explore a wide range of computer science domains—including AI, cybersecurity, blockchain, web development, app development, and more—while developing problem-solving, teamwork, and practical technical skills...
              </p>
            </Glasscard>
          </Reveal>

          <div className={`grid-3 ${styles.aboutCardsGrid}`}>
            {[
              {
                icon: <Users size={28} />,
                title: 'About Club',
                text: 'A dynamic technical community fostering knowledge in coding, cybersecurity, and modern technologies.',
              },
              {
                icon: <Target size={28} />,
                title: 'Mission',
                text: 'Create an inclusive environment where students can learn, collaborate, and build impactful projects.',
              },
              {
                icon: <Eye size={28} />,
                title: 'Vision',
                text: 'Bridge the gap between classroom learning and real-world technological experience.',
              },
            ].map((card, index) => (
              <Reveal key={card.title} delay={200 + index * 100}>
                <Glasscard className={styles.aboutCard}>
                  <div className={styles.aboutCardIcon}>{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </Glasscard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Director Quote */}
      <section className="section">
        <div className="container">
          <Reveal Component="h2" className="section-title">
            Director&apos;s <span className="text-secondary-glow">Message</span>
          </Reveal>
          
          <Reveal Component={Glasscard} className={styles.directorCard} delay={150}>
            <div className={styles.quoteMark} aria-hidden="true">
              <Quote size={32} />
            </div>
            <blockquote>
              At SATI, we believe that innovation begins with curiosity, collaboration, and continuous learning. Coding Club SATI provides students with a platform to transform their technical knowledge into real-world solutions through practical exposure and teamwork.
            </blockquote>
            <p className={styles.directorExtended}>
              The club encourages students to go beyond traditional classroom education and actively participate in workshops, development activities, coding challenges, and innovation-focused events that help them prepare for future technological challenges.
            </p>
            <div className={styles.directorAttribution}>
              <div className={styles.directorAvatar} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 12h6" />
                </svg>
              </div>
              <div>
                <div className={styles.directorName}>Club Director</div>
                <div className={styles.directorRole}>Coding Club SATI</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className={`section ${styles.statsSection}`}>
        <div className="container">
          <Reveal Component="h2" className="section-title">
            Club Stats & <span className="text-primary-glow">Achievements</span>
          </Reveal>
          <p className="section-subtitle">
            Our growing community of tech enthusiasts and innovators continues to achieve milestones.
          </p>

          <div className={styles.statsGrid}>
            {displayStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <Glasscard className={styles.statCard}>
                  <div className={styles.statIcon}>{stat.icon}</div>
                  <div className={`${styles.statNumber} text-primary-glow`}>
                    <AnimatedCounter value={stat.value} />{stat.suffix}
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </Glasscard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <Glasscard className={styles.statsDesc}>
              <p>
                The club has successfully organized multiple workshops and technical events including HTML5 & CSS3 workshops, Android Development sessions, and introductory computer science events that helped students gain practical exposure to modern technologies. We continue to empower students through innovation-focused learning experiences, technical collaboration, and industry-oriented skill development.
              </p>
            </Glasscard>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
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