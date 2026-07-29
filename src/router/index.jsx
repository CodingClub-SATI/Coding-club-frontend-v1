import { createBrowserRouter, Outlet } from 'react-router';

import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home/public/Home';
import { homeLoader } from '@/features/home/api'; 
import { eventsLoader, eventsAdminLoader } from '@/features/events/api';
import { galleryLoader, galleryAdminLoader } from '@/features/gallery/api';
import { teamAdminLoader, teamPublicLoader } from '@/features/teams/api';
import { projectsLoader, projectsAdminLoader } from '@/features/projects/api';
import { dashboardLoader } from '@/features/dashboard/api';
import { inboxLoader } from '@/features/contact/api';
import { updatesAdminLoader } from '@/features/updates/api';

import ErrorScreen from '@/components/error/ErrorScreen';
import NotFound from '@/components/error/NotFound';
import RouteLoader from '@/components/shared/RouteLoader';
import { lazyLoad } from '@/router/lazyLoad';
import { requireAuthLoader } from '@/features/auth/api';
import { siteInfoLoader } from '@/features/setting/api';


const router = createBrowserRouter([
  {
    path:'/',
    element: <PublicLayout />,
    loader: siteInfoLoader,
    shouldRevalidate: () => false,
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <RouteLoader />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/public/Events')), loader: eventsLoader },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/public/Gallery')), loader: galleryLoader },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/public/Teams')), loader: teamPublicLoader },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/public/Projects')), loader: projectsLoader },
      { path: 'learning', lazy: lazyLoad(() => import('@/features/learning/public/Learning')) },
      { path: 'contact', lazy: lazyLoad(() => import('@/features/contact/public/Contact')) },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path:'/admin/login', lazy: lazyLoad(() => import('@/features/auth/admin/Login')),
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <RouteLoader />,
  },
  {
    path: '/admin',
    element: <Outlet />,
    loader: requireAuthLoader,
    shouldRevalidate: ({ currentUrl }) =>
      currentUrl.pathname === '/admin/login' || !currentUrl.pathname.startsWith('/admin'),
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <RouteLoader message="Verifying session..."/>,
    children: [
      {
        lazy: lazyLoad(() => import('@/layouts/AdminLayout')),
        hydrateFallbackElement: <div>Loading Admin Dashboard...</div>,
        children: [
          { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin/Dashboard')), loader: dashboardLoader },
          { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin/Events')), loader: eventsAdminLoader },
          { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin/Gallery')), loader: galleryAdminLoader },
          { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/admin/Teams')), loader: teamAdminLoader },
          { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin/Projects')), loader: projectsAdminLoader },
          { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin/Inbox')), loader: inboxLoader },
          { path: 'updates', lazy: lazyLoad(() => import('@/features/updates/admin/Updates')), loader: updatesAdminLoader },
          { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin/Settings')), loader: siteInfoLoader },
          { path: '*', element: <NotFound /> }
        ],
      },
    ],
  },
]);

export default router;