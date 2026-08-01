import {
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon, DiscordIcon, WhatsappIcon,
} from '@/components/shared/Icons';

export const PLATFORMS = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'x', label: 'X', Icon: XIcon },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsappIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon },
];

export function getSocialLinks(contactInfo, surface, size = 16) {
  if (!contactInfo) return [];
  return PLATFORMS
    .filter(({ key }) => {
      const entry = contactInfo[key];
      if (!entry?.url) return false;
      return surface ? Boolean(entry[surface]) : true;
    })
    .map(({ key, label, Icon }) => ({ href: contactInfo[key].url, label, icon: <Icon size={size} /> }));
}
