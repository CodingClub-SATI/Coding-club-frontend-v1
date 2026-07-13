import { createBrowserRouter } from 'react-router-dom';

// Public Layout & Components
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home/public/Home';
import Events from '@/features/events/public/Events';
import Gallery from '@/features/gallery/public/Gallery';
import Contact from '@/features/contactpublic/Contact';
import Teams from '@/features/teamspublic/Teams';
import Learning from '@/features/learningpublic/Learning';
import Projects from '@/features/projectspublic/Projects';

// lazyLoad wrapper
const lazyLoad = (importFn) => {
  return async () => {
    const module = await importFn();
    return { Component: module.default };
  };
};

const router = createBrowserRouter([
  {
    path:'/',
    element: <PublicLayout />,
    errorElement: <div>404 - Page Not Found</div>,
    children: [
      { index: true, element: <Home /> },
      { path: 'events', element: <Events /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'teams', element: <Teams /> },
      { path: 'projects', element: <Projects /> },
      { path: 'learning', element: <Learning /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  {
    path:'/admin/login',
    lazy: lazyLoad(() => import('@/features/auth/admin')),
    hydrateFallbackElement: <div>Loading Login...</div>
  },
  {
    path: '/admin',
    lazy: lazyLoad(() => import('@/layouts/AdminLayout')),
    errorElement: <div>Error - Something went wrong</div>,
    hydrateFallbackElement: <div>Loading Admin Dashboard...</div>,
    children: [
      { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin/Dashboard')) },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin/Events')) },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin/Gallery')) },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/admin/Teams')) },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin/Projects')) },
      { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin/Inbox')) },
      { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin/Settings')) },
    ],
  },
]);

export default router;