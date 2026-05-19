/**
 * ============================================================
 * AI Literature Assistant — Main Application Module
 * Handles: global init, UI bindings, page rendering, modal management
 * ============================================================
 */

const App = (() => {
  async function init() {
    await Auth.init();
    Router.init();
    _bindGlobalEvents();
    _updateGlobalUI();
    _initHomePage();
    _initToolsPage();
    _initMembershipPage();
    _initProfilePage();
    _initHelpPage();
    Auth.onChange(() => _updateGlobalUI());
  }

  function _bindGlobalEvents() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', function () {
        const modalId = this.getAttribute('data-close-modal');
        _closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function (e) {
        if (e.target === this) { this.classList.add('hidden'); }
      });
    });

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
    }
  }

  function _updateGlobalUI() {
    const isMember = Auth.isMember();

    const navMemberBtn = document.getElementById('nav-member-btn');
    if (navMemberBtn) {
      if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.navMemberBtn) {
        if (isMember) {
          navMemberBtn.textContent = 'My Plan';
          navMemberBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
          navMemberBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
          navMemberBtn.textContent = 'Upgrade';
          navMemberBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
          navMemberBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
        navMemberBtn.classList.remove('hidden');
      } else {
        navMemberBtn.classList.add('hidden');
      }
    }

    const navMembership = document.getElementById('nav-membership');
    if (navMembership) {
      navMembership.style.display =
        (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.membershipPage) ? '' : 'none';
    }

    document.querySelectorAll('[data-quota-display]').forEach(el => {
      const remaining = Auth.getRemainingQuota();
      el.textContent = remaining === Infinity ? 'Unlimited' : remaining;
    });
  }

  function _openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  function _closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // =============================================================
  //                       Home Page
  // =============================================================
  function _initHomePage() {
    const cardsContainer = document.getElementById('feature-cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = APP_CONFIG.functions.map(fn => {
        const isPaid = fn.category === 'paid';
        const paidBadge = isPaid && APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.featureLock
          ? '<span class="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">Member</span>'
          : '';
        const freeBadge = !isPaid
          ? '<span class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Free</span>'
          : '';
        return `
          <div class="feature-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onclick="App.goToTools('${fn.id}')">
            <div class="text-3xl mb-3">${fn.icon}</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              ${fn.name}${paidBadge}${freeBadge}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">${fn.desc}</p>
          </div>
        `;
      }).join('');
    }

    const promoBanner = document.getElementById('promo-banner');
    if (promoBanner) {
      if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.promoBanner) {
        promoBanner.classList.remove('hidden');
      } else {
        promoBanner.classList.add('hidden');
      }
    }

    const privateSection = document.getElementById('private-domain-section');
    if (privateSection) {
      if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.privateDomain) {
        privateSection.classList.remove('hidden');
      } else {
        privateSection.classList.add('hidden');
      }
    }

    if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.newUserGift) {
      const hasSeenGift = localStorage.getItem('ai_lit_gift_seen');
      if (!hasSeenGift) {
        setTimeout(() => _openModal('modal-new-user-gift'), 1500);
      }
    }
  }

  function claimNewUserGift() {
    Auth.activateTrial(3);
    localStorage.setItem('ai_lit_gift_seen', '1');
    _closeModal('modal-new-user-gift');
    _updateGlobalUI();
    Router.navigate('tools');
    _showToast('Success! 3-day trial activated.', 'success');
  }

  function dismissNewUserGift() {
    localStorage.setItem('ai_lit_gift_seen', '1');
    _closeModal('modal-new-user-gift');
  }

  // =============================================================
  //                       Tools Page
  // =============================================================
  function _initToolsPage() {
    const fnCheckboxes = document.getElementById('function-checkboxes');
    if (fnCheckboxes) {
      fnCheckboxes.innerHTML = APP_CONFIG.functions.map(fn => {
        const isPaid = fn.category === 'paid';
        const locked = isPaid && APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.featureLock && !Auth.isMember();
        return `
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${locked ? 'opacity-50' : ''}"
                 title="${locked ? 'Upgrade to unlock' : ''}">
            <input type="checkbox" value="${fn.id}" class="fn-checkbox rounded text-blue-600 focus:ring-blue-500"
                   ${locked ? 'disabled' : ''} />
            <span class="text-sm font-medium text-gray-700">${fn.icon} ${fn.name}</span>
            ${locked ? '<span class="text-xs text-amber-600 ml-auto">🔒 Member</span>' : ''}
            ${!isPaid ? '<span class="text-xs text-green-600 ml-auto">Free</span>' : ''}
          </label>
        `;
      }).join('');
    }

    _initFileUpload();

    const submitBtn = document.getElementById('btn-submit-tool');
    if (submitBtn) { submitBtn.addEventListener('click', _handleToolSubmit); }

    document.querySelectorAll('[data-export]').forEach(btn => {
      btn.addEventListener('click', function () {
        const format = this.getAttribute('data-export');
        if (Auth.isMember()) {
          _showToast(`${format} export is under development — coming soon`, 'info');
        } else {
          _openModal('modal-upgrade');
        }
      });
    });

    _updateQuotaDisplay();
    Auth.onChange(() => _updateQuotaDisplay());
  }

  function _initFileUpload() {
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
        fileName.classList.remove('hidden');
      }
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-blue-400', 'bg-blue-50');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        fileName.textContent = e.dataTransfer.files[0].name;
        fileName.classList.remove('hidden');
      }
    });
  }

  async function _handleToolSubmit() {
    const textInput = document.getElementById('tool-text-input');
    const text = textInput?.value?.trim();
    const fileInput = document.getElementById('file-input');
    const file = fileInput?.files?.[0];

    if (!text && !file) {
      _showToast('Please enter text or upload a file', 'warning');
      return;
    }

    const checkedBoxes = document.querySelectorAll('.fn-checkbox:checked');
    if (checkedBoxes.length === 0) {
      _showToast('Please select at least one function', 'warning');
      return;
    }

    const functionType = checkedBoxes[0].value;
    const userTier = Auth.getTier();

    if (!Auth.canUse(functionType)) {
      _openModal('modal-upgrade');
      return;
    }

    if (!Auth.hasQuota() && !Auth.isServerMode()) {
      _renderQuotaExhaustedModal(APP_CONFIG.quota.freeDailyLimit, APP_CONFIG.quota.freeDailyLimit);
      _openModal('modal-quota-exhausted');
      return;
    }

    Auth.consumeQuota();
    _updateQuotaDisplay();

    _setLoading(true);

    const response = await API.callDeepSeek({
      text: text || 'Uploaded file content (simulated)',
      functionType,
      userTier,
      file,
    });

    _setLoading(false);

    if (response.success) {
      _renderResult(response.data);
      Auth.addRecord(functionType, text?.substring(0, 50) || file?.name || 'Untitled', text?.length || 0);
      _updateQuotaDisplay();
    } else if (response.requireUpgrade) {
      _openModal('modal-upgrade');
    } else if (response.quotaExhausted) {
      _renderQuotaExhaustedModal(response.used, response.limit);
      _openModal('modal-quota-exhausted');
    } else {
      _showToast(response.error || 'Processing failed. Please try again.', 'error');
    }
  }

  function _setLoading(loading) {
    const loadingEl = document.getElementById('loading-indicator');
    const submitBtn = document.getElementById('btn-submit-tool');
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.innerHTML = loading
        ? '<span class="inline-block animate-spin mr-2">⏳</span>Processing...'
        : 'Start Processing';
    }
  }

  function _renderResult(data) {
    const resultArea = document.getElementById('result-area');
    const resultContent = document.getElementById('result-content');
    const modelBadge = document.getElementById('model-badge');
    const resultMeta = document.getElementById('result-meta');
    const upgradeTip = document.getElementById('result-upgrade-tip');

    if (resultArea) resultArea.classList.remove('hidden');
    if (resultContent) {
      resultContent.innerHTML = data.result.replace(/\n/g, '<br>');
    }
    if (modelBadge) {
      modelBadge.textContent = data.modelLabel;
      modelBadge.className = data.model === 'basic'
        ? 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600'
        : 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700';
    }
    if (resultMeta) {
      resultMeta.textContent = `Tokens: ${data.tokens} · ${new Date(data.timestamp).toLocaleString('en-US')}`;
    }
    if (upgradeTip) {
      const isFree = Auth.getTier() === 'free';
      upgradeTip.classList.toggle('hidden', !isFree || !APP_CONFIG.commercial.enabled || !APP_CONFIG.commercial.upgradePrompts);
    }
  }

  function _updateQuotaDisplay() {
    const quotaEl = document.getElementById('quota-display');
    if (!quotaEl) return;

    if (!APP_CONFIG.commercial.enabled || !APP_CONFIG.commercial.quotaSystem) {
      quotaEl.classList.add('hidden');
      return;
    }

    const remaining = Auth.getRemainingQuota();
    const tier = Auth.getTier();

    quotaEl.classList.remove('hidden');
    if (tier === 'yearly') {
      quotaEl.innerHTML = '<span class="text-green-600">Yearly Member · Unlimited uses</span>';
    } else if (tier === 'monthly') {
      quotaEl.innerHTML = `<span class="text-blue-600">Monthly Member · ${remaining} remaining today</span>`;
    } else {
      const limit = APP_CONFIG.quota.freeDailyLimit;
      if (remaining <= 0) {
        quotaEl.innerHTML = `<span class="text-red-600">Daily free limit reached</span>
          <button class="ml-2 text-sm text-blue-600 underline" onclick="App.openUpgradeModal()">Upgrade</button>`;
      } else {
        quotaEl.innerHTML = `<span class="text-gray-500">Today's free quota: <strong>${remaining}</strong> / ${limit}</span>`;
      }
    }
  }

  function _renderQuotaExhaustedModal(used, limit) {
    const body = document.getElementById('quota-exhausted-body');
    if (body) {
      body.innerHTML = APP_CONFIG.texts.quotaExhaustedBody
        .replace('{used}', used)
        .replace('{limit}', limit);
    }
  }

  function goToTools(functionId) {
    Router.navigate('tools');
    setTimeout(() => {
      const cb = document.querySelector(`.fn-checkbox[value="${functionId}"]`);
      if (cb) {
        document.querySelectorAll('.fn-checkbox').forEach(c => c.checked = false);
        cb.checked = true;
        document.getElementById('tool-text-input')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // =============================================================
  //                       Membership Page
  // =============================================================
  function _initMembershipPage() {
    const plansContainer = document.getElementById('membership-plans');
    if (!plansContainer) return;

    plansContainer.innerHTML = APP_CONFIG.membership.plans.map(plan => `
      <div class="bg-white rounded-2xl border-2 ${plan.popular ? 'border-blue-500 shadow-lg relative' : 'border-gray-200'} p-8 flex flex-col">
        ${plan.popular ? '<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">Most Popular</span>' : ''}
        <h3 class="text-xl font-bold text-gray-900 mb-1">${plan.name}</h3>
        <div class="mb-6">
          <span class="text-4xl font-bold text-gray-900">${plan.priceLabel}</span>
          ${plan.period ? `<span class="text-gray-400 text-sm">${plan.period}</span>` : ''}
        </div>
        <ul class="space-y-3 mb-8 flex-1">
          ${plan.features.map(f => `
            <li class="flex items-center justify-between text-sm">
              <span class="text-gray-600">${f.label}</span>
              <span class="font-medium ${f.value === '—' ? 'text-gray-300' : 'text-gray-900'}">${f.value}</span>
            </li>
          `).join('')}
        </ul>
        <button class="w-full py-3 rounded-xl font-semibold text-sm transition-colors ${plan.ctaStyle === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                ${plan.id === 'free' ? '' : `onclick="App.openPaymentModal('${plan.id}')"`}>
          ${plan.cta}
        </button>
      </div>
    `).join('');
  }

  function openPaymentModal(planId) {
    const plan = APP_CONFIG.membership.plans.find(p => p.id === planId);
    if (!plan) return;

    const paymentPlanName = document.getElementById('payment-plan-name');
    const paymentPlanPrice = document.getElementById('payment-plan-price');
    if (paymentPlanName) paymentPlanName.textContent = plan.name;
    if (paymentPlanPrice) paymentPlanPrice.textContent = plan.priceLabel;

    _openModal('modal-payment');
  }

  async function confirmPayment() {
    const planName = document.getElementById('payment-plan-name')?.textContent || '';
    const plan = APP_CONFIG.membership.plans.find(p => p.name === planName);
    if (!plan || plan.id === 'free') return;

    // If in server mode, redirect to Stripe Checkout
    if (Auth.isServerMode()) {
      const result = await Auth.createCheckoutSession(plan.id);
      if (!result.success) {
        _showToast(result.error || 'Failed to start checkout', 'error');
      }
      // Page will redirect on success — no need to close modal
      return;
    }

    // Mock mode: direct upgrade
    Auth.upgradeTo(plan.id);
    _closeModal('modal-payment');
    _updateGlobalUI();
    _showToast(`Payment successful! Upgraded to ${plan.name}.`, 'success');
    setTimeout(() => Router.navigate('tools'), 1000);
  }

  function openUpgradeModal() {
    _openModal('modal-upgrade');
  }

  // =============================================================
  //                       Profile Page
  // =============================================================
  function _initProfilePage() {
    Auth.onChange(() => _renderProfile());
    _renderProfile();
  }

  function _renderProfile() {
    const el = document.getElementById('profile-username');
    if (el) el.textContent = Auth.getUsername();

    const tierEl = document.getElementById('profile-tier');
    if (tierEl) {
      const tier = Auth.getTier();
      tierEl.textContent = Auth.getTierLabel();
      tierEl.className = tier === 'free'
        ? 'px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600'
        : 'px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700';
    }

    const tierTextEl = document.getElementById('profile-tier-text');
    if (tierTextEl) tierTextEl.textContent = Auth.getTierLabel();

    const upgradeBtn = document.getElementById('profile-upgrade-btn');
    if (upgradeBtn) {
      if (Auth.isMember()) {
        upgradeBtn.textContent = 'Manage Plan';
        upgradeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        upgradeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
      } else {
        upgradeBtn.textContent = 'Upgrade';
        upgradeBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        upgradeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
      }
    }

    const expEl = document.getElementById('profile-expire');
    if (expEl) expEl.textContent = Auth.getExpireDateFormatted();

    const quotaEl = document.getElementById('profile-quota');
    if (quotaEl) {
      const q = Auth.getRemainingQuota();
      quotaEl.textContent = q === Infinity ? 'Unlimited' : q;
    }

    const totalEl = document.getElementById('profile-total-used');
    if (totalEl) totalEl.textContent = Auth.getTotalUsed();

    const sinceEl = document.getElementById('profile-member-since');
    if (sinceEl) sinceEl.textContent = Auth.getMemberSince();

    const recordsEl = document.getElementById('profile-records');
    if (recordsEl) {
      const records = Auth.getRecords();
      if (records.length === 0) {
        recordsEl.innerHTML = '<p class="text-gray-400 text-center py-8">No usage records yet</p>';
      } else {
        recordsEl.innerHTML = records.map(r => `
          <tr class="border-b border-gray-100">
            <td class="py-3 text-sm text-gray-500">${r.date}</td>
            <td class="py-3 text-sm text-gray-700">${_getTypeLabel(r.type)}</td>
            <td class="py-3 text-sm text-gray-700 max-w-xs truncate">${r.title}</td>
            <td class="py-3 text-sm text-gray-500">${r.words.toLocaleString()} chars</td>
          </tr>
        `).join('');
      }
    }
  }

  function _getTypeLabel(type) {
    const map = {
      summarize: 'Summary',
      translate: 'Translation',
      keywords: 'Keywords',
      deep_analysis: 'Deep Analysis',
      compare: 'Comparison',
      citation: 'Citation',
    };
    return map[type] || type;
  }

  function logout() {
    if (confirm('Are you sure you want to log out?')) {
      Auth.logout();
      _updateGlobalUI();
      Router.navigate('home');
      _showToast('Logged out.', 'info');
    }
  }

  // =============================================================
  //                       Help Page
  // =============================================================
  function _initHelpPage() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const icon = this.querySelector('.faq-icon');
        answer.classList.toggle('hidden');
        icon.textContent = answer.classList.contains('hidden') ? '▶' : '▼';
      });
    });
  }

  function _showToast(message, type) {
    const existing = document.querySelector('.app-toast');
    if (existing) existing.remove();

    const colors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      warning: 'bg-amber-500',
      info: 'bg-blue-600',
    };

    const toast = document.createElement('div');
    toast.className = `app-toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${colors[type] || colors.info} text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  return {
    init, goToTools,
    claimNewUserGift, dismissNewUserGift,
    openUpgradeModal, openPaymentModal, confirmPayment,
    logout,
  };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
