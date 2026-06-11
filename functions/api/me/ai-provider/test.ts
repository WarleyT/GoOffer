import {
  callOpenAICompatible,
  decryptText,
  errorJson,
  json,
  loadProvider,
  recordEvent,
  requireUser,
  type Env
} from "../../_shared";

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  if (!env.AI_API_KEY_ENCRYPTION_SECRET) {
    return errorJson(500, "ENCRYPTION_NOT_CONFIGURED", "AI 加密密钥未配置。");
  }

  const provider = await loadProvider(env, user.id);
  if (!provider) return errorJson(404, "AI_PROVIDER_NOT_CONFIGURED", "请先绑定 AI API。");

  try {
    const apiKey = await decryptText(
      provider.encrypted_api_key,
      provider.api_key_iv,
      env.AI_API_KEY_ENCRYPTION_SECRET
    );
    await callOpenAICompatible({
      baseUrl: provider.base_url,
      apiKey,
      model: provider.model,
      messages: [
        { role: "system", content: "只输出 JSON。" },
        { role: "user", content: "返回 {\"ok\":true}" }
      ],
      temperature: 0
    });

    waitUntil(recordEvent(env, {
      userId: user.id,
      name: "ai_provider_test_succeeded",
      entityType: "ai_provider",
      properties: {
        provider: provider.provider,
        model: provider.model
      }
    }));

    return json({ ok: true });
  } catch (error) {
    waitUntil(recordEvent(env, {
      userId: user.id,
      name: "ai_provider_test_failed",
      entityType: "ai_provider",
      properties: {
        provider: provider.provider,
        model: provider.model,
        error_code: "AI_PROVIDER_TEST_FAILED"
      }
    }));

    return errorJson(502, "AI_PROVIDER_TEST_FAILED", error instanceof Error ? error.message : "AI 连接测试失败。");
  }
};
