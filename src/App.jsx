import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy} from 'react';
import './App.css';

import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/public/Home';
import Events from '@/pages/public/Events';
import Gallery from '@/pages/public/Gallery';
import Teams from '@/pages/public/Teams';
import Projects from '@/pages/public/Projects';
import Learning from '@/pages/public/Learning';
import Contact from '@/pages/public/Contact';

const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
// Lazy load admin panels here

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route element={
          <Suspense fallback={<div>Loading Admin Environment...</div>}>
            <AdminLayout />
          </Suspense>
        }>
          <Route path="/admin" element={<Dashboard />} />
          {/*Future admin routes go here*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
