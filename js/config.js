/**
 * ============================================================
 * AI 文献助手 — 全局配置文件
 * 所有商业化开关、定价、次数、文案均在此集中管理
 * 修改此文件即可一键控制全站商业模块的开启/隐藏
 * ============================================================
 */

const APP_CONFIG = {
  // ---- 产品基础信息 ----
  brand: {
    name: 'AI 文献助手',
    slogan: '跨境学术与职场文献的 AI 处理工具',
    shortDesc: '专注外文文献拆解 · 中英学术翻译 · 文献总结 · 多文献对比',
    logo: 'assets/logo.svg',
    favicon: 'assets/favicon.ico',
  },

  // ---- 商业化总开关 ----
  // true = 显示所有付费入口（会员页、升级提示、导出锁等）
  // false = 隐藏所有付费入口，纯免费工具
  commercial: {
    enabled: true,

    // 细粒度开关（仅在 commercial.enabled = true 时生效）
    membershipPage: true,       // 会员中心页面
    upgradePrompts: true,       // 工具页结果区升级提示
    exportLock: true,           // 导出按钮加锁
    featureLock: true,          // 高阶功能置灰
    quotaSystem: true,          // 免费次数限制
    promoBanner: true,          // 首页活动 banner
    newUserGift: true,          // 新人福利弹窗
    privateDomain: true,        // 私域引流（微信/社群）
    navMemberBtn: true,         // 导航栏「开通会员」按钮
  },

  // ---- 免费额度配置 ----
  quota: {
    freeDailyLimit: 3,          // 免费用户每日次数
    resetHour: 0,               // 每日重置时间（0-23 时）
  },

  // ---- 功能列表及权限 ----
  // tier: 'free' | 'monthly' | 'yearly'
  functions: [
    {
      id: 'summarize',
      name: '文献智能总结',
      icon: '📄',
      desc: 'AI 快速提炼文献核心观点、研究方法与结论',
      tier: 'free',
      category: 'free',
    },
    {
      id: 'translate',
      name: '中英学术翻译',
      icon: '🌐',
      desc: '学术级中英互译，保留专业术语与学术表达',
      tier: 'free',
      category: 'free',
    },
    {
      id: 'keywords',
      name: '关键词 / 摘要提取',
      icon: '🔑',
      desc: '自动提取核心关键词与结构化摘要',
      tier: 'free',
      category: 'free',
    },
    {
      id: 'deep_analysis',
      name: '多层级深度拆解',
      icon: '🔬',
      desc: '逐章节分析、方法论评估、创新点识别',
      tier: 'paid',
      category: 'paid',
    },
    {
      id: 'compare',
      name: '多文献对比分析',
      icon: '⚖️',
      desc: '最多 5 篇文献横向对比，生成差异矩阵',
      tier: 'paid',
      category: 'paid',
    },
    {
      id: 'citation',
      name: '引用格式批量转换',
      icon: '📝',
      desc: '支持 APA/MLA/Chicago/GB/T 等主流格式互转',
      tier: 'paid',
      category: 'paid',
    },
  ],

  // ---- 会员套餐配置 ----
  membership: {
    plans: [
      {
        id: 'free',
        name: '免费版',
        price: 0,
        period: '',
        priceLabel: '免费',
        popular: false,
        features: [
          { label: '每日基础总结/翻译', value: '3 次' },
          { label: '关键词/摘要提取', value: '3 次' },
          { label: '深度拆解', value: '—' },
          { label: '多文献对比', value: '—' },
          { label: '引用格式转换', value: '—' },
          { label: '导出（Word/PDF）', value: '—' },
          { label: '模型优先级', value: '基础模型' },
          { label: '长文本处理', value: '最多 5000 字' },
          { label: '多文献数量', value: '—' },
          { label: '专属模板', value: '—' },
        ],
        cta: '当前方案',
        ctaStyle: 'secondary',
      },
      {
        id: 'monthly',
        name: '月卡会员',
        price: 19,
        period: '月',
        priceLabel: '¥19 / 月',
        popular: true,
        features: [
          { label: '每日基础总结/翻译', value: '30 次' },
          { label: '关键词/摘要提取', value: '30 次' },
          { label: '深度拆解', value: '✓' },
          { label: '多文献对比', value: '✓' },
          { label: '引用格式转换', value: '✓' },
          { label: '导出（Word/PDF）', value: '✓' },
          { label: '模型优先级', value: '优先模型' },
          { label: '长文本处理', value: '最多 20000 字' },
          { label: '多文献数量', value: '最多 5 篇' },
          { label: '专属模板', value: '—' },
        ],
        cta: '立即开通月卡',
        ctaStyle: 'primary',
      },
      {
        id: 'yearly',
        name: '年卡会员',
        price: 199,
        period: '年',
        priceLabel: '¥199 / 年',
        popular: false,
        features: [
          { label: '每日基础总结/翻译', value: '无限次' },
          { label: '关键词/摘要提取', value: '无限次' },
          { label: '深度拆解', value: '✓' },
          { label: '多文献对比', value: '✓' },
          { label: '引用格式转换', value: '✓' },
          { label: '导出（Word/PDF）', value: '✓' },
          { label: '模型优先级', value: '优先高速模型' },
          { label: '长文本处理', value: '最多 50000 字' },
          { label: '多文献数量', value: '最多 10 篇' },
          { label: '专属模板', value: '✓' },
        ],
        cta: '立即开通年卡',
        ctaStyle: 'primary',
      },
    ],
  },

  // ---- 活动/促销配置 ----
  promo: {
    banner: {
      text: '🎓 留学申请季 · 年卡限时 8 折 · 助力学术之路',
      link: '#membership',
      bgClass: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    },
    newUserGift: {
      title: '欢迎使用 AI 文献助手',
      body: '新用户免费领取 <strong>3 天会员体验</strong>，畅享全部功能。<br>限时福利，立即开启高效文献处理体验。',
      couponCode: 'NEW3DAY',
      btnText: '免费领取',
    },
    privateDomain: {
      wechatQrText: '扫码添加小助手，领取学术资料包',
      communityText: '加入学术交流群，与同行交流',
    },
  },

  // ---- 文案配置（可替换为后台数据） ----
  texts: {
    upgradeModalTitle: '升级会员，解锁完整功能',
    upgradeModalBody: '该功能为会员专属。开通会员即可使用深度拆解、多文献对比、引用格式转换等全部高阶功能，并享受优先模型与导出权限。',
    quotaExhaustedTitle: '今日免费次数已用完',
    quotaExhaustedBody: '您今日的 <strong>{used}/{limit}</strong> 次免费额度已用完。<br>升级会员即可获得更多次数与高级功能。',
    exportLockedTip: '导出为会员专属功能，升级后即可使用',
    resultUpgradeTip: '以上为基础分析结果。升级会员解锁完整深度分析、多维度评估与一键导出。',
    modelBadgeBasic: '基础模型',
    modelBadgePriority: '优先模型',
    modelBadgeFast: '优先高速模型',
  },

  // ---- DeepSeek API 配置 ----
  api: {
    endpoint: '/api/deepseek',   // 真实接口地址（后续替换）
    mockEnabled: true,            // true=使用 mock, false=调用真实接口
    mockDelay: 1500,              // mock 模拟延迟（ms）
    timeout: 30000,               // 请求超时（ms）
  },

  // ---- 导航菜单 ----
  nav: [
    { label: '首页', href: '#home', icon: '' },
    { label: '工具中心', href: '#tools', icon: '' },
    { label: '会员中心', href: '#membership', icon: '', showWhen: 'commercial.membershipPage' },
    { label: '个人中心', href: '#profile', icon: '' },
    { label: '帮助中心', href: '#help', icon: '' },
  ],

  // ---- 用户 mock 数据 ----
  mockUser: {
    username: '学术用户',
    email: 'user@example.com',
    tier: 'free',                // 'free' | 'monthly' | 'yearly'
    expireDate: null,            // 会员到期日期 (ISO string or null)
    remainingToday: 3,           // 今日剩余次数
    totalUsed: 12,               // 累计使用次数
    memberSince: '2025-01-15',
    records: [
      { date: '2025-01-16', type: 'summarize', title: 'Machine Learning Survey 2024', words: 3500 },
      { date: '2025-01-16', type: 'translate', title: '深度学习在NLP中的应用', words: 1200 },
      { date: '2025-01-15', type: 'keywords', title: 'Transformer Architecture Paper', words: 8000 },
    ],
  },
};

// 冻结配置防止运行时修改
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.brand);
Object.freeze(APP_CONFIG.commercial);
Object.freeze(APP_CONFIG.quota);
Object.freeze(APP_CONFIG.membership);
Object.freeze(APP_CONFIG.promo);
Object.freeze(APP_CONFIG.texts);
Object.freeze(APP_CONFIG.api);
Object.freeze(APP_CONFIG.mockUser);
