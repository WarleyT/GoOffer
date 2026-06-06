import type { Offer } from "../types";

export const statuses = ["待投递", "已投递", "面试中", "已拿Offer", "被拒绝", "已放弃"] as const;
export const priorities = ["高", "中", "低"] as const;
export const interviewResults = ["待面试", "等待结果", "失败", "通过"] as const;

export function parseTags(value: string) {
  return value
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function displayTags(tags: string[]) {
  return tags.join("，");
}

export function normalizeSalary(amount: string, unit: "" | "k" | "w") {
  const cleanAmount = amount.trim();
  return cleanAmount ? `RMB ${cleanAmount}${unit}` : "";
}

export function initials(company: string) {
  const clean = company.trim();
  if (!clean) return "GO";
  return clean.slice(0, 2).toUpperCase();
}

export function offerScore(offer: Offer | null) {
  if (!offer) return 0;
  return Number(((offer.growth + offer.stability + offer.balance + offer.interest) / 4).toFixed(1));
}

export function todayLabel() {
  return new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
