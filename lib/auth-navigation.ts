export function safeNextPath(value: FormDataEntryValue | string | null | undefined, fallback = "/dashboard") {
  const path = typeof value === "string" ? value.trim() : "";
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
