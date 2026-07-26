import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, FolderGit2 } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import ProjectCard from '@/features/projects/components/ProjectCard';
import styles from './Projects.module.css';

export default function Projects() {
  const { projects, error } = useLoaderData();
  const [category, setCategory] = useState('All');

  const sorted = useMemo(
    () => [...projects].sort((a, b) => b.stars - a.stars),
    [projects]
  );

  const topThree = sorted.slice(0, 3);

  // Only the overall top 3 carry a podium badge, computed once so
  // ProjectCard doesn't need an O(n) lookup per render.
  const rankById = useMemo(() => {
    const map = new Map();
    topThree.forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }, [topThree]);

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const filtered = category === 'All' ? sorted : sorted.filter((p) => p.category === category);

  return (
    <div>
      {/* Intro */}
      <section className="section">
        <div className="container">
          <Reveal Component="h1" className="section-title">
            Student <span className="text-primary-glow">Projects</span>
          </Reveal>
          <p className="section-subtitle">
            Innovative solutions built by Coding Club SATI members.
          </p>
        </div>
      </section>

      {error && (
        <section className="section">
          <div className="container">
            <EmptyState icon={AlertTriangle} title={error} subtitle="Try refreshing the page in a moment." />
          </div>
        </section>
      )}

      {/* Leaderboard */}
      {!error && topThree.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">🏆 Leaderboard</h2>
            <p className="section-subtitle">Top projects by community stars</p>
            <div className={styles.leaderboard}>
              {topThree.map((project, i) => (
                <Glasscard
                  key={project.id}
                  className={`${styles.leaderboardItem} ${styles[`rank${i + 1}`]}`}
                >
                  <div className={styles.medal}>{['🥇', '🥈', '🥉'][i]}</div>
                  <div className={styles.info}>
                    <div className={styles.itemTitle}>{project.title}</div>
                    <div className={styles.itemTeam}>{project.team}</div>
                  </div>
                  <div className={styles.itemStats}>⭐ {project.stars}</div>
                </Glasscard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All projects */}
      {!error && (
        <section className="section" id="all-projects">
          <div className="container">
            <div className={styles.toolbar}>
              <h2 className={`section-title ${styles.toolbarTitle}`}>
                All <span className="text-secondary-glow">Projects</span>
              </h2>
              <div className={styles.categoryFilter} role="group" aria-label="Filter projects by category">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.categoryChip} ${category === c ? styles.active : ''}`}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <Glasscard className={styles.emptyState}>
                <EmptyState
                  icon={FolderGit2}
                  title={projects.length === 0 ? 'No projects yet' : 'No projects found'}
                  subtitle={projects.length === 0 ? 'Check back soon for member projects.' : 'Try a different category.'}
                />
              </Glasscard>
            ) : (
              <div className={`grid-2 ${styles.projectsGrid}`}>
                {filtered.map((project, i) => (
                  <Reveal key={project.id} delay={i * 60}>
                    <ProjectCard project={project} rank={rankById.get(project.id)} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Submit CTA */}
      <section className="section">
        <div className="container">
          <Glasscard className={styles.submitCta}>
            <h2>Built something cool? <span className="text-primary-glow">Submit your project</span></h2>
            <p>Share your project with the club community and get featured on the leaderboard.</p>
            <Button Component="a" href="/contact">Submit Project</Button>
          </Glasscard>
        </div>
      </section>
    </div>
  );
}
