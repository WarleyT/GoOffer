import type { AIProvider, AISummary, AppUser, Interview, Job, JobDraft, Offer, OfferDraft, RecognizedJob } from "../types";
import { initials, normalizeSalary } from "./format";

const userKey = "gooffer.demo.user";
const jobsKey = "gooffer.demo.jobs";
const providerKey = "gooffer.demo.provider";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

const seedJobs: Job[] = [
  {
    id: "demo-job-1",
    company: "ByteDance",
    title: "高级前端开发工程师",
    city: "北京",
    salary_amount: "35 - 50",
    salary_unit: "k",
    salary_display: "RMB 35 - 50k",
    source: "内推",
    priority: "高",
    status: "面试中",
    tags: ["React", "Next.js", "核心架构组"],
    description: "负责核心业务 Web 体验、性能优化、组件化建设和跨团队工程协作。",
    logo: "BD",
    logo_tone: "red",
    created_at: now(),
    updated_at: now(),
    interviews: [
      {
        id: "demo-interview-1",
        job_id: "demo-job-1",
        round_label: "第一轮",
        round_name: "技术初试",
        time: now(),
        duration_minutes: 60,
        result: "等待结果",
        questions: [
          {
            id: "demo-question-1",
            question: "请介绍一个你负责过的复杂项目。",
            answer: "回答了性能优化、组件化和跨团队协作，但量化指标准备得不够充分。"
          }
        ]
      }
    ],
    offer: null,
    summaries: []
  },
  {
    id: "demo-job-2",
    company: "美团",
    title: "UI 设计师",
    city: "上海",
    salary_amount: "45",
    salary_unit: "w",
    salary_display: "RMB 45w",
    source: "猎头",
    priority: "中",
    status: "已拿Offer",
    tags: ["设计系统", "业务中台"],
    description: "负责业务工具体验设计、设计系统维护和跨端体验一致性。",
    logo: "MT",
    logo_tone: "yellow",
    created_at: now(),
    updated_at: now(),
    interviews: [],
    offer: {
      id: "demo-offer-1",
      job_id: "demo-job-2",
      location: "上海",
      total_comp_amount: "45",
      total_comp_unit: "w",
      total_comp_display: "RMB 45w",
      work_style: "混合办公",
      growth: 4,
      stability: 4,
      balance: 3,
      interest: 4,
      risk: "业务节奏偏快，需要确认团队资源。",
      decision: "待决定"
    },
    summaries: []
  }
];

function readJobs() {
  const raw = localStorage.getItem(jobsKey);
  if (!raw) {
    localStorage.setItem(jobsKey, JSON.stringify(seedJobs));
    return seedJobs;
  }
  return JSON.parse(raw) as Job[];
}

function writeJobs(jobs: Job[]) {
  localStorage.setItem(jobsKey, JSON.stringify(jobs));
}

export const demoStore = {
  currentUser(): AppUser | null {
    const raw = localStorage.getItem(userKey);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  },
  login(email: string, username?: string) {
    const user: AppUser = {
      id: "demo-user",
      email,
      username: username || email.split("@")[0],
      isDemo: true
    };
    localStorage.setItem(userKey, JSON.stringify(user));
    readJobs();
    return user;
  },
  logout() {
    localStorage.removeItem(userKey);
  },
  listJobs() {
    return readJobs();
  },
  createJob(draft: JobDraft) {
    const job: Job = {
      id: id("job"),
      ...draft,
      salary_display: draft.salary_display || normalizeSalary(draft.salary_amount, draft.salary_unit),
      logo: initials(draft.company),
      logo_tone: "yellow",
      created_at: now(),
      updated_at: now(),
      interviews: [],
      offer: null,
      summaries: []
    };
    const jobs = [job, ...readJobs()];
    writeJobs(jobs);
    return job;
  },
  updateJob(jobId: string, patch: Partial<Job>) {
    const jobs = readJobs().map((job) => (job.id === jobId ? { ...job, ...patch, updated_at: now() } : job));
    writeJobs(jobs);
  },
  deleteJob(jobId: string) {
    writeJobs(readJobs().filter((job) => job.id !== jobId));
  },
  addInterview(jobId: string, interview: Omit<Interview, "id" | "job_id">) {
    const nextInterview: Interview = { ...interview, id: id("interview"), job_id: jobId };
    const jobs = readJobs().map((job) =>
      job.id === jobId ? { ...job, status: "面试中" as const, interviews: [...job.interviews, nextInterview], updated_at: now() } : job
    );
    writeJobs(jobs);
    return nextInterview;
  },
  saveOffer(jobId: string, draft: OfferDraft) {
    const offer: Offer = {
      id: id("offer"),
      job_id: jobId,
      ...draft,
      total_comp_display: draft.total_comp_display || normalizeSalary(draft.total_comp_amount, draft.total_comp_unit),
      decision: "待决定"
    };
    const jobs = readJobs().map((job) => (job.id === jobId ? { ...job, status: "已拿Offer" as const, offer, updated_at: now() } : job));
    writeJobs(jobs);
    return offer;
  },
  saveSummary(jobId: string, interviewId: string | null, summary: Omit<AISummary, "id" | "job_id" | "created_at">) {
    const nextSummary: AISummary = {
      ...summary,
      id: id("summary"),
      job_id: jobId,
      interview_id: interviewId,
      created_at: now()
    };
    const jobs = readJobs().map((job) =>
      job.id === jobId ? { ...job, summaries: [nextSummary, ...job.summaries], updated_at: now() } : job
    );
    writeJobs(jobs);
    return nextSummary;
  },
  recognize(fileName: string): RecognizedJob {
    const lower = fileName.toLowerCase();
    if (lower.includes("product") || lower.includes("pm") || lower.includes("腾讯")) {
      return {
        company: "腾讯",
        title: "资深产品经理",
        city: "深圳",
        salary_amount: "40 - 65",
        salary_unit: "k",
        salary_display: "RMB 40 - 65k",
        source: "截图识别",
        priority: "高",
        status: "待投递",
        tags: ["平台产品", "增长", "用户体验"],
        description: "负责平台产品规划、需求拆解、增长策略和跨团队推进。",
        confidence: 0.82,
        missing_fields: []
      };
    }
    return {
      company: "ByteDance",
      title: "高级前端开发工程师",
      city: "北京",
      salary_amount: "35 - 50",
      salary_unit: "k",
      salary_display: "RMB 35 - 50k",
      source: "截图识别",
      priority: "高",
      status: "待投递",
      tags: ["React", "Next.js", "核心架构组"],
      description: "负责核心业务 Web 体验、性能优化、组件化建设和跨团队工程协作。",
      confidence: 0.78,
      missing_fields: []
    };
  },
  generateSummary(): Omit<AISummary, "id" | "job_id" | "interview_id" | "created_at"> {
    return {
      generation_id: "demo-generation",
      overview: "本轮面试表达流畅，能说明项目背景和业务目标。需要补强的是技术决策背后的量化指标，以及异常场景下的降级策略。",
      strengths: ["项目叙事完整", "能主动连接业务目标", "回答结构比较清楚"],
      improvements: ["把优化结果量化", "准备接口失败和回滚案例", "补充监控指标和报警策略"],
      next: ["准备一个系统设计白板题", "复盘缓存和索引方案", "整理一段 2 分钟项目亮点表达"]
    };
  },
  getProvider(): AIProvider | null {
    const raw = localStorage.getItem(providerKey);
    return raw ? (JSON.parse(raw) as AIProvider) : null;
  },
  saveProvider(provider: AIProvider) {
    localStorage.setItem(providerKey, JSON.stringify(provider));
    return provider;
  },
  deleteProvider() {
    localStorage.removeItem(providerKey);
  }
};
