/* ============================================================
   CYBERPUNK BLOG — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initTypingEffect();
  initNavigation();
  initScrollEffects();
  initThemeSwitcher();
  initBlogSection();
  initNewsletter();
  initBackToTop();
  initSmoothScroll();
});

/* --- Matrix Rain Canvas --- */
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
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(0);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

/* --- Terminal Typing Effect --- */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const lines = [
    { text: '> cat intro.txt', delay: 300, isCmd: true },
    { text: '', delay: 200 },
    { text: '你好，我是 <span class="highlight">[你的名字]</span>', delay: 400 },
    { text: '一名全栈开发者 / 开源贡献者 / 赛博朋克爱好者', delay: 400 },
    { text: '', delay: 200 },
    { text: '> cat skills.txt --sort=proficiency', delay: 300, isCmd: true },
    { text: '', delay: 200 },
    { text: 'Languages:   JavaScript · TypeScript · Python · Go', delay: 400 },
    { text: 'Frontend:    React · Vue · CSS Mastery · WebGL', delay: 400 },
    { text: 'Backend:     Node.js · PostgreSQL · Redis · Docker', delay: 400 },
    { text: 'Tools:       Git · Linux · Vim · AWS · CI/CD', delay: 400 },
    { text: '', delay: 200 },
    { text: '> cat status.txt', delay: 300, isCmd: true },
    { text: '', delay: 200 },
    { text: 'STATUS:  <span class="highlight">// SYSTEM ONLINE</span>', delay: 400 },
    { text: 'MOOD:    <span class="highlight">// 持续学习中...</span>', delay: 400 },
    { text: 'BLOG:    <span class="highlight">// 最新文章已发布</span>', delay: 400 },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentLine = '';
  let isTag = false;
  const output = el;

  function typeChar() {
    if (lineIndex >= lines.length) return;

    const { text, delay, isCmd } = lines[lineIndex];

    // If we haven't started this line yet
    if (charIndex === 0) {
      currentLine = '';
      if (isCmd) {
        output.innerHTML += '<span class="prompt">visitor@cyberblog:~$</span> ';
      }
    }

    if (charIndex < text.length) {
      // Handle HTML tags — skip through them in one go
      if (text[charIndex] === '<') {
        const tagEnd = text.indexOf('>', charIndex);
        if (tagEnd !== -1) {
          currentLine += text.substring(charIndex, tagEnd + 1);
          charIndex = tagEnd + 1;
          output.innerHTML = getPreviousLines() + currentLine;
          setTimeout(typeChar, 0);
          return;
        }
      }

      currentLine += text[charIndex];
      output.innerHTML = getPreviousLines() + currentLine;
      charIndex++;
      const typingDelay = Math.random() * 30 + 15;
      setTimeout(typeChar, typingDelay);
    } else {
      // Line complete
      output.innerHTML = getPreviousLines() + currentLine + '<br>';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, delay);
    }
  }

  function getPreviousLines() {
    // Get all rendered lines up to current position
    const lines_rendered = [];
    for (let i = 0; i < lineIndex; i++) {
      const { text, isCmd } = lines[i];
      if (isCmd) {
        lines_rendered.push('<span class="prompt">visitor@cyberblog:~$</span> ' + text + '<br>');
      } else {
        lines_rendered.push(text + '<br>');
      }
    }
    return lines_rendered.join('');
  }

  // Add cursor element
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  output.appendChild(cursor);

  setTimeout(typeChar, 500);
}

/* --- Navigation --- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = navLinks.querySelectorAll('a');

  // Scroll effect on nav
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile hamburger
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

/* --- Scroll-based fade-in --- */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* --- Theme Switcher --- */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const saved = localStorage.getItem('cyberblog-theme') || 'green';

  document.documentElement.setAttribute('data-theme', saved);
  updateActiveDot(saved);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.dataset.theme;
      if (theme === 'green') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
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

  let activeFilter = 'all';
  let searchQuery = '';

  function renderPosts() {
    let filtered = blogPosts;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="blog-empty">[!] 没有找到匹配的文章，换个关键词试试...</div>';
      return;
    }

    grid.innerHTML = filtered.map(post => `
      <article class="blog-card fade-in visible" data-post-id="${post.id}">
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

    // Bind click events on cards
    grid.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.postId);
        const post = blogPosts.find(p => p.id === id);
        if (post) openPostModal(post);
      });
    });
  }

  function openPostModal(post) {
    modalBody.innerHTML = `
      <div class="post-meta">
        <span>${post.date}</span>
        <span>${post.readtime}</span>
        <span>#${post.category}</span>
      </div>
      <h2 class="post-title">${post.title}</h2>
      <div class="post-content">${post.content}</div>
      <div class="post-tags">
        ${post.tags.map(t => `<span class="filter-btn" style="pointer-events:none;">#${t}</span>`).join('')}
      </div>
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPosts();
  });

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

/* --- Newsletter --- */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const success = document.getElementById('newsletter-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = 'var(--neon-red)';
      input.style.boxShadow = '0 0 10px rgba(255, 51, 51, 0.3)';
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }, 1500);
      return;
    }

    // Simulated subscription
    input.value = '';
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 4000);
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Smooth Scroll for anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
