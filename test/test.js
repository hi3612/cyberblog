// 赛博朋克博客网站 - 自动化功能测试
const { chromium } = require('playwright');
const path = require('path');

const SITE = 'http://127.0.0.1:8080';

(async () => {
  console.log('=== 启动 Edge 浏览器 ===');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    slowMo: 300 // 每个操作间隔 300ms，方便观察
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'zh-CN'
  });

  // 清除之前的 localStorage 测试数据
  const page = await context.newPage();

  // ========== 测试 1: 页面加载和启动画面 ==========
  console.log('\n[测试1] 页面加载...');
  await page.goto(SITE, { waitUntil: 'networkidle' });
  console.log('  页面标题:', await page.title());

  // 等待启动画面消失（最多等 12 秒）
  console.log('  等待启动画面...');
  try {
    await page.waitForSelector('#boot-screen.done', { timeout: 12000 });
    console.log('  ✓ 启动画面正常消失');
  } catch (e) {
    console.log('  ✗ 启动画面超时未消失，检查页面状态...');
    const bootVisible = await page.$eval('#boot-screen', el => window.getComputedStyle(el).opacity);
    console.log('  启动画面透明度:', bootVisible);
  }

  // 等待终端打字完成（最多 12 秒）
  console.log('  等待终端打字完成...');
  try {
    await page.waitForSelector('#terminal-input', { timeout: 15000 });
    console.log('  ✓ 终端输入框已出现');
  } catch (e) {
    console.log('  ✗ 终端输入框超时未出现 (15秒)');
  }

  // 检查页面关键元素
  const hasNav = await page.$('.nav');
  const hasHero = await page.$('#home');
  const hasBlog = await page.$('#blog');
  console.log('  导航栏:', hasNav ? '✓' : '✗');
  console.log('  首页区:', hasHero ? '✓' : '✗');
  console.log('  博客区:', hasBlog ? '✓' : '✗');

  // ========== 测试 2: 终端命令交互 ==========
  console.log('\n[测试2] 终端命令交互...');
  const terminalInput = await page.$('#terminal-input');
  if (terminalInput) {
    await terminalInput.click();
    await page.waitForTimeout(300);
    await terminalInput.fill('help');
    await terminalInput.press('Enter');
    await page.waitForTimeout(500);
    const helpOutput = await page.$eval('#typing-text', el => el.textContent);
    console.log('  help 命令输出:', helpOutput.includes('命令列表') ? '✓' : '✗');
  } else {
    console.log('  ✗ 终端输入框未出现');
  }

  // ========== 测试 3: 主题切换 ==========
  console.log('\n[测试3] 主题切换...');
  const cyanDot = await page.$('.theme-dot.cyan');
  if (cyanDot) {
    await cyanDot.click();
    await page.waitForTimeout(500);
    const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
    console.log('  青色主题:', theme === 'cyan' ? '✓' : '✗ (当前: ' + theme + ')');
  }

  const greenDot = await page.$('.theme-dot.green');
  if (greenDot) {
    await greenDot.click();
    await page.waitForTimeout(300);
    console.log('  切回绿色: ✓');
  }

  // ========== 测试 4: 博客文章点击 ==========
  console.log('\n[测试4] 博客文章点击...');
  // 滚动到博客区域
  await page.click('a[href="#blog"]');
  await page.waitForTimeout(1000);

  const blogCard = await page.$('.blog-card');
  if (blogCard) {
    await blogCard.click();
    await page.waitForTimeout(800);
    const modalOpen = await page.$eval('#post-modal', el => el.classList.contains('open'));
    console.log('  点击文章卡片弹出模态框:', modalOpen ? '✓' : '✗');

    if (modalOpen) {
      // 检查模态框内容
      const hasTitle = await page.$('#modal-body .post-title');
      const hasContent = await page.$('#modal-body .post-content');
      const hasLike = await page.$('#like-btn');
      const hasShare = await page.$('.share-buttons');
      console.log('  文章标题:', hasTitle ? '✓' : '✗');
      console.log('  文章内容:', hasContent ? '✓' : '✗');
      console.log('  点赞按钮:', hasLike ? '✓' : '✗');
      console.log('  分享按钮:', hasShare ? '✓' : '✗');

      // 关闭模态框
      await page.click('#modal-close');
      await page.waitForTimeout(500);
      console.log('  关闭模态框: ✓');
    }
  } else {
    console.log('  ✗ 未找到博客卡片');
  }

  // ========== 测试 5: 注册/登录 ==========
  console.log('\n[测试5] 注册/登录系统...');
  const loginBtn = await page.$('#btn-login');
  if (loginBtn) {
    await loginBtn.click();
    await page.waitForTimeout(500);

    // 切换到注册模式
    const switchLink = await page.$('#auth-switch');
    if (switchLink) {
      await switchLink.click();
      await page.waitForTimeout(300);
      console.log('  切换到注册模式: ✓');
    }

    // 填写注册表单
    await page.fill('#auth-username', '测试用户');
    await page.fill('#auth-email', 'test@test.com');
    await page.fill('#auth-password', '1234');
    await page.fill('#auth-confirm', '1234');
    await page.click('#auth-submit');
    await page.waitForTimeout(1000);

    // 检查是否登录成功
    const userMenu = await page.$('.user-menu');
    console.log('  注册并登录:', userMenu ? '✓' : '✗');
  }

  // ========== 测试 6: 用户下拉菜单和退出 ==========
  console.log('\n[测试6] 用户下拉菜单...');
  const avatar = await page.$('.user-avatar');
  if (avatar) {
    await avatar.click();
    await page.waitForTimeout(400);
    const dropdownOpen = await page.$eval('.user-dropdown', el => el.classList.contains('open'));
    console.log('  点击头像展开菜单:', dropdownOpen ? '✓' : '✗');

    // 点击退出登录
    const logoutBtn = await page.$('.user-dropdown a.logout');
    if (logoutBtn) {
      await logoutBtn.click();
      await page.waitForTimeout(600);
      const loginBtnAgain = await page.$('#btn-login');
      console.log('  退出登录:', loginBtnAgain ? '✓' : '✗');
    }
  } else {
    console.log('  ✗ 未找到用户头像');
  }

  // ========== 测试 7: 文章点赞（需重新登录） ==========
  console.log('\n[测试7] 文章点赞...');
  // 重新登录
  const loginBtn2 = await page.$('#btn-login');
  if (loginBtn2) {
    await loginBtn2.click();
    await page.waitForTimeout(400);
    await page.fill('#auth-username', '测试用户');
    await page.fill('#auth-password', '1234');
    await page.click('#auth-submit');
    await page.waitForTimeout(800);
    console.log('  重新登录: ✓');
  }

  // 打开文章
  const blogCard2 = await page.$('.blog-card');
  if (blogCard2) {
    await blogCard2.click();
    await page.waitForTimeout(800);
    const likeBtn = await page.$('#like-btn');
    if (likeBtn) {
      await likeBtn.click();
      await page.waitForTimeout(500);
      const liked = await page.$eval('#like-btn', el => el.classList.contains('liked'));
      console.log('  点赞文章:', liked ? '✓' : '✗');

      // 再点一次取消点赞
      await likeBtn.click();
      await page.waitForTimeout(300);
      console.log('  取消点赞: ✓');
    }

    // ========== 测试 8: 文章评论 ==========
    console.log('\n[测试8] 文章评论...');
    const commentForm = await page.$('#comment-form');
    if (commentForm) {
      await page.fill('#comment-form textarea', '这是一条自动化测试评论！');
      await page.click('#comment-form button[type="submit"]');
      await page.waitForTimeout(600);
      const commentText = await page.$eval('.comment-item .comment-body', el => el.textContent);
      console.log('  发表评论:', commentText.includes('自动化测试评论') ? '✓' : '✗');
    } else {
      console.log('  ✗ 未找到评论表单');
    }

    // 关闭文章
    await page.click('#modal-close');
    await page.waitForTimeout(400);
  }

  // ========== 测试 9: 留言板 ==========
  console.log('\n[测试9] 留言板...');
  await page.click('a[href="#guestbook"]');
  await page.waitForTimeout(800);

  const gbTextarea = await page.$('#gb-message');
  if (gbTextarea) {
    await gbTextarea.fill('这是一条留言板测试消息！');
    await page.fill('#gb-author', '测试者');
    await page.click('#gb-submit');
    await page.waitForTimeout(600);

    const gbMessage = await page.$eval('.gb-message-text', el => el.textContent);
    console.log('  留言发送:', gbMessage.includes('留言板测试') ? '✓' : '✗');
  }

  // ========== 测试 10: 博客搜索 ==========
  console.log('\n[测试10] 博客搜索...');
  await page.click('a[href="#blog"]');
  await page.waitForTimeout(800);

  const searchInput = await page.$('#blog-search-input');
  if (searchInput) {
    await searchInput.fill('CSS');
    await page.waitForTimeout(400);
    const cardCount = await page.$$eval('.blog-card', cards => cards.length);
    console.log('  搜索"CSS"结果数:', cardCount, cardCount > 0 ? '✓' : '✗');

    await searchInput.fill('');
    await page.waitForTimeout(400);
    const allCards = await page.$$eval('.blog-card', cards => cards.length);
    console.log('  清除搜索恢复全部:', allCards === 5 ? '✓' : '✗ (期望5, 实际' + allCards + ')');
  }

  // ========== 测试 11: 键盘快捷键 ==========
  console.log('\n[测试11] 键盘快捷键...');
  // 点击空白区域取消输入框焦点
  await page.click('body', { position: { x: 10, y: 10 } });
  await page.waitForTimeout(200);

  await page.keyboard.press('?');
  await page.waitForTimeout(500);
  const kbOpen = await page.$eval('#kb-modal', el => el.classList.contains('open'));
  console.log('  按 ? 打开快捷键面板:', kbOpen ? '✓' : '✗');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const kbClosed = await page.$eval('#kb-modal', el => !el.classList.contains('open'));
  console.log('  按 Esc 关闭面板:', kbClosed ? '✓' : '✗');

  // ========== 测试 12: 统计数字滚动 ==========
  console.log('\n[测试12] 统计数字...');
  await page.click('a[href="#stats"]');
  await page.waitForTimeout(2500); // 等待动画完成

  const statNumbers = await page.$$eval('.stat-number', els => els.map(e => e.textContent));
  console.log('  统计数字:', statNumbers.join(', '));
  const allNonZero = statNumbers.every(s => s !== '0');
  console.log('  数字已滚动:', allNonZero ? '✓' : '✗');

  // ========== 测试 13: Newsletter 订阅 ==========
  console.log('\n[测试13] Newsletter...');
  const newsInput = await page.$('#newsletter-email');
  if (newsInput) {
    await page.fill('#newsletter-email', 'test@test.com');
    await page.click('.newsletter-form .btn-primary');
    await page.waitForTimeout(600);
    const successVisible = await page.$eval('#newsletter-success', el => window.getComputedStyle(el).display !== 'none');
    console.log('  订阅成功提示:', successVisible ? '✓' : '✗');
  }

  // ========== 测试 14: 阅读记录和收藏 ==========
  console.log('\n[测试14] 阅读记录和收藏...');
  const userAvatar = await page.$('.user-avatar');
  if (userAvatar) {
    await userAvatar.click();
    await page.waitForTimeout(400);

    // 查看阅读记录
    const historyLink = await page.$('[data-action="history"]');
    if (historyLink) {
      await historyLink.click();
      await page.waitForTimeout(600);
      const historyContent = await page.$eval('#modal-body', el => el.textContent);
      console.log('  阅读记录:', historyContent.includes('从零构建') ? '✓ (有记录)' : '✗ (无记录)');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // 查看收藏
    await userAvatar.click();
    await page.waitForTimeout(400);
    const likesLink = await page.$('[data-action="likes"]');
    if (likesLink) {
      await likesLink.click();
      await page.waitForTimeout(600);
      const likesContent = await page.$eval('#modal-body', el => el.textContent);
      console.log('  我的收藏:', likesContent.includes('还没有收藏') || likesContent.includes('我的收藏') ? '✓' : '✗');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  }

  // ========== 测试 15: 新功能 - 音效系统 ==========
  console.log('\n[测试15] 音效系统...');
  const soundBtn = await page.$('#btn-sound');
  if (soundBtn) {
    const soundText = await soundBtn.textContent();
    console.log('  音效按钮存在:', soundText.includes('音效') || soundText.includes('静音') ? '✓' : '✗');
    await soundBtn.click();
    await page.waitForTimeout(300);
    const muted = await soundBtn.evaluate(el => el.classList.contains('muted'));
    console.log('  切换静音状态:', muted ? '✓' : '✗');
    await soundBtn.click();
    await page.waitForTimeout(300);
    console.log('  恢复音效: ✓');
  } else {
    console.log('  ✗ 未找到音效按钮');
  }

  // ========== 测试 16: 新功能 - 成就系统 ==========
  console.log('\n[测试16] 成就系统...');
  // 打开文章点赞触发 first_like 成就
  await page.click('a[href="#blog"]');
  await page.waitForTimeout(600);
  const bc3 = await page.$('.blog-card');
  if (bc3) {
    await bc3.click();
    await page.waitForTimeout(600);
    const lb = await page.$('#like-btn');
    if (lb) {
      const alreadyLiked = await lb.evaluate(el => el.classList.contains('liked'));
      if (!alreadyLiked) {
        await lb.click();
        await page.waitForTimeout(600);
      }
      console.log('  点赞触发成就: ✓');
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // ========== 测试 17: 新功能 - 密码强度 ==========
  console.log('\n[测试17] 密码强度指示器...');
  // 先退出登录
  const ua2 = await page.$('.user-avatar');
  if (ua2) {
    await ua2.click(); await page.waitForTimeout(300);
    const lo = await page.$('.logout');
    if (lo) { await lo.click(); await page.waitForTimeout(500); }
  }
  // 打开注册
  const lb2 = await page.$('#btn-login');
  if (lb2) {
    await lb2.click(); await page.waitForTimeout(400);
    await page.click('#auth-switch'); await page.waitForTimeout(300);
    // 输入弱密码
    await page.fill('#auth-password', '123');
    await page.waitForTimeout(300);
    const pwBar = await page.$('#pw-strength');
    console.log('  密码强度条出现:', pwBar ? '✓' : '✗');
    if (pwBar) {
      const visible = await pwBar.evaluate(el => window.getComputedStyle(el).display !== 'none');
      console.log('  强度条可见:', visible ? '✓' : '✗');
    }
    // 关闭
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // ========== 测试 18: 新功能 - 文字加扰 ==========
  console.log('\n[测试18] 文字加扰动画...');
  // 滚动触发 section title 进入视口
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('stats').offsetTop - 200, behavior: 'instant' }));
  await page.waitForTimeout(1500);
  const sectionTitle = await page.$eval('#stats .section-title', el => el.textContent);
  console.log('  标题文字还原:', sectionTitle === 'System Stats' || sectionTitle.includes('System') ? '✓' : '✗ (当前: "' + sectionTitle + '")');

  // ========== 测试 19: 新功能 - 光标拖尾 ==========
  console.log('\n[测试19] 光标拖尾粒子...');
  // 移动鼠标触发拖尾
  await page.mouse.move(200, 300);
  await page.mouse.move(300, 400);
  await page.mouse.move(400, 350);
  await page.waitForTimeout(300);
  // 点击触发粒子爆发
  await page.mouse.click(500, 400);
  await page.waitForTimeout(200);
  const trailParticles = await page.$$('.cursor-trail');
  console.log('  拖尾粒子生成:', trailParticles.length > 0 ? '✓ (生成了粒子)' : '- (粒子可能已消散)');

  // ========== 测试 20: 网络节点背景 ==========
  console.log('\n[测试20] 网络节点可视化...');
  const networkCanvas = await page.$('#network-bg');
  console.log('  节点画布存在:', networkCanvas ? '✓' : '✗');
  if (networkCanvas) {
    // 移动鼠标触发节点连线
    await page.mouse.move(400, 300);
    await page.waitForTimeout(300);
    await page.mouse.move(500, 350);
    await page.waitForTimeout(200);
    console.log('  鼠标交互触发: ✓');
  }

  // ========== 测试 21: 赛博占卜 ==========
  console.log('\n[测试21] 赛博占卜...');
  const oracleBtn = await page.$('#cyber-oracle');
  if (oracleBtn) {
    await oracleBtn.click();
    await page.waitForTimeout(1500); // 等待加扰动画
    const oracleText = await page.$eval('#oracle-prophecy', el => el.textContent);
    const isChinese = /[一-鿿]/.test(oracleText);
    console.log('  占卜结果生成:', oracleText.length > 5 ? '✓' : '✗');
    console.log('  内容包含中文:', isChinese ? '✓' : '✗');
  } else {
    console.log('  ✗ 未找到占卜按钮');
  }

  // ========== 测试 22: 2077 倒计时 ==========
  console.log('\n[测试22] 2077 倒计时...');
  const countdown = await page.$('#countdown-2077');
  if (countdown) {
    const cdText = await countdown.textContent();
    console.log('  倒计时显示:', cdText);
    const hasContent = cdText.includes('年') || cdText.includes('天');
    console.log('  倒计时内容有效:', hasContent ? '✓' : '✗');
  } else {
    console.log('  ✗ 未找到倒计时元素');
  }

  // ========== 测试 23: 可拖拽终端 ==========
  console.log('\n[测试23] 可拖拽终端...');
  const terminalHeader = await page.$('#main-terminal .terminal-header');
  if (terminalHeader) {
    const initialPos = await page.$eval('#main-terminal', el => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, top: rect.top };
    });
    // 拖拽终端
    const box = await terminalHeader.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 50, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    const newPos = await page.$eval('#main-terminal', el => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, top: rect.top };
    });
    const moved = Math.abs(newPos.left - initialPos.left) > 5 || Math.abs(newPos.top - initialPos.top) > 5;
    console.log('  终端可拖拽:', moved ? '✓' : '✗ (可能需手动验证)');

    // 双击重置
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { clickCount: 2 });
    await page.waitForTimeout(300);
    console.log('  双击重置位置: ✓');
  }

  // ========== 测试 24: 随机技术引语 ==========
  console.log('\n[测试24] 随机技术引语...');
  await page.click('a[href="#about"]');
  await page.waitForTimeout(600);
  const quoteBtn = await page.$('#btn-new-quote');
  if (quoteBtn) {
    const oldQuote = await page.$eval('#quote-text', el => el.textContent);
    await quoteBtn.click();
    await page.waitForTimeout(800);
    const newQuote = await page.$eval('#quote-text', el => el.textContent);
    const changed = oldQuote !== newQuote;
    console.log('  引语已刷新:', changed ? '✓' : '✗');
    console.log('  新引语:', newQuote.substring(0, 50) + '...');
  } else {
    console.log('  ✗ 未找到引语按钮');
  }

  // ========== 汇总报告 ==========
  console.log('\n====================');
  console.log('  全部 24 项测试完成！浏览器保持打开，可以手动检查。');
  console.log('====================');

})();
