/**
 * ============================================================
 * AI 文献助手 — 用户状态与权限管理模块
 * 管理：登录状态、会员身份、免费次数、使用记录
 * 当前为 mock 实现，后续对接真实后端只需替换本模块
 * ============================================================
 */

const Auth = (() => {
  // ---- 内部状态 ----
  let _user = null;
  let _listeners = [];

  // ---- 初始化 ----
  function init() {
    // 尝试从 localStorage 恢复状态
    const saved = localStorage.getItem('ai_lit_user');
    if (saved) {
      try {
        _user = JSON.parse(saved);
      } catch (e) {
        _user = null;
      }
    }
    if (!_user) {
      // 首次使用：加载 mock 数据并检查每日重置
      _user = JSON.parse(JSON.stringify(APP_CONFIG.mockUser));
      _checkDailyReset();
      _save();
    } else {
      _checkDailyReset();
    }
  }

  // ---- 每日重置 ----
  function _checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = _user._lastResetDate;
    if (lastReset !== today) {
      _user.remainingToday = APP_CONFIG.quota.freeDailyLimit;
      _user._lastResetDate = today;
      _save();
    }
  }

  // ---- 持久化 ----
  function _save() {
    localStorage.setItem('ai_lit_user', JSON.stringify(_user));
    _notify();
  }

  // ---- 订阅状态变更 ----
  function onChange(fn) {
    _listeners.push(fn);
    return () => {
      _listeners = _listeners.filter(f => f !== fn);
    };
  }

  function _notify() {
    _listeners.forEach(fn => fn(_user));
  }

  // ---- 获取当前用户 ----
  function getUser() {
    return _user ? { ..._user } : null;
  }

  // ---- 是否为会员 ----
  function isMember() {
    if (!_user) return false;
    if (_user.tier === 'free') return false;
    // 检查是否过期
    if (_user.expireDate && new Date(_user.expireDate) < new Date()) {
      _user.tier = 'free';
      _user.expireDate = null;
      _save();
      return false;
    }
    return true;
  }

  // ---- 获取会员等级 ----
  function getTier() {
    return isMember() ? _user.tier : 'free';
  }

  // ---- 检查功能权限 ----
  function canUse(functionId) {
    const fn = APP_CONFIG.functions.find(f => f.id === functionId);
    if (!fn) return false;
    if (fn.tier === 'free') return true;
    return isMember();
  }

  // ---- 查看剩余次数 ----
  function getRemainingQuota() {
    if (!_user) return 0;
    if (isMember()) {
      if (_user.tier === 'yearly') return Infinity;
      // 月卡：当日不限次显示为 '30'
      const used = (_user._dailyUsed || 0);
      return Math.max(0, 30 - used);
    }
    return _user.remainingToday || 0;
  }

  // ---- 消耗一次免费次数 ----
  function consumeQuota() {
    if (!_user) return false;
    if (isMember()) {
      _user._dailyUsed = (_user._dailyUsed || 0) + 1;
      _user.totalUsed = (_user.totalUsed || 0) + 1;
      _save();
      return true;
    }
    if (_user.remainingToday > 0) {
      _user.remainingToday--;
      _user.totalUsed = (_user.totalUsed || 0) + 1;
      _save();
      return true;
    }
    return false;
  }

  // ---- 是否有剩余次数 ----
  function hasQuota() {
    if (isMember()) {
      if (_user.tier === 'yearly') return true;
      return (_user._dailyUsed || 0) < 30;
    }
    return (_user.remainingToday || 0) > 0;
  }

  // ---- 添加使用记录 ----
  function addRecord(type, title, words) {
    if (!_user) return;
    _user.records = _user.records || [];
    _user.records.unshift({
      date: new Date().toISOString().split('T')[0],
      type,
      title: title || '未命名文献',
      words: words || 0,
    });
    // 只保留最近 50 条
    if (_user.records.length > 50) _user.records = _user.records.slice(0, 50);
    _save();
  }

  // ---- 模拟登录 ----
  function login(userData) {
    _user = {
      ...APP_CONFIG.mockUser,
      ...userData,
      _lastResetDate: new Date().toDateString(),
    };
    _save();
  }

  // ---- 模拟登出 ----
  function logout() {
    _user = JSON.parse(JSON.stringify(APP_CONFIG.mockUser));
    _checkDailyReset();
    _save();
  }

  // ---- 模拟开通会员 ----
  function upgradeTo(tier) {
    if (!_user) return;
    _user.tier = tier;
    const now = new Date();
    if (tier === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else if (tier === 'yearly') {
      now.setFullYear(now.getFullYear() + 1);
    }
    _user.expireDate = now.toISOString();
    _user.remainingToday = Infinity;
    _save();
  }

  // ---- 激活试用会员 ----
  function activateTrial(days) {
    if (!_user) return;
    _user.tier = 'monthly';
    const exp = new Date();
    exp.setDate(exp.getDate() + (days || 3));
    _user.expireDate = exp.toISOString();
    _user.remainingToday = Infinity;
    _save();
  }

  // ---- 格式化到期时间 ----
  function getExpireDateFormatted() {
    if (!_user || !_user.expireDate) return '—';
    const d = new Date(_user.expireDate);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // ---- 获取会员状态文本 ----
  function getTierLabel() {
    const map = { free: '免费用户', monthly: '月卡会员', yearly: '年卡会员' };
    return map[getTier()] || '免费用户';
  }

  // ---- 获取模型标识 ----
  function getModelBadge() {
    const map = {
      free: APP_CONFIG.texts.modelBadgeBasic,
      monthly: APP_CONFIG.texts.modelBadgePriority,
      yearly: APP_CONFIG.texts.modelBadgeFast,
    };
    return map[getTier()] || APP_CONFIG.texts.modelBadgeBasic;
  }

  // ---- 获取总使用次数 ----
  function getTotalUsed() {
    return _user?.totalUsed || 0;
  }

  // ---- 获取使用记录 ----
  function getRecords() {
    return _user?.records || [];
  }

  // ---- 获取用户名 ----
  function getUsername() {
    return _user?.username || '未登录用户';
  }

  // ---- 获取注册时间 ----
  function getMemberSince() {
    return _user?.memberSince || '—';
  }

  // 公开 API
  return {
    init,
    getUser,
    isMember,
    getTier,
    getTierLabel,
    canUse,
    getRemainingQuota,
    hasQuota,
    consumeQuota,
    addRecord,
    login,
    logout,
    upgradeTo,
    activateTrial,
    getExpireDateFormatted,
    getModelBadge,
    getTotalUsed,
    getRecords,
    getUsername,
    getMemberSince,
    onChange,
  };
})();
