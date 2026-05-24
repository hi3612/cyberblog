// Blog post data — loaded from Markdown files
// Falls back to hardcoded content if fetch fails

const blogPosts = [];
let postsReady = false;

(async function loadPosts() {
  try {
    const res = await fetch('articles/manifest.json');
    if (!res.ok) throw new Error('manifest fetch failed');
    const manifest = await res.json();

    for (const item of manifest) {
      try {
        const mdRes = await fetch('articles/' + item.file);
        if (!mdRes.ok) throw new Error('md fetch failed');
        const markdown = await mdRes.text();
        item.content = parseMarkdown(markdown);
        blogPosts.push(item);
      } catch (e) {
        console.warn('Failed to load article:', item.file, e.message);
      }
    }
  } catch (e) {
    console.warn('Articles manifest not available, using fallback:', e.message);
    loadFallbackPosts();
  }

  if (blogPosts.length === 0) loadFallbackPosts();
  postsReady = true;
})();

function parseMarkdown(md) {
  let html = '';
  const lines = md.split('\n');
  let inCodeBlock = false, codeBlock = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += '<pre>' + escapeHTML(codeBlock.trim()) + '</pre>';
        codeBlock = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeBlock += line + '\n'; continue; }

    // Headings
    if (line.startsWith('## ')) { html += '<h2>' + parseInline(line.slice(3)) + '</h2>'; continue; }
    if (line.startsWith('# ')) { html += '<h2>' + parseInline(line.slice(2)) + '</h2>'; continue; }

    // Empty lines
    if (line.trim() === '') { html += ''; continue; }

    // Regular paragraph
    html += '<p>' + parseInline(line) + '</p>';
  }

  return html;
}

function parseInline(text) {
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  return text;
}

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Fallback — minimal content for offline
function loadFallbackPosts() {
  const fallbacks = [
    { id: 1, title: '从零构建赛博朋克风格个人网站', date: '2026-05-20', readtime: '8 min', category: 'frontend', tags: ['CSS', '设计', '动画'], content: '<p>文章正在加载中，请稍后刷新页面...</p>' },
    { id: 2, title: '现代 CSS 动画技巧完全指南', date: '2026-05-15', readtime: '12 min', category: 'frontend', tags: ['CSS', '动画', '性能优化'], content: '<p>文章正在加载中，请稍后刷新页面...</p>' },
    { id: 3, title: '为什么每个开发者都应该拥有个人博客', date: '2026-05-10', readtime: '6 min', category: 'career', tags: ['职业发展', '写作', '个人品牌'], content: '<p>文章正在加载中，请稍后刷新页面...</p>' },
    { id: 4, title: 'Web 性能优化的 10 个实用技巧', date: '2026-05-05', readtime: '10 min', category: 'frontend', tags: ['性能优化', 'Web Vitals', '最佳实践'], content: '<p>文章正在加载中，请稍后刷新页面...</p>' },
    { id: 5, title: '赛博朋克美学：从文学到 UI 设计', date: '2026-04-28', readtime: '7 min', category: 'design', tags: ['设计', '赛博朋克', 'UI/UX'], content: '<p>文章正在加载中，请稍后刷新页面...</p>' },
  ];
  fallbacks.forEach(p => blogPosts.push(p));
}
