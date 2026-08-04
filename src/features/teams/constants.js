import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from '@/components/shared/Icons';

// ---------------------------------------------------------------------------
// Display-only constants. `clubPosition` is not a real field on TeamMember —
// the backend only ever populates it on the synthetic `departmentLeads`
// entries returned by GET /api/team/public (see MODELS.md / API.md). Regular
// members and convenors/co-convenors never have it, so components that read
// `member.clubPosition` must treat it as optional.
// ---------------------------------------------------------------------------

// Order + labels for the leadership strip at the top of the public page.
// Keys must match the `leadership` object the API returns from
// GET /api/team/public.
export const LEADERSHIP_SECTIONS = [
  { key: 'convenors', label: 'Convenor' },
  { key: 'coConvenors', label: 'Co-Convenor' },
  { key: 'departmentLeads', label: 'Department Leads' },
];

// Shared social link config used by MemberProfileModal (public) and
// MemberDetailPanel (admin) so the two don't drift out of sync.
export const SOCIAL_FIELDS = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'x', label: 'X', Icon: XIcon },
];
