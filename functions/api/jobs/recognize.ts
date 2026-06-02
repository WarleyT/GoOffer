import {
  base64FromBytes,
  callOpenAICompatible,
  decryptText,
  errorJson,
  json,
  loadProvider,
  requireUser,
  type Env
} from "../_shared";

const maxImageBytes = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

function safeParseJson(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  if (!env.AI_API_KEY_ENCRYPTION_SECRET) {
    return errorJson(500, "ENCRYPTION_NOT_CONFIGURED", "AI 加密密钥未配置。");
  }

  const provider = await loadProvider(env, user.id);
  if (!provider) return errorJson(404, "AI_PROVIDER_NOT_CONFIGURED", "请先在设置页绑定 AI API。");
  if (!provider.supports_vision) {
    return errorJson(400, "VISION_MODEL_REQUIRED", "当前绑定模型未标记为支持图片识别。");
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");
  if (!(file instanceof File)) return errorJson(400, "IMAGE_REQUIRED", "请上传岗位截图。");
  if (!allowedTypes.has(file.type)) return errorJson(400, "UNSUPPORTED_IMAGE_TYPE", "仅支持 PNG、JPG 或 WebP 图片。");
  if (file.size > maxImageBytes) return errorJson(400, "IMAGE_TOO_LARGE", "图片不能超过 10MB。");

  const startedAt = Date.now();
  try {
    const apiKey = await decryptText(
      provider.encrypted_api_key,
      provider.api_key_iv,
      env.AI_API_KEY_ENCRYPTION_SECRET
    );
    const imageBytes = new Uint8Array(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${base64FromBytes(imageBytes)}`;
    const result = await callOpenAICompatible({
      baseUrl: provider.base_url,
      apiKey,
      model: provider.model,
      messages: [
        {
          role: "system",
          content:
            "你是岗位截图 OCR 与信息抽取助手。只根据图片内容抽取信息，输出 JSON，不要输出 Markdown。字段：company,title,city,salary_amount,salary_unit,salary_display,source,tags,description,confidence,missing_fields。"
        },
        {
          role: "user",
          content: [
            { type: "text", text: "请识别这张招聘岗位截图，并按指定 JSON 字段返回。salary_unit 只能是 k 或 w；tags 是字符串数组；confidence 是 0 到 1。" },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ],
      temperature: 0.1
    });

    const parsed = safeParseJson(result.content);
    return json({
      ...parsed,
      source: parsed.source || "截图识别",
      latency_ms: Date.now() - startedAt
    });
  } catch (error) {
    return errorJson(502, "JOB_RECOGNITION_FAILED", error instanceof Error ? error.message : "岗位截图识别失败。");
  }
};
