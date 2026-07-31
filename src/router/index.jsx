import { createBrowserRouter, Outlet } from 'react-router';

import PublicLayout from '@/layouts/PublicLayout';

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
      { index: true, lazy: lazyLoad(() => import('@/features/home/public/route')) },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/public/route')) },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/public/route')) },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/public/route')) },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/public/route')) },
      { path: 'learning', lazy: lazyLoad(() => import('@/features/learning/public/route')) },
      { path: 'contact', lazy: lazyLoad(() => import('@/features/contact/public/route')) },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin/login',
    lazy: lazyLoad(() => import('@/features/auth/admin/route')),
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
          { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin/route')) },
          { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin/route')) },
          { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin/route')) },
          { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/admin/route')) },
          { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin/route')) },
          { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin/route')) },
          { path: 'updates', lazy: lazyLoad(() => import('@/features/updates/admin/route')) },
          { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin/route')) },
          { path: '*', element: <NotFound /> }
        ],
      },
    ],
  },
]);

export default router;