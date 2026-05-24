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
    { id:1, title:'从零构建赛博朋克风格个人网站',date:'2026-05-20',readtime:'8 min',category:'frontend',tags:['CSS','设计','动画'],content:'<p>文章正在加载中...</p>'},
    { id:2, title:'现代 CSS 动画技巧完全指南',date:'2026-05-15',readtime:'12 min',category:'frontend',tags:['CSS','动画','性能优化'],content:'<p>文章正在加载中...</p>'},
    { id:3, title:'为什么每个开发者都应该拥有个人博客',date:'2026-05-10',readtime:'6 min',category:'career',tags:['职业发展','写作','个人品牌'],content:'<p>文章正在加载中...</p>'},
    { id:4, title:'Web 性能优化的 10 个实用技巧',date:'2026-05-05',readtime:'10 min',category:'frontend',tags:['性能优化','Web Vitals','最佳实践'],content:'<p>文章正在加载中...</p>'},
    { id:5, title:'赛博朋克美学：从文学到 UI 设计',date:'2026-04-28',readtime:'7 min',category:'design',tags:['设计','赛博朋克','UI/UX'],content:'<p>文章正在加载中...</p>'},
    { id:6, title:'终端技巧：让你的命令行效率翻倍',date:'2026-04-20',readtime:'5 min',category:'frontend',tags:['终端','命令行','效率'],content:'<p>文章正在加载中...</p>'},
    { id:7, title:'Git 工作流最佳实践',date:'2026-04-12',readtime:'7 min',category:'frontend',tags:['Git','版本控制','协作'],content:'<p>文章正在加载中...</p>'},
    { id:8, title:'TypeScript 设计模式精粹',date:'2026-04-05',readtime:'6 min',category:'frontend',tags:['TypeScript','设计模式','类型系统'],content:'<p>文章正在加载中...</p>'},
    { id:9, title:'如何高效学习一门新编程语言',date:'2026-03-28',readtime:'5 min',category:'career',tags:['编程语言','学习方法','效率'],content:'<p>文章正在加载中...</p>'},
    { id:10, title:'Docker 从入门到生产',date:'2026-03-20',readtime:'8 min',category:'frontend',tags:['Docker','DevOps','容器化'],content:'<p>文章正在加载中...</p>'},
    { id:11, title:'RESTful API 设计指南',date:'2026-03-12',readtime:'7 min',category:'frontend',tags:['API','REST','后端'],content:'<p>文章正在加载中...</p>'},
    { id:12, title:'React vs Vue：我的真实使用感受',date:'2026-03-05',readtime:'6 min',category:'frontend',tags:['React','Vue','框架对比'],content:'<p>文章正在加载中...</p>'},
    { id:13, title:'开发者职业发展路线图',date:'2026-02-26',readtime:'8 min',category:'career',tags:['职业发展','成长','软技能'],content:'<p>文章正在加载中...</p>'},
  ];
  fallbacks.forEach(p => blogPosts.push(p));
}
