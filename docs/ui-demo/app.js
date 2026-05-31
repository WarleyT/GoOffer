const statuses = [
  "待投递",
  "已投递",
  "沟通中",
  "笔试",
  "一面",
  "二面",
  "三面",
  "四面",
  "终面",
  "等待结果",
  "已拒绝",
  "已放弃",
  "已拿Offer"
];

const interviewResults = ["待面试", "等待结果", "失败", "通过"];

const statusTone = {
  待投递: "todo",
  已投递: "applied",
  沟通中: "talk",
  笔试: "test",
  一面: "interview",
  二面: "interview",
  三面: "interview",
  四面: "interview",
  终面: "interview",
  等待结果: "wait",
  已拒绝: "reject",
  已放弃: "quit",
  已拿Offer: "offer",
  通过: "offer",
  待面试: "wait",
  失败: "reject"
};

const jobs = [
  {
    id: "job-bd",
    company: "ByteDance",
    title: "高级前端开发工程师",
    city: "北京",
    salary: "35k - 50k",
    source: "内推",
    priority: "P1",
    status: "二面",
    logo: "BD",
    logoTone: "logo-red",
    updated: "今天",
    nextInterview: "明天 10:30",
    tags: ["React", "Next.js", "核心架构组"],
    description: "负责核心业务 Web 体验、性能优化、组件化建设和跨团队工程协作。",
    interviews: [
      {
        id: "int-bd-1",
        round: "第一轮：技术初试",
        time: "2026-05-24 14:00",
        duration: "60 分钟",
        result: "通过",
        questions: [
          {
            q: "请描述一下 React Fiber 的工作原理？",
            a: "重点回答了可中断渲染、优先级调度以及双缓存机制。面试官对任务切片的细节追问较多。"
          },
          {
            q: "手写一个 Promise.allSettled。",
            a: "说明了与 Promise.all 的差异，并补充了异常收集和顺序保持。"
          }
        ]
      },
      {
        id: "int-bd-2",
        round: "第二轮：技术复试",
        time: "2026-05-30 10:30",
        duration: "90 分钟",
        result: "待面试",
        questions: []
      }
    ],
    aiSummary: {
      overview: "项目表达清晰，能说明业务背景和技术选择；缓存策略、监控指标和回滚方案还可以更具体。",
      strengths: ["能把技术方案和业务目标联系起来", "React 基础和工程化经验较完整"],
      improvements: ["准备一个性能优化前后数据对比", "补充系统设计中的监控、降级和回滚方案"],
      next: ["复习微前端隔离机制", "准备复杂状态管理案例", "梳理接口稳定性方案"]
    }
  },
  {
    id: "job-tencent",
    company: "腾讯",
    title: "资深产品经理",
    city: "深圳",
    salary: "40k - 65k",
    source: "Boss 直聘",
    priority: "P1",
    status: "已投递",
    logo: "TX",
    logoTone: "logo-blue",
    updated: "昨天",
    nextInterview: "暂无",
    tags: ["平台产品", "增长", "用户体验"],
    description: "负责平台型产品规划、需求拆解、增长策略和跨团队推进。",
    interviews: [],
    aiSummary: null
  },
  {
    id: "job-ms",
    company: "微软",
    title: "Cloud PM",
    city: "苏州",
    salary: "30k - 45k",
    source: "官网",
    priority: "P2",
    status: "等待结果",
    logo: "MS",
    logoTone: "logo-blue",
    updated: "2 天前",
    nextInterview: "终面完成",
    tags: ["Cloud", "B2B", "英文面试"],
    description: "面向云产品客户场景，负责需求定义、路线图和跨区域团队协作。",
    interviews: [
      {
        id: "int-ms-1",
        round: "终面：Hiring Manager",
        time: "2026-05-27 16:00",
        duration: "45 分钟",
        result: "等待结果",
        questions: [
          {
            q: "如何平衡客户定制需求和平台长期规划？",
            a: "从用户分层、价值评估、路线图优先级和可复用能力沉淀四个角度回答。"
          }
        ]
      }
    ],
    aiSummary: null
  },
  {
    id: "job-meituan",
    company: "美团",
    title: "UI 设计师",
    city: "上海",
    salary: "25k - 40k",
    source: "猎头",
    priority: "P2",
    status: "已拿Offer",
    logo: "MT",
    logoTone: "logo-yellow",
    updated: "今天",
    nextInterview: "流程结束",
    tags: ["设计系统", "业务中台", "体验优化"],
    description: "负责业务工具体验设计、设计系统维护和跨端体验一致性。",
    interviews: [],
    aiSummary: null,
    offer: {
      location: "上海",
      totalComp: "45w",
      cashWidth: 78,
      workStyle: "混合办公",
      growth: 4,
      stability: 4,
      balance: 3,
      interest: 4,
      risk: "业务节奏偏快，需要确认团队资源。",
      decision: "待决定"
    }
  },
  {
    id: "job-shopify",
    company: "Shopify",
    title: "Growth Analyst",
    city: "远程",
    salary: "USD 90k",
    source: "LinkedIn",
    priority: "P3",
    status: "已拿Offer",
    logo: "SF",
    logoTone: "logo-yellow",
    updated: "4 天前",
    nextInterview: "下周一 09:00",
    tags: ["Remote", "Growth", "Analytics"],
    description: "负责增长数据分析、实验设计和商业洞察输出。",
    interviews: [],
    aiSummary: null,
    offer: {
      location: "远程",
      totalComp: "USD 90k",
      cashWidth: 72,
      workStyle: "远程",
      growth: 4,
      stability: 3,
      balance: 5,
      interest: 4,
      risk: "跨时区沟通成本较高。",
      decision: "待决定"
    }
  }
];

const state = {
  screen: "dashboard",
  activeJobId: "job-bd",
  sidebarCollapsed: false,
  filters: {
    query: "",
    status: "全部",
    city: "全部",
    priority: "全部",
    sort: "更新时间",
    view: "board"
  },
  offerSelection: jobs.filter((job) => job.status === "已拿Offer" && job.offer).map((job) => job.id),
  accountOpen: false,
  modal: null,
  modalError: "",
  activeInterviewId: null,
  jobSwitchDirection: "",
  scrollPositions: {
    dashboard: 0,
    jobs: 0,
    detail: 0,
    offers: 0
  },
  aiLoading: false,
  toast: ""
};

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const toastRoot = document.getElementById("toast-root");
let topbarCollapsed = false;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function activeJob() {
  return jobs.find((job) => job.id === state.activeJobId) || jobs[0];
}

function activeInterview() {
  const job = activeJob();
  return job.interviews.find((interview) => interview.id === state.activeInterviewId) || null;
}

function activeJobIndex() {
  return Math.max(0, jobs.findIndex((job) => job.id === activeJob().id));
}

function jobOffers() {
  return jobs.filter((job) => job.status === "已拿Offer" && job.offer);
}

function selectedOfferJobs() {
  const available = jobOffers();
  const selectedIds = state.offerSelection.length
    ? state.offerSelection
    : available.map((job) => job.id);
  return selectedIds
    .map((id) => available.find((job) => job.id === id))
    .filter(Boolean);
}

function badge(label, extra = "") {
  const tone = statusTone[label] || extra || "tertiary";
  return `<span class="badge ${tone}">${escapeHtml(label)}</span>`;
}

function parseTags(value) {
  return String(value || "")
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderTagPreview(value) {
  const tags = Array.isArray(value) ? value : parseTags(value);
  return tags.length
    ? tags.map((tag) => `<span class="badge todo">${escapeHtml(tag)}</span>`).join("")
    : `<small>多个标签请用“，”分隔</small>`;
}

function normalizeInterviewResult(value) {
  if (value === "已拒绝") return "失败";
  return interviewResults.includes(value) ? value : "待面试";
}

function roundLabel(index) {
  const labels = ["第一轮", "第二轮", "第三轮", "第四轮", "第五轮", "第六轮"];
  return labels[index] || `第${index + 1}轮`;
}

function splitRoundName(round, fallbackIndex) {
  const fallbackLabel = roundLabel(fallbackIndex);
  const parts = String(round || "").split(/[：:]/);
  if (parts.length > 1) {
    return {
      label: parts[0].trim() || fallbackLabel,
      name: parts.slice(1).join("：").trim()
    };
  }

  return {
    label: fallbackLabel,
    name: String(round || "").replace(/^第.+?轮/, "").trim()
  };
}

function parseDateTimeParts(value) {
  const match = String(value || "").match(/^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?/);
  return {
    date: match?.[1] || "",
    time: match?.[2] || ""
  };
}

function parseDurationAmount(value) {
  const match = String(value || "").match(/\d+/);
  return match ? match[0] : "";
}

function updateTagPreview(input) {
  const preview = input.closest(".tag-field")?.querySelector("[data-tag-preview]");
  if (preview) {
    preview.innerHTML = renderTagPreview(input.value);
  }
}

function isSourceLink(value) {
  return /^(https?:\/\/|www\.)\S+/i.test(String(value || "").trim());
}

function normalizeExternalUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function sourceValueHtml(value) {
  if (!isSourceLink(value)) {
    return `<strong>${escapeHtml(value)}</strong>`;
  }

  const href = normalizeExternalUrl(value);
  return `
    <a class="source-link-button" href="${escapeHtml(href)}" target="_blank" rel="noreferrer noopener">
      <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
      点击进入
    </a>
  `;
}

function ensureOffer(job) {
  if (job.offer) return job.offer;

  job.offer = {
    location: job.city || "待确认",
    totalComp: job.salary || "面议",
    cashWidth: Math.min(96, Math.max(42, Number.parseInt(job.salary, 10) || 64)),
    workStyle: isSourceLink(job.source) ? "链接投递" : (job.source || "待确认"),
    growth: 3,
    stability: 3,
    balance: 3,
    interest: 3,
    risk: "Offer 细节待补充。",
    decision: "待决定"
  };
  return job.offer;
}

function syncJobData(job) {
  if (!job) return;

  if (job.status === "已拿Offer") {
    ensureOffer(job);
    if (!state.offerSelection.includes(job.id)) {
      state.offerSelection = [...state.offerSelection, job.id].slice(0, 5);
    }
  } else if (state.offerSelection.includes(job.id)) {
    state.offerSelection = state.offerSelection.filter((id) => id !== job.id);
  }
}

jobs.forEach(syncJobData);

function customSelect({ name = "", id = "", label = "", options = [], value = "", className = "", attrs = "", displayPrefix = "" }) {
  const normalizedOptions = options.map(String);
  const current = normalizedOptions.includes(String(value)) ? String(value) : normalizedOptions[0] || "";
  const selectId = id ? `data-select-id="${escapeHtml(id)}"` : "";
  const prefix = displayPrefix ? `data-display-prefix="${escapeHtml(displayPrefix)}"` : "";
  const inputName = name ? `name="${escapeHtml(name)}"` : "";
  const inputId = id ? `id="${escapeHtml(id)}"` : "";
  const display = displayPrefix ? `${displayPrefix}：${current}` : current;

  return `
    <span class="custom-select select-shell ${className}" data-custom-select ${selectId} ${prefix} ${attrs}>
      <input type="hidden" ${inputName} ${inputId} value="${escapeHtml(current)}">
      <button class="custom-select-trigger" type="button" data-action="toggle-select" aria-haspopup="listbox" aria-expanded="false" ${label ? `aria-label="${escapeHtml(label)}"` : ""}>
        <span class="custom-select-value">${escapeHtml(display)}</span>
        <span class="select-arrow material-symbols-outlined" aria-hidden="true">expand_more</span>
      </button>
      <span class="custom-select-menu" role="listbox">
        ${normalizedOptions.map((option) => `
          <button class="custom-select-option${option === current ? " active" : ""}" type="button" data-action="choose-select" data-value="${escapeHtml(option)}" role="option" aria-selected="${option === current ? "true" : "false"}">
            ${escapeHtml(option)}
          </button>
        `).join("")}
      </span>
    </span>
  `;
}

function navItem(screen, label, icon) {
  const active = state.screen === screen ? " active" : "";
  return `
    <button class="nav-item${active}" type="button" data-action="nav" data-screen="${screen}" aria-current="${active ? "page" : "false"}" aria-label="${label}">
      <span class="nav-icon material-symbols-outlined" aria-hidden="true">${icon}</span>
      <span class="nav-label">${label}</span>
    </button>
  `;
}

function mobileNavItem(screen, label) {
  const active = state.screen === screen ? " active" : "";
  return `<button class="${active}" type="button" data-action="nav" data-screen="${screen}">${label}</button>`;
}

function button(label, action, variant = "", attrs = "") {
  return `<button class="button ${variant}" type="button" data-action="${action}" ${attrs}>${label}</button>`;
}

function metricCard(label, value, note, variant = "") {
  return `
    <article class="metric-card card ${variant}">
      <span class="metric-label">${label}</span>
      <strong class="metric-value">${value}</strong>
      <small class="metric-note">${note}</small>
    </article>
  `;
}

function metricButton(label, value, note, action, variant = "", attrs = "") {
  return `
    <button class="metric-card card ${variant}" type="button" data-action="${action}" ${attrs}>
      <span class="metric-label">${label}</span>
      <span class="metric-line">
        <strong class="metric-value">${value}</strong>
        <small class="metric-note">${note}</small>
      </span>
    </button>
  `;
}

function pageHeader(title, description, actionHtml = "", eyebrow = "") {
  if (!actionHtml && !eyebrow) return "";
  return `
    <header class="page-actions">
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}
      ${actionHtml ? `<div class="topbar-actions">${actionHtml}</div>` : ""}
    </header>
  `;
}

function renderShell(content) {
  const screenMeta = {
    dashboard: {
      title: "Dashboard",
      subtitle: "集中查看投递、面试和 Offer 状态"
    },
    jobs: {
      title: "Jobs",
      subtitle: "筛选、排序并更新每个岗位的投递状态"
    },
    detail: {
      title: "Job Detail",
      subtitle: "岗位详情、面试记录和总结沉淀在同一页"
    },
    offers: {
      title: "Offer Comparison",
      subtitle: "从薪资、成长、稳定性和偏好横向比较 Offer"
    }
  };
  const currentMeta = screenMeta[state.screen];
  const sidebarStateClass = state.sidebarCollapsed ? " sidebar-collapsed" : "";
  const sidebarMenu = sidebarMenuMeta();
  const navUp = navUpMeta();
  const topbarActions = {
    dashboard: button("新增岗位", "open-job-modal"),
    jobs: button("新增岗位", "open-job-modal"),
    detail: `
      ${button("分享", "toast", "surface", `data-message="分享链接已复制"`)}
      ${button("编辑岗位", "open-job-modal", "dark")}
    `,
    offers: button("选择Offer", "open-offer-select-modal")
  };

  return `
    <div class="app-shell screen-${state.screen}${sidebarStateClass}">
      <aside class="sidebar" aria-label="主导航">
        <div class="brand">
          <div class="brand-mark material-symbols-outlined" aria-hidden="true">workspaces</div>
          <div class="brand-name">GoOffer</div>
          <div class="brand-subtitle">个人求职工作台</div>
        </div>
        <nav class="side-nav">
          ${navItem("dashboard", "Dashboard", "dashboard")}
          ${navItem("jobs", "Jobs", "work")}
          ${navItem("detail", "Job Detail", "description")}
          ${navItem("offers", "Offer Comparison", "balance")}
        </nav>
        <div class="sidebar-bottom">
          <button class="icon-button sidebar-toggle" type="button" data-action="toggle-sidebar" aria-label="${sidebarMenu.label}" title="${sidebarMenu.label}" aria-expanded="${!state.sidebarCollapsed}">
            <span class="material-symbols-outlined" aria-hidden="true">${sidebarMenu.icon}</span>
            <span class="sidebar-toggle-label">${sidebarMenu.label}</span>
          </button>
          <button class="sidebar-user" type="button" data-action="toggle-account" aria-haspopup="dialog" aria-expanded="${state.accountOpen}">
            <span class="avatar">WT</span>
            <div>
              <strong>WarleyT</strong>
              <span>密集投递中</span>
            </div>
          </button>
        </div>
        ${state.accountOpen ? renderAccountPopover() : ""}
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div class="topbar-left">
            ${navUp.target ? `
              <button class="icon-button topbar-back" type="button" data-action="nav-up" aria-label="${navUp.label}" title="${navUp.label}">
                <span class="material-symbols-outlined" aria-hidden="true">${navUp.icon}</span>
              </button>
            ` : ""}
            <div class="topbar-heading">
              <h1 class="topbar-title">${currentMeta.title}</h1>
              <p class="topbar-subtitle">${currentMeta.subtitle}</p>
            </div>
          </div>
          <div class="topbar-actions">
            ${topbarActions[state.screen] || ""}
            <button class="icon-button topbar-notification" type="button" data-action="toast" data-message="提醒中心会在后续版本接入" aria-label="通知">
              <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
          </div>
        </header>
        <section class="content">${content}</section>
      </main>
      <nav class="bottom-nav" aria-label="移动端导航">
        ${mobileNavItem("dashboard", "概览")}
        ${mobileNavItem("jobs", "岗位")}
        ${mobileNavItem("detail", "详情")}
        ${mobileNavItem("offers", "对比")}
      </nav>
      <button class="button fab mobile-only" type="button" data-action="open-job-modal" aria-label="新增岗位">+</button>
    </div>
  `;
}

function renderAccountPopover() {
  return `
    <section class="account-popover" role="dialog" aria-label="个人账号">
      <div class="account-popover-head">
        <span class="avatar">WT</span>
        <div>
          <strong>WarleyT</strong>
          <span>warleyt@example.com</span>
        </div>
      </div>
      <div class="account-popover-grid">
        <span>
          <strong>${jobs.length}</strong>
          <small>岗位记录</small>
        </span>
        <span>
          <strong>${jobOffers().length}</strong>
          <small>Offer</small>
        </span>
      </div>
      <button class="account-popover-row" type="button" data-action="toast" data-message="账号设置会在后续版本接入">
        <span class="material-symbols-outlined" aria-hidden="true">manage_accounts</span>
        账号设置
      </button>
      <button class="account-popover-row" type="button" data-action="toast" data-message="已保持登录状态">
        <span class="material-symbols-outlined" aria-hidden="true">lock</span>
        登录安全
      </button>
    </section>
  `;
}

function renderDashboard() {
  const interviewing = jobs.filter((job) => ["一面", "二面", "三面", "四面", "终面"].includes(job.status));
  const followUps = jobs.filter((job) => ["已投递", "沟通中", "笔试", "等待结果"].includes(job.status)).slice(0, 3);
  const waiting = jobs.filter((job) => job.status === "等待结果");
  const offers = jobOffers();

  return `
    <section class="grid metric-grid">
      ${metricButton("投递总数", jobs.length, "活跃中", "nav", "", `data-screen="jobs"`)}
      ${metricButton("正在面试", interviewing.length, "即将开始", "scroll-section", "highlight", `data-target="recent-interviews"`)}
      ${metricButton("等待结果", waiting.length, "等待反馈", "scroll-section", "", `data-target="follow-up-section"`)}
      ${metricButton("收获 Offer", offers.length, "恭喜！", "nav", "dark", `data-screen="offers"`)}
    </section>

    <section class="grid bento-grid">
      <article class="card card-pad panel-list" id="recent-interviews">
        <div class="section-head">
          <h2>近期面试</h2>
          <span class="text-link" data-action="nav" data-screen="jobs">查看全部</span>
        </div>
        <div class="stack">
          ${interviewing.map((job) => dataRow(job.company, `${job.title} · ${job.nextInterview}`, badge(job.status), `data-action="select-job" data-job-id="${job.id}"`)).join("")}
          ${interviewing.length ? "" : emptyInline("还没有面试安排")}
        </div>
      </article>

      <article class="card card-pad ai-hero interactive-card">
        <span class="eyebrow">复盘</span>
        <h2>面试复盘报告已生成</h2>
        <p class="description">基于 ByteDance 技术初试记录，整理出 3 个可以补强的工程表达点。</p>
        <div style="margin-top: 24px;">${button("查看复盘", "nav-detail", "dark")}</div>
      </article>

      <article class="card card-pad full-span" id="follow-up-section">
        <div class="section-head">
          <h2>待跟进</h2>
          <div class="topbar-actions">
            <button class="icon-button" type="button" data-action="nav" data-screen="jobs" aria-label="筛选岗位">筛</button>
            <button class="icon-button" type="button" data-action="open-job-modal" aria-label="新增岗位">+</button>
          </div>
        </div>
        <div class="grid jobs-grid">
          ${followUps.map((job) => taskCard(job)).join("")}
        </div>
      </article>
    </section>
  `;
}

function dataRow(title, meta, aside, attrs = "") {
  return `
    <div class="data-row" ${attrs}>
      <div>
        <div class="row-title">${escapeHtml(title)}</div>
        <div class="row-meta">${escapeHtml(meta)}</div>
      </div>
      ${aside}
    </div>
  `;
}

function taskCard(job) {
  return `
    <button class="task-card" type="button" data-action="select-job" data-job-id="${job.id}">
      <span class="logo-tile compact ${job.logoTone}">${escapeHtml(job.logo)}</span>
      <div>
        <div class="row-title">${escapeHtml(job.company)} · ${escapeHtml(job.title)}</div>
        <div class="row-meta">${escapeHtml(job.status === "笔试" ? "今晚前完成笔试，并记录题目" : `${job.updated} 更新 · ${job.nextInterview}`)}</div>
      </div>
      ${badge(job.status)}
    </button>
  `;
}

function emptyInline(text) {
  return `<div class="empty-dash">${escapeHtml(text)}</div>`;
}

function filteredJobs() {
  const query = state.filters.query.trim().toLowerCase();
  const filtered = jobs.filter((job) => {
    const matchQuery = !query || `${job.company} ${job.title} ${job.city} ${job.tags.join(" ")}`.toLowerCase().includes(query);
    const matchStatus = state.filters.status === "全部"
      || (state.filters.status === "面试中" && statusTone[job.status] === "interview")
      || job.status === state.filters.status;
    const matchCity = state.filters.city === "全部" || job.city === state.filters.city;
    const matchPriority = state.filters.priority === "全部" || job.priority === state.filters.priority;
    return matchQuery && matchStatus && matchCity && matchPriority;
  });

  const order = [...filtered];
  if (state.filters.sort === "薪资") {
    order.sort((a, b) => Number.parseInt(b.salary, 10) - Number.parseInt(a.salary, 10));
  }
  if (state.filters.sort === "优先级") {
    order.sort((a, b) => a.priority.localeCompare(b.priority));
  }
  return order;
}

function renderJobs() {
  const list = filteredJobs();
  const cities = ["全部", ...Array.from(new Set(jobs.map((job) => job.city)))];
  const priorities = ["全部", ...Array.from(new Set(jobs.map((job) => job.priority)))];
  const metricActive = (status) => state.filters.status === status ? "highlight" : "";
  const currentViewIcon = state.filters.view === "list" ? "view_list" : "view_module";
  const nextView = state.filters.view === "list" ? "board" : "list";
  const nextViewLabel = state.filters.view === "list" ? "切换到看板视图" : "切换到列表视图";

  return pageHeader(
    "岗位",
    "筛选、排序并更新每个岗位的投递状态。"
  ) + `
    <section class="toolbar" aria-label="岗位筛选">
      <label class="search-control">
        <span class="button-icon material-symbols-outlined" aria-hidden="true">search</span>
        <input id="job-search" value="${escapeHtml(state.filters.query)}" placeholder="搜索公司、岗位、城市或标签" aria-label="搜索岗位">
      </label>
      ${selectControl("city-filter", "城市", cities, state.filters.city)}
      ${selectControl("priority-filter", "优先级", priorities, state.filters.priority)}
      ${selectControl("sort-filter", "排序", ["更新时间", "薪资", "优先级"], state.filters.sort)}
      <div class="view-switch" role="group" aria-label="视图切换">
        <button class="active" type="button" data-action="set-view" data-view="${nextView}" aria-label="${nextViewLabel}" title="${nextViewLabel}">
          <span class="material-symbols-outlined" aria-hidden="true">${currentViewIcon}</span>
        </button>
      </div>
    </section>

    <section class="grid metric-grid">
      ${metricButton("投递总数", jobs.length, "所有岗位记录", "filter-jobs", metricActive("全部"), `data-filter-status="全部"`)}
      ${metricButton("面试中", jobs.filter((job) => statusTone[job.status] === "interview").length, "一面到终面", "filter-jobs", metricActive("面试中"), `data-filter-status="面试中"`)}
      ${metricButton("等待结果", jobs.filter((job) => job.status === "等待结果").length, "等待反馈", "filter-jobs", metricActive("等待结果"), `data-filter-status="等待结果"`)}
      ${metricButton("已拿 Offer", jobOffers().length, "可进行比较", "filter-jobs", metricActive("已拿Offer"), `data-filter-status="已拿Offer"`)}
    </section>

    ${state.filters.view === "list" ? renderJobsList(list) : `
      <section class="grid jobs-grid">
        ${list.map((job) => renderJobCard(job)).join("")}
        <button class="add-card" type="button" data-action="open-job-modal">
          <span>
            <span class="add-card-icon"><span class="material-symbols-outlined" aria-hidden="true">add</span></span>
            <strong>添加新岗位</strong>
            <small>记录你的每一次尝试</small>
          </span>
        </button>
      </section>
    `}

    ${list.length ? "" : emptyInline("没有匹配的岗位，调整筛选条件再试试。")}
  `;
}

function renderJobsList(list) {
  return `
    <section class="card jobs-list">
      ${list.map((job) => `
        <button class="job-list-row" type="button" data-action="select-job" data-job-id="${job.id}">
          <span class="logo-tile ${job.logoTone}">${escapeHtml(job.logo)}</span>
          <span class="job-list-main">
            <strong>${escapeHtml(job.title)}</strong>
            <small>${escapeHtml(job.company)} · ${escapeHtml(job.city)} · ${escapeHtml(job.salary)}</small>
          </span>
          <span class="job-list-meta">${escapeHtml(job.updated)} 更新</span>
          <span class="job-list-status">${badge(job.status)}</span>
          <span class="priority-chip">
            <span class="material-symbols-outlined" aria-hidden="true">star</span>
            ${escapeHtml(job.priority)} 优先级
          </span>
        </button>
      `).join("")}
    </section>
  `;
}

function selectControl(id, label, options, value) {
  return customSelect({
    id,
    label,
    options,
    value,
    className: "toolbar-select",
    displayPrefix: label
  });
}

function renderJobCard(job) {
  return `
    <article class="job-card card interactive-card" role="button" tabindex="0" data-action="select-job" data-job-id="${job.id}">
      <div>
        <div class="job-card-top">
          <span class="logo-tile ${job.logoTone}">${escapeHtml(job.logo)}</span>
          ${badge(job.status)}
        </div>
        <div class="job-title">
          <h2>${escapeHtml(job.title)}</h2>
          <p class="job-company">${escapeHtml(job.company)} · ${escapeHtml(job.city)}</p>
        </div>
        <div class="tag-row">
          ${job.tags.slice(0, 3).map((tag) => `<span class="badge todo">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <footer class="job-footer">
        <div>
          <div class="salary-label">薪资范围</div>
          <div class="salary">${escapeHtml(job.salary)}</div>
        </div>
        <span class="priority-chip">
          <span class="material-symbols-outlined" aria-hidden="true">star</span>
          ${escapeHtml(job.priority)} 优先级
        </span>
      </footer>
    </article>
  `;
}

function renderDetail() {
  const job = activeJob();
  const transitionClass = state.jobSwitchDirection ? ` detail-transition-${state.jobSwitchDirection}` : "";

  return pageHeader(
    "Job Detail",
    "岗位详情、面试记录和总结沉淀在同一页。"
  ) + `
    <section class="detail-layout${transitionClass}">
      <div>
        <article class="card card-pad hero-card">
          <div class="inline-between" style="align-items:flex-start;">
            <div class="hero-content">
              <span class="logo-tile large ${job.logoTone}">${escapeHtml(job.logo)}</span>
              <div class="hero-copy">
                <h1>${escapeHtml(job.company)} · ${escapeHtml(job.title)}</h1>
                <p class="description">${escapeHtml(job.description)}</p>
                <div class="hero-meta-row">
                  <div class="tag-row">
                    ${job.tags.map((tag) => `<span class="badge todo">${escapeHtml(tag)}</span>`).join("")}
                  </div>
                  ${statusQuickControl(job)}
                </div>
              </div>
            </div>
          </div>
        </article>

        <section class="stack">
          <div class="section-head">
            <h2>面试记录</h2>
            ${button("添加新轮次", "open-interview-modal", "subtle")}
          </div>
          ${job.interviews.length ? job.interviews.map((interview) => renderInterviewCard(interview)).join("") : emptyInline("当前岗位还没有面试记录。")}
        </section>
      </div>

      <aside class="side-stack">
        ${renderDetailActions(job)}

        <section class="card card-pad quick-info">
          <h2>岗位概览</h2>
          ${quickItem("location_on", "城市", job.city)}
          ${quickItem("payments", "薪资范围", job.salary)}
          ${sourceQuickItem(job.source)}
          ${selectField("detailStatus", "当前状态", statuses, job.status, `data-job-status-select data-job-id="${job.id}"`)}
        </section>

        ${renderAiCard(job)}
      </aside>
    </section>
    ${renderDetailSwitcher()}
  `;
}

function renderDetailSwitcher() {
  if (jobs.length < 2) return "";
  const currentIndex = activeJobIndex();
  const prevJob = jobs[(currentIndex - 1 + jobs.length) % jobs.length];
  const nextJob = jobs[(currentIndex + 1) % jobs.length];

  return `
    <nav class="detail-switcher" aria-label="岗位详情快捷切换">
      <button class="detail-switch-button prev" type="button" data-action="switch-detail-job" data-direction="prev" aria-label="上一个岗位：${escapeHtml(prevJob.company)} ${escapeHtml(prevJob.title)}">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <button class="detail-switch-button next" type="button" data-action="switch-detail-job" data-direction="next" aria-label="下一个岗位：${escapeHtml(nextJob.company)} ${escapeHtml(nextJob.title)}">
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </nav>
  `;
}

function renderDetailActions(job) {
  const offerWon = job.status === "已拿Offer";
  if (offerWon) {
    return `
      <div class="action-stack offer-won">
        ${button(`<span class="material-symbols-outlined" aria-hidden="true">celebration</span>已拿下Offer！！！`, "mark-offer-won", "offer-won-action")}
      </div>
    `;
  }

  return `
    <div class="action-stack">
      ${button(`<span class="material-symbols-outlined" aria-hidden="true">add_task</span>添加面试`, "open-interview-modal")}
      ${button(`<span class="material-symbols-outlined" aria-hidden="true">card_membership</span>拿下Offer了吗`, "mark-offer-won", "dark")}
    </div>
  `;
}

function statusQuickControl(job) {
  const tone = statusTone[job.status] || "tertiary";
  return customSelect({
    label: "快速修改投递状态",
    options: statuses,
    value: job.status,
    className: `status-quick ${tone}`,
    attrs: `data-job-status-select data-job-id="${job.id}"`
  });
}

function quickItem(icon, label, value) {
  return `
    <div class="quick-item">
      <span class="round-icon material-symbols-outlined" aria-hidden="true">${icon}</span>
      <div>
        <span>${label}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    </div>
  `;
}

function sourceQuickItem(value) {
  return `
    <div class="quick-item source-quick-item">
      <span class="round-icon material-symbols-outlined" aria-hidden="true">campaign</span>
      <div>
        <span>招聘渠道</span>
        ${sourceValueHtml(value)}
      </div>
    </div>
  `;
}

function renderInterviewCard(interview) {
  const result = normalizeInterviewResult(interview.result);
  return `
    <article class="card card-pad interview-card" role="button" tabindex="0" data-action="open-interview-editor" data-interview-id="${interview.id}" aria-label="编辑${escapeHtml(interview.round)}">
      <div class="inline-between">
        <div>
          <h3>${escapeHtml(interview.round)}</h3>
          <p class="row-meta">${escapeHtml(interview.time)} · ${escapeHtml(interview.duration)}</p>
        </div>
        ${interviewResultControl(interview.id, result)}
      </div>
      ${interview.questions.length ? interview.questions.map((item) => `
        <div class="question-box">
          <strong>Q：${escapeHtml(item.q)}</strong>
          <p>${escapeHtml(item.a)}</p>
        </div>
      `).join("") : `<div class="empty-dash" style="margin-top: 18px;">记录仍在整理中，添加问题后可以生成更具体的总结。</div>`}
    </article>
  `;
}

function interviewResultControl(interviewId, value) {
  return customSelect({
    label: "面试情况",
    options: interviewResults,
    value,
    className: `interview-result-select ${statusTone[value] || "wait"}`,
    attrs: `data-interview-result-select data-interview-id="${interviewId}"`
  });
}

function renderAiCard(job) {
  if (state.aiLoading) {
    return `
      <section class="card card-pad ai-card">
        <div class="section-head">
          <h2 class="ai-card-title"><span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>面试助手</h2>
          <span class="badge ai-chip">生成中</span>
        </div>
        <div class="ai-section">
          <p>正在根据岗位信息、面试问题和你的回答整理复盘建议...</p>
        </div>
        <button class="button" type="button" disabled>正在生成</button>
      </section>
    `;
  }

  if (!job.aiSummary) {
    return `
      <section class="card card-pad ai-card">
        <div class="section-head">
          <h2 class="ai-card-title"><span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>面试助手</h2>
          <span class="badge ai-chip">总结</span>
        </div>
        <div class="ai-section">
          <p>当前岗位还没有总结。记录面试问题和回答后，可以生成结构化复盘。</p>
        </div>
        ${button("生成总结", "generate-ai")}
      </section>
    `;
  }

  return `
    <section class="card card-pad ai-card">
      <div class="section-head">
        <h2 class="ai-card-title"><span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>面试助手</h2>
        <span class="badge ai-chip">总结</span>
      </div>
      <div class="ai-section">
        <h3>本轮复盘</h3>
        <p>${escapeHtml(job.aiSummary.overview)}</p>
      </div>
      <div class="ai-section">
        <h3>准备建议</h3>
        <ul>
          ${job.aiSummary.next.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      ${button("重新生成复盘", "generate-ai")}
    </section>
  `;
}

function renderOffers() {
  const offers = selectedOfferJobs();
  const best = offers.reduce((winner, job) => (offerScore(job.offer) > offerScore(winner.offer) ? job : winner), offers[0] || null);

  return pageHeader(
    "Offer 对比",
    "从薪资、成长、稳定性和偏好横向比较 Offer。"
  ) + `
    <section class="grid offers-grid">
      ${offers.map((job) => renderOfferCard(job, best && best.id === job.id)).join("")}
      <button class="add-card" type="button" data-action="open-offer-select-modal">
        <span>
          <span class="add-card-icon">+</span>
          <strong>选择已有Offer</strong>
          <small>从已拿 Offer 中选择 2-5 个进行对比</small>
        </span>
      </button>
    </section>
    ${offers.length ? renderDecisionSection(best, offers) : emptyInline("还没有选择 Offer，选择后即可进行横向比较。")}
  `;
}

function offerScore(offer) {
  const values = [offer.growth, offer.stability, offer.balance, offer.interest];
  return values.reduce((sum, item) => sum + Number(item || 0), 0) / values.length;
}

function renderOfferCard(job, isBest) {
  const offer = job.offer;
  const score = offerScore(offer);
  return `
    <article class="offer-card card ${isBest ? "best" : ""}" data-offer-card data-job-id="${job.id}">
      <div class="offer-top">
        <span class="logo-tile large ${job.logoTone}">${escapeHtml(job.logo)}</span>
        ${isBest ? `<span class="badge applied">Top Choice</span>` : `<span class="badge tertiary">${escapeHtml(offer.decision)}</span>`}
      </div>
      <h2 style="margin-top: 18px;">${escapeHtml(job.company)}</h2>
      <p class="offer-meta">${escapeHtml(job.title)} · ${escapeHtml(offer.location)} · ${escapeHtml(offer.workStyle)}</p>
      <button class="offer-block offer-edit-block" type="button" data-action="open-offer-editor" data-job-id="${job.id}">
        <span class="offer-block-label">年总包薪资 TC</span>
        <strong class="offer-block-value">${escapeHtml(offer.totalComp)}</strong>
        <div class="progress"><span style="width:${Math.max(8, Math.min(100, offer.cashWidth))}%"></span></div>
      </button>
      ${ratingBlock(job.id, "成长空间", "growth", offer.growth)}
      ${ratingBlock(job.id, "稳定性", "stability", offer.stability)}
      ${ratingBlock(job.id, "工作生活平衡", "balance", offer.balance)}
      <button class="offer-block offer-edit-block" type="button" data-action="open-offer-editor" data-job-id="${job.id}">
        <span class="offer-block-label">风险点</span>
        <p style="margin-top: 6px;">${escapeHtml(offer.risk)}</p>
      </button>
      <div class="score-line">
        <span class="offer-block-label">综合评分</span>
        <strong data-offer-score>${score.toFixed(1)}</strong>
      </div>
    </article>
  `;
}

function ratingBlock(jobId, label, field, value) {
  return `
    <div class="offer-block rating-block">
      <span class="offer-block-label">${label}</span>
      <div class="rating-control" style="--rating:${Number(value) || 1};">
        <div class="rating-bars" aria-hidden="true">
          ${[1, 2, 3, 4, 5].map((item) => `<span class="${item <= value ? "filled" : ""}"></span>`).join("")}
        </div>
        <input type="range" min="1" max="5" step="1" value="${Number(value) || 1}" aria-label="${label} ${value} 分" data-offer-rating data-job-id="${jobId}" data-rating-field="${field}">
      </div>
    </div>
  `;
}

function renderDecisionSection(best, offers) {
  return `
    <section class="decision-grid">
      <article class="card card-pad ai-card decision-card">
        <div class="section-head">
          <h2>决策分析</h2>
          <span class="badge ai-chip">参考建议</span>
        </div>
        <p>基于当前评分，${escapeHtml(best.company)} 的综合评分暂时最高。它并不代表绝对最优，建议继续结合职业目标、城市成本、团队风险和个人生活节奏做最终选择。</p>
        <div class="decision-tags">
          <span class="badge dark"># 薪资与成长</span>
          <span class="badge dark"># 稳定性</span>
          <span class="badge dark"># WLB</span>
        </div>
      </article>
      <article class="card card-pad decision-card" style="background: var(--secondary-container); color: var(--on-secondary-container);">
        <h2>犹豫不决？</h2>
        <p style="margin-top: 8px; font-weight: 700;">把风险点补充完整，再做一次横向比较。</p>
        <div style="margin-top: 22px;">${button("选择Offer", "open-offer-select-modal", "dark")}</div>
      </article>
    </section>
  `;
}

function renderModal() {
  if (!state.modal) return "";
  const map = {
    job: renderJobModal,
    interview: renderInterviewModal,
    offer: renderOfferModal,
    offerSelect: renderOfferSelectModal
  };
  return map[state.modal] ? map[state.modal]() : "";
}

function modalShell(title, body, footer) {
  return `
    <div class="modal-backdrop" role="presentation" data-action="close-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-panel>
        <header class="modal-header">
          <div>
            <h2 id="modal-title">${title}</h2>
            ${state.modalError ? `<div class="form-error" style="margin-top: 14px;">${escapeHtml(state.modalError)}</div>` : ""}
          </div>
          <button class="icon-button" type="button" data-action="close-modal" aria-label="关闭弹窗">×</button>
        </header>
        <div class="modal-body">${body}</div>
        <footer class="modal-footer">${footer}</footer>
      </section>
    </div>
  `;
}

function renderJobModal() {
  const job = activeJob();
  const editing = state.screen === "detail";
  const body = `
    <form class="form-grid job-edit-form" id="job-form">
      ${formSection("基础信息", "公司、岗位、城市和薪资先定好，后续筛选才好用。", "business_center", `
        ${field("company", "公司名称", editing ? job.company : "", "例如 ByteDance")}
        ${field("title", "岗位名称", editing ? job.title : "", "例如 前端工程师")}
        ${field("city", "城市", editing ? job.city : "", "例如 上海")}
        ${field("salary", "薪资范围", editing ? job.salary : "", "例如 25k - 35k")}
        ${textareaField("description", "岗位要求", editing ? job.description : "", "补充岗位职责、要求或备注")}
      `, editing ? "" : jobRecognitionButton(), editing ? "" : "data-job-recognition")}
      ${formSection("投递信息", "记录当前阶段、优先级、来源和可检索标签。", "track_changes", `
        ${selectField("status", "投递状态", statuses, editing ? job.status : "待投递")}
        ${selectField("priority", "优先级", ["P1", "P2", "P3", "P4"], editing ? job.priority : "P2")}
        ${field("source", "投递渠道", editing ? job.source : "", "粘贴投递链接")}
        ${tagField("tags", "标签", editing ? job.tags.join("，") : "")}
      `)}
    </form>
  `;
  return modalShell(
    editing ? "编辑岗位" : "新增岗位",
    body,
    `${button("取消", "close-modal", "surface")} ${button(editing ? "保存修改" : "保存岗位", editing ? "save-job-edit" : "save-job")}`
  );
}

function jobRecognitionButton() {
  return `
    <button class="section-action-button job-upload-button" type="button" data-action="pick-job-image">
      <span class="material-symbols-outlined" aria-hidden="true">image_search</span>
      截图识别
    </button>
    <input class="job-upload-input" type="file" accept="image/*" data-job-image-input>
  `;
}

function renderInterviewModal() {
  const job = activeJob();
  const interview = activeInterview();
  const editing = Boolean(interview);
  const interviewIndex = editing ? Math.max(0, job.interviews.findIndex((item) => item.id === interview.id)) : job.interviews.length;
  const roundParts = splitRoundName(interview?.round, interviewIndex);
  const questions = interview?.questions?.length ? interview.questions : [{ q: "", a: "" }];
  const body = `
    <form class="form-grid interview-form" id="interview-form">
      ${roundField("roundName", "面试轮次", roundParts.label, roundParts.name, "例如 技术终面")}
      ${dateTimeField("time", "面试时间", interview?.time || "", "选择面试时间")}
      ${durationField("duration", "预计时长", interview?.duration || "", "60", "分钟")}
      ${selectField("result", "面试状态", interviewResults, normalizeInterviewResult(interview?.result))}
      <div class="field full qa-list-field">
        <div class="qa-list-head">
          <span>面试问题与回答</span>
          ${button("添加一组", "add-interview-qa", "surface")}
        </div>
        <div class="qa-list" data-qa-list>
          ${questions.map((item, index) => interviewQuestionFields(index, item)).join("")}
        </div>
      </div>
    </form>
  `;
  return modalShell(editing ? "编辑面试记录" : "添加面试记录", body, `${button("取消", "close-modal", "surface")} ${button(editing ? "保存修改" : "保存面试", "save-interview")}`);
}

function roundField(name, label, roundPrefix, value, placeholder) {
  return `
    <label class="field round-field">
      <span>${label}</span>
      <span class="round-input-shell">
        <span class="round-prefix">${escapeHtml(roundPrefix)}</span>
        <input type="hidden" name="roundLabel" value="${escapeHtml(roundPrefix)}">
        <input name="${name}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}">
      </span>
    </label>
  `;
}

function dateTimeField(name, label, value, placeholder) {
  const parts = parseDateTimeParts(value);
  return `
    <label class="field date-time-field">
      <span>${label}</span>
      <span class="date-time-picker" data-date-time-picker data-placeholder="${escapeHtml(placeholder)}">
        <input type="hidden" name="${name}" value="${escapeHtml(value)}" data-date-time-value>
        <button class="date-time-trigger" type="button" data-action="toggle-date-time" aria-haspopup="dialog">
          <span class="date-time-display ${value ? "" : "muted"}">${escapeHtml(value || placeholder)}</span>
          <span class="material-symbols-outlined" aria-hidden="true">event</span>
        </button>
        <span class="date-time-popover" role="dialog" aria-label="${escapeHtml(label)}选择器">
          <span class="picker-field">
            <small>日期</small>
            <input type="date" value="${escapeHtml(parts.date)}" data-date-part>
          </span>
          <span class="picker-field">
            <small>时间</small>
            <input type="time" value="${escapeHtml(parts.time)}" data-time-part>
          </span>
          <button class="button" type="button" data-action="apply-date-time">确认</button>
        </span>
      </span>
    </label>
  `;
}

function durationField(name, label, value, placeholder, unit) {
  return `
    <label class="field duration-field">
      <span>${label}</span>
      <span class="input-with-suffix">
        <input name="${name}" inputmode="numeric" value="${escapeHtml(parseDurationAmount(value))}" placeholder="${escapeHtml(placeholder)}">
        <span>${escapeHtml(unit)}</span>
      </span>
    </label>
  `;
}

function interviewQuestionFields(index, item = {}) {
  return `
    <section class="qa-pair" data-qa-pair>
      <div class="qa-pair-title">问题 ${index + 1}</div>
      <label class="field qa-field">
        <span>面试问题</span>
        <textarea name="question" placeholder="记录一个问题">${escapeHtml(item.q || "")}</textarea>
      </label>
      <label class="field qa-field">
        <span>我的回答</span>
        <textarea name="answer" placeholder="写下回答或复盘重点">${escapeHtml(item.a || "")}</textarea>
      </label>
    </section>
  `;
}

function renderOfferSelectModal() {
  const offerJobs = jobOffers();
  const selected = new Set(state.offerSelection.length ? state.offerSelection : offerJobs.map((job) => job.id));
  const body = `
    <form class="offer-select-form" id="offer-select-form">
      <div class="offer-select-note">
        <span class="material-symbols-outlined" aria-hidden="true">fact_check</span>
        <div>
          <strong>选择要横向比较的 Offer</strong>
          <small>最少选择 2 个，最多选择 5 个。</small>
        </div>
      </div>
      <div class="offer-select-list">
        ${offerJobs.map((job) => `
          <label class="offer-select-row">
            <input type="checkbox" name="offerIds" value="${job.id}" ${selected.has(job.id) ? "checked" : ""}>
            <span class="logo-tile ${job.logoTone}">${escapeHtml(job.logo)}</span>
            <span>
              <strong>${escapeHtml(job.company)} · ${escapeHtml(job.title)}</strong>
              <small>${escapeHtml(job.offer.totalComp)} · ${escapeHtml(job.offer.location)} · ${escapeHtml(job.offer.workStyle)}</small>
            </span>
          </label>
        `).join("")}
      </div>
      ${offerJobs.length ? "" : emptyInline("暂无可选择的 Offer。先在岗位详情中标记并补充 Offer 信息。")}
    </form>
  `;

  return modalShell("选择Offer", body, `${button("取消", "close-modal", "surface")} ${button("确认选择", "save-offer-selection")}`);
}

function renderOfferModal() {
  const job = activeJob();
  const offer = job.offer;
  const body = `
    <form class="form-grid" id="offer-form">
      ${field("totalComp", "年总包薪资", offer ? offer.totalComp : "", "例如 45w")}
      ${field("location", "工作城市", offer ? offer.location : "", "例如 上海")}
      ${field("workStyle", "工作模式", offer ? offer.workStyle : "", "现场 / 混合 / 远程")}
      ${field("risk", "风险点", offer ? offer.risk : "", "例如 节奏较快，需要确认团队资源")}
      ${selectField("growth", "成长空间", ["1", "2", "3", "4", "5"], offer ? String(offer.growth) : "4")}
      ${selectField("stability", "稳定性", ["1", "2", "3", "4", "5"], offer ? String(offer.stability) : "4")}
      ${selectField("balance", "工作生活平衡", ["1", "2", "3", "4", "5"], offer ? String(offer.balance) : "4")}
      ${selectField("interest", "个人兴趣", ["1", "2", "3", "4", "5"], offer ? String(offer.interest) : "4")}
    </form>
  `;
  return modalShell(offer ? "编辑 Offer" : "添加 Offer", body, `${button("取消", "close-modal", "surface")} ${button("保存 Offer", "save-offer")}`);
}

function formSection(title, description, icon, content, actionHtml = "", attrs = "") {
  return `
    <section class="form-section" ${attrs}>
      <div class="form-section-head">
        <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
        <div>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        ${actionHtml ? `<div class="form-section-action">${actionHtml}</div>` : ""}
      </div>
      <div class="form-section-grid">${content}</div>
    </section>
  `;
}

function field(name, label, value, placeholder) {
  return `
    <label class="field">
      <span>${label}</span>
      <input name="${name}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}">
    </label>
  `;
}

function textareaField(name, label, value, placeholder) {
  return `
    <label class="field full">
      <span>${label}</span>
      <textarea name="${name}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function selectField(name, label, options, value, attrs = "") {
  return `
    <label class="field">
      <span>${label}</span>
      ${customSelect({ name, label, options, value, className: "field-select", attrs })}
    </label>
  `;
}

function tagField(name, label, value) {
  return `
    <label class="field tag-field">
      <span>${label}</span>
      <input name="${name}" value="${escapeHtml(value)}" placeholder="React，远程，高优先级" data-tag-input>
      <div class="tag-preview" data-tag-preview>${renderTagPreview(value)}</div>
    </label>
  `;
}

function setFormValue(form, name, value) {
  const field = form.elements[name];
  if (!field) return;

  field.value = value;

  const select = field.closest("[data-custom-select]");
  if (select) {
    setCustomSelectValue(select, value);
  }

  if (field.matches("[data-tag-input]")) {
    updateTagPreview(field);
  }
}

function jobRecognitionPresets() {
  return [
    {
      keys: ["bytedance", "byte", "字节", "抖音", "douyin", "frontend", "前端", "react"],
      data: {
        company: "ByteDance",
        title: "高级前端开发工程师",
        city: "北京",
        salary: "35k - 50k",
        source: "截图识别",
        priority: "P1",
        status: "待投递",
        tags: "React，Next.js，核心架构组",
        description: "负责核心业务 Web 体验、性能优化、组件化建设和跨团队工程协作；要求熟悉 React 技术栈、前端工程化、性能治理和复杂业务落地。"
      }
    },
    {
      keys: ["tencent", "腾讯", "product", "pm"],
      data: {
        company: "腾讯",
        title: "资深产品经理",
        city: "深圳",
        salary: "40k - 65k",
        source: "截图识别",
        priority: "P1",
        status: "待投递",
        tags: "平台产品，增长，用户体验",
        description: "负责平台产品规划、需求拆解、增长策略和跨团队推进；要求具备复杂业务抽象能力、数据分析能力和良好的协作推进经验。"
      }
    },
    {
      keys: ["microsoft", "微软", "cloud"],
      data: {
        company: "微软",
        title: "Cloud PM",
        city: "苏州",
        salary: "30k - 45k",
        source: "截图识别",
        priority: "P2",
        status: "待投递",
        tags: "Cloud，B2B，英文面试",
        description: "面向云产品客户场景，负责需求定义、路线图和跨区域团队协作；要求具备英文沟通、企业服务产品和数据驱动决策经验。"
      }
    },
    {
      keys: ["design", "ui", "美团", "designer"],
      data: {
        company: "美团",
        title: "UI 设计师",
        city: "上海",
        salary: "25k - 40k",
        source: "截图识别",
        priority: "P2",
        status: "待投递",
        tags: "设计系统，业务中台，体验优化",
        description: "负责业务工具体验设计、设计系统维护和跨端体验一致性；要求具备复杂信息架构、组件规范和业务协作能力。"
      }
    },
    {
      keys: ["shopify", "growth", "analyst", "remote", "增长", "分析"],
      data: {
        company: "Shopify",
        title: "Growth Analyst",
        city: "远程",
        salary: "USD 90k",
        source: "截图识别",
        priority: "P3",
        status: "待投递",
        tags: "Remote，Growth，Analytics",
        description: "负责增长数据分析、实验设计和商业洞察输出；要求具备 SQL、实验分析、指标体系搭建和英文跨团队沟通经验。"
      }
    },
    {
      keys: ["alibaba", "阿里", "淘天", "java", "backend", "后端"],
      data: {
        company: "阿里巴巴",
        title: "后端开发工程师",
        city: "杭州",
        salary: "30k - 55k",
        source: "截图识别",
        priority: "P1",
        status: "待投递",
        tags: "Java，分布式，高并发",
        description: "负责交易链路核心服务设计与性能优化；要求熟悉 Java、分布式系统、缓存、消息队列和高并发场景治理。"
      }
    },
    {
      keys: ["xiaohongshu", "小红书", "content", "社区", "内容"],
      data: {
        company: "小红书",
        title: "社区产品经理",
        city: "上海",
        salary: "28k - 45k",
        source: "截图识别",
        priority: "P2",
        status: "待投递",
        tags: "社区，内容生态，用户增长",
        description: "负责社区内容生态和创作者体验优化；要求具备用户洞察、策略产品、数据分析和跨团队项目推进能力。"
      }
    }
  ];
}

async function fileFingerprint(file) {
  let hash = 2166136261;
  const seed = `${file.name}|${file.type}|${file.size}|${file.lastModified}`;

  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  if (file.arrayBuffer) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const stride = Math.max(1, Math.floor(bytes.length / 192));
    for (let index = 0; index < bytes.length; index += stride) {
      hash ^= bytes[index];
      hash = Math.imul(hash, 16777619) >>> 0;
    }
  }

  return hash >>> 0;
}

async function inferJobPostingFromImage(file) {
  const normalized = file.name.toLowerCase();
  const presets = jobRecognitionPresets();
  const matched = presets.find((preset) => preset.keys.some((key) => normalized.includes(key.toLowerCase())));
  if (matched) return matched.data;

  const fingerprint = await fileFingerprint(file);
  return presets[fingerprint % presets.length].data;
}

function handleJobImageUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  const section = input.closest("[data-job-recognition]");
  const status = section?.querySelector("[data-recognition-status]");
  const preview = section?.querySelector("[data-recognition-preview]");
  const form = document.getElementById("job-form");
  if (!section || !form) return;

  section.classList.remove("is-complete");
  section.classList.add("is-loading");
  if (status) status.textContent = "正在识别并填入表单...";

  if (preview) {
    preview.innerHTML = "";
    const image = document.createElement("img");
    image.alt = file.name;
    const caption = document.createElement("small");
    caption.textContent = file.name;
    preview.append(image, caption);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      image.src = String(reader.result || "");
    });
    reader.readAsDataURL(file);
  }

  window.clearTimeout(handleJobImageUpload.timer);
  const token = `${file.name}-${file.size}-${file.lastModified}`;
  handleJobImageUpload.token = token;
  handleJobImageUpload.timer = window.setTimeout(async () => {
    const recognized = await inferJobPostingFromImage(file);
    if (handleJobImageUpload.token !== token) return;

    Object.entries(recognized).forEach(([name, value]) => setFormValue(form, name, value));
    section.classList.remove("is-loading");
    section.classList.add("is-complete");
    if (status) status.textContent = "已填入，可继续修改";
    showToast("截图信息已填入表单");
    renderToast();
  }, 780);
}

function readForm(id) {
  return Object.fromEntries(new FormData(document.getElementById(id)).entries());
}

function saveJob(editing = false) {
  const data = readForm("job-form");
  if (!data.company.trim() || !data.title.trim()) {
    state.modalError = "公司名称和岗位名称是必填项。";
    render();
    return;
  }

  if (editing) {
    const job = activeJob();
    Object.assign(job, {
      company: data.company.trim(),
      title: data.title.trim(),
      city: data.city.trim() || "未填写",
      salary: data.salary.trim() || "面议",
      status: data.status,
      priority: data.priority,
      source: data.source.trim() || "手动录入",
      tags: data.tags ? parseTags(data.tags) : job.tags,
      description: data.description.trim() || job.description,
      updated: "刚刚"
    });
    syncJobData(job);
  } else {
    const id = `job-${Date.now()}`;
    const newJob = {
      id,
      company: data.company.trim(),
      title: data.title.trim(),
      city: data.city.trim() || "未填写",
      salary: data.salary.trim() || "面议",
      source: data.source.trim() || "手动录入",
      priority: data.priority,
      status: data.status,
      logo: data.company.trim().slice(0, 2).toUpperCase(),
      logoTone: "logo-yellow",
      updated: "刚刚",
      nextInterview: "暂无",
      tags: data.tags ? parseTags(data.tags) : ["新岗位"],
      description: data.description.trim() || "暂未补充岗位描述。",
      interviews: [],
      aiSummary: null
    };
    syncJobData(newJob);
    jobs.unshift(newJob);
    state.activeJobId = id;
    state.screen = "detail";
  }

  closeModal();
  showToast(editing ? "岗位信息已更新" : "岗位已添加，并进入详情页");
}

function saveInterview() {
  const form = document.getElementById("interview-form");
  const formData = new FormData(form);
  const roundLabelValue = String(formData.get("roundLabel") || "").trim();
  const roundName = String(formData.get("roundName") || "").trim();
  if (!roundLabelValue) {
    state.modalError = "面试轮次是必填项。";
    render();
    return;
  }

  const job = activeJob();
  const questions = formData.getAll("question");
  const answers = formData.getAll("answer");
  const duration = String(formData.get("duration") || "").trim();
  const nextInterview = {
    id: state.activeInterviewId || `int-${Date.now()}`,
    round: `${roundLabelValue}：${roundName || "未命名面试"}`,
    time: String(formData.get("time") || "").trim() || "时间待定",
    duration: duration ? `${duration} 分钟` : "时长待定",
    result: normalizeInterviewResult(String(formData.get("result") || "")),
    questions: questions
      .map((question, index) => ({
        q: String(question || "").trim(),
        a: String(answers[index] || "").trim() || "暂未填写回答。"
      }))
      .filter((item) => item.q)
  };

  const existingIndex = job.interviews.findIndex((interview) => interview.id === state.activeInterviewId);
  if (existingIndex >= 0) {
    job.interviews[existingIndex] = nextInterview;
  } else {
    job.interviews.push(nextInterview);
  }

  job.updated = "刚刚";
  closeModal();
  showToast(existingIndex >= 0 ? "面试记录已更新" : "面试记录已保存");
}

function saveOffer() {
  const data = readForm("offer-form");
  if (!data.totalComp.trim()) {
    state.modalError = "年总包薪资是必填项，哪怕先写一个估算值也可以。";
    render();
    return;
  }

  const job = activeJob();
  job.offer = {
    location: data.location.trim() || job.city,
    totalComp: data.totalComp.trim(),
    cashWidth: Math.min(96, Math.max(42, Number.parseInt(data.totalComp, 10) || 68)),
    workStyle: data.workStyle.trim() || "待确认",
    growth: Number(data.growth),
    stability: Number(data.stability),
    balance: Number(data.balance),
    interest: Number(data.interest),
    risk: data.risk.trim() || "暂无明显风险点。",
    decision: "待决定"
  };
  job.status = "已拿Offer";
  job.updated = "刚刚";
  syncJobData(job);
  state.screen = "offers";
  closeModal();
  showToast("Offer 已加入对比");
}

function saveOfferSelection() {
  const form = document.getElementById("offer-select-form");
  const selected = new FormData(form).getAll("offerIds");

  if (selected.length < 2 || selected.length > 5) {
    state.modalError = "请选择 2 到 5 个 Offer 进行对比。";
    render();
    return;
  }

  state.offerSelection = selected;
  state.screen = "offers";
  closeModal();
  showToast("Offer 对比列表已更新");
}

function updateOfferRating(input) {
  const job = jobs.find((item) => item.id === input.dataset.jobId);
  const field = input.dataset.ratingField;
  if (!job?.offer || !field) return;

  const value = Number(input.value);
  job.offer[field] = value;

  const block = input.closest(".rating-block");
  const card = input.closest("[data-offer-card]");
  block?.querySelector(".rating-control")?.style.setProperty("--rating", value);
  block?.querySelectorAll(".rating-bars span").forEach((bar, index) => {
    bar.classList.toggle("filled", index < value);
  });
  const score = card?.querySelector("[data-offer-score]");
  if (score) {
    score.textContent = offerScore(job.offer).toFixed(1);
  }
}

function markOfferWon() {
  const job = activeJob();
  job.status = "已拿Offer";
  job.updated = "刚刚";
  syncJobData(job);
  showToast("状态已更新为已拿Offer");
  render();
  triggerOfferCelebration(job.company);
}

function triggerOfferCelebration(company) {
  document.querySelector(".celebration-layer")?.remove();

  const layer = document.createElement("div");
  layer.className = "celebration-layer";
  layer.setAttribute("aria-hidden", "true");

  const pieces = Array.from({ length: 22 }, (_, index) => {
    const angle = (index / 22) * Math.PI * 2;
    const distance = 120 + (index % 5) * 18;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const delay = (index % 6) * 34;
    const tone = ["primary", "secondary", "tertiary"][index % 3];
    return `<span class="confetti ${tone}" style="--x:${x.toFixed(1)}px;--y:${y.toFixed(1)}px;--delay:${delay}ms;"></span>`;
  }).join("");

  layer.innerHTML = `
    <div class="celebration-card">
      <span class="material-symbols-outlined" aria-hidden="true">card_membership</span>
      <strong>${escapeHtml(company)} Offer 已确认</strong>
    </div>
    <div class="confetti-field">${pieces}</div>
  `;

  document.body.appendChild(layer);
  window.clearTimeout(triggerOfferCelebration.timer);
  triggerOfferCelebration.timer = window.setTimeout(() => {
    layer.remove();
  }, 1800);
}

function generateAiSummary() {
  const job = activeJob();
  state.aiLoading = true;
  render();

  window.setTimeout(() => {
    job.aiSummary = {
      overview: "本轮面试表达流畅，能说明项目背景和业务目标。需要补强的是技术决策背后的量化指标，以及异常场景下的降级策略。",
      strengths: ["项目叙事完整", "能主动连接业务目标", "回答结构比较清楚"],
      improvements: ["把优化结果量化", "准备接口失败和回滚案例", "补充监控指标和报警策略"],
      next: ["准备一个系统设计白板题", "复盘缓存和索引方案", "整理一段 2 分钟项目亮点表达"]
    };
    state.aiLoading = false;
    showToast("总结已生成");
    render();
  }, 850);
}

function showToast(message) {
  state.toast = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = "";
    renderToast();
  }, 2800);
}

function customSelectDisplay(select, value) {
  const prefix = select.dataset.displayPrefix;
  return prefix ? `${prefix}：${value}` : value;
}

function setCustomSelectValue(select, value) {
  const stringValue = String(value);
  const input = select.querySelector('input[type="hidden"]');
  const display = select.querySelector(".custom-select-value");
  const options = select.querySelectorAll(".custom-select-option");

  if (input) input.value = stringValue;
  if (display) display.textContent = customSelectDisplay(select, stringValue);

  options.forEach((option) => {
    const active = option.dataset.value === stringValue;
    option.classList.toggle("active", active);
    option.setAttribute("aria-selected", String(active));
  });
}

function closeCustomSelects(except = null) {
  document.querySelectorAll("[data-custom-select].open").forEach((select) => {
    if (select === except) return;
    select.classList.remove("open");
    select.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
  });
}

function applyCustomSelectValue(select, value) {
  const selectId = select.dataset.selectId;

  if (selectId === "city-filter") {
    state.filters.city = value;
    render();
    return;
  }

  if (selectId === "priority-filter") {
    state.filters.priority = value;
    render();
    return;
  }

  if (selectId === "sort-filter") {
    state.filters.sort = value;
    render();
    return;
  }

  if (select.hasAttribute("data-job-status-select")) {
    const job = jobs.find((item) => item.id === select.dataset.jobId);
    if (job) {
      job.status = value;
      job.updated = "刚刚";
      syncJobData(job);
      showToast("投递状态已更新");
      render();
    }
  }

  if (select.hasAttribute("data-interview-result-select")) {
    const job = activeJob();
    const interview = job.interviews.find((item) => item.id === select.dataset.interviewId);
    if (interview) {
      interview.result = normalizeInterviewResult(value);
      job.updated = "刚刚";
      showToast("面试情况已更新");
      render();
    }
  }
}

function closeDateTimePickers(except = null) {
  document.querySelectorAll("[data-date-time-picker].open").forEach((picker) => {
    if (picker !== except) {
      picker.classList.remove("open");
    }
  });
}

function applyDateTimePicker(picker) {
  const date = picker.querySelector("[data-date-part]")?.value || "";
  const time = picker.querySelector("[data-time-part]")?.value || "";
  const value = date && time ? `${date} ${time}` : date || time;
  const input = picker.querySelector("[data-date-time-value]");
  const display = picker.querySelector(".date-time-display");

  if (input) input.value = value;
  if (display) {
    display.textContent = value || picker.dataset.placeholder || "选择时间";
    display.classList.toggle("muted", !value);
  }
}

function rememberScroll(screen = state.screen) {
  if (screen) {
    state.scrollPositions[screen] = window.scrollY || document.documentElement.scrollTop || 0;
  }
}

function navigateTo(screen, { restore = false } = {}) {
  if (!screen || !screenMapHas(screen)) return;

  rememberScroll();
  state.screen = screen;
  state.jobSwitchDirection = "";
  render({ scrollTop: restore ? state.scrollPositions[screen] || 0 : 0 });
}

function screenMapHas(screen) {
  return ["dashboard", "jobs", "detail", "offers"].includes(screen);
}

function switchDetailJob(direction = "next") {
  if (!jobs.length) return;

  rememberScroll();
  const currentIndex = activeJobIndex();
  const offset = direction === "prev" ? -1 : 1;
  const nextIndex = (currentIndex + offset + jobs.length) % jobs.length;

  state.activeJobId = jobs[nextIndex].id;
  state.screen = "detail";
  state.jobSwitchDirection = direction === "prev" ? "prev" : "next";
  render({ scrollTop: 0 });
}

function closeModal() {
  state.modal = null;
  state.modalError = "";
  state.activeInterviewId = null;
  document.body.classList.remove("modal-open");
  render();
}

function renderToast() {
  toastRoot.innerHTML = state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : "";
}

function sidebarMenuMeta() {
  return {
    icon: state.sidebarCollapsed ? "menu" : "menu_open",
    label: state.sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"
  };
}

function navUpMeta() {
  const map = {
    dashboard: { target: "", icon: "dashboard", label: "已在最高层级" },
    jobs: { target: "dashboard", icon: "arrow_back", label: "返回 Dashboard" },
    detail: { target: "jobs", icon: "arrow_back", label: "返回 Jobs" },
    offers: { target: "jobs", icon: "arrow_back", label: "返回 Jobs" }
  };
  return map[state.screen] || map.dashboard;
}

function syncSidebarState() {
  const shell = app.querySelector(".app-shell");
  if (!shell) return;

  shell.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);

  const menuButton = shell.querySelector(".sidebar-toggle");
  if (!menuButton) return;

  const meta = sidebarMenuMeta();
  menuButton.setAttribute("aria-label", meta.label);
  menuButton.setAttribute("title", meta.label);
  menuButton.setAttribute("aria-expanded", String(!state.sidebarCollapsed));

  const icon = menuButton.querySelector(".material-symbols-outlined");
  if (icon) {
    icon.textContent = meta.icon;
  }

  const label = menuButton.querySelector(".sidebar-toggle-label");
  if (label) {
    label.textContent = meta.label;
  }
}

function syncTopbarState() {
  if (!topbarCollapsed && window.scrollY > 56) {
    topbarCollapsed = true;
  } else if (topbarCollapsed && window.scrollY <= 4) {
    topbarCollapsed = false;
  }
  document.body.classList.toggle("is-scrolled", topbarCollapsed);
}

function render(options = {}) {
  const screenMap = {
    dashboard: renderDashboard,
    jobs: renderJobs,
    detail: renderDetail,
    offers: renderOffers
  };
  app.innerHTML = renderShell(screenMap[state.screen]());
  modalRoot.innerHTML = renderModal();
  renderToast();
  document.body.classList.toggle("modal-open", Boolean(state.modal));
  syncSidebarState();
  syncTopbarState();
  state.jobSwitchDirection = "";

  if (typeof options.scrollTop === "number") {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(0, options.scrollTop), left: 0, behavior: "auto" });
      syncTopbarState();
    });
  }

  if (options.focusId) {
    const target = document.getElementById(options.focusId);
    if (target) {
      target.focus();
      if (typeof target.selectionStart === "number") {
        const end = target.value.length;
        target.setSelectionRange(end, end);
      }
    }
  }
}

document.addEventListener("click", (event) => {
  const modalPanel = event.target.closest("[data-modal-panel]");
  const selectRoot = event.target.closest("[data-custom-select]");
  const dateTimeRoot = event.target.closest("[data-date-time-picker]");
  const accountRoot = event.target.closest(".sidebar-user, .account-popover");
  const actionEl = event.target.closest("[data-action]");
  let closedAccount = false;
  if (!selectRoot) {
    closeCustomSelects();
  }
  if (!dateTimeRoot) {
    closeDateTimePickers();
  }
  if (state.accountOpen && !accountRoot) {
    state.accountOpen = false;
    closedAccount = true;
  }
  if (!actionEl) {
    if (closedAccount) render();
    return;
  }

  const action = actionEl.dataset.action;
  if (action === "toggle-select") {
    const select = actionEl.closest("[data-custom-select]");
    if (!select) return;
    const willOpen = !select.classList.contains("open");
    closeCustomSelects(select);
    select.classList.toggle("open", willOpen);
    actionEl.setAttribute("aria-expanded", String(willOpen));
    return;
  }

  if (action === "choose-select") {
    const select = actionEl.closest("[data-custom-select]");
    if (!select) return;
    const value = actionEl.dataset.value || "";
    setCustomSelectValue(select, value);
    closeCustomSelects();
    applyCustomSelectValue(select, value);
    return;
  }

  if (action === "toggle-date-time") {
    const picker = actionEl.closest("[data-date-time-picker]");
    if (!picker) return;
    const willOpen = !picker.classList.contains("open");
    closeDateTimePickers(picker);
    picker.classList.toggle("open", willOpen);
    return;
  }

  if (action === "apply-date-time") {
    const picker = actionEl.closest("[data-date-time-picker]");
    if (!picker) return;
    applyDateTimePicker(picker);
    closeDateTimePickers();
    return;
  }

  if (action === "add-interview-qa") {
    const list = document.querySelector("[data-qa-list]");
    if (list) {
      list.insertAdjacentHTML("beforeend", interviewQuestionFields(list.querySelectorAll("[data-qa-pair]").length));
    }
    return;
  }

  if (action === "pick-job-image") {
    actionEl.closest("[data-job-recognition]")?.querySelector("[data-job-image-input]")?.click();
    return;
  }

  if (action === "close-modal") {
    if (actionEl.classList.contains("modal-backdrop") && modalPanel) return;
    closeModal();
    return;
  }

  if (action === "nav") {
    navigateTo(actionEl.dataset.screen);
    return;
  }

  if (action === "nav-up") {
    const targetScreen = navUpMeta().target;
    if (targetScreen) {
      navigateTo(targetScreen, { restore: true });
    }
    return;
  }

  if (action === "nav-detail") {
    navigateTo("detail");
    return;
  }

  if (action === "scroll-section") {
    const target = document.getElementById(actionEl.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (action === "toggle-sidebar") {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    state.accountOpen = false;
    syncSidebarState();
    return;
  }

  if (action === "toggle-account") {
    state.accountOpen = !state.accountOpen;
    render();
    return;
  }

  if (action === "filter-jobs") {
    state.filters.status = actionEl.dataset.filterStatus || "全部";
    state.filters.city = "全部";
    state.filters.priority = "全部";
    state.filters.query = "";
    render();
    return;
  }

  if (action === "set-view") {
    state.filters.view = actionEl.dataset.view || "board";
    render();
    return;
  }

  if (action === "select-job") {
    state.activeJobId = actionEl.dataset.jobId;
    navigateTo("detail");
    return;
  }

  if (action === "switch-detail-job") {
    switchDetailJob(actionEl.dataset.direction);
    return;
  }

  if (action === "open-job-modal") {
    state.modal = "job";
    state.modalError = "";
    render();
    return;
  }

  if (action === "open-interview-modal") {
    state.modal = "interview";
    state.activeInterviewId = null;
    state.modalError = "";
    render();
    return;
  }

  if (action === "open-interview-editor") {
    state.activeInterviewId = actionEl.dataset.interviewId;
    state.modal = "interview";
    state.modalError = "";
    render();
    return;
  }

  if (action === "open-offer-modal") {
    state.modal = "offer";
    state.modalError = "";
    render();
    return;
  }

  if (action === "open-offer-select-modal") {
    state.modal = "offerSelect";
    state.modalError = "";
    render();
    return;
  }

  if (action === "open-offer-editor") {
    state.activeJobId = actionEl.dataset.jobId;
    state.modal = "offer";
    state.modalError = "";
    render();
    return;
  }

  if (action === "save-job") {
    saveJob(false);
    return;
  }

  if (action === "save-job-edit") {
    saveJob(true);
    return;
  }

  if (action === "save-interview") {
    saveInterview();
    return;
  }

  if (action === "save-offer") {
    saveOffer();
    return;
  }

  if (action === "save-offer-selection") {
    saveOfferSelection();
    return;
  }

  if (action === "mark-offer-won") {
    markOfferWon();
    return;
  }

  if (action === "generate-ai") {
    generateAiSummary();
    return;
  }

  if (action === "toast") {
    showToast(actionEl.dataset.message || "操作已完成");
    renderToast();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-job-image-input]")) {
    handleJobImageUpload(target);
  }

  if (target.matches("[data-date-part], [data-time-part]")) {
    const picker = target.closest("[data-date-time-picker]");
    if (picker) applyDateTimePicker(picker);
  }

  if (target.matches("[data-offer-rating]")) {
    updateOfferRating(target);
    render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-offer-rating]")) {
    updateOfferRating(event.target);
    return;
  }

  if (event.target.id === "job-search") {
    state.filters.query = event.target.value;
    render({ focusId: "job-search" });
  }

  if (event.target.matches("[data-tag-input]")) {
    updateTagPreview(event.target);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.querySelector("[data-date-time-picker].open")) {
    closeDateTimePickers();
    return;
  }

  if (event.key === "Escape" && document.querySelector("[data-custom-select].open")) {
    closeCustomSelects();
    return;
  }

  if (event.key === "Escape" && state.modal) {
    closeModal();
  }

  const card = event.target.closest("[role='button'][data-action='select-job']");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    state.activeJobId = card.dataset.jobId;
    navigateTo("detail");
  }

  const interviewCard = event.target.closest("[role='button'][data-action='open-interview-editor']");
  if (interviewCard && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    state.activeInterviewId = interviewCard.dataset.interviewId;
    state.modal = "interview";
    state.modalError = "";
    render();
  }
});

window.addEventListener("scroll", syncTopbarState, { passive: true });

render();
