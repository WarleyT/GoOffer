import {
  encryptText,
  errorJson,
  json,
  keyHint,
  recordEvent,
  readJson,
  requireUser,
  serviceClient,
  validateProviderBaseUrl,
  type Env
} from "../_shared";

type SaveProviderRequest = {
  base_url?: string;
  model?: string;
  api_key?: string;
  supports_vision?: boolean;
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  const supabase = serviceClient(env);
  const { data, error } = await supabase
    .from("user_ai_providers")
    .select("provider, base_url, model, supports_vision, api_key_hint, updated_at")
    .eq("user_id", user.id)
    .eq("provider", "openai-compatible")
    .maybeSingle();

  if (error) return errorJson(500, "PROVIDER_LOAD_FAILED", "读取 AI 配置失败。");
  return json({ provider: data || null });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  if (!env.AI_API_KEY_ENCRYPTION_SECRET) {
    return errorJson(500, "ENCRYPTION_NOT_CONFIGURED", "AI 加密密钥未配置。");
  }

  const body = await readJson<SaveProviderRequest>(request);
  if (body instanceof Response) return body;

  let baseUrl = String(body.base_url || "").trim();
  const model = String(body.model || "").trim();
  const apiKey = String(body.api_key || "").trim();
  if (!baseUrl || !model) {
    return errorJson(400, "VALIDATION_FAILED", "Base URL 和模型是必填项。");
  }
  try {
    baseUrl = validateProviderBaseUrl(baseUrl);
  } catch (error) {
    return errorJson(400, "INVALID_BASE_URL", error instanceof Error ? error.message : "Base URL 无效。");
  }

  const supabase = serviceClient(env);
  const { data: existing } = await supabase
    .from("user_ai_providers")
    .select("encrypted_api_key, api_key_iv, api_key_hint")
    .eq("user_id", user.id)
    .eq("provider", "openai-compatible")
    .maybeSingle();

  if (!apiKey && !existing) {
    return errorJson(400, "API_KEY_REQUIRED", "首次绑定必须填写 API Key。");
  }

  const encrypted = apiKey
    ? await encryptText(apiKey, env.AI_API_KEY_ENCRYPTION_SECRET)
    : null;
  const { data, error } = await supabase
    .from("user_ai_providers")
    .upsert(
      {
        user_id: user.id,
        provider: "openai-compatible",
        base_url: baseUrl,
        model,
        supports_vision: Boolean(body.supports_vision),
        encrypted_api_key: encrypted?.encrypted || existing?.encrypted_api_key,
        api_key_iv: encrypted?.iv || existing?.api_key_iv,
        api_key_hint: apiKey ? keyHint(apiKey) : existing?.api_key_hint
      },
      { onConflict: "user_id,provider" }
    )
    .select("provider, base_url, model, supports_vision, api_key_hint, updated_at")
    .single();

  if (error) return errorJson(500, "PROVIDER_SAVE_FAILED", "保存 AI 配置失败。");

  waitUntil(recordEvent(env, {
    userId: user.id,
    name: "ai_provider_saved",
    entityType: "ai_provider",
    properties: {
      provider: data.provider,
      model: data.model,
      supports_vision: data.supports_vision
    }
  }));

  return json({ provider: data });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  const supabase = serviceClient(env);
  const { error } = await supabase
    .from("user_ai_providers")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", "openai-compatible");

  if (error) return errorJson(500, "PROVIDER_DELETE_FAILED", "删除 AI 配置失败。");
  return json({ ok: true });
};
