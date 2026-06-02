import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  BriefcaseBusiness,
  CalendarPlus,
  Check,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Save,
  ScanSearch,
  Settings,
  Sparkles,
  Trash2,
  Trophy
} from "lucide-react";
import type { AIProvider, AISummary, Interview, Job, JobDraft, JobStatus, OfferDraft, RecognizedJob } from "./types";
import { useAuth } from "./lib/auth";
import { demoStore } from "./lib/demoStore";
import { displayTags, interviewResults, normalizeSalary, offerScore, parseTags, priorities, statuses, todayLabel } from "./lib/format";
import {
  addRemoteInterview,
  createRemoteJob,
  deleteRemoteJob,
  deleteRemoteProvider,
  generateRemoteSummary,
  getRemoteProvider,
  loadJobs,
  recognizeRemoteJob,
  saveRemoteOffer,
  saveRemoteProvider,
  saveRemoteSummary,
  testRemoteProvider,
  updateRemoteJob
} from "./lib/remote";

const emptyJobDraft: JobDraft = {
  company: "",
  title: "",
  city: "",
  salary_amount: "",
  salary_unit: "k",
  salary_display: "",
  source: "",
  priority: "中",
  status: "待投递",
  tags: [],
  description: ""
};

const emptyOfferDraft: OfferDraft = {
  location: "",
  total_comp_amount: "",
  total_comp_unit: "w",
  total_comp_display: "",
  work_style: "线下",
  growth: 3,
  stability: 3,
  balance: 3,
  interest: 3,
  risk: ""
};

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="center-screen">
        <Loader2 className="spin" />
        <span>正在进入 GoOffer...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={auth.user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/*" element={auth.user ? <Workspace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

function AuthPage() {
  const auth = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("demo@gooffer.app");
  const [username, setUsername] = useState("GoOffer 用户");
  const [password, setPassword] = useState("gooffer-demo");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignUp) {
        await auth.signUp(email, password, username);
      } else {
        await auth.signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "账号操作失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <span className="eyebrow">个人求职工作台</span>
        <h1>
          Go<span>Offer</span>
        </h1>
        <p>把岗位截图、投递状态、面试问题、AI 复盘和 Offer 决策收进一个清晰的工作台。</p>
        <div className="auth-points">
          <span>Supabase Auth</span>
          <span>截图识别岗位</span>
          <span>用户绑定 AI API</span>
        </div>
      </section>

      <form className="auth-card" onSubmit={submit}>
        <div>
          <h2>{isSignUp ? "注册账号" : "登录账号"}</h2>
          <p>{auth.mode === "demo" ? "当前未配置 Supabase，已启用本地演示模式。" : "使用 Supabase Auth 登录生产数据。"}</p>
        </div>
        {error && <div className="error-banner">{error}</div>}
        {isSignUp && (
          <label>
            用户名
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="你的昵称" required />
          </label>
        )}
        <label>
          邮箱
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required />
        </label>
        <label>
          密码
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={6}
            placeholder="至少 6 位"
            required
          />
        </label>
        <button className="button primary" disabled={busy} type="submit">
          {busy && <Loader2 className="spin" />}
          {isSignUp ? "创建账号" : "登录"}
        </button>
        <button className="text-button" type="button" onClick={() => setIsSignUp((value) => !value)}>
          {isSignUp ? "已有账号，去登录" : "没有账号，去注册"}
        </button>
      </form>
    </main>
  );
}

function Workspace() {
  const auth = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    if (!auth.user) return;
    setLoading(true);
    setError("");
    try {
      setJobs(auth.user.isDemo ? demoStore.listJobs() : await loadJobs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据失败。");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [auth.user?.id]);

  const actions = useMemo(
    () => ({
      refresh,
      async createJob(draft: JobDraft) {
        if (!auth.user) return;
        if (auth.user.isDemo) demoStore.createJob(draft);
        else await createRemoteJob(auth.user.id, draft);
        await refresh();
      },
      async updateJob(jobId: string, patch: Partial<JobDraft & { status: JobStatus }>) {
        if (auth.user?.isDemo) demoStore.updateJob(jobId, patch as Partial<Job>);
        else await updateRemoteJob(jobId, patch);
        await refresh();
      },
      async deleteJob(jobId: string) {
        if (auth.user?.isDemo) demoStore.deleteJob(jobId);
        else await deleteRemoteJob(jobId);
        await refresh();
      },
      async addInterview(jobId: string, interview: Omit<Interview, "id" | "job_id">) {
        const questions = interview.questions.map((item) => ({ question: item.question, answer: item.answer }));
        if (!auth.user) return;
        if (auth.user.isDemo) demoStore.addInterview(jobId, interview);
        else await addRemoteInterview(auth.user.id, jobId, interview, questions);
        await refresh();
      },
      async saveOffer(jobId: string, draft: OfferDraft) {
        if (!auth.user) return;
        if (auth.user.isDemo) demoStore.saveOffer(jobId, draft);
        else await saveRemoteOffer(auth.user.id, jobId, draft);
        await refresh();
      },
      async saveSummary(jobId: string, interviewId: string | null, summary: Omit<AISummary, "id" | "job_id" | "created_at">) {
        if (!auth.user) return;
        if (auth.user.isDemo) demoStore.saveSummary(jobId, interviewId, summary);
        else await saveRemoteSummary(auth.user.id, jobId, interviewId, summary);
        await refresh();
      },
      async recognize(file: File): Promise<RecognizedJob> {
        if (auth.user?.isDemo) return demoStore.recognize(file.name);
        return recognizeRemoteJob(file);
      },
      async generateSummary(interviewId: string) {
        if (auth.user?.isDemo) {
          return {
            generation_id: "demo-generation",
            prompt_version_id: "demo",
            summary: demoStore.generateSummary()
          };
        }
        return generateRemoteSummary(interviewId);
      }
    }),
    [auth.user]
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <strong>
            Go<span>Offer</span>
          </strong>
          <small>{auth.user?.isDemo ? "演示模式" : "Supabase 在线"}</small>
        </Link>
        <nav>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="概览" />
          <NavItem to="/jobs" icon={<BriefcaseBusiness size={20} />} label="岗位" />
          <NavItem to="/offers" icon={<Trophy size={20} />} label="Offer" />
          <NavItem to="/settings/ai" icon={<Settings size={20} />} label="AI 设置" />
        </nav>
        <div className="sidebar-user">
          <span className="avatar">{auth.user?.username?.slice(0, 2).toUpperCase() || "GO"}</span>
          <div>
            <strong>{auth.user?.username || auth.user?.email}</strong>
            <small>{auth.user?.email}</small>
          </div>
          <button className="icon-button" onClick={() => void auth.signOut()} title="退出登录" aria-label="退出登录">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="workspace">
        {error && <div className="error-banner">{error}</div>}
        {loading ? (
          <div className="center-panel">
            <Loader2 className="spin" />
            <span>正在读取求职数据...</span>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard jobs={jobs} />} />
            <Route path="/jobs" element={<JobsPage jobs={jobs} actions={actions} />} />
            <Route path="/jobs/:jobId" element={<JobDetail jobs={jobs} actions={actions} />} />
            <Route path="/offers" element={<OffersPage jobs={jobs} actions={actions} />} />
            <Route path="/settings/ai" element={<AISettings />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link className="nav-item" to={to}>
      {icon}
      {label}
    </Link>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}

function Dashboard({ jobs }: { jobs: Job[] }) {
  const interviewing = jobs.filter((job) => job.status === "面试中").length;
  const offers = jobs.filter((job) => job.status === "已拿Offer").length;
  const nextJob = jobs.find((job) => job.interviews.length) || jobs[0];
  const latestSummary = jobs.flatMap((job) => job.summaries).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  return (
    <>
      <PageHeader eyebrow={todayLabel()} title="概览" description="集中查看投递、面试和 Offer 状态。" />
      <section className="metric-grid">
        <Metric label="岗位总数" value={jobs.length} note="活跃记录" />
        <Metric label="面试中" value={interviewing} note="需要准备" highlight />
        <Metric label="收获 Offer" value={offers} note="进入对比" dark />
        <Metric label="待投递" value={jobs.filter((job) => job.status === "待投递").length} note="下一步行动" />
      </section>
      <section className="dashboard-grid">
        <article className="card ai-feature-card">
          <span className="card-icon">
            <Sparkles size={22} />
          </span>
          <h2>AI 面试复盘</h2>
          <p>{latestSummary?.overview || "记录面试问题和回答后，可以生成结构化复盘、亮点、不足和下一轮准备建议。"}</p>
          <div className="chip-row">
            {(latestSummary?.next || ["补充面试问题", "记录回答重点", "生成复盘"]).slice(0, 3).map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
          {nextJob && (
            <Link className="button dark" to={`/jobs/${nextJob.id}`}>
              查看岗位详情
            </Link>
          )}
        </article>
        <article className="card">
          <h2>投递漏斗</h2>
          <div className="funnel-list">
            {statuses.map((status) => (
              <div className="funnel-row" key={status}>
                <span>{status}</span>
                <strong>{jobs.filter((job) => job.status === status).length}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function Metric({ label, value, note, highlight, dark }: { label: string; value: number; note: string; highlight?: boolean; dark?: boolean }) {
  return (
    <article className={`metric-card ${highlight ? "highlight" : ""} ${dark ? "dark" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

type Actions = {
  refresh: () => Promise<void>;
  createJob: (draft: JobDraft) => Promise<void>;
  updateJob: (jobId: string, patch: Partial<JobDraft & { status: JobStatus }>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  addInterview: (jobId: string, interview: Omit<Interview, "id" | "job_id">) => Promise<void>;
  saveOffer: (jobId: string, draft: OfferDraft) => Promise<void>;
  saveSummary: (jobId: string, interviewId: string | null, summary: Omit<AISummary, "id" | "job_id" | "created_at">) => Promise<void>;
  recognize: (file: File) => Promise<RecognizedJob>;
  generateSummary: (interviewId: string) => Promise<{
    generation_id: string;
    prompt_version_id: string;
    summary: {
      overview: string;
      strengths: string[];
      improvements: string[];
      next: string[];
    };
  }>;
};

function JobsPage({ jobs, actions }: { jobs: Job[]; actions: Actions }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("全部");
  const visibleJobs = jobs.filter((job) => {
    const text = `${job.company} ${job.title} ${job.city} ${job.tags.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === "全部" || job.status === status);
  });

  return (
    <>
      <PageHeader
        eyebrow="Jobs"
        title="岗位"
        description="筛选、排序并更新每个岗位的投递状态。"
        action={<Link className="button primary" to="#job-form"><Plus size={18} />新增岗位</Link>}
      />
      <section className="toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索公司、岗位、城市或标签" />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>全部</option>
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>
      <section className="jobs-grid">
        {visibleJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </section>
      {!visibleJobs.length && <EmptyState title="没有匹配的岗位" description="调整筛选条件，或者新增一个岗位。" />}
      <JobForm actions={actions} />
    </>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link className="job-card" to={`/jobs/${job.id}`}>
      <div className="job-card-top">
        <span className={`logo-tile ${job.logo_tone}`}>{job.logo}</span>
        <span className={`status-badge status-${job.status}`}>{job.status}</span>
      </div>
      <h2>{job.title}</h2>
      <p>{job.company} · {job.city || "城市待定"}</p>
      <div className="chip-row">
        {job.tags.slice(0, 3).map((tag) => (
          <span className="chip" key={tag}>{tag}</span>
        ))}
      </div>
      <div className="job-card-footer">
        <strong>{job.salary_display || "薪资待定"}</strong>
        <span>{job.priority}优先级</span>
      </div>
    </Link>
  );
}

function JobForm({ actions }: { actions: Actions }) {
  const [draft, setDraft] = useState<JobDraft>(emptyJobDraft);
  const [tagText, setTagText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function patch(patchValue: Partial<JobDraft>) {
    setDraft((value) => ({ ...value, ...patchValue }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!draft.company.trim() || !draft.title.trim()) {
      setError("公司名称和岗位名称是必填项。");
      return;
    }
    setBusy(true);
    try {
      await actions.createJob({
        ...draft,
        tags: parseTags(tagText),
        salary_display: draft.salary_display || normalizeSalary(draft.salary_amount, draft.salary_unit)
      });
      setDraft(emptyJobDraft);
      setTagText("");
      setMessage("岗位已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存岗位失败。");
    } finally {
      setBusy(false);
    }
  }

  async function recognize(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("正在识别岗位截图...");
    try {
      const recognized = await actions.recognize(file);
      setDraft((value) => ({
        ...value,
        ...recognized,
        salary_unit: recognized.salary_unit || value.salary_unit,
        priority: recognized.priority || value.priority,
        status: recognized.status || value.status,
        tags: recognized.tags || value.tags
      }));
      setTagText(displayTags(recognized.tags || []));
      setMessage(`截图识别完成，置信度 ${Math.round((recognized.confidence || 0.75) * 100)}%。请核对后保存。`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "截图识别失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form id="job-form" className="card form-card" onSubmit={submit}>
      <div className="form-card-head">
        <div>
          <span className="eyebrow">新增岗位</span>
          <h2>把机会先收进来</h2>
          <p>可以手动填写，也可以上传岗位截图自动识别。</p>
        </div>
        <label className="button subtle file-button">
          <ScanSearch size={18} />
          截图识别
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void recognize(event)} />
        </label>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}
      <div className="form-grid">
        <label>公司名称<input value={draft.company} onChange={(event) => patch({ company: event.target.value })} required /></label>
        <label>岗位名称<input value={draft.title} onChange={(event) => patch({ title: event.target.value })} required /></label>
        <label>城市<input value={draft.city} onChange={(event) => patch({ city: event.target.value })} /></label>
        <label>薪资范围<input value={draft.salary_amount} onChange={(event) => patch({ salary_amount: event.target.value })} placeholder="35 - 50" /></label>
        <label>单位<select value={draft.salary_unit} onChange={(event) => patch({ salary_unit: event.target.value as "k" | "w" })}><option value="k">k</option><option value="w">w</option></select></label>
        <label>状态<select value={draft.status} onChange={(event) => patch({ status: event.target.value as JobStatus })}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>优先级<select value={draft.priority} onChange={(event) => patch({ priority: event.target.value as JobDraft["priority"] })}>{priorities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>投递渠道<input value={draft.source} onChange={(event) => patch({ source: event.target.value })} placeholder="链接或来源" /></label>
        <label className="full">标签<input value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="React，远程，高优先级" /></label>
        <label className="full">岗位要求<textarea value={draft.description} onChange={(event) => patch({ description: event.target.value })} /></label>
      </div>
      <button className="button primary" disabled={busy} type="submit">
        {busy ? <Loader2 className="spin" /> : <Save size={18} />}
        保存岗位
      </button>
    </form>
  );
}

function JobDetail({ jobs, actions }: { jobs: Job[]; actions: Actions }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((item) => item.id === jobId);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  if (!job) return <EmptyState title="没有找到岗位" description="返回岗位列表重新选择。" />;

  async function updateStatus(status: JobStatus) {
    setBusy("status");
    setError("");
    try {
      await actions.updateJob(job!.id, { status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "状态更新失败。");
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!confirm(`确认删除 ${job!.company} · ${job!.title}？关联面试和 Offer 也会删除。`)) return;
    await actions.deleteJob(job!.id);
    navigate("/jobs");
  }

  return (
    <>
      <button className="back-button" onClick={() => navigate("/jobs")}><ArrowLeft size={18} />返回岗位</button>
      <section className="detail-hero">
        <div>
          <span className={`status-badge status-${job.status}`}>{job.status}</span>
          <h1>{job.company} · {job.title}</h1>
          <p>{job.description || "暂未补充岗位要求。"}</p>
          <div className="chip-row">{job.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
        </div>
        <div className="detail-actions">
          <select value={job.status} disabled={busy === "status"} onChange={(event) => void updateStatus(event.target.value as JobStatus)}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="button dark" onClick={() => void actions.saveOffer(job.id, { ...emptyOfferDraft, location: job.city, total_comp_amount: job.salary_amount || "待定", total_comp_display: job.salary_display || "待定" })}>
            <Trophy size={18} />拿下 Offer 了吗
          </button>
          <button className="button danger" onClick={() => void remove()}><Trash2 size={18} />删除</button>
        </div>
      </section>
      {error && <div className="error-banner">{error}</div>}
      <section className="detail-grid">
        <div className="stack">
          <InterviewForm job={job} actions={actions} />
          <InterviewList job={job} actions={actions} />
        </div>
        <aside className="stack">
          <InfoCard job={job} />
          <AISummaryCard job={job} actions={actions} />
        </aside>
      </section>
    </>
  );
}

function InfoCard({ job }: { job: Job }) {
  return (
    <article className="card info-card">
      <h2>岗位概览</h2>
      <dl>
        <div><dt>城市</dt><dd>{job.city || "未填写"}</dd></div>
        <div><dt>薪资</dt><dd>{job.salary_display || "未填写"}</dd></div>
        <div><dt>渠道</dt><dd>{job.source || "手动录入"}</dd></div>
        <div><dt>优先级</dt><dd>{job.priority}</dd></div>
      </dl>
    </article>
  );
}

function InterviewForm({ job, actions }: { job: Job; actions: Actions }) {
  const [roundName, setRoundName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const roundLabel = `第${job.interviews.length + 1}轮`;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await actions.addInterview(job.id, {
        round_label: roundLabel,
        round_name: roundName || "未命名面试",
        time: new Date().toISOString(),
        duration_minutes: 60,
        result: "等待结果",
        questions: [{ id: "draft", question, answer }]
      });
      setRoundName("");
      setQuestion("");
      setAnswer("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <div className="form-card-head">
        <div>
          <span className="eyebrow">Interview</span>
          <h2>添加面试记录</h2>
        </div>
        <CalendarPlus size={24} />
      </div>
      <div className="form-grid single">
        <label>面试名称<input value={roundName} onChange={(event) => setRoundName(event.target.value)} placeholder={`${roundLabel}：技术初试`} /></label>
        <label>面试问题<textarea value={question} onChange={(event) => setQuestion(event.target.value)} required /></label>
        <label>我的回答<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} /></label>
      </div>
      <button className="button primary" disabled={busy} type="submit">{busy ? <Loader2 className="spin" /> : <Plus size={18} />}保存面试</button>
    </form>
  );
}

function InterviewList({ job, actions }: { job: Job; actions: Actions }) {
  async function generate(jobId: string, interview: Interview) {
    const result = await actions.generateSummary(interview.id);
    await actions.saveSummary(jobId, interview.id, {
      generation_id: result.generation_id,
      interview_id: interview.id,
      overview: result.summary.overview,
      strengths: result.summary.strengths,
      improvements: result.summary.improvements,
      next: result.summary.next
    });
  }

  return (
    <section className="stack">
      {job.interviews.map((interview) => (
        <article className="card interview-card" key={interview.id}>
          <div className="section-head">
            <div>
              <span className="eyebrow">{interview.round_label}</span>
              <h2>{interview.round_name}</h2>
            </div>
            <span className="status-badge">{interview.result}</span>
          </div>
          {interview.questions.map((item) => (
            <div className="qa-block" key={item.id}>
              <strong>Q：{item.question}</strong>
              <p>A：{item.answer || "暂未填写回答。"}</p>
            </div>
          ))}
          <button className="button dark" onClick={() => void generate(job.id, interview)}>
            <Bot size={18} />生成并保存 AI 总结
          </button>
        </article>
      ))}
      {!job.interviews.length && <EmptyState title="还没有面试记录" description="添加面试后，就能基于问题和回答生成 AI 复盘。" />}
    </section>
  );
}

function AISummaryCard({ job, actions }: { job: Job; actions: Actions }) {
  const latest = job.summaries[0];

  if (!latest) {
    return (
      <article className="card ai-card">
        <Sparkles size={28} />
        <h2>面试助手</h2>
        <p>当前岗位还没有总结。记录面试问题和回答后，可以生成结构化复盘。</p>
        {job.interviews[0] && (
          <button className="button primary" onClick={() => void actions.generateSummary(job.interviews[0].id).then((result) => actions.saveSummary(job.id, job.interviews[0].id, { generation_id: result.generation_id, interview_id: job.interviews[0].id, overview: result.summary.overview, strengths: result.summary.strengths, improvements: result.summary.improvements, next: result.summary.next }))}>
            生成总结
          </button>
        )}
      </article>
    );
  }

  return (
    <article className="card ai-card">
      <Sparkles size={28} />
      <h2>AI 总结</h2>
      <p>{latest.overview}</p>
      <h3>表现亮点</h3>
      <ul>{latest.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>下一轮准备</h3>
      <ul>{latest.next.map((item) => <li key={item}>{item}</li>)}</ul>
    </article>
  );
}

function OffersPage({ jobs, actions }: { jobs: Job[]; actions: Actions }) {
  const offerJobs = jobs.filter((job) => job.offer);
  const best = offerJobs.reduce<Job | null>((winner, job) => (!winner || offerScore(job.offer) > offerScore(winner.offer) ? job : winner), null);

  return (
    <>
      <PageHeader eyebrow="Offer" title="Offer 对比" description="从薪资、成长、稳定性和偏好横向比较 Offer。" />
      <section className="offers-grid">
        {offerJobs.map((job) => (
          <article className="offer-card" key={job.id}>
            {best?.id === job.id && <span className="top-choice">Top Choice</span>}
            <span className={`logo-tile ${job.logo_tone}`}>{job.logo}</span>
            <h2>{job.company}</h2>
            <p>{job.title} · {job.offer?.location}</p>
            <strong className="comp">{job.offer?.total_comp_display}</strong>
            <Rating label="成长" value={job.offer?.growth || 0} />
            <Rating label="稳定" value={job.offer?.stability || 0} />
            <Rating label="平衡" value={job.offer?.balance || 0} />
            <Rating label="兴趣" value={job.offer?.interest || 0} />
            <div className="score">综合评分 {offerScore(job.offer)}</div>
            <small>{job.offer?.risk}</small>
          </article>
        ))}
      </section>
      {!offerJobs.length && <EmptyState title="还没有 Offer" description="在岗位详情页标记拿下 Offer 后，就可以横向比较。" />}
      {jobs[0] && <OfferQuickForm jobs={jobs} actions={actions} />}
    </>
  );
}

function OfferQuickForm({ jobs, actions }: { jobs: Job[]; actions: Actions }) {
  const [jobId, setJobId] = useState(jobs[0]?.id || "");
  const [draft, setDraft] = useState<OfferDraft>(emptyOfferDraft);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await actions.saveOffer(jobId, {
        ...draft,
        total_comp_display: draft.total_comp_display || normalizeSalary(draft.total_comp_amount, draft.total_comp_unit)
      });
      setDraft(emptyOfferDraft);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <span className="eyebrow">添加 Offer</span>
      <div className="form-grid">
        <label>岗位<select value={jobId} onChange={(event) => setJobId(event.target.value)}>{jobs.map((job) => <option value={job.id} key={job.id}>{job.company} · {job.title}</option>)}</select></label>
        <label>城市<input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label>
        <label>年总包<input value={draft.total_comp_amount} onChange={(event) => setDraft({ ...draft, total_comp_amount: event.target.value })} required /></label>
        <label>单位<select value={draft.total_comp_unit} onChange={(event) => setDraft({ ...draft, total_comp_unit: event.target.value as "k" | "w" })}><option value="w">w</option><option value="k">k</option></select></label>
        <label className="full">风险点<textarea value={draft.risk} onChange={(event) => setDraft({ ...draft, risk: event.target.value })} /></label>
      </div>
      <button className="button primary" disabled={busy} type="submit"><Check size={18} />保存 Offer</button>
    </form>
  );
}

function Rating({ label, value }: { label: string; value: number }) {
  return (
    <div className="rating-row">
      <span>{label}</span>
      <div>{Array.from({ length: 5 }, (_, index) => <i className={index < value ? "filled" : ""} key={index} />)}</div>
    </div>
  );
}

function AISettings() {
  const auth = useAuth();
  const [provider, setProvider] = useState<AIProvider | null>(null);
  const [baseUrl, setBaseUrl] = useState("https://api.openai.com/v1");
  const [model, setModel] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("");
  const [supportsVision, setSupportsVision] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const value = auth.user?.isDemo ? demoStore.getProvider() : await getRemoteProvider();
        setProvider(value);
        if (value) {
          setBaseUrl(value.base_url);
          setModel(value.model);
          setSupportsVision(value.supports_vision);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "读取 AI 配置失败。");
      }
    }
    void load();
  }, [auth.user?.id]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy("save");
    setError("");
    setMessage("");
    try {
      const value = auth.user?.isDemo
        ? demoStore.saveProvider({
            provider: "openai-compatible",
            base_url: baseUrl,
            model,
            supports_vision: supportsVision,
            api_key_hint: apiKey ? `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}` : "demo"
          })
        : await saveRemoteProvider({ base_url: baseUrl, model, api_key: apiKey, supports_vision: supportsVision });
      setProvider(value);
      setApiKey("");
      setMessage("AI 配置已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存 AI 配置失败。");
    } finally {
      setBusy("");
    }
  }

  async function test() {
    setBusy("test");
    setError("");
    setMessage("");
    try {
      if (!auth.user?.isDemo) await testRemoteProvider();
      setMessage("AI 连接测试通过。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 连接测试失败。");
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    setBusy("delete");
    setError("");
    try {
      if (auth.user?.isDemo) demoStore.deleteProvider();
      else await deleteRemoteProvider();
      setProvider(null);
      setMessage("AI 配置已删除。");
    } finally {
      setBusy("");
    }
  }

  return (
    <>
      <PageHeader eyebrow="Settings" title="AI API 设置" description="用户绑定自己的 OpenAI-compatible API，服务端代理调用，浏览器不持有 Key。" />
      <section className="settings-grid">
        <form className="card form-card" onSubmit={save}>
          {error && <div className="error-banner">{error}</div>}
          {message && <div className="success-banner">{message}</div>}
          <label>Base URL<input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} required /></label>
          <label>模型<input value={model} onChange={(event) => setModel(event.target.value)} required /></label>
          <label>API Key<input value={apiKey} onChange={(event) => setApiKey(event.target.value)} type="password" placeholder={provider?.api_key_hint || "sk-..."} required={!provider} /></label>
          <label className="checkbox"><input checked={supportsVision} onChange={(event) => setSupportsVision(event.target.checked)} type="checkbox" />支持图片识别</label>
          <div className="button-row">
            <button className="button primary" disabled={busy === "save"} type="submit">{busy === "save" ? <Loader2 className="spin" /> : <Save size={18} />}保存</button>
            <button className="button subtle" disabled={!provider || busy === "test"} type="button" onClick={() => void test()}>测试连接</button>
            <button className="button danger" disabled={!provider || busy === "delete"} type="button" onClick={() => void remove()}>删除</button>
          </div>
        </form>
        <article className="card info-card">
          <h2>当前状态</h2>
          {provider ? (
            <dl>
              <div><dt>Provider</dt><dd>{provider.provider}</dd></div>
              <div><dt>模型</dt><dd>{provider.model}</dd></div>
              <div><dt>Key</dt><dd>{provider.api_key_hint}</dd></div>
              <div><dt>视觉</dt><dd>{provider.supports_vision ? "已启用" : "未启用"}</dd></div>
            </dl>
          ) : (
            <p>还没有绑定 AI API。绑定后才能使用真实截图识别和 AI 面试总结。</p>
          )}
        </article>
      </section>
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="empty-state">
      <Sparkles size={28} />
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

export default App;
