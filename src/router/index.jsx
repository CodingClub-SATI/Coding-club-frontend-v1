import { createBrowserRouter } from 'react-router-dom';

// Public Layout & Components
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home';
import Events from '@/features/events';
import Gallery from '@/features/gallery';
import Contact from '@/features/contact';
import Teams from '@/features/teams';
import Learning from '@/features/learning';
import Projects from '@/features/projects';

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
  },
  {
    path: '/admin',
    lazy: lazyLoad(() => import('@/layouts/AdminLayout')),
    errorElement: <div>Error - Something went wrong</div>,
    children: [
      { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin')) },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin')) },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin')) },
      { path: 'team', lazy: lazyLoad(() => import('@/features/teams/admin')) },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin')) },
      { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin')) },
      { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin')) },
    ],
  },
]);

export default router;