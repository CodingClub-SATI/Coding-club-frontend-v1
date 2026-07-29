import http from 'http';
import {
  siteInfo, publicStats, adminStats, updates, events, 
  gallery, projects, teamsPublic, teamsAdmin, contacts
} from './data.js';

const PORT = 3000;
const HOST = '127.0.0.1';

const server = http.createServer((req, res) => {
  const origin = req.headers.origin || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Safely parse JSON or return an empty object for things like multipart Form-Data 
  const getBody = () => new Promise(resolve => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) }
      catch(e) { resolve({}) }
    });
  });

  const sendJSON = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Ensure robust route matching ignoring query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // --- GET ENDPOINTS ---
  if (req.method === 'GET') {
    if (path === '/api/site-info') return sendJSON(200, siteInfo);
    if (path === '/api/admin/stats' || path === '/api/dashboard/stats') return sendJSON(200, adminStats);
    if (path === '/api/stats') return sendJSON(200, publicStats);
    if (path === '/api/updates') return sendJSON(200, updates);
    if (path === '/api/events') return sendJSON(200, events);
    if (path === '/api/gallery') return sendJSON(200, gallery);
    if (path === '/api/projects') return sendJSON(200, projects);
    if (path === '/api/team/public') return sendJSON(200, teamsPublic);
    if (path === '/api/team/admin/batches') return sendJSON(200, teamsAdmin);
    if (path === '/api/contacts') return sendJSON(200, contacts);
    
    // Auth Validation (let the admin dashboard open)
    if (path === '/api/auth/verify') return sendJSON(200, { ok: true });
  }

  // --- POST ENDPOINTS ---
  if (req.method === 'POST') {
    // Auth & Actions
    if (path === '/api/auth/login') return getBody().then(() => sendJSON(200, { token: 'mock-token' }));
    if (path === '/api/auth/logout') return sendJSON(200, { message: 'Logged out' });
    if (path === '/api/auth/password/otp') return sendJSON(200, { message: 'OTP Sent' });
    
    // Mock image upload
    if (path === '/api/upload') {
        return sendJSON(200, { url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80' });
    }

    // Photo uploads expect the updated *album* returned to re-render properly
    if (path.match(/\/api\/gallery\/.*\/photos/)) {
      return sendJSON(200, gallery[0]); 
    }

    // Generic fallback to catch create actions in the admin panel
    return getBody().then(body => sendJSON(200, { id: `new_${Date.now()}`, ...body }));
  }

  // --- PUT / PATCH ENDPOINTS ---
  if (req.method === 'PUT' || req.method === 'PATCH') {
    // Supply back a merged copy of an actual object so the frontend state doesn't crash from missing fields
    return getBody().then(body => {
      if (path.includes('/events/')) return sendJSON(200, { ...events[0], ...body });
      if (path.includes('/gallery/')) return sendJSON(200, { ...gallery[0], ...body });
      if (path.includes('/projects/')) return sendJSON(200, { ...projects[0], ...body });
      if (path.includes('/team/admin/members/')) return sendJSON(200, { id: "m1", ...body });
      if (path.includes('/team/admin/batches/')) return sendJSON(200, { batch: "2026", ...body });
      if (path.includes('/contacts/')) return sendJSON(200, { ...contacts[0], ...body });
      return sendJSON(200, body);
    });
  }

  // --- DELETE ENDPOINTS ---
  if (req.method === 'DELETE') {
    return sendJSON(200, { ok: true });
  }

  // 404 FALLBACK
  console.log(`  Unhandled request: ${req.method} ${path}`);
  sendJSON(404, { message: 'Endpoint not found in mock server' });
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Mock API Server running at http://${HOST}:${PORT}`);
  console.log(`Listening for requests... (Press Ctrl+C to stop)\n`);
});