import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from '@/components/shared/Icons';

// ---------------------------------------------------------------------------
// Display-only constants. Nothing here decides WHO counts as leadership —
// that determination (parsing clubPosition, sorting, filtering archived
// batches, etc.) is a backend responsibility. The API is expected to return
// data already grouped/sorted; these constants only label what we render.
// See API_CONTRACT.md for the exact shape the backend must return.
// ---------------------------------------------------------------------------

export const DEFAULT_CLUB_POSITION = 'Member';

// Suggestions shown in the admin "Position" datalist. Free text is still
// allowed — these are just common presets to speed up data entry.
export const POSITION_SUGGESTIONS = [
  'Member',
  'Convenor',
  'Co-Convenor',
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
];

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
