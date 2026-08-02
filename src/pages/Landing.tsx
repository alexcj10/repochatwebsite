import { useRef, useState, useEffect, useCallback } from 'react'
import { ArrowRight, Check, X, Sparkles, GitPullRequest, AlertCircle, Users, Code, Network, Cpu, Clock, DollarSign, BarChart3, Bot, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import FAQ from '../components/FAQ'


const comparisonRows = [
  { feature: 'Friends', free: '15', pro: 'Unlimited' },
  { feature: 'Groups', free: '5', pro: 'Unlimited' },
  { feature: 'Pad Entries', free: '10', pro: 'Unlimited' },
  { feature: 'Custom Lists', free: '3', pro: 'Unlimited' },
  { feature: 'Pinned Messages', free: '5', pro: 'Unlimited' },
  { feature: 'Starred Messages', free: '50', pro: 'Unlimited' },
  { feature: 'Pinned Chats', free: '3', pro: '15' },
  { feature: 'Archived Chats', free: '5', pro: 'Unlimited' },
  { feature: 'GitHub Context Sharing', free: true, pro: true },
  { feature: 'Smart Triage', free: true, pro: true },
  { feature: 'Message Reactions', free: true, pro: true },
  { feature: 'Online Presence', free: true, pro: true },
  { feature: 'Dev DNA & Power Stats', free: true, pro: true },
  { feature: 'Quick Share & Templates', free: true, pro: true },
  { feature: 'Chat Export', free: true, pro: true },
  { feature: 'Theming & Personalization', free: true, pro: true },
  { feature: 'Keyboard Shortcuts', free: true, pro: true },
  { feature: 'RepoBot AI (BYOK)', free: true, pro: true },
  { feature: 'Cloud Data Sync', free: false, pro: true },
  { feature: 'Priority Feature Access', free: false, pro: true },
  { feature: 'Premium Developer Support', free: false, pro: true },
  { feature: 'STA (Smart Task Assignments)', free: false, pro: true },
  { feature: 'RLC (Repo-Linked Channels)', free: false, pro: true },
  { feature: 'CTG (Conversation Threads)', free: false, pro: true },
]

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value
      ? <span className="pricing-cell-icon yes"><Check size={15} strokeWidth={3} /></span>
      : <span className="pricing-cell-icon no"><X size={15} strokeWidth={2.5} /></span>
  }
  return <span className="pricing-cell-text">{value}</span>
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = v.toFixed(decimals);
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value, decimals]);

  return <span ref={ref}>0</span>;
}

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const miniGridRef = useRef<HTMLDivElement>(null)
  const [activeMiniFeature, setActiveMiniFeature] = useState(0)

  const scrollMiniGrid = (dir: 'left' | 'right') => {
    if (miniGridRef.current) {
      const scrollAmount = 400;
      miniGridRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const coreFeatures = [
    {
      title: 'Repo-Linked Channels',
      desc: 'Link group chats directly to repositories for automated context syncing.',
      img: '/rlc.png',
      badge: 'RLC'
    },
    {
      title: 'Smart Task Assignments',
      desc: 'Assign reviewers and owners to GitHub issues and PRs directly in chat.',
      img: '/sta.png',
      badge: 'STA'
    },
    {
      title: 'Conversation Threads',
      desc: 'Organize discussions into focused threads to keep your workspace clean.',
      img: '/ctg.png',
      badge: 'CTG'
    },
    {
      title: 'GitHub Triage',
      desc: 'Manage labels, milestones, and issue status with one-click sidebar actions.',
      img: '/triage.png',
      badge: 'Triage'
    }
  ];

  // Fluid ecosystem graph scaling — continuously maps container width
  // to a zoom level so the horizontal layout never overflows or jumps.
  const updateEcoScale = useCallback(() => {
    const panel = panelRef.current;
    const wrapper = wrapperRef.current;
    if (!panel || !wrapper) return;

    // The natural (unscaled) width the wrapper needs at zoom 1 (includes breathing room)
    const BASE_WIDTH = 1100; // wrapper content (~1036px) + comfortable inner padding on both sides
    // Available width inside the panel (minus padding)
    const style = getComputedStyle(panel);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const available = panel.clientWidth - padL - padR;

    if (available >= BASE_WIDTH) {
      wrapper.style.zoom = '1';
    } else {
      const scale = Math.max(available / BASE_WIDTH, 0.25);
      wrapper.style.zoom = scale.toString();
    }
  }, []);

  useEffect(() => {
    updateEcoScale();
    window.addEventListener('resize', updateEcoScale);
    // Also observe the panel in case its own width changes (e.g. container queries)
    const ro = new ResizeObserver(updateEcoScale);
    if (panelRef.current) ro.observe(panelRef.current);
    return () => {
      window.removeEventListener('resize', updateEcoScale);
      ro.disconnect();
    };
  }, [updateEcoScale]);
  
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const mockupScale = useTransform(heroProgress, [0, 1], [1, .9])
  const mockupOpacity = useTransform(heroProgress, [0, .8, 1], [1, 1, 0])

  // 3D Mouse Tilt Effect for Hero Image
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / width - 0.5;
    const yPct = y / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    if (maxScrollLeft <= 0) return;
    const progress = scrollLeft / maxScrollLeft;
    const newIndex = Math.round(progress * 15); // 16 items total, index 0 to 15
    if (newIndex !== activeMiniFeature) {
      setActiveMiniFeature(newIndex);
    }
  };

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-inner">


          <ScrollReveal delay={1}>
            <h1 className="h1">
              Chat where the<br /><span className="gradient-text">code lives.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <p className="body-lg">
              Turn GitHub into a real-time workspace. Discuss PRs, assign tasks, and triage issues instantly without ever breaking your flow.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={3}>
            <div className="hero-actions">
              <a href="#install" className="btn btn-primary btn-lg">
                Add to Chrome — Free
              </a>
              <a href="https://discord.gg/repochat" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                Join Discord <ArrowRight size={14} />
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero mockup — fluid scaling & 3D mouse tilt animation */}
        <motion.div 
          className="hero-mockup" 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            scale: mockupScale, 
            opacity: mockupOpacity, 
            width: 'calc(100% - 48px)',
            rotateX,
            rotateY,
            transformPerspective: 1200,
            transformStyle: "preserve-3d"
          }}
        >
          <img src="/RC_main_UI.png" alt="RepoChat — Main UI" fetchPriority="high" decoding="async" />
        </motion.div>
      </section>

      {/* ═══ WHY REPOCHAT ═══ */}
      <section className="section why-section">
        <div className="container">

          {/* ── Centered Header ── */}
          <div className="why-header">
            <ScrollReveal>
              <div className="why-header-inner">
                <div className="ecosystem-badge">Why RepoChat</div>
                <h3 className="why-title">Your tools don't talk to each other.<br/><span className="gradient-text">You pay the price.</span></h3>
                <p className="body-lg">
                  Developers bounce between 9+ tools daily — GitHub, Slack, Jira, Email, Notion — losing focus with every switch. RepoChat unifies communication and code context in one sidebar, right where you work.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Visual Comparison: Node Graph Diagrams ── */}
          <div className="why-diagrams">
            {/* WITHOUT RepoChat — Chaotic Graph */}
            <ScrollReveal>
              <div className="why-diagram-card why-diagram-without">
                <div className="why-diagram-label">Without RepoChat</div>
                <div className="why-diagram-visual">
                  <svg viewBox="0 0 400 360" className="why-svg" aria-hidden="true">
                    <defs>
                      <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <radialGradient id="bgGlowRed" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(244,63,94,0.12)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>

                    {/* Background glow */}
                    <circle cx="200" cy="180" r="180" fill="url(#bgGlowRed)" />

                    {/* Complex rings */}
                    <g className="why-rings-chaos">
                      <circle cx="200" cy="180" r="140" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="1" strokeDasharray="4 8" />
                      <circle cx="200" cy="180" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <circle cx="200" cy="180" r="80" fill="none" stroke="rgba(244,63,94,0.06)" strokeWidth="1" strokeDasharray="2 4" />
                    </g>

                    {/* Center developer */}
                    <circle cx="200" cy="180" r="34" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.5)" strokeWidth="1.5" filter="url(#glowRed)" />
                    <text x="200" y="178" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">Dev</text>
                    <text x="200" y="192" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7">fragmented</text>

                    {/* Chaotic connection lines */}
                    <path d="M200,146 L200,69" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" />
                    <path d="M228,160 L290,105" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'0.5s'}} />
                    <path d="M234,180 L320,180" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'1s'}} />
                    <path d="M228,200 L290,255" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'0.3s'}} />
                    <path d="M200,214 L200,295" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'0.7s'}} />
                    <path d="M172,200 L110,255" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'1.2s'}} />
                    <path d="M166,180 L80,180" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'0.9s'}} />
                    <path d="M172,160 L110,105" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" className="why-line-chaos" style={{animationDelay:'0.4s'}} />

                    {/* Cross-connections */}
                    <path d="M110,105 Q200,120 290,105" fill="none" stroke="rgba(244,63,94,0.15)" strokeWidth="1" strokeDasharray="2 6" />
                    <path d="M80,180 Q150,250 290,255" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="1" strokeDasharray="2 6" />
                    <path d="M110,255 Q200,240 320,180" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="1" strokeDasharray="2 6" />

                    {/* Tool Nodes (44x44) with Logos */}
                    {/* GitHub - top */}
                    <g transform="translate(178,25)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    </g>
                    {/* Slack - top right */}
                    <g transform="translate(290,61)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
                    </g>
                    {/* Jira - right */}
                    <g transform="translate(320,158)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M11.53 12c0-2.61-2.12-4.73-4.73-4.73S2.07 9.39 2.07 12s2.12 4.73 4.73 4.73 4.73-2.12 4.73-4.73zm10.4 0c0-2.61-2.12-4.73-4.73-4.73s-4.73 2.12-4.73 4.73 2.12 4.73 4.73 4.73 4.73-2.12 4.73-4.73zm-5.2-10.4c0-2.61-2.12-4.73-4.73-4.73S7.27-1.01 7.27 1.6s2.12 4.73 4.73 4.73 4.73-2.12 4.73-4.73zM11.53 22.4c0-2.61-2.12-4.73-4.73-4.73S2.07 19.79 2.07 22.4s2.12 4.73 4.73 4.73 4.73-2.12 4.73-4.73z"/></svg>
                    </g>
                    {/* Email - bottom right */}
                    <g transform="translate(290,255)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </g>
                    {/* Notion - bottom */}
                    <g transform="translate(178,295)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M4.459 4.208c.746.066 1.026.133 1.026.505v13.64c0 .359-.227.426-.973.506v.465h5.45v-.465c-.773-.08-1.026-.147-1.026-.506V8.04l6.196 10.31h.746V4.713c0-.372.24-.44.986-.506v-.465h-5.05v.465c.746.08 1.025.146 1.025.506v10.016L6.524 4.208h-.572v-.465h-5.5v.465z"/></svg>
                    </g>
                    {/* Docs - bottom left */}
                    <g transform="translate(66,255)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                    </g>
                    {/* Teams - left */}
                    <g transform="translate(36,158)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 11c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm7-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-1.8 4.36A6.9 6.9 0 0 1 20 15v3h4v-3c0-2.22-4.14-3.56-6.8-3.64z"/></svg>
                    </g>
                    {/* Discord - top left */}
                    <g transform="translate(66,61)">
                      <rect width="44" height="44" rx="12" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="rgba(244,63,94,0.9)"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                    </g>
                  </svg>
                </div>
                <div className="why-diagram-caption">
                  <span className="why-caption-stat">8+ switches</span>
                  <span className="why-caption-text">fragmented attention · context lost</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Gradient Divider */}
            <div className="why-diagram-divider">
              <div className="why-divider-gradient" />
            </div>

            {/* WITH RepoChat — Clean Graph */}
            <ScrollReveal delay={1}>
              <div className="why-diagram-card why-diagram-with">
                <div className="why-diagram-label why-diagram-label-green">With RepoChat</div>
                <div className="why-diagram-visual">
                  <svg viewBox="0 0 400 360" className="why-svg" aria-hidden="true">
                    <defs>
                      <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <radialGradient id="bgGlowGreen" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(163,230,53,0.08)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>

                    {/* Background glow */}
                    <circle cx="200" cy="180" r="180" fill="url(#bgGlowGreen)" />

                    {/* Complex rings */}
                    <g className="why-rings-clean">
                      <circle cx="200" cy="180" r="140" fill="none" stroke="rgba(163,230,53,0.15)" strokeWidth="1" />
                      <circle cx="200" cy="180" r="110" fill="none" stroke="rgba(163,230,53,0.08)" strokeWidth="1" />
                      <circle cx="200" cy="180" r="75" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" strokeDasharray="6 6" />
                    </g>

                    {/* Center — RepoChat hub */}
                    <circle cx="200" cy="180" r="40" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.6)" strokeWidth="2" filter="url(#glowPurple)" />
                    <circle cx="200" cy="180" r="46" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" className="why-core-pulse" />
                    {/* RepoChat Logo */}
                    <svg x="184" y="164" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="m10 8-2 2 2 2" />
                      <path d="m14 8 2 2-2 2" />
                    </svg>

                    {/* Clean connection lines */}
                    <path d="M200,140 L200,69" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="6 4" className="why-line-clean" />
                    <path d="M228,152 L280,105" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="6 4" className="why-line-clean" style={{animationDelay:'0.3s'}} />
                    <path d="M240,180 L310,180" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="6 4" className="why-line-clean" style={{animationDelay:'0.6s'}} />
                    <path d="M200,220 L200,295" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="6 4" className="why-line-clean" style={{animationDelay:'0.9s'}} />
                    <path d="M160,180 L80,180" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="6 4" className="why-line-clean" style={{animationDelay:'1.2s'}} />
                    <path d="M172,152 L120,105" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" strokeDasharray="6 4" className="why-line-clean" style={{animationDelay:'0.2s'}} />

                    {/* Tool nodes */}
                    {/* GitHub - top */}
                    <g transform="translate(178,25)">
                      <rect width="44" height="44" rx="12" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" filter="url(#glowGreen)" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="#a3e635"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    </g>
                    {/* PRs (GitPullRequest) - top right */}
                    <g transform="translate(280,61)">
                      <rect width="44" height="44" rx="12" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" filter="url(#glowGreen)" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>
                    </g>
                    {/* Issues (AlertCircle) - right */}
                    <g transform="translate(310,158)">
                      <rect width="44" height="44" rx="12" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" filter="url(#glowGreen)" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </g>
                    {/* Deep Work (Zap) - bottom */}
                    <g transform="translate(178,295)">
                      <rect width="44" height="44" rx="12" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" filter="url(#glowPurple)" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </g>
                    {/* Teams - left */}
                    <g transform="translate(36,158)">
                      <rect width="44" height="44" rx="12" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" filter="url(#glowGreen)" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="#a3e635"><path d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 11c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm7-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-1.8 4.36A6.9 6.9 0 0 1 20 15v3h4v-3c0-2.22-4.14-3.56-6.8-3.64z"/></svg>
                    </g>
                    {/* Chat - top left */}
                    <g transform="translate(76,61)">
                      <rect width="44" height="44" rx="12" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.4)" strokeWidth="1.5" filter="url(#glowGreen)" />
                      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </g>
                  </svg>
                </div>
                <div className="why-diagram-caption">
                  <span className="why-caption-stat why-caption-stat-green">2 switches</span>
                  <span className="why-caption-text">focused flow · context preserved</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Problem Cards Grid ── */}
          <div className="why-cards">
            <ScrollReveal>
              <div className="why-card">
                <div className="why-card-icon"><Clock size={24} /></div>
                <p className="why-card-text">Developers take <strong>23 minutes</strong> to refocus after a single context switch.</p>
                <span className="why-card-source">UC Irvine — Gloria Mark, PhD</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <div className="why-card">
                <div className="why-card-icon"><BarChart3 size={24} /></div>
                <p className="why-card-text"><strong>40%</strong> of developer productivity is lost daily to app context switching.</p>
                <span className="why-card-source">APA Research</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <div className="why-card">
                <div className="why-card-icon"><DollarSign size={24} /></div>
                <p className="why-card-text"><strong>$10,400</strong> lost per developer per year to fragmented context switching.</p>
                <span className="why-card-source">Asana</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={3}>
              <div className="why-card">
                <div className="why-card-icon"><AlertCircle size={24} /></div>
                <p className="why-card-text"><strong>62%</strong> of developers say context switching is their biggest bottleneck.</p>
                <span className="why-card-source">Stack Overflow Survey</span>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Big Stats ── */}
          <ScrollReveal>
            <div className="why-big-stats">
              <div className="why-big-stat">
                <span className="why-big-num"><AnimatedNumber value={9.4} decimals={1} /></span>
                <span className="why-big-desc">tools used daily on average by developers</span>
                <span className="why-big-src">Atlassian</span>
              </div>
              <div className="why-big-divider" />
              <div className="why-big-stat">
                <span className="why-big-num"><AnimatedNumber value={23} /><span className="why-big-unit">min</span></span>
                <span className="why-big-desc">average time to refocus after every context switch</span>
                <span className="why-big-src">UC Irvine</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ═══ ECOSYSTEM GRAPH ═══ */}
      <section className="section ecosystem-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-head ecosystem-head">
              <div className="ecosystem-badge">The Ecosystem</div>
              <h2 className="h2 ecosystem-h2">
                The Repo is the <span className="gradient-text">Workspace</span>
              </h2>
              <p className="body-lg ecosystem-p">
                Code, context, and conversation — unified in one living graph.
              </p>
            </div>
          </ScrollReveal>

          <div className="ecosystem-panel-container" ref={panelRef}>
            <div className="ecosystem-wrapper" ref={wrapperRef}>
              
              {/* Left Context Box */}
              <ScrollReveal>
                <div className="ecosystem-side-box left-box">
                  <div className="box-title">Github Context</div>
                  <div className="box-items">
                    <div className="box-item">Pull Requests</div>
                    <div className="box-item">Issue Tracking</div>
                    <div className="box-item">Smart Triage</div>
                    <div className="box-item">Inline Comments</div>
                    <div className="box-item">Code Context</div>
                    <div className="box-item">Thread Discussions</div>
                  </div>
                  <div className="box-connector-left">
                    <div className="connector-dot-orange">!</div>
                    <div className="connector-line-orange"></div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Central Graph */}
              <ScrollReveal delay={0.2}>
                <div className="ecosystem-graph">
                  {/* Concentric Rings */}
                  <div className="ring ring-3"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-1">
                    <div className="ring-glow"></div>
                  </div>

                  {/* Nodes - Inner */}
                  <div className="eco-node inner-node node-pos-1">
                    <div className="eco-icon"><GitPullRequest size={20} /></div>
                    <div className="eco-label">Pr Context</div>
                  </div>
                  <div className="eco-node inner-node node-pos-2">
                    <div className="eco-icon"><AlertCircle size={20} /></div>
                    <div className="eco-label">Smart Triage</div>
                  </div>
                  <div className="eco-node inner-node node-pos-3">
                    <div className="eco-icon"><Users size={20} /></div>
                    <div className="eco-label">Team Groups</div>
                  </div>

                  {/* Nodes - Outer */}
                  <div className="eco-node outer-node node-pos-4">
                    <div className="eco-icon"><Cpu size={20} /></div>
                    <div className="eco-label">Dev Dna</div>
                  </div>
                  <div className="eco-node outer-node node-pos-5">
                    <div className="eco-icon"><Code size={20} /></div>
                    <div className="eco-label">Repo Channels</div>
                  </div>
                  <div className="eco-node outer-node node-pos-6">
                    <div className="eco-icon"><Network size={20} /></div>
                    <div className="eco-label">Task Linking</div>
                  </div>

                  {/* Center Core */}
                  <div className="eco-core">
                    <div className="eco-core-inner">
                      Real Time<br/>Repo Graph
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Context Box */}
              <ScrollReveal delay={0.4}>
                <div className="ecosystem-side-box right-box">
                  <div className="box-title blue">Integrations</div>
                  <div className="box-items blue-items">
                    <div className="box-item">Chrome Extension</div>
                    <div className="box-item">Web App</div>
                    <div className="box-item">Github Api</div>
                    <div className="box-item">Real-Time Sync</div>
                  </div>
                  <div className="box-connector-right">
                    <div className="connector-line-blue"></div>
                    <div className="connector-dot-blue"></div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>

          {/* ── Ecosystem Pillar Cards ── */}
          <div className="eco-pillars">
            <ScrollReveal>
              <div className="eco-pillar-card">
                <div className="eco-pillar-header">
                  <div className="eco-pillar-icon">
                    <Bot size={24} />
                  </div>
                  <h4 className="h4">RepoBot AI Assistant</h4>
                </div>
                <div className="eco-pillar-text">
                  <p className="body-sm">Get instant repository summaries, architecture deep dives, or explain complex code using your own API keys.</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <div className="eco-pillar-card">
                <div className="eco-pillar-header">
                  <div className="eco-pillar-icon eco-pillar-icon-green">
                    <Users size={24} />
                  </div>
                  <h4 className="h4">Real-Time Team Chat</h4>
                </div>
                <div className="eco-pillar-text">
                  <p className="body-sm">Direct messages, team groups, and online presence synced instantly via Supabase, right inside GitHub.</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <div className="eco-pillar-card">
                <div className="eco-pillar-header">
                  <div className="eco-pillar-icon eco-pillar-icon-cyan">
                    <Code size={24} />
                  </div>
                  <h4 className="h4">In-Context Sharing</h4>
                </div>
                <div className="eco-pillar-text">
                  <p className="body-sm">Highlight code snippets, PRs, or issues on GitHub to instantly share them in chat or analyze with RepoBot.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── CTA Banner Bar ── */}
          <ScrollReveal>
            <div className="eco-cta-banner">
              <div className="eco-cta-left">
                <h3 className="h3">Start collaborating where your code lives.</h3>
              </div>
              <div className="eco-cta-right">
                <p className="body-sm">No credit card required. Just your GitHub account.</p>
                <a href="#install" className="btn btn-white">Add to Chrome — Free</a>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
      {/* ═══ CORE FEATURES GRID ═══ */}
      <section className="section features-grid-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-head ecosystem-head">
              <div className="ecosystem-badge">Core Features</div>
              <h2 className="h2 ecosystem-h2">Your entire workflow,<br />in <span className="gradient-text">one sidebar.</span></h2>
              <p>Chat with your team, manage GitHub issues, and share code snippets — all without leaving the repository.</p>
            </div>
          </ScrollReveal>

          <div className="features-bento-grid">
            {coreFeatures.map((f, i) => (
              <ScrollReveal key={i} delay={i as 0 | 1 | 2 | 3}>
                <div className="feature-card-bento">
                  <div className="feature-card-image">
                    <img src={f.img} alt={f.title} loading="lazy" />
                    <div className="feature-card-badge">{f.badge}</div>
                  </div>
                  <div className="feature-card-content">
                    <h3 className="h3">{f.title}</h3>
                    <p className="body-md">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MINI FEATURE GRID ═══ */}
      <section className="section mini-features-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-head ecosystem-head">
              <h2 className="h2 ecosystem-h2">And so <span className="gradient-text">much more.</span></h2>
            </div>
          </ScrollReveal>

          <div className="mini-features-carousel">
            <button className="mini-scroll-btn mini-scroll-left" onClick={() => scrollMiniGrid('left')} aria-label="Scroll left">
              <ChevronLeft size={24} />
            </button>
            <div className="mini-features-grid" ref={miniGridRef} onScroll={handleGridScroll}>
            {[
              { 
                title: 'Message Reactions', 
                desc: 'React with emojis to any message in real-time.', 
                hue: '320deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M50 10 Q52 25 65 25 Q52 25 50 40 Q48 25 35 25 Q48 25 50 10" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.9" />
                    <path d="M48 15 L52 15 M48 20 L52 20 M48 30 L52 30" stroke="white" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="20" cy="15" r="5" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.7" />
                    <path d="M17 13 L18 13 M22 13 L23 13" stroke="white" strokeWidth="1" strokeLinecap="round" />
                    <path d="M17 18 Q20 21 23 18" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="80" cy="45" r="5" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.7" />
                    <path d="M77 43 L78 43 M82 43 L83 43" stroke="white" strokeWidth="1" strokeLinecap="round" />
                    <path d="M77 48 Q80 51 83 48" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                )
              },
              { 
                title: 'Starred Messages', 
                desc: 'Star important messages for quick access later.', 
                hue: '45deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M50 15 L55 30 L70 30 L58 40 L62 55 L50 45 L38 55 L42 40 L30 30 L45 30 Z" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
                    <path d="M50 15 L55 30 L70 30 L58 40" fill="none" stroke="white" strokeWidth="1" strokeLinejoin="round" opacity="0.4" />
                    <circle cx="20" cy="20" r="1" fill="white" opacity="0.2" />
                    <circle cx="80" cy="40" r="1" fill="white" opacity="0.2" />
                  </svg>
                )
              },
              { 
                title: 'Custom Lists', 
                desc: 'Organize chats by project, team, or context smartly.', 
                hue: '240deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M30 15 Q50 12 70 15 L72 45 Q50 48 28 45 Z" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />
                    <path d="M32 18 L68 18" stroke="white" strokeWidth="0.5" opacity="0.2" />
                    <path d="M35 25 H60 M35 32 H55 M35 39 H50" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <path d="M20 20 L25 25 M75 40 L80 45" stroke="white" strokeWidth="0.5" opacity="0.2" />
                    <rect x="62" y="24" width="4" height="4" rx="1" stroke="white" strokeWidth="0.5" fill="none" opacity="0.4" />
                  </svg>
                )
              },
              { 
                title: 'Online Presence', 
                desc: 'See who is online with last-seen timestamps.', 
                hue: '150deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M50 30 Q55 20 65 20 M50 30 Q45 20 35 20" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.8" />
                    <path d="M50 30 Q65 10 80 15 M50 30 Q35 10 20 15" fill="none" stroke="white" strokeWidth="1.2" opacity="0.4" />
                    <circle cx="50" cy="30" r="4" fill="#06B6D4" opacity="0.9" />
                    <path d="M48 24 L52 24 M50 22 L50 26" stroke="white" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="50" cy="30" r="15" stroke="white" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />
                  </svg>
                )
              },
              { 
                title: 'Theming', 
                desc: '6 accent colors, default and compact view support.', 
                hue: '280deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M30 20 Q40 10 50 20 Q60 30 70 20 Q80 10 85 25 Q85 45 70 50 Q50 55 30 50 Q15 45 15 25 Q15 10 30 20" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />
                    <path d="M25 25 L35 15 M65 45 L75 35" stroke="white" strokeWidth="0.5" opacity="0.2" />
                    <circle cx="35" cy="30" r="3" fill="#06B6D4" opacity="0.8" />
                    <circle cx="50" cy="40" r="4" fill="#8B5CF6" opacity="0.8" />
                    <circle cx="65" cy="30" r="3" fill="#06B6D4" opacity="0.8" />
                    <path d="M45 40 L55 40" stroke="white" strokeWidth="0.5" opacity="0.4" />
                  </svg>
                )
              },
              { 
                title: 'Keyboard Shortcuts', 
                desc: 'Navigate fast with professional keyboard workflows.', 
                hue: '0deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M25 20 Q35 18 45 20 L45 40 Q35 42 25 40 Z" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.9" />
                    <path d="M28 22 L42 22" stroke="white" strokeWidth="0.5" opacity="0.2" />
                    <path d="M55 20 Q70 18 85 20 L85 40 Q70 42 55 40 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
                    <text x="29" y="34" fill="#06B6D4" fontSize="12" fontWeight="bold" opacity="0.9">⌘</text>
                    <text x="64" y="34" fill="white" fontSize="12" fontWeight="bold" opacity="0.9">K</text>
                    <path d="M20 50 H80" stroke="white" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
                  </svg>
                )
              },
              { 
                title: 'Pinned & Archived Chats', 
                desc: 'Keep the sidebar clean by managing your chat list.', 
                hue: '110deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M25 20 L50 10 L75 20 L75 45 L50 55 L25 45 Z" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.9" />
                    <path d="M25 20 L50 30 L75 20 M50 30 V55" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.7" />
                    <path d="M30 25 L45 35 M55 35 L70 25" stroke="white" strokeWidth="0.5" opacity="0.2" />
                    <circle cx="50" cy="15" r="2" fill="white" opacity="0.6" />
                    <path d="M40 16 L65 26" stroke="white" strokeWidth="1" opacity="0.3" />
                  </svg>
                )
              },
              { 
                title: 'Message Templates', 
                desc: 'Save time with up to 6 custom message templates.', 
                hue: '260deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M30 10 Q50 8 70 10 L72 50 Q50 52 28 50 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
                    <path d="M32 15 L68 15" stroke="white" strokeWidth="0.5" opacity="0.2" />
                    <path d="M35 25 H65 M35 32 H65 M35 39 H65 M35 46 H50" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <path d="M80 20 L85 25 M85 20 L80 25" stroke="white" strokeWidth="0.5" opacity="0.4" />
                  </svg>
                )
              },
              { 
                title: 'Cloud Data Sync', 
                desc: 'Seamlessly sync chats and settings across devices.', 
                hue: '190deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M30 35 Q30 20 45 20 Q50 10 65 15 Q75 20 75 35 Z" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
                    <path d="M45 40 L50 30 L55 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
                    <path d="M50 30 V50" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    <path d="M35 45 H65" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                  </svg>
                )
              },
              { 
                title: 'Chat Export', 
                desc: 'Download your group discussions in markdown format.', 
                hue: '170deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M30 15 H60 L75 30 V50 H30 Z" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />
                    <path d="M60 15 V30 H75" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />
                    <path d="M45 25 L52.5 35 L60 25" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
                    <path d="M52.5 15 V35" stroke="#06B6D4" strokeWidth="2" opacity="0.9" />
                    <path d="M40 45 H65" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                )
              },
              { 
                title: 'Pinned Messages', 
                desc: 'Pin crucial decisions to the top of any group chat.', 
                hue: '210deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M50 15 L50 45 M35 45 L65 45" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                    <path d="M48 30 L52 30" stroke="white" strokeWidth="1" opacity="0.4" />
                    <path d="M35 25 Q50 20 65 25 L60 45 H40 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    <path d="M50 15 Q55 10 50 5" stroke="#06B6D4" strokeWidth="1.5" opacity="0.8" />
                    <path d="M30 10 L35 15 M70 10 L65 15" stroke="white" strokeWidth="0.5" opacity="0.2" />
                  </svg>
                )
              },
              { 
                title: 'Notification Center', 
                desc: 'A dedicated inbox for mentions and friend requests.', 
                hue: '340deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M40 25 Q50 15 60 25 V40 L65 45 H35 L40 40 V25 Z" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
                    <path d="M45 45 Q50 55 55 45" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                    <circle cx="65" cy="20" r="4" fill="#8B5CF6" opacity="0.9" />
                    <path d="M63 20 H67 M65 18 V22" stroke="white" strokeWidth="1" />
                    <path d="M25 25 H30 M25 35 H35" stroke="white" strokeWidth="0.5" opacity="0.3" strokeLinecap="round" />
                  </svg>
                )
              },
              { 
                title: 'Friend System', 
                desc: 'Add colleagues to see their status and quick-message.', 
                hue: '80deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <circle cx="35" cy="25" r="8" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.9" />
                    <path d="M20 50 Q35 35 50 50" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                    <circle cx="65" cy="25" r="8" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.7" />
                    <path d="M50 50 Q65 35 80 50" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <circle cx="42" cy="18" r="3" fill="#8B5CF6" opacity="0.9" />
                  </svg>
                )
              },
              { 
                title: 'Quick Share', 
                desc: 'Share panel via dedicated module or keyboard shortcut.', 
                hue: '20deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <path d="M20 30 Q50 10 85 30 L45 40 L20 30" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.9" />
                    <path d="M45 40 L50 55 L55 40" fill="none" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.7" />
                    <path d="M30 35 L35 38" stroke="white" strokeWidth="1" opacity="0.4" />
                    <path d="M20 30 L55 40" stroke="white" strokeWidth="0.8" opacity="0.3" />
                    <path d="M10 10 L20 20 M90 50 L80 40" stroke="white" strokeWidth="0.5" opacity="0.2" />
                  </svg>
                )
              },
              { 
                title: 'Dual View Mode', 
                desc: 'Compact sidebar or expanded split view with threaded chats.', 
                hue: '200deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    {/* Left panel (compact) */}
                    <rect x="10" y="10" width="25" height="40" rx="3" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.9" />
                    <path d="M15 18 H30 M15 24 H28 M15 30 H26" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                    {/* Arrow */}
                    <path d="M42 30 L52 30 M49 26 L53 30 L49 34" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                    {/* Right panel (expanded split) */}
                    <rect x="58" y="10" width="34" height="40" rx="3" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.9" />
                    <line x1="75" y1="10" x2="75" y2="50" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
                    <path d="M62 18 H72 M62 24 H70 M62 30 H71" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                    <path d="M78 18 H89 M78 24 H87 M78 30 H88" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                  </svg>
                )
              },
              { 
                title: 'Smart Mentions', 
                desc: 'Notify team members with context-aware @mentions.', 
                hue: '300deg',
                visual: (
                  <svg viewBox="0 0 100 60" className="visual-svg">
                    <circle cx="50" cy="30" r="15" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />
                    <path d="M50 22 V38 M42 30 H58" stroke="white" strokeWidth="1.5" opacity="0.4" />
                    <path d="M50 30 L65 45" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                    <text x="44" y="34" fill="white" fontSize="14" fontWeight="bold" opacity="0.9">@</text>
                  </svg>
                )
              }
            ].map((f, i) => (
              <ScrollReveal key={i} delay={(i % 3) as 0 | 1 | 2 | 3}>
                <div 
                  className="mini-feature-card" 
                  style={{ '--card-hue': f.hue } as any}
                >
                  <div className="mini-feature-content">
                    <h4 className="h4">{f.title}</h4>
                    <p className="body-sm mt-2" style={{ opacity: 0.7 }}>{f.desc}</p>
                  </div>
                  <div className="mini-feature-visual">
                    {f.visual}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
            <button className="mini-scroll-btn mini-scroll-right" onClick={() => scrollMiniGrid('right')} aria-label="Scroll right">
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="mini-features-pagination">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className={`pagination-dot ${i === activeMiniFeature ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-head ecosystem-head">
              <div className="ecosystem-badge">Pricing</div>
              <h2 className="h2 ecosystem-h2">Simple <span className="gradient-text">pricing.</span></h2>
              <p>Start free, upgrade when you need more.</p>
            </div>
          </ScrollReveal>

          {/* ===== FULL COMPARISON TABLE ONLY ===== */}
          <div style={{ marginTop: 'var(--space-m)' }}>
            <ScrollReveal delay={1}>
              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="feature-col">Feature</th>
                      <th className="free-col">Free</th>
                      <th className="pro-col">
                        <span className="pro-col-label">Pro <Sparkles size={12} /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i}>
                        <td className="feature-col">{row.feature}</td>
                        <td className="free-col"><CellValue value={row.free} /></td>
                        <td className="pro-col"><CellValue value={row.pro} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ TRUST + FAQ ═══ */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 64 }}>
            <ScrollReveal>
              <div className="trust-content">
                <div className="ecosystem-badge">Security</div>
                <h2 className="h3 mb-4">Built on trust.</h2>
                <p className="body-md mb-8">Every table protected with PostgreSQL Row Level Security. Your data is completely isolated.</p>
                <ul className="price-features" style={{ marginTop: 0 }}>
                  <li><span className="ck">✓</span> GitHub OAuth — no passwords stored</li>
                  <li><span className="ck">✓</span> Complete per-user data isolation</li>
                  <li><span className="ck">✓</span> Encrypted in transit & at rest</li>
                </ul>
                <Link to="/security" className="btn btn-ghost mt-8">Security Details <ArrowRight size={14} /></Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h2 className="h3 mb-6">FAQs</h2>
              <FAQ />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '40px 0 80px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="container">
          <ScrollReveal>
            <AnimatedRepoChat />
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

const AnimatedRepoChat = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px" });

  const letters = ["R", "e", "p", "o", "C", "h", "a", "t", "."];
  
  return (
    <h2 
      ref={ref}
      className="h1" 
      style={{ 
        fontSize: 'clamp(3rem, 18vw, 12rem)', 
        fontWeight: 400, 
        letterSpacing: '-0.03em', 
        marginBottom: 0, 
        lineHeight: 1, 
        color: 'rgba(255,255,255,0.9)' 
      }}
    >
      <span style={{ display: 'inline-flex', position: 'relative' }}>
        {letters.map((letter, i) => {
          const isO = letter === "o";
          return (
            <motion.span
              key={i}
              initial={isO ? { rotateY: 0 } : {}}
              animate={isInView && isO ? { rotateY: 720 } : { rotateY: 0 }}
              transition={
                isO 
                  ? { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 } 
                  : {}
              }
              style={{ 
                display: 'inline-block',
                originX: 0.5,
                originY: 0.5,
              }}
            >
              {letter}
            </motion.span>
          );
        })}
      </span>
    </h2>
  );
};
