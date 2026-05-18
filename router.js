/**
 * ============================================================
 * AI 文献助手 — Hash 路由模块
 * 基于 URL hash 的简单 SPA 路由，无依赖
 * 支持：页面切换、导航高亮、滚动到顶部
 * ============================================================
 */

const Router = (() => {
  let _currentPage = 'home';
  let _beforeHooks = [];
  let _afterHooks = [];

  // ---- 页面 ID 映射 ----
  const _pageMap = {
    'home': 'page-home',
    'tools': 'page-tools',
    'membership': 'page-membership',
    'profile': 'page-profile',
    'help': 'page-help',
  };

  // ---- 初始化 ----
  function init() {
    // 监听 hash 变化
    window.addEventListener('hashchange', _handleRoute);
    // 初始加载
    _handleRoute();
  }

  // ---- 处理路由 ----
  function _handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const page = _pageMap[hash] ? hash : 'home';

    // 如果是无效路由，修正 URL
    if (!_pageMap[hash] && hash !== 'home') {
      window.location.hash = 'home';
      return;
    }

    // 执行前置钩子
    for (const hook of _beforeHooks) {
      const result = hook(page, _currentPage);
      if (result === false) {
        // 钩子阻止导航，恢复原 hash
        window.location.hash = _currentPage;
        return;
      }
    }

    // 切换页面
    _showPage(page);
    _currentPage = page;

    // 更新导航高亮
    _updateNavHighlight(page);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 执行后置钩子
    for (const hook of _afterHooks) {
      hook(page);
    }
  }

  // ---- 显示指定页面 ----
  function _showPage(page) {
    // 隐藏所有页面
    Object.values(_pageMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    // 显示目标页面
    const target = document.getElementById(_pageMap[page]);
    if (target) target.classList.remove('hidden');
  }

  // ---- 更新导航高亮 ----
  function _updateNavHighlight(page) {
    document.querySelectorAll('[data-nav]').forEach(el => {
      const href = el.getAttribute('data-nav');
      if (href === page) {
        el.classList.add('nav-active');
      } else {
        el.classList.remove('nav-active');
      }
    });
  }

  // ---- 编程式导航 ----
  function navigate(page) {
    if (page === _currentPage) return;
    window.location.hash = page;
  }

  // ---- 获取当前页面 ----
  function getCurrentPage() {
    return _currentPage;
  }

  // ---- 前置钩子（可用于鉴权拦截） ----
  function beforeNavigate(fn) {
    _beforeHooks.push(fn);
  }

  // ---- 后置钩子（可用于页面统计） ----
  function afterNavigate(fn) {
    _afterHooks.push(fn);
  }

  // 公开 API
  return {
    init,
    navigate,
    getCurrentPage,
    beforeNavigate,
    afterNavigate,
  };
})();
