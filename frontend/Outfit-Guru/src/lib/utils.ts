import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type NormalizedAnalysis = {
  outfit_description: string
  positives: string[]
  negatives: string[]
  lacking_items: string[]
  llm_suggested_additions: string[]
  llm_tags: string[]
}

export type NormalizedEnhancement = {
  final_description: string
  recommendation_style: string
  confidence_level: "low" | "medium" | "high"
  items_explained: Array<{ label: string; reason: string }>
}

const sanitizeText = (value: unknown, maxLen = 800): string => {
  if (value === null || value === undefined) return ""
  const raw = String(value)
  const fenced = raw
    .replace(/^\s*`{2,3}\s*json\s*/i, "")
    .replace(/^\s*`{2,3}\s*/i, "")
    .replace(/\s*`{2,3}\s*$/i, "")

  return fenced.replace(/\s+/g, " ").trim().slice(0, maxLen)
}

const sanitizeStringArray = (value: unknown, limit = 10, itemMaxLen = 120): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => sanitizeText(entry, itemMaxLen))
    .filter(Boolean)
    .slice(0, limit)
}

const extractJsonStringField = (value: unknown, fieldName: string, maxLen = 700): string => {
  if (typeof value !== "string") return ""
  const pattern = new RegExp(`\\"${fieldName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\"\\s*:\\s*\\"((?:\\\\.|[^\\"\\\\])*)\\"`, "i")
  const match = value.match(pattern)
  if (!match?.[1]) return ""

  try {
    const unescaped = JSON.parse(`"${match[1].replace(/"/g, '\\"')}"`)
    return sanitizeText(unescaped, maxLen)
  } catch {
    return sanitizeText(match[1], maxLen)
  }
}

const tryParseObject = (value: unknown): Record<string, unknown> | null => {
  if (!value) return null

  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  if (typeof value !== "string") return null

  const trimmed = value.trim()
  const directCandidate = sanitizeText(trimmed, 10000)

  const candidates = [trimmed, directCandidate]

  const jsonBlockMatch = directCandidate.match(/\{[\s\S]*\}/)
  if (jsonBlockMatch?.[0]) {
    candidates.push(jsonBlockMatch[0])
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
      if (typeof parsed === "string") {
        const nested = JSON.parse(sanitizeText(parsed, 10000))
        if (typeof nested === "object" && nested !== null && !Array.isArray(nested)) {
          return nested as Record<string, unknown>
        }
      }
    } catch {
      continue
    }
  }

  return null
}

export const normalizeAnalysisPayload = (analysis: unknown): NormalizedAnalysis => {
  const parsed = tryParseObject(analysis)
  const fallbackDescription = sanitizeText(analysis, 700)
  const extractedDescription = extractJsonStringField(analysis, "outfit_description", 700)

  const safeDescription =
    sanitizeText(parsed?.outfit_description, 700) ||
    extractedDescription ||
    (fallbackDescription.trim().startsWith("{") ? "" : fallbackDescription) ||
    "Outfit analysis completed."

  return {
    outfit_description: safeDescription,
    positives: sanitizeStringArray(parsed?.positives),
    negatives: sanitizeStringArray(parsed?.negatives),
    lacking_items: sanitizeStringArray(parsed?.lacking_items),
    llm_suggested_additions: sanitizeStringArray(parsed?.llm_suggested_additions),
    llm_tags: sanitizeStringArray(parsed?.llm_tags, 12, 60),
  }
}

export const normalizeEnhancementPayload = (enhancement: unknown): NormalizedEnhancement => {
  const parsed = tryParseObject(enhancement)
  const fallbackDescription = sanitizeText(enhancement, 900)

  const confidenceCandidate = sanitizeText(parsed?.confidence_level ?? "medium", 16).toLowerCase()
  const confidenceLevel: "low" | "medium" | "high" =
    confidenceCandidate === "low" || confidenceCandidate === "high" ? confidenceCandidate : "medium"

  const items = Array.isArray(parsed?.items_explained)
    ? parsed?.items_explained
      .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
      .slice(0, 10)
      .map((entry) => ({
        label: sanitizeText(entry.label, 80) || "item",
        reason: sanitizeText(entry.reason, 260),
      }))
      .filter((entry) => entry.reason.length > 0)
    : []

  return {
    final_description:
      sanitizeText(parsed?.final_description, 900) ||
      fallbackDescription ||
      "Enhancement recommendations processed successfully.",
    recommendation_style: sanitizeText(parsed?.recommendation_style, 80) || "personalized style",
    confidence_level: confidenceLevel,
    items_explained: items,
  }
}
