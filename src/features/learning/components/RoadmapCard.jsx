import Glasscard from '@/components/shared/Glasscard';
import styles from './RoadmapCard.module.css';

// tone: 'primary' | 'accent' | 'secondary'
export default function RoadmapCard({ roadmap }) {
  return (
    <Glasscard className={styles.card}>
      <h3 className={`${styles.title} ${styles[roadmap.tone]}`}>{roadmap.title}</h3>

      <div className={styles.timeline}>
        {roadmap.steps.map((step, i) => (
          <div key={step} className={styles.step}>
            <span className={`${styles.dot} ${styles[roadmap.tone]}`} aria-hidden="true" />
            <div>
              <div className={styles.phase}>Phase {String(i + 1).padStart(2, '0')}</div>
              <div className={styles.text}>{step}</div>
            </div>
          </div>
        ))}
      </div>
    </Glasscard>
  );
}
