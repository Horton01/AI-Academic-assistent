/**
 * ============================================================
 * AI Literature Assistant — Global Configuration
 * All commercial toggles, pricing, quotas, and copy are managed here.
 * Edit this file to control all monetization modules site-wide.
 * ============================================================
 */

const APP_CONFIG = {
  // ---- Brand Info ----
  brand: {
    name: 'AI Literature Assistant',
    slogan: 'AI-Powered Cross-Border Academic & Professional Document Processing',
    shortDesc: 'Foreign literature analysis · Academic translation · Summarization · Multi-document comparison',
    logo: 'assets/logo.svg',
    favicon: 'assets/favicon.ico',
  },

  // ---- Commercial Master Switch ----
  // true = show all paid entry points (membership, upgrade prompts, export lock, etc.)
  // false = hide all paid entry points, pure free tool
  commercial: {
    enabled: true,

    // Granular toggles (only effective when commercial.enabled = true)
    membershipPage: true,
    upgradePrompts: true,
    exportLock: true,
    featureLock: true,
    quotaSystem: true,
    promoBanner: true,
    newUserGift: true,
    privateDomain: true,
    navMemberBtn: true,
  },

  // ---- Free Quota Config ----
  quota: {
    freeDailyLimit: 3,
    resetHour: 0,
  },

  // ---- Functions & Permissions ----
  // tier: 'free' | 'monthly' | 'yearly'
  functions: [
    {
      id: 'summarize',
      name: 'Smart Literature Summary',
      icon: '📄',
      desc: 'AI extracts core arguments, methodology, and conclusions from academic papers',
      tier: 'free',
      category: 'free',
    },
    {
      id: 'translate',
      name: 'Academic Translation',
      icon: '🌐',
      desc: 'Scholarly-grade translation preserving academic terminology and nuance across languages',
      tier: 'free',
      category: 'free',
    },
    {
      id: 'keywords',
      name: 'Keywords & Abstract Extraction',
      icon: '🔑',
      desc: 'Automatically extract key terms and generate structured abstracts',
      tier: 'free',
      category: 'free',
    },
    {
      id: 'deep_analysis',
      name: 'Multi-Layer Deep Analysis',
      icon: '🔬',
      desc: 'Chapter-by-chapter breakdown, methodology critique, innovation identification',
      tier: 'paid',
      category: 'paid',
    },
    {
      id: 'compare',
      name: 'Multi-Document Comparison',
      icon: '⚖️',
      desc: 'Side-by-side comparison of up to 5 papers with difference matrix generation',
      tier: 'paid',
      category: 'paid',
    },
    {
      id: 'citation',
      name: 'Batch Citation Formatting',
      icon: '📝',
      desc: 'Convert citations between APA, MLA, Chicago, Harvard, GB/T and more',
      tier: 'paid',
      category: 'paid',
    },
  ],

  // ---- Membership Plans ----
  membership: {
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        period: '',
        priceLabel: 'Free',
        popular: false,
        features: [
          { label: 'Summary / Translation', value: '3 / day' },
          { label: 'Keyword Extraction', value: '3 / day' },
          { label: 'Deep Analysis', value: '—' },
          { label: 'Multi-Doc Comparison', value: '—' },
          { label: 'Citation Formatting', value: '—' },
          { label: 'Export (Word/PDF)', value: '—' },
          { label: 'Model Priority', value: 'Basic' },
          { label: 'Max Text Length', value: '5,000 chars' },
          { label: 'Comparison Docs', value: '—' },
          { label: 'Exclusive Templates', value: '—' },
        ],
        cta: 'Current Plan',
        ctaStyle: 'secondary',
      },
      {
        id: 'monthly',
        name: 'Monthly',
        price: 19,
        period: '/mo',
        priceLabel: '$2.99 / mo',
        popular: true,
        features: [
          { label: 'Summary / Translation', value: '30 / day' },
          { label: 'Keyword Extraction', value: '30 / day' },
          { label: 'Deep Analysis', value: '✓' },
          { label: 'Multi-Doc Comparison', value: '✓' },
          { label: 'Citation Formatting', value: '✓' },
          { label: 'Export (Word/PDF)', value: '✓' },
          { label: 'Model Priority', value: 'Priority' },
          { label: 'Max Text Length', value: '20,000 chars' },
          { label: 'Comparison Docs', value: 'Up to 5' },
          { label: 'Exclusive Templates', value: '—' },
        ],
        cta: 'Start Monthly',
        ctaStyle: 'primary',
      },
      {
        id: 'yearly',
        name: 'Yearly',
        price: 199,
        period: '/yr',
        priceLabel: '$29.99 / yr',
        popular: false,
        features: [
          { label: 'Summary / Translation', value: 'Unlimited' },
          { label: 'Keyword Extraction', value: 'Unlimited' },
          { label: 'Deep Analysis', value: '✓' },
          { label: 'Multi-Doc Comparison', value: '✓' },
          { label: 'Citation Formatting', value: '✓' },
          { label: 'Export (Word/PDF)', value: '✓' },
          { label: 'Model Priority', value: 'Priority Fast' },
          { label: 'Max Text Length', value: '50,000 chars' },
          { label: 'Comparison Docs', value: 'Up to 10' },
          { label: 'Exclusive Templates', value: '✓' },
        ],
        cta: 'Start Yearly',
        ctaStyle: 'primary',
      },
    ],
  },

  // ---- Promo Config ----
  promo: {
    banner: {
      text: '🎓 Academic Season · 20% off yearly plan · Accelerate your research',
      link: '#membership',
      bgClass: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    },
    newUserGift: {
      title: 'Welcome to AI Literature Assistant',
      body: 'New users get a <strong>3-day free trial</strong> with full access to all features.<br>Limited-time offer — start processing literature efficiently today.',
      couponCode: 'NEW3DAY',
      btnText: 'Claim Free Trial',
    },
    privateDomain: {
      wechatQrText: 'Scan to add our assistant and get academic resource pack',
      communityText: 'Join our academic community and connect with peers',
    },
  },

  // ---- Text Copy (backend-configurable) ----
  texts: {
    upgradeModalTitle: 'Upgrade to Unlock All Features',
    upgradeModalBody: 'This feature is exclusive to members. Upgrade to access deep analysis, multi-document comparison, citation formatting, priority models, and export capabilities.',
    quotaExhaustedTitle: 'Daily Free Limit Reached',
    quotaExhaustedBody: 'You have used all <strong>{used}/{limit}</strong> free uses for today.<br>Upgrade to get more uses and advanced features.',
    exportLockedTip: 'Export is a member-only feature. Upgrade to unlock.',
    resultUpgradeTip: 'This is the basic analysis result. Upgrade to unlock complete in-depth analysis, multi-dimensional evaluation, and one-click export.',
    modelBadgeBasic: 'Basic Model',
    modelBadgePriority: 'Priority Model',
    modelBadgeFast: 'Priority Fast Model',
  },

  // ---- API Config ----
  // baseUrl: Set to backend URL in production (e.g., "https://api.yourdomain.com").
  // Leave empty for same-origin proxy or local dev.
  // mockEnabled: true = use mock data; false = call real backend.
  api: {
    baseUrl: '',
    endpoint: '/api/deepseek',
    mockEnabled: true,
    mockDelay: 1500,
    timeout: 30000,
  },

  // ---- Navigation ----
  nav: [
    { label: 'Home', href: '#home', icon: '' },
    { label: 'Tools', href: '#tools', icon: '' },
    { label: 'Membership', href: '#membership', icon: '', showWhen: 'commercial.membershipPage' },
    { label: 'Account', href: '#profile', icon: '' },
    { label: 'Help', href: '#help', icon: '' },
  ],

  // ---- Mock User Data ----
  mockUser: {
    username: 'Scholar User',
    email: 'user@example.com',
    tier: 'free',
    expireDate: null,
    remainingToday: 3,
    totalUsed: 12,
    memberSince: '2025-01-15',
    records: [
      { date: '2025-01-16', type: 'summarize', title: 'Machine Learning Survey 2024', words: 3500 },
      { date: '2025-01-16', type: 'translate', title: 'Deep Learning Applications in NLP', words: 1200 },
      { date: '2025-01-15', type: 'keywords', title: 'Transformer Architecture Paper', words: 8000 },
    ],
  },
};

Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.brand);
Object.freeze(APP_CONFIG.commercial);
Object.freeze(APP_CONFIG.quota);
Object.freeze(APP_CONFIG.membership);
Object.freeze(APP_CONFIG.promo);
Object.freeze(APP_CONFIG.texts);
Object.freeze(APP_CONFIG.api);
Object.freeze(APP_CONFIG.mockUser);
