import SocialLink from '@/components/shared/SocialLink';
import { getSocialLinks } from '@/data/socialLinks';
import styles from './SocialSidebar.module.css';

export default function SocialSidebar({ contactInfo }) {
  const socialLinks = getSocialLinks(contactInfo, 'showOnSidebar');
  if (socialLinks.length === 0) return null;

  return (
    <aside className={styles.sidebar}>
      {socialLinks.map((link) => (
        <SocialLink key={link.label} href={link.href} label={link.label}>
          {link.icon}
        </SocialLink>
      ))}
    </aside>
  );
}
