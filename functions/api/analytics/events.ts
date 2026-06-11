import { errorJson, json, readJson, serviceClient, userFromRequest, type Env } from "../_shared";

const allowedEvents = new Set([
  "landing_viewed",
  "login_page_viewed",
  "signup_page_viewed",
  "signup_started",
  "signup_succeeded",
  "signup_failed",
  "login_started",
  "login_succeeded",
  "login_failed",
  "page_viewed",
  "add_job_cta_viewed",
  "job_create_clicked",
  "job_created",
  "interview_created",
  "offer_created",
  "offer_compare_entry_viewed",
  "offer_compare_entry_clicked",
  "ai_provider_page_viewed",
  "ai_provider_save_clicked",
  "ai_provider_saved",
  "ai_provider_save_failed",
  "ai_provider_test_clicked",
  "ai_provider_test_succeeded",
  "ai_provider_test_failed",
  "ai_summary_entry_viewed",
  "ai_summary_requested",
  "ai_summary_generated",
  "ai_summary_failed",
  "ai_summary_saved"
]);

type AnalyticsEventRequest = {
  client_event_id?: string;
  event_name?: string;
  visitor_id?: string;
  session_id?: string;
  page_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  entity_type?: string;
  entity_id?: string;
  properties?: Record<string, unknown>;
  event_version?: number;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readJson<AnalyticsEventRequest>(request);
  if (body instanceof Response) return body;

  const eventName = text(body.event_name, 80);
  if (!eventName || !allowedEvents.has(eventName)) {
    return errorJson(400, "INVALID_EVENT_NAME", "事件名称不在允许列表中。");
  }

  if (body.client_event_id && !uuidPattern.test(body.client_event_id)) {
    return errorJson(400, "INVALID_CLIENT_EVENT_ID", "client_event_id 格式不正确。");
  }

  if (body.entity_id && !uuidPattern.test(body.entity_id)) {
    return errorJson(400, "INVALID_ENTITY_ID", "entity_id 格式不正确。");
  }

  const visitorId = text(body.visitor_id, 100);
  const sessionId = text(body.session_id, 100);
  if (!visitorId || !sessionId) {
    return errorJson(400, "ANALYTICS_ID_REQUIRED", "visitor_id 和 session_id 为必填项。");
  }

  const properties = body.properties && typeof body.properties === "object" && !Array.isArray(body.properties)
    ? body.properties
    : {};
  if (JSON.stringify(properties).length > 8192) {
    return errorJson(413, "EVENT_PROPERTIES_TOO_LARGE", "事件属性不能超过 8KB。");
  }

  const user = await userFromRequest(request, env);
  const requestWithCf = request as Request & { cf?: { country?: string } };
  const supabase = serviceClient(env);
  const { error } = await supabase.from("analytics_events").upsert(
    {
      client_event_id: body.client_event_id || null,
      user_id: user?.id || null,
      event_name: eventName,
      visitor_id: visitorId,
      session_id: sessionId,
      page_path: text(body.page_path, 500),
      referrer: text(body.referrer, 1000),
      utm_source: text(body.utm_source, 200),
      utm_medium: text(body.utm_medium, 200),
      utm_campaign: text(body.utm_campaign, 200),
      entity_type: text(body.entity_type, 80),
      entity_id: body.entity_id || null,
      properties,
      event_source: "client",
      country: text(requestWithCf.cf?.country, 2),
      event_version: Number.isInteger(body.event_version) ? body.event_version : 1
    },
    { onConflict: "client_event_id", ignoreDuplicates: true }
  );

  if (error) {
    return errorJson(500, "EVENT_WRITE_FAILED", "事件记录失败。");
  }

  return json({ accepted: true }, { status: 202 });
};
