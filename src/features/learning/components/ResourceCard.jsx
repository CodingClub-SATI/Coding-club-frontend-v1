import { ExternalLink } from 'lucide-react';
import Glasscard from '@/components/shared/Glasscard';
import Tag from '@/components/shared/Tag';
import styles from './ResourceCard.module.css';

export default function ResourceCard({ resource }) {
  return (
    <Glasscard
      Component="a"
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className={styles.card}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{resource.title}</h3>
        <Tag tone={resource.free ? 'primary' : 'secondary'}>
          {resource.free ? 'Free' : 'Premium'}
        </Tag>
      </div>

      <Tag tone="accent" className={styles.typeTag}>{resource.type}</Tag>

      <p className={styles.desc}>{resource.description}</p>

      <div className={styles.footer}>
        <span className={styles.link}>
          Access Resource <ExternalLink size={14} />
        </span>
      </div>
    </Glasscard>
  );
}
