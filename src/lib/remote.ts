import type { AIProvider, AISummary, Interview, InterviewQuestion, Job, JobDraft, Offer, OfferDraft, RecognizedJob } from "../types";
import { initials, normalizeSalary } from "./format";
import { authHeader, supabase } from "./supabase";

function assertSupabase() {
  if (!supabase) throw new Error("Supabase 未配置。");
  return supabase;
}

function mapJob(row: Record<string, unknown>): Job {
  return {
    id: String(row.id),
    user_id: String(row.user_id || ""),
    company: String(row.company || ""),
    title: String(row.title || ""),
    city: String(row.city || ""),
    salary_amount: String(row.salary_amount || ""),
    salary_unit: (row.salary_unit as "k" | "w") || "k",
    salary_display: String(row.salary_display || ""),
    source: String(row.source || ""),
    priority: (row.priority as Job["priority"]) || "中",
    status: (row.status as Job["status"]) || "待投递",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    description: String(row.description || ""),
    logo: String(row.logo || initials(String(row.company || ""))),
    logo_tone: String(row.logo_tone || "yellow"),
    created_at: String(row.created_at || ""),
    updated_at: String(row.updated_at || ""),
    interviews: [],
    offer: null,
    summaries: []
  };
}

function mapInterview(row: Record<string, unknown>, questions: InterviewQuestion[]): Interview {
  return {
    id: String(row.id),
    job_id: String(row.job_id),
    round_label: String(row.round_label || "第一轮"),
    round_name: String(row.round_name || ""),
    time: String(row.time || ""),
    duration_minutes: row.duration_minutes == null ? null : Number(row.duration_minutes),
    result: (row.result as Interview["result"]) || "待面试",
    questions
  };
}

function mapOffer(row: Record<string, unknown>): Offer {
  return {
    id: String(row.id),
    job_id: String(row.job_id),
    location: String(row.location || ""),
    total_comp_amount: String(row.total_comp_amount || ""),
    total_comp_unit: (row.total_comp_unit as "k" | "w") || "w",
    total_comp_display: String(row.total_comp_display || ""),
    work_style: String(row.work_style || "线下"),
    growth: Number(row.growth || 3),
    stability: Number(row.stability || 3),
    balance: Number(row.balance || 3),
    interest: Number(row.interest || 3),
    risk: String(row.risk || ""),
    decision: String(row.decision || "待决定")
  };
}

function mapSummary(row: Record<string, unknown>): AISummary {
  return {
    id: String(row.id),
    job_id: String(row.job_id),
    interview_id: row.interview_id ? String(row.interview_id) : null,
    generation_id: row.generation_id ? String(row.generation_id) : null,
    overview: String(row.overview || ""),
    strengths: Array.isArray(row.strengths) ? (row.strengths as string[]) : [],
    improvements: Array.isArray(row.improvements) ? (row.improvements as string[]) : [],
    next: Array.isArray(row.next) ? (row.next as string[]) : [],
    created_at: String(row.created_at || "")
  };
}

export async function loadJobs() {
  const client = assertSupabase();
  const [{ data: jobRows, error: jobError }, { data: interviewRows }, { data: questionRows }, { data: offerRows }, { data: summaryRows }] =
    await Promise.all([
      client.from("jobs").select("*").order("updated_at", { ascending: false }),
      client.from("interviews").select("*").order("created_at", { ascending: true }),
      client.from("interview_questions").select("*").order("created_at", { ascending: true }),
      client.from("offers").select("*"),
      client.from("ai_summaries").select("*").order("created_at", { ascending: false })
    ]);

  if (jobError) throw new Error(jobError.message);

  const questionsByInterview = new Map<string, InterviewQuestion[]>();
  (questionRows || []).forEach((row) => {
    const interviewId = String(row.interview_id);
    const item = {
      id: String(row.id),
      question: String(row.question || ""),
      answer: String(row.answer || "")
    };
    questionsByInterview.set(interviewId, [...(questionsByInterview.get(interviewId) || []), item]);
  });

  const interviewsByJob = new Map<string, Interview[]>();
  (interviewRows || []).forEach((row) => {
    const jobId = String(row.job_id);
    const item = mapInterview(row, questionsByInterview.get(String(row.id)) || []);
    interviewsByJob.set(jobId, [...(interviewsByJob.get(jobId) || []), item]);
  });

  const offerByJob = new Map<string, Offer>();
  (offerRows || []).forEach((row) => offerByJob.set(String(row.job_id), mapOffer(row)));

  const summariesByJob = new Map<string, AISummary[]>();
  (summaryRows || []).forEach((row) => {
    const jobId = String(row.job_id);
    summariesByJob.set(jobId, [...(summariesByJob.get(jobId) || []), mapSummary(row)]);
  });

  return (jobRows || []).map((row) => {
    const job = mapJob(row);
    job.interviews = interviewsByJob.get(job.id) || [];
    job.offer = offerByJob.get(job.id) || null;
    job.summaries = summariesByJob.get(job.id) || [];
    return job;
  });
}

export async function createRemoteJob(userId: string, draft: JobDraft) {
  const client = assertSupabase();
  const { data, error } = await client
    .from("jobs")
    .insert({
      user_id: userId,
      ...draft,
      salary_display: draft.salary_display || normalizeSalary(draft.salary_amount, draft.salary_unit),
      logo: initials(draft.company),
      logo_tone: "yellow"
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapJob(data);
}

export async function updateRemoteJob(jobId: string, patch: Partial<JobDraft & { status: Job["status"] }>) {
  const client = assertSupabase();
  const { error } = await client.from("jobs").update(patch).eq("id", jobId);
  if (error) throw new Error(error.message);
}

export async function deleteRemoteJob(jobId: string) {
  const client = assertSupabase();
  const { error } = await client.from("jobs").delete().eq("id", jobId);
  if (error) throw new Error(error.message);
}

export async function addRemoteInterview(
  userId: string,
  jobId: string,
  draft: Omit<Interview, "id" | "job_id">,
  questions: Array<{ question: string; answer: string }>
) {
  const client = assertSupabase();
  const { data, error } = await client
    .from("interviews")
    .insert({
      user_id: userId,
      job_id: jobId,
      round_label: draft.round_label,
      round_name: draft.round_name,
      time: draft.time || null,
      duration_minutes: draft.duration_minutes,
      result: draft.result
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const interviewId = String(data.id);
  const rows = questions
    .filter((item) => item.question.trim() || item.answer.trim())
    .map((item) => ({
      user_id: userId,
      interview_id: interviewId,
      question: item.question.trim(),
      answer: item.answer.trim()
    }));
  if (rows.length) {
    const { error: questionError } = await client.from("interview_questions").insert(rows);
    if (questionError) throw new Error(questionError.message);
  }
  await updateRemoteJob(jobId, { status: "面试中" });
}

export async function saveRemoteOffer(userId: string, jobId: string, draft: OfferDraft) {
  const client = assertSupabase();
  const { error } = await client.from("offers").upsert(
    {
      user_id: userId,
      job_id: jobId,
      ...draft,
      total_comp_display: draft.total_comp_display || normalizeSalary(draft.total_comp_amount, draft.total_comp_unit),
      decision: "待决定"
    },
    { onConflict: "user_id,job_id" }
  );
  if (error) throw new Error(error.message);
  await updateRemoteJob(jobId, { status: "已拿Offer" });
}

export async function saveRemoteSummary(
  userId: string,
  jobId: string,
  interviewId: string | null,
  summary: Omit<AISummary, "id" | "job_id" | "created_at">
) {
  const client = assertSupabase();
  const { error } = await client.from("ai_summaries").insert({
    user_id: userId,
    job_id: jobId,
    interview_id: interviewId,
    generation_id: summary.generation_id || null,
    overview: summary.overview,
    strengths: summary.strengths,
    improvements: summary.improvements,
    next: summary.next
  });
  if (error) throw new Error(error.message);
}

export async function recognizeRemoteJob(file: File): Promise<RecognizedJob> {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch("/api/jobs/recognize", {
    method: "POST",
    headers: await authHeader(),
    body: formData
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "截图识别失败。");
  return payload as RecognizedJob;
}

export async function generateRemoteSummary(interviewId: string) {
  const response = await fetch(`/api/interviews/${interviewId}/ai-summary/generate`, {
    method: "POST",
    headers: {
      ...(await authHeader()),
      "content-type": "application/json"
    },
    body: JSON.stringify({ regenerate: false })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "AI 总结失败。");
  return payload as {
    generation_id: string;
    prompt_version_id: string;
    summary: {
      overview: string;
      strengths: string[];
      improvements: string[];
      next: string[];
    };
  };
}

export async function getRemoteProvider(): Promise<AIProvider | null> {
  const response = await fetch("/api/me/ai-provider", {
    headers: await authHeader()
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "读取 AI 配置失败。");
  return payload.provider as AIProvider | null;
}

export async function saveRemoteProvider(input: {
  base_url: string;
  model: string;
  api_key: string;
  supports_vision: boolean;
}): Promise<AIProvider> {
  const response = await fetch("/api/me/ai-provider", {
    method: "PUT",
    headers: {
      ...(await authHeader()),
      "content-type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "保存 AI 配置失败。");
  return payload.provider as AIProvider;
}

export async function deleteRemoteProvider() {
  const response = await fetch("/api/me/ai-provider", {
    method: "DELETE",
    headers: await authHeader()
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "删除 AI 配置失败。");
}

export async function testRemoteProvider() {
  const response = await fetch("/api/me/ai-provider/test", {
    method: "POST",
    headers: await authHeader()
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || "AI 连接测试失败。");
}
