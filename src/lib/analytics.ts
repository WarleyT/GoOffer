import { authHeader } from "./supabase";

type TrackOptions = {
  entityType?: string;
  entityId?: string;
  properties?: Record<string, unknown>;
};

const visitorKey = "gooffer_visitor_id";
const sessionKey = "gooffer_session_id";

function storedId(storage: Storage, key: string) {
  let value = storage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    storage.setItem(key, value);
  }
  return value;
}

function campaignParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign")
  };
}

export async function track(eventName: string, options: TrackOptions = {}) {
  if (typeof window === "undefined") return;

  const campaign = campaignParams();
  try {
    await fetch("/api/analytics/events", {
      method: "POST",
      keepalive: true,
      headers: {
        "content-type": "application/json",
        ...(await authHeader())
      },
      body: JSON.stringify({
        client_event_id: crypto.randomUUID(),
        event_name: eventName,
        visitor_id: storedId(window.localStorage, visitorKey),
        session_id: storedId(window.sessionStorage, sessionKey),
        page_path: `${window.location.pathname}${window.location.search}`,
        referrer: document.referrer || null,
        ...campaign,
        entity_type: options.entityType,
        entity_id: options.entityId,
        properties: options.properties || {},
        event_version: 1
      })
    });
  } catch {
    // Analytics must never block the product workflow.
  }
}

export function trackDetached(eventName: string, options: TrackOptions = {}) {
  void track(eventName, options);
}
