import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-icon">✈</span>
            <span className="footer__logo-text">Wanderlust</span>
          </Link>
          <p className="footer__tagline">
            An AI-powered travel application helping you explore destinations, check real-time weather, and plan unforgettable journeys.
          </p>
        </div>

        <div className="footer__links-group">
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destinations">All Destinations</Link></li>
              <li><Link to="/saved">My Trips</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Features</h4>
            <ul className="footer__list">
              <li><span>Real-time Weather</span></li>
              <li><span>Pexels Imagery</span></li>
              <li><span>Gemini AI Chatbot</span></li>
              <li><span>Itinerary Generator</span></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Tech Stack</h4>
            <ul className="footer__list">
              <li><span>React 18 + Vite</span></li>
              <li><span>OpenWeather API</span></li>
              <li><span>Google Gemini API</span></li>
              <li><span>Framer Motion</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Wanderlust.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
