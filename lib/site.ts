const fallbackSiteUrl = "https://nexo.formawebsite.com";

function toSiteUrl(value: string | undefined) {
  try {
    return new URL(value ?? fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export const siteUrl = toSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const siteName = "Nexo";
export const siteDescription =
  "A complete, written-first Spanish course for serious beginners. Learn general Latin American Spanish through clear explanations, deliberate practice, and a visible path to the finish.";
export const sourceRepositoryUrl =
  process.env.NEXT_PUBLIC_SOURCE_REPOSITORY_URL ?? "https://github.com/almendron02/nexo";
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "angelo.mgleza@gmail.com";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
