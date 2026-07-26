import { GithubIcon } from '@/components/shared/Icons';
import Glasscard from '@/components/shared/Glasscard';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import { CATEGORY_TONES } from '@/features/projects/constants';
import styles from './ProjectCard.module.css';

// rank: 1 | 2 | 3 | undefined 

export default function ProjectCard({ project, rank }) {
  const memberLabel = `${project.members} ${project.members === 1 ? 'member' : 'members'}`;

  return (
    <Glasscard className={styles.card}>
      {rank && (
        <span className={`${styles.rankBadge} ${styles[`rank${rank}`]}`}>
          #{rank}
        </span>
      )}

      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.team}>{project.team} · {memberLabel}</p>
        </div>
        <Tag tone={CATEGORY_TONES[project.category] || 'muted'}>{project.category}</Tag>
      </div>

      <p className={styles.desc}>{project.description}</p>

      {project.tech?.length > 0 && (
        <div className={styles.tech}>
          {project.tech.map((t) => (
            <Tag key={t} tone="muted" className={styles.techTag}>{t}</Tag>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span>⭐ {project.stars}</span>
          <span>🍴 {project.forks}</span>
        </div>
        <div className={styles.links}>
          <Button
            Component="a"
            href={project.github}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            aria-label={`View source of ${project.title} on GitHub`}
          >
            <GithubIcon size={14} /> Code
          </Button>
          {project.demo && (
            <Button
              Component="a"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              size="sm"
              aria-label={`Open live demo of ${project.title}`}
            >
              Live Demo
            </Button>
          )}
        </div>
      </div>
    </Glasscard>
  );
}
