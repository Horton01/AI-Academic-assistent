/**
 * ============================================================
 * AI Literature Assistant — DeepSeek API Interface
 * Supports mock mode (local) and server mode (real backend).
 * ============================================================
 */

const API = (() => {
  const _mockResults = {
    summarize: {
      free: `【Core Argument】
This paper presents a systematic review of recent advances in deep learning for natural language processing, with a focus on Transformer architectures and their variants.

【Methodology】
The authors conducted a systematic literature review, searching 200+ papers from top-tier venues (ACL, EMNLP, NAACL) published between 2018–2024.

【Key Findings】
1. Pre-trained language models (PLMs) have become the dominant NLP paradigm
2. Large language models (LLMs) excel in few-shot and zero-shot scenarios
3. The trade-off between model efficiency and performance remains an open challenge

【Conclusions & Outlook】
Future directions include: more efficient attention mechanisms, multimodal fusion, and model interpretability.`,
      paid: `【Core Argument】
This paper systematically reviews recent advances in deep learning for NLP, with emphasis on Transformer architectures and their variants. The evolution from BERT to GPT-series models represents a fundamental paradigm shift in the field.

【Methodology & Framework】
- Study Design: Systematic Literature Review (SLR)
- Data Sources: ACL Anthology, IEEE Xplore, arXiv
- Time Span: 2018–2024
- Inclusion Criteria: Peer-reviewed papers with ≥ 10 citations
- Final Sample: 217 papers

【Innovation Identification】
1. First to incorporate LLM emergent capabilities into a review framework
2. Proposed a "Capability–Efficiency–Controllability" three-dimensional evaluation model
3. Identified 5 methodological gaps in current research

【Critical Analysis】
- Strengths: Broad coverage, clear classification taxonomy
- Limitations: Insufficient discussion of low-resource language challenges
- Risk of Bias: English-language dominance may introduce language bias

【Implications for Practitioners】
- Model selection should balance task requirements against compute budget
- Prioritize open-source, reproducible models when possible
- Consider real-world deployment engineering challenges`,
    },

    translate: {
      free: `【Basic Translation】

Original paragraph:
Recent years have witnessed breakthrough progress in deep learning technologies applied to natural language processing. In particular, pre-trained language models based on the Transformer architecture, such as BERT and GPT series, have demonstrated outstanding performance across a wide range of NLP tasks.

Translated (Chinese):
近年来，深度学习技术在自然语言处理领域取得了突破性进展。特别是基于 Transformer 架构的预训练语言模型，如 BERT 和 GPT 系列，在各种 NLP 任务中展现了卓越的性能。`,
      paid: `【Academic-Grade Translation】

Source text:
Recent years have witnessed breakthrough progress in deep learning technologies applied to natural language processing. In particular, pre-trained language models based on the Transformer architecture, such as BERT and GPT series, have demonstrated outstanding performance across a wide range of NLP tasks.

Target (Chinese — Simplified):
近年来，深度学习技术在自然语言处理领域取得了突破性进展。特别是基于 Transformer 架构的预训练语言模型（如 BERT 和 GPT 系列），在各类 NLP 任务中均展现出卓越性能。

【Key Terminology Mapping】
- Deep learning → 深度学习
- Natural Language Processing (NLP) → 自然语言处理
- Transformer architecture → Transformer 架构
- Pre-trained language models → 预训练语言模型 (PLMs)
- Breakthrough progress → 突破性进展

【Translation Notes】
- Academic abbreviations (NLP, PLM) preserved with Chinese gloss on first occurrence
- Passive voice in English converted to active voice in Chinese where idiomatic
- Technical terms consistently mapped to established Chinese academic conventions
- Proper nouns (BERT, GPT) left untranslated per academic standard`,
    },

    keywords: {
      free: `【Extracted Keywords】
1. Deep Learning
2. Natural Language Processing (NLP)
3. Transformer Architecture
4. Pre-trained Language Model
5. Large Language Model (LLM)

【Generated Abstract】
This paper reviews recent advances in deep learning for NLP, analyzing the application of Transformer architectures and their variants across NLP tasks. The review finds that pre-trained language models have become the dominant technical paradigm in contemporary NLP research.`,
      paid: `【Keywords — Ranked by Relevance】

Core Keywords (★):
★ 1. Transformer Architecture — TF-IDF: 0.89
★ 2. Pre-trained Language Models — TF-IDF: 0.85
★ 3. Self-Attention Mechanism — TF-IDF: 0.78

Secondary Keywords:
4. Natural Language Processing — TF-IDF: 0.72
5. Large Language Models — TF-IDF: 0.68
6. Transfer Learning — TF-IDF: 0.63

【Structured Abstract】
- Background: NLP is transitioning from traditional methods to deep learning paradigms
- Objective: Systematically map Transformer applications across NLP sub-tasks
- Method: Systematic literature review; 217 high-quality papers included
- Findings: Pre-training + fine-tuning is now the standard NLP workflow
- Significance: Provides a methodological reference framework for future research`,
    },

    deep_analysis: {
      free: null,
      paid: `【Multi-Layer Deep Analysis Report】

📋 Layer 1 — Structural Overview
- Title: Deep Learning Approaches in Natural Language Processing: A Survey
- Authors: Zhang et al. (2024)
- Type: Survey Paper
- Structure: 7 chapters (Introduction → Background → Methods → Applications → Challenges → Trends → Conclusion)

🔍 Layer 2 — Methodology Assessment
- Research Paradigm: Systematic Literature Review (SLR)
- Search Strategy: Keyword search + snowballing
- Quality Assessment: AMSTAR 2 tool
- Bias Control: Dual independent screening, Kappa = 0.85
- Methodological Rigor: ★★★☆☆ (3/5)
  · Strengths: Systematic search strategy, clear inclusion criteria
  · Weaknesses: No PROSPERO registration, no grey literature search

💡 Layer 3 — Innovation Identification
1. Proposed a capability-level model classification framework (Basic → Advanced → Emergent)
2. Identified non-linear relationship between model scale and performance
3. First to introduce performance-per-watt as an evaluation dimension in a survey context

📊 Layer 4 — Evidence Quality Assessment
- Study designs: RCT 12%, Quasi-experimental 35%, Case studies 53%
- Overall evidence level: Grade B (Moderate-High)
- Heterogeneity: I² = 78% (high; partly attributable to task-type variation)

🎯 Layer 5 — Practical Recommendations
- For researchers: Prioritize reproducible open-source models
- For engineers: BERT-base offers best cost-performance ratio in most scenarios
- For managers: Consider Total Cost of Ownership (TCO) for model deployment`,
    },

    compare: {
      free: null,
      paid: `【Multi-Document Comparison Report】

Documents Compared (3):
A: Zhang et al. (2024) — Deep Learning in NLP: A Survey
B: Liu et al. (2023) — Transformer Variants: A Comprehensive Review
C: Wang et al. (2024) — Efficient NLP Models for Production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Comparison Matrix:

┌──────────────────────┬──────────────────┬──────────────────┬──────────────────┐
│      Dimension       │   A (Zhang 24)   │   B (Liu 23)      │   C (Wang 24)     │
├──────────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Study Type           │ Survey           │ Survey           │ Empirical         │
│ Time Span            │ 2018–2024        │ 2017–2023        │ 2023–2024         │
│ Papers Included      │ 217              │ 156              │ N/A (experiments) │
│ Methodological Rigor │ ★★★☆☆           │ ★★★★☆            │ ★★★★☆            │
│ Innovation           │ Moderate         │ High             │ High              │
│ Practical Utility    │ High             │ Moderate         │ Very High         │
│ Key Contribution     │ Taxonomy         │ Architecture comp│ Deployment opt    │
└──────────────────────┴──────────────────┴──────────────────┴──────────────────┘

🔍 Consensus & Divergence:
【Consensus】
- All three endorse Transformer as the foundational architecture
- All identify attention mechanism complexity as the core bottleneck
- All favor sparse attention and model compression directions

【Divergence】
- A argues model scale remains key to performance; C argues diminishing returns
- B advocates architectural innovation; A argues data quality outweighs architecture
- C focuses on deployment efficiency, complementing the academic lens of A and B

📌 Research Gaps Identified:
1. Lack of large-scale benchmarks for low-resource languages
2. Insufficient cross-sectional research on model efficiency and fairness
3. Scarcity of systematic empirical studies on industrial-grade deployment`,
    },

    citation: {
      free: null,
      paid: `【Citation Format Conversion】

Input: Raw bibliographic metadata
Conversions: 1 entry
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【APA 7th】
Zhang, Y., Li, X., & Chen, W. (2024). Deep learning approaches in natural language processing: A survey. *Journal of Artificial Intelligence Research*, *79*, 1–45. https://doi.org/10.xxxx/jaire.2024.001

【MLA 9th】
Zhang, Yifan, et al. "Deep Learning Approaches in Natural Language Processing: A Survey." *Journal of Artificial Intelligence Research*, vol. 79, 2024, pp. 1–45.

【Chicago (Author-Date)】
Zhang, Yifan, Xinyi Li, and Wei Chen. 2024. "Deep Learning Approaches in Natural Language Processing: A Survey." *Journal of Artificial Intelligence Research* 79: 1–45.

【Harvard】
Zhang, Y., Li, X. and Chen, W. (2024) 'Deep learning approaches in natural language processing: a survey', *Journal of Artificial Intelligence Research*, 79, pp. 1–45.

【GB/T 7714-2015】
ZHANG Y, LI X, CHEN W. Deep learning approaches in natural language processing: a survey[J]. Journal of Artificial Intelligence Research, 2024, 79: 1-45.`,
    },
  };

  function _delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  function _getApiBase() {
    return (APP_CONFIG.api && APP_CONFIG.api.baseUrl) || '';
  }

  async function callDeepSeek({ text, functionType, userTier, file }) {
    if (!text && !file) {
      return { success: false, error: 'Please enter text or upload a file' };
    }
    if (!functionType) {
      return { success: false, error: 'Please select a function type' };
    }

    const fn = APP_CONFIG.functions.find(f => f.id === functionType);
    if (!fn) {
      return { success: false, error: 'Invalid function type' };
    }

    if (fn.tier === 'paid' && userTier === 'free') {
      return {
        success: false,
        error: 'permission_denied',
        message: 'This feature is members-only. Please upgrade to continue.',
        requireUpgrade: true,
      };
    }

    // Try server mode if mock is disabled and we have a token
    if (!APP_CONFIG.api.mockEnabled && Auth.getToken()) {
      try {
        const base = _getApiBase();
        const res = await fetch(`${base}/api/ai/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Auth.getToken()}`,
          },
          body: JSON.stringify({ text: text || 'Uploaded file content', functionType }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            // Update local quota cache from server response
            if (json.data.remaining !== undefined) {
              Auth.updateQuotaFromServer(json.data.remaining);
            }
            return { success: true, data: json.data };
          }
          return { success: false, error: json.error || 'Processing failed' };
        }

        if (res.status === 403) {
          const err = await res.json();
          if (err.requireUpgrade) {
            return { success: false, error: 'permission_denied', message: err.message, requireUpgrade: true };
          }
          return { success: false, error: err.message || 'Access denied' };
        }

        if (res.status === 429) {
          const err = await res.json();
          return { success: false, error: 'quota_exhausted', message: err.message, quotaExhausted: true, used: err.used, limit: err.limit };
        }

        return { success: false, error: 'Server error. Please try again.' };
      } catch (e) {
        // Fall through to mock if available
        if (!APP_CONFIG.api.mockEnabled) {
          return { success: false, error: 'Unable to connect to server. Please try again.' };
        }
      }
    }

    // Mock mode fallback
    if (APP_CONFIG.api.mockEnabled) {
      await _delay(APP_CONFIG.api.mockDelay);

      const pool = _mockResults[functionType];
      if (!pool) {
        return { success: false, error: 'Mock data not configured' };
      }

      const resultText = userTier === 'free' ? pool.free : pool.paid;
      if (resultText === null) {
        return {
          success: false,
          error: 'permission_denied',
          message: 'This feature is members-only. Please upgrade to continue.',
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

    return { success: false, error: 'API is not available' };
  }

  return { callDeepSeek };
})();
