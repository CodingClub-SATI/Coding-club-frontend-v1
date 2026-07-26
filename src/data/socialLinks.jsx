import { clubInfo } from '@/data/clubInfo';
import {
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon
} from '@/components/public/BrandIcons';

export const SOCIAL_LINKS = [
  { href: clubInfo.socials.github, label: 'GitHub', icon: <GithubIcon size={16} /> },
  { href: clubInfo.socials.instagram, label: 'Instagram', icon: <InstagramIcon size={16} /> },
  { href: clubInfo.socials.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={16} /> },
  { href: clubInfo.socials.x, label: 'X', icon: <XIcon size={16} /> },
];
