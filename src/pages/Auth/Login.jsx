import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('wanderlust_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const userData = {
      name: name || email.split('@')[0],
      email,
      avatar: '👤',
      loggedInAt: Date.now(),
    };

    localStorage.setItem('wanderlust_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('user-updated'));
    setUser(userData);
    navigate('/saved');
  };

  const handleLogout = () => {
    localStorage.removeItem('wanderlust_user');
    window.dispatchEvent(new Event('user-updated'));
    setUser(null);
  };

  return (
    <main className="auth-page">
      <div className="container">
        <motion.div
          className="auth-card card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user ? (
            <div className="auth-logged-in">
              <div className="auth-logged-in__avatar">👤</div>
              <h2>Welcome back, {user.name}!</h2>
              <p className="auth-logged-in__email">{user.email}</p>
              <div className="auth-logged-in__actions">
                <Link to="/saved" className="btn btn--primary">
                  View My Saved Trips →
                </Link>
                <button type="button" className="btn btn--outline" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-form-wrap">
              <div className="auth-header">
                <span className="auth-icon">✈</span>
                <h1 className="auth-title">
                  {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </h1>
                <p className="auth-subtitle">
                  {isSignUp
                    ? 'Sign up to save travel itineraries and bookmark your favorite places.'
                    : 'Log in to access your saved trips and personalized itineraries.'}
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {isSignUp && (
                  <div className="auth-field">
                    <label htmlFor="auth-name">Full Name</label>
                    <input
                      id="auth-name"
                      type="text"
                      className="input"
                      placeholder="e.g. Prakash Paul"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="auth-email">Email Address</label>
                  <input
                    id="auth-email"
                    type="email"
                    className="input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="auth-password">Password</label>
                  <input
                    id="auth-password"
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn--primary auth-submit">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="auth-toggle">
                <span>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
