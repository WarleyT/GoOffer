import { errorJson, json, requireUser, serviceClient, type Env } from "../_shared";

type JobBody = {
  company?: string;
  title?: string;
  city?: string;
  salary_amount?: string;
  salary_unit?: "k" | "w";
  salary_display?: string;
  source?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  description?: string;
  logo?: string;
  logo_tone?: string;
};

function initials(value: string) {
  return value.trim().slice(0, 2).toUpperCase() || "GO";
}

function normalizeBody(body: JobBody, userId: string) {
  const company = String(body.company || "").trim();
  const title = String(body.title || "").trim();
  if (!company || !title) {
    return errorJson(400, "VALIDATION_FAILED", "公司名称和岗位名称是必填项。");
  }

  return {
    user_id: userId,
    company,
    title,
    city: String(body.city || "").trim() || "未填写",
    salary_amount: String(body.salary_amount || "").trim(),
    salary_unit: body.salary_unit === "w" ? "w" : "k",
    salary_display: String(body.salary_display || "").trim(),
    source: String(body.source || "").trim() || "手动录入",
    priority: String(body.priority || "中"),
    status: String(body.status || "待投递"),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    description: String(body.description || "").trim() || "暂未补充岗位描述。",
    logo: String(body.logo || initials(company)),
    logo_tone: String(body.logo_tone || "logo-yellow")
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  const supabase = serviceClient(env);
  const [{ data: jobs, error: jobsError }, { data: interviews }, { data: questions }, { data: offers }, { data: summaries }] =
    await Promise.all([
      supabase.from("jobs").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
      supabase.from("interviews").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("interview_questions").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("offers").select("*").eq("user_id", user.id),
      supabase.from("ai_summaries").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    ]);

  if (jobsError) return errorJson(500, "JOBS_LOAD_FAILED", jobsError.message);

  return json({
    jobs: jobs || [],
    interviews: interviews || [],
    questions: questions || [],
    offers: offers || [],
    summaries: summaries || []
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorJson(400, "INVALID_JSON", "请求内容不是有效 JSON。");
  }

  const normalized = normalizeBody(body as JobBody, user.id);
  if (normalized instanceof Response) return normalized;

  const supabase = serviceClient(env);
  const { data, error } = await supabase.from("jobs").insert(normalized).select("*").single();
  if (error) return errorJson(500, "JOB_CREATE_FAILED", error.message);

  return json({ job: data }, { status: 201 });
};
