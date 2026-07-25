import { clubInfo } from '@/data/clubInfo';
import styles from './SocialSidebar.module.css';
import { 
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon 
} from '@/components/public/BrandIcons';

export default function SocialSidebar() {
  const links = [
    { href: clubInfo.socials.github, label: 'GitHub', icon: <GithubIcon size={16} /> },
    { href: clubInfo.socials.instagram, label: 'Instagram', icon: <InstagramIcon size={16} /> },
    { href: clubInfo.socials.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={16} /> },
    { href: clubInfo.socials.x, label: 'X', icon: <XIcon size={16} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {links.map(l => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          title={l.label}
          aria-label={l.label}
          className={styles.link}
        >
          {l.icon}
        </a>
      ))}
    </aside>
  );
}
