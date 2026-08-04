import {
  GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon, DiscordIcon, WhatsappIcon,
} from '@/components/shared/Icons';

export const PLATFORMS = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'x', label: 'X', Icon: XIcon },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsappIcon },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon },
];

// `youtube` is shaped differently from the platforms above — the backend
// stores it as a bare URL string with no `showOnSidebar`/`showOnFooter`
// flags, unlike the others' `{url, showOnSidebar, showOnFooter}` object. It's
// handled as a special case below rather than folded into PLATFORMS.

export function getSocialLinks(contactInfo, surface, size = 16) {
  if (!contactInfo) return [];
  const links = PLATFORMS
    .filter(({ key }) => {
      const entry = contactInfo[key];
      if (!entry?.url) return false;
      return surface ? Boolean(entry[surface]) : true;
    })
    .map(({ key, label, Icon }) => ({ href: contactInfo[key].url, label, icon: <Icon size={size} /> }));

  // No per-surface flags exist for youtube, so it can only appear in the
  // unfiltered "all socials" case (e.g. the Contact page's social list) —
  // never in a surface-filtered icon cluster like the sidebar or footer.
  if (!surface && contactInfo.youtube) {
    links.push({ href: contactInfo.youtube, label: 'YouTube', icon: <YoutubeIcon size={size} /> });
  }

  return links;
}
