/* ============================================================
   CYBERPUNK BLOG — Complete JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence(() => {
    initNoiseOverlay();
    initMouseGlow();
    initMatrixRain();
    initTypingEffect();
    initNavigation();
    initScrollEffects();
    initReadingProgress();
    initThemeSwitcher();
    initBlogSection();
    initNewsletter();
    initBackToTop();
    initSmoothScroll();
    initGlitchFlash();
    initParticles();
    initLiveClock();
    initStatsCounter();
    initKeyboardShortcuts();
    initKonamiCode();
    initRSS();
    initCardTilt();
  });
});

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
function initBootSequence(callback) {
  const screen = document.getElementById('boot-screen');
  const log = document.getElementById('boot-log');
  if (!screen || !log) { callback(); return; }

  const bootLines = [
    { text: 'CYBER//BLOG Firmware v4.7.1', cls: '' },
    { text: 'Copyright (c) 2026 终末之剑', cls: 'info' },
    { text: '', cls: '' },
    { text: '[BIOS] Initializing hardware abstraction layer...', cls: '' },
    { text: '[BIOS] Memory test: 64GB OK', cls: 'ok' },
    { text: '[BIOS] CPU: NEUROMANCER-X 16 cores @ 4.2GHz', cls: 'ok' },
    { text: '[BIOS] Neural interface: ONLINE', cls: 'ok' },
    { text: '', cls: '' },
    { text: '[KERNEL] Loading cyberpunk.sys...', cls: '' },
    { text: '[KERNEL] Mounting /dev/reality...', cls: 'ok' },
    { text: '[KERNEL] Loading network stack...', cls: '' },
    { text: '[KERNEL] Connecting to THE NET...', cls: 'ok' },
    { text: '[KERNEL] Firewall: ACTIVE | Encryption: AES-256', cls: 'info' },
    { text: '', cls: '' },
    { text: '[INIT] Starting services...', cls: '' },
    { text: '[INIT] neon-driver.service: STARTED', cls: 'ok' },
    { text: '[INIT] matrix-daemon.service: STARTED', cls: 'ok' },
    { text: '[INIT] blog-engine.service: STARTED', cls: 'ok' },
    { text: '[INIT] aesthetic-module.service: STARTED', cls: 'ok' },
    { text: '', cls: '' },
    { text: '[LOGIN] Authenticating...', cls: '' },
    { text: '[LOGIN] Welcome back, 终末之剑', cls: 'ok' },
    { text: '', cls: '' },
    { text: '> SYSTEM READY <', cls: 'ok' },
  ];

  let i = 0;
  function nextLine() {
    if (i >= bootLines.length) {
      setTimeout(() => {
        screen.classList.add('done');
        setTimeout(callback, 600);
      }, 300);
      return;
    }
    const { text, cls } = bootLines[i];
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text || ' ';
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    i++;
    const delay = text === '' ? 80 : Math.random() * 80 + 40;
    setTimeout(nextLine, delay);
  }
  nextLine();
}

/* --- Noise --- */
function initNoiseOverlay() {
  const canvas = document.createElement('canvas');
  canvas.id = 'noise-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0.03;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  function drawNoise() {
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = Math.random() * 255;
      data[i] = n; data[i + 1] = n; data[i + 2] = n;
      data[i + 3] = Math.random() * 20;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(() => { setTimeout(drawNoise, 100); });
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
  function resize() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = new Array(columns).fill(0);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF><{}[]|/\\';
  window.addEventListener('resize', () => { columns = Math.floor(canvas.width / fontSize); drops = new Array(columns).fill(0); });
  function draw() {
    ctx.fillStyle = 'rgba(6,6,8,0.06)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const x = i * fontSize, y = drops[i] * fontSize;
      ctx.fillStyle = '#00ff41'; ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
      for (let j = 1; j < 6; j++) {
        const ty = y - j * fontSize; if (ty < 0) continue;
        const alpha = 0.06 - j * 0.01; if (alpha <= 0) continue;
        ctx.fillStyle = `rgba(0,255,65,${alpha})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, ty);
      }
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 55);

  // Store reference for terminal command
  window._matrixCanvas = canvas;
  window._matrixIntensity = 1;
  window._matrixInterval = setInterval(draw, 55);
}

/* --- Typing + Interactive Terminal --- */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const lines = [
    { text: '> ssh cyberblog --connect', delay: 400, isCmd: true },
    { text: '', delay: 120 },
    { text: '[AUTH] 身份验证中...', delay: 300 },
    { text: '[AUTH] 生物特征识别通过 &#10003;', delay: 300 },
    { text: '[SYS] 加载用户配置...', delay: 250 },
    { text: '', delay: 120 },
    { text: '> cat ~/identity.dat', delay: 350, isCmd: true },
    { text: '', delay: 120 },
    { text: 'NAME:    <span class="highlight">终末之剑</span>', delay: 400 },
    { text: 'ROLE:    <span class="highlight">全栈开发者 / 开源贡献者</span>', delay: 400 },
    { text: 'STATUS:  <span class="highlight">ACTIVE // 持续学习中</span>', delay: 400 },
    { text: '', delay: 120 },
    { text: '> cat ~/stack.dat', delay: 300, isCmd: true },
    { text: '', delay: 120 },
    { text: 'LANG:    JavaScript · TypeScript · Python · Go', delay: 400 },
    { text: 'FE:      React · Vue · Three.js · WebGL · CSS', delay: 400 },
    { text: 'BE:      Node.js · PostgreSQL · Redis · Docker', delay: 400 },
    { text: 'TOOLS:   Git · Linux · Vim · AWS · CI/CD', delay: 400 },
    { text: '', delay: 120 },
    { text: '> echo $STATUS', delay: 300, isCmd: true },
    { text: '', delay: 120 },
    { text: '<span class="highlight">// ALL SYSTEMS OPERATIONAL</span>', delay: 500 },
    { text: '', delay: 200 },
    { text: '<span class="info">输入 help 查看可用命令...</span>', delay: 400 },
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
    if (lineIndex >= lines.length) { finishTyping(); return; }
    const { text, delay, isCmd } = lines[lineIndex];
    if (charIndex === 0) { currentLine = ''; if (isCmd) { el.innerHTML += '<span class="prompt">root@cyberblog:~#</span> '; } }
    if (charIndex < text.length) {
      if (text[charIndex] === '<') {
        const tagEnd = text.indexOf('>', charIndex);
        if (tagEnd !== -1) { currentLine += text.substring(charIndex, tagEnd + 1); charIndex = tagEnd + 1; el.innerHTML = getPreviousLines() + currentLine; setTimeout(typeChar, 0); return; }
      }
      currentLine += text[charIndex]; el.innerHTML = getPreviousLines() + currentLine;
      charIndex++; setTimeout(typeChar, Math.random() * 25 + 12);
    } else {
      el.innerHTML = getPreviousLines() + currentLine + '<br>';
      lineIndex++; charIndex = 0; setTimeout(typeChar, delay);
    }
  }

  function finishTyping() {
    // Remove cursor
    const oldCursor = el.querySelector('.cursor');
    if (oldCursor) oldCursor.remove();

    // Add interactive input line
    addTerminalPrompt();
  }

  function addTerminalPrompt() {
    const container = document.createElement('div');
    container.className = 'terminal-input-line';
    container.innerHTML = '<span class="prompt">root@cyberblog:~#</span>';
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'terminal-input';
    input.placeholder = '输入 help 查看命令...';
    input.autocomplete = 'off';
    input.spellcheck = false;
    container.appendChild(input);
    el.appendChild(container);

    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        input.value = '';
        executeTerminalCommand(cmd);
      }
    });

    // Focus input when clicking terminal
    document.getElementById('main-terminal').addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') input.focus();
    });
  }

  function executeTerminalCommand(cmd) {
    const output = document.createElement('div');
    output.className = 'terminal-output-line';
    output.innerHTML = '<span class="cmd-echo">root@cyberblog:~#</span> ' + escapeHtml(cmd);

    // Remove old input line
    const oldInput = document.getElementById('terminal-input');
    const oldContainer = oldInput ? oldInput.parentElement : null;

    if (oldContainer) {
      oldContainer.replaceWith(output);
    } else {
      el.appendChild(output);
    }

    // Handle commands
    let result = '';
    if (!cmd) {
      result = '';
    } else if (cmd === 'help') {
      result = `
        <span class="cyan">可用命令列表:</span><br>
        <span class="cmd-echo">help</span>       - 显示此帮助信息<br>
        <span class="cmd-echo">whoami</span>     - 显示个人信息<br>
        <span class="cmd-echo">neofetch</span>   - 显示系统信息<br>
        <span class="cmd-echo">ls</span>         - 列出网站板块<br>
        <span class="cmd-echo">cat blog</span>   - 跳转到博客<br>
        <span class="cmd-echo">cat about</span>  - 跳转到关于<br>
        <span class="cmd-echo">date</span>       - 显示当前时间<br>
        <span class="cmd-echo">theme &lt;g|c|m&gt;</span> - 切换主题<br>
        <span class="cmd-echo">matrix</span>     - 增强矩阵雨效果<br>
        <span class="cmd-echo">clear</span>      - 清除终端<br>
        <span class="cmd-echo">sudo</span>       - 你确定？<br>
        <span class="cmd-echo">exit</span>       - 离开终端
      `;
    } else if (cmd === 'whoami') {
      result = '<span class="cyan">终末之剑</span> — 全栈开发者 / 开源贡献者 / 赛博朋克爱好者';
    } else if (cmd === 'neofetch') {
      const d = new Date();
      result = `
        <span class="magenta">       ▄▄▄▄▄</span>   <span class="cyan">终末之剑</span>@<span class="cmd-echo">cyberblog</span><br>
        <span class="magenta">    ▄▀▀     ▀▀▄</span>  OS: Cyberpunk 2077<br>
        <span class="magenta">   █           █</span>  Kernel: NEUROMANCER-X<br>
        <span class="magenta">  █  ▀▀▀▀▀▀▀▀▀  █</span>  Shell: cyber-bash 4.7<br>
        <span class="magenta">  █ █▀▀     ▀▀█ █</span>  Uptime: ${Math.floor(Math.random() * 999)} days<br>
        <span class="magenta">  █▀ ▀▀▀▀▀▀▀▀▀ ▀█</span>  Theme: ${document.documentElement.getAttribute('data-theme') || 'neon-green'}<br>
        <span class="magenta">   ▀▄▄       ▄▄▀</span>   Time: ${d.toLocaleString('zh-CN')}<br>
        <span class="magenta">      ▀▀▀▀▀▀▀▀▀</span>
      `;
    } else if (cmd === 'ls') {
      result = 'blog/  about/  projects/  stats/  newsletter/  rss.xml';
    } else if (cmd === 'cat blog') {
      result = '正在跳转到博客板块...';
      setTimeout(() => { document.getElementById('blog').scrollIntoView({ behavior: 'smooth' }); }, 300);
    } else if (cmd === 'cat about') {
      result = '正在跳转到关于板块...';
      setTimeout(() => { document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }, 300);
    } else if (cmd === 'date') {
      result = new Date().toLocaleString('zh-CN');
    } else if (cmd.startsWith('theme ')) {
      const t = cmd.split(' ')[1];
      const map = { g: 'green', c: 'cyan', m: 'magenta', green: 'green', cyan: 'cyan', magenta: 'magenta' };
      const theme = map[t];
      if (theme) {
        if (theme === 'green') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cyberblog-theme', theme);
        document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.theme-dot.${theme}`);
        if (dot) dot.classList.add('active');
        result = `主题已切换为: ${theme}`;
      } else {
        result = '<span class="error">未知主题。可用: green, cyan, magenta</span>';
      }
    } else if (cmd === 'matrix') {
      window._matrixIntensity = (window._matrixIntensity || 1) + 0.5;
      const canvas = window._matrixCanvas;
      if (canvas) canvas.style.opacity = Math.min(0.3, 0.12 * window._matrixIntensity);
      result = `矩阵强度: ${Math.round(window._matrixIntensity * 100)}%`;
    } else if (cmd === 'clear') {
      el.innerHTML = '';
      addTerminalPrompt();
      return;
    } else if (cmd === 'sudo') {
      result = '<span class="error">Permission denied. 你不是 root。没有人是 root。</span>';
    } else if (cmd === 'exit') {
      result = 'Connection closed. 刷新页面重新连接。';
    } else {
      result = `<span class="error">命令未找到: ${escapeHtml(cmd)}。输入 help 查看可用命令。</span>`;
    }

    if (result) {
      const resultEl = document.createElement('div');
      resultEl.className = 'terminal-output-line';
      resultEl.innerHTML = result;
      el.appendChild(resultEl);
    }

    // Re-add input
    addTerminalPrompt();
    el.scrollTop = el.scrollHeight;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
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
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 100); });
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  links.forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute('id'); });
    links.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + current) l.classList.add('active'); });
  });
}

/* --- Scroll Effects --- */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* --- Reading Progress --- */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  });
}

/* --- Theme Switcher --- */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const saved = localStorage.getItem('cyberblog-theme') || 'green';
  if (saved !== 'green') document.documentElement.setAttribute('data-theme', saved);
  updateDot(saved);
  dots.forEach(d => { d.addEventListener('click', () => { const t = d.dataset.theme; if (t === 'green') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); localStorage.setItem('cyberblog-theme', t); updateDot(t); }); });
  function updateDot(t) { dots.forEach(d => d.classList.remove('active')); const a = document.querySelector(`.theme-dot.${t}`); if (a) a.classList.add('active'); }
}

/* ============================================================
   BLOG SECTION — enhanced
   ============================================================ */
function initBlogSection() {
  const grid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blog-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modalOverlay = document.getElementById('post-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  let activeFilter = 'all', searchQuery = '';
  const viewCounts = JSON.parse(localStorage.getItem('cyberblog-views') || '{}');

  function renderPosts() {
    let filtered = blogPosts;
    if (activeFilter !== 'all') filtered = filtered.filter(p => p.category === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="blog-empty">[!] NO RESULTS FOUND // 换个关键词试试...</div>';
      return;
    }

    grid.innerHTML = filtered.map(post => {
      const views = viewCounts[post.id] || post.views || 0;
      return `
        <article class="blog-card fade-in visible" data-post-id="${post.id}">
          <div class="card-sweep"></div>
          <div class="blog-card-header">
            <span class="blog-card-date">${post.date}</span>
            <span class="blog-card-readtime">${post.readtime} · ${views} views</span>
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-tags">
            ${post.tags.map(t => `<span class="blog-card-tag">#${t}</span>`).join('')}
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.postId);
        const post = blogPosts.find(p => p.id === id);
        if (post) {
          viewCounts[id] = (viewCounts[id] || 0) + 1;
          localStorage.setItem('cyberblog-views', JSON.stringify(viewCounts));
          openPostModal(post);
          // Update view count on card
          const vc = card.querySelector('.blog-card-readtime');
          if (vc) vc.textContent = `${post.readtime} · ${viewCounts[id]} views`;
        }
      });
    });

    initCardTiltOnCards();
  }

  function openPostModal(post) {
    const views = JSON.parse(localStorage.getItem('cyberblog-views') || '{}')[post.id] || 0;
    const tocHTML = generateTOC(post.content);
    const contentWithCopy = addCopyButtons(post.content);
    const relatedHTML = generateRelatedPosts(post);

    modalBody.innerHTML = `
      <div class="post-meta"><span>${post.date}</span><span>${post.readtime}</span><span>${views} 次阅读</span><span>#${post.category}</span></div>
      <h2 class="post-title">${post.title}</h2>
      ${tocHTML}
      <div class="post-content">${contentWithCopy}</div>
      <div class="post-tags">${post.tags.map(t => `<span class="filter-btn" style="pointer-events:none;">#${t}</span>`).join('')}</div>
      ${relatedHTML}
      <div class="share-buttons">
        <button class="share-btn" data-action="copy-url">&#128279; 复制链接</button>
        <button class="share-btn" data-action="copy-title">&#128196; 复制标题</button>
      </div>
    `;

    // Bind share buttons
    modalBody.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'copy-url') { navigator.clipboard.writeText(window.location.href).then(() => { btn.textContent = '已复制!'; setTimeout(() => btn.textContent = '复制链接', 1500); }); }
        if (action === 'copy-title') { navigator.clipboard.writeText(post.title).then(() => { btn.textContent = '已复制!'; setTimeout(() => btn.textContent = '复制标题', 1500); }); }
      });
    });

    // Bind related post clicks
    modalBody.querySelectorAll('.related-post-item').forEach(item => {
      item.addEventListener('click', () => {
        const rid = parseInt(item.dataset.postId);
        const rpost = blogPosts.find(p => p.id === rid);
        if (rpost) openPostModal(rpost);
      });
    });

    // Bind copy buttons
    modalBody.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement.querySelector('pre').textContent;
        navigator.clipboard.writeText(code).then(() => { btn.textContent = '已复制!'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500); });
      });
    });

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  searchInput.addEventListener('input', e => { searchQuery = e.target.value; renderPosts(); });
  filterBtns.forEach(btn => { btn.addEventListener('click', () => { filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderPosts(); }); });

  renderPosts();
}

function generateTOC(content) {
  const headingRegex = /<h2>(.*?)<\/h2>/g;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1].replace(/<[^>]*>/g, ''));
  }
  if (headings.length === 0) return '';
  return `
    <div class="post-toc">
      <div class="post-toc-title">> TABLE_OF_CONTENTS</div>
      ${headings.map((h, i) => `<a href="#" data-toc="${i}">${h}</a>`).join('')}
    </div>
  `;
}

function addCopyButtons(content) {
  return content.replace(/(<pre>[\s\S]*?<\/pre>)/g, (match) => {
    return `<div class="code-block-wrapper">${match}<button class="copy-btn">复制</button></div>`;
  });
}

function generateRelatedPosts(currentPost) {
  const related = blogPosts.filter(p => p.id !== currentPost.id && p.tags.some(t => currentPost.tags.includes(t))).slice(0, 3);
  if (related.length === 0) {
    // Fallback: just show other recent posts
    const others = blogPosts.filter(p => p.id !== currentPost.id).slice(0, 3);
    if (others.length === 0) return '';
    return `
      <div class="related-posts">
        <div class="related-posts-title">> RELATED_POSTS</div>
        <div class="related-posts-list">
          ${others.map(p => `<div class="related-post-item" data-post-id="${p.id}">${p.title} <span style="color:var(--text-muted);font-size:0.7rem;">${p.date}</span></div>`).join('')}
        </div>
      </div>
    `;
  }
  return `
    <div class="related-posts">
      <div class="related-posts-title">> RELATED_POSTS</div>
      <div class="related-posts-list">
        ${related.map(p => `<div class="related-post-item" data-post-id="${p.id}">${p.title} <span style="color:var(--text-muted);font-size:0.7rem;">${p.date}</span></div>`).join('')}
      </div>
    </div>
  `;
}

/* --- 3D Card Tilt --- */
function initCardTilt() { initCardTiltOnCards(); }
function initCardTiltOnCards() {
  document.querySelectorAll('.blog-card, .project-card').forEach(card => {
    const clone = card.cloneNode(true);
    card.parentNode.replaceChild(clone, card);
    clone.addEventListener('mousemove', (e) => {
      const rect = clone.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rx = (y - cy) / cy * -8, ry = (x - cx) / cx * 8;
      clone.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      clone.style.boxShadow = `${-ry}px ${-rx * 0.5}px 30px rgba(0,255,65,0.12), 0 0 20px rgba(0,255,65,0.08)`;
    });
    clone.addEventListener('mouseleave', () => { clone.style.transform = ''; clone.style.boxShadow = ''; });
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
      input.style.borderColor = 'var(--neon-red)'; input.style.boxShadow = '0 0 15px rgba(255,51,51,0.3)';
      setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 1500);
      return;
    }
    input.value = ''; success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 4000);
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const ring = document.getElementById('scroll-ring');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
    if (ring) {
      const progress = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
      const circumference = 50;
      ring.style.strokeDashoffset = circumference - progress * circumference;
      ring.style.stroke = 'var(--neon-primary)';
    }
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); }
    });
  });
}

/* --- Glitch Flash --- */
function initGlitchFlash() {
  const flash = document.createElement('div');
  flash.className = 'glitch-flash';
  document.body.appendChild(flash);
  function trigger() { flash.classList.add('active'); setTimeout(() => flash.classList.remove('active'), 150); setTimeout(trigger, Math.random() * 8000 + 4000); }
  setTimeout(trigger, 5000);
}

/* --- Particles --- */
function initParticles() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:9996;pointer-events:none;';
  document.body.appendChild(container);
  const particles = [];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;background:var(--neon-primary);border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;box-shadow:0 0 ${Math.random()*6+2}px var(--neon-primary);`;
    container.appendChild(el);
    particles.push({ el, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
  }
  function animate() {
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = window.innerWidth; if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight; if (p.y > window.innerHeight) p.y = 0;
      if (Math.random() < 0.005) { p.vx = (Math.random() - 0.5) * 0.4; p.vy = (Math.random() - 0.5) * 0.4; }
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --- Live Clock --- */
function initLiveClock() {
  const clock = document.getElementById('live-clock');
  if (!clock) return;
  function tick() {
    const now = new Date();
    const utc8 = new Date(now.getTime() + (8 - now.getTimezoneOffset() / 60) * 3600000);
    clock.textContent = `[${utc8.toISOString().replace('T', ' | ').slice(0, 19)} UTC+8]`;
  }
  tick(); setInterval(tick, 1000);
}

/* --- Stats Counter --- */
function initStatsCounter() {
  const cards = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  cards.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
  const duration = 2000 + Math.random() * 1000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

/* --- Keyboard Shortcuts --- */
function initKeyboardShortcuts() {
  const kbModal = document.getElementById('kb-modal');
  const kbClose = document.getElementById('kb-close');

  kbClose.addEventListener('click', () => { kbModal.classList.remove('open'); });
  kbModal.addEventListener('click', e => { if (e.target === kbModal) kbModal.classList.remove('open'); });

  document.addEventListener('keydown', (e) => {
    // Don't trigger when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();

    if (key === '?') {
      e.preventDefault();
      kbModal.classList.toggle('open');
    } else if (key === 'escape') {
      // Close modals
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    } else if (key === '1') { window.scrollTo({ top: document.getElementById('home').offsetTop - 80, behavior: 'smooth' }); }
    else if (key === '2') { window.scrollTo({ top: document.getElementById('blog').offsetTop - 80, behavior: 'smooth' }); }
    else if (key === '3') { window.scrollTo({ top: document.getElementById('about').offsetTop - 80, behavior: 'smooth' }); }
    else if (key === '4') { window.scrollTo({ top: document.getElementById('projects').offsetTop - 80, behavior: 'smooth' }); }
    else if (key === 't') {
      // Cycle theme
      const themes = ['green', 'cyan', 'magenta'];
      const current = localStorage.getItem('cyberblog-theme') || 'green';
      const idx = (themes.indexOf(current) + 1) % themes.length;
      const next = themes[idx];
      if (next === 'green') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cyberblog-theme', next);
      document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`.theme-dot.${next}`);
      if (dot) dot.classList.add('active');
    } else if (key === 'g') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* --- Konami Code --- */
function initKonamiCode() {
  const konami = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    const expected = konami[pos];
    if (e.key.toLowerCase() === expected) {
      pos++;
      if (pos === konami.length) {
        pos = 0;
        triggerEasterEgg();
      }
    } else {
      pos = 0;
    }
  });
}

function triggerEasterEgg() {
  const toast = document.createElement('div');
  toast.className = 'easter-egg-toast';
  toast.textContent = '>>> CYBERPUNK MODE ACTIVATED <<<';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);

  // Flash the background
  document.body.style.transition = 'background 0.2s';
  document.body.style.background = '#ff00ff';
  setTimeout(() => document.body.style.background = '', 200);
}

/* --- RSS --- */
function initRSS() {
  document.querySelectorAll('#rss-link, #rss-footer').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      generateRSS();
    });
  });
}

function generateRSS() {
  const items = blogPosts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${window.location.origin}${window.location.pathname}?post=${p.id}</link>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${p.category}</category>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>终末之剑 | CYBER//BLOG</title>
    <link>${window.location.origin}${window.location.pathname}</link>
    <description>赛博朋克风格个人技术博客</description>
    <language>zh-CN</language>
    ${items}
  </channel>
</rss>`;

  const blob = new Blob([rss], { type: 'application/rss+xml' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
