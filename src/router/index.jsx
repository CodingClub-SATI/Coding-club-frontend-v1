import { createBrowserRouter } from 'react-router-dom';

// Public Layout & Components
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home/public/Home';
// import ErrorScreen from '@/components/error/ErrorScreen';
// import NotFound from '@/components/error/NotFound'

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
    errorElement: <div>System Crash - Return to Base</div>,
    hydrateFallbackElement: <div>Loading...</div>,
    children: [
      { index: true, element: <Home /> },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/public/Events')) },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/public/Gallery')) },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/public/Teams')) },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/public/Projects')) },
      { path: 'learning', lazy: lazyLoad(() => import('@/features/learning/public/Learning')) },
      { path: 'contact', lazy: lazyLoad(() => import('@/features/contact/public/Contact')) },
      { path: '*', element: <div>404 - Not Found</div>},
    ],
  },
  {
    path:'/admin/login', lazy: lazyLoad(() => import('@/features/auth/admin/Login')),
    hydrateFallbackElement: <div>Loading Login...</div>
  },
  {
    path: '/admin',
    lazy: lazyLoad(() => import('@/layouts/AdminLayout')),
    errorElement: <div>Admin System Offline</div>,
    hydrateFallbackElement: <div>Loading Admin Dashboard...</div>,
    children: [
      { index: true, lazy: lazyLoad(() => import('@/features/dashboard/admin/Dashboard')) },
      { path: 'events', lazy: lazyLoad(() => import('@/features/events/admin/Events')) },
      { path: 'gallery', lazy: lazyLoad(() => import('@/features/gallery/admin/Gallery')) },
      { path: 'teams', lazy: lazyLoad(() => import('@/features/teams/admin/Teams')) },
      { path: 'projects', lazy: lazyLoad(() => import('@/features/projects/admin/Projects')) },
      { path: 'inbox', lazy: lazyLoad(() => import('@/features/contact/admin/Inbox')) },
      { path: 'settings', lazy: lazyLoad(() => import('@/features/setting/admin/Settings')) },
      { path: '*', element: <div>404 - Page Not Found</div>}
    ],
  },
]);

export default router;