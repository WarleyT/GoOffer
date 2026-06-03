import {
  callOpenAICompatible,
  decryptText,
  errorJson,
  json,
  loadProvider,
  requireUser,
  type Env
} from "../_shared";

const maxHtmlChars = 180_000;
const maxTextChars = 12_000;

type RecognizedJob = {
  company: string;
  title: string;
  city: string;
  salary_amount: string;
  salary_unit: string;
  salary_display: string;
  source: string;
  priority: string;
  status: string;
  tags: string[];
  description: string;
  confidence: number;
  recognition_method?: string;
  missing_fields?: string[];
};

function normalizeLine(value: string) {
  return value
    .replace(/[|｜]/g, " ")
    .replace(/[，,]/g, "，")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  const meta = [...html.matchAll(/<meta[^>]+(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]+content=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .join("\n");
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(?:br|p|div|li|h[1-6]|section|article|tr|td|th)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeHtml(`${title}\n${meta}\n${body}`)
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter((line) => line.length > 1)
    .slice(0, 260)
    .join("\n")
    .slice(0, maxTextChars);
}

function stripHtmlInline(value: string) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeParseJson(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function detectSalary(text: string) {
  const repeatedUnit = text.match(/(?:RMB|CNY|¥|￥)?\s*(\d+(?:\.\d+)?)\s*(k|K|w|W|万|千)\s*(?:-|~|—|–|至|到)\s*(\d+(?:\.\d+)?)\s*(k|K|w|W|万|千)(?:\s*(?:\/月|\/年|月|年|薪))?/);
  if (repeatedUnit) {
    const unit = /w|W|万/.test(repeatedUnit[4] || repeatedUnit[2]) ? "w" : "k";
    return { amount: `${repeatedUnit[1]} - ${repeatedUnit[3]}`, unit };
  }

  const matched = text.match(/(?:RMB|CNY|¥|￥)?\s*(\d+(?:\.\d+)?(?:\s*(?:-|~|—|–|至|到)\s*\d+(?:\.\d+)?)?)\s*(k|K|w|W|万|万\/年|千|千\/月|k\/月|K\/月)(?:\s*(?:·?\d+\s*薪|\/月|\/年|月|年))?/);
  if (!matched) return { amount: "", unit: "k" };
  return {
    amount: matched[1].replace(/\s*(?:~|—|–|至|到|-)\s*/g, " - ").trim(),
    unit: /w|W|万/.test(matched[2]) ? "w" : "k"
  };
}

function formatSalary(amount: string, unit: string) {
  return amount ? `RMB ${amount}${unit === "w" ? "w" : "k"}` : "";
}

function salaryFromValue(value: unknown) {
  if (!value || typeof value !== "object") return { amount: "", unit: "k" };
  const node = value as Record<string, unknown>;
  const rawMin = typeof node.minValue === "number" || typeof node.minValue === "string" ? String(node.minValue) : "";
  const rawMax = typeof node.maxValue === "number" || typeof node.maxValue === "string" ? String(node.maxValue) : "";
  const rawValue = typeof node.value === "number" || typeof node.value === "string" ? String(node.value) : "";
  const unitText = typeof node.unitText === "string" ? node.unitText : "";
  const amount = rawMin && rawMax ? `${rawMin} - ${rawMax}` : rawValue;
  const unit = /year|annual|年|万|w/i.test(unitText) || Number(amount) >= 100 ? "w" : "k";
  return { amount, unit };
}

function detectCity(text: string) {
  const cities = ["北京", "上海", "深圳", "广州", "杭州", "成都", "南京", "苏州", "武汉", "西安", "厦门", "长沙", "重庆", "天津", "合肥", "远程"];
  return cities.find((city) => text.includes(city)) || "";
}

function detectTags(text: string) {
  const rules: Array<[string, RegExp]> = [
    ["React", /react/i],
    ["Vue", /vue/i],
    ["Node.js", /node/i],
    ["TypeScript", /typescript|ts\b/i],
    ["AI", /ai|人工智能|大模型|llm/i],
    ["数据", /数据|data/i],
    ["产品", /产品|pm\b/i],
    ["设计", /设计|ui|ux/i],
    ["运营", /运营/i],
    ["销售", /销售|商务|BD\b/i],
    ["远程", /远程|remote/i],
    ["实习", /实习|intern/i]
  ];
  const tags = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  return tags.length ? tags : ["链接识别"];
}

function looksLikeTitle(line: string) {
  return /工程师|开发|前端|后端|全栈|客户端|服务端|算法|测试|产品|经理|运营|设计|分析师|架构|实习|研发|顾问|专家|负责人|Java|Golang|Python|Android|iOS|C\+\+|数据|增长|HRBP|招聘|销售|商务|BD/i.test(line);
}

function looksLikeCompany(line: string) {
  return /公司|科技|集团|有限|inc\.?|ltd\.?|corp\.?|字节|腾讯|阿里|百度|美团|微软|快手|小红书|京东|网易/i.test(line);
}

function hasSalary(line: string) {
  return Boolean(detectSalary(line).amount);
}

function isJobMetaLine(line: string) {
  if (!line || hasSalary(line)) return true;
  if (/岗位职责|工作职责|职位描述|职位详情|任职要求|岗位要求|公司介绍|福利|亮点|发布|更新|收藏|立即|沟通|申请|投递|分享|举报/.test(line)) return true;
  if (/经验|学历|本科|大专|硕士|博士|校招|社招|全职|兼职|薪|待遇|五险|双休/.test(line) && !looksLikeTitle(line)) return true;
  if (detectCity(line) && line.length <= 10 && !looksLikeTitle(line)) return true;
  return false;
}

function stripTitleNoise(line: string) {
  return normalizeLine(line)
    .replace(/(?:RMB|CNY|¥|￥)?\s*\d+(?:\.\d+)?\s*(?:k|K|w|W|万|千)?\s*(?:-|~|—|–|至|到)\s*\d+(?:\.\d+)?\s*(?:k|K|w|W|万|千)(?:\s*(?:·?\d+\s*薪|\/月|\/年|月|年))?/g, "")
    .replace(/(?:RMB|CNY|¥|￥)?\s*\d+(?:\.\d+)?(?:\s*(?:-|~|—|–|至|到)\s*\d+(?:\.\d+)?)?\s*(?:k|K|w|W|万|千)(?:\s*(?:·?\d+\s*薪|\/月|\/年|月|年))?/g, "")
    .split(/[｜|]/)[0]
    .replace(/^[招聘急聘诚聘]+\s*/, "")
    .replace(/\s*(?:急招|热招|校招|社招|全职|兼职)\s*$/, "")
    .trim();
}

function titleScore(line: string, index: number) {
  const candidate = stripTitleNoise(line);
  if (!candidate || candidate.length < 2 || candidate.length > 48 || isJobMetaLine(candidate)) return -100;
  let score = 0;
  if (looksLikeTitle(candidate)) score += 80;
  if (/工程师|经理|设计师|分析师|架构师|顾问|专家|负责人|实习生/.test(candidate)) score += 20;
  if (/前端|后端|Java|Golang|Python|算法|测试|产品|运营|设计|数据|销售|商务|HRBP/i.test(candidate)) score += 18;
  if (index <= 10) score += 12 - Math.min(index, 10);
  if (hasSalary(line)) score += 8;
  if (looksLikeCompany(candidate)) score -= 25;
  if (/职责|要求|描述|介绍|福利|团队/.test(candidate)) score -= 40;
  return score;
}

function extractJobDescription(lines: string[], excluded = new Set<string>()) {
  const start = lines.findIndex((line) => /岗位职责|工作职责|职位描述|职位详情|任职要求|岗位要求|工作内容|任职资格|职位要求/i.test(line));
  const source = start >= 0 ? lines.slice(start) : lines;
  return source
    .filter((line) => !excluded.has(line))
    .filter((line) => !/^查看|^申请|^投递|^分享|^举报|^收藏/.test(line))
    .slice(0, start >= 0 ? 18 : 10)
    .join("\n")
    .slice(0, 1200);
}

function extractJsonLd(html: string) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => decodeHtml(match[1]).trim())
    .filter(Boolean);
}

function flattenJsonLd(value: unknown): unknown[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (typeof value !== "object") return [];
  const node = value as Record<string, unknown>;
  const graph = Array.isArray(node["@graph"]) ? node["@graph"].flatMap(flattenJsonLd) : [];
  return [node, ...graph];
}

function getString(value: unknown) {
  if (typeof value === "string") return stripHtmlInline(value);
  if (typeof value === "number") return String(value);
  return "";
}

function findJsonLdJob(html: string) {
  for (const raw of extractJsonLd(html)) {
    try {
      const nodes = flattenJsonLd(JSON.parse(raw));
      const job = nodes.find((node) => {
        if (!node || typeof node !== "object") return false;
        const type = (node as Record<string, unknown>)["@type"];
        const types = Array.isArray(type) ? type : [type];
        return types.some((item) => typeof item === "string" && /JobPosting/i.test(item));
      }) as Record<string, unknown> | undefined;
      if (job) return job;
    } catch {
      // Ignore malformed JSON-LD blocks from third-party pages.
    }
  }
  return null;
}

function locationFromJsonLd(value: unknown) {
  const nodes = Array.isArray(value) ? value : [value];
  for (const item of nodes) {
    if (!item || typeof item !== "object") continue;
    const address = (item as Record<string, unknown>).address;
    if (address && typeof address === "object") {
      const record = address as Record<string, unknown>;
      return getString(record.addressLocality) || getString(record.addressRegion) || getString(record.addressCountry);
    }
    const text = getString(item);
    if (text) return text;
  }
  return "";
}

function companyFromJsonLd(value: unknown) {
  if (!value || typeof value !== "object") return getString(value);
  const record = value as Record<string, unknown>;
  return getString(record.name) || getString(record.legalName);
}

function extractStructuredJob(html: string, url: string): Partial<RecognizedJob> {
  const job = findJsonLdJob(html);
  if (!job) return {};

  const salaryNode = job.baseSalary && typeof job.baseSalary === "object"
    ? (job.baseSalary as Record<string, unknown>).value || job.baseSalary
    : null;
  const salary = salaryFromValue(salaryNode);
  const description = stripHtmlInline(getString(job.description) || getString(job.responsibilities) || getString(job.qualifications)).slice(0, 1200);

  return {
    company: companyFromJsonLd(job.hiringOrganization).slice(0, 48),
    title: getString(job.title).slice(0, 60),
    city: locationFromJsonLd(job.jobLocation).slice(0, 24),
    salary_amount: salary.amount,
    salary_unit: salary.unit,
    salary_display: formatSalary(salary.amount, salary.unit),
    source: url,
    priority: "中",
    status: "待投递",
    tags: detectTags(`${job.title || ""}\n${description}`),
    description,
    recognition_method: "structured_data"
  };
}

function normalizeRecognizedJob(job: Partial<RecognizedJob>, url: string): RecognizedJob {
  const salary = job.salary_amount
    ? { amount: String(job.salary_amount), unit: job.salary_unit === "w" ? "w" : "k" }
    : detectSalary(`${job.salary_display || ""}\n${job.description || ""}`);

  return {
    company: String(job.company || "").trim().slice(0, 48),
    title: String(job.title || "").trim().slice(0, 60),
    city: String(job.city || "").trim().slice(0, 24),
    salary_amount: salary.amount,
    salary_unit: salary.unit,
    salary_display: job.salary_display || formatSalary(salary.amount, salary.unit),
    source: url,
    priority: job.priority || "中",
    status: job.status || "待投递",
    tags: Array.isArray(job.tags) && job.tags.length ? job.tags.map(String).slice(0, 8) : detectTags(`${job.title || ""}\n${job.description || ""}`),
    description: String(job.description || "").trim().slice(0, 1200),
    confidence: Number(job.confidence || 0),
    recognition_method: job.recognition_method,
    missing_fields: Array.isArray(job.missing_fields) ? job.missing_fields.map(String) : undefined
  };
}

function mergeFilledJob(primary: RecognizedJob, secondary: Partial<RecognizedJob>, url: string) {
  const filled = Object.fromEntries(
    Object.entries(secondary).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    })
  ) as Partial<RecognizedJob>;
  return normalizeRecognizedJob({ ...primary, ...filled }, url);
}

function scoreJob(job: RecognizedJob) {
  let score = 0;
  if (job.title && looksLikeTitle(job.title)) score += 0.32;
  if (job.company && !looksLikeTitle(job.company)) score += 0.22;
  if (job.salary_amount) score += 0.14;
  if (job.city) score += 0.08;
  if (job.description.length >= 80) score += 0.18;
  if (/岗位职责|工作职责|职位描述|职位详情|任职要求|岗位要求|工作内容|任职资格|职位要求/i.test(job.description)) score += 0.06;
  if (/登录|注册|首页|搜索|推荐|隐私政策|用户协议/.test(`${job.title}\n${job.company}`)) score -= 0.3;
  return Math.max(0, Math.min(0.95, score));
}

function isReliableJob(job: RecognizedJob) {
  if (!job.title || !looksLikeTitle(job.title)) return false;
  if (!job.company && !job.salary_amount && job.description.length < 100) return false;
  return scoreJob(job) >= 0.48;
}

function extractJob(text: string, url: string, structured: Partial<RecognizedJob> = {}) {
  const lines = text.split(/\r?\n/).map(normalizeLine).filter((line) => line.length > 1);
  const compact = lines.join("\n");
  const salary = detectSalary(compact);
  const title = lines
    .map((line, index) => ({ value: stripTitleNoise(line), score: titleScore(line, index) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.value || "";
  const company =
    lines.find((line) => looksLikeCompany(line) && line !== title && !looksLikeTitle(line)) ||
    lines.find((line) => line !== title && !isJobMetaLine(line) && line.length <= 36 && !looksLikeTitle(line)) ||
    "";
  const excluded = new Set([company, title].filter(Boolean));
  if (salary.amount) {
    lines.filter((line) => line.includes(salary.amount)).forEach((line) => excluded.add(line));
  }

  const guessed = normalizeRecognizedJob({
    company: company.slice(0, 48),
    title: title.slice(0, 60),
    city: detectCity(compact),
    salary_amount: salary.amount,
    salary_unit: salary.unit,
    salary_display: formatSalary(salary.amount, salary.unit),
    source: url,
    priority: "中",
    status: "待投递",
    tags: detectTags(compact),
    description: extractJobDescription(lines, excluded),
    recognition_method: "rule_fallback"
  }, url);

  const merged = mergeFilledJob(guessed, structured, url);
  merged.confidence = scoreJob(merged);
  return merged;
}

function isPrivateHost(hostname: string) {
  const lower = hostname.toLowerCase();
  return (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    /^127\./.test(lower) ||
    /^10\./.test(lower) ||
    /^192\.168\./.test(lower) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(lower) ||
    lower === "0.0.0.0" ||
    lower === "::1"
  );
}

async function extractJobWithAi(env: Env, userId: string, pageText: string, url: string) {
  if (!env.AI_API_KEY_ENCRYPTION_SECRET) return null;
  const provider = await loadProvider(env, userId);
  if (!provider) return null;

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
          "你是招聘链接岗位信息抽取助手。只从用户提供的网页正文抽取一个主岗位，不要使用推荐岗位、导航、广告或登录注册文案。输出 JSON，不要 Markdown。字段：company,title,city,salary_amount,salary_unit,salary_display,source,tags,description,confidence,missing_fields。description 必须保留岗位职责、任职要求或 JD 正文；salary_unit 只能是 k 或 w；confidence 是 0 到 1。若网页正文不是岗位详情页或信息不足，confidence 低于 0.45 并在 missing_fields 说明。"
      },
      {
        role: "user",
        content: `URL: ${url}\n\n网页正文：\n${pageText.slice(0, 9000)}`
      }
    ],
    temperature: 0.1
  });

  const parsed = normalizeRecognizedJob(safeParseJson(result.content), url);
  parsed.recognition_method = "ai_link_text";
  parsed.confidence = Math.max(Math.min(Number(parsed.confidence || 0), 0.95), scoreJob(parsed));
  return parsed;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  const body = await request.json().catch(() => null);
  const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return errorJson(400, "INVALID_URL", "请输入有效的招聘链接。");
  }

  if (!["http:", "https:"].includes(url.protocol) || isPrivateHost(url.hostname)) {
    return errorJson(400, "UNSUPPORTED_URL", "仅支持公开的 http/https 招聘链接。");
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "accept": "text/html,application/xhtml+xml",
        "user-agent": "GoOfferBot/1.0 (+https://gooffer.pages.dev)"
      },
      redirect: "follow"
    });
    if (!response.ok) return errorJson(502, "LINK_FETCH_FAILED", `招聘页面读取失败：${response.status}`);

    const html = (await response.text()).slice(0, maxHtmlChars);
    const text = stripHtml(html);
    if (text.length < 40) {
      return errorJson(422, "LINK_TEXT_TOO_SHORT", "页面公开文本太少，建议复制招聘页正文后粘贴识别。");
    }

    const structured = extractStructuredJob(html, url.toString());
    const ruleJob = extractJob(text, url.toString(), structured);
    let recognized = ruleJob;

    try {
      const aiJob = await extractJobWithAi(env, user.id, text, url.toString());
      if (aiJob && isReliableJob(aiJob)) {
        recognized = aiJob;
      }
    } catch {
      // Keep deterministic extraction available when the user's AI provider is unavailable.
    }

    if (!isReliableJob(recognized)) {
      return errorJson(
        422,
        "LINK_RECOGNITION_UNRELIABLE",
        "这个链接没有抓到可靠的岗位详情。很多招聘站会隐藏正文或返回推荐/登录页，请复制岗位详情页正文后粘贴识别。"
      );
    }

    return json(recognized);
  } catch (error) {
    return errorJson(502, "LINK_RECOGNITION_FAILED", error instanceof Error ? error.message : "招聘链接识别失败。");
  }
};
