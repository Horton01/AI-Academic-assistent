/**
 * ============================================================
 * AI Literature Assistant — User State & Permission Management
 * Supports both server mode (real backend + JWT) and
 * localStorage mock mode (fallback when server unavailable).
 * ============================================================
 */

const Auth = (() => {
  let _user = null;
  let _accessToken = null;
  let _listeners = [];
  let _serverMode = false;
  let _apiBase = '';

  function _getApiBase() {
    if (_apiBase) return _apiBase;
    if (APP_CONFIG.api && APP_CONFIG.api.baseUrl) {
      _apiBase = APP_CONFIG.api.baseUrl;
    }
    return _apiBase;
  }

  function setApiBase(url) { _apiBase = url; }

  async function _apiFetch(path, options = {}) {
    const base = _getApiBase();
    const url = base ? `${base}${path}` : path;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

    let res = await fetch(url, { ...options, headers });

    // Auto-refresh on 401
    if (res.status === 401 && _accessToken) {
      const refreshed = await _tryRefresh();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${_accessToken}`;
        res = await fetch(url, { ...options, headers });
      }
    }

    return res;
  }

  async function _tryRefresh() {
    try {
      const base = _getApiBase();
      const res = await fetch(`${base}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return false;
      const data = await res.json();
      _accessToken = data.accessToken;
      localStorage.setItem('ai_lit_token', _accessToken);
      return true;
    } catch {
      return false;
    }
  }

  function _notify() { _listeners.forEach(fn => fn(_user)); }

  function _initMockUser() {
    const saved = localStorage.getItem('ai_lit_user');
    if (saved) {
      try { _user = JSON.parse(saved); } catch (e) { _user = null; }
    }
    if (!_user) {
      _user = JSON.parse(JSON.stringify(APP_CONFIG.mockUser));
      _checkDailyReset();
      _saveMockUser();
    } else {
      _checkDailyReset();
    }
  }

  function _checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = _user._lastResetDate;
    if (lastReset !== today) {
      _user.remainingToday = APP_CONFIG.quota.freeDailyLimit;
      _user._lastResetDate = today;
      _saveMockUser();
    }
  }

  function _saveMockUser() {
    localStorage.setItem('ai_lit_user', JSON.stringify(_user));
    _notify();
  }

  async function init() {
    const token = localStorage.getItem('ai_lit_token');

    if (token) {
      // Try server mode
      try {
        _accessToken = token;
        const res = await _apiFetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          _user = {
            username: data.user.username,
            email: data.user.email,
            tier: data.user.tier,
            expireDate: data.user.expireDate,
            memberSince: data.user.memberSince,
            totalUsed: data.user.totalUsed || 0,
            remainingToday: APP_CONFIG.quota.freeDailyLimit,
            records: [],
          };
          _serverMode = true;
          _notify();
          _fetchQuotaFromServer();
          _fetchRecordsFromServer();
          return;
        }
      } catch (e) {
        // Server unreachable, fall back to mock
      }
    }

    // Fall back to mock mode
    _serverMode = false;
    _accessToken = null;
    _initMockUser();
  }

  async function _fetchQuotaFromServer() {
    try {
      const res = await _apiFetch('/api/quota');
      if (res.ok) {
        const data = await res.json();
        _user._serverQuota = data;
        _notify();
      }
    } catch {}
  }

  async function _fetchRecordsFromServer() {
    try {
      const res = await _apiFetch('/api/records');
      if (res.ok) {
        const data = await res.json();
        _user.records = data.records || [];
        _user.totalUsed = data.total || 0;
        _notify();
      }
    } catch {}
  }

  function isServerMode() { return _serverMode; }
  function getToken() { return _accessToken; }
  function getUser() { return _user ? { ..._user } : null; }

  function isMember() {
    if (!_user) return false;
    if (_user.tier === 'free') return false;
    if (_user.expireDate && new Date(_user.expireDate) < new Date()) {
      _user.tier = 'free';
      _user.expireDate = null;
      if (!_serverMode) _saveMockUser();
      return false;
    }
    return true;
  }

  function getTier() { return isMember() ? _user.tier : 'free'; }

  function canUse(functionId) {
    const fn = APP_CONFIG.functions.find(f => f.id === functionId);
    if (!fn) return false;
    if (fn.tier === 'free') return true;
    return isMember();
  }

  function getRemainingQuota() {
    if (!_user) return 0;
    if (_serverMode && _user._serverQuota) {
      const r = _user._serverQuota.remaining;
      return r === 'Unlimited' ? Infinity : r;
    }
    if (isMember()) {
      if (_user.tier === 'yearly') return Infinity;
      const used = (_user._dailyUsed || 0);
      return Math.max(0, 30 - used);
    }
    return _user.remainingToday || 0;
  }

  function consumeQuota() {
    if (!_user) return false;
    if (_serverMode) return true; // Server handles quota atomically
    if (isMember()) {
      _user._dailyUsed = (_user._dailyUsed || 0) + 1;
      _user.totalUsed = (_user.totalUsed || 0) + 1;
      _saveMockUser();
      return true;
    }
    if (_user.remainingToday > 0) {
      _user.remainingToday--;
      _user.totalUsed = (_user.totalUsed || 0) + 1;
      _saveMockUser();
      return true;
    }
    return false;
  }

  function updateQuotaFromServer(remaining) {
    if (!_user) return;
    if (!_user._serverQuota) _user._serverQuota = {};
    _user._serverQuota.remaining = remaining === Infinity ? 'Unlimited' : remaining;
    _notify();
  }

  function hasQuota() {
    if (_serverMode) {
      if (!_user._serverQuota) return true; // Not yet fetched, be optimistic
      const r = _user._serverQuota.remaining;
      return r === 'Unlimited' || r > 0;
    }
    if (isMember()) {
      if (_user.tier === 'yearly') return true;
      return (_user._dailyUsed || 0) < 30;
    }
    return (_user.remainingToday || 0) > 0;
  }

  function addRecord(type, title, words) {
    if (!_user) return;
    _user.records = _user.records || [];
    _user.records.unshift({
      date: new Date().toISOString().split('T')[0],
      type,
      title: title || 'Untitled Document',
      words: words || 0,
    });
    if (_user.records.length > 50) _user.records = _user.records.slice(0, 50);
    if (!_serverMode) _saveMockUser();
  }

  async function register(email, password, username) {
    try {
      const res = await _apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, username }),
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.error || 'Registration failed' };
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      localStorage.setItem('ai_lit_token', _accessToken);
      _user = {
        username: data.user.username,
        email: data.user.email,
        tier: data.user.tier,
        expireDate: null,
        memberSince: data.user.memberSince,
        totalUsed: 0,
        remainingToday: APP_CONFIG.quota.freeDailyLimit,
        records: [],
      };
      _serverMode = true;
      _notify();
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Unable to connect to server' };
    }
  }

  async function login(email, password) {
    try {
      const res = await _apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.error || 'Login failed' };
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      localStorage.setItem('ai_lit_token', _accessToken);
      _user = {
        username: data.user.username,
        email: data.user.email,
        tier: data.user.tier,
        expireDate: data.user.expireDate,
        memberSince: data.user.memberSince,
        totalUsed: data.user.totalUsed || 0,
        remainingToday: APP_CONFIG.quota.freeDailyLimit,
        records: [],
      };
      _serverMode = true;
      _notify();
      _fetchQuotaFromServer();
      _fetchRecordsFromServer();
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Unable to connect to server' };
    }
  }

  async function logout() {
    if (_serverMode) {
      try { await _apiFetch('/api/auth/logout', { method: 'POST' }); } catch {}
    }
    _accessToken = null;
    _serverMode = false;
    localStorage.removeItem('ai_lit_token');
    _user = JSON.parse(JSON.stringify(APP_CONFIG.mockUser));
    _checkDailyReset();
    _saveMockUser();
  }

  async function createCheckoutSession(plan) {
    try {
      const res = await _apiFetch('/api/payments/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, error: err.error || 'Failed to create checkout' };
      }
      const data = await res.json();
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Unable to connect to server' };
    }
  }

  async function activateTrial(days) {
    if (_serverMode) {
      try {
        const res = await _apiFetch('/api/trials/activate', { method: 'POST' });
        if (!res.ok) {
          const err = await res.json();
          // Fall back to mock trial
          _activateTrialMock(days || 3);
          return { success: true };
        }
        const data = await res.json();
        _user.tier = data.tier;
        _user.expireDate = data.expiresAt;
        _notify();
        return { success: true };
      } catch {
        _activateTrialMock(days || 3);
        return { success: true };
      }
    }
    _activateTrialMock(days || 3);
    return { success: true };
  }

  function _activateTrialMock(days) {
    if (!_user) return;
    _user.tier = 'monthly';
    const exp = new Date();
    exp.setDate(exp.getDate() + days);
    _user.expireDate = exp.toISOString();
    _user.remainingToday = Infinity;
    _saveMockUser();
  }

  function getExpireDateFormatted() {
    if (!_user || !_user.expireDate) return '—';
    const d = new Date(_user.expireDate);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getTierLabel() {
    const map = { free: 'Free', monthly: 'Monthly Member', yearly: 'Yearly Member' };
    return map[getTier()] || 'Free';
  }

  function getModelBadge() {
    const map = {
      free: APP_CONFIG.texts.modelBadgeBasic,
      monthly: APP_CONFIG.texts.modelBadgePriority,
      yearly: APP_CONFIG.texts.modelBadgeFast,
    };
    return map[getTier()] || APP_CONFIG.texts.modelBadgeBasic;
  }

  function getTotalUsed() { return _user?.totalUsed || 0; }
  function getRecords() { return _user?.records || []; }
  function getUsername() { return _user?.username || 'Guest'; }
  function getMemberSince() { return _user?.memberSince || '—'; }

  function onChange(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(f => f !== fn); };
  }

  function upgradeTo(tier) {
    if (!_user) return;
    _user.tier = tier;
    const now = new Date();
    if (tier === 'monthly') { now.setMonth(now.getMonth() + 1); }
    else if (tier === 'yearly') { now.setFullYear(now.getFullYear() + 1); }
    _user.expireDate = now.toISOString();
    _user.remainingToday = Infinity;
    if (!_serverMode) _saveMockUser();
    else _notify();
  }

  return {
    init, setApiBase, isServerMode, getToken,
    getUser, isMember, getTier, getTierLabel, canUse,
    getRemainingQuota, hasQuota, consumeQuota, updateQuotaFromServer, addRecord,
    register, login, logout, createCheckoutSession, activateTrial, upgradeTo,
    getExpireDateFormatted, getModelBadge, getTotalUsed, getRecords,
    getUsername, getMemberSince, onChange,
  };
})();
