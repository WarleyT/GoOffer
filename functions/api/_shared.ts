import { createClient } from "@supabase/supabase-js";

export type Env = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  AI_API_KEY_ENCRYPTION_SECRET?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

export type User = {
  id: string;
  email?: string;
};

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init.headers
    }
  });
}

export function errorJson(status: number, code: string, message: string) {
  return json({ error: { code, message } }, { status });
}

export function requireEnv(env: Env) {
  const missing = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "AI_API_KEY_ENCRYPTION_SECRET"
  ].filter((key) => !env[key as keyof Env]);

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

export function serviceClient(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service configuration is missing.");
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

export async function requireUser(request: Request, env: Env): Promise<User | Response> {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return errorJson(500, "SUPABASE_NOT_CONFIGURED", "Supabase 环境变量未配置。");
  }

  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return errorJson(401, "UNAUTHORIZED", "请先登录。");
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return errorJson(401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
  }

  return {
    id: data.user.id,
    email: data.user.email || undefined
  };
}

export function base64FromBytes(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

export function bytesFromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function encryptionKey(secret: string) {
  const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", material, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptText(value: string, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(value)
  );

  return {
    encrypted: base64FromBytes(new Uint8Array(encrypted)),
    iv: base64FromBytes(iv)
  };
}

export async function decryptText(encrypted: string, iv: string, secret: string) {
  const key = await encryptionKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytesFromBase64(iv) },
    key,
    bytesFromBase64(encrypted)
  );

  return new TextDecoder().decode(decrypted);
}

export function keyHint(apiKey: string) {
  const trimmed = apiKey.trim();
  if (trimmed.length <= 8) return "已保存";
  return `${trimmed.slice(0, 3)}...${trimmed.slice(-4)}`;
}

export function normalizeBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
}

export function validateProviderBaseUrl(baseUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error("Base URL 不是有效网址。");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Base URL 必须使用 HTTPS。");
  }
  if (parsed.username || parsed.password) {
    throw new Error("Base URL 不能包含账号或密码。");
  }
  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const blockedHost = hostname === "localhost"
    || hostname === "::1"
    || hostname === "0.0.0.0"
    || hostname.endsWith(".local")
    || hostname.startsWith("::ffff:127.")
    || hostname.startsWith("::ffff:10.")
    || hostname.startsWith("::ffff:192.168.")
    || hostname.startsWith("fc")
    || hostname.startsWith("fd")
    || hostname.startsWith("fe8")
    || hostname.startsWith("fe9")
    || hostname.startsWith("fea")
    || hostname.startsWith("feb")
    || /^127\./.test(hostname)
    || /^10\./.test(hostname)
    || /^192\.168\./.test(hostname)
    || /^169\.254\./.test(hostname)
    || /^100\.(6[4-9]|[789]\d|1[01]\d|12[0-7])\./.test(hostname)
    || /^198\.(1[89])\./.test(hostname)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
  if (blockedHost) {
    throw new Error("Base URL 不允许指向本机或私有网络。");
  }
  return parsed.toString().replace(/\/+$/, "");
}

export async function readJson<T>(request: Request): Promise<T | Response> {
  try {
    return (await request.json()) as T;
  } catch {
    return errorJson(400, "INVALID_JSON", "请求体不是合法 JSON。");
  }
}

export async function loadProvider(env: Env, userId: string) {
  const supabase = serviceClient(env);
  const { data, error } = await supabase
    .from("user_ai_providers")
    .select("provider, base_url, model, supports_vision, encrypted_api_key, api_key_iv")
    .eq("user_id", userId)
    .eq("provider", "openai-compatible")
    .single();

  if (error || !data) return null;

  return data as {
    provider: string;
    base_url: string;
    model: string;
    supports_vision: boolean;
    encrypted_api_key: string;
    api_key_iv: string;
  };
}

export async function callOpenAICompatible(args: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: unknown[];
  temperature?: number;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  let response: Response;
  try {
    const safeBaseUrl = validateProviderBaseUrl(args.baseUrl);
    response = await fetch(`${normalizeBaseUrl(safeBaseUrl)}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${args.apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: args.model,
        messages: args.messages,
        temperature: args.temperature ?? 0.3,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("AI 服务响应超时，请稍后重试。");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || "AI 服务调用失败。";
    throw new Error(message);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("AI 服务返回为空。");
  }

  return {
    content,
    usage: payload?.usage || null
  };
}
