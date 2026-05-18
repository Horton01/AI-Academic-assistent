/**
 * ============================================================
 * AI 文献助手 — DeepSeek API 接口模块
 * 当前为 mock 实现，模拟完整请求/响应流程
 * 后续替换真实 DeepSeek 接口只需修改 callDeepSeek 函数
 * ============================================================
 */

const API = (() => {
  // ---- Mock 响应数据池 ----
  const _mockResults = {
    summarize: {
      free: `【文献核心观点】
本文系统综述了深度学习在自然语言处理领域的最新进展，重点关注 Transformer 架构及其变体的应用。

【研究方法】
作者采用系统性文献回顾方法，检索了 2018-2024 年间发表于 ACL、EMNLP、NAACL 等顶级会议的 200 余篇论文。

【主要发现】
1. 预训练语言模型（PLM）已成为 NLP 的主流范式
2. 大语言模型（LLM）在少样本和零样本场景下表现优异
3. 模型效率与性能的权衡仍是开放问题

【结论与展望】
未来研究方向包括：更高效的注意力机制、多模态融合、以及模型可解释性。`,
      paid: `【文献核心观点】
本文系统综述了深度学习在自然语言处理领域的最新进展，重点关注 Transformer 架构及其变体的应用。研究指出，从 BERT 到 GPT 系列的演进代表了 NLP 范式的根本转变。

【研究方法与框架】
- 研究设计：系统性文献回顾 (Systematic Literature Review)
- 数据来源：ACL Anthology、IEEE Xplore、arXiv
- 时间跨度：2018-2024
- 纳入标准：被引 ≥ 10 次的同行评审论文
- 最终样本：217 篇论文

【创新点识别】
1. 首次将 LLM 涌现能力纳入综述框架
2. 提出了"能力-效率-可控性"三维评估模型
3. 识别了当前研究的 5 个方法论缺口

【批判性分析】
- 优势：覆盖面广，分类体系清晰
- 局限：未充分讨论低资源语言的挑战
- 偏差风险：英文文献为主，存在语言偏差

【对实践者的启示】
- 选择模型时需权衡任务需求与计算预算
- 建议优先考虑开源可复现的模型
- 关注模型部署的实际工程挑战`,
    },

    translate: {
      free: `【基础翻译结果】

原文核心段落翻译：
近年来，深度学习技术在自然语言处理领域取得了突破性进展。特别是基于 Transformer 架构的预训练语言模型，如 BERT 和 GPT 系列，在各种 NLP 任务中均展现出卓越的性能。

In recent years, deep learning technologies have achieved breakthrough progress in the field of natural language processing. In particular, pre-trained language models based on the Transformer architecture, such as BERT and GPT series, have demonstrated outstanding performance across various NLP tasks.`,
      paid: `【学术级翻译结果】

原文核心段落翻译（含术语对照与翻译说明）：

近年来，深度学习技术在自然语言处理领域取得了突破性进展。特别是基于 Transformer 架构的预训练语言模型，如 BERT 和 GPT 系列，在各种 NLP 任务中均展现出卓越的性能。

In recent years, deep learning technologies have achieved breakthrough progress in the field of natural language processing. In particular, pre-trained language models based on the Transformer architecture, such as BERT and GPT series, have demonstrated outstanding performance across various NLP tasks.

【关键术语对照】
- 深度学习 → Deep Learning
- 自然语言处理 → Natural Language Processing (NLP)
- Transformer 架构 → Transformer Architecture
- 预训练语言模型 → Pre-trained Language Models (PLMs)
- 突破性进展 → Breakthrough Progress

【翻译策略说明】
- 学术术语保持国际通用缩写（如 NLP）
- 中文被动语态转换为英文主动语态
- 保留了"突破性进展"的原文修辞力度
- 专有名词（BERT/GPT）保持原样`,
    },

    keywords: {
      free: `【关键词提取】

1. 深度学习 (Deep Learning)
2. 自然语言处理 (Natural Language Processing)
3. Transformer 架构 (Transformer Architecture)
4. 预训练语言模型 (Pre-trained Language Model)
5. 大语言模型 (Large Language Model)

【摘要生成】
本文综述了深度学习在 NLP 领域的最新进展，重点分析了 Transformer 架构及其变体在各项 NLP 任务中的应用效果。研究发现，预训练语言模型已成为当前 NLP 的主流技术范式。`,
      paid: `【关键词提取 - 按重要度排序】

核心关键词 (★)：
★ 1. Transformer 架构 (Transformer Architecture) — TF-IDF: 0.89
★ 2. 预训练语言模型 (Pre-trained Language Models) — TF-IDF: 0.85
★ 3. 自注意力机制 (Self-Attention Mechanism) — TF-IDF: 0.78

次要关键词：
4. 自然语言处理 (Natural Language Processing) — TF-IDF: 0.72
5. 大语言模型 (Large Language Models) — TF-IDF: 0.68
6. 迁移学习 (Transfer Learning) — TF-IDF: 0.63

【结构化摘要】
- 背景：NLP 领域正经历从传统方法向深度学习范式的转变
- 目的：系统梳理 Transformer 架构在各 NLP 子任务中的应用
- 方法：系统性文献回顾，纳入 217 篇高质量论文
- 结论：预训练 + 微调已成为 NLP 的标准范式
- 意义：为后续研究者提供方法选择参考框架`,
    },

    deep_analysis: {
      free: null, // 免费用户不可用
      paid: `【多层级深度拆解报告】

📋 第一层：结构化概览
- 标题：Deep Learning Approaches in Natural Language Processing: A Survey
- 作者：Zhang et al. (2024)
- 类型：综述论文 (Survey Paper)
- 章节结构：7 章（引言→背景→方法→应用→挑战→趋势→结论）

🔍 第二层：方法论评估
- 研究范式：系统性文献回顾 (SLR)
- 检索策略：关键词检索 + 滚雪球法
- 质量评估：使用 AMSTAR 2 评估工具
- 偏倚控制：双人独立筛选，Kappa = 0.85
- 方法论强度：★★★☆☆ (3/5)
  · 优势：检索策略系统，纳入标准明确
  · 不足：未注册 PROSPERO，未做灰色文献检索

💡 第三层：创新点识别
1. 提出了基于能力层级的模型分类框架（基础→进阶→涌现）
2. 识别了模型规模与性能的非线性关系
3. 首次在综述中引入能效比 (performance-per-watt) 评估维度

📊 第四层：证据质量评估
- 纳入研究设计：RCT 12%，准实验 35%，案例研究 53%
- 整体证据等级：Level B (中等偏上)
- 异质性：I² = 78%（高异质性，部分归因于任务类型差异）

🎯 第五层：实践建议
- 对研究者：优先考虑可复现的开源模型
- 对工程师：BERT-base 在多数场景下性价比最优
- 对管理者：关注模型部署的总拥有成本 (TCO)`,
    },

    compare: {
      free: null,
      paid: `【多文献对比分析报告】

对比文献（3 篇）：
A: Zhang et al. (2024) — Deep Learning in NLP: A Survey
B: Liu et al. (2023) — Transformer Variants: A Comprehensive Review
C: Wang et al. (2024) — Efficient NLP Models for Production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 对比维度矩阵：

┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│     维度          │   A (Zhang 24)    │   B (Liu 23)      │   C (Wang 24)     │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ 研究类型          │ 综述              │ 综述              │ 实证研究           │
│ 时间跨度          │ 2018-2024         │ 2017-2023         │ 2023-2024         │
│ 纳入文献数        │ 217               │ 156               │ N/A (实验)         │
│ 方法论严谨度      │ ★★★☆☆            │ ★★★★☆             │ ★★★★☆            │
│ 创新性            │ 中等              │ 高                 │ 高                │
│ 实用性            │ 高                │ 中等              │ 非常高             │
│ 主要贡献          │ 分类框架          │ 架构对比           │ 部署优化           │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘

🔍 共识与分歧：
【共识点】
- 三篇均认可 Transformer 作为基础架构的优势
- 都指出注意力机制的计算复杂度是核心瓶颈
- 一致看好稀疏注意力与模型压缩方向

【分歧点】
- A 认为模型规模仍是提升性能的关键，C 则认为边际收益递减
- B 主张架构创新，A 认为数据质量比架构更重要
- C 强调部署效率，与 A/B 的学术视角形成互补

📌 研究空白：
1. 缺乏低资源语言的大规模基准评测
2. 模型效率与公平性的交叉研究不足
3. 工业级部署的系统性经验研究稀缺`,
    },

    citation: {
      free: null,
      paid: `【引用格式转换结果】

输入格式：原始文献信息
转换数量：1 条
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【APA 7th】
Zhang, Y., Li, X., & Chen, W. (2024). Deep learning approaches in natural language processing: A survey. *Journal of Artificial Intelligence Research*, 79, 1-45. https://doi.org/10.xxxx/jaire.2024.001

【MLA 9th】
Zhang, Yifan, et al. "Deep Learning Approaches in Natural Language Processing: A Survey." *Journal of Artificial Intelligence Research*, vol. 79, 2024, pp. 1-45.

【Chicago (Author-Date)】
Zhang, Yifan, Xinyi Li, and Wei Chen. 2024. "Deep Learning Approaches in Natural Language Processing: A Survey." *Journal of Artificial Intelligence Research* 79: 1-45.

【GB/T 7714-2015】
ZHANG Y, LI X, CHEN W. Deep learning approaches in natural language processing: a survey[J]. Journal of Artificial Intelligence Research, 2024, 79: 1-45.

【哈佛格式】
Zhang, Y., Li, X. and Chen, W. (2024) 'Deep learning approaches in natural language processing: a survey', Journal of Artificial Intelligence Research, 79, pp. 1-45.`,
    },
  };

  // ---- 模拟网络延迟 ----
  function _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---- 核心调用函数 ----
  /**
   * 调用 DeepSeek API（当前为 mock）
   * @param {Object} params
   * @param {string} params.text - 输入文本
   * @param {string} params.functionType - 功能类型
   * @param {string} params.userTier - 用户等级
   * @param {File|null} params.file - 上传文件（mock 忽略）
   * @returns {Promise<Object>} API 响应
   */
  async function callDeepSeek({ text, functionType, userTier, file }) {
    // ---- 参数校验 ----
    if (!text && !file) {
      return { success: false, error: '请输入文本或上传文件' };
    }
    if (!functionType) {
      return { success: false, error: '请选择功能类型' };
    }

    const fn = APP_CONFIG.functions.find(f => f.id === functionType);
    if (!fn) {
      return { success: false, error: '无效的功能类型' };
    }

    // 权限检查
    if (fn.tier === 'paid' && userTier === 'free') {
      return {
        success: false,
        error: 'permission_denied',
        message: '该功能为会员专属，请升级后使用',
        requireUpgrade: true,
      };
    }

    // ---- Mock 模式 ----
    if (APP_CONFIG.api.mockEnabled) {
      await _delay(APP_CONFIG.api.mockDelay);

      const pool = _mockResults[functionType];
      if (!pool) {
        return { success: false, error: 'Mock 数据未配置' };
      }

      const resultText = userTier === 'free' ? pool.free : pool.paid;
      if (resultText === null) {
        return {
          success: false,
          error: 'permission_denied',
          message: '该功能为会员专属，请升级后使用',
          requireUpgrade: true,
        };
      }

      return {
        success: true,
        data: {
          result: resultText,
          model: userTier === 'free' ? 'basic' : (userTier === 'yearly' ? 'priority_fast' : 'priority'),
          modelLabel: userTier === 'free'
            ? APP_CONFIG.texts.modelBadgeBasic
            : (userTier === 'yearly' ? APP_CONFIG.texts.modelBadgeFast : APP_CONFIG.texts.modelBadgePriority),
          functionType,
          tokens: Math.floor(Math.random() * 2000) + 500,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // ---- 真实 API 模式（后续接入） ----
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.api.timeout);

      const response = await fetch(APP_CONFIG.api.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ai_lit_token') || ''}`,
        },
        body: JSON.stringify({
          text,
          file: file ? file.name : null,
          function_type: functionType,
          user_tier: userTier,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.name === 'AbortError' ? '请求超时，请稍后重试' : err.message,
      };
    }
  }

  // 公开 API
  return { callDeepSeek };
})();
