import {
  encryptText,
  errorJson,
  json,
  keyHint,
  readJson,
  requireUser,
  serviceClient,
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

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  if (!env.AI_API_KEY_ENCRYPTION_SECRET) {
    return errorJson(500, "ENCRYPTION_NOT_CONFIGURED", "AI 加密密钥未配置。");
  }

  const body = await readJson<SaveProviderRequest>(request);
  if (body instanceof Response) return body;

  const baseUrl = String(body.base_url || "").trim();
  const model = String(body.model || "").trim();
  const apiKey = String(body.api_key || "").trim();
  if (!baseUrl || !model || !apiKey) {
    return errorJson(400, "VALIDATION_FAILED", "Base URL、模型和 API Key 都是必填项。");
  }

  const encrypted = await encryptText(apiKey, env.AI_API_KEY_ENCRYPTION_SECRET);
  const supabase = serviceClient(env);
  const { data, error } = await supabase
    .from("user_ai_providers")
    .upsert(
      {
        user_id: user.id,
        provider: "openai-compatible",
        base_url: baseUrl,
        model,
        supports_vision: Boolean(body.supports_vision),
        encrypted_api_key: encrypted.encrypted,
        api_key_iv: encrypted.iv,
        api_key_hint: keyHint(apiKey)
      },
      { onConflict: "user_id,provider" }
    )
    .select("provider, base_url, model, supports_vision, api_key_hint, updated_at")
    .single();

  if (error) return errorJson(500, "PROVIDER_SAVE_FAILED", "保存 AI 配置失败。");

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
