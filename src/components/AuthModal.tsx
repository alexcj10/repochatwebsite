import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

// Background using user-provided rr.jpeg image
function AuthBannerBackground() {
  return (
    <div className="auth-modal-banner-illustration" style={{ position: 'relative', overflow: 'hidden' }}>
      <img 
        src="/rr.jpeg" 
        alt="Auth Background" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          objectPosition: 'center' 
        }} 
      />
      {/* Bottom fade to blend cleanly into the modal body */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)'
        }}
      />
    </div>
  )
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn } = useAuth()

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      document.documentElement.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
      document.documentElement.classList.remove('modal-open')
    }
    return () => {
      document.body.classList.remove('modal-open')
      document.documentElement.classList.remove('modal-open')
    }
  }, [isOpen])

  const handleSignIn = async () => {
    await signIn()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="auth-modal-overlay" onClick={onClose}>
          <motion.div
            className="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="auth-modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="auth-modal-close" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>

            <AuthBannerBackground />

            <div className="auth-modal-logo">
              <Logo size={24} />
              <span>RepoChat</span>
            </div>

            <h2 className="auth-modal-title">Sign in to continue</h2>
            <p className="auth-modal-desc">
              Connect your GitHub account to upgrade to Pro and unlock all features.
            </p>

            <button className="auth-modal-github-btn" onClick={handleSignIn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>

            <p className="auth-modal-footer">
              We only read your public profile. No repo access required.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
