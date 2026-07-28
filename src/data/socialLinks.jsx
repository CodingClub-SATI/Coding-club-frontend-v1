import {
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon, DiscordIcon, YoutubeIcon,
} from '@/components/shared/Icons';

const PLATFORMS = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'x', label: 'X', Icon: XIcon },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
];

// Builds the icon-link list shown in the Footer/SocialSidebar/Contact page
// from the site's social URLs, skipping any platform that hasn't been
// filled in yet (used to be a static array — now derived from admin-edited
// data, so an empty field just means that icon doesn't render).
export function getSocialLinks(socials, size = 16) {
  if (!socials) return [];
  return PLATFORMS
    .filter((p) => Boolean(socials[p.key]))
    .map(({ key, label, Icon }) => ({ href: socials[key], label, icon: <Icon size={size} /> }));
}
