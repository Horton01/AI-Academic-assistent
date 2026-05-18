/**
 * ============================================================
 * AI 文献助手 — 主应用模块
 * 负责：全局初始化、UI 交互绑定、页面渲染、弹窗管理
 * ============================================================
 */

const App = (() => {
  // ---- 初始化 ----
  function init() {
    Auth.init();
    Router.init();
    _bindGlobalEvents();
    _updateGlobalUI();
    _initHomePage();
    _initToolsPage();
    _initMembershipPage();
    _initProfilePage();
    _initHelpPage();

    // 监听用户状态变更，刷新 UI
    Auth.onChange(() => _updateGlobalUI());
  }

  // ---- 全局事件绑定 ----
  function _bindGlobalEvents() {
    // 弹窗关闭按钮
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', function () {
        const modalId = this.getAttribute('data-close-modal');
        _closeModal(modalId);
      });
    });

    // 点击遮罩关闭弹窗
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function (e) {
        if (e.target === this) {
          this.classList.add('hidden');
        }
      });
    });

    // 移动端菜单切换
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  // ---- 更新全局 UI（导航、额度显示等） ----
  function _updateGlobalUI() {
    const tier = Auth.getTier();
    const isMember = Auth.isMember();

    // 导航栏会员按钮
    const navMemberBtn = document.getElementById('nav-member-btn');
    if (navMemberBtn) {
      if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.navMemberBtn) {
        if (isMember) {
          navMemberBtn.textContent = '我的会员';
          navMemberBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
          navMemberBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
          navMemberBtn.textContent = '开通会员';
          navMemberBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
          navMemberBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
        navMemberBtn.classList.remove('hidden');
      } else {
        navMemberBtn.classList.add('hidden');
      }
    }

    // 会员中心导航项
    const navMembership = document.getElementById('nav-membership');
    if (navMembership) {
      navMembership.style.display =
        (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.membershipPage) ? '' : 'none';
    }

    // 页面内额度显示
    document.querySelectorAll('[data-quota-display]').forEach(el => {
      const remaining = Auth.getRemainingQuota();
      el.textContent = remaining === Infinity ? '无限' : remaining;
    });
  }

  // ---- 弹窗管理 ----
  function _openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  function _closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // =============================================================
  //                       首页初始化
  // =============================================================
  function _initHomePage() {
    // 功能卡片渲染
    const cardsContainer = document.getElementById('feature-cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = APP_CONFIG.functions.map(fn => {
        const isPaid = fn.category === 'paid';
        const paidBadge = isPaid && APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.featureLock
          ? '<span class="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">会员</span>'
          : '';
        const freeBadge = !isPaid
          ? '<span class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">免费</span>'
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

    // 活动 banner
    const promoBanner = document.getElementById('promo-banner');
    if (promoBanner) {
      if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.promoBanner) {
        promoBanner.classList.remove('hidden');
      } else {
        promoBanner.classList.add('hidden');
      }
    }

    // 私域引流
    const privateSection = document.getElementById('private-domain-section');
    if (privateSection) {
      if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.privateDomain) {
        privateSection.classList.remove('hidden');
      } else {
        privateSection.classList.add('hidden');
      }
    }

    // 新人福利弹窗（首次访问）
    if (APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.newUserGift) {
      const hasSeenGift = localStorage.getItem('ai_lit_gift_seen');
      if (!hasSeenGift) {
        setTimeout(() => _openModal('modal-new-user-gift'), 1500);
      }
    }
  }

  // ---- 领取新人福利 ----
  function claimNewUserGift() {
    Auth.activateTrial(3);
    localStorage.setItem('ai_lit_gift_seen', '1');
    _closeModal('modal-new-user-gift');
    _updateGlobalUI();
    Router.navigate('tools');
    _showToast('领取成功！3 天会员体验已生效', 'success');
  }

  // ---- 关闭新人弹窗 ----
  function dismissNewUserGift() {
    localStorage.setItem('ai_lit_gift_seen', '1');
    _closeModal('modal-new-user-gift');
  }

  // =============================================================
  //                     工具中心页初始化
  // =============================================================
  function _initToolsPage() {
    // 功能复选框渲染
    const fnCheckboxes = document.getElementById('function-checkboxes');
    if (fnCheckboxes) {
      fnCheckboxes.innerHTML = APP_CONFIG.functions.map(fn => {
        const isPaid = fn.category === 'paid';
        const locked = isPaid && APP_CONFIG.commercial.enabled && APP_CONFIG.commercial.featureLock && !Auth.isMember();
        return `
          <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${locked ? 'opacity-50' : ''}"
                 title="${locked ? '开通会员解锁' : ''}">
            <input type="checkbox" value="${fn.id}" class="fn-checkbox rounded text-blue-600 focus:ring-blue-500"
                   ${locked ? 'disabled' : ''} />
            <span class="text-sm font-medium text-gray-700">${fn.icon} ${fn.name}</span>
            ${locked ? '<span class="text-xs text-amber-600 ml-auto">🔒 会员</span>' : ''}
            ${!isPaid ? '<span class="text-xs text-green-600 ml-auto">免费</span>' : ''}
          </label>
        `;
      }).join('');
    }

    // 文件上传区域
    _initFileUpload();

    // 提交按钮
    const submitBtn = document.getElementById('btn-submit-tool');
    if (submitBtn) {
      submitBtn.addEventListener('click', _handleToolSubmit);
    }

    // 导出按钮
    document.querySelectorAll('[data-export]').forEach(btn => {
      btn.addEventListener('click', function () {
        const format = this.getAttribute('data-export');
        if (Auth.isMember()) {
          _showToast(`${format} 导出功能开发中，敬请期待`, 'info');
        } else {
          _openModal('modal-upgrade');
        }
      });
    });

    // 初始渲染额度
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

    // 拖拽事件
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
      _showToast('请输入文本或上传文件', 'warning');
      return;
    }

    // 获取选中的功能
    const checkedBoxes = document.querySelectorAll('.fn-checkbox:checked');
    if (checkedBoxes.length === 0) {
      _showToast('请至少选择一个功能', 'warning');
      return;
    }

    const functionType = checkedBoxes[0].value;
    const userTier = Auth.getTier();

    // 检查功能权限
    if (!Auth.canUse(functionType)) {
      _openModal('modal-upgrade');
      return;
    }

    // 检查次数
    if (!Auth.hasQuota()) {
      _renderQuotaExhaustedModal();
      _openModal('modal-quota-exhausted');
      return;
    }

    // 消耗次数
    Auth.consumeQuota();
    _updateQuotaDisplay();

    // 显示加载状态
    _setLoading(true);

    // 调用 API
    const response = await API.callDeepSeek({
      text: text || '上传文件内容（模拟）',
      functionType,
      userTier,
      file,
    });

    _setLoading(false);

    if (response.success) {
      _renderResult(response.data);
      Auth.addRecord(functionType, text?.substring(0, 50) || file?.name || '未命名', text?.length || 0);
    } else if (response.requireUpgrade) {
      _openModal('modal-upgrade');
    } else {
      _showToast(response.error || '处理失败，请重试', 'error');
    }
  }

  function _setLoading(loading) {
    const loadingEl = document.getElementById('loading-indicator');
    const resultEl = document.getElementById('result-area');
    const submitBtn = document.getElementById('btn-submit-tool');

    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.innerHTML = loading
        ? '<span class="inline-block animate-spin mr-2">⏳</span>处理中...'
        : '开始处理';
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
      resultMeta.textContent = `Tokens: ${data.tokens} · ${new Date(data.timestamp).toLocaleString('zh-CN')}`;
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
      quotaEl.innerHTML = '<span class="text-green-600">年卡会员 · 无限次使用</span>';
    } else if (tier === 'monthly') {
      quotaEl.innerHTML = `<span class="text-blue-600">月卡会员 · 今日剩余 ${remaining} 次</span>`;
    } else {
      const limit = APP_CONFIG.quota.freeDailyLimit;
      if (remaining <= 0) {
        quotaEl.innerHTML = `<span class="text-red-600">今日免费次数已用完</span>
          <button class="ml-2 text-sm text-blue-600 underline" onclick="App.openUpgradeModal()">升级会员</button>`;
      } else {
        quotaEl.innerHTML = `<span class="text-gray-500">今日剩余免费次数：<strong>${remaining}</strong> / ${limit}</span>`;
      }
    }
  }

  function _renderQuotaExhaustedModal() {
    const body = document.getElementById('quota-exhausted-body');
    if (body) {
      body.innerHTML = APP_CONFIG.texts.quotaExhaustedBody
        .replace('{used}', APP_CONFIG.quota.freeDailyLimit)
        .replace('{limit}', APP_CONFIG.quota.freeDailyLimit);
    }
  }

  // ---- 跳转到工具页并预选功能 ----
  function goToTools(functionId) {
    Router.navigate('tools');
    // 延迟勾选对应 checkbox
    setTimeout(() => {
      const cb = document.querySelector(`.fn-checkbox[value="${functionId}"]`);
      if (cb) {
        // 取消所有勾选
        document.querySelectorAll('.fn-checkbox').forEach(c => c.checked = false);
        cb.checked = true;
        // 滚动到输入区
        document.getElementById('tool-text-input')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // =============================================================
  //                     会员中心页初始化
  // =============================================================
  function _initMembershipPage() {
    const plansContainer = document.getElementById('membership-plans');
    if (!plansContainer) return;

    plansContainer.innerHTML = APP_CONFIG.membership.plans.map(plan => `
      <div class="bg-white rounded-2xl border-2 ${plan.popular ? 'border-blue-500 shadow-lg relative' : 'border-gray-200'} p-8 flex flex-col">
        ${plan.popular ? '<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">最受欢迎</span>' : ''}
        <h3 class="text-xl font-bold text-gray-900 mb-1">${plan.name}</h3>
        <div class="mb-6">
          <span class="text-4xl font-bold text-gray-900">${plan.priceLabel}</span>
          ${plan.period ? `<span class="text-gray-400 text-sm">/${plan.period}</span>` : ''}
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

  // ---- 打开支付弹窗 ----
  function openPaymentModal(planId) {
    const plan = APP_CONFIG.membership.plans.find(p => p.id === planId);
    if (!plan) return;

    const paymentPlanName = document.getElementById('payment-plan-name');
    const paymentPlanPrice = document.getElementById('payment-plan-price');
    if (paymentPlanName) paymentPlanName.textContent = plan.name;
    if (paymentPlanPrice) paymentPlanPrice.textContent = plan.priceLabel;

    _openModal('modal-payment');
  }

  // ---- 确认支付（mock） ----
  function confirmPayment() {
    const planName = document.getElementById('payment-plan-name')?.textContent || '';
    const plan = APP_CONFIG.membership.plans.find(p => p.name === planName);
    if (plan) {
      Auth.upgradeTo(plan.id);
      _closeModal('modal-payment');
      _updateGlobalUI();
      _showToast(`支付成功！已升级为${plan.name}`, 'success');
      setTimeout(() => Router.navigate('tools'), 1000);
    }
  }

  // ---- 打开升级弹窗 ----
  function openUpgradeModal() {
    _openModal('modal-upgrade');
  }

  // =============================================================
  //                     个人中心页初始化
  // =============================================================
  function _initProfilePage() {
    // 动态更新个人中心数据
    Auth.onChange(() => _renderProfile());
    // 初次渲染
    _renderProfile();
  }

  function _renderProfile() {
    // 用户名
    const el = document.getElementById('profile-username');
    if (el) el.textContent = Auth.getUsername();

    // 会员状态
    const tierEl = document.getElementById('profile-tier');
    if (tierEl) {
      const tier = Auth.getTier();
      tierEl.textContent = Auth.getTierLabel();
      tierEl.className = tier === 'free'
        ? 'px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600'
        : 'px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700';
    }

    // 会员状态文字
    const tierTextEl = document.getElementById('profile-tier-text');
    if (tierTextEl) tierTextEl.textContent = Auth.getTierLabel();

    // 升级按钮
    const upgradeBtn = document.getElementById('profile-upgrade-btn');
    if (upgradeBtn) {
      if (Auth.isMember()) {
        upgradeBtn.textContent = '管理会员';
        upgradeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        upgradeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
      } else {
        upgradeBtn.textContent = '升级会员';
        upgradeBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        upgradeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
      }
    }

    // 到期时间
    const expEl = document.getElementById('profile-expire');
    if (expEl) expEl.textContent = Auth.getExpireDateFormatted();

    // 剩余次数
    const quotaEl = document.getElementById('profile-quota');
    if (quotaEl) {
      const q = Auth.getRemainingQuota();
      quotaEl.textContent = q === Infinity ? '无限' : q;
    }

    // 总使用次数
    const totalEl = document.getElementById('profile-total-used');
    if (totalEl) totalEl.textContent = Auth.getTotalUsed();

    // 注册时间
    const sinceEl = document.getElementById('profile-member-since');
    if (sinceEl) sinceEl.textContent = Auth.getMemberSince();

    // 使用记录
    const recordsEl = document.getElementById('profile-records');
    if (recordsEl) {
      const records = Auth.getRecords();
      if (records.length === 0) {
        recordsEl.innerHTML = '<p class="text-gray-400 text-center py-8">暂无使用记录</p>';
      } else {
        recordsEl.innerHTML = records.map(r => `
          <tr class="border-b border-gray-100">
            <td class="py-3 text-sm text-gray-500">${r.date}</td>
            <td class="py-3 text-sm text-gray-700">${_getTypeLabel(r.type)}</td>
            <td class="py-3 text-sm text-gray-700 max-w-xs truncate">${r.title}</td>
            <td class="py-3 text-sm text-gray-500">${r.words.toLocaleString()} 字</td>
          </tr>
        `).join('');
      }
    }
  }

  function _getTypeLabel(type) {
    const map = {
      summarize: '智能总结',
      translate: '学术翻译',
      keywords: '关键词提取',
      deep_analysis: '深度拆解',
      compare: '多文献对比',
      citation: '引用转换',
    };
    return map[type] || type;
  }

  // ---- 退出登录 ----
  function logout() {
    if (confirm('确定要退出登录吗？')) {
      Auth.logout();
      _updateGlobalUI();
      Router.navigate('home');
      _showToast('已退出登录', 'info');
    }
  }

  // =============================================================
  //                     帮助中心页初始化
  // =============================================================
  function _initHelpPage() {
    // FAQ 折叠
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const icon = this.querySelector('.faq-icon');
        answer.classList.toggle('hidden');
        icon.textContent = answer.classList.contains('hidden') ? '▶' : '▼';
      });
    });
  }

  // ---- Toast 消息 ----
  function _showToast(message, type) {
    // 移除已有 toast
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

  // 公开 API（HTML onclick 调用）
  return {
    init,
    goToTools,
    claimNewUserGift,
    dismissNewUserGift,
    openUpgradeModal,
    openPaymentModal,
    confirmPayment,
    logout,
  };
})();

// ---- 启动应用 ----
document.addEventListener('DOMContentLoaded', () => App.init());
