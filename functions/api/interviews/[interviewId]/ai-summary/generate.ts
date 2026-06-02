import {
  callOpenAICompatible,
  decryptText,
  errorJson,
  json,
  loadProvider,
  requireUser,
  serviceClient,
  type Env
} from "../../../_shared";

function safeParseJson(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  if (!env.AI_API_KEY_ENCRYPTION_SECRET) {
    return errorJson(500, "ENCRYPTION_NOT_CONFIGURED", "AI 加密密钥未配置。");
  }

  const interviewId = String(params.interviewId || "");
  if (!interviewId) return errorJson(400, "INTERVIEW_ID_REQUIRED", "缺少面试 ID。");

  const supabase = serviceClient(env);
  const provider = await loadProvider(env, user.id);
  if (!provider) return errorJson(404, "AI_PROVIDER_NOT_CONFIGURED", "请先在设置页绑定 AI API。");

  const { data: interview, error: interviewError } = await supabase
    .from("interviews")
    .select("id, job_id, round_label, round_name, time, duration_minutes, result")
    .eq("id", interviewId)
    .eq("user_id", user.id)
    .single();

  if (interviewError || !interview) return errorJson(404, "INTERVIEW_NOT_FOUND", "没有找到这轮面试。");

  const [{ data: job }, { data: questions }, { data: promptVersion }] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, company, title, city, salary_display, source, tags, description, priority, status")
      .eq("id", interview.job_id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("interview_questions")
      .select("question, answer")
      .eq("interview_id", interviewId)
      .eq("user_id", user.id),
    supabase
      .from("prompt_versions")
      .select("id, prompt_text, temperature")
      .eq("id", "ai_summary_action_v1")
      .single()
  ]);

  if (!job) return errorJson(404, "JOB_NOT_FOUND", "没有找到关联岗位。");

  const inputSnapshot = {
    job,
    interview,
    questions: questions || []
  };
  const startedAt = Date.now();
  let generationId = "";

  try {
    const apiKey = await decryptText(
      provider.encrypted_api_key,
      provider.api_key_iv,
      env.AI_API_KEY_ENCRYPTION_SECRET
    );
    const result = await callOpenAICompatible({
      baseUrl: provider.base_url,
      apiKey,
      model: provider.model,
      messages: [
        {
          role: "system",
          content:
            promptVersion?.prompt_text ||
            "你是求职面试复盘助手。只基于用户输入输出 JSON，字段 overview, strengths, improvements, next。"
        },
        {
          role: "user",
          content: `请基于以下输入生成中文面试复盘 JSON。字段必须是 overview:string, strengths:string[], improvements:string[], next:string[]。\n${JSON.stringify(inputSnapshot)}`
        }
      ],
      temperature: Number(promptVersion?.temperature ?? 0.3)
    });

    const summary = safeParseJson(result.content);
    const { data: run } = await supabase
      .from("ai_generation_runs")
      .insert({
        user_id: user.id,
        job_id: job.id,
        interview_id: interview.id,
        prompt_version_id: promptVersion?.id || "ai_summary_action_v1",
        input_snapshot: inputSnapshot,
        output_json: summary,
        latency_ms: Date.now() - startedAt,
        token_input: result.usage?.prompt_tokens || null,
        token_output: result.usage?.completion_tokens || null,
        status: "success"
      })
      .select("id")
      .single();

    generationId = run?.id || "";

    await supabase.from("analytics_events").insert({
      user_id: user.id,
      event_name: "ai_summary_generated",
      entity_type: "interview",
      entity_id: interview.id,
      properties: { generation_id: generationId, prompt_version_id: promptVersion?.id || "ai_summary_action_v1" }
    });

    return json({
      generation_id: generationId,
      prompt_version_id: promptVersion?.id || "ai_summary_action_v1",
      summary
    });
  } catch (error) {
    await supabase.from("ai_generation_runs").insert({
      user_id: user.id,
      job_id: job.id,
      interview_id: interview.id,
      prompt_version_id: promptVersion?.id || "ai_summary_action_v1",
      input_snapshot: inputSnapshot,
      latency_ms: Date.now() - startedAt,
      status: "failed",
      error_code: "AI_SUMMARY_FAILED",
      error_message: error instanceof Error ? error.message : "AI 总结生成失败。"
    });

    return errorJson(502, "AI_SUMMARY_FAILED", error instanceof Error ? error.message : "AI 总结生成失败。");
  }
};
