export type JobStatus = "待投递" | "已投递" | "面试中" | "已拿Offer" | "被拒绝" | "已放弃";
export type JobPriority = "高" | "中" | "低";
export type InterviewResult = "待面试" | "等待结果" | "失败" | "通过";

export type InterviewQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type Interview = {
  id: string;
  job_id: string;
  round_label: string;
  round_name: string;
  time: string;
  duration_minutes: number | null;
  result: InterviewResult;
  questions: InterviewQuestion[];
};

export type AISummary = {
  id: string;
  job_id: string;
  interview_id: string | null;
  generation_id?: string | null;
  overview: string;
  strengths: string[];
  improvements: string[];
  next: string[];
  created_at: string;
};

export type Offer = {
  id: string;
  job_id: string;
  location: string;
  total_comp_amount: string;
  total_comp_unit: "k" | "w";
  total_comp_display: string;
  work_style: string;
  growth: number;
  stability: number;
  balance: number;
  interest: number;
  risk: string;
  decision: string;
};

export type Job = {
  id: string;
  user_id?: string;
  company: string;
  title: string;
  city: string;
  salary_amount: string;
  salary_unit: "" | "k" | "w";
  salary_display: string;
  source: string;
  priority: JobPriority;
  status: JobStatus;
  tags: string[];
  description: string;
  logo: string;
  logo_tone: string;
  created_at: string;
  updated_at: string;
  interviews: Interview[];
  offer: Offer | null;
  summaries: AISummary[];
};

export type JobDraft = {
  company: string;
  title: string;
  city: string;
  salary_amount: string;
  salary_unit: "" | "k" | "w";
  salary_display: string;
  source: string;
  priority: JobPriority;
  status: JobStatus;
  tags: string[];
  description: string;
};

export type OfferDraft = {
  location: string;
  total_comp_amount: string;
  total_comp_unit: "k" | "w";
  total_comp_display: string;
  work_style: string;
  growth: number;
  stability: number;
  balance: number;
  interest: number;
  risk: string;
};

export type RecognizedJob = Partial<JobDraft> & {
  confidence?: number;
  missing_fields?: string[];
  latency_ms?: number;
};

export type AIProvider = {
  provider: string;
  base_url: string;
  model: string;
  supports_vision: boolean;
  api_key_hint: string | null;
  updated_at?: string;
};

export type AppUser = {
  id: string;
  email: string;
  username?: string;
  isDemo: boolean;
};
