import SocialLink from '@/components/shared/SocialLink';
import { SOCIAL_LINKS } from '@/data/socialLinks';
import styles from './SocialSidebar.module.css';

export default function SocialSidebar() {
  return (
    <aside className={styles.sidebar}>
      {SOCIAL_LINKS.map((link) => (
        <SocialLink key={link.label} href={link.href} label={link.label}>
          {link.icon}
        </SocialLink>
      ))}
    </aside>
  );
}