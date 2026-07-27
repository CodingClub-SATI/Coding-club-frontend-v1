import http from 'http';
import { 
  homeData, 
  eventsData, 
  galleryData, 
  projectsData, 
  teamsData, 
  publicStatsData, 
  adminStatsData 
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

  // --- PUBLIC & DASHBOARD GET ENDPOINTS ---
  if (req.method === 'GET') {
    if (req.url.includes('/home')) return sendJSON(200, homeData);
    if (req.url.includes('/events')) return sendJSON(200, eventsData);
    if (req.url.includes('/gallery')) return sendJSON(200, galleryData);
    if (req.url.includes('/projects')) return sendJSON(200, projectsData);
    if (req.url.includes('/team')) return sendJSON(200, teamsData);
    
    // Distinguish between Admin Stats and Public Stats
    // Checks for /api/admin/stats or /api/dashboard/stats
    if (req.url.includes('/admin/stats') || req.url.includes('/dashboard/stats')) {
      return sendJSON(200, adminStatsData);
    } 
    // Catches the generic /api/stats for the public home page
    else if (req.url.includes('/stats')) {
      return sendJSON(200, publicStatsData);
    }

    if (req.url.includes('/contacts')) return sendJSON(200, []); 
    
    // AUTH VERIFY ENDPOINT
    if (req.url.includes('/verify') || req.url.includes('/me')) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.includes('mock-jwt-admin-token-777')) {
        return sendJSON(200, { user: { id: 1, username: 'admin', role: 'admin' } });
      } else {
        return sendJSON(401, { message: 'Unauthorized' });
      }
    }
  }
  
  // --- POST ENDPOINTS ---
  if (req.method === 'POST') {
    
    if (req.url.includes('/contact')) {
      getBody().then(body => {
        console.log('Received new contact message:', body);
        sendJSON(200, { message: 'Message sent successfully!' });
      });
      return;
    }
    
    if (req.url.includes('/login')) {
      getBody().then(body => {
        if (body.username === 'admin' && body.password === 'password123') {
          sendJSON(200, {
            token: 'mock-jwt-admin-token-777',
            user: { id: 1, username: 'admin', role: 'admin' }
          });
        } else {
          sendJSON(401, { message: 'Invalid username or password' });
        }
      });
      return;
    } 
    
    if (req.url.includes('/logout')) {
      return sendJSON(200, { message: 'Logged out successfully' });
    } 
  }

  // 404 FALLBACK
  console.log(`⚠️ Unhandled request: ${req.method} ${req.url}`);
  sendJSON(404, { message: 'Endpoint not found in mock server' });
});

server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Mock API Server running at http://${HOST}:${PORT}`);
  console.log(`Listening for requests... (Press Ctrl+C to stop)\n`);
});