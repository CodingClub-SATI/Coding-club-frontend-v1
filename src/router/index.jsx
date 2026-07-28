import { createBrowserRouter, Outlet as ProtectedRoute } from 'react-router';

import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home/public/Home';
import { homeLoader } from '@/features/home/api'; 
import { eventsLoader, eventsAdminLoader } from '@/features/events/api';
import { galleryLoader } from '@/features/gallery/api';
import { teamLoader } from '@/features/teams/api';
import { projectsLoader } from '@/features/projects/api';

import ErrorScreen from '@/components/error/ErrorScreen';
import NotFound from '@/components/error/NotFound';
import { requireAuthLoader } from '@/features/auth/api';
import { dashboardLoader } from '@/features/dashboard/api';
import { inboxLoader } from '@/features/contact/api';
import { siteInfoLoader } from '@/features/setting/api';

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
    loader: siteInfoLoader,
    shouldRevalidate: () => false,
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <div>Loading...</div>,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/public/Events')), loader: eventsLoader },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/public/Gallery')), loader: galleryLoader },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/public/Teams')), loader: teamLoader },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/public/Projects')), loader: projectsLoader },
      { path: 'learning', lazy: lazyLoad(() => import('@/features/learning/public/Learning')) },
      { path: 'contact', lazy: lazyLoad(() => import('@/features/contact/public/Contact')) },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path:'/admin/login', lazy: lazyLoad(() => import('@/features/auth/admin/Login')),
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <div>Loading Login...</div>
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    loader: requireAuthLoader,
    shouldRevalidate: ({ currentUrl }) =>
      currentUrl.pathname === '/admin/login' || !currentUrl.pathname.startsWith('/admin'),
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <div>Verifying session...</div>,
    children: [
      {
        lazy: lazyLoad(() => import('@/layouts/AdminLayout')),
        hydrateFallbackElement: <div>Loading Admin Dashboard...</div>,
        children: [
          { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin/Dashboard')), loader: dashboardLoader },
          { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin/Events')), loader: eventsAdminLoader },
          { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin/Gallery')), loader: galleryLoader },
          { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/admin/Teams')), loader: teamLoader },
          { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin/Projects')), loader: projectsLoader },
          { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin/Inbox')), loader: inboxLoader },
          { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin/Settings')), loader: siteInfoLoader },
          { path: '*', element: <NotFound /> }
        ],
      },
    ],
  },
]);

export default router;