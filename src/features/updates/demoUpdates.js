/**
 * TEMPORARY DEMO DATA FOR ANNOUNCEMENT PREVIEW
 * 
 * To disable demo fallback and rely exclusively on live backend API data,
 * set ENABLE_DEMO_FALLBACK = false in src/features/updates/public/Updates.jsx.
 */

export const DEMO_UPDATES = [
  {
    id: 'demo-1',
    message: 'Hackathon problem statements and lab allocations are now live in Computer Lab 3.',
    link: '/events',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'demo-2',
    message: 'Registrations for the hands-on Web Development workshop close tonight at 11:59 PM.',
    link: '/events',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'demo-3',
    message: 'Weekly competitive programming contest begins this Saturday at 5:00 PM.',
    link: '/events',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'demo-4',
    message: 'Club orientation and member recruitment results have been announced. Check your email for details.',
    link: '/teams',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];
