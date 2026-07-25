import { createBrowserRouter } from 'react-router';

// Public Layout & Components
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home/public/Home';
import { homeLoader } from '@/features/home/api'; 
import { eventsLoader } from '@/features/events/api';

import ErrorScreen from '@/components/error/ErrorScreen';
import NotFound from '@/components/error/NotFound';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

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
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <div>Loading...</div>,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/public/Events')), loader: eventsLoader },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/public/Gallery')) },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/public/Teams')) },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/public/Projects')) },
      { path: 'learning', lazy: lazyLoad(() => import('@/features/learning/public/Learning')) },
      { path: 'contact', lazy: lazyLoad(() => import('@/features/contact/public/Contact')) },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path:'/admin/login', lazy: lazyLoad(() => import('@/features/auth/admin/Login')),
    hydrateFallbackElement: <div>Loading Login...</div>
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    errorElement: <ErrorScreen />,
    children: [
      {
        lazy: lazyLoad(() => import('@/layouts/AdminLayout')),
        hydrateFallbackElement: <div>Loading Admin Dashboard...</div>,
        children: [
          { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin/Dashboard')) },
          { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin/Events')) },
          { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin/Gallery')) },
          { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/admin/Teams')) },
          { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin/Projects')) },
          { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin/Inbox')) },
          { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin/Settings')) },
          { path: '*', element: <NotFound /> }
        ],
      },
    ],
  },
]);

export default router;