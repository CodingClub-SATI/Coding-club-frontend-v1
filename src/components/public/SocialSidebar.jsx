import SocialLink from '@/components/shared/SocialLink';
import { getSocialLinks } from '@/data/socialLinks';
import styles from './SocialSidebar.module.css';

export default function SocialSidebar({ siteInfo }) {
  const socialLinks = getSocialLinks(siteInfo?.socials);
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
