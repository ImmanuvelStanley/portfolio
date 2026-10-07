/**
 * ============================================================================
 * IMMANUVEL STANLEY A — MASTER DEVELOPER SUITE & KERNEL SCRIPT
 * Spotlight Tracking, Command Palette (Cmd+K), Live Stock Telemetry Canvas,
 * Differential CAN Bus Oscilloscope, Web Audio Synthesizer, Dynamic Case Studies
 * ============================================================================
 */

// 0. BACKFLOW REWIND SCROLL ENGINE (CINEMATIC RELOAD FROM CURRENT CONTENT)
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Track real-time scroll offset to record where user was viewing before reload
let lastRecordedScrollY = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    lastRecordedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    try {
      sessionStorage.setItem('portfolio_backflow_origin_y', String(Math.round(lastRecordedScrollY)));
      sessionStorage.setItem('portfolio_backflow_path', window.location.pathname);
      sessionStorage.setItem('portfolio_backflow_time', String(Date.now()));
    } catch (e) {}
  }, { passive: true });

  window.addEventListener('beforeunload', () => {
    try {
      const finalY = window.pageYOffset || document.documentElement.scrollTop || lastRecordedScrollY || 0;
      sessionStorage.setItem('portfolio_backflow_origin_y', String(Math.round(finalY)));
      sessionStorage.setItem('portfolio_backflow_path', window.location.pathname);
      sessionStorage.setItem('portfolio_backflow_time', String(Date.now()));
    } catch (e) {}
  });
}

function getSavedBackflowOrigin() {
  if (typeof window === 'undefined') return 0;
  if (typeof window.__PORTFOLIO_BACKFLOW_START_Y__ === 'number' && window.__PORTFOLIO_BACKFLOW_START_Y__ > 100) {
    return window.__PORTFOLIO_BACKFLOW_START_Y__;
  }
  try {
    let isReload = false;
    const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      isReload = (navEntries[0].type === 'reload');
    } else if (performance.navigation) {
      isReload = (performance.navigation.type === 1);
    }
    const savedY = parseInt(sessionStorage.getItem('portfolio_backflow_origin_y') || '0', 10);
    const savedPath = sessionStorage.getItem('portfolio_backflow_path');
    const savedTime = parseInt(sessionStorage.getItem('portfolio_backflow_time') || '0', 10);
    const isRecent = (Date.now() - savedTime) < 12000;

    if ((isReload || (savedPath === window.location.pathname && isRecent)) && savedY > 100) {
      return savedY;
    }
  } catch (e) {}
  return 0;
}

function initBackflowRewindEngine() {
  const originY = getSavedBackflowOrigin();
  if (originY <= 100) {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
    return;
  }

  // Clear session storage so subsequent normal navigation doesn't trigger
  try {
    sessionStorage.removeItem('portfolio_backflow_origin_y');
    sessionStorage.removeItem('portfolio_backflow_path');
    sessionStorage.removeItem('portfolio_backflow_time');
    delete window.__PORTFOLIO_BACKFLOW_START_Y__;
  } catch (e) {}

  // Guarantee starting render exactly at the user's previous content
  window.scrollTo(0, originY);

  const bar = document.getElementById('scroll-progress-bar');
  if (bar) bar.classList.add('backflow-active');
  document.body.classList.add('backflow-running');

  // Brief pause (50ms) to allow the browser paint to present the content to the user
  setTimeout(() => {
    const startY = window.pageYOffset || document.documentElement.scrollTop || originY;
    const duration = Math.min(1200, Math.max(750, Math.round(Math.pow(startY, 0.44) * 62)));
    let startTime = null;
    let animId = null;
    let isCancelled = false;

    function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      document.body.classList.remove('backflow-running');
      if (bar) {
        bar.classList.remove('backflow-active');
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const ratio = height > 0 ? (window.pageYOffset / height) : 0;
        bar.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
      }
    }

    function cancelOnUserInteraction() {
      if (isCancelled) return;
      isCancelled = true;
      cleanup();
    }

    window.addEventListener('wheel', cancelOnUserInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', cancelOnUserInteraction, { passive: true, once: true });
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        cancelOnUserInteraction();
      }
    }, { once: true });

    function step(timestamp) {
      if (isCancelled) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Luxury easeInOutQuart for ultra-smooth gliding deceleration
      const eased = progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      const currentY = startY * (1 - eased);
      window.scrollTo(0, Math.round(currentY));

      if (bar) {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const ratio = height > 0 ? (currentY / height) : 0;
        bar.style.transform = `scaleX(${Math.max(0, ratio)})`;
      }

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        cleanup();
        triggerHeroLandingDock();
      }
    }

    animId = requestAnimationFrame(step);
  }, 60);
}

function triggerHeroLandingDock() {
  const target = document.querySelector('.hero-badge, .service-hero-badge, .page-header-badge, .hero-title');
  if (target) {
    target.classList.remove('hero-dock-pop');
    void target.offsetWidth;
    target.classList.add('hero-dock-pop');
    setTimeout(() => {
      target.classList.remove('hero-dock-pop');
    }, 600);
  }
  if (typeof window.__triggerHeroTitleScramble === 'function') {
    window.__triggerHeroTitleScramble();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window !== 'undefined' && window.location && window.location.hash) {
    try {
      if (typeof history !== 'undefined' && typeof history.replaceState === 'function') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}
  }

  initBackflowRewindEngine();
  initThemeEngine();
  initISTClock();
  initScrollProgressBar();
  initSoundEngine();
  initSpotlightEffect();
  initCommandPalette();
  initWorkbench();
  initLiveStockCanvas();
  initDifferentialCANOscilloscope();
  initProjectFilters();
  initCaseStudyModals();
  initContactForm();
  initScrollspyAndNav();
  initResumeModal();
  initSmoothRevealObserver();
  initServiceDSO();
  initSmoothAnchorLinks();
  initHeroRoleFlipper();
  initHeroTitleLoader();
  initTimelineInteractiveMotion();
  initProjectCardsMotion();
  initCertCardsElevation();
  initContactNetworkCanvas();
  initPageNetworkCanvas();
});

/* ==========================================================================
   1. LIVE IST CLOCK (CHENNAI, INDIA)
   ========================================================================== */
function initISTClock() {
  const heroClock = document.getElementById('live-ist-time');
  const navClock = document.getElementById('nav-live-clock');

  function updateTime() {
    const now = new Date();
    // UTC time + 5 hours 30 minutes for IST
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));

    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const formattedHours = String(hours).padStart(2, '0');

    const timeString = `${formattedHours}:${minutes}:${seconds} ${ampm} IST`;
    const navString = `Chennai, IN • ${formattedHours}:${minutes} ${ampm} IST`;

    if (heroClock) heroClock.textContent = timeString;
    if (navClock) navClock.textContent = navString;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. TOP SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const ratio = height > 0 ? Math.min(1, Math.max(0, winScroll / height)) : 0;
        bar.style.transform = `scaleX(${ratio})`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   3. WEB AUDIO SYNTHESIZER (TACTILE SOUND FEEDBACK)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function toggleAudio() {
  soundEnabled = !soundEnabled;
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) soundBtn.classList.toggle('active', soundEnabled);

  if (soundEnabled) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    playBlipSound(600, 0.04);
    showToast('Sound feedback enabled (Mechanical audio)');
  } else {
    showToast('Sound feedback muted');
  }
}

function initSoundEngine() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;
  soundBtn.addEventListener('click', toggleAudio);
}

function playBlipSound(freq = 440, duration = 0.03, type = 'sine') {
  if (!soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Graceful fallback if audio is restricted
  }
}

/* ==========================================================================
   4. SPOTLIGHT CARD CURSOR TRACKING (SIGNATURE MASTER POLISH)
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    let rect = null;
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
    }, { passive: true });
  });
}

/* ==========================================================================
   5. THEME ENGINE (OBSIDIAN DARK / CLEAN LUXURY PORCELAIN)
   ========================================================================== */
function toggleTheme() {
  playBlipSound(520, 0.05);
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    if (newTheme === 'dark') {
      themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
  showToast(`Switched to ${newTheme === 'dark' ? 'Dark Obsidian' : 'Clean Porcelain'} mode`);
}

function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

/* ==========================================================================
   6. COMMAND PALETTE (CMD+K / CTRL+K)
   ========================================================================== */
function initCommandPalette() {
  const triggerBtn = document.getElementById('open-cmd-palette-btn');
  const backdrop = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-palette-input');
  const list = document.getElementById('cmd-palette-list');
  if (!backdrop || !input || !list) return;

  const commands = [
    { group: 'Navigation', title: 'Jump to Projects Showcase', shortcut: 'G P', action: () => scrollToId('projects') },
    { group: 'Navigation', title: 'Jump to Skills Repertoire', shortcut: 'G S', action: () => scrollToId('skills') },
    { group: 'Navigation', title: 'Jump to Work Experience', shortcut: 'G E', action: () => scrollToId('experience') },
    { group: 'Navigation', title: 'Jump to Beyond Code (Diagnostics)', shortcut: 'G B', action: () => scrollToId('beyond-code') },
    { group: 'Navigation', title: 'Jump to Contact Section', shortcut: 'G C', action: () => scrollToId('contact') },
    
    { group: 'Flagship Projects', title: 'View AuraTrade Case Study', shortcut: 'P 1', action: () => openCaseStudyBySlug('auratrade') },
    { group: 'Flagship Projects', title: 'View Elementro Case Study', shortcut: 'P 2', action: () => openCaseStudyBySlug('elementro') },
    { group: 'Flagship Projects', title: 'View Codeplus NOVA Case Study', shortcut: 'P 3', action: () => openCaseStudyBySlug('codeplus') },
    { group: 'Flagship Projects', title: 'View EcogenAI Case Study', shortcut: 'P 4', action: () => openCaseStudyBySlug('ecogenai') },
    { group: 'Flagship Projects', title: 'View MedVision Case Study', shortcut: 'P 5', action: () => openCaseStudyBySlug('medvision') },

    { group: 'Actions', title: 'Download Software / AI Resume (PDF)', shortcut: '⌘ D', action: () => downloadResume('it') },
    { group: 'Actions', title: 'Download Automotive Diagnostics Resume (PDF)', shortcut: '⌘ A', action: () => downloadResume('auto') },
    { group: 'Actions', title: 'Copy Email Address (immanuvelstanley@gmail.com)', shortcut: '⌘ C', action: () => copyEmailToClipboard() },
    { group: 'Actions', title: 'Toggle Dark / Light Theme', shortcut: 'T', action: () => toggleTheme() },
    { group: 'Actions', title: 'Toggle Audio Synthesizer', shortcut: 'M', action: () => toggleAudio() },
    { group: 'External', title: 'Launch auratrade.in (Live Terminal)', shortcut: '↗', action: () => window.open('https://www.auratrade.in/', '_blank') },
    { group: 'External', title: 'Launch elementro.dev (Live Studio)', shortcut: '↗', action: () => window.open('https://elementro.dev', '_blank') },
    { group: 'External', title: 'Launch codeplus-two.vercel.app (Live AI Reviewer)', shortcut: '↗', action: () => window.open('https://codeplus-two.vercel.app/', '_blank') }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...commands];

  function renderList() {
    list.innerHTML = '';
    let currentGroup = '';

    filteredCommands.forEach((cmd, idx) => {
      if (cmd.group !== currentGroup) {
        currentGroup = cmd.group;
        const groupEl = document.createElement('div');
        groupEl.className = 'cmd-group-label';
        groupEl.textContent = currentGroup;
        list.appendChild(groupEl);
      }

      const item = document.createElement('li');
      item.className = `cmd-item ${idx === selectedIndex ? 'selected' : ''}`;
      item.innerHTML = `
        <div class="cmd-item-left">
          <span>${escapeHtml(cmd.title)}</span>
        </div>
        <kbd class="cmd-item-shortcut">${cmd.shortcut}</kbd>
      `;

      item.addEventListener('click', () => {
        playBlipSound(580, 0.04);
        cmd.action();
        closePalette();
      });

      list.appendChild(item);
    });

    const activeEl = list.querySelector('.cmd-item.selected');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  function openPalette() {
    backdrop.classList.add('active');
    input.value = '';
    filteredCommands = [...commands];
    selectedIndex = 0;
    renderList();
    playBlipSound(500, 0.05);
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('active');
  }

  function filter(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      filteredCommands = [...commands];
    } else {
      filteredCommands = commands.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.group.toLowerCase().includes(q) ||
        c.shortcut.toLowerCase().includes(q)
      );
    }
    selectedIndex = 0;
    renderList();
  }

  input.addEventListener('input', (e) => filter(e.target.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
      renderList();
      playBlipSound(400, 0.02);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderList();
      playBlipSound(400, 0.02);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        playBlipSound(620, 0.05);
        filteredCommands[selectedIndex].action();
        closePalette();
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openPalette);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  // Global Keyboard shortcuts: Cmd+K, Ctrl+K, or pressing '/'
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === '/' && !isEditingInput(e)) {
      e.preventDefault();
      openPalette();
    } else if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closePalette();
    }
  });

  function isEditingInput(e) {
    const tag = e.target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function downloadResume(type) {
    const file = type === 'it' 
      ? 'assets/resumes/Immanuvel_Stanley_Resume_General_IT.pdf' 
      : 'assets/resumes/Immanuvel_Stanley_Resume_Automotive.pdf';
    const a = document.createElement('a');
    a.href = file;
    a.download = file.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading ${type === 'it' ? 'General IT' : 'Automotive'} Resume`);
  }
}

/* ==========================================================================
   7. INTERACTIVE WORKBENCH (TABS & SHELL KERNEL)
   ========================================================================== */
function initWorkbench() {
  const tabs = document.querySelectorAll('.workbench-tab');
  const panes = document.querySelectorAll('.workbench-pane');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalChips = document.querySelectorAll('.terminal-chip');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playBlipSound(480, 0.03);
      const targetPane = tab.getAttribute('data-pane');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panes.forEach(p => {
        if (p.id === `pane-${targetPane}`) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    });
  });

  // Terminal commands
  if (!terminalInput || !terminalOutput) return;

  const shellCommands = {
    help: () => `
<span class="terminal-output highlight">MASTER SHELL KERNEL COMMANDS:</span>
  • <span class="terminal-output success">whoami</span>          : Executive positioning &amp; technical philosophy
  • <span class="terminal-output success">cat skills</span>      : Complete production-tested technology stack
  • <span class="terminal-output success">curl elementro</span>  : In-browser React sandbox telemetry &amp; live health
  • <span class="terminal-output success">curl auratrade</span>  : 6–25ms WebSocket tick stream status &amp; stats
  • <span class="terminal-output success">curl codeplus</span>   : Multi-model AST code review engine response
  • <span class="terminal-output success">metrics</span>         : Verified quantitative latency &amp; accuracy numbers
  • <span class="terminal-output success">contact</span>         : Direct channels, email &amp; location
  • <span class="terminal-output success">clear</span>           : Flush shell buffer
`,
    whoami: () => `
<span class="terminal-output highlight">&gt; IMMANUVEL STANLEY A</span>
Role: Full Stack Developer (B.E. Computer Science, 2026)
Location: Chennai, India (Open to Remote &amp; Worldwide Relocation)
Differentiator: High-velocity React interfaces combined with real-world electrical &amp; CAN bus diagnostics.
Signature Products: Elementro (elementro.dev) &amp; AuraTrade (60fps Canvas stock workstation).
`,
    'cat skills': () => `
<span class="terminal-output highlight">OFFICIAL IT RESUME TECH STACK:</span>
[Programming & Dev] Python, JavaScript, React.js, Next.js, HTML5/CSS3
[Databases & Model] Supabase, MySQL, MongoDB Atlas, PostgreSQL
[Tools & Concepts]  Git/GitHub Version Control, RESTful APIs, Figma (UI/UX), Agile SDLC
[Cloud, AI & Auto]  AWS Cloud, Docker, PyTorch, WebSockets, CAN Bus & OBD-II Diagnostics
`,
    'curl elementro': () => `
<span class="terminal-output highlight">&gt; GET https://elementro.dev/api/health HTTP/2</span>
<span class="terminal-output success">&lt; 200 OK (latency: 38ms)</span>
<span class="terminal-output">{
  "status": "LIVE_PRODUCTION",
  "engine": "Elementro In-Browser React Transpiler",
  "bundleSize": "114KB Gzipped",
  "transpileTime": "&lt;85ms in Dedicated Web Worker",
  "cls": 0.0,
  "lighthouseScore": 99,
  "url": "https://elementro.dev"
}</span>
`,
    'curl auratrade': () => `
<span class="terminal-output highlight">&gt; WSS /stream/ticks/nvda HTTP/1.1</span>
<span class="terminal-output success">&lt; 101 Switching Protocols (Dual-Mode WebSocket Gateway)</span>
<span class="terminal-output">{
  "terminal": "AuraTrade Institutional Workstation",
  "url": "https://www.auratrade.in/",
  "activeTickers": ["NVDA $138.80", "AAPL $232.40", "TSLA $218.42"],
  "tickRate": "6–25ms average latency",
  "chartRenderer": "HTML5 Canvas (Hardware Accelerated 60 FPS)",
  "brokerBus": "Redis Pub/Sub Multi-Channel Relay"
}</span>
`,
    'curl codeplus': () => `
<span class="terminal-output highlight">&gt; POST /api/ast/audit HTTP/2</span>
<span class="terminal-output success">&lt; 200 OK (Jest Test Suite: 36/36 Passing)</span>
<span class="terminal-output">{
  "auditResult": "ALL_QUALITY_GATES_PASSED",
  "url": "https://codeplus-two.vercel.app/",
  "cyclomaticComplexity": 3,
  "securityVulnerabilities": 0,
  "supportedModels": ["Groq Llama 3.3", "DeepSeek R1", "Claude 3.5 Sonnet", "GPT-4o"],
  "testExecutionTime": "1.42s"
}</span>
`,
    metrics: () => `
<span class="terminal-output highlight">VERIFIED QUANTITATIVE BENCHMARKS:</span>
• <span class="terminal-output success">AuraTrade:</span> 6–25ms WebSocket latency; 60fps rendering without garbage collection stutters.
• <span class="terminal-output success">Codeplus NOVA:</span> 36 passing unit/integration tests across 4 frontier LLMs.
• <span class="terminal-output success">EcogenAI:</span> -15% transit latency &amp; -20% route fuel consumption via graph heuristic.
• <span class="terminal-output success">MedVision:</span> 94.2% IoU localization accuracy across 15,000+ thoracic DICOM scans.
• <span class="terminal-output success">Elementro:</span> Zero runtime layout shifts (CLS: 0.0), instant in-browser preview.
`,
    contact: () => `
<span class="terminal-output highlight">DIRECT COMMUNICATION CHANNELS:</span>
Email: immanuvelstanley@gmail.com
LinkedIn: linkedin.com/in/immanuvel-stanley-308881271
GitHub: github.com/ImmanuvelStanley
Response Time: Guaranteed reply within 24 hours.
`
  };

  function executeCmd(cmdText) {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    playBlipSound(540, 0.02);

    // Print command line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">$</span> <span>${escapeHtml(trimmed)}</span>`;
    terminalOutput.appendChild(userLine);

    if (trimmed.toLowerCase() === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    const handler = shellCommands[trimmed.toLowerCase()];
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';

    if (handler) {
      responseLine.innerHTML = handler();
    } else {
      responseLine.innerHTML = `<span class="terminal-output" style="color:var(--accent-rose);">zsh: command not found: ${escapeHtml(trimmed)}. Type <span style="color:var(--accent-secondary)">help</span> to list commands.</span>`;
    }

    terminalOutput.appendChild(responseLine);
    const body = terminalOutput.closest('.terminal-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCmd(val);
    }
  });

  terminalChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCmd(cmd);
    });
  });
}

/* ==========================================================================
   8. LIVE STOCK TELEMETRY CANVAS (AURATRADE 60FPS ENGINE)
   ========================================================================== */
function initLiveStockCanvas() {
  const canvas = document.getElementById('stock-live-canvas');
  const priceDisplay = document.getElementById('stock-price-display');
  const latencyDisplay = document.getElementById('stock-live-latency');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let points = [];
  let basePrice = 138.80;
  const maxPoints = 50;

  // Initialize starting data points
  for (let i = 0; i < maxPoints; i++) {
    basePrice += (Math.random() - 0.48) * 0.35;
    points.push(basePrice);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  window.addEventListener('resize', resize);
  resize();

  let lastTickTime = performance.now();

  function draw() {
    const now = performance.now();
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Simulate incoming WebSocket tick every ~80ms
    if (now - lastTickTime > 80) {
      lastTickTime = now;
      const delta = (Math.random() - 0.48) * 0.42;
      basePrice = Math.max(130, Math.min(150, basePrice + delta));
      points.push(basePrice);
      if (points.length > maxPoints) points.shift();

      if (priceDisplay) {
        priceDisplay.textContent = `$${basePrice.toFixed(2)}`;
      }
      if (latencyDisplay) {
        const randLatency = Math.floor(Math.random() * 12) + 12;
        latencyDisplay.textContent = `${randLatency}ms`;
      }
    }

    ctx.clearRect(0, 0, w, h);

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 20; y < h; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (points.length < 2) {
      animationId = requestAnimationFrame(draw);
      return;
    }

    const minP = Math.min(...points) - 0.5;
    const maxP = Math.max(...points) + 0.5;
    const range = maxP - minP || 1;

    const stepX = w / (maxPoints - 1);

    // Draw Gradient Area
    ctx.beginPath();
    points.forEach((val, i) => {
      const x = i * stepX;
      const y = h - ((val - minP) / range) * (h - 30) - 15;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineTo((points.length - 1) * stepX, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(200, 155, 123, 0.28)');
    gradient.addColorStop(1, 'rgba(200, 155, 123, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Line
    ctx.beginPath();
    points.forEach((val, i) => {
      const x = i * stepX;
      const y = h - ((val - minP) / range) * (h - 30) - 15;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#C89B7B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pulsating current price head
    const lastX = (points.length - 1) * stepX;
    const lastY = h - ((points[points.length - 1] - minP) / range) * (h - 30) - 15;

    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F8F7F4';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 155, 123, 0.4)';
    ctx.fill();

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   9. DIFFERENTIAL CAN BUS OSCILLOSCOPE (HARDWARE DIAGNOSTICS)
   ========================================================================== */
function initDifferentialCANOscilloscope() {
  const canvas = document.getElementById('oscilloscope-canvas');
  const btnScan = document.getElementById('sim-scan-btn');
  const btnFault = document.getElementById('sim-fault-btn');
  const btnClear = document.getElementById('sim-clear-btn');
  const simDtc = document.getElementById('sim-dtc-val');
  const simRpm = document.getElementById('sim-rpm-val');
  const simVolt = document.getElementById('sim-volt-val');
  const simCanStatus = document.getElementById('sim-can-status');
  const simLegendVolt = document.getElementById('sim-legend-volt');
  const simLegendTerm = document.getElementById('sim-legend-term');
  const simRpmSub = document.getElementById('sim-rpm-sub');
  const simVoltSub = document.getElementById('sim-volt-sub');
  const simExplainer = document.getElementById('sim-explainer');
  const simExplainStatus = document.getElementById('sim-explain-status');
  const simExplainTitle = document.getElementById('sim-explain-title');
  const simExplainDesc = document.getElementById('sim-explain-desc');
  const scannerScreen = document.querySelector('.scanner-screen');
  const beyondCodeCard = document.getElementById('beyond-code-card');
  const ledTx = document.getElementById('led-can-tx');
  const ledRx = document.getElementById('led-can-rx');
  const meterStatus = document.getElementById('meter-status-fill');
  const meterRpm = document.getElementById('meter-rpm-fill');
  const meterVolt = document.getElementById('meter-volt-fill');
  const scopeDiffPill = document.getElementById('scope-diff-pill');
  const scopeWrap = document.getElementById('scope-wrap');
  const scopeProbeCursor = document.getElementById('scope-probe-cursor');
  const scopeProbeBadge = document.getElementById('scope-probe-badge');
  const tagProbes = document.querySelectorAll('.tech-tag-probe');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isFaulted = false;
  let isScanning = false;
  let isClearing = false;
  let isBusy = false;
  let offset = 0;
  let scanBeamX = 0;
  let rebootSweepX = 0;
  let phosphorSweepX = 0;
  let sparkFrames = 0;
  let waveAmplitudeBoost = 1.0;
  let idleFlutterTimer = null;
  let txBurstTimeout = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || canvas.clientWidth || 300;
    const h = rect.height || canvas.clientHeight || 110;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  if (window.ResizeObserver && scopeWrap) {
    new ResizeObserver(() => resize()).observe(scopeWrap);
  }
  resize();

  // Interactive Card Electromagnetic Glow Tracker
  if (beyondCodeCard) {
    beyondCodeCard.addEventListener('mousemove', (e) => {
      const rect = beyondCodeCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      beyondCodeCard.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
      beyondCodeCard.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
    });
  }

  // Audio tone generator
  let audioCtx = null;
  function getAudioCtx() {
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      if (!audioCtx) audioCtx = new AudioCtor();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function playDiagBeep(freq = 520, duration = 0.05, type = 'sine', vol = 0.035) {
    const actx = getAudioCtx();
    if (!actx) return;
    try {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + duration);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch (e) {}
  }

  // Realistic mechanical click of an automotive Bosch 12V relay
  function playRelayClick() {
    const actx = getAudioCtx();
    if (!actx) return;
    try {
      const t = actx.currentTime;
      const osc1 = actx.createOscillator();
      const gain1 = actx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, t);
      osc1.frequency.exponentialRampToValueAtTime(120, t + 0.012);
      gain1.gain.setValueAtTime(0.06, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
      osc1.connect(gain1);
      gain1.connect(actx.destination);
      osc1.start(t);
      osc1.stop(t + 0.012);

      const osc2 = actx.createOscillator();
      const gain2 = actx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(950, t + 0.016);
      osc2.frequency.exponentialRampToValueAtTime(90, t + 0.03);
      gain2.gain.setValueAtTime(0.045, t + 0.016);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc2.connect(gain2);
      gain2.connect(actx.destination);
      osc2.start(t + 0.016);
      osc2.stop(t + 0.03);
    } catch (e) {}
  }

  // Electrical arc / short-circuit crackle
  function playSparkArc() {
    const actx = getAudioCtx();
    if (!actx) return;
    try {
      const t = actx.currentTime;
      const bufferSize = Math.floor(actx.sampleRate * 0.12);
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = actx.createBufferSource();
      noise.buffer = buffer;
      const filter = actx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, t);
      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(actx.destination);
      noise.start(t);
    } catch (e) {}
  }

  // High-Speed CAN TX / RX Stochastic LED Routine
  function setLedTx(state) {
    if (!ledTx) return;
    if (state === 'error') {
      ledTx.classList.remove('active');
      ledTx.classList.add('error-locked');
    } else if (state === true) {
      ledTx.classList.remove('error-locked');
      ledTx.classList.add('active');
    } else {
      ledTx.classList.remove('active', 'error-locked');
    }
  }

  function setLedRx(state) {
    if (!ledRx) return;
    if (state === true) {
      ledRx.classList.add('active');
    } else {
      ledRx.classList.remove('active');
    }
  }

  function scheduleNextCANBurst() {
    if (isFaulted) {
      setLedTx('error');
      setLedRx(false);
      return;
    }

    const interval = isScanning ? 40 : (80 + Math.random() * 200);
    txBurstTimeout = setTimeout(() => {
      if (isFaulted) {
        setLedTx('error');
        setLedRx(false);
        return;
      }
      setLedTx(true);
      const txDur = isScanning ? 16 : 24;
      setTimeout(() => {
        setLedTx(false);
        if (!isFaulted) {
          setTimeout(() => {
            setLedRx(true);
            setTimeout(() => {
              setLedRx(false);
              scheduleNextCANBurst();
            }, isScanning ? 15 : 26);
          }, 10);
        }
      }, txDur);
    }, interval);
  }

  scheduleNextCANBurst();

  // Telemetry Micro-Meter Bar Updater
  function updateTelemetryMeters(rpm, volt, isOk = true) {
    if (meterRpm) {
      const pct = Math.min(100, Math.max(0, (rpm / 3000) * 100));
      meterRpm.style.width = `${pct.toFixed(1)}%`;
      if (rpm === 0) {
        meterRpm.style.background = '#EF4444';
      } else if (rpm > 1200) {
        meterRpm.style.background = 'linear-gradient(90deg, var(--accent-cyan), var(--accent-amber))';
      } else {
        meterRpm.style.background = 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))';
      }
    }
    if (meterVolt) {
      const pct = Math.min(100, Math.max(0, (volt / 16) * 100));
      meterVolt.style.width = `${pct.toFixed(1)}%`;
      meterVolt.style.background = isOk ? 'var(--accent-emerald)' : '#EF4444';
    }
    if (meterStatus) {
      meterStatus.style.background = isOk ? 'var(--accent-emerald)' : '#EF4444';
    }
  }

  // Living Engine Idle Micro-Flutter Loop
  function startIdleMicroFlutter() {
    if (idleFlutterTimer) clearInterval(idleFlutterTimer);
    idleFlutterTimer = setInterval(() => {
      if (isFaulted || isScanning || isClearing || isBusy) return;

      const rpmJitter = Math.floor(Math.random() * 7) - 3;
      const currentRpm = 820 + rpmJitter;
      if (simRpm) simRpm.textContent = currentRpm;

      const voltJitter = (Math.floor(Math.random() * 7) - 3) * 0.01;
      const currentVolt = (14.20 + voltJitter).toFixed(2);
      if (simVolt) simVolt.textContent = currentVolt;

      updateTelemetryMeters(currentRpm, parseFloat(currentVolt), true);
    }, 180);
  }

  startIdleMicroFlutter();

  // Draw simulated CAN-H (3.5V) and CAN-L (1.5V) square waves with CRT Phosphor Glow
  function drawWaveform() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle phosphor grid lines
    ctx.strokeStyle = isFaulted ? 'rgba(78, 19, 19, 0.45)' : 'rgba(19, 78, 74, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Offset speed based on network state
    if (isScanning) {
      offset += 6.8;
    } else if (isFaulted) {
      offset += 0.2;
    } else {
      offset += 2.6 * waveAmplitudeBoost;
    }

    // Phosphor sweep line (CRT electron trigger beam)
    phosphorSweepX = (phosphorSweepX + (isScanning ? 4.5 : 2.0)) % w;
    const sweepGrad = ctx.createLinearGradient(phosphorSweepX - 25, 0, phosphorSweepX, 0);
    sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    sweepGrad.addColorStop(1, isFaulted ? 'rgba(239, 68, 68, 0.12)' : 'rgba(56, 189, 248, 0.14)');
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(Math.max(0, phosphorSweepX - 25), 0, 25, h);

    // Spark / Glitch flash effect when fault happens
    if (sparkFrames > 0) {
      sparkFrames--;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.18 + Math.random() * 0.25})`;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * h);
      for (let x = 0; x < w; x += 18) {
        ctx.lineTo(x, Math.random() * h);
      }
      ctx.stroke();
    }

    if (isFaulted && sparkFrames === 0) {
      // CAN-H collapsed to ground with high-frequency noise
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#EF4444';
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const jitter = (Math.random() - 0.5) * 4;
        const y = h - 14 + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // CAN-L corrupted low line
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#F59E0B';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let x = 0; x < w; x += 3) {
        const jitter = (Math.random() - 0.5) * 2;
        const y = h - 26 + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // On-canvas HUD warning badge
      ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.lineWidth = 1;
      const bw = Math.min(270, w - 20);
      ctx.fillRect((w - bw) / 2, h / 2 - 13, bw, 26);
      ctx.strokeRect((w - bw) / 2, h / 2 - 13, bw, 26);

      ctx.fillStyle = '#EF4444';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ALERT] BUS-OFF // SHORT TO GND (ΔV=0V)', w / 2, h / 2);
      ctx.textAlign = 'start';
    } else {
      // Nominal high-speed differential square waves with CRT Phosphor Glow
      const centerY = h / 2;
      const bitWidth = isScanning ? 16 : 24;

      function getBitState(xPos) {
        const bitIndex = Math.floor((xPos + offset) / bitWidth);
        return (Math.sin(bitIndex * 1.7) > 0.08) ? 1 : 0;
      }

      // CAN-H (cyan, dominant 3.5V, recessive 2.5V)
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#38BDF8';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const bit = getBitState(x);
        const y = bit === 1 ? centerY - 28 : centerY - 7;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // CAN-L (amber, dominant 1.5V, recessive 2.5V)
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#FBBF24';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const bit = getBitState(x);
        const y = bit === 1 ? centerY + 28 : centerY + 7;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanning radar sweep beam
      if (isScanning) {
        scanBeamX = (scanBeamX + 3.8) % w;
        const grad = ctx.createLinearGradient(scanBeamX - 35, 0, scanBeamX, 0);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(Math.max(0, scanBeamX - 35), 0, 35, h);

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scanBeamX, 0);
        ctx.lineTo(scanBeamX, h);
        ctx.stroke();
      }

      // Clearing reboot sweep beam
      if (isClearing) {
        rebootSweepX = Math.min(w, rebootSweepX + 5);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.22)';
        ctx.fillRect(0, 0, rebootSweepX, h);

        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(rebootSweepX, 0);
        ctx.lineTo(rebootSweepX, h);
        ctx.stroke();
      }
    }

    requestAnimationFrame(drawWaveform);
  }

  drawWaveform();

  // Interactive Oscilloscope Logic Probe Cursor Tracking
  if (scopeWrap && scopeProbeCursor && scopeProbeBadge) {
    scopeWrap.addEventListener('mousemove', (e) => {
      const rect = scopeWrap.getBoundingClientRect();
      const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      scopeProbeCursor.style.left = `${mouseX}px`;

      const tMs = ((mouseX / rect.width) * 4.0).toFixed(2);
      if (isFaulted) {
        scopeProbeBadge.textContent = `t: +${tMs}ms | SHORT: 0.02V | ΔV: 0V`;
        scopeProbeBadge.style.borderColor = '#EF4444';
        scopeProbeBadge.style.color = '#EF4444';
      } else {
        const bit = (Math.sin(Math.floor((mouseX + offset) / 24) * 1.7) > 0.08) ? 1 : 0;
        if (bit === 1) {
          scopeProbeBadge.textContent = `t: +${tMs}ms | DOMINANT (3.5V / 1.5V) | ΔV: 2.0V`;
          scopeProbeBadge.style.borderColor = 'var(--accent-cyan)';
          scopeProbeBadge.style.color = '#38BDF8';
        } else {
          scopeProbeBadge.textContent = `t: +${tMs}ms | RECESSIVE (2.5V / 2.5V) | ΔV: 0.0V`;
          scopeProbeBadge.style.borderColor = 'var(--accent-amber)';
          scopeProbeBadge.style.color = '#F59E0B';
        }
      }
    });
  }

  // Interactive Diagnostic Test Pin Tag Micro-Interactions
  tagProbes.forEach((tag) => {
    tag.addEventListener('mouseenter', () => {
      playRelayClick();
      const signal = tag.getAttribute('data-signal');
      if (signal === 'waveform') {
        waveAmplitudeBoost = 1.8;
        setTimeout(() => { waveAmplitudeBoost = 1.0; }, 600);
      } else if (signal === 'can') {
        if (scopeDiffPill) {
          scopeDiffPill.style.transform = 'scale(1.15)';
          scopeDiffPill.style.borderColor = 'var(--color-brand-accent)';
          setTimeout(() => {
            scopeDiffPill.style.transform = '';
            scopeDiffPill.style.borderColor = '';
          }, 500);
        }
      } else if (signal === 'obd') {
        setLedTx(true);
        setTimeout(() => {
          setLedTx(false);
          setLedRx(true);
          setTimeout(() => setLedRx(false), 80);
        }, 60);
      }
    });
  });

  // 1. OPTION 1: RUN SCAN
  if (btnScan) {
    btnScan.addEventListener('click', () => {
      if (isBusy) return;
      isBusy = true;
      isScanning = true;
      scanBeamX = 0;

      playRelayClick();
      btnScan.classList.add('btn-active-scan');
      btnScan.disabled = true;
      if (scannerScreen) scannerScreen.classList.add('screen-scanning');
      if (simDtc) {
        simDtc.className = 'status-pill status-scanning';
        simDtc.textContent = 'Scanning...';
      }
      if (simExplainer) simExplainer.className = 'scanner-explainer-card explain-scan';
      if (simExplainStatus) simExplainStatus.textContent = 'Health Scan in Progress';

      playDiagBeep(520, 0.06);

      const steps = isFaulted ? [
        { t: 0, status: 'Polling 0x7DF Broadcast...', title: 'Checking Vehicle Network Health...', desc: 'The scanner is sending a broadcast query to test communication across all vehicle microcontrollers.', freq: 440 },
        { t: 500, status: 'Polling 0x7E8 (Engine Control)...', title: 'ECM Engine Computer: Timeout Alert!', desc: 'The engine control module failed to answer because CAN-H is clamped to 0V ground.', freq: 320 },
        { t: 1000, status: 'Polling 0x7E9 (Transmission)...', title: 'TCM Gearbox Computer: Timeout Alert!', desc: 'Transmission controller cannot transmit frames due to bus-off error status.', freq: 300 },
        { t: 1500, status: 'Bus-Off // Ground Short Confirmed', title: 'Scan Confirmed: Wire Shorted to Ground', desc: 'Failure confirmed: The communication wire is shorted directly to chassis metal (0V). Click "Clear DTC" to simulate repairing the wire.', freq: 240 }
      ] : [
        { t: 0, status: 'Polling 0x7DF Broadcast...', title: 'Step 1: Polling All Vehicle ECUs...', desc: 'The scanner is asking every onboard computer (Engine, Transmission, Brakes) to verify health.', freq: 440, rpm: '820', volt: '14.20' },
        { t: 450, status: '0x7E8 (Engine ECM) OK', title: 'ECM Engine Controller: Verified Healthy', desc: 'Engine computer replied in 1.4ms with 0 fault codes. Throttle revs to test alternator load capacity.', freq: 520, rpm: '1240', volt: '14.35', rpmSub: 'Alt Load Test' },
        { t: 900, status: '0x7E9 (Gearbox TCM) OK', title: 'TCM Transmission Computer: Verified Healthy', desc: 'Gearbox controller responded nominal. Solenoids, clutch line pressure, and fluid temperatures are optimal.', freq: 620, rpm: '1850', volt: '14.48', rpmSub: 'Alt Load Test' },
        { t: 1350, status: '0x7EA (Brakes ABS) OK', title: 'ABS & Stability Control: Verified Healthy', desc: 'All 4 wheel speed sensors and electronic brake control units are synchronized with zero latency.', freq: 740, rpm: '1120', volt: '14.30', rpmSub: 'Settling...' },
        { t: 1800, status: '500 kbps CAN Network Synced', title: 'All 14 Vehicle Computers Passed Health Inspection', desc: 'Diagnostic sweep completed with 100% success. Zero trouble codes are present. High-speed 500 kbps differential signals are transmitting clean data.', freq: 880, rpm: '820', volt: '14.20', rpmSub: 'Idle OK', voltSub: 'Alternator OK' }
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          if (simCanStatus) simCanStatus.textContent = step.status;
          if (simExplainTitle) simExplainTitle.textContent = step.title;
          if (simExplainDesc) simExplainDesc.textContent = step.desc;
          if (step.rpm && simRpm) simRpm.textContent = step.rpm;
          if (step.volt && simVolt) simVolt.textContent = step.volt;
          if (step.rpmSub && simRpmSub) simRpmSub.textContent = step.rpmSub;
          if (step.voltSub && simVoltSub) simVoltSub.textContent = step.voltSub;
          if (step.rpm && step.volt) {
            updateTelemetryMeters(parseInt(step.rpm, 10), parseFloat(step.volt), !isFaulted);
          }
          playDiagBeep(step.freq, 0.05, 'sine');

          if (idx === steps.length - 1) {
            isScanning = false;
            isBusy = false;
            btnScan.disabled = false;
            btnScan.classList.remove('btn-active-scan');
            if (scannerScreen) scannerScreen.classList.remove('screen-scanning');

            if (isFaulted) {
              if (simDtc) {
                simDtc.className = 'status-pill status-fault';
                simDtc.textContent = 'U0100 • Critical Error';
              }
              showToast('Scan Alert: Ground short on CAN line. Node communication stalled.');
            } else {
              if (simDtc) {
                simDtc.className = 'status-pill status-healthy';
                simDtc.textContent = 'P0000 • Healthy';
              }
              if (simExplainer) simExplainer.className = 'scanner-explainer-card explain-recovery';
              if (simExplainStatus) simExplainStatus.textContent = 'Health Scan: Nominal';
              playDiagBeep(1046, 0.1, 'sine');
              showToast('OBD-II Deep Scan Completed: 14 ECUs nominal. 0 trouble codes.');
            }
          }
        }, step.t);
      });
    });
  }

  // 2. OPTION 2: INJECT SHORT
  if (btnFault) {
    btnFault.addEventListener('click', () => {
      if (isBusy) return;

      if (isFaulted) {
        sparkFrames = 8;
        playSparkArc();
        playDiagBeep(180, 0.12, 'sawtooth', 0.08);
        showToast('CAN-H short is already active (0V Ground). Click "Clear DTC" to restore.');
        return;
      }

      isFaulted = true;
      sparkFrames = 10;
      playRelayClick();
      playSparkArc();

      if (scannerScreen) {
        scannerScreen.classList.add('screen-faulted');
        scannerScreen.classList.remove('screen-scanning', 'screen-clearing');
      }
      if (beyondCodeCard) {
        beyondCodeCard.classList.add('card-faulted');
      }
      btnFault.classList.add('btn-active-fault');

      setLedTx('error');
      setLedRx(false);

      if (simDtc) {
        simDtc.className = 'status-pill status-fault';
        simDtc.textContent = 'U0100 • Critical Error';
      }
      if (simCanStatus) {
        simCanStatus.textContent = 'BUS-OFF // CAN-H Shorted to GND';
      }
      if (scopeDiffPill) {
        scopeDiffPill.className = 'scope-ch ch-diff diff-fault';
        scopeDiffPill.textContent = 'ΔV: 0.0V (Short-Circuit)';
      }

      // Dynamic engine stumble animation (820 -> 580 -> 290 -> 0 RPM)
      if (simRpm) simRpm.textContent = '580';
      if (simRpmSub) {
        simRpmSub.className = 'telemetry-subtag subtag-red';
        simRpmSub.textContent = 'Misfire';
      }
      if (simVolt) simVolt.textContent = '11.8';
      if (simVoltSub) {
        simVoltSub.className = 'telemetry-subtag subtag-red';
        simVoltSub.textContent = 'Battery Float';
      }
      updateTelemetryMeters(580, 11.8, false);

      setTimeout(() => {
        if (!isFaulted) return;
        if (simRpm) simRpm.textContent = '290';
        if (simRpmSub) simRpmSub.textContent = 'Stall Hazard';
        if (simVolt) simVolt.textContent = '6.4';
        updateTelemetryMeters(290, 6.4, false);
      }, 160);

      setTimeout(() => {
        if (!isFaulted) return;
        if (simRpm) simRpm.textContent = '0';
        if (simRpmSub) simRpmSub.textContent = 'Stalled';
        if (simVolt) simVolt.textContent = '0.24';
        if (simVoltSub) simVoltSub.textContent = 'Short to GND';
        updateTelemetryMeters(0, 0.24, false);
      }, 350);

      if (simLegendVolt) {
        simLegendVolt.textContent = 'Differential: 0.0V (Signal Flatlined)';
        simLegendVolt.style.color = '#EF4444';
      }
      if (simLegendTerm) {
        simLegendTerm.textContent = 'Termination: 0.4Ω Short';
        simLegendTerm.style.color = '#EF4444';
      }

      // Update Plain-English Explainer Card
      if (simExplainer) simExplainer.className = 'scanner-explainer-card explain-fault';
      if (simExplainStatus) simExplainStatus.textContent = 'Fault Injected: Wire Pinched';
      if (simExplainTitle) simExplainTitle.textContent = 'What Happened: Communication Wire Shorted to Metal Body';
      if (simExplainDesc) {
        simExplainDesc.textContent = 'In vehicles, when a wiring harness rubs against metal, the 3.5V CAN-H wire grounds out to 0V. The voltage wave flatlines, computer packets freeze, the engine stalls, and trouble code U0100 is triggered.';
      }

      showToast('Critical Fault Injected: CAN-H shorted to ground (0V). Engine stalled.');
    });
  }

  // 3. OPTION 3: CLEAR DTC
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (isBusy) return;

      if (!isFaulted) {
        playRelayClick();
        playDiagBeep(650, 0.05, 'triangle');
        if (simExplainTitle) simExplainTitle.textContent = 'Memory Polled: No Faults Stored in ECUs';
        if (simExplainDesc) {
          simExplainDesc.textContent = 'The diagnostic trouble code register is completely empty. All computers are in normal operating state with zero pending error codes.';
        }
        showToast('DTC buffer checked: System already clean and nominal.');
        return;
      }

      isBusy = true;
      isClearing = true;
      rebootSweepX = 0;

      playRelayClick();
      btnClear.classList.add('btn-active-clear');
      btnClear.disabled = true;
      if (scannerScreen) {
        scannerScreen.classList.remove('screen-faulted');
        scannerScreen.classList.add('screen-clearing');
      }
      if (beyondCodeCard) {
        beyondCodeCard.classList.remove('card-faulted');
      }

      playDiagBeep(480, 0.08, 'triangle');

      // Starter crank sequence & network recovery
      const recoverySteps = [
        { t: 0, status: 'Broadcasting Mode $04 Clear...', title: 'Step 1: Erasing Error Codes from Memory', desc: 'The scan tool sent standard Mode $04 commands instructing all computer chips to wipe fault registers.', freq: 520, rpm: '0', volt: '12.2', rpmSub: 'Rebooting', voltSub: 'Battery Float' },
        { t: 450, status: 'Releasing Short & Restoring 2.5V...', title: 'Step 2: Wire Short Released & Line Biasing Restored', desc: 'The physical ground short was disconnected. Transceivers restored the nominal 2.5V differential resting voltage.', freq: 580, rpm: '240', volt: '12.8', rpmSub: 'Starter Cranking', voltSub: '12V Cranking' },
        { t: 900, status: 'Cranking Engine & Syncing 500 kbps...', title: 'Step 3: Engine Cranked & Network Re-Synchronized', desc: 'The starter motor ignited combustion, alternator kicked in, and transceivers locked back into 500,000 bits/sec sync.', freq: 680, rpm: '1120', volt: '13.8', rpmSub: 'Ignition Flare', voltSub: 'Charging' },
        { t: 1400, status: '500 kbps CAN Network Synced', title: 'Network Healthy: All Vehicle Computers Running Smoothly', desc: 'Trouble code U0100 is completely resolved. The green and yellow wave lines show healthy differential signals transferring sensor data at 500,000 bits/sec. Engine idle stabilized at 820 RPM.', freq: 880, rpm: '820', volt: '14.20', rpmSub: 'Idle OK', voltSub: 'Alternator OK' }
      ];

      recoverySteps.forEach((step, idx) => {
        setTimeout(() => {
          if (simCanStatus) simCanStatus.textContent = step.status;
          if (simExplainTitle) simExplainTitle.textContent = step.title;
          if (simExplainDesc) simExplainDesc.textContent = step.desc;
          if (step.rpm && simRpm) simRpm.textContent = step.rpm;
          if (step.volt && simVolt) simVolt.textContent = step.volt;
          if (step.rpmSub && simRpmSub) {
            simRpmSub.className = 'telemetry-subtag subtag-blue';
            simRpmSub.textContent = step.rpmSub;
          }
          if (step.voltSub && simVoltSub) {
            simVoltSub.className = 'telemetry-subtag subtag-blue';
            simVoltSub.textContent = step.voltSub;
          }
          if (step.rpm && step.volt) {
            updateTelemetryMeters(parseInt(step.rpm, 10), parseFloat(step.volt), true);
          }
          playDiagBeep(step.freq, 0.06, 'sine');

          if (idx === recoverySteps.length - 1) {
            isFaulted = false;
            isClearing = false;
            isBusy = false;
            btnClear.disabled = false;
            btnClear.classList.remove('btn-active-clear');
            if (scannerScreen) scannerScreen.classList.remove('screen-clearing');
            if (btnFault) btnFault.classList.remove('btn-active-fault');

            if (simDtc) {
              simDtc.className = 'status-pill status-healthy';
              simDtc.textContent = 'P0000 • Healthy';
            }
            if (simRpmSub) {
              simRpmSub.className = 'telemetry-subtag subtag-green';
              simRpmSub.textContent = 'Idle OK';
            }
            if (simVoltSub) {
              simVoltSub.className = 'telemetry-subtag subtag-green';
              simVoltSub.textContent = 'Alternator OK';
            }
            if (scopeDiffPill) {
              scopeDiffPill.className = 'scope-ch ch-diff';
              scopeDiffPill.textContent = 'ΔV: 2.0V (Dominant)';
            }
            if (simLegendVolt) {
              simLegendVolt.textContent = 'Differential: 2.0V ΔV (Nominal)';
              simLegendVolt.style.color = '';
            }
            if (simLegendTerm) {
              simLegendTerm.textContent = '120Ω Terminated';
              simLegendTerm.style.color = '';
            }
            if (simExplainer) simExplainer.className = 'scanner-explainer-card explain-recovery';
            if (simExplainStatus) simExplainStatus.textContent = 'System Restored & Healthy';

            scheduleNextCANBurst();
            playDiagBeep(1046, 0.12, 'sine');
            showToast('DTC cleared. Ground clamp removed. Differential square wave restored.');
          }
        }, step.t);
      });
    });
  }
}

/* ==========================================================================
   10. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const flagshipCard = document.querySelector('.project-flagship-card');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBlipSound(500, 0.03);
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      // Filter flagship card (Elementro)
      if (flagshipCard) {
        const cat = flagshipCard.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat.includes(filterVal)) {
          flagshipCard.style.display = 'grid';
        } else {
          flagshipCard.style.display = 'none';
        }
      }

      // Filter secondary project cards
      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cardCat.includes(filterVal)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   11. COMPREHENSIVE CASE STUDY DATA & MODAL ENGINE
   ========================================================================== */
const projectCaseStudies = {
  elementro: {
    title: "Elementro — In-Browser React Component Sandbox",
    badge: "Live at elementro.dev • <85ms Transpilation",
    category: "In-Browser React Playground & Sandbox",
    cover: "assets/images/elementro.jpg",
    metrics: [
      { label: "Compilation Latency", value: "<85ms" },
      { label: "Client Bundle Size", value: "114 KB" },
      { label: "Cumulative Layout Shift", value: "0.00" }
    ],
    problem: "Novice frontend engineers and design system teams frequently struggle with sluggish local development setups when tweaking small React components or verifying CSS grid edge-cases. Existing heavy cloud sandboxes take 15+ seconds to spin up containerized VMs and consume heavy RAM.",
    solution: "Architected a dedicated in-browser transpilation pipeline leveraging Web Workers and a custom AST parser. Component code is transformed off the main thread with zero DOM blocking, executing immediately inside a sandboxed iframe with strict postMessage communication.",
    architecture: `
      <div style="background:var(--bg-primary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.8rem;margin:1rem 0;line-height:1.7;">
        Editor (Monaco) ──&gt; Dedicated WebWorker ──&gt; Babel Standalone Transpiler ──&gt; Sandboxed &lt;iframe&gt; Virtual DOM ──&gt; Live Error Boundary
      </div>
    `,
    stack: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Web Workers", "Monaco Editor"],
    github: "https://github.com/ImmanuvelStanley",
    live: "https://elementro.dev"
  },
  auratrade: {
    title: "AuraTrade — Real-Time Stock Market & Paper Trading Workstation",
    badge: "Dual-Mode WebSockets • 6–25ms Latency",
    category: "Live Stock Market & Paper Trading Workstation",
    cover: "assets/images/auratrade.jpg",
    metrics: [
      { label: "Live Tick Latency", value: "6–25ms" },
      { label: "Rendering Rate", value: "60 FPS Canvas" },
      { label: "Market Coverage", value: "US, NSE & Bullion" }
    ],
    problem: "Retail traders require sub-second market data without expensive terminal subscription fees. Most web platforms suffer from WebSocket reconnection dropouts, memory leaks in SVG charts, and desynced ticker states during volatile news events.",
    solution: "Designed an event-driven microservices architecture using Redis Pub/Sub channels to distribute live tick data to connected clients over a dual-mode WebSocket gateway. Replaced bulky SVG charting with a hardware-accelerated HTML5 Canvas pipeline capable of sustaining 60fps renders during market spikes.",
    architecture: `
      <div style="background:var(--bg-primary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.8rem;margin:1rem 0;line-height:1.7;">
        Market Data Ingestion ──&gt; Redis Pub/Sub Cluster ──&gt; Node.js Socket.IO Gateway ──&gt; Hardware Canvas Render Engine ──&gt; AI Auto-Predictor
      </div>
    `,
    stack: ["React 19", "Node.js", "Socket.IO", "Redis Pub/Sub", "MongoDB", "HTML5 Canvas API"],
    github: "https://github.com/ImmanuvelStanley/Auratrade",
    live: "https://www.auratrade.in/"
  },
  codeplus: {
    title: "Codeplus NOVA — Multi-Model AI Code Review & Security Suite",
    badge: "36 Passing Tests • AST Cyclomatic Engine",
    category: "AI Code Review & Security Auditor",
    cover: "assets/images/codeplus.jpg",
    metrics: [
      { label: "Automated Tests", value: "36 / 36 Passing" },
      { label: "Inference Speed", value: "680 tokens/sec" },
      { label: "OWASP Coverage", value: "Top 10 Rules" }
    ],
    problem: "Traditional static linters only catch syntax flaws, while generic LLM wrappers hallucinate line numbers and produce inconsistent review reports without deterministic metric anchors.",
    solution: "Created an automated code auditor combining Babel AST graph parsing with a multi-model fallback chain (Groq Llama 3.3, DeepSeek R1, and Claude 3.5). The system calculates exact cyclomatic complexity and scans for OWASP vulnerabilities before passing the context to LLMs for targeted remediation.",
    architecture: `
      <div style="background:var(--bg-primary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.8rem;margin:1rem 0;line-height:1.7;">
        Source Code ──&gt; Babel AST Parser (Cyclomatic Complexity) ──&gt; OWASP Gate ──&gt; Groq / DeepSeek R1 Engine ──&gt; Markdown Review Report
      </div>
    `,
    stack: ["React 19", "Node.js", "Groq API", "DeepSeek R1", "Claude 3.5", "Jest", "TypeScript"],
    github: "https://github.com/ImmanuvelStanley/CODEPLUS",
    live: "https://codeplus-two.vercel.app/"
  },
  ecogenai: {
    title: "EcogenAI — Fleet Logistics & Route Optimization Engine",
    badge: "-15% Delivery Latency • Graph Optimization",
    category: "Smart Fleet Route & Fuel Optimizer",
    cover: "assets/images/ecogenai.jpg",
    metrics: [
      { label: "Transit Time Reduction", value: "-15%" },
      { label: "Fuel Savings", value: "-20%" },
      { label: "API Response Latency", value: "120ms" }
    ],
    problem: "Urban delivery fleets experience escalating fuel expenditures and delivery bottlenecks due to static route scheduling that ignores live traffic variance and truck payload constraints.",
    solution: "Built a FastAPI microservice integrating Dijkstra-based topological pathfinding with a lightweight neural net trained on historical congestion data. Routes are dynamically recomputed in under 120ms, producing verified 15% delivery time gains and 20% carbon emissions savings.",
    architecture: `
      <div style="background:var(--bg-primary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.8rem;margin:1rem 0;line-height:1.7;">
        Fleet Telemetry &amp; Traffic Feed ──&gt; Graph Network Modeler ──&gt; Dynamic Heuristic Solver ──&gt; FastAPI Async Endpoints ──&gt; Fleet Mobile Dashboard
      </div>
    `,
    stack: ["FastAPI", "Python 3.12", "PyTorch", "Graph Theory", "Docker", "PostgreSQL"],
    github: "https://github.com/ImmanuvelStanley/EcogenAI",
    live: "#"
  },
  medvision: {
    title: "MedVision — AI Chest X-Ray Diagnostics with Grad-CAM",
    badge: "94.2% IoU • 15,000+ DICOM Scans",
    category: "AI Chest X-Ray Diagnostic Assistant",
    cover: "assets/images/medvision.jpg",
    metrics: [
      { label: "Localization Accuracy", value: "94.2% IoU" },
      { label: "Inference Latency", value: "240ms on GPU" },
      { label: "Dataset Processed", value: "15,000+ DICOM Scans" }
    ],
    problem: "Radiologists process hundreds of high-resolution chest radiographs daily, causing diagnostic fatigue and potential delay in identifying early-stage lung consolidations and micro-nodules.",
    solution: "Developed an end-to-end computer vision pipeline using transfer learning (ResNet-50 / EfficientNet) with Grad-CAM neural attention overlays, allowing clinicians to instantly review localized heatmaps of suspicious regions.",
    architecture: `
      <div style="background:var(--bg-primary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.8rem;margin:1rem 0;line-height:1.7;">
        DICOM Ingestion &amp; Preprocessing ──&gt; CNN Feature Extractor ──&gt; Grad-CAM Heatmap Generation ──&gt; FastAPI DICOM REST API &amp; Web Viewer
      </div>
    `,
    stack: ["Python", "PyTorch", "OpenCV", "FastAPI", "Grad-CAM", "NumPy", "Docker"],
    github: "https://github.com/ImmanuvelStanley",
    live: "#"
  }
};

function initCaseStudyModals() {
  const modalOverlay = document.getElementById('case-study-modal');
  const modalBody = document.getElementById('modal-case-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const viewBtns = document.querySelectorAll('.view-case-study-btn');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.getAttribute('data-slug');
      openCaseStudyBySlug(slug);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

function openCaseStudyBySlug(slug) {
  const modalOverlay = document.getElementById('case-study-modal');
  const modalBody = document.getElementById('modal-case-body');
  if (!modalOverlay || !modalBody) return;

  const data = projectCaseStudies[slug];
  if (!data) return;

  playBlipSound(540, 0.04);

  modalBody.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <span class="badge badge-cyan" style="margin-bottom:0.75rem;">${escapeHtml(data.badge)}</span>
      <h2 style="font-size:1.75rem;margin-bottom:0.5rem;color:var(--text-primary);">${escapeHtml(data.title)}</h2>
      <p style="color:var(--accent-secondary);font-family:var(--font-mono);font-size:0.875rem;">${escapeHtml(data.category)}</p>
    </div>

    <div style="width:100%;aspect-ratio:16/9;max-height:300px;border-radius:var(--radius-md);overflow:hidden;margin-bottom:2rem;background:#000;border:1px solid var(--border-subtle);">
      <img src="${data.cover}" alt="${escapeHtml(data.title)}" style="width:100%;height:100%;object-fit:cover;">
    </div>

    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:1rem;margin-bottom:2rem;">
      ${data.metrics.map(m => `
        <div style="background:var(--bg-primary);border:1px solid var(--border-subtle);padding:1rem;border-radius:var(--radius-md);text-align:center;">
          <div style="font-family:var(--font-heading);font-size:1.35rem;font-weight:700;color:var(--accent-secondary);">${escapeHtml(m.value)}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem;">${escapeHtml(m.label)}</div>
        </div>
      `).join('')}
    </div>

    <div style="margin-bottom:1.75rem;">
      <h3 style="font-size:1.15rem;margin-bottom:0.6rem;color:var(--text-primary);">The Engineering Problem</h3>
      <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;">${escapeHtml(data.problem)}</p>
    </div>

    <div style="margin-bottom:1.75rem;">
      <h3 style="font-size:1.15rem;margin-bottom:0.6rem;color:var(--text-primary);">Solution &amp; Implementation</h3>
      <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;">${escapeHtml(data.solution)}</p>
    </div>

    <div style="margin-bottom:2rem;">
      <h3 style="font-size:1.15rem;margin-bottom:0.6rem;color:var(--text-primary);">System Architecture</h3>
      ${data.architecture}
    </div>

    <div style="margin-bottom:2rem;">
      <h3 style="font-size:1.15rem;margin-bottom:0.6rem;color:var(--text-primary);">Technology Stack</h3>
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
        ${data.stack.map(s => `<span class="tech-tag">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:1rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);flex-wrap:wrap;">
      ${data.live !== '#' ? `
        <a href="${data.live}" target="_blank" rel="noopener noreferrer" class="ui-button ui-button-primary btn-sm">
          <span class="ui-button-text-wrap">
            <span class="ui-button-text-default">Launch Application</span>
            <span class="ui-button-text-hover">Visit Live Studio ↗</span>
          </span>
        </a>` : ''}
      <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="ui-button ui-button-secondary btn-sm">
        <span class="ui-button-text-wrap">
          <span class="ui-button-text-default">Inspect GitHub Repo</span>
          <span class="ui-button-text-hover">View Source Code &rarr;</span>
        </span>
      </a>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   12. RESUME MODAL HANDLER
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close-btn');
  const openBtns = document.querySelectorAll('.open-resume-modal-btn');
  const tabBtns = document.querySelectorAll('.resume-tab-btn');
  const panels = document.querySelectorAll('.resume-frame-panel');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBlipSound(500, 0.04);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBlipSound(480, 0.03);
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-resume');

      panels.forEach(panel => {
        if (panel.getAttribute('data-panel') === target) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   13. CONTACT FORM HANDLER & INSTANT BACKGROUND DELIVERER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const submitBtn = document.getElementById('submit-enquiry-btn') || (form ? form.querySelector('button[type="submit"]') : null);

  const ownerEmail = 'immanuvelstanley@gmail.com';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      playBlipSound(620, 0.05);

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value : 'General Conversation';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal || !emailVal || !messageVal) {
        showToast('Please fill out all required fields before sending.');
        if (!nameVal && nameInput) nameInput.focus();
        else if (!emailVal && emailInput) emailInput.focus();
        else if (!messageVal && messageInput) messageInput.focus();
        return;
      }

      const emailSubject = `[Portfolio Enquiry] ${subjectVal} from ${nameVal}`;
      const originalHtml = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.innerHTML = `
          <span class="ui-button-text-wrap">
            <span class="ui-button-text-default">Sending Message...</span>
            <span class="ui-button-text-hover">Delivering to Immanuvel...</span>
          </span>
        `;
        submitBtn.disabled = true;
      }

      // ============================================================================
      // AD-FREE DIRECT EMAIL (EmailJS)
      // Provides 100% control over the email HTML table: modern fonts & ZERO sponsor ads!
      // Sign up free at https://www.emailjs.com (takes 1 min) and enter credentials:
      // ============================================================================
      const EMAILJS_CONFIG = {
        serviceId: 'service_83sfj9i',
        templateId: 'template_gzvcsyn',
        publicKey: 'xg4j8v9Zazc16qDWn'
      };

      let fetchPromise;
      if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey.trim() !== '') {
        // Send via EmailJS (100% Ad-Free, custom HTML table with modern fonts)
        fetchPromise = fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            service_id: EMAILJS_CONFIG.serviceId.trim(),
            template_id: EMAILJS_CONFIG.templateId.trim(),
            user_id: EMAILJS_CONFIG.publicKey.trim(),
            template_params: {
              name: nameVal,
              email: emailVal,
              inquiry_type: subjectVal,
              message: messageVal,
              subject: emailSubject
            }
          })
        }).then(res => {
          if (!res.ok) throw new Error('EmailJS dispatch failed');
          return res;
        });
      } else {
        // Fallback: FormSubmit table format
        const formData = new FormData();
        formData.append('name', nameVal);
        formData.append('email', emailVal);
        formData.append('inquiry_type', subjectVal);
        formData.append('message', messageVal);
        formData.append('_subject', emailSubject);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table'); // User's requested table format

        fetchPromise = fetch(`https://formsubmit.co/${ownerEmail}`, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 4000)
      );

      try {
        await Promise.race([fetchPromise, timeoutPromise]);
        
        // Success state
        playBlipSound(740, 0.06);
        if (submitBtn) {
          submitBtn.innerHTML = `
            <span class="ui-button-text-wrap">
              <span class="ui-button-text-default">✓ Message Delivered!</span>
              <span class="ui-button-text-hover">Delivered to Immanuvel</span>
            </span>
          `;
          submitBtn.style.background = 'var(--accent-emerald)';
          submitBtn.style.borderColor = 'var(--accent-emerald)';
          submitBtn.style.color = '#FFFFFF';
        }

        showToast(`✓ Message sent successfully! Delivered directly to ${ownerEmail}.`);
        form.reset();
      } catch (err) {
        // Fallback to mailto if offline or network blocks connection
        const mailtoUrl = `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
          `Hi Immanuvel,\n\nName: ${nameVal}\nEmail: ${emailVal}\nInquiry: ${subjectVal}\n\nMessage:\n${messageVal}`
        )}`;
        window.location.href = mailtoUrl;

        if (submitBtn) {
          submitBtn.innerHTML = `
            <span class="ui-button-text-wrap">
              <span class="ui-button-text-default">✓ Opening Mail Client...</span>
              <span class="ui-button-text-hover">Send via email app</span>
            </span>
          `;
        }
        showToast('Opened your mail app to ensure immediate delivery.');
      } finally {
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalHtml;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.color = '';
            submitBtn.disabled = false;
          }
        }, 4500);
      }
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyEmailToClipboard();
    });
  }

  initCustomSelect();
}

function initCustomSelect() {
  const selectWrap = document.getElementById('custom-inquiry-select');
  if (!selectWrap) return;

  const trigger = selectWrap.querySelector('.custom-select-trigger');
  const displayText = selectWrap.querySelector('.custom-select-text');
  const displayDot = selectWrap.querySelector('.custom-select-display .select-option-dot');
  const dropdown = selectWrap.querySelector('.custom-select-dropdown');
  const options = selectWrap.querySelectorAll('.custom-select-option');
  const nativeSelect = document.getElementById('contact-subject');
  const form = document.getElementById('portfolio-contact-form');

  function openDropdown() {
    selectWrap.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    if (typeof playBlipSound === 'function') playBlipSound(520, 0.03);
  }

  function closeDropdown() {
    selectWrap.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown() {
    if (selectWrap.classList.contains('is-open')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  options.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = option.getAttribute('data-value');
      const labelEl = option.querySelector('.select-option-label');
      const label = labelEl ? labelEl.textContent : option.textContent.trim();
      const dot = option.querySelector('.select-option-dot');

      // Update native select
      if (nativeSelect) {
        nativeSelect.value = val;
        nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Update trigger display
      if (displayText) displayText.textContent = label;
      if (displayDot && dot) {
        displayDot.className = dot.className;
      }

      // Update selected states
      options.forEach(opt => {
        opt.classList.remove('is-selected');
        opt.setAttribute('aria-selected', 'false');
      });
      option.classList.add('is-selected');
      option.setAttribute('aria-selected', 'true');

      if (typeof playBlipSound === 'function') playBlipSound(680, 0.04);
      closeDropdown();
      trigger.focus();
    });

    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      }
    });
  });

  // Handle form reset
  if (form) {
    form.addEventListener('reset', () => {
      setTimeout(() => {
        if (options[0]) {
          options[0].click();
        }
      }, 10);
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!selectWrap.contains(e.target)) {
      closeDropdown();
    }
  });

  // Keyboard navigation on trigger
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!selectWrap.classList.contains('is-open')) {
        openDropdown();
        const selected = selectWrap.querySelector('.custom-select-option.is-selected') || options[0];
        if (selected) selected.focus();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
      trigger.focus();
    }
  });
}

function copyEmailToClipboard() {
  const email = 'immanuvelstanley@gmail.com';
  playBlipSound(600, 0.04);
  navigator.clipboard.writeText(email).then(() => {
    showToast('Email address copied to clipboard!');
  }).catch(() => {
    showToast('Email: immanuvelstanley@gmail.com');
  });
}

/* ==========================================================================
   14. SCROLLSPY & MOBILE NAVIGATION
   ========================================================================== */
function initScrollspyAndNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .ui-nav-bar-link');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navList = document.querySelector('.nav-links');

  if (mobileToggle && navList) {
    // 1. Ensure backdrop overlay exists in DOM
    let backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    function openMobileMenu() {
      playBlipSound(520, 0.03);
      navList.classList.add('mobile-open');
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      if (backdrop) backdrop.classList.add('is-active');
    }

    function closeMobileMenu() {
      if (!navList.classList.contains('mobile-open')) return;
      playBlipSound(380, 0.03);
      navList.classList.remove('mobile-open');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      if (backdrop) backdrop.classList.remove('is-active');
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navList.classList.contains('mobile-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking backdrop
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileMenu();
      });
    }

    // Close when clicking empty space inside the menu (container or li margins, but not an anchor)
    navList.addEventListener('click', (e) => {
      if (e.target === navList || e.target.tagName === 'LI') {
        closeMobileMenu();
      }
    });

    // Close when clicking anywhere outside the menu
    document.addEventListener('click', (e) => {
      if (navList.classList.contains('mobile-open')) {
        if (!navList.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });

    // Close on resize if viewport becomes desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1040 && navList.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });
  }

  // Skills Tabs switcher
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillPanels = document.querySelectorAll('.skills-panel');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBlipSound(480, 0.03);
      const group = btn.getAttribute('data-group');
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillPanels.forEach(panel => {
        if (panel.getAttribute('data-panel') === group) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // Scrollspy observer throttled with requestAnimationFrame
  let scrollspyTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollspyTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 120;
          const sectionId = current.getAttribute('id');

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              }
            });
          }
        });
        scrollspyTicking = false;
      });
      scrollspyTicking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   15. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   16. SMOOTH REVEAL OBSERVER & MOTION ENGINE
   ========================================================================== */
function initSmoothRevealObserver() {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });

  const reveals = document.querySelectorAll('.smooth-reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   17. SERVICE PAGE DEDICATED DIFFERENTIAL CAN OSCILLOSCOPE (OPTIMIZED)
   ========================================================================== */
function initServiceDSO() {
  const canvas = document.getElementById('service-dso-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const btnNominal = document.getElementById('service-btn-nominal');
  const btnNoise = document.getElementById('service-btn-noise');
  const btnFault = document.getElementById('service-btn-fault');
  const readoutCanH = document.getElementById('service-canh-val');
  const readoutCanL = document.getElementById('service-canl-val');
  const readoutDiff = document.getElementById('service-diff-val');
  const explainBox = document.getElementById('service-dso-explain');

  let mode = 'nominal'; // 'nominal', 'noise', 'fault'
  let offset = 0;
  let isCanvasVisible = false;
  let isRendering = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width || 600;
    const h = rect.height || 120;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    if (typeof ctx.setTransform === 'function') {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  // Visibility Observer to pause rendering when off-screen during scrolling
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible && !isRendering) {
          isRendering = true;
          requestAnimationFrame(draw);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  } else {
    isCanvasVisible = true;
  }

  function setMode(newMode) {
    mode = newMode;
    [btnNominal, btnNoise, btnFault].forEach(b => {
      if (b) b.classList.remove('active');
    });

    if (newMode === 'nominal') {
      if (btnNominal) btnNominal.classList.add('active');
      if (explainBox) {
        explainBox.innerHTML = `<strong>✓ CAN 2.0B Nominal State:</strong> CAN-H dominant at +3.5V, CAN-L dominant at +1.5V. Differential voltage ΔV = 2.0V provides exceptional common-mode noise rejection across 500 kbps twisted-pair wiring harness.`;
      }
      if (typeof playBlipSound === 'function') playBlipSound(520, 0.04);
    } else if (newMode === 'noise') {
      if (btnNoise) btnNoise.classList.add('active');
      if (explainBox) {
        explainBox.innerHTML = `<strong>⚡ Ignition Spark Crosstalk:</strong> High-voltage secondary ignition coil discharge induces high-frequency transients onto both bus lines. Notice both lines spike in unison; differential receiver subtracts common noise without bit flipping.`;
      }
      if (typeof playBlipSound === 'function') playBlipSound(880, 0.05);
    } else if (newMode === 'fault') {
      if (btnFault) btnFault.classList.add('active');
      if (explainBox) {
        explainBox.innerHTML = `<strong>⚠ Missing 120Ω Split Termination:</strong> Impedance mismatch causes severe line reflections and ringing edges. Signal edges become smeared, increasing frame error rate (FER) and triggering transceiver retry loops.`;
      }
      if (typeof playBlipSound === 'function') playBlipSound(320, 0.08);
    }
  }

  if (btnNominal) btnNominal.addEventListener('click', () => setMode('nominal'));
  if (btnNoise) btnNoise.addEventListener('click', () => setMode('noise'));
  if (btnFault) btnFault.addEventListener('click', () => setMode('fault'));

  function draw() {
    if (!isCanvasVisible) {
      isRendering = false;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Phosphor Grid lines
    ctx.strokeStyle = (mode === 'fault') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Center Recessive 2.5V reference line
    const recessiveY = h * 0.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, recessiveY);
    ctx.lineTo(w, recessiveY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update scroll offset
    offset += (mode === 'noise') ? 3.5 : 2.8;

    // Bit generator
    const bitWidth = 26;
    function getBit(x) {
      const idx = Math.floor((x + offset) / bitWidth);
      return (Math.sin(idx * 1.85) > 0.05) ? 1 : 0;
    }

    const canHDomY = recessiveY - 32;
    const canLDomY = recessiveY + 32;

    // Precompute points for this frame to avoid recalculating twice
    const pointsH = [];
    const pointsL = [];

    for (let x = 0; x <= w; x += 3) {
      const bit = getBit(x);
      let yH = bit ? canHDomY : recessiveY;
      let yL = bit ? canLDomY : recessiveY;

      if (mode === 'noise') {
        const spike = (Math.random() < 0.06) ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 2.5;
        yH += spike;
        yL += spike;
      } else if (mode === 'fault') {
        const ring = Math.sin((x + offset) * 0.4) * 7 * (bit ? 1 : 0.35);
        yH += ring;
        yL -= ring;
      }

      pointsH.push(x, yH);
      pointsL.push(x, yL);
    }

    // High performance glow pass for CAN-H (width 4.5, zero shadowBlur overhead)
    ctx.strokeStyle = (mode === 'fault') ? 'rgba(248, 113, 113, 0.28)' : 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    for (let i = 0; i < pointsH.length; i += 2) {
      if (i === 0) ctx.moveTo(pointsH[i], pointsH[i+1]);
      else ctx.lineTo(pointsH[i], pointsH[i+1]);
    }
    ctx.stroke();

    // Sharp line for CAN-H
    ctx.strokeStyle = (mode === 'fault') ? '#F87171' : '#38BDF8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let i = 0; i < pointsH.length; i += 2) {
      if (i === 0) ctx.moveTo(pointsH[i], pointsH[i+1]);
      else ctx.lineTo(pointsH[i], pointsH[i+1]);
    }
    ctx.stroke();

    // High performance glow pass for CAN-L (width 4.5, zero shadowBlur overhead)
    ctx.strokeStyle = (mode === 'fault') ? 'rgba(251, 146, 60, 0.25)' : 'rgba(245, 158, 11, 0.25)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    for (let i = 0; i < pointsL.length; i += 2) {
      if (i === 0) ctx.moveTo(pointsL[i], pointsL[i+1]);
      else ctx.lineTo(pointsL[i], pointsL[i+1]);
    }
    ctx.stroke();

    // Sharp line for CAN-L
    ctx.strokeStyle = (mode === 'fault') ? '#FB923C' : '#F59E0B';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let i = 0; i < pointsL.length; i += 2) {
      if (i === 0) ctx.moveTo(pointsL[i], pointsL[i+1]);
      else ctx.lineTo(pointsL[i], pointsL[i+1]);
    }
    ctx.stroke();

    // Periodic telemetry jitter
    if (Math.random() < 0.15 && readoutCanH && readoutCanL && readoutDiff) {
      const jitter = (Math.random() - 0.5) * 0.03;
      if (mode === 'nominal') {
        readoutCanH.textContent = (3.51 + jitter).toFixed(2) + ' V';
        readoutCanL.textContent = (1.49 - jitter).toFixed(2) + ' V';
        readoutDiff.textContent = (2.02 + jitter * 2).toFixed(2) + ' V';
      } else if (mode === 'noise') {
        readoutCanH.textContent = (3.52 + (Math.random() - 0.5) * 0.25).toFixed(2) + ' V';
        readoutCanL.textContent = (1.48 + (Math.random() - 0.5) * 0.25).toFixed(2) + ' V';
        readoutDiff.textContent = '2.04 V (REJECTED)';
      } else if (mode === 'fault') {
        readoutCanH.textContent = (2.85 + jitter * 2).toFixed(2) + ' V';
        readoutCanL.textContent = (2.15 - jitter * 2).toFixed(2) + ' V';
        readoutDiff.textContent = (0.70 + jitter).toFixed(2) + ' V (DEGRADED)';
      }
    }

    requestAnimationFrame(draw);
  }

  isRendering = true;
  requestAnimationFrame(draw);
}

/* ==========================================================================
   18. SMOOTH ANCHOR NAVIGATION (NATIVE 120FPS HARDWARE SCROLLING)
   ========================================================================== */
function initSmoothAnchorLinks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    const targetEl = document.querySelector(hash);
    if (targetEl) {
      e.preventDefault();
      const navOffset = 80;
      const targetPos = targetEl.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - navOffset;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth'
      });
      history.pushState(null, '', hash);
    }
  });
}

/* ==========================================================================
   19. HERO ROLE 3D FLIP INTERACTION (DUAL IT & AUTOMOTIVE PROFILES)
   ========================================================================== */
function initHeroRoleFlipper() {
  const wrap = document.querySelector('.hero-role-flipper-wrap');
  if (!wrap) return;

  // Gentle audio feedback on hover
  wrap.addEventListener('mouseenter', () => {
    if (typeof playBlipSound === 'function') {
      playBlipSound(520, 0.03);
    }
  });

  // Mobile touch / click toggle support
  wrap.addEventListener('click', () => {
    wrap.classList.toggle('flipped');
    if (typeof playBlipSound === 'function') {
      playBlipSound(wrap.classList.contains('flipped') ? 560 : 440, 0.04);
    }
  });
}

/* ==========================================================================
   20. HERO TITLE: KINETIC 3D CASCADE REVEAL & SPECULAR SHIMMER
   ========================================================================== */
function initHeroTitleLoader() {
  const titleEl = document.getElementById('hero-title');
  const textEl = document.getElementById('hero-title-text');
  if (!titleEl || !textEl) return;

  // Reduced motion: skip animation
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    titleEl.classList.add('is-revealed');
    return;
  }

  // Construct structured letter nodes with CSS custom property index
  function buildKineticHTML() {
    const word1 = "IMMANUVEL";
    const word2 = "STANLEY";

    let html = '';
    // Word 1: IMMANUVEL
    for (let i = 0; i < word1.length; i++) {
      html += `<span class="hero-char-cell" style="--char-i:${i}"><span class="hero-char-glyph">${word1[i]}</span></span>`;
    }

    // Single clean space between words
    html += '<span class="hero-char-space">&nbsp;</span>';

    // Word 2: STANLEY
    for (let i = 0; i < word2.length; i++) {
      const idx = 10 + i;
      html += `<span class="hero-char-cell" style="--char-i:${idx}"><span class="hero-char-glyph">${word2[i]}</span></span>`;
    }

    // Initial group: . A (tight 0.12em micro-gap after Y, 0.24em gap before A)
    html += `<span class="hero-title-initial">`;
    html += `<span class="hero-title-dot" style="--char-i:17">.</span>`;
    html += `<span class="hero-char-cell" style="--char-i:18"><span class="hero-char-glyph">A</span></span>`;
    html += `</span>`;

    return html;
  }

  let isAnimating = false;

  function runKineticReveal() {
    if (isAnimating) return;
    isAnimating = true;

    // Reset reveal state
    titleEl.classList.remove('is-revealed');
    textEl.innerHTML = buildKineticHTML();

    // Trigger reflow to commit initial transform
    void titleEl.offsetWidth;

    // Play subtle rising audio arpeggio if sound enabled
    if (typeof playBlipSound === 'function') {
      const notes = [520, 580, 660, 780, 880, 1040, 1180];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playBlipSound(freq, 0.012);
        }, idx * 70);
      });
    }

    // Smooth cascade reveal
    requestAnimationFrame(() => {
      titleEl.classList.add('is-revealed');
    });

    // Cascade completes and stays 100% visible permanently
    setTimeout(() => {
      isAnimating = false;
    }, 850);
  }

  // Global trigger for backflow rewind dock
  window.__triggerHeroTitleScramble = () => {
    runKineticReveal();
  };

  // Reveal immediately on initial load without animation delay
  textEl.innerHTML = buildKineticHTML();
  titleEl.classList.add('is-revealed');

  // Click on title to replay the satisfying cascade anytime
  titleEl.addEventListener('click', () => {
    runKineticReveal();
  });
}

/* ==========================================================================
   21. EXPERIENCE & EDUCATION TIMELINE INTERACTIVE MOTION
   ========================================================================== */
function initTimelineInteractiveMotion() {
  const wrap = document.querySelector('.timeline-wrap');
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // Accurately position the vertical connector line strictly between the center of the first & last markers
  const updateTimelineConnector = () => {
    if (!wrap) return;
    const line = wrap.querySelector('.timeline-connector-line');
    const markers = wrap.querySelectorAll('.timeline-marker');
    if (!line || markers.length < 2) return;

    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const firstMarker = markers[0];

    // Compute center coordinates using layout geometry (immune to scroll and reveal transforms)
    const startY = firstItem.offsetTop + (firstItem.offsetHeight / 2);
    const endY = lastItem.offsetTop + (lastItem.offsetHeight / 2);
    const centerX = firstItem.offsetLeft + firstMarker.offsetLeft + (firstMarker.offsetWidth / 2);

    line.style.top = `${Math.round(startY)}px`;
    line.style.height = `${Math.max(0, Math.round(endY - startY))}px`;
    if (centerX > 0) {
      line.style.left = `${Math.round(centerX - 1)}px`;
    }
  };

  updateTimelineConnector();
  window.addEventListener('resize', updateTimelineConnector, { passive: true });
  window.addEventListener('load', updateTimelineConnector, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateTimelineConnector);
  }
  if (window.ResizeObserver && wrap) {
    const ro = new ResizeObserver(() => {
      updateTimelineConnector();
    });
    ro.observe(wrap);
  }

  items.forEach(item => {
    const card = item.querySelector('.timeline-content');
    if (!card) return;

    let rafId = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 900) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -2.5;
          const rotateY = ((x - centerX) / centerX) * 3.5;
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateX(8px) translateY(-2px)`;
        });
      }
    });

    card.addEventListener('mouseenter', () => {
      if (typeof playBlipSound === 'function') {
        playBlipSound(520, 0.02);
      }
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   22. PROJECT SHOWCASE INTERACTIVE MOTION & 3D VIEWING ENGINE
   ========================================================================== */
function initProjectCardsMotion() {
  const cards = document.querySelectorAll('.project-flagship-card, .project-card');
  if (!cards.length) return;

  // Active in-view observer while viewing projects
  if ('IntersectionObserver' in window) {
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
        } else {
          entry.target.classList.remove('is-in-view');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    cards.forEach(card => viewObserver.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-in-view'));
  }

  // 3D perspective tilt and dynamic cursor tracking on viewing/hover
  cards.forEach(card => {
    let rafId = null;
    let cardRect = null;

    const updateCardRect = () => {
      cardRect = card.getBoundingClientRect();
    };

    card.addEventListener('mouseenter', () => {
      updateCardRect();
      if (typeof playBlipSound === 'function') {
        playBlipSound(480, 0.02);
      }
    });

    card.addEventListener('mousemove', (e) => {
      if (!cardRect) updateCardRect();
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 900) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // When pointing at interactive buttons (Live Demo, Case Study, GitHub), stabilize tilt
          const isOverInteractive = !!e.target.closest('.ui-button, .btn, .btn-icon, .tech-tag, a, button');
          if (isOverInteractive) {
            card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(-4px)';
            return;
          }

          const centerX = cardRect.width / 2;
          const centerY = cardRect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -2.2;
          const rotateY = ((x - centerX) / centerX) * 3.0;

          card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      cardRect = null;
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   23. CERTIFICATION CARDS ELEVATION MOTION
   ========================================================================== */
function initCertCardsElevation() {
  const cards = document.querySelectorAll('.cert-card');
  if (!cards.length) return;

  cards.forEach(card => {
    let rect = null;
    let rafId = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      card.classList.add('is-popped');
      if (typeof playBlipSound === 'function') {
        playBlipSound(560, 0.02);
      }
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 768) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -5.0;
          const rotateY = ((x - centerX) / centerX) * 6.5;
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-14px) scale(1.045)`;
        });
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rect = null;
      card.classList.remove('is-popped');
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   24. CONTACT NEURAL CONSTELLATION NETWORK CANVAS
   ========================================================================== */
function initContactNetworkCanvas() {
  const canvas = document.getElementById('contact-network-canvas');
  const box = document.querySelector('.contact-card-box');
  if (!canvas || !box) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isVisible = false;
  let width = 0;
  let height = 0;

  const mouse = { x: -9999, y: -9999, radius: 150 };

  box.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  box.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  function resize() {
    const rect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);
  }

  const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 500),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.5 + 1.2,
      baseAlpha: Math.random() * 0.4 + 0.3,
      isAccent: Math.random() > 0.65
    });
  }

  function draw() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Interactive mouse attraction and connection
      const dxm = mouse.x - p.x;
      const dym = mouse.y - p.y;
      const distMouse = Math.sqrt(dxm * dxm + dym * dym);
      let alphaBoost = 0;

      if (distMouse < mouse.radius) {
        const force = (1 - distMouse / mouse.radius);
        p.x -= (dxm / distMouse) * force * 1.1;
        p.y -= (dym / distMouse) * force * 1.1;
        alphaBoost = force * 0.55;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(200, 155, 123, ${force * 0.32})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + (alphaBoost * 0.8), 0, Math.PI * 2);
      ctx.fillStyle = p.isAccent
        ? `rgba(56, 189, 248, ${p.baseAlpha + alphaBoost})`
        : `rgba(200, 155, 123, ${p.baseAlpha + alphaBoost})`;
      ctx.fill();

      // Inter-particle constellation connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          const lineAlpha = (1 - dist / 115) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(200, 155, 123, ${lineAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            resize();
            draw();
          }
        } else {
          isVisible = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(box);
  } else {
    isVisible = true;
    resize();
    draw();
  }

  window.addEventListener('resize', () => {
    if (isVisible) resize();
  }, { passive: true });
}

/* ==========================================================================
   25. FULL-PAGE NEURAL CONSTELLATION NETWORK CANVAS (FROM ENQUIRY BOX)
   ========================================================================== */
function initPageNetworkCanvas() {
  const canvas = document.getElementById('page-network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isRunning = false;
  let width = 0;
  let height = 0;

  const mouse = { x: -9999, y: -9999, radius: 170 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);
  }

  const particleCount = Math.min(42, Math.max(20, Math.floor(window.innerWidth / 35)));
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (window.innerWidth || 1200),
      y: Math.random() * (window.innerHeight || 800),
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      radius: Math.random() * 1.6 + 1.1,
      baseAlpha: Math.random() * 0.32 + 0.22,
      isAccent: Math.random() > 0.65
    });
  }

  function draw() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse attraction
      const dxm = mouse.x - p.x;
      const dym = mouse.y - p.y;
      const distMouse = Math.sqrt(dxm * dxm + dym * dym);
      let alphaBoost = 0;

      if (distMouse < mouse.radius) {
        const force = (1 - distMouse / mouse.radius);
        p.x -= (dxm / distMouse) * force * 0.9;
        p.y -= (dym / distMouse) * force * 0.9;
        alphaBoost = force * 0.5;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(200, 155, 123, ${force * 0.25})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + (alphaBoost * 0.6), 0, Math.PI * 2);
      ctx.fillStyle = p.isAccent
        ? `rgba(56, 189, 248, ${p.baseAlpha + alphaBoost})`
        : `rgba(200, 155, 123, ${p.baseAlpha + alphaBoost})`;
      ctx.fill();

      // Inter-particle connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.14;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(200, 155, 123, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  function start() {
    if (!isRunning) {
      isRunning = true;
      resize();
      draw();
    }
  }

  function stop() {
    isRunning = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener('resize', () => {
    if (isRunning) resize();
  }, { passive: true });

  start();
}







