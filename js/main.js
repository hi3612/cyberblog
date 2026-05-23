/* ============================================================
   CYBERPUNK BLOG — Complete Interactive JavaScript
   ============================================================ */

/* ============================================================
   DATA STORES (localStorage-backed)
   ============================================================ */
const DB = {
  getUsers() { return JSON.parse(localStorage.getItem('cb-users') || '[]'); },
  saveUsers(u) { localStorage.setItem('cb-users', JSON.stringify(u)); },
  getCurrentUser() { return JSON.parse(localStorage.getItem('cb-currentUser') || 'null'); },
  setCurrentUser(u) { localStorage.setItem('cb-currentUser', JSON.stringify(u)); },
  getComments() { return JSON.parse(localStorage.getItem('cb-comments') || '[]'); },
  saveComments(c) { localStorage.setItem('cb-comments', JSON.stringify(c)); },
  getLikes() { return JSON.parse(localStorage.getItem('cb-likes') || '{}'); },
  saveLikes(l) { localStorage.setItem('cb-likes', JSON.stringify(l)); },
  getMessages() { return JSON.parse(localStorage.getItem('cb-messages') || '[]'); },
  saveMessages(m) { localStorage.setItem('cb-messages', JSON.stringify(m)); },
  getReadingHistory() { return JSON.parse(localStorage.getItem('cb-history') || '[]'); },
  saveReadingHistory(h) { localStorage.setItem('cb-history', JSON.stringify(h)); },
};

/* ============================================================
   BOOT & MAIN INIT
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
    initAuthUI();
    initBlogSection();
    initGuestbook();
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
    initGlobalModals();
    initCardTilt();
    initSoundSystem();
    initAchievementSystem();
    initPasswordStrength();
    initTextScramble();
    initCursorTrail();
  });
});

/* --- Boot --- */
function initBootSequence(callback) {
  const screen = document.getElementById('boot-screen');
  const log = document.getElementById('boot-log');
  if (!screen || !log) { callback(); return; }

  // Safety timeout: force dismiss after 10 seconds
  let bootDone = false;
  const safetyTimer = setTimeout(() => {
    if (bootDone) return;
    bootDone = true;
    screen.classList.add('done');
    callback();
  }, 10000);
  const lines = [
    { t: 'CYBER//BLOG Firmware v4.7.1', c: '' },
    { t: '', c: '' },
    { t: '[BIOS] Initializing hardware...', c: '' },
    { t: '[BIOS] Memory test: 64GB OK', c: 'ok' },
    { t: '[BIOS] Neural interface: ONLINE', c: 'ok' },
    { t: '', c: '' },
    { t: '[KERNEL] Loading cyberpunk.sys...', c: '' },
    { t: '[KERNEL] Network stack: ONLINE', c: 'ok' },
    { t: '[KERNEL] Firewall: ACTIVE', c: 'info' },
    { t: '', c: '' },
    { t: '[INIT] neon-driver.service: STARTED', c: 'ok' },
    { t: '[INIT] matrix-daemon.service: STARTED', c: 'ok' },
    { t: '[INIT] blog-engine.service: STARTED', c: 'ok' },
    { t: '', c: '' },
    { t: '[LOGIN] Authenticating...', c: '' },
    { t: '[LOGIN] Welcome back, 终末之剑', c: 'ok' },
    { t: '', c: '' },
    { t: '> SYSTEM READY <', c: 'ok' },
  ];
  let i = 0;
  function next() {
    if (i >= lines.length) {
      if (bootDone) return;
      bootDone = true;
      clearTimeout(safetyTimer);
      setTimeout(() => { screen.classList.add('done'); setTimeout(callback, 600); }, 300);
      return;
    }
    const { t, c } = lines[i];
    const d = document.createElement('div');
    if (c) d.className = c;
    d.textContent = t || '\xa0';
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    i++;
    setTimeout(next, t === '' ? 80 : Math.random() * 80 + 40);
  }
  next();
}

/* --- Noise --- */
function initNoiseOverlay() {
  const canvas = document.createElement('canvas');
  canvas.id = 'noise-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0.03;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  function rs() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  rs(); window.addEventListener('resize', rs);
  function draw() {
    const w = canvas.width, h = canvas.height;
    const d = ctx.createImageData(w, h).data;
    for (let i = 0; i < d.length; i += 4) { const n = Math.random() * 255; d[i] = n; d[i + 1] = n; d[i + 2] = n; d[i + 3] = Math.random() * 20; }
    ctx.putImageData(new ImageData(d, w, h), 0, 0);
    requestAnimationFrame(() => setTimeout(draw, 100));
  }
  draw();
}

/* --- Mouse Glow --- */
function initMouseGlow() {
  const g = document.createElement('div'); g.className = 'mouse-glow'; document.body.appendChild(g);
  document.addEventListener('mousemove', e => { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
}

/* --- Matrix Rain --- */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-bg'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function rs() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
  rs(); window.addEventListener('resize', rs);
  const fs = 14;
  let cols = Math.floor(canvas.width / fs);
  let drops = new Array(cols).fill(0);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF><{}[]|/\\';
  window.addEventListener('resize', () => { cols = Math.floor(canvas.width / fs); drops = new Array(cols).fill(0); });
  function draw() {
    ctx.fillStyle = 'rgba(6,6,8,0.06)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fs + 'px "JetBrains Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const x = i * fs, y = drops[i] * fs;
      ctx.fillStyle = '#00ff41'; ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
      for (let j = 1; j < 5; j++) { const ty = y - j * fs; if (ty < 0) continue; ctx.fillStyle = `rgba(0,255,65,${0.05 - j * 0.01})`; if (0.05 - j * 0.01 > 0) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, ty); }
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 55);
  window._matrixCanvas = canvas; window._matrixIntensity = 1;
}

/* --- Typing + Interactive Terminal --- */
function initTypingEffect() {
  const el = document.getElementById('typing-text'); if (!el) return;
  const lines = [
    { text: '> ssh cyberblog --connect', delay: 400, isCmd: true },
    { text: '', delay: 100 },
    { text: '[AUTH] 身份验证中...', delay: 280 },
    { text: '[AUTH] 生物特征识别通过 &#10003;', delay: 280 },
    { text: '', delay: 100 },
    { text: '> cat ~/identity.dat', delay: 320, isCmd: true },
    { text: '', delay: 100 },
    { text: 'NAME:    <span class="highlight">终末之剑</span>', delay: 400 },
    { text: 'ROLE:    <span class="highlight">全栈开发者 / 开源贡献者</span>', delay: 400 },
    { text: 'STATUS:  <span class="highlight">ACTIVE // 持续学习中</span>', delay: 400 },
    { text: '', delay: 100 },
    { text: '> echo $STATUS', delay: 280, isCmd: true },
    { text: '', delay: 100 },
    { text: '<span class="highlight">// ALL SYSTEMS OPERATIONAL</span>', delay: 500 },
    { text: '', delay: 180 },
    { text: '<span class="info">输入 help 查看可用命令...</span>', delay: 350 },
  ];
  let lineIdx = 0, charIdx = 0, curLine = '';

  function prevLines() {
    const r = [];
    for (let i = 0; i < lineIdx; i++) {
      const { text, isCmd } = lines[i];
      if (isCmd) r.push('<span class="prompt">root@cyberblog:~#</span> ' + text + '<br>');
      else r.push(text + '<br>');
    }
    return r.join('');
  }

  function typeChar() {
    if (lineIdx >= lines.length) { finishTyping(); return; }
    const { text, delay, isCmd } = lines[lineIdx];
    if (charIdx === 0) { curLine = ''; if (isCmd) el.innerHTML += '<span class="prompt">root@cyberblog:~#</span> '; }
    if (charIdx < text.length) {
      if (text[charIdx] === '<') { const te = text.indexOf('>', charIdx); if (te !== -1) { curLine += text.substring(charIdx, te + 1); charIdx = te + 1; el.innerHTML = prevLines() + curLine; setTimeout(typeChar, 0); return; } }
      curLine += text[charIdx]; el.innerHTML = prevLines() + curLine;
      charIdx++; setTimeout(typeChar, Math.random() * 12 + 5);
    } else {
      el.innerHTML = prevLines() + curLine + '<br>';
      lineIdx++; charIdx = 0; setTimeout(typeChar, delay);
    }
  }

  function finishTyping() {
    const c = el.querySelector('.cursor'); if (c) c.remove();
    addPrompt();
  }

  function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function addPrompt() {
    const div = document.createElement('div'); div.className = 'terminal-input-line';
    div.innerHTML = '<span class="prompt">root@cyberblog:~#</span>';
    const inp = document.createElement('input');
    inp.type = 'text'; inp.id = 'terminal-input';
    inp.placeholder = '输入 help 查看命令...'; inp.autocomplete = 'off'; inp.spellcheck = false;
    div.appendChild(inp); el.appendChild(div);
    inp.focus();
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const cmd = inp.value.trim().toLowerCase(); inp.value = ''; exec(cmd); }
    });
    document.getElementById('main-terminal').addEventListener('click', e => { if (e.target.tagName !== 'INPUT') inp.focus(); });
  }

  function exec(cmd) {
    const out = document.createElement('div'); out.className = 'terminal-output-line';
    out.innerHTML = '<span class="cmd-echo">root@cyberblog:~#</span> ' + escHtml(cmd);
    const old = document.getElementById('terminal-input'); const oldC = old ? old.parentElement : null;
    if (oldC) oldC.replaceWith(out); else el.appendChild(out);

    let result = '';
    if (!cmd) { result = ''; }
    else if (cmd === 'help') {
      result = '<span class="cyan">命令列表:</span><br><span class="cmd-echo">help</span> / <span class="cmd-echo">whoami</span> / <span class="cmd-echo">neofetch</span> / <span class="cmd-echo">ls</span> / <span class="cmd-echo">cat blog|about</span> / <span class="cmd-echo">date</span> / <span class="cmd-echo">theme g|c|m</span> / <span class="cmd-echo">matrix</span> / <span class="cmd-echo">clear</span> / <span class="cmd-echo">sudo</span> / <span class="cmd-echo">exit</span>';
    } else if (cmd === 'whoami') { result = '<span class="cyan">终末之剑</span> — 全栈开发者 / 开源贡献者 / 赛博朋克爱好者'; }
    else if (cmd === 'neofetch') {
      const d = new Date();
      result = `<span class="magenta">      ▄▄▄▄▄</span>   <span class="cyan">终末之剑</span>@cyberblog<br><span class="magenta">   ▄▀▀     ▀▀▄</span>  OS: Cyberpunk 2077<br><span class="magenta">  █           █</span>  Shell: cyber-bash<br><span class="magenta"> █  ▀▀▀▀▀▀▀▀▀  █</span>  Time: ${d.toLocaleString('zh-CN')}<br><span class="magenta">  ▀▄▄       ▄▄▀</span>   Theme: ${document.documentElement.getAttribute('data-theme') || 'neon-green'}<br><span class="magenta">     ▀▀▀▀▀▀▀▀▀</span>`;
    } else if (cmd === 'ls') { result = 'blog/  about/  projects/  stats/  guestbook/  rss.xml'; }
    else if (cmd === 'cat blog') { result = '跳转到博客...'; setTimeout(() => document.getElementById('blog').scrollIntoView({ behavior: 'smooth' }), 300); }
    else if (cmd === 'cat about') { result = '跳转到关于...'; setTimeout(() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }), 300); }
    else if (cmd === 'date') { result = new Date().toLocaleString('zh-CN'); }
    else if (cmd.startsWith('theme ')) {
      const t = cmd.split(' ')[1]; const m = { g: 'green', c: 'cyan', m: 'magenta', green: 'green', cyan: 'cyan', magenta: 'magenta' };
      const th = m[t];
      if (th) { if (th === 'green') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', th); localStorage.setItem('cyberblog-theme', th); document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active')); const dot = document.querySelector(`.theme-dot.${th}`); if (dot) dot.classList.add('active'); result = `主题: ${th}`; }
      else { result = '<span class="error">未知主题。可用: green, cyan, magenta</span>'; }
    } else if (cmd === 'matrix') { window._matrixIntensity = (window._matrixIntensity || 1) + 0.5; if (window._matrixCanvas) window._matrixCanvas.style.opacity = Math.min(0.3, 0.12 * window._matrixIntensity); result = `矩阵强度: ${Math.round(window._matrixIntensity * 100)}%`; }
    else if (cmd === 'clear') { el.innerHTML = ''; addPrompt(); return; }
    else if (cmd === 'sudo') { result = '<span class="error">Permission denied. 你不是 root。</span>'; }
    else if (cmd === 'exit') { result = 'Connection closed.'; }
    else { result = `<span class="error">命令未找到: ${escHtml(cmd)}。输入 help 查看。</span>`; }

    if (result) { const re = document.createElement('div'); re.className = 'terminal-output-line'; re.innerHTML = result; el.appendChild(re); }
    addPrompt(); el.scrollTop = el.scrollHeight;
  }

  const cur = document.createElement('span'); cur.className = 'cursor'; el.appendChild(cur);
  setTimeout(typeChar, 600);
}

/* --- Navigation --- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const nl = document.querySelector('.nav-links');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 100));
  hamburger.addEventListener('click', () => nl.classList.toggle('open'));
  nl.querySelectorAll('a').forEach(l => l.addEventListener('click', () => nl.classList.remove('open')));
  const secs = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 150) cur = s.getAttribute('id'); });
    nl.querySelectorAll('a').forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + cur) l.classList.add('active'); });
  });
}

/* --- Scroll Effects --- */
function initScrollEffects() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

/* --- Reading Progress --- */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  window.addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - window.innerHeight; bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%'; });
}

/* --- Theme --- */
function initThemeSwitcher() {
  const dots = document.querySelectorAll('.theme-dot');
  const saved = localStorage.getItem('cyberblog-theme') || 'green';
  if (saved !== 'green') document.documentElement.setAttribute('data-theme', saved);
  update(saved);
  dots.forEach(d => d.addEventListener('click', () => { const t = d.dataset.theme; if (t === 'green') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); localStorage.setItem('cyberblog-theme', t); update(t); unlockAchievement('theme_switch'); }));
  function update(t) { dots.forEach(d => d.classList.remove('active')); const a = document.querySelector(`.theme-dot.${t}`); if (a) a.classList.add('active'); }
}

/* ============================================================
   AUTH SYSTEM
   ============================================================ */
function initAuthUI() {
  const area = document.getElementById('nav-auth-area');
  let user = DB.getCurrentUser();
  renderAuthArea();

  function renderAuthArea() {
    user = DB.getCurrentUser();
    if (user) {
      area.innerHTML = `
        <div class="user-menu">
          <div class="user-avatar">${user.username[0].toUpperCase()}</div>
          <span class="user-name">${user.username}</span>
          <div class="user-dropdown">
            <a href="#" data-action="history">&#9776; 阅读记录</a>
            <a href="#" data-action="likes">&#9825; 我的收藏</a>
            <div class="divider"></div>
            <a href="#" class="logout" data-action="logout">退出登录</a>
          </div>
        </div>
      `;
      const avatar = area.querySelector('.user-avatar');
      const dropdown = area.querySelector('.user-dropdown');
      avatar.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('open'); });
      area.querySelector('[data-action="logout"]').addEventListener('click', e => { e.preventDefault(); DB.setCurrentUser(null); renderAuthArea(); showToast('已退出登录'); });
      area.querySelector('[data-action="history"]').addEventListener('click', e => { e.preventDefault(); showReadingHistory(); dropdown.classList.remove('open'); });
      area.querySelector('[data-action="likes"]').addEventListener('click', e => { e.preventDefault(); showMyLikes(); dropdown.classList.remove('open'); });
    } else {
      area.innerHTML = '<button class="btn btn-sm" id="btn-login">> 登录</button>';
      document.getElementById('btn-login').addEventListener('click', openAuthModal);
    }
  }

  // Auth Modal
  const authModal = document.getElementById('auth-modal');
  const authBody = document.getElementById('auth-body');
  let isRegister = false;

  function openAuthModal() {
    isRegister = false;
    updateAuthForm();
    authModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateAuthForm() {
    document.getElementById('auth-title').textContent = isRegister ? '> REGISTER' : '> LOGIN';
    document.getElementById('auth-email-field').style.display = isRegister ? 'block' : 'none';
    document.getElementById('auth-confirm-field').style.display = isRegister ? 'block' : 'none';
    document.getElementById('auth-submit').textContent = isRegister ? '注册' : '登录';
    document.getElementById('auth-switch-text').textContent = isRegister ? '已有账号？' : '没有账号？';
    document.getElementById('auth-switch').textContent = isRegister ? '登录' : '注册';
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-form').reset();
  }

  document.getElementById('auth-close').addEventListener('click', () => { authModal.classList.remove('open'); document.body.style.overflow = ''; });
  authModal.addEventListener('click', e => { if (e.target === authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; } });
  document.getElementById('auth-switch').addEventListener('click', e => { e.preventDefault(); isRegister = !isRegister; updateAuthForm(); });

  document.getElementById('auth-form').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    const errEl = document.getElementById('auth-error');

    if (!username || !password) { errEl.textContent = '请填写所有必填字段'; errEl.style.display = 'block'; return; }
    if (username.length < 2) { errEl.textContent = '用户名至少 2 个字符'; errEl.style.display = 'block'; return; }
    if (password.length < 4) { errEl.textContent = '密码至少 4 个字符'; errEl.style.display = 'block'; return; }

    const users = DB.getUsers();

    if (isRegister) {
      const email = document.getElementById('auth-email').value.trim();
      const confirm = document.getElementById('auth-confirm').value;
      if (password !== confirm) { errEl.textContent = '两次密码不一致'; errEl.style.display = 'block'; return; }
      if (users.find(u => u.username === username)) { errEl.textContent = '用户名已存在'; errEl.style.display = 'block'; return; }
      const newUser = { id: Date.now(), username, email, password, createdAt: new Date().toISOString() };
      users.push(newUser);
      DB.saveUsers(users);
      DB.setCurrentUser(newUser);
      authModal.classList.remove('open');
      document.body.style.overflow = '';
      renderAuthArea();
      showToast('注册成功！欢迎 ' + username);
      unlockAchievement('first_login');
    } else {
      const found = users.find(u => u.username === username && u.password === password);
      if (!found) { errEl.textContent = '用户名或密码错误'; errEl.style.display = 'block'; return; }
      DB.setCurrentUser(found);
      authModal.classList.remove('open');
      document.body.style.overflow = '';
      renderAuthArea();
      showToast('欢迎回来，' + username);
      unlockAchievement('first_login');
    }
  });

  // Single global handler for closing user dropdowns (only when clicking outside)
  document.addEventListener('click', (e) => {
    const menu = e.target.closest('.user-menu');
    if (menu) return; // Don't close if clicking inside the user menu
    const openDropdown = document.querySelector('.user-dropdown.open');
    if (openDropdown) openDropdown.classList.remove('open');
  });

  window._renderAuthArea = renderAuthArea;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:20001;background:var(--bg-card);border:1px solid var(--neon-primary);border-radius:var(--radius-md);padding:12px 24px;font-family:var(--font-mono);font-size:0.82rem;color:var(--neon-primary);letter-spacing:0.06em;box-shadow:0 0 20px var(--border-glow);animation:fadeInUp 0.3s ease;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
}

/* ============================================================
   BLOG SECTION — Event Delegation (FIXED)
   ============================================================ */
function initBlogSection() {
  const grid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blog-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modalOverlay = document.getElementById('post-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  let activeFilter = 'all', searchQuery = '', currentPostId = null;

  function renderPosts() {
    let filtered = blogPosts;
    if (activeFilter !== 'all') filtered = filtered.filter(p => p.category === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="blog-empty">[!] NO RESULTS FOUND</div>';
      return;
    }

    grid.innerHTML = filtered.map(post => {
      const likes = DB.getLikes();
      const postLikes = likes[post.id] || [];
      return `
        <article class="blog-card fade-in visible" data-post-id="${post.id}">
          <div class="card-sweep"></div>
          <div class="blog-card-header">
            <span class="blog-card-date">${post.date}</span>
            <span class="blog-card-readtime">${post.readtime} · ${post.views || 0} 阅读</span>
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-tags">${post.tags.map(t => `<span class="blog-card-tag">#${t}</span>`).join('')}</div>
        </article>
      `;
    }).join('');

    // Re-init tilt effects (NO CLONING)
    initCardTiltOnCards();
  }

  // CRITICAL: Use event delegation for blog card clicks
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.blog-card');
    if (!card) return;
    const id = parseInt(card.dataset.postId);
    const post = blogPosts.find(p => p.id === id);
    if (post) openPostModal(post);
  });

  function openPostModal(post) {
    currentPostId = post.id;

    // Track reading history
    const user = DB.getCurrentUser();
    if (user) {
      const history = DB.getReadingHistory();
      const filtered = history.filter(h => h.postId !== post.id);
      filtered.unshift({ postId: post.id, title: post.title, date: new Date().toISOString() });
      DB.saveReadingHistory(filtered.slice(0, 20));
    }

    const views = post.views || 0;
    const tocHTML = genTOC(post.content);
    const contentWithCopy = addCopyBtns(post.content);
    const relatedHTML = genRelated(post);
    const commentsHTML = genComments(post.id);
    const likes = DB.getLikes();
    const postLikes = likes[post.id] || [];
    const isLiked = user ? postLikes.includes(user.id) : false;

    modalBody.innerHTML = `
      <div class="post-meta"><span>${post.date}</span><span>${post.readtime}</span><span>${views} 阅读</span><span>${postLikes.length} 喜欢</span><span>#${post.category}</span></div>
      <h2 class="post-title">${post.title}</h2>
      ${tocHTML}
      <div class="post-content">${contentWithCopy}</div>
      <button class="like-btn ${isLiked ? 'liked' : ''}" id="like-btn" data-post-id="${post.id}">
        <span class="like-icon">${isLiked ? '&#9829;' : '&#9825;'}</span>
        <span id="like-count">${postLikes.length}</span> 喜欢
      </button>
      <div class="post-tags">${post.tags.map(t => `<span class="filter-btn" style="pointer-events:none;">#${t}</span>`).join('')}</div>
      <div class="share-buttons">
        <button class="share-btn" data-action="copy-url">&#128279; 复制链接</button>
        <button class="share-btn" data-action="copy-title">&#128196; 复制标题</button>
      </div>
      ${relatedHTML}
      ${commentsHTML}
    `;

    // Bind like button
    const likeBtn = modalBody.querySelector('#like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => toggleLike(post.id, likeBtn));
    }

    // Bind share buttons
    modalBody.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'copy-url') { navigator.clipboard.writeText(window.location.href).then(() => { btn.textContent = '已复制!'; setTimeout(() => btn.textContent = '复制链接', 1500); }).catch(() => {}); }
        if (btn.dataset.action === 'copy-title') { navigator.clipboard.writeText(post.title).then(() => { btn.textContent = '已复制!'; setTimeout(() => btn.textContent = '复制标题', 1500); }); }
      });
    });

    // Bind related posts
    modalBody.querySelectorAll('.related-post-item').forEach(item => {
      item.addEventListener('click', () => {
        const rid = parseInt(item.dataset.postId);
        const rpost = blogPosts.find(p => p.id === rid);
        if (rpost) openPostModal(rpost);
      });
    });

    // Bind copy code buttons
    modalBody.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement.querySelector('pre').textContent;
        navigator.clipboard.writeText(code).then(() => { btn.textContent = '已复制!'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500); });
      });
    });

    // Bind comment form
    const commentForm = modalBody.querySelector('#comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', e => {
        e.preventDefault();
        const user = DB.getCurrentUser();
        if (!user) { showToast('请先登录后再评论'); return; }
        const textarea = commentForm.querySelector('textarea');
        const text = textarea.value.trim();
        if (!text) return;
        const comments = DB.getComments();
        comments.push({ id: Date.now(), postId: post.id, userId: user.id, username: user.username, text, date: new Date().toISOString() });
        DB.saveComments(comments);
        textarea.value = '';
        unlockAchievement('first_comment');
        // Refresh only the comments list, preserving the form
        const commentsList = modalBody.querySelector('.comments-list');
        if (commentsList) {
          commentsList.innerHTML = genCommentsContent(post.id);
          bindCommentDelete(modalBody, post.id);
        }
      });
    }

    bindCommentDelete(modalBody, post.id);

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window._openPostModal = openPostModal;

  function closeModal() { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; currentPostId = null; }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  searchInput.addEventListener('input', e => { searchQuery = e.target.value; renderPosts(); });
  filterBtns.forEach(btn => btn.addEventListener('click', () => { filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderPosts(); }));

  renderPosts();
}

function toggleLike(postId, btn) {
  const user = DB.getCurrentUser();
  if (!user) { showToast('请先登录后再点赞'); return; }
  const likes = DB.getLikes();
  if (!likes[postId]) likes[postId] = [];
  const idx = likes[postId].indexOf(user.id);
  if (idx === -1) { likes[postId].push(user.id); btn.classList.add('liked'); btn.querySelector('.like-icon').innerHTML = '&#9829;'; unlockAchievement('first_like'); }
  else { likes[postId].splice(idx, 1); btn.classList.remove('liked'); btn.querySelector('.like-icon').innerHTML = '&#9825;'; }
  DB.saveLikes(likes);
  const count = btn.querySelector('#like-count'); if (count) count.textContent = likes[postId].length;
}

/* --- TOC --- */
function genTOC(content) {
  const re = /<h2[^>]*>(.*?)<\/h2>/g; const h = []; let m;
  while ((m = re.exec(content)) !== null) h.push(m[1].replace(/<[^>]*>/g, ''));
  if (h.length === 0) return '';
  return `<div class="post-toc"><div class="post-toc-title">> TABLE_OF_CONTENTS</div>${h.map((t, i) => `<a href="#" data-toc="${i}">${t}</a>`).join('')}</div>`;
}

/* --- Copy Buttons --- */
function addCopyBtns(content) {
  return content.replace(/(<pre[^>]*>[\s\S]*?<\/pre>)/g, m => `<div class="code-block-wrapper">${m}<button class="copy-btn">复制</button></div>`);
}

/* --- Related Posts --- */
function genRelated(cur) {
  const related = blogPosts.filter(p => p.id !== cur.id && p.tags.some(t => cur.tags.includes(t))).slice(0, 3);
  const list = related.length ? related : blogPosts.filter(p => p.id !== cur.id).slice(0, 3);
  if (!list.length) return '';
  return `<div class="related-posts"><div class="related-posts-title">> RELATED_POSTS</div><div class="related-posts-list">${list.map(p => `<div class="related-post-item" data-post-id="${p.id}">${p.title} <span style="color:var(--text-muted);font-size:0.68rem;">${p.date}</span></div>`).join('')}</div></div>`;
}

/* --- Comments --- */
function genComments(postId) {
  const user = DB.getCurrentUser();
  const formHTML = user
    ? `<form id="comment-form" class="comment-form"><textarea placeholder="> 写下你的评论..." rows="2"></textarea><button type="submit" class="btn btn-sm btn-primary">发表</button></form>`
    : '<p class="comment-login-hint">请<a href="#" id="comment-login-link">登录</a>后发表评论</p>';

  return `<div class="comments-section"><div class="comments-title">> COMMENTS</div>${formHTML}<div class="comments-list">${genCommentsContent(postId)}</div></div>`;
}

function genCommentsContent(postId) {
  const comments = DB.getComments().filter(c => c.postId === postId).sort((a, b) => new Date(b.date) - new Date(a.date));
  if (!comments.length) return '<p style="color:var(--text-muted);font-size:0.78rem;text-align:center;padding:12px 0;">暂无评论，来说两句吧</p>';
  const user = DB.getCurrentUser();
  return comments.map(c => `
    <div class="comment-item">
      <div class="comment-header">
        <span class="comment-author">${c.username}</span>
        <span>${new Date(c.date).toLocaleDateString('zh-CN')}${user && user.id === c.userId ? `<span class="comment-delete" data-comment-id="${c.id}">删除</span>` : ''}</span>
      </div>
      <div class="comment-body">${c.text}</div>
    </div>
  `).join('');
}

function bindCommentDelete(container, postId) {
  container.querySelectorAll('.comment-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const cid = parseInt(btn.dataset.commentId);
      const comments = DB.getComments().filter(c => !(c.id === cid));
      DB.saveComments(comments);
      const list = container.querySelector('.comments-list');
      if (list) { list.innerHTML = genCommentsContent(postId); bindCommentDelete(container, postId); }
    });
  });

  // Login link in comments
  const loginLink = container.querySelector('#comment-login-link');
  if (loginLink) {
    loginLink.addEventListener('click', e => { e.preventDefault(); document.getElementById('post-modal').classList.remove('open'); document.body.style.overflow = ''; document.getElementById('btn-login') && document.getElementById('btn-login').click(); });
  }
}

/* --- 3D Card Tilt — FIXED: no cloneNode --- */
function initCardTilt() { initCardTiltOnCards(); }
function initCardTiltOnCards() {
  document.querySelectorAll('.blog-card, .project-card').forEach(card => {
    if (card.dataset.tiltBound) return; // Prevent double-binding
    card.dataset.tiltBound = '1';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rx = (y - cy) / cy * -8, ry = (x - cx) / cx * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.boxShadow = `${-ry}px ${-rx * 0.5}px 30px rgba(0,255,65,0.12), 0 0 20px rgba(0,255,65,0.08)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ============================================================
   GUESTBOOK
   ============================================================ */
function initGuestbook() {
  const form = document.getElementById('gb-submit');
  const messagesEl = document.getElementById('gb-messages');
  const hint = document.getElementById('gb-login-hint');
  if (!form) return;

  renderMessages();

  form.addEventListener('click', () => {
    const user = DB.getCurrentUser();
    if (!user) { hint.style.display = 'block'; return; }
    hint.style.display = 'none';
    const textEl = document.getElementById('gb-message');
    const authorEl = document.getElementById('gb-author');
    const text = textEl.value.trim();
    const author = authorEl.value.trim() || user.username;
    if (!text) return;
    const messages = DB.getMessages();
    messages.unshift({ id: Date.now(), userId: user.id, author, text, date: new Date().toISOString() });
    DB.saveMessages(messages);
    textEl.value = '';
    unlockAchievement('guestbook_msg');
    renderMessages();
  });

  function renderMessages() {
    const messages = DB.getMessages();
    if (!messages.length) { messagesEl.innerHTML = '<div class="gb-empty">[!] 暂无留言，来做第一个留言的人吧</div>'; return; }
    messagesEl.innerHTML = messages.map(m => `
      <div class="gb-message-item">
        <div class="gb-message-header"><span class="gb-message-author">> ${m.author}</span><span class="gb-message-date">${new Date(m.date).toLocaleDateString('zh-CN')}</span></div>
        <div class="gb-message-text">${m.text}</div>
      </div>
    `).join('');
  }
}

/* --- Reading History Modal --- */
function showReadingHistory() {
  const history = DB.getReadingHistory();
  const modal = document.getElementById('post-modal');
  const body = document.getElementById('modal-body');

  if (!history.length) {
    body.innerHTML = '<h2 class="post-title">阅读记录</h2><p style="color:var(--text-muted);">暂无阅读记录</p>';
  } else {
    body.innerHTML = `<h2 class="post-title">阅读记录 (${history.length})</h2><div class="related-posts-list">${history.map(h => {
      const post = blogPosts.find(p => p.id === h.postId);
      return post ? `<div class="related-post-item" data-post-id="${h.postId}">${h.title} <span style="color:var(--text-muted);font-size:0.68rem;">${new Date(h.date).toLocaleDateString('zh-CN')}</span></div>` : '';
    }).join('')}</div>`;
    body.querySelectorAll('.related-post-item').forEach(item => {
      item.addEventListener('click', () => {
        const pid = parseInt(item.dataset.postId);
        const post = blogPosts.find(p => p.id === pid);
        if (post) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
          // Close modal, then re-open with the selected post
          setTimeout(() => {
            modal.classList.remove('open');
            if (window._openPostModal) window._openPostModal(post);
          }, 200);
        }
      });
    });
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* --- My Likes --- */
function showMyLikes() {
  const user = DB.getCurrentUser();
  if (!user) return;
  const likes = DB.getLikes();
  const likedIds = Object.entries(likes).filter(([, users]) => users.includes(user.id)).map(([pid]) => parseInt(pid));
  const likedPosts = blogPosts.filter(p => likedIds.includes(p.id));

  const modal = document.getElementById('post-modal');
  const body = document.getElementById('modal-body');
  if (!likedPosts.length) {
    body.innerHTML = '<h2 class="post-title">我的收藏</h2><p style="color:var(--text-muted);">你还没有收藏任何文章</p>';
  } else {
    body.innerHTML = `<h2 class="post-title">我的收藏 (${likedPosts.length})</h2><div class="related-posts-list">${likedPosts.map(p => `<div class="related-post-item" data-post-id="${p.id}">${p.title} <span style="color:var(--text-muted);font-size:0.68rem;">${p.date}</span></div>`).join('')}</div>`;
    body.querySelectorAll('.related-post-item').forEach(item => {
      item.addEventListener('click', () => {
        const pid = parseInt(item.dataset.postId);
        const post = blogPosts.find(p => p.id === pid);
        if (post) {
          setTimeout(() => {
            modal.classList.remove('open');
            if (window._openPostModal) window._openPostModal(post);
          }, 200);
        }
      });
    });
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ============================================================
   GLOBAL MODALS (close with Esc, etc.)
   ============================================================ */
function initGlobalModals() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => { m.classList.remove('open'); });
      document.body.style.overflow = '';
    }
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { input.style.borderColor = 'var(--neon-red)'; input.style.boxShadow = '0 0 15px rgba(255,51,51,0.3)'; setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 1500); return; }
    input.value = ''; success.classList.add('show'); setTimeout(() => success.classList.remove('show'), 4000);
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const ring = document.getElementById('scroll-ring');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
    if (ring) { const p = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)); ring.style.strokeDashoffset = 50 - p * 50; ring.style.stroke = 'var(--neon-primary)'; }
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => { const t = document.querySelector(link.getAttribute('href')); if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); } });
  });
}

/* --- Glitch Flash --- */
function initGlitchFlash() {
  const flash = document.createElement('div'); flash.className = 'glitch-flash'; document.body.appendChild(flash);
  function t() { flash.classList.add('active'); setTimeout(() => flash.classList.remove('active'), 150); setTimeout(t, Math.random() * 8000 + 4000); }
  setTimeout(t, 6000);
}

/* --- Particles --- */
function initParticles() {
  const c = document.createElement('div'); c.style.cssText = 'position:fixed;inset:0;z-index:9996;pointer-events:none;'; document.body.appendChild(c);
  const ps = [];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;background:var(--neon-primary);border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;box-shadow:0 0 ${Math.random()*6+2}px var(--neon-primary);`;
    c.appendChild(el);
    ps.push({ el, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
  }
  function a() { for (const p of ps) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = window.innerWidth; if (p.x > window.innerWidth) p.x = 0; if (p.y < 0) p.y = window.innerHeight; if (p.y > window.innerHeight) p.y = 0; if (Math.random() < 0.005) { p.vx = (Math.random() - 0.5) * 0.4; p.vy = (Math.random() - 0.5) * 0.4; } p.el.style.transform = `translate(${p.x}px, ${p.y}px)`; } requestAnimationFrame(a); }
  a();
}

/* --- Live Clock --- */
function initLiveClock() {
  const clock = document.getElementById('live-clock'); if (!clock) return;
  function t() { const n = new Date(); clock.textContent = `[${n.toISOString().replace('T', ' | ').slice(0, 19)} UTC+8]`; }
  t(); setInterval(t, 1000);
}

/* --- Stats Counter --- */
function initStatsCounter() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const t = parseInt(el.dataset.target); animateNum(el, t); obs.unobserve(el); } });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

function animateNum(el, target) {
  const dur = 2000 + Math.random() * 1000; const start = performance.now();
  function upd(now) { const p = Math.min(1, (now - start) / dur); const e = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(e * target).toLocaleString(); if (p < 1) requestAnimationFrame(upd); else el.textContent = target.toLocaleString(); }
  requestAnimationFrame(upd);
}

/* --- Keyboard Shortcuts --- */
function initKeyboardShortcuts() {
  const kbModal = document.getElementById('kb-modal');
  document.getElementById('kb-close').addEventListener('click', () => kbModal.classList.remove('open'));
  kbModal.addEventListener('click', e => { if (e.target === kbModal) kbModal.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // 允许 ? 和 Escape 在输入框中也能触发
      if (e.key === '?' || e.key === 'Escape') { /* 继续执行 */ }
      else return;
    }
    const k = e.key.toLowerCase();
    if (k === '?') { e.preventDefault(); kbModal.classList.toggle('open'); }
    else if (k === 'g') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (k === 't') {
      const themes = ['green', 'cyan', 'magenta']; const cur = localStorage.getItem('cyberblog-theme') || 'green';
      const next = themes[(themes.indexOf(cur) + 1) % themes.length];
      if (next === 'green') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cyberblog-theme', next);
      document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`.theme-dot.${next}`); if (dot) dot.classList.add('active');
    }
    else if (k >= '1' && k <= '5') {
      const sections = ['home', 'blog', 'about', 'projects', 'guestbook'];
      const idx = parseInt(k) - 1; if (sections[idx]) { const s = document.getElementById(sections[idx]); if (s) s.scrollIntoView({ behavior: 'smooth' }); }
    }
    else if (k === 'l' && document.getElementById('post-modal').classList.contains('open')) {
      const likeBtn = document.getElementById('like-btn'); if (likeBtn) likeBtn.click();
    }
  });
}

/* --- Konami Code --- */
function initKonamiCode() {
  const code = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === code[pos]) { pos++; if (pos === code.length) { pos = 0; triggerEgg(); } }
    else pos = 0;
  });
}

function triggerEgg() {
  const t = document.createElement('div'); t.className = 'easter-egg-toast'; t.textContent = '>>> CYBERPUNK MODE ACTIVATED <<<'; document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
  unlockAchievement('konami');
  document.body.style.transition = 'background 0.2s'; document.body.style.background = '#ff00ff'; setTimeout(() => { document.body.style.background = ''; document.body.style.transition = ''; }, 200);
}

/* --- RSS --- */
function initRSS() {
  document.querySelectorAll('#rss-link, #rss-footer').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    const items = blogPosts.map(p => `<item><title><![CDATA[${p.title}]]></title><link>${location.origin}${location.pathname}?post=${p.id}</link><description><![CDATA[${p.excerpt}]]></description><pubDate>${new Date(p.date).toUTCString()}</pubDate></item>`).join('');
    const rss = `<?xml version="1.0"?><rss version="2.0"><channel><title>终末之剑 | CYBER//BLOG</title><link>${location.origin}${location.pathname}</link><description>赛博朋克个人博客</description><language>zh-CN</language>${items}</channel></rss>`;
    const url = URL.createObjectURL(new Blob([rss], { type: 'application/rss+xml' })); const w = window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 5000);
  }));
}

/* ============================================================
   NEW FEATURE 1: SOUND SYSTEM (Web Audio API)
   ============================================================ */
let soundEnabled = localStorage.getItem('cb-sound') !== 'off';

function initSoundSystem() {
  const btn = document.getElementById('btn-sound');
  if (!btn) return;

  updateSoundBtn();

  btn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('cb-sound', soundEnabled ? 'on' : 'off');
    updateSoundBtn();
    if (soundEnabled) playBeep(800, 0.05, 'sine');
  });

  function updateSoundBtn() {
    btn.textContent = soundEnabled ? '♪ 音效' : '♪ 静音';
    btn.classList.toggle('muted', !soundEnabled);
  }

  // Add click sounds to interactive elements
  document.addEventListener('click', (e) => {
    if (!soundEnabled) return;
    const target = e.target;
    if (target.closest('button') || target.closest('.btn') || target.closest('a[href]')) {
      playBeep(600, 0.04, 'square');
    }
    if (target.closest('.blog-card')) {
      playBeep(800, 0.06, 'sine');
    }
  });

  // Hover sounds on cards
  document.addEventListener('mouseenter', (e) => {
    if (!soundEnabled) return;
    if (e.target.closest('.blog-card') || e.target.closest('.project-card')) {
      playBeep(1200, 0.02, 'sine');
    }
  }, true);
}

function playBeep(freq, duration, type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* 静默处理音频错误 */ }
}

/* ============================================================
   NEW FEATURE 2: ACHIEVEMENT SYSTEM
   ============================================================ */
const ACHIEVEMENTS = [
  { id: 'first_login', title: '初次登录', desc: '成功注册并登录账号', icon: '🔑' },
  { id: 'first_comment', title: '畅所欲言', desc: '发表了第一条评论', icon: '💬' },
  { id: 'first_like', title: '慧眼识珠', desc: '给文章点了第一个赞', icon: '❤️' },
  { id: 'theme_switch', title: '色彩大师', desc: '切换了网站主题颜色', icon: '🎨' },
  { id: 'terminal_user', title: '黑客入门', desc: '在终端中输入了命令', icon: '💻' },
  { id: 'guestbook_msg', title: '到此一游', desc: '在留言板留下了足迹', icon: '📝' },
  { id: 'konami', title: '作弊码发现者', desc: '找到了隐藏的 Konami 彩蛋', icon: '🎮' },
  { id: 'night_owl', title: '夜猫子', desc: '在深夜访问了网站', icon: '🦉' },
  { id: 'explorer', title: '探索者', desc: '浏览了全部 5 篇文章', icon: '🔍' },
];

let unlockedAchievements = JSON.parse(localStorage.getItem('cb-achievements') || '[]');

function unlockAchievement(id) {
  if (unlockedAchievements.includes(id)) return;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  unlockedAchievements.push(id);
  localStorage.setItem('cb-achievements', JSON.stringify(unlockedAchievements));
  showAchievementToast(ach);
}

function showAchievementToast(ach) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="ach-icon">${ach.icon}</div>
    <div class="ach-title">🏆 成就解锁: ${ach.title}</div>
    <div class="ach-desc">${ach.desc}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function initAchievementSystem() {
  // 检查首次登录（在登录成功时触发，见 initAuthUI）
  // 检查主题切换（在 initThemeSwitcher 中触发）
  // 检查时间
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    setTimeout(() => unlockAchievement('night_owl'), 8000);
  }

  // 将成就系统挂载到全局
  window._unlockAchievement = unlockAchievement;

  // 检查之前是否在终端用过命令
  document.addEventListener('keydown', function trackTerminal(e) {
    if (e.target.id === 'terminal-input' && e.key === 'Enter' && e.target.value.trim()) {
      unlockAchievement('terminal_user');
      document.removeEventListener('keydown', trackTerminal);
    }
  });
}

/* ============================================================
   NEW FEATURE 3: PASSWORD STRENGTH METER
   ============================================================ */
function initPasswordStrength() {
  const pwInput = document.getElementById('auth-password');
  const barFill = document.getElementById('pw-bar-fill');
  const pwText = document.getElementById('pw-text');
  const strengthEl = document.getElementById('pw-strength');
  const confirmField = document.getElementById('auth-confirm-field');

  if (!pwInput || !barFill) return;

  pwInput.addEventListener('input', () => {
    const pw = pwInput.value;
    // 只在注册模式（确认密码可见）时显示强度条
    if (confirmField && confirmField.style.display === 'none') {
      strengthEl.style.display = 'none';
      return;
    }
    if (!pw) { strengthEl.style.display = 'none'; return; }
    strengthEl.style.display = 'block';

    let score = 0;
    if (pw.length >= 4) score++;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    const levels = ['weak', 'fair', 'good', 'strong', 'strong'];
    const labels = ['太弱了', '一般般', '还不错', '很强', '极强'];
    const idx = Math.min(score, 4);

    barFill.className = 'pw-bar-fill ' + levels[idx];
    pwText.textContent = labels[idx];
    pwText.style.color = idx <= 1 ? 'var(--neon-red)' : idx === 2 ? 'var(--neon-cyan)' : 'var(--neon-primary)';
  });
}

/* ============================================================
   NEW FEATURE 4: TEXT SCRAMBLE ON SECTION TITLES
   ============================================================ */
function initTextScramble() {
  const titles = document.querySelectorAll('.section-title, .glitch-title');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  titles.forEach(t => observer.observe(t));
}

function scrambleText(el) {
  const original = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>?|/\\';
  let iterations = 0;
  const maxIterations = 12;

  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (i < iterations || char === ' ') return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iterations++;
    if (iterations >= maxIterations) {
      clearInterval(interval);
      el.textContent = original;
    }
  }, 50);
}

/* ============================================================
   NEW FEATURE 5: CURSOR TRAIL PARTICLES
   ============================================================ */
function initCursorTrail() {
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    // 只在鼠标移动足够距离时生成拖尾粒子
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 30) {
      spawnTrailParticle(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  // 点击爆发粒子
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 20 + Math.random() * 30;
      const x = e.clientX + Math.cos(angle) * dist;
      const y = e.clientY + Math.sin(angle) * dist;
      spawnTrailParticle(x, y);
    }
  });
}

function spawnTrailParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'cursor-trail';
  const size = Math.random() * 3 + 2;
  particle.style.cssText = `
    left: ${x - size / 2}px; top: ${y - size / 2}px;
    width: ${size}px; height: ${size}px;
    animation-duration: ${Math.random() * 0.4 + 0.3}s;
  `;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 700);
}
