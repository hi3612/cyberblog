/* ============================================================
   CYBERPUNK BLOG — Enhanced JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNoiseOverlay();
  initMouseGlow();
  initMatrixRain();
  initTypingEffect();
  initNavigation();
  initScrollEffects();
  initThemeSwitcher();
  initBlogSection();
  initNewsletter();
  initBackToTop();
  initSmoothScroll();
  initGlitchFlash();
  initParticles();
  initCardTilt();
});

/* --- Noise Grain Canvas --- */
function initNoiseOverlay() {
  const canvas = document.createElement('canvas');
  canvas.id = 'noise-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0.03;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawNoise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = Math.random() * 20;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(() => {
      setTimeout(drawNoise, 100);
    });
  }
  drawNoise();
}

/* --- Mouse Glow --- */
function initMouseGlow() {
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* --- Matrix Rain --- */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = new Array(columns).fill(0);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF><{}[]|/\\';

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0);
  });

  function draw() {
    ctx.fillStyle = 'rgba(6, 6, 8, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Head character brighter
      ctx.fillStyle = '#00ff41';
      ctx.fillText(char, x, y);

      // Trail gradient
      for (let j = 1; j < 8; j++) {
        const trailY = y - j * fontSize;
        if (trailY < 0) continue;
        const alpha = 0.08 - j * 0.01;
        if (alpha <= 0) continue;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        const trailChar = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(trailChar, x, trailY);
      }

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 55);
}

/* --- Typing Effect --- */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const lines = [
    { text: '> ssh cyberblog --connect', delay: 400, isCmd: true },
    { text: '', delay: 150 },
    { text: '[AUTH] 身份验证中...', delay: 350 },
    { text: '[AUTH] 生物特征识别通过 &#10003;', delay: 350 },
    { text: '[SYS] 加载用户配置...', delay: 300 },
    { text: '', delay: 150 },
    { text: '> cat ~/identity.dat', delay: 350, isCmd: true },
    { text: '', delay: 150 },
    { text: 'NAME:    <span class="highlight">[你的名字]</span>', delay: 400 },
    { text: 'ROLE:    <span class="highlight">全栈开发者 / 开源贡献者</span>', delay: 400 },
    { text: 'STATUS:  <span class="highlight">ACTIVE // 持续学习中</span>', delay: 400 },
    { text: '', delay: 150 },
    { text: '> cat ~/stack.dat', delay: 350, isCmd: true },
    { text: '', delay: 150 },
    { text: 'LANG:    JavaScript · TypeScript · Python · Go', delay: 400 },
    { text: 'FE:      React · Vue · Three.js · WebGL · CSS', delay: 400 },
    { text: 'BE:      Node.js · PostgreSQL · Redis · Docker', delay: 400 },
    { text: 'TOOLS:   Git · Linux · Vim · AWS · CI/CD', delay: 400 },
    { text: '', delay: 150 },
    { text: '> echo $STATUS', delay: 300, isCmd: true },
    { text: '', delay: 150 },
    { text: '<span class="highlight">// ALL SYSTEMS OPERATIONAL</span>', delay: 500 },
  ];

  let lineIndex = 0, charIndex = 0, currentLine = '';

  function getPreviousLines() {
    const rendered = [];
    for (let i = 0; i < lineIndex; i++) {
      const { text, isCmd } = lines[i];
      if (isCmd) rendered.push('<span class="prompt">root@cyberblog:~#</span> ' + text + '<br>');
      else rendered.push(text + '<br>');
    }
    return rendered.join('');
  }

  function typeChar() {
    if (lineIndex >= lines.length) return;

    const { text, delay, isCmd } = lines[lineIndex];

    if (charIndex === 0) {
      currentLine = '';
      if (isCmd) {
        el.innerHTML += '<span class="prompt">root@cyberblog:~#</span> ';
      }
    }

    if (charIndex < text.length) {
      if (text[charIndex] === '<') {
        const tagEnd = text.indexOf('>', charIndex);
        if (tagEnd !== -1) {
          currentLine += text.substring(charIndex, tagEnd + 1);
          charIndex = tagEnd + 1;
          el.innerHTML = getPreviousLines() + currentLine;
          setTimeout(typeChar, 0);
          return;
        }
      }
      currentLine += text[charIndex];
      el.innerHTML = getPreviousLines() + currentLine;
      charIndex++;
      setTimeout(typeChar, Math.random() * 25 + 12);
    } else {
      el.innerHTML = getPreviousLines() + currentLine + '<br>';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, delay);
    }
  }

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  setTimeout(typeChar, 600);
}

/* --- Navigation --- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = navLinks.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 100);
  });

  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  links.forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

/* --- Scroll fade-in --- */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* --- Theme Switcher --- */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const saved = localStorage.getItem('cyberblog-theme') || 'green';

  if (saved !== 'green') document.documentElement.setAttribute('data-theme', saved);
  updateActiveDot(saved);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.dataset.theme;
      if (theme === 'green') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('cyberblog-theme', theme);
      updateActiveDot(theme);
    });
  });

  function updateActiveDot(theme) {
    dots.forEach(d => d.classList.remove('active'));
    const active = document.querySelector(`.theme-dot.${theme}`);
    if (active) active.classList.add('active');
  }
}

/* --- Blog Section --- */
function initBlogSection() {
  const grid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blog-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modalOverlay = document.getElementById('post-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  let activeFilter = 'all', searchQuery = '';

  function renderPosts() {
    let filtered = blogPosts;
    if (activeFilter !== 'all') filtered = filtered.filter(p => p.category === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="blog-empty">[!] NO RESULTS FOUND // 换个关键词试试...</div>';
      return;
    }

    grid.innerHTML = filtered.map(post => `
      <article class="blog-card fade-in visible" data-post-id="${post.id}">
        <div class="card-sweep"></div>
        <div class="blog-card-header">
          <span class="blog-card-date">${post.date}</span>
          <span class="blog-card-readtime">${post.readtime}</span>
        </div>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-tags">
          ${post.tags.map(t => `<span class="blog-card-tag">#${t}</span>`).join('')}
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.postId);
        const post = blogPosts.find(p => p.id === id);
        if (post) openPostModal(post);
      });
    });

    // Re-init card tilt on new cards
    initCardTiltOnCards();
  }

  function openPostModal(post) {
    modalBody.innerHTML = `
      <div class="post-meta"><span>${post.date}</span><span>${post.readtime}</span><span>#${post.category}</span></div>
      <h2 class="post-title">${post.title}</h2>
      <div class="post-content">${post.content}</div>
      <div class="post-tags">${post.tags.map(t => `<span class="filter-btn" style="pointer-events:none;">#${t}</span>`).join('')}</div>
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  searchInput.addEventListener('input', e => { searchQuery = e.target.value; renderPosts(); });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderPosts();
    });
  });

  renderPosts();
}

/* --- 3D Card Tilt --- */
function initCardTilt() {
  initCardTiltOnCards();
}

function initCardTiltOnCards() {
  document.querySelectorAll('.blog-card, .project-card').forEach(card => {
    // Remove existing listeners by cloning
    const clone = card.cloneNode(true);
    card.parentNode.replaceChild(clone, card);

    clone.addEventListener('mousemove', (e) => {
      const rect = clone.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      clone.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      clone.style.boxShadow = `
        ${-rotateY}px ${-rotateX * 0.5}px 30px rgba(0,255,65,0.12),
        0 0 20px rgba(0,255,65,0.08)
      `;
    });

    clone.addEventListener('mouseleave', () => {
      clone.style.transform = '';
      clone.style.boxShadow = '';
    });
  });
}

/* --- Newsletter --- */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const success = document.getElementById('newsletter-success');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = 'var(--neon-red)';
      input.style.boxShadow = '0 0 15px rgba(255,51,51,0.3)';
      setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 1500);
      return;
    }
    input.value = '';
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 4000);
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });
}

/* --- Random Glitch Flash --- */
function initGlitchFlash() {
  const flash = document.createElement('div');
  flash.className = 'glitch-flash';
  document.body.appendChild(flash);

  function triggerGlitch() {
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 150);
    // Schedule next random glitch
    const next = Math.random() * 8000 + 3000;
    setTimeout(triggerGlitch, next);
  }

  setTimeout(triggerGlitch, 5000);
}

/* --- Floating Particles --- */
function initParticles() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:9996;pointer-events:none;';
  document.body.appendChild(container);

  const particles = [];
  const maxParticles = 25;

  for (let i = 0; i < maxParticles; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      background: var(--neon-primary);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      box-shadow: 0 0 ${Math.random() * 6 + 2}px var(--neon-primary);
      transition: transform 0.05s linear;
    `;
    container.appendChild(el);

    particles.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    });
  }

  function animate() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      // Occasionally change direction
      if (Math.random() < 0.005) {
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = (Math.random() - 0.5) * 0.4;
      }

      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
    requestAnimationFrame(animate);
  }

  animate();
}
