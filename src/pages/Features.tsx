import { useState, useRef, useCallback, useEffect } from 'react'
import { MessageSquare, GitPullRequest, ClipboardList, Dna, Database, AppWindow, Activity, Share2, Bot, Check, Globe, Lock, User, Plus, X, Columns, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const featureCards = [
  {
    category: 'Communication',
    img: '/group.png',
    icon: MessageSquare,
    dark: true,
    infoHue: '240',
    description: 'Real-time messaging built into GitHub — DMs, groups, threads, and emoji reactions, powered by Supabase Realtime.',
    features: [
      'Real-time DMs, groups & threaded replies',
      'Emoji reactions with full skin-tone support',
      'Live presence & typing indicators'
    ]
  },
  {
    category: 'Identity',
    img: '/dna.png',
    icon: Dna,
    dark: false,
    infoHue: '160',
    description: 'Dev DNA — a full developer identity card with radar stats, language breakdown, commit pulse, and achievement badges.',
    features: [
      'Radar chart for velocity, impact & OSS scores',
      'Tech DNA language bar from real repo data',
      '14 achievement badges earned from activity'
    ]
  },
  {
    category: 'Productivity',
    img: '/pad.png',
    icon: ClipboardList,
    dark: false,
    infoHue: '90',
    description: 'Personal scratchpads with checklist tracking, star/pin system, and full CRUD — synced via Supabase or stored locally.',
    features: [
      'Create, edit, pin & star personal scratchpads',
      'Interactive checklist tracking for tasks',
      'Cloud sync (Pro) or local browser storage'
    ]
  },
  {
    category: 'Triage',
    img: '/triage.png',
    icon: GitPullRequest,
    dark: true,
    infoHue: '300',
    description: 'Full GitHub triage from the chat sidebar — comment on issues, manage labels & assignees, and close/reopen without leaving the page.',
    features: [
      'Post comments on Issues & PRs directly',
      'Smart Task Assignments & label management',
      'Auto-detects public vs private repo scopes'
    ]
  },
  {
    category: 'Sharing',
    img: '/share.png',
    icon: Share2,
    dark: true,
    infoHue: '30',
    description: 'Select any text on GitHub and share it instantly to friends or groups — with pinned recipients, personal messages, and template chips.',
    features: [
      'Floating share popup on any text selection',
      'Multi-target sharing to friends & groups',
      'Configurable quick-reply template chips'
    ]
  },
  {
    category: 'RepoBot',
    img: '/repobot.png',
    icon: Bot,
    dark: false,
    infoHue: '200',
    description: 'AI-powered repo explainer — choose Quick, Detailed, ELI5, or Architecture mode, then ask follow-up questions with full context.',
    features: [
      'Four explain modes: Quick, Detailed, ELI5 & Arch',
      'BYO keys: Groq, OpenAI, Claude & Gemini',
      'Fetches live repo metadata & file tree context'
    ]
  }
]


export default function Features() {
  const archPanelRef = useRef<HTMLDivElement>(null)
  const archPipelineRef = useRef<HTMLDivElement>(null)
  const miniGridRef = useRef<HTMLDivElement>(null)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [activeMiniFeature, setActiveMiniFeature] = useState(0)

  const scrollMiniGrid = (dir: 'left' | 'right') => {
    if (miniGridRef.current) {
      const scrollAmount = 400;
      miniGridRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    if (maxScrollLeft <= 0) return;
    const progress = scrollLeft / maxScrollLeft;
    const newIndex = Math.round(progress * 15); // 16 items total
    setActiveMiniFeature(newIndex);
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  // Fluid architecture graph scaling — same principle as ecosystem diagram.
  // Continuously maps container width to a zoom level so the layout never overflows.
  const updateArchScale = useCallback(() => {
    const panel = archPanelRef.current;
    const pipeline = archPipelineRef.current;
    if (!panel || !pipeline) return;

    const BASE_WIDTH = 1150; // natural unscaled pipeline width + breathing room (matches ecosystem)
    const style = getComputedStyle(panel);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const available = panel.clientWidth - padL - padR;

    if (available >= BASE_WIDTH) {
      pipeline.style.zoom = '1';
    } else {
      const scale = Math.max(available / BASE_WIDTH, 0.25);
      pipeline.style.zoom = scale.toString();
    }
  }, []);

  useEffect(() => {
    updateArchScale();
    window.addEventListener('resize', updateArchScale);
    const ro = new ResizeObserver(updateArchScale);
    if (archPanelRef.current) ro.observe(archPanelRef.current);
    return () => {
      window.removeEventListener('resize', updateArchScale);
      ro.disconnect();
    };
  }, [updateArchScale]);

  return (
    <div className="feat-page">
      <div className="container">

        {/* ═══ HERO ═══ */}
        <ScrollReveal>
          <div className="feat-hero-area">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h1 className="h2">Every feature built<br /><span className="gradient-text">for developer flow.</span></h1>
              <p>Explore the tools that keep your team in sync — right where the code lives.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ FEATURE ARCHITECTURE GRAPH ═══ */}
        <ScrollReveal>
          <div className="feat-arch-panel" ref={archPanelRef}>
            {/* Background glowing effects */}
            <div className="feat-arch-glow feat-arch-glow-left"></div>
            <div className="feat-arch-glow feat-arch-glow-right"></div>

            <div className="feat-arch-pipeline" ref={archPipelineRef}>
              
              {/* Left: The Source */}
              <div className="feat-arch-column feat-arch-source">
                <div className="feat-arch-node node-source">
                  <div className="node-icon"><GitPullRequest size={24} /></div>
                  <div className="node-title">GitHub Repository</div>
                  <div className="node-tags">
                    <span>Code Context</span>
                    <span>PRs</span>
                    <span>Issues</span>
                  </div>
                </div>
              </div>

              {/* SVG Connections: Source to Engine */}
              <div className="feat-arch-connections connections-1">
                <svg preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,50 C50,50 50,50 100,50" className="arch-line" />
                  <path d="M0,50 C50,50 50,50 100,50" className="arch-line-animated" />
                </svg>
              </div>

              {/* Middle: The Engine */}
              <div className="feat-arch-column feat-arch-engine">
                <div className="feat-arch-core">
                  <div className="core-rings">
                    <div className="core-ring cr-1"></div>
                    <div className="core-ring cr-2"></div>
                    <div className="core-ring cr-3"></div>
                  </div>
                  <div className="core-center">
                    <span className="core-logo">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </span>
                  </div>

                  {/* Satellite Nodes (Real RepoChat Stack) */}
                  <div className="core-node cn-1">
                    <div className="cn-icon"><Activity size={16} /></div>
                    <div className="cn-label">Supabase Realtime</div>
                  </div>
                  <div className="core-node cn-2">
                    <div className="cn-icon"><Database size={16} /></div>
                    <div className="cn-label">PostgreSQL RLS</div>
                  </div>
                  <div className="core-node cn-3">
                    <div className="cn-icon"><AppWindow size={16} /></div>
                    <div className="cn-label">Chrome Extension API</div>
                  </div>
                </div>
              </div>

              {/* SVG Connections: Engine to Pillars */}
              <div className="feat-arch-connections connections-2">
                <div className="protocol-label pl-1">WSS://</div>
                <div className="protocol-label pl-2">REST API</div>
                <div className="protocol-label pl-3">DOM Sync</div>
                <svg preserveAspectRatio="none" viewBox="0 0 150 200">
                  {/* To Comm (Top) */}
                  <path d="M0,100 C50,100 50,25 150,25" className="arch-line" />
                  <path d="M0,100 C50,100 50,25 150,25" className="arch-line-animated" style={{ animationDelay: '0s' }} />
                  {/* To GitHub (Mid-Top) */}
                  <path d="M0,100 C75,100 75,75 150,75" className="arch-line" />
                  <path d="M0,100 C75,100 75,75 150,75" className="arch-line-animated" style={{ animationDelay: '0.5s' }} />
                  {/* To Prod (Mid-Bottom) */}
                  <path d="M0,100 C75,100 75,125 150,125" className="arch-line" />
                  <path d="M0,100 C75,100 75,125 150,125" className="arch-line-animated" style={{ animationDelay: '1s' }} />
                  {/* To Identity (Bottom) */}
                  <path d="M0,100 C50,100 50,175 150,175" className="arch-line" />
                  <path d="M0,100 C50,100 50,175 150,175" className="arch-line-animated" style={{ animationDelay: '1.5s' }} />
                </svg>
              </div>

              {/* Right: The 4 Pillars */}
              <div className="feat-arch-column feat-arch-pillars">
                
                <div className="arch-pillar-card p-comm">
                  <div className="p-icon"><MessageSquare size={16} /></div>
                  <div className="p-content">
                    <h4>Communication</h4>
                    <p>Real-time chat, threads, & DMs</p>
                  </div>
                </div>

                <div className="arch-pillar-card p-git">
                  <div className="p-icon"><GitPullRequest size={16} /></div>
                  <div className="p-content">
                    <h4>GitHub Integration</h4>
                    <p>Smart PR & Issue triage</p>
                  </div>
                </div>

                <div className="arch-pillar-card p-prod">
                  <div className="p-icon"><ClipboardList size={16} /></div>
                  <div className="p-content">
                    <h4>Productivity</h4>
                    <p>Shared scratchpads & notes</p>
                  </div>
                </div>

                <div className="arch-pillar-card p-id">
                  <div className="p-icon"><Dna size={16} /></div>
                  <div className="p-content">
                    <h4>Identity & Sharing</h4>
                    <p>Custom Dev DNA & presence</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* ═══ WHO IS IT FOR — 3 PILLAR CARDS ═══ */}
        <div className="eco-pillars" style={{ marginTop: 40 }}>
          <ScrollReveal>
            <div className="eco-pillar-card">
              <div className="eco-pillar-header">
                <div className="eco-pillar-icon">
                  <Globe size={24} />
                </div>
                <h4 className="h4">For Open Source</h4>
              </div>
              <div className="eco-pillar-text">
                <p className="body-sm">Manage massive community repositories, triage issues, and talk to contributors — all without leaving GitHub.</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div className="eco-pillar-card">
              <div className="eco-pillar-header">
                <div className="eco-pillar-icon eco-pillar-icon-green">
                  <Lock size={24} />
                </div>
                <h4 className="h4">For Private Startups</h4>
              </div>
              <div className="eco-pillar-text">
                <p className="body-sm">Keep your proprietary code secure while collaborating with your core team at lightning speed via real-time chat.</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="eco-pillar-card">
              <div className="eco-pillar-header">
                <div className="eco-pillar-icon eco-pillar-icon-cyan">
                  <User size={24} />
                </div>
                <h4 className="h4">For Solo Developers</h4>
              </div>
              <div className="eco-pillar-text">
                <p className="body-sm">Use personal scratchpads and AI-powered repo analysis to 10x your learning speed on any new codebase.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ═══ DUAL VIEW MODE BANNER ═══ */}
        <ScrollReveal>
          <div className="feat-view-banner">
            <div className="feat-view-icons">
              <div className="feat-view-icon-box">
                <Columns size={22} />
                <span>Split View</span>
              </div>
              <div className="feat-view-divider">+</div>
              <div className="feat-view-icon-box">
                <Maximize2 size={22} />
                <span>Expanded</span>
              </div>
            </div>
            <div className="feat-view-text">
              <h3 className="h4">Two modes. Zero compromise.</h3>
              <p className="body-sm">Use RepoChat as a compact sidebar for quick chats, or expand into a full split view with threaded conversations, thread search, and side-by-side context — all without leaving GitHub.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ FEATURE CARDS — 2×3 GRID ═══ */}
        <section className="feat-cards-section">
          <ScrollReveal>
            <div className="section-head" style={{ marginBottom: 48 }}>
              <h2 className="h2 ecosystem-h2">Explore every <span className="gradient-text">capability.</span></h2>
              <p className="body-md" style={{ opacity: 0.6, marginTop: 8 }}>Click any card to discover what's inside.</p>
            </div>
          </ScrollReveal>

          <div className="feat-cards-grid">
            {featureCards.map((card, i) => {
              const isExpanded = expandedCards.has(i)
              const isDark = card.dark
              const Icon = card.icon
              return (
                <ScrollReveal key={i} delay={(i % 3) as 0 | 1 | 2}>
                  <div
                    className={`feat-card ${isDark ? 'feat-card--dark' : 'feat-card--light'} ${isExpanded ? 'is-expanded' : ''}`}
                    id={`feat-card-${i}`}
                    onClick={() => toggleCard(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feat-card-media">
                      <img src={card.img} alt={card.category} className="feat-card-img" loading="lazy" />
                      <div className="feat-card-info" style={{ '--info-hue': `${card.infoHue}deg` } as React.CSSProperties}>
                        <p className="feat-card-desc">{card.description}</p>
                        <ul className="feat-card-features">
                          {card.features.map((f, j) => (
                            <li key={j}><Check size={14} strokeWidth={3} /> <span>{f}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="feat-card-footer">
                      <div className="feat-card-label">
                        <Icon size={18} />
                        <span>{card.category}</span>
                      </div>
                      <button
                        className="feat-card-toggle"
                        onClick={(e) => { e.stopPropagation(); toggleCard(i); }}
                        aria-label={isExpanded ? 'Close details' : 'Show details'}
                      >
                        <span className="feat-card-toggle-icon">{isExpanded ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}</span>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>

      </div>{/* close outer .container */}

        {/* ═══ AND SO MUCH MORE (CAROUSEL) ═══ */}
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
                      <rect x="10" y="10" width="25" height="40" rx="3" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.9" />
                      <path d="M15 18 H30 M15 24 H28 M15 30 H26" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                      <path d="M42 30 L52 30 M49 26 L53 30 L49 34" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
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
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`pagination-dot ${i === activeMiniFeature ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <div className="container">
          <ScrollReveal>
            <div className="feat-cta-banner">
              <div className="eco-cta-left">
                <h3 className="h3">Every feature you need. Zero context switching.</h3>
              </div>
              <div className="eco-cta-right">
                <p className="body-sm">Free to start. No credit card required.</p>
                <a href="#install" className="btn btn-white">Add to Chrome — Free</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
    </div>
  )
}
