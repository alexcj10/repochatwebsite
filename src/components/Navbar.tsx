import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { user, profile, signOut, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.classList.add('nav-open-lock');
    } else {
      document.documentElement.classList.remove('nav-open-lock');
    }
    return () => { document.documentElement.classList.remove('nav-open-lock'); };
  }, [mobileOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url

  return (
    <>
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}>
      <div className="nav-inner">
        <Link 
          to="/" 
          className="nav-logo" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            setMobileOpen(false)
          }}
        >
          <Logo size={28} />
          <span>RepoChat</span>
        </Link>

        {/* Desktop Links — centered */}
        <ul className="nav-links desktop-only">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/security">Security</Link></li>
        </ul>

        {/* Desktop Avatar — right aligned */}
        <div className="nav-end desktop-only">
          {!loading && user && avatarUrl ? (
            <div className="nav-user-area" ref={dropdownRef}>
              <button
                className="nav-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                <img
                  src={avatarUrl}
                  alt={profile?.username || 'User'}
                  className="nav-avatar"
                />
                {profile?.is_pro && (
                  <span className="nav-avatar-pro-dot" />
                )}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="nav-dropdown"
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="nav-dropdown-header">
                      <img src={avatarUrl} alt="" className="nav-dropdown-avatar" />
                      <div className="nav-dropdown-name-row">
                        <p className="nav-dropdown-name">{profile?.username || 'User'}</p>
                        {profile?.is_pro && (
                          <span className="nav-dropdown-pro-badge">
                            <Sparkles size={10} /> Pro
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <button
                      className="nav-dropdown-item"
                      onClick={async () => {
                        setDropdownOpen(false)
                        await signOut()
                      }}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : !loading ? (
            <button
              className="nav-signin-btn"
              onClick={() => setAuthModalOpen(true)}
            >
              Sign in
            </button>
          ) : (
            <div style={{ width: 32 }} />
          )}
        </div>

        {/* Mobile: hamburger only */}
        <div className="nav-right-mobile">
          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={mobileOpen ? "open" : "closed"}
            >
              <motion.line
                x1="4" y1="9" x2="20" y2="9"
                variants={{
                  closed: { x1: 4, y1: 9, x2: 20, y2: 9 },
                  open: { x1: 5, y1: 5, x2: 19, y2: 19 }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.line
                x1="4" y1="15" x2="20" y2="15"
                variants={{
                  closed: { x1: 4, y1: 15, x2: 20, y2: 15 },
                  open: { x1: 5, y1: 19, x2: 19, y2: 5 }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.svg>
          </button>
        </div>
      </div>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ padding: '24px' }}>
              <ul className="mobile-nav-links">
              <li><Link to="/features" onClick={() => setMobileOpen(false)}>Features</Link></li>
              <li><Link to="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link></li>
              <li><Link to="/security" onClick={() => setMobileOpen(false)}>Security</Link></li>
            </ul>

            {!loading && user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  {avatarUrl && <img src={avatarUrl} alt="" className="mobile-user-avatar" />}
                  <div className="nav-dropdown-name-row">
                    <p className="mobile-user-name">{profile?.username || 'User'}</p>
                    {profile?.is_pro && (
                      <span className="nav-dropdown-pro-badge"><Sparkles size={10} /> Pro</span>
                    )}
                  </div>
                </div>
                <button
                  className="mobile-signout-btn"
                  onClick={async () => {
                    setMobileOpen(false)
                    await signOut()
                  }}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            ) : !loading ? (
              <div className="mobile-signin-section">
                <button
                  className="mobile-signin-btn"
                  onClick={() => {
                    setMobileOpen(false)
                    setAuthModalOpen(true)
                  }}
                >
                  Sign in with GitHub
                </button>
              </div>
            ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
