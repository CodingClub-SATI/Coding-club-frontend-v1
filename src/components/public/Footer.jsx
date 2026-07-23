import { Link } from 'react-router';
import { clubInfo } from '@/data/clubInfo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="neon-divider" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img 
                src={'/logo.jpg'} 
                alt="Coding Club SATI Logo" 
                style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
              />
              <span className="footer-logo-text">Coding Club 
                <span className="neon-blue"> SATI</span>
              </span>
            </div>
            <p className="footer-tagline">{clubInfo.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {[['Home', '/'], ['About', '/#about'], ['Events', '/events'], ['Gallery', '/gallery'], ['Teams', '/teams'], ['Projects', '/projects']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              {[['Learning Hub', '/learning'], ['Contact Us', '/contact']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
              <li><a href={clubInfo.socials.github} target="_blank" rel="noreferrer">GitHub Repos</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">Discord Server</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <p><span className="neon-blue">✉</span> {clubInfo.email}</p>
              <p><span className="neon-blue">📞</span> {clubInfo.phone}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '8px' }}>
                SATI Vidisha, Madhya Pradesh, India
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Coding Club SATI. All rights reserved.</p>
          <p>Designed & Developed by <span className="neon-blue">Coding Club SATI</span></p>
        </div>
      </div>
    </footer>
  );
}
