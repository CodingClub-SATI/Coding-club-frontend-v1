import {
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon, DiscordIcon, WhatsappIcon,
} from '@/components/shared/Icons';

export const DEFAULT_CLUB_SOCIALS = {
  github: { url: 'https://github.com/CodingClub-SATI', showOnSidebar: true, showOnFooter: true },
  linkedin: { url: 'https://www.linkedin.com/company/coding-club-sati/', showOnSidebar: true, showOnFooter: true },
  instagram: { url: 'https://www.instagram.com/sati_coding_club/', showOnSidebar: true, showOnFooter: true },
  discord: { url: 'https://discord.gg/codingclub-sati', showOnSidebar: true, showOnFooter: true },
  youtube: { url: 'https://www.youtube.com/@CodingClubSATI', showOnSidebar: false, showOnFooter: true },
};

export const PLATFORMS = [
  { key: 'github', label: 'GitHub', handle: 'CodingClub-SATI', desc: 'Open-source projects & code', Icon: GithubIcon },
  { key: 'linkedin', label: 'LinkedIn', handle: 'Coding Club SATI', desc: 'Professional network & career updates', Icon: LinkedinIcon },
  { key: 'instagram', label: 'Instagram', handle: '@sati_coding_club', desc: 'Campus life, events & reels', Icon: InstagramIcon },
  { key: 'discord', label: 'Discord', handle: 'Community Server', desc: 'Real-time student chat & help', Icon: DiscordIcon },
  { key: 'youtube', label: 'YouTube', handle: '@CodingClubSATI', desc: 'Workshop sessions & tech talks', Icon: YoutubeIcon },
  { key: 'whatsapp', label: 'WhatsApp', handle: 'Club Announcements', desc: 'Official updates channel', Icon: WhatsappIcon },
  { key: 'x', label: 'X (Twitter)', handle: '@CodingClubSATI', desc: 'Tech news & club announcements', Icon: XIcon },
];

export function getSocialLinks(contactInfo, surface, size = 16) {
  const effectiveInfo = contactInfo || {};

  const links = PLATFORMS.flatMap(({ key, label, handle, desc, Icon }) => {
    let url;
    let showOnSurface = true;

    if (key === 'youtube') {
      url = effectiveInfo.youtube || DEFAULT_CLUB_SOCIALS.youtube?.url || '';
      showOnSurface = surface === 'showOnFooter' ? true : !surface;
    } else {
      const entry = effectiveInfo[key];
      const fallback = DEFAULT_CLUB_SOCIALS[key];
      url = entry?.url || fallback?.url || '';
      if (surface) {
        showOnSurface = entry?.url ? Boolean(entry[surface]) : Boolean(fallback?.[surface]);
      }
    }

    if (!url) return [];
    if (surface && !showOnSurface) return [];

    return [{
      key,
      label,
      handle,
      desc,
      href: url,
      icon: <Icon size={size} />,
    }];
  });

  return links;
}

