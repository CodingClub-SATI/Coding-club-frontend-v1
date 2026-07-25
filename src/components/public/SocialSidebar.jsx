import { clubInfo } from '@/data/clubInfo';
import SocialLink from '@/components/shared/SocialLink';
import { 
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon 
} from '@/components/public/BrandIcons';
import styles from './SocialSidebar.module.css';

export default function SocialSidebar() {
  const links = [
    { href: clubInfo.socials.github, label: 'GitHub', icon: <GithubIcon size={16} /> },
    { href: clubInfo.socials.instagram, label: 'Instagram', icon: <InstagramIcon size={16} /> },
    { href: clubInfo.socials.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={16} /> },
    { href: clubInfo.socials.x, label: 'X', icon: <XIcon size={16} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {links.map((link) => (
        <SocialLink key={link.label} href={link.href} label={link.label}>
          {link.icon}
        </SocialLink>
      ))}
    </aside>
  );
}