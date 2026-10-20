/* ============================================================
   BESTFRIENDS? — INTERACTIVE SCRIPTS (SOOTHING BLUE OF LOVE)
   - Real-time 60fps Live Working Clock in Footer (Pure, organic, non-robotic)
   - Orbiting photo ring with counter-rotation upright stability
   - Pure Image Lightbox: Shows ONLY image and nothing else
   - Canvas gentle powder-blue floating hearts & bokeh engine
   - Web Audio API romantic melodic soundtrack synthesizer
   - Interactive modals (Casette, Memories, More Info, Special, Diary, Sweet tooth)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 0. MIDNIGHT ROSE & OBSIDIAN VELVET THEME SYSTEM (PERSISTENT DARK/LIGHT)
  // ============================================================
  function initThemeSystem() {
    function applyTheme(theme) {
      const isDark = theme === 'dark';
      if (isDark) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Synchronize all toggle buttons on current page
      const toggleBtns = document.querySelectorAll('#ambientLightBtn, .theme-toggle-btn');
      toggleBtns.forEach(btn => {
        btn.classList.add('theme-toggle-btn');
        if (isDark) {
          btn.classList.remove('glow-sun');
          btn.classList.add('glow-moon');
          btn.title = "Switch to Soothing Light Mode (Daylight)";
          btn.setAttribute('aria-label', "Switch to Light Mode");
          btn.innerHTML = `
            <svg class="moon-icon theme-icon-morph" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFD666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#FFD666" fill-opacity="0.35"></path>
              <circle cx="19" cy="5" r="1.2" fill="#FFD666"></circle>
            </svg>
          `;
        } else {
          btn.classList.remove('glow-moon');
          btn.classList.add('glow-sun');
          btn.title = "Switch to Midnight Velvet Dark Mode (Night)";
          btn.setAttribute('aria-label', "Switch to Dark Mode");
          btn.innerHTML = `
            <svg class="sun-icon theme-icon-morph" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <circle cx="12" cy="12" r="5" fill="#D48B97" />
              <g stroke="#D48B97" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="1" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
              </g>
            </svg>
          `;
        }
      });

      try {
        sessionStorage.setItem('gini_theme', isDark ? 'dark' : 'light');
        localStorage.removeItem('gini_theme');
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('gini_theme_changed', { detail: { theme: isDark ? 'dark' : 'light' } }));
    }

    window.toggleGiniTheme = function() {
      const isDarkNow = document.body.classList.contains('dark-mode') || document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDarkNow ? 'light' : 'dark');
    };

    // Click delegation for ambientLightBtn and any .theme-toggle-btn
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#ambientLightBtn, .theme-toggle-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      window.toggleGiniTheme();
    });

    // Default setting of website is strictly LIGHT MODE. Dark mode only comes on explicit toggling.
    let stored = 'light';
    try {
      localStorage.removeItem('gini_theme');
      stored = sessionStorage.getItem('gini_theme') || 'light';
    } catch (e) {}
    applyTheme(stored);
  }

  initThemeSystem();

  // ------------------------------------------------------------
  // 1. MEMORY REEL CAROUSEL ENGINE (CENTER FOCUSED, BLURRED SIDES)
  // ------------------------------------------------------------
  function initMemoryReel() {
    const track = document.getElementById('reelCarouselTrack');
    const slides = document.querySelectorAll('.reel-slide');
    const btnPrev = document.getElementById('btnReelPrev');
    const btnNext = document.getElementById('btnReelNext');
    const indicatorsContainer = document.getElementById('reelIndicators');
    const currentIndexElem = document.getElementById('reelCurrentIndex');
    const totalCountElem = document.getElementById('reelTotalCount');

    if (!track || slides.length === 0) return;

    const N = slides.length;
    let activeIndex = 0;

    if (totalCountElem) totalCountElem.textContent = String(N).padStart(2, '0');

    // Build indicator dots if empty
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `reel-dot ${idx === 0 ? 'is-active' : ''}`;
        dot.setAttribute('aria-label', `Go to photo ${idx + 1}`);
        dot.addEventListener('click', () => updateReel(idx));
        indicatorsContainer.appendChild(dot);
      });
    }

    function updateReel(newIndex) {
      activeIndex = (newIndex + N) % N;

      slides.forEach((slide, i) => {
        let diff = (i - activeIndex + N) % N;
        if (diff > N / 2) diff -= N;

        slide.classList.remove('is-center', 'is-left', 'is-right', 'is-far-left', 'is-far-right');

        if (diff === 0) {
          slide.classList.add('is-center');
        } else if (diff === -1) {
          slide.classList.add('is-left');
        } else if (diff === 1) {
          slide.classList.add('is-right');
        } else if (diff < -1) {
          slide.classList.add('is-far-left');
        } else {
          slide.classList.add('is-far-right');
        }
      });

      // Update dots
      if (indicatorsContainer) {
        const dots = indicatorsContainer.querySelectorAll('.reel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === activeIndex);
        });
      }

      // Update counter
      if (currentIndexElem) {
        currentIndexElem.textContent = String(activeIndex + 1).padStart(2, '0');
      }
    }

    // Navigation buttons
    if (btnPrev) btnPrev.addEventListener('click', () => updateReel(activeIndex - 1));
    if (btnNext) btnNext.addEventListener('click', () => updateReel(activeIndex + 1));

    // Slide clicks: center opens preview, sides rotate to center
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (slide.classList.contains('is-center')) {
          const src = slide.getAttribute('data-src');
          if (src && window.previewPhoto) {
            window.previewPhoto(src);
          }
        } else if (slide.classList.contains('is-left')) {
          updateReel(activeIndex - 1);
        } else if (slide.classList.contains('is-right')) {
          updateReel(activeIndex + 1);
        } else {
          updateReel(i);
        }
      });
    });

    // Touch swipe support on track
    const viewport = document.getElementById('reelTrackViewport') || track;
    if (viewport) {
      let touchStartX = 0;
      let touchEndX = 0;

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) updateReel(activeIndex + 1);
          else updateReel(activeIndex - 1);
        }
      }, { passive: true });
    }

    // Keyboard arrow keys navigation
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') updateReel(activeIndex - 1);
      if (e.key === 'ArrowRight') updateReel(activeIndex + 1);
    });

    // Initial render
    updateReel(0);
  }

  initMemoryReel();

  // Clock Hand Safeguard (runs only if clock elements exist)
  const hourHand = document.getElementById('clockHourHand');
  const minHand = document.getElementById('clockMinHand');
  const secHand = document.getElementById('clockSecHand');

  if (hourHand || minHand || secHand) {
    function updateClock() {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      const secDeg = s * 6;
      const minDeg = m * 6;
      const hourDeg = h * 30;

      if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
      if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
      if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;

      requestAnimationFrame(updateClock);
    }
    requestAnimationFrame(updateClock);
  }

  // ------------------------------------------------------------
  // ADVANCED SCROLL-DRIVEN 3D SPATIAL REVEAL & PARALLAX ENGINE
  // ------------------------------------------------------------
  const heroBg = document.getElementById('heroBg');
  const heroContent = document.querySelector('.hero-content');
  const scrollProgressIndicator = document.getElementById('scrollProgressIndicator');

  // 1. Intersection Observer for 3D Spatial Spring Unfurl
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  });

  window.reobserveScrollElements = function() {
    document.querySelectorAll('.scroll-reveal, .scroll-stagger-parent').forEach(el => {
      scrollObserver.observe(el);
    });
  };

  window.reobserveScrollElements();

  // 2. High-Frequency Smooth Parallax, Navbar Fade & Dissolve Loop
  let lastScrollY = window.pageYOffset || 0;
  let scrollTicking = false;
  const navWrapper = document.querySelector('.navbar-wrapper');

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Top Liquid Progress Ribbon
        if (scrollProgressIndicator) {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
          scrollProgressIndicator.style.width = `${pct.toFixed(2)}%`;
        }

        // Smooth Navbar Fade On Scroll
        if (navWrapper) {
          const scrollDelta = scrollY - lastScrollY;
          if (scrollY <= 40) {
            // At top of page: always smoothly visible
            navWrapper.classList.remove('nav-hidden');
          } else if (scrollDelta > 6 && scrollY > 70) {
            // Scrolling down: smoothly fade out
            navWrapper.classList.add('nav-hidden');
          } else if (scrollDelta < -6) {
            // Scrolling up: smoothly fade back in
            navWrapper.classList.remove('nav-hidden');
          }
        }

        // Bakery Ambient Light Orbs Differential Parallax
        const bakeryOrbs = document.querySelectorAll('.bakery-light-orb');
        bakeryOrbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.06;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });

        lastScrollY = Math.max(0, scrollY);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Reveal navbar when cursor hovers near top edge of window (within 65px)
  if (navWrapper) {
    window.addEventListener('mousemove', (e) => {
      if (e.clientY <= 65) {
        navWrapper.classList.remove('nav-hidden');
      }
    }, { passive: true });
  }

  // ------------------------------------------------------------
  // 2. CANVAS FLOATING HEARTS & BOKEH PARTICLES (SOOTHING LIGHT BLUE)
  // ------------------------------------------------------------
  const canvas = document.getElementById('particlesCanvas');
  let ctx = null;
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (canvas) {
    ctx = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  const particles = [];
  const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));

  class HeartParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 13 + 9;
      this.speedY = Math.random() * 0.6 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.isHeart = Math.random() > 0.45;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        // Delicate soothing pastel sky-blue heart
        ctx.fillStyle = 'rgba(125, 211, 252, 0.85)';
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(
          -this.size / 2, -this.size / 2,
          -this.size, topCurveHeight / 3,
          0, this.size
        );
        ctx.bezierCurveTo(
          this.size, topCurveHeight / 3,
          this.size / 2, -this.size / 2,
          0, topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
      } else {
        // Soft glowing baby-blue bokeh disc
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
        gradient.addColorStop(0.5, 'rgba(125, 211, 252, 0.35)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new HeartParticle());
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateParticles);
  }
  if (ctx) animateParticles();

  // Gentle heart spawn on click
  window.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .modal-card, .pure-lightbox-card, .orbit-card')) return;
    for (let i = 0; i < 3; i++) {
      const p = new HeartParticle();
      p.x = e.clientX + (Math.random() - 0.5) * 16;
      p.y = e.clientY + (Math.random() - 0.5) * 16;
      p.speedY = Math.random() * 1.4 + 0.8;
      p.opacity = 0.75;
      particles.push(p);
      setTimeout(() => {
        const idx = particles.indexOf(p);
        if (idx > -1) particles.splice(idx, 1);
      }, 2800);
    }
  });

  // ------------------------------------------------------------
  // 3. UNIFIED AUDIO ENGINE: 6 SPECIAL SONGS & FLOATING CONTROLLER
  // ------------------------------------------------------------
  const playlist = (window.OUR_PLAYLIST && window.OUR_PLAYLIST.length) ? window.OUR_PLAYLIST : [
    {
      id: 1,
      title: "Tum Ho",
      artist: "Jokhim",
      duration: 318,
      cover: "Photos/music/tumho_img1.jpg",
      audioSrc: "Photos/music/Tum-Ho-SnapYT.App (1).mp3",
      note: "tum ho paas mere, saath mere ♡"
    },
    {
      id: 2,
      title: "Adore You",
      artist: "Harry Styles",
      duration: 207,
      cover: "Photos/music/adoreYou_img2.jpg",
      audioSrc: "Photos/music/adoreYou.mp4",
      note: "strawberry lipstick state of mind ♡"
    },
    {
      id: 3,
      title: "Jab Tak",
      artist: "Armaan Malik",
      duration: 174,
      cover: "Photos/music/JabTak_img3.jpg",
      audioSrc: "Photos/music/JabTak.mpeg",
      note: "jab tak tujhe na dekhu ♡"
    },
    {
      id: 4,
      title: "Jaan Ho Meri",
      artist: "Mithoon, Arijit Singh",
      duration: 298,
      cover: "Photos/music/jaanHomeriii_4img.jpg",
      audioSrc: "Photos/music/Jaan Ho Meri - The Realfreedom _ Tum Chand Ho Mera Tumse Meri Chandni .mp3",
      note: "humko tumse kitna pyaar hai ♡"
    },
    {
      id: 5,
      title: "Meena Bazaar",
      artist: "Keshav Tyohar",
      duration: 184,
      cover: "Photos/music/MeenaBazaar_img5.jpg",
      audioSrc: "Photos/music/Meena Bazaar - Keshav Tyohar _ Official Music Video.mp3",
      note: "old school poetry & laughs ♡"
    },
    {
      id: 6,
      title: "Two Ghosts",
      artist: "Harry Styles",
      duration: 229,
      cover: "Photos/music/two ghosts by harry styles.jpg",
      audioSrc: "Photos/music/Harry Styles - Two Ghosts (Audio).mp3",
      note: "same lips red, same eyes blue ♡"
    },
    {
      id: 7,
      title: "Yellow",
      artist: "Coldplay",
      duration: 269,
      cover: "Photos/music/yellow_coldplay.jpg",
      audioSrc: "Photos/music/Cold_Play_-_Yellow_Accoustic_(mp3.pm).mp3",
      note: "look at the stars, look how they shine for you ♡"
    },
    {
      id: 8,
      title: "Haseen",
      artist: "Zohaan",
      duration: 208,
      cover: "Photos/music/haseen.jpg",
      audioSrc: "Photos/music/HASEEN - ZOHAAN _ Official Audio _ Indian Indie Pop Love Song.mp3",
      note: "haseen ho tum, kitni haseen ♡",
      longNote: "A dreamy, poetic indie melody that feels like a quiet sunset and sweet conversations. Perfectly suited for Gini's Paradise ♡"
    },
    {
      id: 9,
      title: "Idhar Zara Sa Dekh Lo",
      artist: "Shikhar Srivastav, Yashika Sikka",
      duration: 171,
      cover: "Photos/music/idhar zara sa  dekh lo.jpg",
      audioSrc: "Photos/music/Idhar Zara Sa Dekh Lo - DjBaap.mp3",
      note: "idhar zara sa dekh lo ♡",
      longNote: "A sweet, heartfelt acoustic melody that instantly tugs at the heartstrings. Dedicated with love for Shubhangini ♡"
    }
  ];

  // ------------------------------------------------------------
  // PERSISTENT MUSIC STATE ACROSS SECTIONS & STANDALONE PAGES
  // ------------------------------------------------------------
  const STORAGE_KEY_MUSIC = 'gini_music_state';
  const STORAGE_KEY_PAUSED = 'gini_music_user_paused';

  function saveMusicState() {
    try {
      const cur = (casetteAudio && !isNaN(casetteAudio.currentTime) && casetteAudio.currentTime > 0)
        ? casetteAudio.currentTime
        : playbackElapsed;
      const state = {
        trackIdx: casetteTrackIdx,
        currentTime: cur,
        isPlaying: isCasettePlaying,
        userPaused: isUserVoluntarilyPaused,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY_MUSIC, JSON.stringify(state));
      localStorage.setItem(STORAGE_KEY_PAUSED, isUserVoluntarilyPaused ? 'true' : 'false');
    } catch (e) {}
  }

  function loadSavedMusicState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MUSIC);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  const savedMusicState = loadSavedMusicState();

  // Pick a fresh random track index for new visits so any song can play automatically on open
  const randomInitialTrackIdx = Math.floor(Math.random() * playlist.length);
  const isRecentState = savedMusicState && (Date.now() - (savedMusicState.timestamp || 0) < 600000); // 10 minutes

  let casetteTrackIdx = (isRecentState && typeof savedMusicState.trackIdx === 'number' && savedMusicState.trackIdx >= 0 && savedMusicState.trackIdx < playlist.length)
    ? savedMusicState.trackIdx
    : randomInitialTrackIdx;

  let isUserVoluntarilyPaused = (savedMusicState && savedMusicState.userPaused === true) || (localStorage.getItem(STORAGE_KEY_PAUSED) === 'true');
  let isCasettePlaying = false;
  let isPausingOutroForCasette = false;
  let isShuffle = false;
  let isLoop = false;
  let favoritesMap = {};
  let playbackElapsed = 0;
  let progressTimer = null;
  let isSeekingSlider = false;
  let initialSeekTime = 0;

  if (savedMusicState && savedMusicState.currentTime > 0) {
    initialSeekTime = savedMusicState.currentTime;
    // Calculate elapsed time during page navigation transition
    if (savedMusicState.isPlaying && !isUserVoluntarilyPaused) {
      const deltaSec = (Date.now() - (savedMusicState.timestamp || Date.now())) / 1000;
      if (deltaSec > 0 && deltaSec < 6) {
        initialSeekTime += deltaSec;
      }
    }
  }

  // Real Audio Player Instance
  const casetteAudio = new Audio();
  casetteAudio.preload = 'metadata';
  window.casetteAudio = casetteAudio;

  // Floating Controller & Navbar Elements
  const musicBar = document.getElementById('musicBar');
  const btnPlayTrack = document.getElementById('btnPlayTrack');
  const btnPrevTrack = document.getElementById('btnPrevTrack');
  const btnNextTrack = document.getElementById('btnNextTrack');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const trackInfoPopup = document.getElementById('trackInfoPopup');
  const trackTitleEl = document.getElementById('trackTitle');
  const trackArtistEl = document.getElementById('trackArtist');
  const trackPopupThumb = document.getElementById('trackPopupThumb');
  const musicNoteIcon = document.getElementById('musicNoteIcon');

  function showFloatingTrackInfo() {
    const track = playlist[casetteTrackIdx];
    if (!track) return;
    if (trackTitleEl) trackTitleEl.textContent = track.title;
    if (trackArtistEl) trackArtistEl.textContent = track.artist;
    if (trackPopupThumb && track.cover) trackPopupThumb.src = track.cover;

    if (trackInfoPopup) {
      trackInfoPopup.classList.add('show');
      clearTimeout(trackInfoPopup._timeout);
      trackInfoPopup._timeout = setTimeout(() => {
        trackInfoPopup.classList.remove('show');
      }, 3500);
    }
  }

  // Navbar Headphone Button: Toggles music while scrolling
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (typeof toggleCasette === 'function') {
        toggleCasette(false);
      }
    });
  }

  // Floating Controller Play / Pause Button
  if (btnPlayTrack) {
    btnPlayTrack.addEventListener('click', () => {
      if (typeof toggleCasette === 'function') {
        toggleCasette(false);
      }
    });
  }

  // Floating Controller Next Song Button (cycles real songs while scrolling)
  if (btnNextTrack) {
    btnNextTrack.addEventListener('click', () => {
      if (typeof nextTrack === 'function') {
        nextTrack(false);
      }
    });
  }

  // Floating Controller Previous Song Button (cycles real songs while scrolling)
  if (btnPrevTrack) {
    btnPrevTrack.addEventListener('click', () => {
      if (typeof prevTrack === 'function') {
        prevTrack(false);
      }
    });
  }

  casetteAudio.addEventListener('loadedmetadata', () => {
    if (casetteAudio.duration && !isNaN(casetteAudio.duration) && casetteAudio.duration > 0) {
      const dur = Math.round(casetteAudio.duration);
      const casetteTimeTotal = document.getElementById('casetteTimeTotal');
      if (casetteTimeTotal) casetteTimeTotal.textContent = formatTime(dur);
    }
  });

  let lastSaveTime = 0;
  casetteAudio.addEventListener('timeupdate', () => {
    if (!isSeekingSlider && isCasettePlaying) {
      const cur = casetteAudio.currentTime || 0;
      const dur = (casetteAudio.duration && !isNaN(casetteAudio.duration) && casetteAudio.duration > 0)
        ? casetteAudio.duration
        : ((playlist[casetteTrackIdx] && playlist[casetteTrackIdx].duration) || 1);
      playbackElapsed = cur;
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
      const casetteProgressSlider = document.getElementById('casetteProgressSlider');
      const casetteSliderFill = document.getElementById('casetteSliderFill');
      const casetteTimeElapsed = document.getElementById('casetteTimeElapsed');
      if (casetteProgressSlider) casetteProgressSlider.value = pct;
      if (casetteSliderFill) casetteSliderFill.style.width = `${pct}%`;
      if (casetteTimeElapsed) casetteTimeElapsed.textContent = formatTime(cur);

      const now = Date.now();
      if (now - lastSaveTime > 1200) {
        lastSaveTime = now;
        saveMusicState();
      }
    }
  });

  // Save music state before page unload or link navigation
  window.addEventListener('beforeunload', saveMusicState);
  window.addEventListener('pagehide', saveMusicState);
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (link && link.href && !link.href.startsWith('javascript:')) {
      saveMusicState();
    }
  }, { capture: true });

  casetteAudio.addEventListener('ended', () => {
    if (isLoop) {
      casetteAudio.currentTime = 0;
      casetteAudio.play().catch(() => {});
    } else {
      const isOverlayOpen = document.getElementById('casettePlaybackOverlay')?.classList.contains('active');
      if (typeof nextTrack === 'function') {
        nextTrack(!!isOverlayOpen);
      }
    }
  });

  casetteAudio.addEventListener('error', (e) => {
    console.warn('Audio playback error, falling back to acoustic synth if playing:', e);
    if (isCasettePlaying && typeof scheduleCassetteMelody === 'function') {
      scheduleCassetteMelody();
      if (typeof startProgressTracking === 'function') startProgressTracking();
    }
  });

  // ------------------------------------------------------------
  // 4. CELESTIAL GLOW LIGHTING TOGGLE
  // ------------------------------------------------------------
  const ambientLightBtn = document.getElementById('ambientLightBtn');
  if (ambientLightBtn) {
    ambientLightBtn.addEventListener('click', () => {
      document.body.classList.toggle('golden-glow');
      ambientLightBtn.style.transform = 'scale(1.2) rotate(45deg)';
      setTimeout(() => {
        ambientLightBtn.style.transform = '';
      }, 300);
    });
  }

  // ------------------------------------------------------------
  // 5. MODALS & LIGHTBOX LOGIC
  // ------------------------------------------------------------
  const memoriesModal = document.getElementById('memoriesModal');
  const moreInfoModal = document.getElementById('moreInfoModal');
  const surpriseVideoModal = document.getElementById('surpriseVideoModal');
  const specialModal = document.getElementById('specialModal');
  const generalNavModal = document.getElementById('generalNavModal');
  const casetteModal = document.getElementById('casetteModal');
  const bakeryModal = document.getElementById('bakeryModal');
  const letterModal = document.getElementById('letterModal');
  const imageLightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');

  function openModal(modal) {
    if (!modal) return;
    if (modal.id === 'letterModal' && typeof window.resetLetterToEnvelope === 'function') {
      window.resetLetterToEnvelope();
    }
    if (modal.id === 'casetteModal') {
      // Ensure cassette overlay is closed initially so user sees the clean songs list first
      const overlay = document.getElementById('casettePlaybackOverlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
      }
      modal.scrollTop = 0;
      const scrollable = modal.querySelector('.modal-container') || modal.querySelector('.casette-modal-inner');
      if (scrollable) scrollable.scrollTop = 0;

      // Trigger Jukebox random music selection animation and autoplay
      if (typeof triggerJukeboxRoulette === 'function') {
        setTimeout(triggerJukeboxRoulette, 160);
      }
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modal.id === 'letterModal') {
      modal.scrollTop = 0;
      const scrollable = modal.querySelector('.modal-container') || modal.querySelector('.letter-modal-inner');
      if (scrollable) scrollable.scrollTop = 0;
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (modal.id === 'letterModal') {
      if (typeof window.resetLetterToEnvelope === 'function') {
        window.resetLetterToEnvelope();
      }
      // Resume background cassette player smoothly if not manually paused
      if (!isUserVoluntarilyPaused && typeof playCasette === 'function') {
        setTimeout(() => { playCasette(false); }, 150);
      }
    }
    if (modal.id === 'surpriseVideoModal') {
      const vdos = modal.querySelectorAll('video');
      vdos.forEach(v => {
        if (!v.paused) v.pause();
      });
      if (typeof wasMusicPlayingBeforeSurpriseVdo !== 'undefined' && wasMusicPlayingBeforeSurpriseVdo && !isUserVoluntarilyPaused) {
        wasMusicPlayingBeforeSurpriseVdo = false;
        if (typeof playCasette === 'function') {
          playCasette(false);
        }
      }
    }
    if (modal.id === 'casetteModal') {
      if (typeof stopJukeboxRoulette === 'function') {
        stopJukeboxRoulette();
      }
      const overlay = document.getElementById('casettePlaybackOverlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
      }
      // Keep music playing continuously in the background
    }
    const remainingActive = document.querySelectorAll('.modal-overlay.active');
    if (remainingActive.length === 0) {
      document.body.style.overflow = '';
    }
    if (typeof updateScrollspyActive === 'function') {
      updateScrollspyActive();
    }
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const casetteOverlay = document.getElementById('casettePlaybackOverlay');
      if (casetteOverlay && casetteOverlay.classList.contains('active')) {
        window.closeCasettePlayerAndStop();
        return;
      }
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });

  // Button 1: Bday Letter 💌
  const btnMemories = document.getElementById('btnMemories');
  if (btnMemories) {
    btnMemories.addEventListener('click', () => {
      if (letterModal) {
        openModal(letterModal);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
      } else {
        openModal(memoriesModal);
      }
    });
  }

  // Button 2: Surprise Video 🎬
  const btnSurpriseVideo = document.getElementById('btnSurpriseVideo');
  const btnMoreInfo = document.getElementById('btnMoreInfo');
  const targetVideoModal = surpriseVideoModal || moreInfoModal;

  if (btnSurpriseVideo) {
    btnSurpriseVideo.addEventListener('click', () => {
      openModal(targetVideoModal);
    });
  }
  if (btnMoreInfo) {
    btnMoreInfo.addEventListener('click', () => {
      openModal(targetVideoModal);
    });
  }

  // ------------------------------------------------------------
  // 5. EDIT ROOM CAROUSEL ENGINE (MEMORIES IN MOTION)
  // ------------------------------------------------------------
  let wasMusicPlayingBeforeSurpriseVdo = false;
  const surpriseVdoElements = document.querySelectorAll('.surprise-vdo-element');
  const editroomSlides = document.querySelectorAll('.editroom-slide');
  const btnVdoPrev = document.getElementById('btnVdoPrev');
  const btnVdoNext = document.getElementById('btnVdoNext');
  const btnNextVideoPill = document.getElementById('btnNextVideoPill');
  const vdoIndicators = document.getElementById('vdoIndicators');
  const vdoCurrentIndexElem = document.getElementById('vdoCurrentIndex');
  const vdoTotalCountElem = document.getElementById('vdoTotalCount');

  let activeVdoIndex = 0;
  const totalVdos = editroomSlides.length || 3;

  if (vdoTotalCountElem) {
    vdoTotalCountElem.textContent = String(totalVdos).padStart(2, '0');
  }

  // Build / update indicators
  function buildVdoIndicators() {
    if (!vdoIndicators) return;
    vdoIndicators.innerHTML = '';
    for (let i = 0; i < totalVdos; i++) {
      const dot = document.createElement('button');
      dot.className = `reel-dot ${i === activeVdoIndex ? 'is-active' : ''}`;
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Video ${i + 1}`);
      const targetIdx = i;
      dot.addEventListener('click', () => updateEditRoom(targetIdx));
      vdoIndicators.appendChild(dot);
    }
  }
  buildVdoIndicators();

  function updateEditRoom(newIndex) {
    // Pause any currently playing surprise video before switching
    surpriseVdoElements.forEach((v) => {
      if (!v.paused) v.pause();
    });

    activeVdoIndex = (newIndex + totalVdos) % totalVdos;

    // Update slides
    editroomSlides.forEach((slide, idx) => {
      const isActive = idx === activeVdoIndex;
      slide.classList.toggle('is-active', isActive);
      if (isActive) {
        slide.style.display = 'flex';
      } else {
        slide.style.display = 'none';
      }
    });

    // Update dots
    if (vdoIndicators) {
      const dots = vdoIndicators.querySelectorAll('.reel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === activeVdoIndex);
      });
    }

    // Update counter
    if (vdoCurrentIndexElem) {
      vdoCurrentIndexElem.textContent = String(activeVdoIndex + 1).padStart(2, '0');
    }
  }

  // Initialize first slide visible
  updateEditRoom(0);

  // Next / Prev triggers
  if (btnVdoPrev) {
    btnVdoPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateEditRoom(activeVdoIndex - 1);
    });
  }

  if (btnVdoNext) {
    btnVdoNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateEditRoom(activeVdoIndex + 1);
    });
  }

  if (btnNextVideoPill) {
    btnNextVideoPill.addEventListener('click', (e) => {
      e.stopPropagation();
      updateEditRoom(activeVdoIndex + 1);
    });
  }

  // Keyboard navigation when Edit Room modal is open
  document.addEventListener('keydown', (e) => {
    const editRoomModal = document.getElementById('surpriseVideoModal');
    if (!editRoomModal || !editRoomModal.classList.contains('active')) return;
    if (e.key === 'ArrowRight') {
      updateEditRoom(activeVdoIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      updateEditRoom(activeVdoIndex - 1);
    }
  });

  // Video Playback & Audio Synchronization
  function checkResumeMusicAfterSurpriseVdo() {
    const anyPlaying = Array.from(surpriseVdoElements).some((v) => !v.paused && !v.ended);
    if (!anyPlaying && wasMusicPlayingBeforeSurpriseVdo && !isUserVoluntarilyPaused) {
      wasMusicPlayingBeforeSurpriseVdo = false;
      if (typeof playCasette === 'function') {
        playCasette(false);
      }
    }
  }

  surpriseVdoElements.forEach((vdo) => {
    vdo.loop = true;

    vdo.addEventListener('play', () => {
      // Pause other surprise videos
      surpriseVdoElements.forEach((otherVdo) => {
        if (otherVdo !== vdo && !otherVdo.paused) {
          otherVdo.pause();
        }
      });

      // Pause background music so audio does not clash
      if (typeof isCasettePlaying !== 'undefined' && isCasettePlaying) {
        wasMusicPlayingBeforeSurpriseVdo = true;
        if (typeof pauseCasette === 'function') {
          pauseCasette();
        }
      }

      // Pause outro video if it is currently playing
      const outroVideoEl = document.getElementById('outroVideoPlayer');
      if (outroVideoEl && !outroVideoEl.paused) {
        outroVideoEl.pause();
      }
    });

    vdo.addEventListener('pause', () => {
      checkResumeMusicAfterSurpriseVdo();
    });

    vdo.addEventListener('ended', () => {
      vdo.currentTime = 0;
      vdo.play().catch(() => {});
    });
  });

  // Pause surprise videos when modal closes
  const closeSurpriseVideoModal = document.getElementById('closeSurpriseVideoModal');
  if (closeSurpriseVideoModal) {
    closeSurpriseVideoModal.addEventListener('click', () => {
      surpriseVdoElements.forEach((v) => {
        if (!v.paused) v.pause();
      });
      checkResumeMusicAfterSurpriseVdo();
    });
  }

  // Button 3: Special Button with Confetti Shower
  const btnSpecial = document.getElementById('btnSpecial');
  const btnTriggerConfetti = document.getElementById('btnTriggerConfetti');

  function fireCelebrationConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 85,
        spread: 95,
        origin: { y: 0.6 },
        colors: ['#D48B97', '#A84B62', '#FCEEEF', '#EAA5B1', '#FFFFFF', '#FDFBF9']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#D48B97', '#A84B62', '#EAA5B1']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#D48B97', '#A84B62', '#EAA5B1']
        });
      }, 300);
    }
  }

  if (btnSpecial) {
    btnSpecial.addEventListener('click', () => {
      openModal(specialModal);
      fireCelebrationConfetti();
    });
  }

  if (btnTriggerConfetti) {
    btnTriggerConfetti.addEventListener('click', () => {
      fireCelebrationConfetti();
    });
  }

  // ------------------------------------------------------------
  // 6. PURE IMAGE LIGHTBOX (SHOW ONLY IMAGE AND NOTHING ELSE)
  // ------------------------------------------------------------
  function showPureImage(src) {
    if (!lightboxImg || !imageLightboxModal) return;
    lightboxImg.src = src;
    openModal(imageLightboxModal);
  }

  // Clicking an orbiting photo card shows ONLY the image
  document.querySelectorAll('.orbit-card').forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && img.src) {
        showPureImage(img.src);
      }
    });
  });

  // ------------------------------------------------------------
  // 7. GALLERY PREVIEW HELPER
  // ------------------------------------------------------------
  window.previewPhoto = function(src) {
    if (generalNavModal) closeModal(generalNavModal);
    showPureImage(src);
  };

  // ------------------------------------------------------------
  // 8. GINI'S SUGARCLOUD 🍰 (AN INTERACTIVE VIRTUAL BAKERY)
  // ------------------------------------------------------------

  // Web Audio Chime Helper for Bakery Delight
  function playSweetChime(freq1 = 587.33, freq2 = 880) {
    try {
      const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // 15 Curated Artisanal Desserts with Real Imagery & Fallback
  const bakeryData = [
    {
      id: 'cookies',
      name: 'Artisanal Warm Cookies',
      category: 'pastries',
      tag: 'Freshly Baked',
      desc: 'Crispy edges, gooey buttery centres, baked with pure love to make your day instantly brighter.',
      img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      icon: '🍪',
      variants: ['Sea Salt Dark Choc', 'Double Fudge Choc Chip', 'White Choc Macadamia', 'Honey Cinnamon Oat']
    },
    {
      id: 'blueberry-cheesecake',
      name: 'Blueberry Cloud Cheesecake',
      category: 'pastries',
      tag: 'House Signature',
      desc: 'A little slice of pure happiness, specially reserved for my favourite human, Gini.',
      img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      icon: '🫐',
      variants: ['Wild Blueberry Swirl', 'Classic New York Velvety', 'Blue Ribbon Lavender']
    },
    {
      id: 'kaju-barfi',
      name: 'Royal Kaju Katli',
      category: 'mithai',
      tag: 'Traditional Mithai',
      desc: 'A little mithai magic, diamond-cut and made for the sweetest person in the world.',
      img: 'Photos/KajuKatli.jpg',
      icon: '💎',
      variants: ['Pure Silver Leaf Royal', 'Saffron Cashew Infusion', 'Cardamom Rose Petal']
    },
    {
      id: 'rasmalai',
      name: 'Pistachio Cream Rasmalai',
      category: 'mithai',
      tag: 'Melt-In-Mouth',
      desc: 'Soft, pillowy cottage cheese discs soaked in saffron-spiced sweet clotted cream.',
      img: 'Photos/rasmalai.jpg',
      icon: '🥛',
      variants: ['Kesar Saffron Cream', 'Pistachio Cardamom Cloud', 'Classic Rose Sweet Milk']
    },
    {
      id: 'ice-cream',
      name: 'Boutique Gelato & Ice Cream',
      category: 'chill',
      tag: 'Chill Delights',
      desc: 'Because every single day deserves a generous double scoop of pure frozen happiness.',
      img: 'Photos/gelato',
      icon: '🍨',
      variants: ['Belgian Chocolate Silk', 'Roasted Pistachio Crunch', 'Wild Blueberry Sorbet', 'French Vanilla Bean']
    },
    {
      id: 'besan-laddu',
      name: 'Golden Desi Ghee Besan Laddu',
      category: 'mithai',
      tag: 'Traditional Mithai',
      desc: 'Traditional slow-roasted golden sweetness, prepared with a whole lot of extra warmth.',
      img: 'Photos/besanLaddu.jpg',
      icon: '🟡',
      variants: ['Slow-Roasted Almond Crunch', 'Cardamom Gold Ghee', 'Pistachio Crown']
    },
    {
      id: 'candies',
      name: 'Pastel Artisan Candies',
      category: 'surprise',
      tag: 'Playful Pops',
      desc: 'Colourful little drops of fruit sugar, delicate tang, and pure playful joy.',
      img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=600&q=80',
      icon: '🍬',
      variants: ['Blue Raspberry Drops', 'Pastel Cotton Candy', 'Honey Lavender Gems', 'Sour Strawberry Twists']
    },
    {
      id: 'brownie',
      name: 'Fudge Sizzling Brownie',
      category: 'pastries',
      tag: 'Warm & Gooey',
      desc: 'Rich Belgian cocoa, melt-in-the-centre warmth, and absolutely zero reasons to share.',
      img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      icon: '🍫',
      variants: ['Molten Lava Dark Fudge', 'Walnut Crunch Brownie', 'Salted Caramel Drizzle']
    },
    {
      id: 'tiramisu',
      name: 'Cloud Mascarpone Tiramisu',
      category: 'pastries',
      tag: 'Italian Romance',
      desc: 'Delicate ladyfingers dipped in espresso, nestled under velvety mascarpone cloud creams.',
      img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      icon: '☕',
      variants: ['Classic Venetian Cocoa', 'Vanilla Bean Espresso', 'Blueberry Cream Kiss']
    },
    {
      id: 'motichoor-laddu',
      name: 'Royal Motichoor Laddu',
      category: 'mithai',
      tag: 'Celebration Sweet',
      desc: 'Tiny golden droplets of celebration fried to perfection and steeped in cardamom syrup.',
      img: 'Photos/motichoor.jpg',
      icon: '✨',
      variants: ['Kesar Saffron Pearls', 'Pistachio Silver Glaze', 'Cashew Rose Melt']
    },
    {
      id: 'truffles',
      name: 'Hand-Rolled Cocoa Truffles',
      category: 'pastries',
      tag: 'Decadent Gems',
      desc: 'Silky smooth ganache dusted with bittersweet cocoa and spun into bite-sized wonders.',
      img: 'Photos/truffle.jpg',
      icon: '🤎',
      variants: ['Dark Hazelnut Praline', 'Sea Salt Caramel Truffle', 'White Raspberry Bliss']
    },
    {
      id: 'cupcakes',
      name: 'Pastel Swirl Cupcakes',
      category: 'pastries',
      tag: 'Pretty in Frosting',
      desc: 'Tender, fluffy vanilla sponge topped with dreamy powder-blue piped buttercream swirls.',
      img: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
      icon: '🧁',
      variants: ['Powder-Blue Vanilla Swirl', 'Red Velvet Heart Swirl', 'Wild Blueberry Confetti']
    },
    {
      id: 'macarons',
      name: 'Parisian Pastel Macarons',
      category: 'pastries',
      tag: 'Parisian Romance',
      desc: 'Crisp almond meringue shells with smooth white chocolate ganache and fruit preserves.',
      img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80',
      icon: '🌸',
      variants: ['Dusty Blue Lavender', 'French Vanilla Bean', 'Rose Petal Cream', 'Pistachio Ganache']
    },
    {
      id: 'cinnamon-rolls',
      name: 'Glazed Brioche Cinnamon Rolls',
      category: 'pastries',
      tag: 'Fresh From Oven',
      desc: 'Warm, pillowy spirals packed with Ceylon cinnamon sugar and dripping with cream cheese glaze.',
      img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80',
      icon: '🍥',
      variants: ['Classic Cream Cheese Frosting', 'Warm Pecan Caramel', 'Vanilla Glaze Spiral']
    },
    {
      id: 'surprise-box',
      name: 'Gini’s Special Surprise Box',
      category: 'surprise',
      tag: 'Magical Secret ♡',
      desc: 'Something truly sweet is waiting inside! Hand-curated treats, extra love, and a special note.',
      img: 'Photos/surpriseBox.jpg',
      icon: '🎁',
      variants: ['Chef’s Secret Selection', 'Midnight Cravings Assortment', 'Best Friend Birthday Special']
    }
  ];

  // Bakery State
  let cart = [];
  try {
    const savedCart = localStorage.getItem('gini_bakery_cart');
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (e) {
    cart = [];
  }

  let bakeryOrders = [];
  try {
    const savedOrders = localStorage.getItem('gini_bakery_orders');
    if (savedOrders) bakeryOrders = JSON.parse(savedOrders);
  } catch (e) {
    bakeryOrders = [];
  }

  // Toast Notification Helper
  const toastContainer = document.getElementById('bakeryToastContainer');
  function showBakeryToast(message, icon = '💙') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'bakery-toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 3200);
  }

  // DOM Elements for Bakery
  const pastryDisplayGrid = document.getElementById('pastryDisplayGrid');
  const bakeryCategoryTabs = document.getElementById('bakeryCategoryTabs');
  const btnEnterBakery = document.getElementById('btnEnterBakery');
  const btnOpenCart = document.getElementById('btnOpenCart');
  const cartBadgeCount = document.getElementById('cartBadgeCount');

  // Product Modal DOM Elements
  const bakeryProductModal = document.getElementById('bakeryProductModal');
  const closeBakeryProductModal = document.getElementById('closeBakeryProductModal');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalProductTag = document.getElementById('modalProductTag');
  const modalProductCategory = document.getElementById('modalProductCategory');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const modalProductDesc = document.getElementById('modalProductDesc');
  const modalProductVariants = document.getElementById('modalProductVariants');
  const modalQtyMinus = document.getElementById('modalQtyMinus');
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  const modalQtyValue = document.getElementById('modalQtyValue');
  const btnModalAddToBasket = document.getElementById('btnModalAddToBasket');

  let activeProduct = null;
  let activeSelectedVariant = '';
  let activeQty = 1;

  // Cart Drawer DOM Elements
  const bakeryCartDrawer = document.getElementById('bakeryCartDrawer');
  const closeBakeryCartDrawer = document.getElementById('closeBakeryCartDrawer');
  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const cartBakerNote = document.getElementById('cartBakerNote');
  const cartTotalItemsCount = document.getElementById('cartTotalItemsCount');
  const btnCartClear = document.getElementById('btnCartClear');
  const btnCartPackOrder = document.getElementById('btnCartPackOrder');

  // Packing Overlay DOM Elements
  const packingOverlay = document.getElementById('packingOverlay');
  const btnSkipPackingAnim = document.getElementById('btnSkipPackingAnim');
  const packingStepBadge = document.getElementById('packingStepBadge');
  const packingStepTitle = document.getElementById('packingStepTitle');
  const packingStepDesc = document.getElementById('packingStepDesc');
  const boxLid = document.getElementById('boxLid');
  const boxTreatsDropZone = document.getElementById('boxTreatsDropZone');
  const boxRibbonH = document.getElementById('boxRibbonH');
  const boxRibbonV = document.getElementById('boxRibbonV');
  const boxRibbonBow = document.getElementById('boxRibbonBow');
  const boxWaxSeal = document.getElementById('boxWaxSeal');

  let packingTimeouts = [];

  // Order Confirmation DOM Elements
  const bakeryConfirmationModal = document.getElementById('bakeryConfirmationModal');
  const confirmOrderId = document.getElementById('confirmOrderId');
  const confirmEmailStatus = document.getElementById('confirmEmailStatus');
  const confirmEmailText = document.getElementById('confirmEmailText');
  const confirmNoteBox = document.getElementById('confirmNoteBox');
  const confirmNoteText = document.getElementById('confirmNoteText');
  const confirmRecapList = document.getElementById('confirmRecapList');
  const btnConfirmNewOrder = document.getElementById('btnConfirmNewOrder');
  const btnConfirmOpenDesk = document.getElementById('btnConfirmOpenDesk');
  const btnCloseConfirmation = document.getElementById('btnCloseConfirmation');

  // Bakery Desk DOM Elements
  const bakeryDeskModal = document.getElementById('bakeryDeskModal');
  const btnOpenBakeryDesk = document.getElementById('btnOpenBakeryDesk');
  const closeBakeryDeskModal = document.getElementById('closeBakeryDeskModal');
  const deskOrdersContainer = document.getElementById('deskOrdersContainer');
  const btnDeskClearOrders = document.getElementById('btnDeskClearOrders');
  const btnCloseBakeryDesk = document.getElementById('btnCloseBakeryDesk');

  // Smooth Scroll on "Enter My Sweet Little Bakery"
  if (btnEnterBakery) {
    btnEnterBakery.addEventListener('click', (e) => {
      e.preventDefault();
      const counter = document.getElementById('bakeryCounter');
      if (counter) counter.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Render Pastry Display Grid
  function renderPastryGrid(filterCategory = 'all') {
    if (!pastryDisplayGrid) return;
    pastryDisplayGrid.innerHTML = '';

    const filtered = filterCategory === 'all'
      ? bakeryData
      : bakeryData.filter((item) => item.category === filterCategory);

    filtered.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'dessert-card scroll-stagger-child';
      card.style.setProperty('--stagger', idx % 8);
      card.setAttribute('data-id', item.id);
      card.innerHTML = `
        <div class="dessert-card-thumb-wrap">
          <img src="${item.img}" alt="${item.name}" class="dessert-card-img" onerror="if(this.src.includes('gelato') && !this._retried){this._retried=true;this.src='Photos/gelato.avif';}else if(this.src.includes('KajuKatli') && !this._retried){this._retried=true;this.src='Photos/KajuKatlii.jpg';}else{this.onerror=null;this.src='Photos/bakery.jpeg';}">
          <span class="dessert-card-badge">${item.tag}</span>
        </div>
        <div class="dessert-card-body">
          <h3 class="dessert-card-title">${item.name}</h3>
          <p class="dessert-card-desc">${item.desc}</p>
          <div class="dessert-card-action">
            <span class="dessert-ribbon-tag">🎀 Fresh for Gini</span>
            <div class="dessert-card-btn-row">
              <button class="btn-card-quick-add" type="button" title="Quick Add 1 to Basket">+ 🧺</button>
              <button class="btn-card-select" type="button">Customize ♡</button>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openProductModal(item);
      });

      const selectBtn = card.querySelector('.btn-card-select');
      if (selectBtn) {
        selectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openProductModal(item);
        });
      }

      const quickAddBtn = card.querySelector('.btn-card-quick-add');
      if (quickAddBtn) {
        quickAddBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addToBasket({
            id: item.id,
            name: item.name,
            variant: item.variants[0] || 'Signature',
            qty: 1,
            img: item.img,
            icon: item.icon
          });
        });
      }

      pastryDisplayGrid.appendChild(card);
    });
  }

  // Filter Category Tabs
  if (bakeryCategoryTabs) {
    bakeryCategoryTabs.querySelectorAll('.menu-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        bakeryCategoryTabs.querySelectorAll('.menu-tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        renderPastryGrid(cat);
      });
    });
  }

  // Open Product Customization Modal
  function openProductModal(item) {
    activeProduct = item;
    activeSelectedVariant = item.variants[0] || '';
    activeQty = 1;

    if (modalProductImg) {
      modalProductImg.src = item.img;
      modalProductImg.onerror = function() {
        if (this.src.includes('gelato') && !this._retried) {
          this._retried = true;
          this.src = 'Photos/gelato.avif';
        } else if (this.src.includes('KajuKatli') && !this._retried) {
          this._retried = true;
          this.src = 'Photos/KajuKatlii.jpg';
        } else {
          this.onerror = null;
          this.src = 'Photos/bakery.jpeg';
        }
      };
    }
    if (modalProductTag) modalProductTag.textContent = item.tag;
    if (modalProductCategory) {
      modalProductCategory.textContent = item.category === 'mithai' ? 'Royal Mithai' : item.category === 'chill' ? 'Gelato & Chill' : item.category === 'surprise' ? 'Special Secret' : 'Artisanal Patisserie';
    }
    if (modalProductTitle) modalProductTitle.textContent = item.name;
    if (modalProductDesc) modalProductDesc.textContent = item.desc;
    if (modalQtyValue) modalQtyValue.textContent = activeQty;

    // Render Variant Chips
    if (modalProductVariants) {
      modalProductVariants.innerHTML = '';
      item.variants.forEach((v, index) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `variant-chip ${index === 0 ? 'active' : ''}`;
        chip.textContent = v;
        chip.addEventListener('click', () => {
          modalProductVariants.querySelectorAll('.variant-chip').forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          activeSelectedVariant = v;
        });
        modalProductVariants.appendChild(chip);
      });
    }

    openModal(bakeryProductModal);
  }

  // Modal Quantity Stepper
  if (modalQtyMinus) {
    modalQtyMinus.addEventListener('click', () => {
      if (activeQty > 1) {
        activeQty--;
        modalQtyValue.textContent = activeQty;
      }
    });
  }

  if (modalQtyPlus) {
    modalQtyPlus.addEventListener('click', () => {
      if (activeQty < 20) {
        activeQty++;
        modalQtyValue.textContent = activeQty;
      }
    });
  }

  // Add Product to Basket
  if (btnModalAddToBasket) {
    btnModalAddToBasket.addEventListener('click', () => {
      if (!activeProduct) return;
      addToBasket({
        id: activeProduct.id,
        name: activeProduct.name,
        variant: activeSelectedVariant,
        qty: activeQty,
        img: activeProduct.img,
        icon: activeProduct.icon
      });
      closeModal(bakeryProductModal);
    });
  }

  // Add to Basket Function
  function addToBasket(item) {
    const existingIndex = cart.findIndex(
      (c) => c.id === item.id && c.variant === item.variant
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += item.qty;
    } else {
      cart.push(item);
    }

    saveCart();
    playSweetChime(523.25, 783.99); // C5 to G5 joyful chime
    showBakeryToast(`Added ${item.qty}x ${item.name} (${item.variant}) to Gini's basket ♡`, '🧁');
  }

  // Save Cart to LocalStorage & Update Badges
  function saveCart() {
    try {
      localStorage.setItem('gini_bakery_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cartBadgeCount) {
      cartBadgeCount.textContent = totalCount;
      cartBadgeCount.classList.remove('pulse');
      void cartBadgeCount.offsetWidth; // trigger reflow
      cartBadgeCount.classList.add('pulse');
    }

    const stickyCartBadge = document.getElementById('stickyCartBadge');
    if (stickyCartBadge) {
      stickyCartBadge.textContent = totalCount;
      stickyCartBadge.classList.remove('pulse');
      void stickyCartBadge.offsetWidth;
      stickyCartBadge.classList.add('pulse');
    }

    if (cartTotalItemsCount) {
      cartTotalItemsCount.textContent = totalCount;
    }

    renderCartDrawer();
  }

  // Render Cart Drawer Content
  function renderCartDrawer() {
    if (!cartDrawerBody) return;

    if (cart.length === 0) {
      cartDrawerBody.innerHTML = `
        <div class="cart-empty-state">
          <span class="cart-empty-icon">🧺</span>
          <h3 class="cart-empty-title">Your Basket is Waiting for Sweetness ♡</h3>
          <p class="cart-empty-desc">Explore the glass pastry showcase and pick your favourite desserts to pack into Gini's signature gift box.</p>
        </div>
      `;
      if (btnCartPackOrder) {
        btnCartPackOrder.disabled = true;
        btnCartPackOrder.style.opacity = '0.5';
        btnCartPackOrder.style.cursor = 'not-allowed';
      }
      return;
    }

    if (btnCartPackOrder) {
      btnCartPackOrder.disabled = false;
      btnCartPackOrder.style.opacity = '1';
      btnCartPackOrder.style.cursor = 'pointer';
    }

    cartDrawerBody.innerHTML = '';
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item-card';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-thumb" onerror="this.onerror=null; this.src='Photos/bakery.jpeg';">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-variant">${item.variant}</span>
          <div class="cart-item-controls">
            <div class="cart-qty-stepper">
              <button class="cart-mini-btn btn-cart-dec" type="button">−</button>
              <span class="cart-item-qty">${item.qty}</span>
              <button class="cart-mini-btn btn-cart-inc" type="button">+</button>
            </div>
            <button class="btn-remove-item" title="Remove treat" type="button">🗑</button>
          </div>
        </div>
      `;

      itemEl.querySelector('.btn-cart-dec').addEventListener('click', () => {
        if (item.qty > 1) {
          item.qty--;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
      });

      itemEl.querySelector('.btn-cart-inc').addEventListener('click', () => {
        if (item.qty < 20) {
          item.qty++;
          saveCart();
        }
      });

      itemEl.querySelector('.btn-remove-item').addEventListener('click', () => {
        cart.splice(index, 1);
        saveCart();
        showBakeryToast(`Removed ${item.name} from basket`, '🗑');
      });

      cartDrawerBody.appendChild(itemEl);
    });
  }

  // Cart Drawer Open/Close
  if (btnOpenCart) {
    btnOpenCart.addEventListener('click', () => {
      renderCartDrawer();
      openModal(bakeryCartDrawer);
    });
  }

  if (closeBakeryCartDrawer) {
    closeBakeryCartDrawer.addEventListener('click', () => {
      closeModal(bakeryCartDrawer);
    });
  }

  if (btnCartClear) {
    btnCartClear.addEventListener('click', () => {
      if (cart.length === 0) return;
      cart = [];
      saveCart();
      showBakeryToast('Basket cleared', '🧺');
    });
  }

  // ------------------------------------------------------------
  // SIGNATURE 4-STAGE GIFT-BOX PACKING ANIMATION SEQUENCE
  // ------------------------------------------------------------
  function clearPackingTimeouts() {
    packingTimeouts.forEach(clearTimeout);
    packingTimeouts = [];
  }

  function startPackingSequence() {
    if (cart.length === 0) {
      showBakeryToast('Your basket is empty! Pick some delicious treats first ♡', '🧺');
      return;
    }

    closeModal(bakeryCartDrawer);
    clearPackingTimeouts();

    // Reset Box Visual State
    if (boxLid) {
      boxLid.className = 'box-lid';
    }
    if (boxRibbonH) boxRibbonH.className = 'box-ribbon-horizontal';
    if (boxRibbonV) boxRibbonV.className = 'box-ribbon-vertical';
    if (boxRibbonBow) boxRibbonBow.className = 'box-ribbon-bow';
    if (boxWaxSeal) boxWaxSeal.className = 'box-wax-seal';
    if (boxTreatsDropZone) boxTreatsDropZone.innerHTML = '';

    packingOverlay.classList.add('active');
    packingOverlay.setAttribute('aria-hidden', 'false');

    // STAGE 1: RECEIVING & OPENING BOX (0ms)
    packingStepBadge.textContent = 'STAGE 1 / 4';
    packingStepTitle.textContent = "Preparing Gini's Boutique Gift Box...";
    packingStepDesc.textContent = 'Handcrafting the powder-blue luxury SugarCloud box with love';

    packingTimeouts.push(
      setTimeout(() => {
        if (boxLid) boxLid.classList.add('open');
        playSweetChime(440, 659.25); // A4, E5
      }, 400)
    );

    // STAGE 2: DROPPING TREATS IN (1400ms)
    packingTimeouts.push(
      setTimeout(() => {
        packingStepBadge.textContent = 'STAGE 2 / 4';
        packingStepTitle.textContent = 'Tucking in your sweet treats...';
        packingStepDesc.textContent = 'Carefully placing each delicious choice into warm tissue wrapping';

        // Stagger treat drops
        cart.forEach((item, idx) => {
          packingTimeouts.push(
            setTimeout(() => {
              if (boxTreatsDropZone) {
                const treat = document.createElement('div');
                treat.className = 'dropping-treat-item';
                treat.textContent = item.icon || '🍰';
                treat.title = item.name;
                boxTreatsDropZone.appendChild(treat);
                playSweetChime(600 + idx * 40, 750 + idx * 40);
              }
            }, idx * 180)
          );
        });
      }, 1400)
    );

    // STAGE 3: CLOSING LID, RIBBON & WAX SEAL (2800ms)
    packingTimeouts.push(
      setTimeout(() => {
        packingStepBadge.textContent = 'STAGE 3 / 4';
        packingStepTitle.textContent = 'Wrapping with blue satin ribbon & heart seal...';
        packingStepDesc.textContent = 'Tying with love and stamping our signature wax heart seal';

        if (boxLid) {
          boxLid.classList.remove('open');
          boxLid.classList.add('closed');
        }

        packingTimeouts.push(
          setTimeout(() => {
            if (boxRibbonH) boxRibbonH.classList.add('active');
            if (boxRibbonV) boxRibbonV.classList.add('active');
          }, 350)
        );

        packingTimeouts.push(
          setTimeout(() => {
            if (boxRibbonBow) boxRibbonBow.classList.add('active');
          }, 700)
        );

        packingTimeouts.push(
          setTimeout(() => {
            if (boxWaxSeal) boxWaxSeal.classList.add('active');
            playSweetChime(523.25, 1046.5); // C5 to C6 bright stamp chime
          }, 1000)
        );
      }, 2800)
    );

    // STAGE 4: CELEBRATION & REVEAL (4200ms)
    packingTimeouts.push(
      setTimeout(() => {
        packingStepBadge.textContent = 'STAGE 4 / 4';
        packingStepTitle.textContent = 'Freshly Packed for Gini! ♡';
        packingStepDesc.textContent = 'Your special bakery gift box is completely ready!';

        fireCelebrationConfetti();
        playSweetChime(659.25, 1318.51); // E5 to E6 celebration
      }, 4200)
    );

    // TRANSITION TO ORDER CONFIRMATION (5400ms)
    packingTimeouts.push(
      setTimeout(() => {
        finishPackingAndShowConfirmation();
      }, 5400)
    );
  }

  function finishPackingAndShowConfirmation() {
    clearPackingTimeouts();
    packingOverlay.classList.remove('active');
    packingOverlay.setAttribute('aria-hidden', 'true');

    // Create Simulated Order
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GINI-SUGARCLOUD-${randomNum}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const noteText = cartBakerNote ? cartBakerNote.value.trim() : '';

    const newOrder = {
      id: orderId,
      timestamp: dateStr,
      items: JSON.parse(JSON.stringify(cart)),
      note: noteText,
      status: 'Accepted'
    };

    bakeryOrders.unshift(newOrder);
    try {
      localStorage.setItem('gini_bakery_orders', JSON.stringify(bakeryOrders));
    } catch (e) {}

    // Populate Confirmation Modal
    if (confirmOrderId) confirmOrderId.textContent = orderId;
    if (confirmNoteBox) {
      if (noteText) {
        confirmNoteBox.style.display = 'block';
        if (confirmNoteText) confirmNoteText.textContent = `“${noteText}”`;
      } else {
        confirmNoteBox.style.display = 'none';
      }
    }

    if (confirmRecapList) {
      confirmRecapList.innerHTML = '';
      cart.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'recap-item-row';
        row.innerHTML = `
          <span>${item.icon || '🍰'} ${item.name} (${item.variant})</span>
          <span style="font-weight: 700; color: #7dd3fc;">× ${item.qty}</span>
        `;
        confirmRecapList.appendChild(row);
      });
    }

    // Reset Cart
    cart = [];
    if (cartBakerNote) cartBakerNote.value = '';
    saveCart();

    // Trigger Real-Time Admin Order Email Notification
    if (confirmEmailStatus) {
      confirmEmailStatus.className = 'confirm-email-status pending';
      if (confirmEmailText) {
        confirmEmailText.textContent = "Notifying Abhishek's inbox... 💌";
      }
    }

    fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
      .then((res) => res.json())
      .then((data) => {
        if (confirmEmailStatus) {
          confirmEmailStatus.className = 'confirm-email-status';
          if (confirmEmailText) {
            if (data.emailSent) {
              confirmEmailText.textContent = `Order email received in Admin's inbox (${data.recipient || 'Abhishek'}) 💌`;
            } else {
              confirmEmailText.textContent = `Order details archived for Admin (${data.recipient || 'Abhishek'}) 💌`;
            }
          }
        }
      })
      .catch((err) => {
        console.warn('[SugarCloud] Could not notify email endpoint:', err);
        if (confirmEmailStatus) {
          confirmEmailStatus.className = 'confirm-email-status';
          if (confirmEmailText) {
            confirmEmailText.textContent = "Order safely saved for Admin ♡";
          }
        }
      });

    openModal(bakeryConfirmationModal);
  }

  // Skip Packing Animation
  if (btnSkipPackingAnim) {
    btnSkipPackingAnim.addEventListener('click', () => {
      finishPackingAndShowConfirmation();
    });
  }

  // Pack Button in Cart Drawer
  if (btnCartPackOrder) {
    btnCartPackOrder.addEventListener('click', () => {
      startPackingSequence();
    });
  }

  // Confirmation Action Buttons
  if (btnConfirmNewOrder) {
    btnConfirmNewOrder.addEventListener('click', () => {
      closeModal(bakeryConfirmationModal);
      const counter = document.getElementById('bakeryCounter');
      if (counter) counter.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnConfirmOpenDesk) {
    btnConfirmOpenDesk.addEventListener('click', () => {
      closeModal(bakeryConfirmationModal);
      openBakeryDesk();
    });
  }

  if (btnCloseConfirmation) {
    btnCloseConfirmation.addEventListener('click', () => {
      closeModal(bakeryConfirmationModal);
    });
  }

  // ------------------------------------------------------------
  // DISCREET BAKERY ORDER DESK (SIMULATED MANAGEMENT)
  // ------------------------------------------------------------
  function openBakeryDesk() {
    renderDeskOrders();
    openModal(bakeryDeskModal);
  }

  function renderDeskOrders() {
    if (!deskOrdersContainer) return;

    if (bakeryOrders.length === 0) {
      deskOrdersContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: rgba(231, 238, 247, 0.7);">
          <span style="font-size: 2.8rem; display: block; margin-bottom: 0.5rem;">📋</span>
          <p style="font-weight: 600;">No bakery orders yet.</p>
          <p style="font-size: 0.85rem; color: rgba(231, 238, 247, 0.5);">Packed boxes will appear here with live simulated status controls.</p>
        </div>
      `;
      return;
    }

    deskOrdersContainer.innerHTML = '';
    bakeryOrders.forEach((order, orderIdx) => {
      const orderItem = document.createElement('div');
      orderItem.className = 'desk-order-item';

      const itemsSummary = order.items
        .map((i) => `${i.qty}× ${i.name} (${i.variant})`)
        .join(', ');

      const statusOptions = ['Pending ⏳', 'Accepted 💙', 'Preparing 🧁', 'Fulfilled 🎀'];

      orderItem.innerHTML = `
        <div class="desk-order-top">
          <span class="desk-order-id">${order.id}</span>
          <span class="desk-order-time">${order.timestamp}</span>
        </div>
        <div class="desk-order-summary">
          <strong>Treats:</strong> ${itemsSummary}
          ${order.note ? `<br><strong>Note:</strong> <em>“${order.note}”</em>` : ''}
        </div>
        <div class="desk-status-selector">
          ${statusOptions
            .map((status) => {
              const baseStatus = status.split(' ')[0];
              const isActive = (order.status || 'Accepted').toLowerCase() === baseStatus.toLowerCase();
              return `<button class="desk-status-pill ${isActive ? 'active' : ''}" data-status="${baseStatus}" type="button">${status}</button>`;
            })
            .join('')}
        </div>
      `;

      orderItem.querySelectorAll('.desk-status-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
          const newStatus = pill.getAttribute('data-status');
          order.status = newStatus;
          try {
            localStorage.setItem('gini_bakery_orders', JSON.stringify(bakeryOrders));
          } catch (e) {}
          renderDeskOrders();
          showBakeryToast(`Order ${order.id} marked as ${newStatus}! 🎀`, '📋');
        });
      });

      deskOrdersContainer.appendChild(orderItem);
    });
  }

  if (btnOpenBakeryDesk) {
    btnOpenBakeryDesk.addEventListener('click', openBakeryDesk);
  }

  if (closeBakeryDeskModal) {
    closeBakeryDeskModal.addEventListener('click', () => {
      closeModal(bakeryDeskModal);
    });
  }

  if (btnCloseBakeryDesk) {
    btnCloseBakeryDesk.addEventListener('click', () => {
      closeModal(bakeryDeskModal);
    });
  }

  if (btnDeskClearOrders) {
    btnDeskClearOrders.addEventListener('click', () => {
      if (bakeryOrders.length === 0) return;
      bakeryOrders = [];
      try {
        localStorage.setItem('gini_bakery_orders', JSON.stringify(bakeryOrders));
      } catch (e) {}
      renderDeskOrders();
      showBakeryToast('Order history cleared', '🗑');
    });
  }

  // Initial Bakery Render
  renderPastryGrid('all');
  updateCartUI();

  // ------------------------------------------------------------
  // 8.5 INTERACTIVE CASSETTE MUSIC PLAYER (OUR JUKEBOX ♡)
  // ------------------------------------------------------------
  const casetteStage = document.getElementById('casetteStage');
  const casetteWrapper = document.querySelector('.casette-stage-wrapper');
  const casetteSongTitle = document.getElementById('casetteSongTitle');
  const casetteSongArtist = document.getElementById('casetteSongArtist');
  const casetteHeartBtn = document.getElementById('casetteHeartBtn');
  const casetteHeartIcon = document.getElementById('casetteHeartIcon');
  const casetteProgressSlider = document.getElementById('casetteProgressSlider');
  const casetteSliderFill = document.getElementById('casetteSliderFill');
  const casetteTimeElapsed = document.getElementById('casetteTimeElapsed');
  const casetteTimeTotal = document.getElementById('casetteTimeTotal');
  const casetteShuffleBtn = document.getElementById('casetteShuffleBtn');
  const casettePrevBtn = document.getElementById('casettePrevBtn');
  const casettePlayBtn = document.getElementById('casettePlayBtn');
  const casettePlayIcon = document.getElementById('casettePlayIcon');
  const casetteNextBtn = document.getElementById('casetteNextBtn');
  const casetteLoopBtn = document.getElementById('casetteLoopBtn');
  const casetteTrackDots = document.getElementById('casetteTrackDots');
  const casetteStageWrapper = document.getElementById('casetteStageWrapper');

  // Rich Melodic Chord & Melody Patterns for All 6 Songs
  const CASSETTE_SONG_THEMES = [
    {
      // 1. Tum Ho (Soulful Rockstar ballad - Dm, F, C, G)
      tempo: 2200,
      chords: [
        [146.83, 220.00, 261.63, 349.23], // Dm7
        [174.61, 220.00, 261.63, 349.23], // F
        [130.81, 164.81, 196.00, 261.63], // C
        [98.00, 196.00, 246.94, 293.66]   // G
      ],
      leads: [440.00, 392.00, 349.23, 329.63, 293.66, 349.23]
    },
    {
      // 2. Adore You (Harry Styles - Upbeat retro disco-pop)
      tempo: 1950,
      chords: [
        [130.81, 196.00, 246.94, 311.13], // Cm7
        [103.83, 155.56, 207.65, 261.63], // Abmaj7
        [155.56, 196.00, 233.08, 311.13], // Eb
        [116.54, 174.61, 233.08, 293.66]  // Bb
      ],
      leads: [622.25, 523.25, 466.16, 392.00, 466.16, 523.25]
    },
    {
      // 3. Jab Tak (Sweet acoustic romance - G, D, Em, C)
      tempo: 2100,
      chords: [
        [196.00, 246.94, 293.66, 392.00], // G
        [146.83, 220.00, 293.66, 369.99], // D
        [164.81, 196.00, 246.94, 329.63], // Em
        [130.81, 164.81, 196.00, 261.63]  // C
      ],
      leads: [587.33, 493.88, 440.00, 392.00, 440.00, 493.88]
    },
    {
      // 4. Jaan Ho Meri (Emotional romantic ballad - Am, F, C, G)
      tempo: 2400,
      chords: [
        [110.00, 164.81, 220.00, 261.63], // Am
        [87.31, 174.61, 220.00, 261.63],  // F
        [130.81, 164.81, 196.00, 261.63], // C
        [98.00, 196.00, 246.94, 293.66]   // G
      ],
      leads: [523.25, 440.00, 392.00, 349.23, 392.00, 440.00]
    },
    {
      // 5. Meena Bazaar (Playful Indie Folk - C, Am, Dm, G)
      tempo: 2000,
      chords: [
        [130.81, 164.81, 196.00, 261.63, 329.63], // Cmaj7
        [110.00, 164.81, 220.00, 261.63],          // Am
        [146.83, 174.61, 220.00, 261.63],          // Dm
        [98.00, 196.00, 246.94, 293.66]            // G
      ],
      leads: [493.88, 523.25, 587.33, 523.25, 493.88, 440.00]
    },
    {
      // 6. Two Ghosts (Harry Styles - Warm acoustic folk rock)
      tempo: 2200,
      chords: [
        [164.81, 196.00, 246.94, 329.63], // Em
        [196.00, 246.94, 293.66, 392.00], // G
        [130.81, 164.81, 196.00, 261.63], // C
        [146.83, 220.00, 293.66, 369.99]  // D
      ],
      leads: [587.33, 554.37, 493.88, 440.00, 493.88, 587.33]
    }
  ];

  // Note: playlist, casetteTrackIdx, isCasettePlaying, and casetteAudio are initialized
  // in Section 3 as the unified audio engine for navbar, controller, and cassette.

  // Web Audio Context & Synthesizer Engine (fallback)
  let casetteCtx = null;
  let synthSeqTimer = null;
  let synthSeqStep = 0;

  function initCasetteAudio() {
    if (!casetteCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      casetteCtx = new AudioCtx();
    }
    if (casetteCtx.state === 'suspended') {
      casetteCtx.resume();
    }
  }

  // Play a warm acoustic / music-box note with dual oscillators and lowpass filter
  function playWarmAcousticNote(freq, duration = 2.4, timeOffset = 0, gainLevel = 0.12) {
    if (!casetteCtx) return;
    const now = casetteCtx.currentTime + timeOffset;

    const osc1 = casetteCtx.createOscillator();
    const osc2 = casetteCtx.createOscillator();
    const gainNode = casetteCtx.createGain();
    const filter = casetteCtx.createBiquadFilter();

    // Triangle + sine gives a warm acoustic guitar / Rhodes piano timbre
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, now); // subtle natural chorus

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(320, now + duration);
    filter.Q.setValueAtTime(1.2, now);

    // Dynamic volume envelope (quick soft attack, gentle decay)
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(gainLevel, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(casetteCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  // Melody Loop Scheduler for Current Track
  function scheduleCassetteMelody() {
    if (!isCasettePlaying) return;
    const themeIdx = casetteTrackIdx % CASSETTE_SONG_THEMES.length;
    const theme = CASSETTE_SONG_THEMES[themeIdx];
    const chords = theme.chords;
    const chord = chords[synthSeqStep % chords.length];

    // Arpeggiate chord notes like acoustic guitar strings
    chord.forEach((freq, i) => {
      // Fingerpicked arpeggio: bass note first, then higher strings
      playWarmAcousticNote(freq, 2.6, i * 0.16, i === 0 ? 0.16 : 0.09);
    });

    // Add gentle lead melody note
    if (theme.leads && theme.leads.length > 0) {
      const leadNote = theme.leads[synthSeqStep % theme.leads.length];
      playWarmAcousticNote(leadNote, 1.8, 0.48, 0.08);
    }

    synthSeqStep++;
    synthSeqTimer = setTimeout(scheduleCassetteMelody, theme.tempo);
  }

  // Format seconds into M:SS
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Render Track Dots
  function renderDots() {
    if (!casetteTrackDots) return;
    casetteTrackDots.innerHTML = '';
    playlist.forEach((song, idx) => {
      const dot = document.createElement('div');
      dot.className = `casette-dot ${idx === casetteTrackIdx ? 'active' : ''}`;
      dot.title = `${song.title} - ${song.artist}`;
      dot.addEventListener('click', () => {
        loadTrack(idx, true);
      });
      casetteTrackDots.appendChild(dot);
    });
  }

  // Load Track Information
  function loadTrack(index, autoPlay = false, showOverlay = false) {
    casetteTrackIdx = (index + playlist.length) % playlist.length;
    const track = playlist[casetteTrackIdx];

    // Update Floating Music Controller details
    const trackTitleEl = document.getElementById('trackTitle');
    const trackArtistEl = document.getElementById('trackArtist');
    const trackPopupThumb = document.getElementById('trackPopupThumb');
    if (trackTitleEl) trackTitleEl.textContent = track.title;
    if (trackArtistEl) trackArtistEl.textContent = track.artist;
    if (trackPopupThumb && track.cover) trackPopupThumb.src = track.cover;

    if (casetteSongTitle) casetteSongTitle.textContent = track.title;
    if (casetteSongArtist) casetteSongArtist.textContent = track.artist;

    // Live Cassette Tape Sticker
    const tapeStickerTitle = document.getElementById('casetteTapeStickerTitle');
    const tapeStickerArtist = document.getElementById('casetteTapeStickerArtist');
    if (tapeStickerTitle) tapeStickerTitle.textContent = track.title;
    if (tapeStickerArtist) tapeStickerArtist.textContent = track.artist;

    if (casetteTimeTotal) casetteTimeTotal.textContent = formatTime(track.duration);
    if (casetteTimeElapsed) casetteTimeElapsed.textContent = '0:00';
    if (casetteProgressSlider) casetteProgressSlider.value = 0;
    if (casetteSliderFill) casetteSliderFill.style.width = '0%';

    // Reset playback position
    playbackElapsed = 0;
    synthSeqStep = 0;

    // Load actual audio file
    if (track.audioSrc) {
      try {
        casetteAudio.src = encodeURI(track.audioSrc);
        if (initialSeekTime > 0) {
          const seekVal = initialSeekTime;
          initialSeekTime = 0; // consume once
          playbackElapsed = seekVal;
          const onCanPlay = () => {
            try {
              if (casetteAudio.duration && seekVal < casetteAudio.duration) {
                casetteAudio.currentTime = seekVal;
              }
            } catch (e) {}
            casetteAudio.removeEventListener('canplay', onCanPlay);
            casetteAudio.removeEventListener('loadedmetadata', onCanPlay);
          };
          casetteAudio.addEventListener('canplay', onCanPlay);
          casetteAudio.addEventListener('loadedmetadata', onCanPlay);
          try { casetteAudio.currentTime = seekVal; } catch (e) {}
        } else {
          casetteAudio.currentTime = 0;
        }
        casetteAudio.load();
      } catch (e) {
        console.warn('Could not load track audioSrc:', e);
      }
    } else {
      casetteAudio.removeAttribute('src');
    }

    // Favorite heart icon state
    if (casetteHeartIcon && casetteHeartBtn) {
      if (favoritesMap[track.id]) {
        casetteHeartIcon.textContent = '♥';
        casetteHeartBtn.classList.add('favorited');
      } else {
        casetteHeartIcon.textContent = '♡';
        casetteHeartBtn.classList.remove('favorited');
      }
    }

    renderDots();
    renderTracklistGrid();

    if (autoPlay) {
      playCasette(showOverlay);
    } else if (!isUserVoluntarilyPaused && savedMusicState && savedMusicState.isPlaying) {
      playCasette(showOverlay);
    } else {
      pauseCasette();
    }
  }

  // Start smooth progress counter (for synth or fallback)
  function startProgressTracking() {
    if (progressTimer) clearInterval(progressTimer);
    const track = playlist[casetteTrackIdx];
    const total = (casetteAudio && casetteAudio.duration && !isNaN(casetteAudio.duration) && casetteAudio.duration > 0)
      ? casetteAudio.duration
      : (track.duration || 229);

    progressTimer = setInterval(() => {
      if (!isCasettePlaying) return;
      if (casetteAudio && casetteAudio.src && !casetteAudio.paused) {
        return; // timeupdate listener drives the slider during real audio playback
      }
      playbackElapsed += 0.5;
      if (playbackElapsed >= total) {
        if (isLoop) {
          playbackElapsed = 0;
          synthSeqStep = 0;
        } else {
          nextTrack(false);
          return;
        }
      }
      const pct = (playbackElapsed / total) * 100;
      if (casetteProgressSlider && !isSeekingSlider) casetteProgressSlider.value = pct;
      if (casetteSliderFill) casetteSliderFill.style.width = `${pct}%`;
      if (casetteTimeElapsed) casetteTimeElapsed.textContent = formatTime(playbackElapsed);
    }, 500);
  }

  // Play Cassette & Background Audio
  function playCasette(showOverlay = false) {
    isCasettePlaying = true;
    saveMusicState();

    // Reveal Cassette Playback as an OVERLAY only if explicitly asked or already open
    const overlay = document.getElementById('casettePlaybackOverlay');
    const headerTitle = document.getElementById('casetteOverlayHeaderTitle');
    const track = playlist[casetteTrackIdx];

    if (overlay && (showOverlay || overlay.classList.contains('active'))) {
      overlay.style.display = 'flex';
      void overlay.offsetWidth; // Trigger reflow for smooth scale/opacity animation
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      if (headerTitle && track) {
        headerTitle.textContent = `${track.title} • ${track.artist}`;
      }
    }

    const wrapper = document.getElementById('casetteStageWrapper') || casetteWrapper;
    if (wrapper) {
      wrapper.classList.add('is-playing');
    }

    if (casettePlayIcon) casettePlayIcon.textContent = '⏸';

    // Synchronize Floating Music Controller and Navbar Headphone Wave
    const musicBar = document.getElementById('musicBar');
    const musicNoteIcon = document.getElementById('musicNoteIcon');
    if (musicBar) musicBar.classList.add('is-playing');
    document.body.classList.add('audio-playing');
    if (musicNoteIcon) musicNoteIcon.textContent = '⏸';

    // If overlay is not showing, show the floating track info pill
    if (!showOverlay && (!overlay || !overlay.classList.contains('active'))) {
      if (typeof showFloatingTrackInfo === 'function') {
        showFloatingTrackInfo();
      }
    }

    // Immediately pause outro video if it is currently playing
    const outroVideoEl = document.getElementById('outroVideoPlayer');
    if (outroVideoEl && !outroVideoEl.paused) {
      isPausingOutroForCasette = true;
      outroVideoEl.pause();
      isPausingOutroForCasette = false;
    }

    // Clear any pending synth melody loop
    if (synthSeqTimer) {
      clearTimeout(synthSeqTimer);
      synthSeqTimer = null;
    }

    // Play real audio file if available
    if (casetteAudio && casetteAudio.src) {
      const playPromise = casetteAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isCasettePlaying = true;
          saveMusicState();
        }).catch(err => {
          console.debug('casetteAudio playback deferred by browser policy:', err);
          isCasettePlaying = false;
          if (musicBar) musicBar.classList.remove('is-playing');
          document.body.classList.remove('audio-playing');
          if (musicNoteIcon) musicNoteIcon.textContent = '▶';
          if (casettePlayIcon) casettePlayIcon.textContent = '▶';
          const curWrapper = document.getElementById('casetteStageWrapper') || casetteWrapper;
          if (curWrapper) curWrapper.classList.remove('is-playing');
        });
      }
    } else {
      initCasetteAudio();
      scheduleCassetteMelody();
      startProgressTracking();
    }

    renderTracklistGrid();
  }

  // Pause / Stop Cassette & Background Audio
  function pauseCasette() {
    isCasettePlaying = false;
    saveMusicState();
    const wrapper = document.getElementById('casetteStageWrapper') || casetteWrapper;
    if (wrapper) wrapper.classList.remove('is-playing');
    if (casettePlayIcon) casettePlayIcon.textContent = '▶';

    // Synchronize Floating Music Controller and Navbar Headphone Wave
    const musicBar = document.getElementById('musicBar');
    const musicNoteIcon = document.getElementById('musicNoteIcon');
    if (musicBar) musicBar.classList.remove('is-playing');
    document.body.classList.remove('audio-playing');
    if (musicNoteIcon) musicNoteIcon.textContent = '▶';

    if (casetteAudio) {
      casetteAudio.pause();
    }

    if (synthSeqTimer) {
      clearTimeout(synthSeqTimer);
      synthSeqTimer = null;
    }
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }

    renderTracklistGrid();
  }

  window.playCasette = playCasette;
  window.pauseCasette = pauseCasette;

  // Toggle Play / Pause
  function toggleCasette(showOverlay = false) {
    if (isCasettePlaying) {
      isUserVoluntarilyPaused = true;
      localStorage.setItem(STORAGE_KEY_PAUSED, 'true');
      pauseCasette();
    } else {
      isUserVoluntarilyPaused = false;
      localStorage.setItem(STORAGE_KEY_PAUSED, 'false');
      playCasette(showOverlay);
    }
  }

  // Next Track
  function nextTrack(showOverlay = false) {
    isUserVoluntarilyPaused = false;
    localStorage.setItem(STORAGE_KEY_PAUSED, 'false');
    if (isShuffle) {
      let randIdx = Math.floor(Math.random() * playlist.length);
      if (randIdx === casetteTrackIdx && playlist.length > 1) {
        randIdx = (randIdx + 1) % playlist.length;
      }
      loadTrack(randIdx, true, showOverlay);
    } else {
      loadTrack(casetteTrackIdx + 1, true, showOverlay);
    }
  }

  // Previous Track
  function prevTrack(showOverlay = false) {
    isUserVoluntarilyPaused = false;
    localStorage.setItem(STORAGE_KEY_PAUSED, 'false');
    const cur = (casetteAudio && casetteAudio.currentTime) ? casetteAudio.currentTime : playbackElapsed;
    if (cur > 3) {
      playbackElapsed = 0;
      synthSeqStep = 0;
      if (casetteAudio && casetteAudio.src) {
        casetteAudio.currentTime = 0;
      }
      if (casetteProgressSlider) casetteProgressSlider.value = 0;
      if (casetteSliderFill) casetteSliderFill.style.width = '0%';
      if (casetteTimeElapsed) casetteTimeElapsed.textContent = '0:00';
    } else {
      loadTrack(casetteTrackIdx - 1, true, showOverlay);
    }
  }

  // Slider Seeking
  if (casetteProgressSlider) {
    casetteProgressSlider.addEventListener('input', (e) => {
      isSeekingSlider = true;
      const val = parseFloat(e.target.value);
      const dur = (casetteAudio && casetteAudio.duration && !isNaN(casetteAudio.duration) && casetteAudio.duration > 0)
        ? casetteAudio.duration
        : (playlist[casetteTrackIdx].duration || 229);
      const targetTime = (val / 100) * dur;
      if (casetteSliderFill) casetteSliderFill.style.width = `${val}%`;
      if (casetteTimeElapsed) casetteTimeElapsed.textContent = formatTime(targetTime);
    });

    casetteProgressSlider.addEventListener('change', (e) => {
      const val = parseFloat(e.target.value);
      const dur = (casetteAudio && casetteAudio.duration && !isNaN(casetteAudio.duration) && casetteAudio.duration > 0)
        ? casetteAudio.duration
        : (playlist[casetteTrackIdx].duration || 229);
      const targetTime = (val / 100) * dur;
      playbackElapsed = targetTime;
      if (casetteAudio && !isNaN(casetteAudio.duration) && casetteAudio.duration > 0) {
        casetteAudio.currentTime = targetTime;
      }
      setTimeout(() => {
        isSeekingSlider = false;
      }, 60);
    });
  }

  // Control Buttons
  if (casettePlayBtn) casettePlayBtn.addEventListener('click', toggleCasette);
  if (casetteNextBtn) casetteNextBtn.addEventListener('click', nextTrack);
  if (casettePrevBtn) casettePrevBtn.addEventListener('click', prevTrack);

  if (casetteShuffleBtn) {
    casetteShuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      casetteShuffleBtn.classList.toggle('active-toggle', isShuffle);
      showBakeryToast(isShuffle ? 'Shuffle enabled 🔀' : 'Shuffle disabled ➡', '🎵');
    });
  }

  if (casetteLoopBtn) {
    casetteLoopBtn.addEventListener('click', () => {
      isLoop = !isLoop;
      casetteLoopBtn.classList.toggle('active-toggle', isLoop);
      showBakeryToast(isLoop ? 'Repeating this track 🔁' : 'Repeat disabled ➡', '🎵');
    });
  }

  // Favorite Heart Toggle
  if (casetteHeartBtn) {
    casetteHeartBtn.addEventListener('click', () => {
      const track = playlist[casetteTrackIdx];
      favoritesMap[track.id] = !favoritesMap[track.id];
      if (favoritesMap[track.id]) {
        casetteHeartIcon.textContent = '♥';
        casetteHeartBtn.classList.add('favorited');
        showBakeryToast(`Added "${track.title}" to Gini's Favourites 💙`, '♥');
      } else {
        casetteHeartIcon.textContent = '♡';
        casetteHeartBtn.classList.remove('favorited');
        showBakeryToast(`Removed from favourites`, '♡');
      }
    });
  }

  // Render Dynamic Full-Size Tracklist Grid with Clean Big Thumbnails & Minimal Info
  function renderTracklistGrid() {
    const mixtapeTracklistGrid = document.getElementById('mixtapeTracklistGrid');
    if (!mixtapeTracklistGrid) return;

    mixtapeTracklistGrid.innerHTML = playlist.map((track, idx) => {
      const isCurrent = idx === casetteTrackIdx;
      const isCurrentlyPlaying = isCurrent && isCasettePlaying;
      const coverUrl = track.cover ? track.cover.trim() : '';

      return `
        <div class="track-item-card spotify-track-card ${isCurrent ? 'is-active-track' : ''} ${isCurrentlyPlaying ? 'is-playing-now' : ''}" 
             id="trackCardItem-${idx}" 
             onclick="window.onTrackCardClick(event, ${idx})"
             title="Click to play ${track.title} on cassette">
          
          <!-- Big Thumbnail -->
          <div class="spotify-card-cover-wrapper">
            <div class="spotify-cover-box" title="${track.title} • ${track.artist}">
              ${coverUrl ? `
                <img src="${coverUrl}" alt="${track.title}" class="spotify-cover-img" loading="lazy">
              ` : `
                <div class="spotify-placeholder-box">
                  <div class="placeholder-vinyl-disc"></div>
                  <div class="placeholder-vinyl-center"></div>
                  <div class="placeholder-inner-content">
                    <span class="placeholder-cam-icon">📷</span>
                    <strong class="placeholder-main-label">Add Thumbnail</strong>
                  </div>
                </div>
              `}

              <!-- Hover Play Button Overlay -->
              <div class="spotify-cover-hover-play">
                <span class="hover-play-icon">${isCurrentlyPlaying ? '❚❚' : '▶'}</span>
              </div>

              <!-- Live Playing Badge -->
              ${isCurrentlyPlaying ? `
                <div class="spotify-live-pill-badge">
                  <span class="live-dot-pulse"></span>
                  <span>PLAYING</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Song Name (Bold) & Artist Name (Bottom) -->
          <div class="spotify-card-content">
            <h3 class="track-card-title" title="${track.title}">${track.title}</h3>
            <p class="track-card-artist" title="${track.artist}">${track.artist}</p>
          </div>

        </div>
      `;
    }).join('');
  }

  // Close Cassette Overlay AND Stop Music Playback
  window.closeCasettePlayerAndStop = function() {
    // 1. Immediately stop audio playback and mark user voluntarily paused
    isUserVoluntarilyPaused = true;
    try {
      localStorage.setItem(STORAGE_KEY_PAUSED, 'true');
    } catch (e) {}

    if (casetteAudio) {
      try {
        casetteAudio.pause();
        casetteAudio.currentTime = 0;
      } catch (e) {}
    }
    playbackElapsed = 0;
    if (casetteProgressSlider) casetteProgressSlider.value = 0;
    if (casetteSliderFill) casetteSliderFill.style.width = '0%';
    if (casetteTimeElapsed) casetteTimeElapsed.textContent = '0:00';

    pauseCasette();

    // 2. Hide cassette playback overlay with smooth fade
    const overlay = document.getElementById('casettePlaybackOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        if (!overlay.classList.contains('active')) {
          overlay.style.display = 'none';
        }
      }, 250);
    }
  };

  window.toggleTrackPlay = function(event, idx) {
    if (event) event.stopPropagation();
    const overlay = document.getElementById('casettePlaybackOverlay');
    const isOverlayOpen = overlay && overlay.classList.contains('active');

    if (idx === casetteTrackIdx && isCasettePlaying) {
      if (!isOverlayOpen) {
        // Track is already playing, reopen the cassette overlay
        playCasette(true);
      } else {
        isUserVoluntarilyPaused = true;
        localStorage.setItem(STORAGE_KEY_PAUSED, 'true');
        pauseCasette();
      }
    } else {
      isUserVoluntarilyPaused = false;
      localStorage.setItem(STORAGE_KEY_PAUSED, 'false');
      loadTrack(idx, true, true);
    }
  };

  // Backdrop click on cassette overlay to close without stopping music
  const casetteOverlayEl = document.getElementById('casettePlaybackOverlay');
  if (casetteOverlayEl) {
    casetteOverlayEl.addEventListener('click', (e) => {
      if (e.target === casetteOverlayEl || e.target.classList.contains('casette-overlay-scroller')) {
        window.closeCasettePlayerAndStop();
      }
    });
  }

  window.playNextTrack = function(event) {
    if (event) event.stopPropagation();
    nextTrack();
  };

  window.onTrackCardClick = function(event, idx) {
    if (event.target.closest('button')) return;
    if (typeof stopJukeboxRoulette === 'function') {
      stopJukeboxRoulette();
    }
    window.toggleTrackPlay(event, idx);
  };

  window.playSongIndex = function(idx) {
    if (typeof stopJukeboxRoulette === 'function') {
      stopJukeboxRoulette();
    }
    loadTrack(idx, true);
  };

  window.closeAllFeatureViews = function() {
    if (casetteModal) closeModal(casetteModal);
    if (bakeryModal) closeModal(bakeryModal);
    if (letterModal) closeModal(letterModal);
  };

  // ------------------------------------------------------------
  // JUKEBOX ROULETTE (RANDOM MUSIC SELECTION ANIMATION & AUTOPLAY)
  // ------------------------------------------------------------
  let jukeboxRouletteTimer = null;
  let isRouletteRunning = false;

  function stopJukeboxRoulette() {
    if (jukeboxRouletteTimer) {
      clearTimeout(jukeboxRouletteTimer);
      jukeboxRouletteTimer = null;
    }
    isRouletteRunning = false;
    document.querySelectorAll('.spotify-track-card').forEach(c => {
      c.classList.remove('roulette-hopping');
    });
    const dice = document.getElementById('rouletteDiceIcon');
    if (dice) dice.classList.remove('spin');
  }

  window.stopJukeboxRoulette = stopJukeboxRoulette;

  function triggerJukeboxRoulette() {
    stopJukeboxRoulette();
    isRouletteRunning = true;

    // Ensure tracklist grid is updated
    renderTracklistGrid();

    const banner = document.getElementById('jukeboxRouletteBanner');
    const statusText = document.getElementById('rouletteStatusText');
    const diceIcon = document.getElementById('rouletteDiceIcon');
    const pill = document.getElementById('rouletteIndicatorPill');

    if (banner) banner.style.display = 'flex';
    if (pill) pill.classList.remove('winner');
    if (diceIcon) diceIcon.classList.add('spin');
    if (statusText) statusText.innerHTML = 'Shuffling Jukebox for Gini... 🎲';

    const totalTracks = playlist.length;
    if (totalTracks === 0) {
      isRouletteRunning = false;
      return;
    }

    // Pick a random target track index (different from current if possible)
    let targetIdx = Math.floor(Math.random() * totalTracks);
    if (totalTracks > 1 && targetIdx === casetteTrackIdx) {
      targetIdx = (targetIdx + 1) % totalTracks;
    }

    const currentActive = casetteTrackIdx >= 0 ? casetteTrackIdx : 0;
    const baseHops = 12 + Math.floor(Math.random() * 3);
    let extraHops = (targetIdx - (currentActive + baseHops) % totalTracks + totalTracks) % totalTracks;
    const totalHops = baseHops + extraHops;

    let currentHop = 0;

    function hop() {
      if (!isRouletteRunning) return;

      const cardIdx = (currentActive + currentHop) % totalTracks;
      const currentTrack = playlist[cardIdx];

      // Highlight active hopping card
      const allCards = document.querySelectorAll('.spotify-track-card');
      allCards.forEach((c, i) => {
        if (i === cardIdx) {
          c.classList.add('roulette-hopping');
        } else {
          c.classList.remove('roulette-hopping');
        }
      });

      if (statusText && currentTrack) {
        statusText.innerHTML = `Shuffling... <strong>${currentTrack.title}</strong> 🎵`;
      }

      currentHop++;

      if (currentHop <= totalHops) {
        const progress = currentHop / totalHops;
        let delay = 50;
        if (progress > 0.85) {
          delay = 200 + (progress - 0.85) * 450;
        } else if (progress > 0.65) {
          delay = 110 + (progress - 0.65) * 220;
        } else if (progress > 0.45) {
          delay = 75;
        } else {
          delay = 50;
        }

        jukeboxRouletteTimer = setTimeout(hop, delay);
      } else {
        // Landed on winning random track!
        isRouletteRunning = false;

        const allCards = document.querySelectorAll('.spotify-track-card');
        allCards.forEach((c, i) => {
          c.classList.remove('roulette-hopping');
          if (i === targetIdx) {
            c.classList.add('roulette-winner');
          }
        });

        const winnerTrack = playlist[targetIdx];
        if (statusText && winnerTrack) {
          statusText.innerHTML = `✨ Random Pick: <strong>${winnerTrack.title}</strong> • ${winnerTrack.artist} ♡`;
        }
        if (diceIcon) diceIcon.classList.remove('spin');
        if (pill) pill.classList.add('winner');

        // Play chime & auto-play the selected track
        if (typeof playSweetChime === 'function') {
          playSweetChime(587.33, 880);
        }

        isUserVoluntarilyPaused = false;
        localStorage.setItem(STORAGE_KEY_PAUSED, 'false');
        loadTrack(targetIdx, true, false);

        setTimeout(() => {
          document.querySelectorAll('.spotify-track-card').forEach(c => c.classList.remove('roulette-winner'));
        }, 3600);
      }
    }

    hop();
  }

  window.triggerJukeboxRoulette = triggerJukeboxRoulette;

  // Initial Load: Render tracklist & load track
  renderTracklistGrid();
  loadTrack(casetteTrackIdx, false);

  // ------------------------------------------------------------
  // SEAMLESS MUSIC PLAYBACK SYSTEM (ACROSS ALL SECTIONS & PAGES)
  // ------------------------------------------------------------
  (function initSeamlessMusicSystem() {
    let hasStarted = false;

    function attemptAutoPlay() {
      const outro = document.getElementById('outroVideoPlayer');
      if (outro && !outro.paused && !outro.muted && outro.volume > 0) return;

      if (!isCasettePlaying) {
        isUserVoluntarilyPaused = false;
        playCasette(false);
      }
    }

    window.attemptAutoPlay = attemptAutoPlay;

    // 1. Attempt immediate playback on page load
    attemptAutoPlay();

    window.addEventListener('load', () => {
      if (!isCasettePlaying && !hasStarted) {
        attemptAutoPlay();
      }
    });

    // 2. User interaction fallback: If browser autoplay policy blocks unmuted audio on cold start,
    // trigger playback instantly on the very first touch, click, scroll or keypress anywhere.
    const gestureEvents = ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel', 'scroll'];
    const onFirstGesture = () => {
      if (!isCasettePlaying && (!casetteAudio || casetteAudio.paused)) {
        attemptAutoPlay();
      }
      cleanupGestureListeners();
    };

    function cleanupGestureListeners() {
      gestureEvents.forEach(evt => {
        window.removeEventListener(evt, onFirstGesture, { capture: true });
        document.removeEventListener(evt, onFirstGesture, { capture: true });
      });
    }

    gestureEvents.forEach(evt => {
      window.addEventListener(evt, onFirstGesture, { capture: true, passive: true });
      document.addEventListener(evt, onFirstGesture, { capture: true, passive: true });
    });

    if (casetteAudio) {
      casetteAudio.addEventListener('play', () => {
        hasStarted = true;
        cleanupGestureListeners();
      }, { once: true });
    }
  })();


  // ============================================================
  // LETTERS FROM ABHISHEK: SINGLE PERSONAL LETTER FOR GINI 💌
  // Stage 1: 3D Sealed Envelope
  // Stage 2: Animated Opening & Sound Chime
  // Stage 3: Forever Us Reading View with Photos & Music
  // ============================================================
  function initSinglePersonalLetter() {
    const lettersSection = document.getElementById('letters');
    if (!lettersSection) return;

    // Elements
    const envelopeStage = document.getElementById('singleLetterEnvelopeStage');
    const envelopeWrapper = document.getElementById('envelope3DWrapper');
    const envelopeFlap = document.getElementById('envelope3DFlap');
    const envelopeSeal = document.getElementById('envelopeWaxSeal');
    const btnOpenSingle = document.getElementById('btnOpenSingleLetter');
    const btnSkipEnvelope = document.getElementById('btnSkipEnvelopeAction');

    const readingView = document.getElementById('singleLetterReadingView');
    const btnReplayEnvelope = document.getElementById('btnReplayEnvelope');

    // Song elements
    const songCard = document.getElementById('letterSongCard');
    const btnToggleSong = document.getElementById('btnToggleLetterSong');
    const songPlayIcon = document.getElementById('letterSongPlayIcon');
    const songPlayText = document.getElementById('letterSongPlayText');
    const songTitleEl = document.getElementById('letterSongTitle');
    const songArtistEl = document.getElementById('letterSongArtist');

    const SESSION_KEY = 'gini_letter_opened';
    let isOpening = false;
    let isSongPlaying = false;
    let letterAudio = null;
    let synthAudioCtx = null;
    let synthInterval = null;

    // Load config if available
    const config = window.GINI_LETTER_CONFIG || null;
    if (config && config.readingView && config.readingView.song) {
      if (songTitleEl) songTitleEl.textContent = config.readingView.song.title || 'Yellow';
      if (songArtistEl) songArtistEl.textContent = config.readingView.song.artist || 'Coldplay';
      const vinylDisc = document.getElementById('letterSongVinyl');
      if (vinylDisc && config.readingView.song.coverSrc) {
        let discImg = vinylDisc.querySelector('.song-disc-img');
        if (!discImg) {
          discImg = document.createElement('img');
          discImg.className = 'song-disc-img';
          vinylDisc.prepend(discImg);
        }
        discImg.src = config.readingView.song.coverSrc;
        discImg.alt = `${config.readingView.song.title} - ${config.readingView.song.artist}`;
      }
    }

    // Function to cleanly reset letter back to sealed 3D envelope state
    function resetEnvelopeToStart() {
      stopSong();
      isOpening = false;
      if (readingView) {
        readingView.style.display = 'none';
        readingView.style.opacity = '0';
      }
      if (envelopeWrapper) {
        envelopeWrapper.classList.remove('is-opening');
      }
      if (envelopeStage) {
        envelopeStage.classList.remove('stage-fading-out');
        envelopeStage.style.display = 'flex';
        envelopeStage.style.opacity = '1';
      }
      const letterModalElem = document.getElementById('letterModal');
      if (letterModalElem) {
        letterModalElem.scrollTop = 0;
        const scrollable = letterModalElem.querySelector('.modal-container') || letterModalElem.querySelector('.letter-modal-inner');
        if (scrollable) scrollable.scrollTop = 0;
      }
    }

    // Expose reset globally so any trigger or openModal always opens from sealed envelope
    window.resetLetterToEnvelope = resetEnvelopeToStart;

    // Always start at sealed envelope stage on page load / visit
    resetEnvelopeToStart();

    // Envelope Opening Sequence
    function triggerEnvelopeOpen() {
      if (isOpening) return;
      isOpening = true;

      if (envelopeWrapper) envelopeWrapper.classList.add('is-opening');

      // Play soft romantic chime
      playLetterChime();

      // Trigger floating sparkle hearts
      triggerEnvelopeSparkles();

      // After flap flips and sheet rises, crossfade into reading view
      setTimeout(() => {
        if (envelopeStage) envelopeStage.classList.add('stage-fading-out');

        setTimeout(() => {
          if (envelopeStage) envelopeStage.style.display = 'none';
          if (readingView) {
            readingView.style.display = 'block';
            readingView.style.opacity = '1';
            readingView.scrollIntoView({ behavior: 'smooth', block: 'start' });
            startSong();
          }
          isOpening = false;
          if (envelopeWrapper) envelopeWrapper.classList.remove('is-opening');
          if (envelopeStage) envelopeStage.classList.remove('stage-fading-out');
        }, 600);
      }, 1600);
    }

    // Direct Skip Animation
    function skipToLetter() {
      if (envelopeStage) envelopeStage.style.display = 'none';
      if (readingView) {
        readingView.style.display = 'block';
        readingView.style.opacity = '1';
        readingView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        startSong();
      }
    }

    // Replay Envelope Sequence
    function replayEnvelope() {
      resetEnvelopeToStart();
      if (envelopeStage) {
        envelopeStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Event listeners for envelope
    if (btnOpenSingle) btnOpenSingle.addEventListener('click', triggerEnvelopeOpen);
    if (envelopeSeal) envelopeSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnvelopeOpen();
    });
    if (envelopeWrapper) envelopeWrapper.addEventListener('click', triggerEnvelopeOpen);
    if (btnSkipEnvelope) btnSkipEnvelope.addEventListener('click', skipToLetter);
    if (btnReplayEnvelope) btnReplayEnvelope.addEventListener('click', replayEnvelope);

    // Romantic Chime Synthesis (Web Audio)
    function playLetterChime() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = ctx.currentTime;

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);

          gain.gain.setValueAtTime(0, now + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.09, now + i * 0.12 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.65);
        });
      } catch (err) {
        // Audio fallback
      }
    }

    // Floating Sparkles Animation
    function triggerEnvelopeSparkles() {
      const symbols = ['🌹', '✨', '💙', '⭐', '🤍'];
      for (let i = 0; i < 10; i++) {
        const spark = document.createElement('div');
        spark.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        spark.style.cssText = `
          position: fixed;
          left: ${45 + (Math.random() - 0.5) * 20}vw;
          top: ${50 + (Math.random() - 0.5) * 20}vh;
          font-size: ${1.3 + Math.random() * 1.2}rem;
          pointer-events: none;
          z-index: 99999;
          animation: float-sparkle-up 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 2000);
      }
    }

    // Add sparkle keyframe if not present
    if (!document.getElementById('sparkleKeyframe')) {
      const st = document.createElement('style');
      st.id = 'sparkleKeyframe';
      st.innerHTML = `
        @keyframes float-sparkle-up {
          0% { transform: translateY(0) scale(0.6); opacity: 1; }
          100% { transform: translateY(-140px) scale(1.3); opacity: 0; }
        }
      `;
      document.head.appendChild(st);
    }

    // ==========================================
    // ROMANTIC SONG PLAYER
    // ==========================================
    const audioUrl = (config && config.readingView && config.readingView.song && config.readingView.song.audioSrc)
      ? config.readingView.song.audioSrc
      : 'Photos/music/Cold_Play_-_Yellow_Accoustic_(mp3.pm).mp3';

    try {
      letterAudio = new Audio(audioUrl);
      letterAudio.preload = 'none';
      letterAudio.addEventListener('ended', stopSong);
      letterAudio.addEventListener('error', () => {
        // Fallback to Web Audio synthesizer if audio stream fails
        if (isSongPlaying && !synthInterval) startSynthChords();
      });
    } catch (e) {
      letterAudio = null;
    }

    if (btnToggleSong) {
      btnToggleSong.addEventListener('click', () => {
        if (isSongPlaying) {
          stopSong();
        } else {
          startSong();
        }
      });
    }

    function startSong() {
      // Pause cassette player if playing to prevent dual audio
      if (typeof pauseCasette === 'function' && typeof isCasettePlaying !== 'undefined' && isCasettePlaying) {
        pauseCasette();
      }

      isSongPlaying = true;
      if (songCard) songCard.classList.add('is-playing');
      if (songPlayIcon) songPlayIcon.textContent = '❚❚';
      if (songPlayText) songPlayText.textContent = 'Pause Melody';

      let playedViaAudioTag = false;
      if (letterAudio) {
        letterAudio.play().then(() => {
          playedViaAudioTag = true;
        }).catch((err) => {
          // Play via Web Audio synthesis
          startSynthChords();
        });
      }

      // Also ensure synth chord backup starts if audio tag is silent
      setTimeout(() => {
        if (isSongPlaying && (!letterAudio || letterAudio.paused)) {
          startSynthChords();
        }
      }, 500);
    }

    function stopSong() {
      isSongPlaying = false;
      if (songCard) songCard.classList.remove('is-playing');
      if (songPlayIcon) songPlayIcon.textContent = '▶';
      if (songPlayText) songPlayText.textContent = 'Play Melody';

      if (letterAudio) {
        letterAudio.pause();
        letterAudio.currentTime = 0;
      }
      stopSynthChords();
    }

    function startSynthChords() {
      if (synthInterval) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!synthAudioCtx) synthAudioCtx = new AudioCtx();
        if (synthAudioCtx.state === 'suspended') synthAudioCtx.resume();

        const chords = [
          [293.66, 369.99, 440.00, 587.33], // D major
          [246.94, 329.63, 392.00, 493.88], // G major
          [220.00, 277.18, 329.63, 440.00], // A major
          [196.00, 246.94, 293.66, 392.00]  // G low
        ];
        let cIdx = 0;

        function playChord() {
          if (!isSongPlaying || !synthAudioCtx) return;
          const chord = chords[cIdx % chords.length];
          cIdx++;
          const now = synthAudioCtx.currentTime;

          chord.forEach((freq, i) => {
            const osc = synthAudioCtx.createOscillator();
            const gain = synthAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + i * 0.16);
            gain.gain.linearRampToValueAtTime(0.038, now + i * 0.16 + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 1.35);

            osc.connect(gain);
            gain.connect(synthAudioCtx.destination);

            osc.start(now + i * 0.16);
            osc.stop(now + i * 0.16 + 1.4);
          });
        }

        playChord();
        synthInterval = setInterval(playChord, 1600);
      } catch (err) {
        console.warn('Synth melody fallback:', err);
      }
    }

    function stopSynthChords() {
      if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
      }
    }

    // ==========================================
    // AMBIENT PARTICLES (FLOATING BLUE PETALS & STARS)
    // ==========================================
    function initLettersAmbientCanvas() {
      const ambientCanvas = document.getElementById('lettersParticlesCanvas');
      if (!ambientCanvas) return;
      const aCtx = ambientCanvas.getContext('2d');
      if (!aCtx) return;

      let aWidth = (ambientCanvas.width = ambientCanvas.offsetWidth || window.innerWidth);
      let aHeight = (ambientCanvas.height = ambientCanvas.offsetHeight || 800);

      window.addEventListener('resize', () => {
        if (!ambientCanvas) return;
        aWidth = ambientCanvas.width = ambientCanvas.offsetWidth || window.innerWidth;
        aHeight = ambientCanvas.height = ambientCanvas.offsetHeight || 800;
      });

      const petals = [];
      const count = 30;

      for (let i = 0; i < count; i++) {
        petals.push({
          x: Math.random() * aWidth,
          y: Math.random() * aHeight,
          size: Math.random() * 8 + 5,
          speedY: Math.random() * 0.45 + 0.18,
          speedX: (Math.random() - 0.5) * 0.35,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.015,
          opacity: Math.random() * 0.45 + 0.18,
          isHeart: Math.random() > 0.45
        });
      }

      function renderAmbientPetals() {
        aCtx.clearRect(0, 0, aWidth, aHeight);

        petals.forEach(p => {
          p.y -= p.speedY;
          p.x += p.speedX;
          p.rot += p.rotSpeed;

          if (p.y < -20) {
            p.y = aHeight + 20;
            p.x = Math.random() * aWidth;
          }
          if (p.x < -20) p.x = aWidth + 20;
          if (p.x > aWidth + 20) p.x = -20;

          aCtx.save();
          aCtx.translate(p.x, p.y);
          aCtx.rotate(p.rot);
          aCtx.globalAlpha = p.opacity;

          if (p.isHeart) {
            // Delicate Vintage Dusty Rose Heart Petal
            aCtx.fillStyle = '#D48B97';
            aCtx.beginPath();
            const top = p.size * 0.3;
            aCtx.moveTo(0, top);
            aCtx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, top / 3, 0, p.size);
            aCtx.bezierCurveTo(p.size, top / 3, p.size / 2, -p.size / 2, 0, top);
            aCtx.fill();
          } else {
            // Sparkling Rose Quartz Starlight Dust
            aCtx.fillStyle = '#FAD2D8';
            aCtx.beginPath();
            aCtx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
            aCtx.fill();
          }

          aCtx.restore();
        });

        requestAnimationFrame(renderAmbientPetals);
      }
      requestAnimationFrame(renderAmbientPetals);
    }

    initLettersAmbientCanvas();
  }

  // Initialize Single Personal Letter Experience
  initSinglePersonalLetter();

  // ============================================================
  // GLOBAL NAVIGATION & SCROLLSPY (ALL SECTIONS)
  // ============================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const navModalTag = document.getElementById('navModalTag');
  const navModalTitle = document.getElementById('navModalTitle');
  const navModalDesc = document.getElementById('navModalDesc');
  const navModalBody = document.getElementById('navModalBody');

  const navContentData = {
    gallery: {
      tag: 'PHOTO ARCHIVE 📸',
      title: 'Our Beautiful Memories',
      desc: 'Snapshots of our journey, laughter, and best memories together.',
      html: `
        <div class="nav-gallery-grid">
          <div class="nav-gallery-item" onclick="window.previewPhoto('Photos/clock1.jpg')"><img src="Photos/clock1.jpg" alt="Gallery 1"></div>
          <div class="nav-gallery-item" onclick="window.previewPhoto('Photos/clock6.jpg')"><img src="Photos/clock6.jpg" alt="Gallery 2"></div>
          <div class="nav-gallery-item" onclick="window.previewPhoto('Photos/clock2.jpg')"><img src="Photos/clock2.jpg" alt="Gallery 3"></div>
          <div class="nav-gallery-item" onclick="window.previewPhoto('Photos/clock3.jpg')"><img src="Photos/clock3.jpg" alt="Gallery 4"></div>
          <div class="nav-gallery-item" onclick="window.previewPhoto('Photos/clock4.jpg')"><img src="Photos/clock4.jpg" alt="Gallery 5"></div>
          <div class="nav-gallery-item" onclick="window.previewPhoto('Photos/clock5.jpg')"><img src="Photos/clock5.jpg" alt="Gallery 6"></div>
        </div>
      `
    }
  };

  function updateScrollspyActive() {
    navLinks.forEach((l) => l.classList.remove('active'));
    const homeLink = document.querySelector('[data-target="home"]');
    if (homeLink) homeLink.classList.add('active');
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-target');

      if (target === 'home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      } else if (target === 'casette') {
        e.preventDefault();
        if (casetteModal) {
          openModal(casetteModal);
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      } else if (target === 'bakery') {
        e.preventDefault();
        if (bakeryModal) {
          openModal(bakeryModal);
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      } else if (target === 'letters') {
        e.preventDefault();
        if (letterModal) {
          openModal(letterModal);
          setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        } else {
          const section = document.getElementById('letters');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      } else if (target === 'clockFooter') {
        e.preventDefault();
        const section = document.getElementById('clockFooter');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      } else if (navContentData[target]) {
        e.preventDefault();
        const data = navContentData[target];
        navModalTag.textContent = data.tag;
        navModalTitle.textContent = data.title;
        navModalDesc.textContent = data.desc;
        navModalBody.innerHTML = data.html;
        openModal(generalNavModal);
      }
    });
  });

  // ============================================================
  // OUTRO VIDEO: AUTO-PLAY WITH AUDIO ON SCROLL & CONTROLLERLESS FULL-LENGTH
  // ============================================================
  const outroSection = document.getElementById('outroVideoSection');
  const outroVideo = document.getElementById('outroVideoPlayer');
  const outroVideoCard = document.getElementById('outroVideoCard');
  const outroSoundBadge = document.getElementById('outroSoundBadge');
  const outroSoundIcon = document.getElementById('outroSoundIcon');
  const outroSoundLabel = document.getElementById('outroSoundLabel');
  const outroPlayIndicator = document.getElementById('outroPlayIndicator');

  // Pre-cache outro video in background memory as a Blob so web streaming never lags or buffers
  (function prebufferOutroVideo() {
    if (!outroVideo) return;
    const videoUrl = 'outro-video.mp4';
    
    const schedulePreload = window.requestIdleCallback || ((cb) => setTimeout(cb, 800));
    schedulePreload(() => {
      fetch(videoUrl, { cache: 'force-cache' })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const wasPlaying = !outroVideo.paused;
          const currTime = outroVideo.currentTime;
          
          // Smoothly switch source to local blob if user hasn't already watched past the start
          if (currTime < 1) {
            const currentMuted = outroVideo.muted;
            outroVideo.src = blobUrl;
            outroVideo.muted = currentMuted;
            outroVideo.loop = true;
            outroVideo.load();
            if (wasPlaying) {
              outroVideo.play().catch(() => {});
            }
          }
        })
        .catch(err => {
          console.debug('Standard video stream active:', err.message);
        });
    });
  })();

  function flashPlayIndicator(iconText) {
    if (!outroPlayIndicator) return;
    outroPlayIndicator.textContent = iconText;
    outroPlayIndicator.classList.add('flash');
    clearTimeout(outroPlayIndicator._timeout);
    outroPlayIndicator._timeout = setTimeout(() => {
      outroPlayIndicator.classList.remove('flash');
    }, 600);
  }

  function updateSoundBadgeUI() {
    if (!outroVideo || !outroSoundIcon || !outroSoundLabel) return;
    if (outroVideo.muted || outroVideo.volume === 0) {
      outroSoundIcon.textContent = '🔈';
      outroSoundLabel.textContent = 'Sound Off';
      if (outroSoundBadge) outroSoundBadge.classList.add('is-muted');
    } else {
      outroSoundIcon.textContent = '🔊';
      outroSoundLabel.textContent = 'Sound On';
      if (outroSoundBadge) outroSoundBadge.classList.remove('is-muted');
    }
  }

  function playOutroWithAudio() {
    if (!outroVideo) return;
    // Guard: Do not re-trigger play if already playing smoothly
    if (!outroVideo.paused && !outroVideo.ended && !outroVideo.muted) return;

    // 1. Immediately pause any background or cassette music
    if (typeof pauseCasette === 'function' && typeof isCasettePlaying !== 'undefined' && isCasettePlaying) {
      pauseCasette();
    }

    // 2. Enable audio and play
    outroVideo.muted = false;
    updateSoundBadgeUI();

    const playPromise = outroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Autoplay with sound restricted by browser policy; trying muted fallback:', err);
        // Fallback for strict browser autoplay policies before user interaction
        outroVideo.muted = true;
        updateSoundBadgeUI();
        outroVideo.play().catch(e => console.warn('Muted autoplay error:', e));
      });
    }
  }

  function resumeSongAfterOutro() {
    if (!isUserVoluntarilyPaused && typeof playCasette === 'function') {
      playCasette(false);
    }
  }

  function pauseOutroVideo() {
    if (outroVideo && !outroVideo.paused) {
      outroVideo.pause();
    }
  }

  if (outroVideo) {
    outroVideo.loop = true;

    // Automatically replay when video ends
    outroVideo.addEventListener('ended', () => {
      outroVideo.currentTime = 0;
      outroVideo.play().catch(e => console.debug('Auto-replay catch:', e));
      if (!isUserVoluntarilyPaused) {
        resumeSongAfterOutro();
      }
    });

    // If video plays with audio, ensure background song is stopped
    outroVideo.addEventListener('play', () => {
      if (!outroVideo.muted && outroVideo.volume > 0) {
        if (typeof pauseCasette === 'function' && typeof isCasettePlaying !== 'undefined' && isCasettePlaying) {
          pauseCasette();
        }
      }
      flashPlayIndicator('▶');
    });

    // When outro video is paused, automatically resume playing the song again
    outroVideo.addEventListener('pause', () => {
      flashPlayIndicator('⏸');
      if (!isPausingOutroForCasette && !isUserVoluntarilyPaused) {
        resumeSongAfterOutro();
      }
    });

    outroVideo.addEventListener('volumechange', () => {
      updateSoundBadgeUI();
    });

    // Toggle play / pause on clicking the video card
    if (outroVideoCard) {
      outroVideoCard.addEventListener('click', (e) => {
        if (e.target.closest('#outroSoundBadge') || e.target.closest('#outroFullscreenBtn')) return;
        if (outroVideo.paused) {
          playOutroWithAudio();
        } else {
          pauseOutroVideo();
        }
      });
    }

    // Sound Badge click toggles mute / unmute
    if (outroSoundBadge) {
      outroSoundBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        if (outroVideo.muted || outroVideo.volume === 0) {
          playOutroWithAudio();
        } else {
          outroVideo.muted = true;
          updateSoundBadgeUI();
          if (!isUserVoluntarilyPaused) {
            resumeSongAfterOutro();
          }
        }
      });
    }

    // Scroll Detection: IntersectionObserver with hysteresis to eliminate flutter/stutter
    if (outroSection && 'IntersectionObserver' in window) {
      const outroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            // User scrolled into the outro section!
            // If user is currently playing their song, do NOT interrupt their song while scrolling!
            if (isCasettePlaying) {
              outroVideo.muted = true;
              updateSoundBadgeUI();
              outroVideo.play().catch(() => {});
            } else {
              playOutroWithAudio();
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio <= 0.05) {
            // User scrolled completely away from the outro section!
            pauseOutroVideo();
          }
        });
      }, {
        threshold: [0.05, 0.15, 0.35, 0.6]
      });

      outroObserver.observe(outroSection);
    }
  }

  // ============================================================
  // UNIFIED VIDEO FULLSCREEN / MAXIMISE SYSTEM
  // (Outro Video & Edit Room Surprise Videos)
  // ============================================================
  function initVideoFullscreenSystem() {
    function triggerUniversalFullscreen(videoEl, containerEl, buttonEl) {
      if (!videoEl) return;

      // Check current fullscreen state across standard and WebKit
      const isFs = (document.fullscreenElement && (document.fullscreenElement === videoEl || document.fullscreenElement === containerEl)) ||
                   (document.webkitFullscreenElement && (document.webkitFullscreenElement === videoEl || document.webkitFullscreenElement === containerEl)) ||
                   videoEl.webkitDisplayingFullscreen === true;

      if (isFs) {
        if (typeof videoEl.webkitExitFullscreen === 'function' && videoEl.webkitDisplayingFullscreen) {
          try { videoEl.webkitExitFullscreen(); } catch (e) {}
        }
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exit) {
          try { exit.call(document); } catch (e) {}
        }
        return;
      }

      // Ensure video is ready to enter fullscreen
      if (videoEl.readyState === 0) {
        try { videoEl.load(); } catch (e) {}
      }

      // 1. Direct WebKit webkitEnterFullscreen (CRUCIAL for iOS Safari & WebKit - must execute synchronously during click/touch!)
      if (typeof videoEl.webkitEnterFullscreen === 'function') {
        try {
          videoEl.webkitEnterFullscreen();
          return;
        } catch (e) {
          console.debug('webkitEnterFullscreen error, falling back to standard API:', e);
        }
      }

      // 2. Standard HTML5 Fullscreen API (Chrome, Android, Edge, Firefox)
      if (typeof videoEl.requestFullscreen === 'function') {
        videoEl.requestFullscreen().catch(() => {
          if (containerEl && typeof containerEl.requestFullscreen === 'function') {
            containerEl.requestFullscreen().catch(() => {});
          }
        });
        return;
      }

      // 3. WebKit requestFullscreen on video
      if (typeof videoEl.webkitRequestFullscreen === 'function') {
        try {
          videoEl.webkitRequestFullscreen();
          return;
        } catch (e) {}
      }

      // 4. Container fallback
      if (containerEl) {
        const req = containerEl.requestFullscreen || containerEl.webkitRequestFullscreen || containerEl.mozRequestFullScreen || containerEl.msRequestFullscreen;
        if (req) {
          try { req.call(containerEl); } catch (e) {}
        }
      }
    }

    function syncFsButtonState(buttonEl, isFs) {
      if (!buttonEl) return;
      const expandIcon = buttonEl.querySelector('.vdo-fs-icon-expand');
      const compressIcon = buttonEl.querySelector('.vdo-fs-icon-compress');
      if (expandIcon && compressIcon) {
        expandIcon.style.display = isFs ? 'none' : 'block';
        compressIcon.style.display = isFs ? 'block' : 'none';
      }
      buttonEl.setAttribute('aria-label', isFs ? 'Exit Fullscreen' : 'Maximize Video');
      buttonEl.setAttribute('title', isFs ? 'Exit Fullscreen' : 'Maximize Video');
    }

    // Capture-phase event delegation for both click and touch: works on 1, 2, or 3 buttons no matter what!
    ['click', 'touchend'].forEach((evtType) => {
      document.addEventListener(evtType, (e) => {
        const fsBtn = e.target.closest('.vdo-fullscreen-btn, .outro-fullscreen-btn');
        if (!fsBtn) return;
        e.preventDefault();
        e.stopPropagation();

        if (fsBtn._lastTrigger && Date.now() - fsBtn._lastTrigger < 350) return;
        fsBtn._lastTrigger = Date.now();

        let videoEl = null;
        let containerEl = null;

        if (fsBtn.id === 'outroFullscreenBtn' || fsBtn.closest('.outro-video-card')) {
          containerEl = document.getElementById('outroVideoCard');
          videoEl = document.getElementById('outroVideoPlayer');
        } else {
          containerEl = fsBtn.closest('.surprise-vdo-wrapper') || fsBtn.closest('.editroom-vdo-frame') || fsBtn.closest('.surprise-vdo-card');
          videoEl = containerEl ? containerEl.querySelector('video') : null;
        }

        if (videoEl) {
          triggerUniversalFullscreen(videoEl, containerEl, fsBtn);
        }
      }, { capture: true, passive: false });
    });

    // Sync button states on WebKit and standard fullscreen events
    const syncAllButtons = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

      // Outro
      const outroCard = document.getElementById('outroVideoCard');
      const outroVdo = document.getElementById('outroVideoPlayer');
      const outroFsBtn = document.getElementById('outroFullscreenBtn');
      if (outroCard && outroFsBtn) {
        const isOutroFs = fsEl === outroCard || fsEl === outroVdo || (outroVdo && outroVdo.webkitDisplayingFullscreen === true);
        syncFsButtonState(outroFsBtn, isOutroFs);
        if (isOutroFs) outroCard.classList.add('is-fullscreen');
        else outroCard.classList.remove('is-fullscreen');
      }

      // Edit Room Surprise Videos
      document.querySelectorAll('.surprise-vdo-wrapper, .editroom-vdo-frame').forEach((wrapper) => {
        const vdo = wrapper.querySelector('.surprise-vdo-element');
        const btn = wrapper.querySelector('.vdo-fullscreen-btn');
        const isWrapperFs = fsEl === wrapper || fsEl === vdo || (vdo && vdo.webkitDisplayingFullscreen === true);
        if (btn) syncFsButtonState(btn, isWrapperFs);
        if (isWrapperFs) wrapper.classList.add('is-fullscreen');
        else wrapper.classList.remove('is-fullscreen');
      });
    };

    document.addEventListener('fullscreenchange', syncAllButtons);
    document.addEventListener('webkitfullscreenchange', syncAllButtons);
    document.addEventListener('mozfullscreenchange', syncAllButtons);
    document.addEventListener('MSFullscreenChange', syncAllButtons);

    // Attach iOS Safari specific events directly on each video
    document.querySelectorAll('video').forEach((v) => {
      v.addEventListener('webkitbeginfullscreen', syncAllButtons);
      v.addEventListener('webkitendfullscreen', syncAllButtons);
    });
  }

  initVideoFullscreenSystem();

  // ============================================================
  // SHAYARI CAROUSEL SLIDER CONTROLLER (CONTINUOUS INFINITE LOOP)
  // ============================================================
  (function initShayariSlider() {
    const track = document.getElementById('shayariSliderTrack');
    const viewport = document.getElementById('shayariTrackViewport');
    const prevBtnSide = document.getElementById('btnShayariPrev');
    const nextBtnSide = document.getElementById('btnShayariNext');

    if (!track) return;

    // Grab original cards
    const originalCards = track.querySelectorAll('.shayari-story-row');
    const totalCards = originalCards.length;
    if (totalCards === 0) return;

    const TRANSITION_STYLE = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    let isAnimating = false;
    let animSafetyTimer = null;

    // Create clones for seamless infinite looping
    // Structure: [Clone of Last, Card 0, Card 1, Card 2, Clone of First]
    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[totalCards - 1].cloneNode(true);
    firstClone.classList.add('is-clone');
    lastClone.classList.add('is-clone');

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalCards[0]);

    // Track index 1 corresponds to original card 0
    let currentIndex = 1;

    // Set initial position at real card 0 (track index 1)
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    void track.offsetHeight; // Force reflow

    function moveToIndex(targetIndex) {
      if (isAnimating) return;
      isAnimating = true;

      currentIndex = targetIndex;
      track.style.transition = TRANSITION_STYLE;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      clearTimeout(animSafetyTimer);
      animSafetyTimer = setTimeout(checkWrapAround, 550);
    }

    function checkWrapAround() {
      clearTimeout(animSafetyTimer);
      // If we smoothly slid into clone of first card (after last card)
      if (currentIndex === totalCards + 1) {
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        void track.offsetHeight;
      }
      // If we smoothly slid into clone of last card (before first card)
      else if (currentIndex === 0) {
        track.style.transition = 'none';
        currentIndex = totalCards;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        void track.offsetHeight;
      }
      isAnimating = false;
    }

    track.addEventListener('transitionend', (e) => {
      if (e.target !== track) return;
      checkWrapAround();
    });

    // Next & Prev handlers
    function nextSlide() {
      moveToIndex(currentIndex + 1);
    }

    function prevSlide() {
      moveToIndex(currentIndex - 1);
    }

    if (prevBtnSide) {
      prevBtnSide.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }
    if (nextBtnSide) {
      nextBtnSide.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Touch swipe support for mobile devices
    if (viewport) {
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Ensure horizontal swipe is dominant
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            nextSlide(); // Swipe left -> Next card in continuous loop
          } else {
            prevSlide(); // Swipe right -> Prev card in continuous loop
          }
        }
      }, { passive: true });
    }
  })();

  // Dynamic Scrollspy across Home, Letters, and Clock Footer
  window.addEventListener('scroll', () => {
    // Only update scrollspy if no modal is active
    if (!document.querySelector('.modal-overlay.active')) {
      updateScrollspyActive();
    }
  });

  // ------------------------------------------------------------
  // CINEMATIC BLACK SCREEN INTRO: THE GINI PARADISE & GROWING BLUE ROSES
  // ------------------------------------------------------------
  function initSiteIntro() {
    const introOverlay = document.getElementById('siteIntroScreen');
    if (!introOverlay) return;

    const typedTextEl = document.getElementById('introTypedText');
    const subtitleEl = document.getElementById('introSubtitle');
    const skipBtn = document.getElementById('introSkipBtn');

    const titleToType = "Welcome to Gini's Paradise ♡";
    let isIntroFinished = false;

    // Ensure body has intro-active initially
    document.body.classList.add('intro-active');

    // Setup SVG stem lengths for smooth stroke-dashoffset drawing
    const stems = introOverlay.querySelectorAll('.vine-stem');
    stems.forEach(stem => {
      try {
        const len = stem.getTotalLength ? stem.getTotalLength() : 100;
        stem.style.strokeDasharray = `${len}`;
        stem.style.strokeDashoffset = `${len}`;
      } catch (e) {
        stem.style.strokeDasharray = '100';
        stem.style.strokeDashoffset = '100';
      }
    });

    // 1. Typewriter Animation for "Welcome to Gini's Paradise ♡"
    let charIdx = 0;
    function runTypewriter() {
      if (isIntroFinished) return;
      if (charIdx < titleToType.length) {
        if (typedTextEl) {
          typedTextEl.textContent += titleToType.charAt(charIdx);
        }
        charIdx++;
        setTimeout(runTypewriter, 55);
      } else {
        // Typing finished -> show subtitle softly
        setTimeout(() => {
          if (!isIntroFinished && subtitleEl) {
            subtitleEl.classList.add('is-visible');
          }
        }, 320);
      }
    }

    // Start typewriter at T = 350ms
    setTimeout(runTypewriter, 350);

    // 2. Botanical Vine Stem Growth from bottom-left & bottom-right
    // Trigger at T = 1500ms
    setTimeout(() => {
      if (isIntroFinished) return;
      stems.forEach(stem => {
        stem.style.strokeDashoffset = '0';
        stem.classList.add('stem-drawn');
      });
    }, 1500);

    // 3. Sequential Leaves Unfurling (From Root to Tip)
    // Leaf 1 (near root) at T = 2200ms
    setTimeout(() => {
      if (isIntroFinished) return;
      introOverlay.querySelectorAll('.vine-leaf-1').forEach(leaf => leaf.classList.add('leaf-grown'));
    }, 2200);

    // Leaf 2 & 3 (mid branches) at T = 2750ms
    setTimeout(() => {
      if (isIntroFinished) return;
      introOverlay.querySelectorAll('.vine-leaf-2, .vine-leaf-3').forEach(leaf => leaf.classList.add('leaf-grown'));
    }, 2750);

    // Leaf 4 (sub-terminal below rose) at T = 3200ms
    setTimeout(() => {
      if (isIntroFinished) return;
      introOverlay.querySelectorAll('.vine-leaf-4').forEach(leaf => leaf.classList.add('leaf-grown'));
    }, 3200);

    // 4. Blue Rose Blooming at Crest of Vines at T = 3500ms
    setTimeout(() => {
      if (isIntroFinished) return;
      introOverlay.querySelectorAll('.vine-rose-bloom').forEach(rose => rose.classList.add('rose-bloomed'));
    }, 3500);

    // 5. Finish and Smooth Dissolve Transition into Main Site
    // At T = 5600ms (satisfies the >= 5s transition requirement)
    function finishIntroTransition() {
      if (isIntroFinished) return;
      isIntroFinished = true;

      // Start background music seamlessly if available
      try {
        if (typeof window.attemptAutoPlay === 'function' && !isCasettePlaying) {
          window.attemptAutoPlay();
        } else if (typeof window.playCasette === 'function' && !isCasettePlaying) {
          window.playCasette(false);
        }
      } catch (e) {}

      // Fade out the black screen with cinematic blur & scale
      introOverlay.classList.add('is-fading-out');

      // Re-enable document scrolling
      document.body.classList.remove('intro-active');

      setTimeout(() => {
        introOverlay.style.display = 'none';
        introOverlay.setAttribute('aria-hidden', 'true');
      }, 1300);
    }

    // Auto-transition after 5.6s
    const introTimer = setTimeout(finishIntroTransition, 5600);

    // Skip button manual trigger
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(introTimer);
        finishIntroTransition();
      });
    }
  }

    // Initialize intro on page load
    initSiteIntro();
  });

