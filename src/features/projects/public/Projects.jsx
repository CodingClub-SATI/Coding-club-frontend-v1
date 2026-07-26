import { useMemo } from 'react';
import { Link, useLoaderData, useSearchParams, useNavigation } from 'react-router';
import { AlertTriangle, FolderGit2 } from 'lucide-react';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import ProjectCard from '@/features/projects/components/ProjectCard';
import { CATEGORIES } from '@/features/projects/constants';
import styles from './Projects.module.css';

const CATEGORY_TABS = ['All', ...CATEGORIES];

export default function Projects() {
  const { projects, topThree, page, totalPages, error } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isFiltering = navigation.state === 'loading';

  const category = searchParams.get('category') || 'All';

  // Only the overall top 3 carry a podium badge, computed once so
  // ProjectCard doesn't need an O(n) lookup per render.
  const rankById = useMemo(() => {
    const map = new Map();
    topThree.forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }, [topThree]);

  const setCategory = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === 'All') next.delete('category');
      else next.set('category', value);
      next.delete('page'); // changing category starts back at page 1
      return next;
    }, { replace: true, preventScrollReset: true });
  };

  const setPage = (nextPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      return next;
    }, { replace: true, preventScrollReset: true });
  };

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

      {/* Leaderboard */}
      <section className="section no-divider">
        <div className="container">
          <h2 className="section-title">Leaderboard</h2>
          <p className="section-subtitle">Top projects by community stars</p>
          
          {error ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState icon={AlertTriangle} title="Leaderboard unavailable" subtitle={error} />
            </Glasscard>
          ) : topThree.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState icon={FolderGit2} title="No projects yet" subtitle="Submit your project to get on the leaderboard!" />
            </Glasscard>
          ) : (
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
          )}
        </div>
      </section>

      {/* All projects */}
      <section className="section" id="all-projects">
        <div className="container">
          <div className={styles.toolbar}>
            <h2 className={`section-title ${styles.toolbarTitle}`}>
              All <span className="text-secondary-glow">Projects</span>
            </h2>
            <div className={styles.categoryFilter} role="group" aria-label="Filter projects by category">
              {CATEGORY_TABS.map((c) => (
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

          {error ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState
                icon={AlertTriangle}
                title={error}
                subtitle="Try refreshing the page in a moment."
              />
            </Glasscard>
          ) : projects.length === 0 ? (
            <Glasscard className={styles.emptyState}>
              <EmptyState
                icon={FolderGit2}
                title={topThree.length === 0 ? 'No projects yet' : 'No projects found'}
                subtitle={topThree.length === 0 ? 'Check back soon for member projects.' : 'Try a different category.'}
              />
            </Glasscard>
          ) : (
            <>
              <div
                className={`grid-2 ${styles.projectsGrid}`}
                aria-busy={isFiltering}
                style={isFiltering ? { opacity: 0.5, transition: 'opacity 150ms ease' } : undefined}
              >
                {projects.map((project, i) => (
                  <Reveal key={project.id} delay={i * 60}>
                    <ProjectCard project={project} rank={rankById.get(project.id)} />
                  </Reveal>
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="section">
        <div className="container">
          <Glasscard className={styles.submitCta}>
            <h2>Built something cool? <span className="text-primary-glow">Submit your project</span></h2>
            <p>Share your project with the club community and get featured on the leaderboard.</p>
            <Button Component={Link} to="/contact">Submit Project</Button>
          </Glasscard>
        </div>
      </section>
    </div>
  );
}
