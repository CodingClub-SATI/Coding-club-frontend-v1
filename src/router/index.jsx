import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Layout & Components (Eager loaded)
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/features/home';
import Events from '@/features/events';
import Gallery from '@/features/gallery';
import Contact from '@/features/contact';
import Teams from '@/features/teams';
import Learning from '@/features/learning';
import Projects from '@/features/projects';

// Admin Layout & Components (Lazy loaded)
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AdminLogin = lazy(() => import('@/features/auth/admin'));
const AdminDashboard = lazy(() => import('@/features/dashboard/admin'));
const AdminEvents = lazy(() => import('@/features/events/Admin'));
const AdminGallery = lazy(() => import('@/features/gallery/admin'));
const AdminProjects = lazy(() => import('@/features/projects/admin'));
const AdminSettings = lazy(() => import('@/features/setting/admin'));
const AdminTeams = lazy(() => import('@/features/teams/admin'));
const AdminInbox = lazy(() => import('@/features/contact/admin'));

const AppRouter = () => {
  return (
    <BrowserRouter>
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

        {/* Login Route */}
        <Route path="/admin/login" element={
            <Suspense fallback={<div>Loading Login Page...</div>}>
              <AdminLogin />
            </Suspense>
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin" element={
            <Suspense fallback={<div>Loading Admin Environment...</div>}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="inbox" element={<AdminInbox />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;