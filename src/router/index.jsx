import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Layout & Components (Eager loaded)
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home/public/Home';
import Events from '@/features/events/public/Events';
import Gallery from '@/features/gallery/public/Gallery';
import Contact from '@/features/contact/public/Contact';
import Teams from '@/features/team/public/Teams';
import Learning from '@/features/learning/public/Learning';
import Projects from '@/features/projects/public/Projects';

// Admin Layout & Components (Lazy loaded)
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AdminLogin = lazy(() => import('@/features/auth/admin/Login'));
const AdminDashboard = lazy(() => import('@/features/dashboard/admin/Dashboard'));
const AdminEvents = lazy(() => import('@/features/events/Admin/Events'));
const AdminGallery = lazy(() => import('@/features/gallery/admin/Gallery'));
const AdminProjects = lazy(() => import('@/features/projects/admin/Projects'));
const AdminSettings = lazy(() => import('@/features/setting/admin/Settings'));
const AdminTeams = lazy(() => import('@/features/team/admin/Teams'));
const AdminInbox = lazy(() => import('@/features/contact/admin/Inbox'));

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="teams" element={<Teams />} />
        <Route path="learning" element={<Learning />} />
        <Route path="projects" element={<Projects />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<div>Loading Admin Environment...</div>}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="login" element={<AdminLogin />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="teams" element={<AdminTeams />} />
        <Route path="inbox" element={<AdminInbox />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;