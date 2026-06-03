const statuses = [
  "待投递",
  "已投递",
  "面试中",
  "已拿Offer",
  "被拒绝",
  "已放弃"
];

const interviewResults = ["待面试", "等待结果", "失败", "通过"];
const statusOrder = new Map(statuses.map((status, index) => [status, index]));
const defaultFunnelStatuses = ["已投递", "面试中", "已拿Offer", "被拒绝"];
const priorities = ["高", "中", "低"];
const priorityOrder = new Map(priorities.map((priority, index) => [priority, index]));
const salaryUnits = ["k", "w"];
const workStyles = ["线下", "远程", "出差"];

const statusMeta = {
  待投递: { title: "待投递", note: "准备投递", icon: "draft" },
  已投递: { title: "已投递", note: "等待反馈", icon: "outbox" },
  面试中: { title: "面试中", note: "持续推进", icon: "forum" },
  已拿Offer: { title: "已拿 Offer", note: "可进行比较", icon: "celebration" },
  被拒绝: { title: "被拒绝", note: "复盘沉淀", icon: "block" },
  已放弃: { title: "已放弃", note: "暂不推进", icon: "do_not_disturb_on" }
};

const statusTone = {
  待投递: "todo",
  已投递: "applied",
  面试中: "interview",
  已拿Offer: "offer",
  被拒绝: "reject",
  已放弃: "quit",
  通过: "offer",
  待面试: "wait",
  等待结果: "wait",
  失败: "reject"
};

function normalizeJobStatus(value) {
  if (["沟通中", "笔试", "一面", "二面", "三面", "四面", "终面", "等待结果"].includes(value)) {
    return "面试中";
  }
  if (value === "已拒绝") return "被拒绝";
  return statuses.includes(value) ? value : "待投递";
}

function normalizePriority(value) {
  if (value === "P1" || value === "高优先级") return "高";
  if (value === "P2" || value === "中优先级") return "中";
  if (value === "P3" || value === "P4" || value === "低优先级") return "低";
  return priorities.includes(value) ? value : "中";
}

function priorityRank(priority) {
  return priorityOrder.has(priority) ? priorityOrder.get(priority) : priorities.length;
}

function priorityTone(priority) {
  return `priority-${priority === "高" ? "high" : priority === "中" ? "medium" : "low"}`;
}

function parseMoneyParts(value, fallbackUnit = "k") {
  const raw = String(value || "").trim();
  const normalized = raw
    .replace(/^RMB\s*/i, "")
    .replace(/^CNY\s*/i, "")
    .replace(/^¥\s*/, "")
    .replace(/^USD\s*/i, "")
    .trim();
  const unitMatch = normalized.match(/(w|k|万|千)\s*$/i);
  const unit = unitMatch
    ? (unitMatch[1].toLowerCase() === "w" || unitMatch[1] === "万" ? "w" : "k")
    : fallbackUnit;
  const amount = normalized
    .replace(/(w|k|万|千)/gi, "")
    .replace(/[^\d.\-~—–至到\s]/g, "")
    .replace(/\s*(?:~|—|–|至|到|-)\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();

  return { amount, unit: salaryUnits.includes(unit) ? unit : fallbackUnit };
}

function formatMoneyValue(amount, unit = "k") {
  const normalizedAmount = String(amount || "")
    .replace(/^RMB\s*/i, "")
    .replace(/^CNY\s*/i, "")
    .replace(/^¥\s*/, "")
    .replace(/^USD\s*/i, "")
    .replace(/(w|k|万|千)/gi, "")
    .replace(/[^\d.\-~—–至到\s]/g, "")
    .replace(/\s*(?:~|—|–|至|到|-)\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
  const safeUnit = salaryUnits.includes(unit) ? unit : "k";
  return normalizedAmount ? `RMB ${normalizedAmount}${safeUnit}` : "面议";
}

function normalizeMoneyDisplay(value, fallbackUnit = "k") {
  const parts = parseMoneyParts(value, fallbackUnit);
  return parts.amount ? formatMoneyValue(parts.amount, parts.unit) : (String(value || "").trim() || "面议");
}

function moneyComparable(value) {
  const { amount, unit } = parseMoneyParts(value);
  const numbers = amount.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  const base = numbers.length ? numbers.reduce((sum, number) => sum + number, 0) / numbers.length : 0;
  return unit === "w" ? base * 10 : base;
}

function normalizeWorkStyle(value, city = "") {
  const text = String(value || "").trim();
  if (text.includes("远程") || city === "远程") return "远程";
  if (text.includes("出差")) return "出差";
  return "线下";
}

const jobs = [
  {
    id: "job-bd",
    company: "ByteDance",
    title: "高级前端开发工程师",
    city: "北京",
    salary: "RMB 35 - 50k",
    source: "内推",
    priority: "高",
    status: "面试中",
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
    salary: "RMB 40 - 65k",
    source: "Boss 直聘",
    priority: "高",
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
    salary: "RMB 30 - 45k",
    source: "官网",
    priority: "中",
    status: "面试中",
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
    salary: "RMB 25 - 40k",
    source: "猎头",
    priority: "中",
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
      totalComp: "RMB 45w",
      cashWidth: 78,
      workStyle: "线下",
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
    salary: "RMB 60 - 90k",
    source: "LinkedIn",
    priority: "低",
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
      totalComp: "RMB 90w",
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
    sort: "投递进度",
    view: "board",
    funnel: true,
    funnelStatuses: [...defaultFunnelStatuses]
  },
  funnelPanelOpen: false,
  offerSelection: jobs.filter((job) => job.status === "已拿Offer" && job.offer).map((job) => job.id),
  accountOpen: false,
  modal: null,
  modalError: "",
  activeInterviewId: null,
  pendingDeleteJobId: "",
  jobSwitchDirection: "",
  lastDragAt: 0,
  suppressFunnelMotion: false,
  funnelTransition: "",
  scrollPositions: {
    dashboard: 0,
    jobs: 0,
    detail: 0,
    offers: 0
  },
  aiLoading: false,
  toast: "",
  booting: true,
  auth: {
    configured: false,
    url: "",
    anonKey: "",
    session: null,
    user: null,
    mode: "signin"
  },
  aiProvider: null
};

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const toastRoot = document.getElementById("toast-root");
let topbarCollapsed = false;
const authStorageKey = "gooffer.supabase.session";

function currentUserEmail() {
  return state.auth.user?.email || state.auth.session?.user?.email || "未登录";
}

function currentUserInitials() {
  const email = currentUserEmail();
  if (!state.auth.session) return "GO";
  return email.slice(0, 2).toUpperCase();
}

async function readJsonResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || payload?.msg || fallbackMessage);
  }
  return payload;
}

async function loadRuntimeConfig() {
  const payload = await fetch("/api/config").then((response) => readJsonResponse(response, "读取配置失败。"));
  state.auth.url = payload.supabase_url || "";
  state.auth.anonKey = payload.supabase_anon_key || "";
  state.auth.configured = Boolean(state.auth.url && state.auth.anonKey);
}

function authHeaders(extra = {}) {
  const headers = {
    apikey: state.auth.anonKey,
    "content-type": "application/json",
    ...extra
  };
  if (state.auth.session?.access_token) {
    headers.Authorization = `Bearer ${state.auth.session.access_token}`;
  }
  return headers;
}

function saveSession(session) {
  state.auth.session = session || null;
  state.auth.user = session?.user || null;
  if (session) {
    localStorage.setItem(authStorageKey, JSON.stringify(session));
  } else {
    localStorage.removeItem(authStorageKey);
  }
}

function restoreSession() {
  try {
    const raw = localStorage.getItem(authStorageKey);
    if (!raw) return;
    saveSession(JSON.parse(raw));
  } catch {
    saveSession(null);
  }
}

async function signIn(email, password) {
  const response = await fetch(`${state.auth.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password })
  });
  const payload = await readJsonResponse(response, "登录失败，请检查邮箱和密码。");
  saveSession(payload);
  await loadRemoteWorkspace();
}

async function signUp(email, password) {
  const response = await fetch(`${state.auth.url}/auth/v1/signup`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password })
  });
  const payload = await readJsonResponse(response, "注册失败，请稍后再试。");
  if (payload.access_token) {
    saveSession(payload);
    await loadRemoteWorkspace();
  } else {
    showToast("注册成功，请先完成邮箱确认后登录");
  }
}

async function signOut() {
  if (state.auth.session?.access_token) {
    await fetch(`${state.auth.url}/auth/v1/logout`, {
      method: "POST",
      headers: authHeaders()
    }).catch(() => null);
  }
  saveSession(null);
  state.accountOpen = false;
  showToast("已退出登录");
  render();
}

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

function isRemoteReady() {
  return state.auth.configured && Boolean(state.auth.session?.access_token);
}

async function supabaseTable(path, options = {}) {
  const response = await fetch(`${state.auth.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...authHeaders(options.headers || {}),
      Prefer: options.prefer || "return=representation"
    }
  });
  return readJsonResponse(response, "Supabase 请求失败。");
}

function remoteSalary(row, amountField = "salary_amount", unitField = "salary_unit", displayField = "salary_display") {
  return row[displayField] || formatMoneyValue(row[amountField], row[unitField] || "k");
}

function mapRemoteJob(row, interviews = [], offer = null, summaries = []) {
  return {
    id: row.id,
    company: row.company || "",
    title: row.title || "",
    city: row.city || "未填写",
    salary: remoteSalary(row),
    source: row.source || "手动录入",
    priority: normalizePriority(row.priority),
    status: normalizeJobStatus(row.status),
    logo: row.logo || String(row.company || "GO").slice(0, 2).toUpperCase(),
    logoTone: row.logo_tone || "logo-yellow",
    updated: "刚刚",
    nextInterview: interviews[0]?.time || "暂无",
    tags: Array.isArray(row.tags) ? row.tags : [],
    description: row.description || "暂未补充岗位描述。",
    interviews,
    offer,
    aiSummary: summaries[0] || null
  };
}

function mapRemoteInterview(row, questions = []) {
  const duration = row.duration_minutes ? `${row.duration_minutes} 分钟` : "时长待定";
  return {
    id: row.id,
    round: `${row.round_label || "第一轮"}：${row.round_name || "未命名面试"}`,
    time: row.time ? String(row.time).replace("T", " ").slice(0, 16) : "时间待定",
    duration,
    result: normalizeInterviewResult(row.result),
    questions: questions.map((item) => ({
      q: item.question || "",
      a: item.answer || "暂未填写回答。"
    }))
  };
}

function mapRemoteOffer(row) {
  if (!row) return null;
  const totalComp = remoteSalary(row, "total_comp_amount", "total_comp_unit", "total_comp_display");
  return {
    location: row.location || "",
    totalComp,
    cashWidth: Math.min(96, Math.max(42, moneyComparable(totalComp) || 68)),
    workStyle: row.work_style || "线下",
    growth: Number(row.growth || 3),
    stability: Number(row.stability || 3),
    balance: Number(row.balance || 3),
    interest: Number(row.interest || 3),
    risk: row.risk || "暂无明显风险点。",
    decision: row.decision || "待决定"
  };
}

function mapRemoteSummary(row) {
  if (!row) return null;
  return {
    overview: row.overview || "",
    strengths: Array.isArray(row.strengths) ? row.strengths : [],
    improvements: Array.isArray(row.improvements) ? row.improvements : [],
    next: Array.isArray(row.next) ? row.next : []
  };
}

async function loadRemoteWorkspace() {
  if (!isRemoteReady()) return;
  const payload = await fetch("/api/jobs", {
    headers: { Authorization: `Bearer ${state.auth.session.access_token}` }
  }).then((response) => readJsonResponse(response, "读取岗位失败。"));
  const jobRows = payload.jobs || [];
  const interviewRows = payload.interviews || [];
  const questionRows = payload.questions || [];
  const offerRows = payload.offers || [];
  const summaryRows = payload.summaries || [];

  const questionsByInterview = new Map();
  questionRows.forEach((item) => {
    const id = item.interview_id;
    questionsByInterview.set(id, [...(questionsByInterview.get(id) || []), item]);
  });

  const interviewsByJob = new Map();
  interviewRows.forEach((item) => {
    const id = item.job_id;
    const mapped = mapRemoteInterview(item, questionsByInterview.get(item.id) || []);
    interviewsByJob.set(id, [...(interviewsByJob.get(id) || []), mapped]);
  });

  const offersByJob = new Map(offerRows.map((item) => [item.job_id, mapRemoteOffer(item)]));
  const summariesByJob = new Map();
  summaryRows.forEach((item) => {
    const id = item.job_id;
    summariesByJob.set(id, [...(summariesByJob.get(id) || []), mapRemoteSummary(item)]);
  });

  const nextJobs = jobRows.map((item) =>
    mapRemoteJob(item, interviewsByJob.get(item.id) || [], offersByJob.get(item.id) || null, summariesByJob.get(item.id) || [])
  );

  if (nextJobs.length) {
    jobs.splice(0, jobs.length, ...nextJobs);
    state.activeJobId = nextJobs[0].id;
    state.offerSelection = jobs.filter((job) => job.status === "已拿Offer" && job.offer).map((job) => job.id);
  }
}

async function createRemoteJobFromDemo(job) {
  if (!isRemoteReady()) return job;
  const salary = parseMoneyParts(job.salary, "k");
  const payload = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${state.auth.session.access_token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      company: job.company,
      title: job.title,
      city: job.city,
      salary_amount: salary.amount,
      salary_unit: salary.unit,
      salary_display: job.salary,
      source: job.source,
      priority: job.priority,
      status: job.status,
      tags: job.tags,
      description: job.description,
      logo: job.logo,
      logo_tone: job.logoTone
    })
  }).then((response) => readJsonResponse(response, "岗位保存失败。"));
  return mapRemoteJob(payload.job);
}

async function updateRemoteJobFromDemo(job) {
  if (!isRemoteReady()) return;
  const salary = parseMoneyParts(job.salary, "k");
  await supabaseTable(`jobs?id=eq.${encodeURIComponent(job.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      company: job.company,
      title: job.title,
      city: job.city,
      salary_amount: salary.amount,
      salary_unit: salary.unit,
      salary_display: job.salary,
      source: job.source,
      priority: job.priority,
      status: job.status,
      tags: job.tags,
      description: job.description
    })
  });
}

async function deleteRemoteJobFromDemo(jobId) {
  if (!isRemoteReady()) return;
  await supabaseTable(`jobs?id=eq.${encodeURIComponent(jobId)}`, { method: "DELETE" });
}

async function saveRemoteInterviewFromDemo(job, interview) {
  if (!isRemoteReady()) return;
  const roundParts = splitRoundName(interview.round, job.interviews.indexOf(interview));
  const rows = await supabaseTable("interviews?select=id", {
    method: "POST",
    body: JSON.stringify({
      user_id: state.auth.user.id,
      job_id: job.id,
      round_label: roundParts.label,
      round_name: roundParts.name || "未命名面试",
      time: interview.time === "时间待定" ? null : interview.time,
      duration_minutes: parseDurationAmount(interview.duration),
      result: interview.result
    })
  });
  const interviewId = rows[0]?.id;
  if (interviewId && interview.questions.length) {
    await supabaseTable("interview_questions", {
      method: "POST",
      body: JSON.stringify(interview.questions.map((item) => ({
        user_id: state.auth.user.id,
        interview_id: interviewId,
        question: item.q,
        answer: item.a
      })))
    });
    interview.id = interviewId;
  }
  await updateRemoteJobFromDemo({ ...job, status: "面试中" });
}

async function saveRemoteOfferFromDemo(job) {
  if (!isRemoteReady() || !job.offer) return;
  const total = parseMoneyParts(job.offer.totalComp, "w");
  await supabaseTable("offers", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({
      user_id: state.auth.user.id,
      job_id: job.id,
      location: job.offer.location,
      total_comp_amount: total.amount,
      total_comp_unit: total.unit,
      total_comp_display: job.offer.totalComp,
      work_style: job.offer.workStyle,
      growth: job.offer.growth,
      stability: job.offer.stability,
      balance: job.offer.balance,
      interest: job.offer.interest,
      risk: job.offer.risk,
      decision: job.offer.decision
    })
  });
  await updateRemoteJobFromDemo({ ...job, status: "已拿Offer" });
}

function activeInterview() {
  const job = activeJob();
  return job?.interviews?.find((interview) => interview.id === state.activeInterviewId) || null;
}

function activeJobIndex() {
  const job = activeJob();
  return job ? Math.max(0, jobs.findIndex((item) => item.id === job.id)) : 0;
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

function statusRank(status) {
  return statusOrder.has(status) ? statusOrder.get(status) : statuses.length;
}

function compareByProgress(a, b) {
  const rankDiff = statusRank(a.status) - statusRank(b.status);
  if (rankDiff !== 0) return rankDiff;
  return a.company.localeCompare(b.company, "zh-Hans-CN");
}

function visibleFunnelStatuses() {
  const selected = new Set(state.filters.funnelStatuses);
  return statuses.filter((status) => selected.has(status));
}

function jobsByStatus(list, status) {
  return list.filter((job) => job.status === status);
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
    cashWidth: Math.min(96, Math.max(42, moneyComparable(job.salary) || 64)),
    workStyle: normalizeWorkStyle(job.offer?.workStyle, job.city),
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

jobs.forEach((job) => {
  job.status = normalizeJobStatus(job.status);
  job.priority = normalizePriority(job.priority);
  syncJobData(job);
});

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
  const totalJobs = Math.max(1, jobs.length);
  const offerProgress = Math.min(100, (jobOffers().length / totalJobs) * 100).toFixed(2);
  const appliedProgress = Math.min(100, ((jobs.filter((job) => job.status === "已投递").length + jobOffers().length) / totalJobs) * 100).toFixed(2);
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
          <div class="brand-name brand-logo" aria-label="GoOffer">
            <span class="brand-logo-go">Go</span><span class="brand-logo-offer">Offer</span>
          </div>
          <div class="brand-progress" aria-label="投递进度：已拿 Offer ${jobOffers().length} 个，已投递 ${jobs.filter((job) => job.status === "已投递").length} 个，总岗位 ${jobs.length} 个" style="--offer-progress:${offerProgress}%; --applied-progress:${appliedProgress}%;">
            <span class="brand-progress-applied"></span>
            <span class="brand-progress-offer"></span>
          </div>
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
            <span class="avatar">${escapeHtml(currentUserInitials())}</span>
            <div>
              <strong>${escapeHtml(state.auth.session ? currentUserEmail().split("@")[0] : "GoOffer")}</strong>
              <span>${state.auth.session ? "已登录" : "未登录"}</span>
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
            <button class="icon-button mobile-account-button mobile-only" type="button" data-action="toggle-account" aria-label="${state.auth.session ? "账号设置" : "登录账号"}" aria-haspopup="dialog" aria-expanded="${state.accountOpen}">
              ${state.auth.session
                ? `<span class="avatar mobile-avatar">${escapeHtml(currentUserInitials())}</span>`
                : `<span class="material-symbols-outlined" aria-hidden="true">person</span>`}
            </button>
            ${topbarActions[state.screen] || ""}
            <button class="icon-button topbar-notification" type="button" data-action="toast" data-message="提醒中心会在后续版本接入" aria-label="通知">
              <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
          </div>
        </header>
        ${state.accountOpen ? `<div class="mobile-account-popover mobile-only">${renderAccountPopover()}</div>` : ""}
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
  const email = currentUserEmail();
  return `
    <section class="account-popover" role="dialog" aria-label="个人账号">
      <div class="account-popover-head">
        <span class="avatar">${escapeHtml(currentUserInitials())}</span>
        <div>
          <strong>${escapeHtml(state.auth.session ? email.split("@")[0] : "未登录")}</strong>
          <span>${escapeHtml(email)}</span>
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
      <button class="account-popover-row" type="button" data-action="${state.auth.session ? "open-ai-settings" : "open-login"}">
        <span class="material-symbols-outlined" aria-hidden="true">manage_accounts</span>
        ${state.auth.session ? "AI API 设置" : "登录账号"}
      </button>
      <button class="account-popover-row" type="button" data-action="${state.auth.session ? "logout" : "open-login"}">
        <span class="material-symbols-outlined" aria-hidden="true">lock</span>
        ${state.auth.session ? "退出登录" : "登录后同步数据"}
      </button>
    </section>
  `;
}

function renderDashboard() {
  const applied = jobs.filter((job) => job.status === "已投递");
  const interviewing = jobs.filter((job) => job.status === "面试中");
  const offers = jobOffers();
  const reviewJob = jobs.find((job) => job.aiSummary) || jobs.find((job) => job.interviews.length) || jobs[0];

  return `
    <section class="grid metric-grid">
      ${metricButton("岗位总数", jobs.length, "活跃中", "nav", "", `data-screen="jobs"`)}
      ${metricButton("已投递", applied.length, "等待反馈", "nav", "", `data-screen="jobs"`)}
      ${metricButton("正在面试", interviewing.length, "持续推进", "scroll-section", "highlight", `data-target="recent-interviews"`)}
      ${metricButton("收获 Offer", offers.length, "恭喜！", "nav", "dark", `data-screen="offers"`)}
    </section>

    <section class="grid bento-grid">
      <article class="card card-pad panel-list dashboard-funnel-card">
        <div class="section-head">
          <h2>投递漏斗</h2>
          <span class="text-link" data-action="nav" data-screen="jobs">查看全部</span>
        </div>
        ${renderDashboardFunnel()}
      </article>

      <article class="card card-pad ai-hero dashboard-interview-card" id="recent-interviews">
        <div class="section-head">
          <h2>近期面试</h2>
          <span class="text-link" data-action="nav" data-screen="jobs">查看全部</span>
        </div>
        <div class="stack dashboard-interview-list">
          ${interviewing.map((job) => dataRow(job.company, `${job.title} · ${job.nextInterview}`, badge(job.status), `data-action="select-job" data-job-id="${job.id}"`)).join("")}
          ${interviewing.length ? "" : emptyInline("还没有面试安排")}
        </div>
      </article>

      <article class="card card-pad full-span dashboard-review-card" id="follow-up-section">
        <div class="section-head">
          <h2>最近一次面试复盘</h2>
          <span class="badge ai-chip">复盘</span>
        </div>
        <div class="dashboard-review-body">
          <span class="logo-tile compact ${reviewJob.logoTone}">${escapeHtml(reviewJob.logo)}</span>
          <div>
            <h3>${escapeHtml(reviewJob.company)} · ${escapeHtml(reviewJob.title)}</h3>
            <p>${escapeHtml(reviewJob.aiSummary?.overview || "当前岗位还没有总结。记录面试问题和回答后，可以生成结构化复盘。")}</p>
            <div class="tag-row">
              ${(reviewJob.aiSummary?.next || ["补充面试问题", "记录回答重点", "生成复盘"]).slice(0, 3).map((item) => `<span class="badge todo">${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>
          <div>${button(reviewJob.aiSummary ? "查看复盘" : "进入详情", "select-job", "dark", `data-job-id="${reviewJob.id}"`)}</div>
        </div>
      </article>
    </section>
  `;
}

function renderDashboardFunnel() {
  return `
    <div class="mini-funnel">
      ${statuses.map((status) => {
        const meta = statusMeta[status];
        const items = jobsByStatus(jobs, status);
        const title = status === "已拿Offer" ? "offer" : meta.title;
        return `
          <section class="mini-funnel-step ${statusTone[status]}">
            <div class="mini-funnel-head">
              <span class="material-symbols-outlined" aria-hidden="true">${meta.icon}</span>
              <strong>${title}</strong>
              <small>${jobsByStatus(jobs, status).length}</small>
            </div>
            <div class="mini-funnel-jobs">
              ${items.map((job) => `
                <button type="button" data-action="select-job" data-job-id="${job.id}">
                  <span>
                    <strong>${escapeHtml(job.company)}</strong>
                    <small>${escapeHtml(job.title)}</small>
                  </span>
                </button>
              `).join("")}
              ${items.length ? "" : `<span class="mini-empty">暂无</span>`}
            </div>
          </section>
        `;
      }).join("")}
    </div>
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
        <div class="row-meta">${escapeHtml(`${job.updated} 更新 · ${job.nextInterview}`)}</div>
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
    const matchStatus = state.filters.status === "全部" || job.status === state.filters.status;
    const matchCity = state.filters.city === "全部" || job.city === state.filters.city;
    const matchPriority = state.filters.priority === "全部" || job.priority === state.filters.priority;
    return matchQuery && matchStatus && matchCity && matchPriority;
  });

  const order = [...filtered];
  if (state.filters.sort === "薪资") {
    order.sort((a, b) => moneyComparable(b.salary) - moneyComparable(a.salary) || compareByProgress(a, b));
    return order;
  }
  if (state.filters.sort === "优先级") {
    order.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || compareByProgress(a, b));
    return order;
  }
  if (state.filters.sort === "更新时间") return order;
  order.sort(compareByProgress);
  return order;
}

function renderJobs() {
  const list = filteredJobs();
  const cities = ["全部", ...Array.from(new Set(jobs.map((job) => job.city)))];
  const priorityOptions = ["全部", ...priorities];
  const metricActive = (status) => state.filters.status === status ? "highlight" : "";
  const currentViewIcon = state.filters.view === "list" ? "view_list" : "view_module";
  const nextView = state.filters.view === "list" ? "board" : "list";
  const nextViewLabel = state.filters.view === "list" ? "切换到看板视图" : "切换到列表视图";
  const shownContent = state.filters.funnel
    ? renderFunnelJobs(list)
    : state.filters.view === "list" ? renderJobsList(list) : `
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
    `;

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
      ${selectControl("priority-filter", "优先级", priorityOptions, state.filters.priority)}
      ${selectControl("sort-filter", "排序", ["投递进度", "更新时间", "薪资", "优先级"], state.filters.sort)}
      <div class="jobs-view-tools">
        ${renderFunnelControls()}
        <div class="view-switch" role="group" aria-label="视图切换">
          <button class="active" type="button" data-action="set-view" data-view="${nextView}" aria-label="${nextViewLabel}" title="${nextViewLabel}">
            <span class="material-symbols-outlined" aria-hidden="true">${currentViewIcon}</span>
          </button>
        </div>
      </div>
    </section>

    ${state.filters.funnel ? "" : `
      <section class="grid metric-grid">
        ${defaultFunnelStatuses.map((status) => {
          const meta = statusMeta[status];
          return metricButton(meta.title, jobs.filter((job) => job.status === status).length, meta.note, "filter-jobs", metricActive(status), `data-filter-status="${status}"`);
        }).join("")}
      </section>
    `}

    <div class="jobs-content-transition ${state.funnelTransition ? `funnel-${state.funnelTransition}` : ""}">
      ${shownContent}
    </div>
    ${list.length ? "" : emptyInline("没有匹配的岗位，调整筛选条件再试试。")}
  `;
}

function renderFunnelControls() {
  if (!state.filters.funnel) {
    return `
      <div class="funnel-standalone ${state.funnelTransition === "closing" ? "is-closing" : ""}">
        <button class="funnel-icon-button" type="button" data-action="toggle-funnel" aria-label="开启漏斗视图" title="开启漏斗视图" aria-pressed="false">
          <span class="material-symbols-outlined" aria-hidden="true">filter_alt</span>
        </button>
      </div>
    `;
  }

  return `
    <div class="funnel-controls active ${state.funnelTransition === "opening" ? "is-opening" : ""}">
      <button class="funnel-segment primary" type="button" data-action="toggle-funnel" aria-label="关闭漏斗视图" title="关闭漏斗视图" aria-pressed="true">
        <span class="material-symbols-outlined" aria-hidden="true">filter_alt_off</span>
      </button>
      <button class="funnel-segment secondary" type="button" data-action="toggle-funnel-panel" aria-label="选择显示板块" title="选择显示板块" aria-expanded="${state.funnelPanelOpen}">
        <span class="material-symbols-outlined" aria-hidden="true">view_column</span>
      </button>
      ${state.funnelPanelOpen ? renderFunnelPanel() : ""}
    </div>
  `;
}

function renderFunnelPanel() {
  const selected = new Set(state.filters.funnelStatuses);
  return `
    <section class="funnel-panel" aria-label="选择漏斗板块">
      <div class="funnel-panel-title">显示板块</div>
      ${statuses.map((status) => {
        const meta = statusMeta[status];
        return `
          <label class="funnel-status-option">
            <input type="checkbox" value="${status}" data-funnel-status-toggle ${selected.has(status) ? "checked" : ""}>
            <span class="material-symbols-outlined" aria-hidden="true">${meta.icon}</span>
            <span>${meta.title}</span>
          </label>
        `;
      }).join("")}
    </section>
  `;
}

function renderFunnelJobs(list) {
  const visibleStatuses = visibleFunnelStatuses();
  if (!visibleStatuses.length) {
    return `<section class="card card-pad funnel-empty">${emptyInline("请选择至少一个漏斗板块。")}</section>`;
  }

  return state.filters.view === "list"
    ? renderFunnelList(list, visibleStatuses)
    : renderFunnelBoard(list, visibleStatuses);
}

function renderFunnelBoard(list, visibleStatuses) {
  return `
    <section class="funnel-board ${state.suppressFunnelMotion ? "no-motion" : ""}" aria-label="漏斗看板" style="--funnel-columns:${visibleStatuses.length};">
      ${visibleStatuses.map((status) => renderFunnelColumn(status, jobsByStatus(list, status))).join("")}
    </section>
  `;
}

function renderFunnelColumn(status, items) {
  const meta = statusMeta[status];
  return `
    <section class="funnel-column ${statusTone[status]}" data-funnel-drop-status="${status}">
      <header class="funnel-column-head">
        <span class="funnel-column-icon material-symbols-outlined" aria-hidden="true">${meta.icon}</span>
        <div>
          <h2>${meta.title}</h2>
          <small>${items.length} 个岗位 · ${meta.note}</small>
        </div>
      </header>
      <div class="funnel-column-body">
        ${items.map((job) => renderFunnelJobCard(job)).join("")}
        ${items.length ? "" : emptyInline("拖入岗位后会自动更新状态。")}
      </div>
    </section>
  `;
}

function renderFunnelJobCard(job) {
  return `
    <article class="funnel-job-card" role="button" tabindex="0" draggable="true" data-action="select-job" data-job-id="${job.id}" data-drag-job-id="${job.id}">
      <span class="logo-tile compact ${job.logoTone}">${escapeHtml(job.logo)}</span>
      <div>
        <strong>${escapeHtml(job.company)} · ${escapeHtml(job.title)}</strong>
        <small>${escapeHtml(job.city)} · ${escapeHtml(job.salary)}</small>
      </div>
      <div class="tag-row">
        ${job.tags.slice(0, 3).map((tag) => `<span class="badge todo">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderFunnelList(list, visibleStatuses) {
  return `
    <section class="funnel-list ${state.suppressFunnelMotion ? "no-motion" : ""}" aria-label="漏斗列表">
      ${visibleStatuses.map((status) => renderFunnelListSection(status, jobsByStatus(list, status))).join("")}
    </section>
  `;
}

function renderFunnelListSection(status, items) {
  const meta = statusMeta[status];
  return `
    <section class="card funnel-list-section ${statusTone[status]}" data-funnel-drop-status="${status}">
      <header class="funnel-list-head">
        <span class="funnel-column-icon material-symbols-outlined" aria-hidden="true">${meta.icon}</span>
        <div>
          <h2>${meta.title}</h2>
          <small>${items.length} 个岗位 · ${meta.note}</small>
        </div>
      </header>
      <div class="funnel-list-body">
        ${items.map((job) => renderFunnelListRow(job)).join("")}
        ${items.length ? "" : emptyInline("把岗位拖到这里即可改为该状态。")}
      </div>
    </section>
  `;
}

function renderFunnelListRow(job) {
  return `
    <article class="funnel-list-row" role="button" tabindex="0" draggable="true" data-action="select-job" data-job-id="${job.id}" data-drag-job-id="${job.id}">
      <span class="logo-tile compact ${job.logoTone}">${escapeHtml(job.logo)}</span>
      <span class="job-list-main">
        <strong>${escapeHtml(job.title)}</strong>
        <small>${escapeHtml(job.company)} · ${escapeHtml(job.city)} · ${escapeHtml(job.salary)}</small>
      </span>
      <span class="job-list-meta">${escapeHtml(job.updated)} 更新</span>
      <span class="priority-chip ${priorityTone(job.priority)}">
        <span class="material-symbols-outlined" aria-hidden="true">star</span>
        ${escapeHtml(job.priority)} 优先级
      </span>
    </article>
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
          <span class="priority-chip ${priorityTone(job.priority)}">
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
    className: `toolbar-select ${id}`,
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
        <span class="priority-chip ${priorityTone(job.priority)}">
          <span class="material-symbols-outlined" aria-hidden="true">star</span>
          ${escapeHtml(job.priority)} 优先级
        </span>
      </footer>
    </article>
  `;
}

function renderDetail() {
  const job = activeJob();
  if (!job) {
    return pageHeader(
      "Job Detail",
      "岗位详情、面试记录和总结沉淀在同一页。"
    ) + `
      <section class="card card-pad">
        ${emptyInline("还没有岗位记录，先新增一个岗位。")}
        <div style="margin-top: 20px;">${button("新增岗位", "open-job-modal")}</div>
      </section>
    `;
  }
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
  const showAddCard = offers.length < 5;
  const gridCount = Math.max(1, offers.length + (showAddCard ? 1 : 0));

  return pageHeader(
    "Offer 对比",
    "从薪资、成长、稳定性和偏好横向比较 Offer。"
  ) + `
    <section class="grid offers-grid" style="--offer-grid-count:${gridCount};">
      ${offers.map((job) => renderOfferCard(job, best && best.id === job.id)).join("")}
      ${showAddCard ? `<button class="add-card" type="button" data-action="open-offer-select-modal">
        <span>
          <span class="add-card-icon">+</span>
          <strong>选择已有Offer</strong>
          <small>从已拿 Offer 中选择 2-5 个进行对比</small>
        </span>
      </button>` : ""}
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
    offerSelect: renderOfferSelectModal,
    deleteJob: renderDeleteJobModal,
    login: renderLoginModal,
    aiSettings: renderAiSettingsModal,
    aiHelp: renderAiHelpModal
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

function renderLoginModal() {
  const isSignup = state.auth.mode === "signup";
  const body = `
    <form class="form-grid job-edit-form" id="login-form">
      ${formSection(isSignup ? "注册新账号" : "登录账号", "邮箱仅作为登录信息，暂不进行验证", isSignup ? "sentiment_satisfied" : "account_circle", `
        ${field("email", "邮箱", "", "you@example.com")}
        ${field("password", "密码", "", "至少 6 位")}
      `)}
      <button class="account-popover-row" type="button" data-action="toggle-auth-mode">
        <span class="material-symbols-outlined" aria-hidden="true">sync_alt</span>
        ${isSignup ? "已有账号？切换到登录" : "没有账号？切换到注册"}
      </button>
    </form>
  `;
  return modalShell(
    isSignup ? "注册 GoOffer" : "登录 GoOffer",
    body,
    `${button("取消", "close-modal", "surface")} ${button(isSignup ? "注册" : "登录", isSignup ? "signup" : "login")}`
  );
}

function renderAiSettingsModal() {
  const provider = state.aiProvider;
  const body = `
    <form class="form-grid job-edit-form" id="ai-settings-form">
      ${formSection("用户 API Key", "Key 会加密保存到 Cloudflare/Supabase 后端，只用于 AI 面试总结；岗位截图识别已改为本地 OCR，不再消耗你的 API。", "auto_awesome", `
        ${field("baseUrl", "Base URL", provider?.base_url || "https://api.openai.com/v1", "https://api.openai.com/v1")}
        ${field("model", "模型", provider?.model || "gpt-4o-mini", "gpt-4o-mini")}
        ${field("apiKey", "API Key", "", provider?.api_key_hint || "sk-...")}
      `, `<button class="section-action-button" type="button" data-action="open-ai-help">
        <span class="material-symbols-outlined" aria-hidden="true">help</span>
        如何获取
      </button>`)}
      ${provider ? `<div class="empty-dash">当前已绑定：${escapeHtml(provider.model)} · ${escapeHtml(provider.api_key_hint || "")}</div>` : ""}
    </form>
  `;
  return modalShell(
    "AI API 设置",
    body,
    `${button("取消", "close-modal", "surface")} ${provider ? button("测试连接", "test-ai-provider", "surface") : ""} ${button("保存设置", "save-ai-provider")}`
  );
}

function renderAiHelpModal() {
  const body = `
    <section class="help-copy">
      <h3>Base URL 填什么？</h3>
      <p>如果使用 OpenAI 官方 API，Base URL 填：</p>
      <pre>https://api.openai.com/v1</pre>
      <p>如果使用兼容 OpenAI 格式的服务商，填写服务商文档里的 OpenAI-compatible Base URL，例如以 <code>/v1</code> 结尾的地址。</p>

      <h3>模型填什么？</h3>
      <p>填写你的 API Key 有权限调用的模型名。OpenAI 官方推荐先用：</p>
      <pre>gpt-4o-mini</pre>
      <p>如果你使用其他服务商，请填它控制台或文档中给出的模型 ID。</p>

      <h3>API Key 在哪里获取？</h3>
      <p>OpenAI 官方路径：进入 OpenAI Platform，打开 API Keys 页面，点击 Create new secret key，复制以 <code>sk-</code> 开头的密钥。</p>
      <p>保存后密钥只会显示一次，请立刻复制。GoOffer 会加密保存，只用于你的 AI 面试总结。</p>

      <h3>截图识别还需要 API Key 吗？</h3>
      <p>不需要。岗位截图识别使用浏览器本地 OCR 和规则抽取，不调用你的 API，也不消耗大模型额度。</p>
    </section>
  `;
  return modalShell("如何获取 API 设置", body, `${button("返回设置", "open-ai-settings", "surface")} ${button("关闭", "close-modal")}`);
}

function renderJobModal() {
  const job = activeJob();
  const editing = state.screen === "detail" && Boolean(job);
  const body = `
    <form class="form-grid job-edit-form" id="job-form">
      ${formSection("基础信息", "公司、岗位、城市和薪资先定好，后续筛选才好用。", "business_center", `
        ${field("company", "公司名称", editing ? job.company : "", "例如 ByteDance")}
        ${field("title", "岗位名称", editing ? job.title : "", "例如 前端工程师")}
        ${field("city", "城市", editing ? job.city : "", "例如 上海")}
        ${moneyField("salary", "薪资范围", editing ? job.salary : "", "35 - 50", "k")}
        ${textareaField("description", "岗位要求", editing ? job.description : "", "补充岗位职责、要求或备注")}
      `, editing ? "" : jobRecognitionButton(), editing ? "" : "data-job-recognition")}
      ${formSection("投递信息", "记录当前阶段、优先级、来源和可检索标签。", "track_changes", `
        ${selectField("status", "投递状态", statuses, editing ? job.status : "待投递")}
        ${selectField("priority", "优先级", priorities, editing ? job.priority : "中")}
        ${field("source", "投递渠道", editing ? job.source : "", "粘贴投递链接")}
        ${tagField("tags", "标签", editing ? job.tags.join("，") : "")}
      `)}
    </form>
  `;
  return modalShell(
    editing ? "编辑岗位" : "新增岗位",
    body,
    editing
      ? `
        <div class="modal-footer-split">
          ${button(`<span class="material-symbols-outlined" aria-hidden="true">delete</span>删除岗位`, "confirm-delete-job", "danger")}
          <span>
            ${button("取消", "close-modal", "surface")}
            ${button("保存修改", "save-job-edit")}
          </span>
        </div>
      `
      : `${button("取消", "close-modal", "surface")} ${button("保存岗位", "save-job")}`
  );
}

function renderDeleteJobModal() {
  const job = jobs.find((item) => item.id === state.pendingDeleteJobId) || activeJob();
  if (!job) {
    return modalShell("删除岗位", emptyInline("当前没有可删除的岗位。"), `${button("关闭", "close-modal", "surface")}`);
  }
  const body = `
    <section class="delete-confirm">
      <span class="material-symbols-outlined" aria-hidden="true">warning</span>
      <div>
        <h3>确认删除这个岗位？</h3>
        <p>删除后，${escapeHtml(job.company)} · ${escapeHtml(job.title)} 的岗位信息、面试记录和 Offer 数据都会从当前 demo 数据中移除。</p>
      </div>
    </section>
  `;
  return modalShell(
    "删除岗位",
    body,
    `${button("取消", "close-modal", "surface")} ${button("确认删除", "delete-job", "danger")}`
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
  const addQaButton = `
    <button class="section-action-button" type="button" data-action="add-interview-qa">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
      添加一组
    </button>
  `;
  const body = `
    <form class="form-grid job-edit-form interview-form" id="interview-form">
      ${formSection("面试安排", "自动匹配当前轮次，补充面试名称、时间和结果。", "event_note", `
        ${roundField("roundName", "面试轮次", roundParts.label, roundParts.name, "例如 技术终面")}
        ${dateTimeField("time", "面试时间", interview?.time || "", "选择面试时间")}
        ${durationField("duration", "预计时长", interview?.duration || "", "60", "分钟")}
        ${selectField("result", "面试状态", interviewResults, normalizeInterviewResult(interview?.result))}
      `)}
      ${formSection("面试问题与回答", "每轮面试可记录多组问答，后续用于结构化复盘。", "forum", `
        <div class="field full qa-list-field">
          <span>问题组</span>
          <div class="qa-list" data-qa-list>
            ${questions.map((item, index) => interviewQuestionFields(index, item)).join("")}
          </div>
        </div>
      `, addQaButton)}
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
    <form class="form-grid job-edit-form offer-edit-form" id="offer-form">
      ${formSection("薪资与工作", "先记录 Offer 的核心条件，用于后续横向比较。", "payments", `
        ${moneyField("totalComp", "年总包薪资", offer ? offer.totalComp : "", "45", "w")}
        ${field("location", "工作城市", offer ? offer.location : "", "例如 上海")}
        ${selectField("workStyle", "工作模式", workStyles, normalizeWorkStyle(offer ? offer.workStyle : "", job.city))}
      `)}
      ${formSection("评分与风险", "从成长、稳定性、生活节奏和个人兴趣四个维度打分。", "query_stats", `
        ${selectField("growth", "成长空间", ["1", "2", "3", "4", "5"], offer ? String(offer.growth) : "4")}
        ${selectField("stability", "稳定性", ["1", "2", "3", "4", "5"], offer ? String(offer.stability) : "4")}
        ${selectField("balance", "工作生活平衡", ["1", "2", "3", "4", "5"], offer ? String(offer.balance) : "4")}
        ${selectField("interest", "个人兴趣", ["1", "2", "3", "4", "5"], offer ? String(offer.interest) : "4")}
        ${textareaField("risk", "风险点", offer ? offer.risk : "", "例如 节奏较快，需要确认团队资源")}
      `)}
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

function moneyField(name, label, value, placeholder, fallbackUnit = "k") {
  const parts = parseMoneyParts(value, fallbackUnit);
  const unitName = `${name}Unit`;
  const amountName = `${name}Amount`;
  const displayLabel = label.includes("RMB") ? label : `${label}（RMB）`;
  return `
    <label class="field money-field">
      <span>${displayLabel}</span>
      <span class="money-input-shell">
        <input type="hidden" name="${name}" value="${escapeHtml(formatMoneyValue(parts.amount, parts.unit))}" data-money-value>
        <input name="${amountName}" value="${escapeHtml(parts.amount)}" placeholder="${escapeHtml(placeholder)}" data-money-amount data-money-name="${name}" data-default-unit="${escapeHtml(fallbackUnit)}">
        ${customSelect({ name: unitName, label: `${displayLabel}单位`, options: salaryUnits, value: parts.unit, className: "money-unit-select" })}
      </span>
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
      <input name="${name}" value="${escapeHtml(value)}" placeholder="React，远程，高" data-tag-input>
      <div class="tag-preview" data-tag-preview>${renderTagPreview(value)}</div>
    </label>
  `;
}

function setFormValue(form, name, value) {
  const moneyValue = form.querySelector(`[data-money-value][name="${name}"]`);
  if (moneyValue) {
    const amount = form.querySelector(`[data-money-amount][data-money-name="${name}"]`);
    const parts = parseMoneyParts(value, amount?.dataset.defaultUnit || "k");
    moneyValue.value = formatMoneyValue(parts.amount, parts.unit);
    if (amount) amount.value = parts.amount;
    const unitField = form.elements[`${name}Unit`];
    const unitSelect = unitField?.closest("[data-custom-select]");
    if (unitSelect) setCustomSelectValue(unitSelect, parts.unit);
    return;
  }

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

function normalizeOcrLine(value) {
  return String(value || "")
    .replace(/[|｜]/g, " ")
    .replace(/[，,]/g, "，")
    .replace(/\s+/g, " ")
    .trim();
}

function extractByLabel(lines, labels) {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const matched = labels.find((label) => line.includes(label));
    if (!matched) continue;
    const inline = line.split(new RegExp(`${matched}\\s*[:：]?`))[1]?.trim();
    if (inline && inline.length > 1) return inline;
    const next = lines[index + 1];
    if (next && !labels.some((label) => next.includes(label))) return next.trim();
  }
  return "";
}

function detectSalary(text) {
  const matched = text.match(/(?:RMB|CNY|¥|￥)?\s*(\d+(?:\.\d+)?(?:\s*(?:-|~|—|–|至|到)\s*\d+(?:\.\d+)?)?)\s*(k|K|w|W|万|万\/年|千|千\/月|千\/月|k\/月|K\/月)/);
  if (!matched) return { amount: "", unit: "k", display: "" };
  const unit = /w|W|万/.test(matched[2]) ? "w" : "k";
  const amount = matched[1].replace(/\s*(?:~|—|–|至|到|-)\s*/g, " - ").trim();
  return { amount, unit, display: formatMoneyValue(amount, unit) };
}

function detectCity(text) {
  const cities = ["北京", "上海", "深圳", "广州", "杭州", "成都", "南京", "苏州", "武汉", "西安", "厦门", "长沙", "重庆", "天津", "合肥", "远程"];
  return cities.find((city) => text.includes(city)) || "";
}

function detectTags(text) {
  const tags = [];
  const rules = [
    ["React", /react/i],
    ["Vue", /vue/i],
    ["Node.js", /node/i],
    ["TypeScript", /typescript|ts\b/i],
    ["AI", /ai|人工智能|大模型|llm/i],
    ["数据", /数据|data/i],
    ["产品", /产品|pm\b/i],
    ["设计", /设计|ui|ux/i],
    ["远程", /远程|remote/i],
    ["实习", /实习|intern/i]
  ];
  rules.forEach(([tag, pattern]) => {
    if (pattern.test(text)) tags.push(tag);
  });
  return tags.length ? tags : ["截图识别"];
}

function looksLikeTitle(line) {
  return /工程师|开发|前端|后端|全栈|算法|测试|产品|经理|运营|设计|分析师|架构|实习|研发|顾问|专家|负责人/i.test(line);
}

function looksLikeCompany(line) {
  return /公司|科技|集团|有限|inc\.?|ltd\.?|corp\.?|字节|腾讯|阿里|百度|美团|微软|快手|小红书|京东|网易/i.test(line);
}

function extractJobPostingFromText(text) {
  const lines = text.split(/\r?\n/).map(normalizeOcrLine).filter((line) => line.length > 1);
  const compactText = lines.join("\n");
  const salary = detectSalary(compactText);
  const labeledCompany = extractByLabel(lines, ["公司名称", "公司", "企业", "雇主"]);
  const labeledTitle = extractByLabel(lines, ["岗位名称", "职位名称", "岗位", "职位", "招聘职位"]);
  const companyLine = lines.find((line) => looksLikeCompany(line) && !looksLikeTitle(line));
  const titleLine = lines.find((line) => looksLikeTitle(line) && !/职责|要求|描述/.test(line));
  const city = detectCity(compactText);
  const descriptionLines = lines
    .filter((line) => !line.includes(salary.amount))
    .filter((line) => line !== labeledCompany && line !== labeledTitle)
    .slice(0, 8);

  return {
    company: (labeledCompany || companyLine || "").slice(0, 48),
    title: (labeledTitle || titleLine || "").slice(0, 60),
    city,
    salary_amount: salary.amount,
    salary_unit: salary.unit,
    salary_display: salary.display,
    source: "本地 OCR",
    priority: "中",
    status: "待投递",
    tags: detectTags(compactText),
    description: descriptionLines.join("\n").slice(0, 900),
    confidence: text.length > 20 ? 0.76 : 0.35
  };
}

function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (loadTesseract.promise) return loadTesseract.promise;
  loadTesseract.promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.onload = () => resolve(window.Tesseract);
    script.onerror = () => reject(new Error("OCR 引擎加载失败。"));
    document.head.appendChild(script);
  });
  return loadTesseract.promise;
}

async function recognizeJobPostingWithLocalOcr(file, onProgress) {
  const Tesseract = await loadTesseract();
  const result = await Tesseract.recognize(file, "chi_sim+eng", {
    workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    logger: (event) => {
      if (event.status === "recognizing text" && typeof onProgress === "function") {
        onProgress(Math.round((event.progress || 0) * 100));
      }
    }
  });
  const text = result?.data?.text || "";
  const extracted = extractJobPostingFromText(text);
  if (!extracted.company && !extracted.title && !extracted.salary_amount) {
    throw new Error("OCR 未识别出足够的岗位信息，请换一张更清晰的截图或手动填写。");
  }
  return extracted;
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
  if (status) status.textContent = "正在本地 OCR 识别...";

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
    try {
      const recognized = await recognizeJobPostingWithLocalOcr(file, (progress) => {
        if (status) status.textContent = `正在本地 OCR 识别...${progress}%`;
      });
      if (handleJobImageUpload.token !== token) return;

      Object.entries({
        company: recognized.company,
        title: recognized.title,
        city: recognized.city,
        salary: recognized.salary_display || formatMoneyValue(recognized.salary_amount, recognized.salary_unit || "k"),
        source: recognized.source || "截图识别",
        priority: normalizePriority(recognized.priority),
        status: normalizeJobStatus(recognized.status),
        tags: Array.isArray(recognized.tags) ? recognized.tags.join("，") : recognized.tags,
        description: recognized.description
      }).forEach(([name, value]) => setFormValue(form, name, value || ""));
      section.classList.remove("is-loading");
      section.classList.add("is-complete");
      if (status) status.textContent = "已填入，可继续修改";
      showToast("本地 OCR 已填入岗位信息");
      renderToast();
    } catch (error) {
      section.classList.remove("is-loading");
      if (status) status.textContent = error instanceof Error ? error.message : "截图识别失败";
      showToast("OCR 识别失败，请换清晰截图或手动填写");
      renderToast();
    }
  }, 780);
}

function readForm(id) {
  return Object.fromEntries(new FormData(document.getElementById(id)).entries());
}

async function handleLoginSubmit(signup = false) {
  const data = readForm("login-form");
  const email = String(data.email || "").trim();
  const password = String(data.password || "");
  if (!email || !password) {
    state.modalError = "邮箱和密码都是必填项。";
    render();
    return;
  }

  try {
    if (signup) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
    state.modal = null;
    state.modalError = "";
    document.body.classList.remove("modal-open");
    showToast(signup ? "账号已创建" : "登录成功");
    render();
  } catch (error) {
    state.modalError = error instanceof Error ? error.message : "账号操作失败。";
    render();
  }
}

async function loadAiProvider() {
  if (!isRemoteReady()) return null;
  const response = await fetch("/api/me/ai-provider", { headers: { Authorization: `Bearer ${state.auth.session.access_token}` } });
  const payload = await readJsonResponse(response, "读取 AI 设置失败。");
  state.aiProvider = payload.provider || null;
  return state.aiProvider;
}

async function saveAiProvider() {
  const data = readForm("ai-settings-form");
  const apiKey = String(data.apiKey || "").trim();
  if (!state.aiProvider && !apiKey) {
    state.modalError = "首次绑定必须填写 API Key。";
    render();
    return;
  }
  try {
    const response = await fetch("/api/me/ai-provider", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${state.auth.session.access_token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        base_url: String(data.baseUrl || "").trim(),
        model: String(data.model || "").trim(),
        api_key: apiKey,
        supports_vision: Boolean(data.supportsVision)
      })
    });
    const payload = await readJsonResponse(response, "保存 AI 设置失败。");
    state.aiProvider = payload.provider;
    closeModal();
    showToast("AI API 设置已保存");
  } catch (error) {
    state.modalError = error instanceof Error ? error.message : "保存 AI 设置失败。";
    render();
  }
}

async function testAiProvider() {
  try {
    const response = await fetch("/api/me/ai-provider/test", {
      method: "POST",
      headers: { Authorization: `Bearer ${state.auth.session.access_token}` }
    });
    await readJsonResponse(response, "AI 连接测试失败。");
    showToast("AI 连接测试通过");
  } catch (error) {
    state.modalError = error instanceof Error ? error.message : "AI 连接测试失败。";
    render();
  }
}

async function saveJob(editing = false) {
  const data = readForm("job-form");
  const salary = formatMoneyValue(data.salaryAmount, data.salaryUnit || "k");
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
      salary,
      status: normalizeJobStatus(data.status),
      priority: normalizePriority(data.priority),
      source: data.source.trim() || "手动录入",
      tags: data.tags ? parseTags(data.tags) : job.tags,
      description: data.description.trim() || job.description,
      updated: "刚刚"
    });
    syncJobData(job);
    try {
      await updateRemoteJobFromDemo(job);
    } catch (error) {
      state.modalError = error instanceof Error ? error.message : "岗位同步失败。";
      render();
      return;
    }
  } else {
    const id = `job-${Date.now()}`;
    let newJob = {
      id,
      company: data.company.trim(),
      title: data.title.trim(),
      city: data.city.trim() || "未填写",
      salary,
      source: data.source.trim() || "手动录入",
      priority: normalizePriority(data.priority),
      status: normalizeJobStatus(data.status),
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
    try {
      newJob = await createRemoteJobFromDemo(newJob);
      syncJobData(newJob);
    } catch (error) {
      state.modalError = error instanceof Error ? error.message : "岗位保存失败。";
      render();
      return;
    }
    jobs.unshift(newJob);
    state.activeJobId = newJob.id;
    state.screen = "detail";
  }

  closeModal();
  showToast(editing ? "岗位信息已更新" : "岗位已添加，并进入详情页");
}

async function deletePendingJob() {
  const jobId = state.pendingDeleteJobId || activeJob()?.id;
  const job = jobs.find((item) => item.id === jobId);
  if (!job) {
    closeModal();
    return;
  }

  const index = jobs.findIndex((item) => item.id === jobId);
  try {
    await deleteRemoteJobFromDemo(jobId);
  } catch (error) {
    state.modalError = error instanceof Error ? error.message : "删除同步失败。";
    render();
    return;
  }
  jobs.splice(index, 1);
  state.offerSelection = state.offerSelection.filter((id) => id !== jobId);
  state.activeJobId = jobs[Math.max(0, Math.min(index, jobs.length - 1))]?.id || "";
  state.pendingDeleteJobId = "";
  state.modal = null;
  state.modalError = "";
  state.activeInterviewId = null;
  document.body.classList.remove("modal-open");
  showToast("岗位已删除");
  state.screen = "jobs";
  render({ scrollTop: state.scrollPositions.jobs || 0 });
}

async function saveInterview() {
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
  try {
    await saveRemoteInterviewFromDemo(job, nextInterview);
  } catch (error) {
    state.modalError = error instanceof Error ? error.message : "面试同步失败。";
    render();
    return;
  }
  closeModal();
  showToast(existingIndex >= 0 ? "面试记录已更新" : "面试记录已保存");
}

async function saveOffer() {
  const data = readForm("offer-form");
  const totalComp = formatMoneyValue(data.totalCompAmount, data.totalCompUnit || "w");
  if (totalComp === "面议") {
    state.modalError = "年总包薪资是必填项，哪怕先写一个估算值也可以。";
    render();
    return;
  }

  const job = activeJob();
  job.offer = {
    location: data.location.trim() || job.city,
    totalComp,
    cashWidth: Math.min(96, Math.max(42, moneyComparable(totalComp) || 68)),
    workStyle: normalizeWorkStyle(data.workStyle, job.city),
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
  try {
    await saveRemoteOfferFromDemo(job);
  } catch (error) {
    state.modalError = error instanceof Error ? error.message : "Offer 同步失败。";
    render();
    return;
  }
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

async function generateAiSummary() {
  const job = activeJob();
  state.aiLoading = true;
  render();

  if (isRemoteReady() && job.interviews[0]?.id) {
    try {
      const response = await fetch(`/api/interviews/${job.interviews[0].id}/ai-summary/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.auth.session.access_token}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ regenerate: false })
      });
      const payload = await readJsonResponse(response, "AI 总结失败。");
      job.aiSummary = payload.summary;
      state.aiLoading = false;
      showToast("AI 总结已生成");
      render();
      return;
    } catch (error) {
      state.aiLoading = false;
      showToast(error instanceof Error ? error.message : "AI 总结失败，请检查 AI 设置");
      render();
      return;
    }
  }

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
      job.status = normalizeJobStatus(value);
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
  state.pendingDeleteJobId = "";
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
  if (state.booting) {
    app.innerHTML = `
      <main class="auth-gate">
        <section class="card auth-card">
          <div class="brand-name brand-logo" aria-label="GoOffer">
            <span class="brand-logo-go">Go</span><span class="brand-logo-offer">Offer</span>
          </div>
          <h1>正在进入 GoOffer...</h1>
          <p>正在读取部署配置和登录状态。</p>
        </section>
      </main>
    `;
    modalRoot.innerHTML = "";
    renderToast();
    return;
  }

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
  state.suppressFunnelMotion = false;
  state.funnelTransition = "";

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

function clearDragTargets() {
  document.querySelectorAll(".drag-over").forEach((target) => target.classList.remove("drag-over"));
  document.querySelectorAll(".is-dragging").forEach((target) => target.classList.remove("is-dragging"));
}

function moveJobToStatus(jobId, status) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job || !statuses.includes(status)) return false;
  if (job.status === status) return false;

  job.status = status;
  job.updated = "刚刚";
  syncJobData(job);
  return true;
}

document.addEventListener("click", (event) => {
  const modalPanel = event.target.closest("[data-modal-panel]");
  const selectRoot = event.target.closest("[data-custom-select]");
  const dateTimeRoot = event.target.closest("[data-date-time-picker]");
  const accountRoot = event.target.closest(".sidebar-user, .mobile-account-button, .account-popover");
  const funnelRoot = event.target.closest(".funnel-controls, .funnel-standalone");
  const actionEl = event.target.closest("[data-action]");
  let closedAccount = false;
  let closedFunnelPanel = false;
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
  if (state.funnelPanelOpen && !funnelRoot) {
    state.funnelPanelOpen = false;
    closedFunnelPanel = true;
    state.suppressFunnelMotion = true;
  }
  if (!actionEl) {
    if (closedAccount || closedFunnelPanel) render();
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

  if (action === "open-login") {
    state.modal = "login";
    state.modalError = "";
    state.accountOpen = false;
    render();
    return;
  }

  if (action === "toggle-auth-mode") {
    state.auth.mode = state.auth.mode === "signup" ? "signin" : "signup";
    state.modalError = "";
    render();
    return;
  }

  if (action === "login") {
    void handleLoginSubmit(false);
    return;
  }

  if (action === "signup") {
    void handleLoginSubmit(true);
    return;
  }

  if (action === "logout") {
    void signOut();
    return;
  }

  if (action === "open-ai-settings") {
    state.modal = "aiSettings";
    state.modalError = "";
    state.accountOpen = false;
    void loadAiProvider().then(() => render()).catch((error) => {
      state.modalError = error instanceof Error ? error.message : "读取 AI 设置失败。";
      render();
    });
    render();
    return;
  }

  if (action === "open-ai-help") {
    state.modal = "aiHelp";
    state.modalError = "";
    render();
    return;
  }

  if (action === "save-ai-provider") {
    void saveAiProvider();
    return;
  }

  if (action === "test-ai-provider") {
    void testAiProvider();
    return;
  }

  if (action === "filter-jobs") {
    state.filters.status = actionEl.dataset.filterStatus || "全部";
    state.filters.city = "全部";
    state.filters.priority = "全部";
    state.filters.query = "";
    state.funnelPanelOpen = false;
    render();
    return;
  }

  if (action === "toggle-funnel") {
    const willOpen = !state.filters.funnel;
    state.filters.funnel = !state.filters.funnel;
    state.funnelTransition = willOpen ? "opening" : "closing";
    state.funnelPanelOpen = false;
    state.filters.status = "全部";
    if (!state.filters.funnelStatuses.length) {
      state.filters.funnelStatuses = [...defaultFunnelStatuses];
    }
    render();
    return;
  }

  if (action === "toggle-funnel-panel") {
    state.funnelPanelOpen = !state.funnelPanelOpen;
    state.suppressFunnelMotion = true;
    render();
    return;
  }

  if (action === "set-view") {
    state.filters.view = actionEl.dataset.view || "board";
    render();
    return;
  }

  if (action === "select-job") {
    if (Date.now() - state.lastDragAt < 240) return;
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
    void saveJob(false);
    return;
  }

  if (action === "save-job-edit") {
    void saveJob(true);
    return;
  }

  if (action === "confirm-delete-job") {
    state.pendingDeleteJobId = activeJob()?.id || "";
    state.modal = "deleteJob";
    state.modalError = "";
    render();
    return;
  }

  if (action === "delete-job") {
    void deletePendingJob();
    return;
  }

  if (action === "save-interview") {
    void saveInterview();
    return;
  }

  if (action === "save-offer") {
    void saveOffer();
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
    void generateAiSummary();
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

  if (target.matches("[data-funnel-status-toggle]")) {
    const value = target.value;
    const selected = new Set(state.filters.funnelStatuses);
    if (target.checked) {
      selected.add(value);
    } else {
      selected.delete(value);
    }
    state.filters.funnelStatuses = statuses.filter((status) => selected.has(status));
    render();
    return;
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

document.addEventListener("dragstart", (event) => {
  const dragCard = event.target.closest("[data-drag-job-id]");
  if (!dragCard) return;

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", dragCard.dataset.dragJobId);
  dragCard.classList.add("is-dragging");
});

document.addEventListener("dragover", (event) => {
  const dropTarget = event.target.closest("[data-funnel-drop-status]");
  if (!dropTarget) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  document.querySelectorAll(".drag-over").forEach((target) => {
    if (target !== dropTarget) target.classList.remove("drag-over");
  });
  dropTarget.classList.add("drag-over");
});

document.addEventListener("dragleave", (event) => {
  const dropTarget = event.target.closest("[data-funnel-drop-status]");
  if (!dropTarget || dropTarget.contains(event.relatedTarget)) return;
  dropTarget.classList.remove("drag-over");
});

document.addEventListener("drop", (event) => {
  const dropTarget = event.target.closest("[data-funnel-drop-status]");
  if (!dropTarget) return;

  event.preventDefault();
  const jobId = event.dataTransfer.getData("text/plain");
  const status = dropTarget.dataset.funnelDropStatus;
  clearDragTargets();
  state.lastDragAt = Date.now();

  if (moveJobToStatus(jobId, status)) {
    showToast(`已移动到${statusMeta[status]?.title || status}`);
    render();
  }
});

document.addEventListener("dragend", () => {
  state.lastDragAt = Date.now();
  clearDragTargets();
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

async function initApp() {
  try {
    await loadRuntimeConfig();
    restoreSession();
    if (isRemoteReady()) {
      await loadRemoteWorkspace();
      await loadAiProvider().catch(() => null);
    }
  } catch (error) {
    showToast(error instanceof Error ? error.message : "初始化失败，已进入 demo 模式");
  } finally {
    state.booting = false;
    if (!state.auth.configured) {
      showToast("Supabase 未配置，当前为本地 demo 模式");
    }
    render();
  }
}

render();
void initApp();
