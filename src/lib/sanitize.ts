/**
 * Strip non-subdomain chars, lowercase, max 63
 */
export function sanitizeSubdomain(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 63);
}

/**
 * Remove script tags and on* event handler attributes from HTML strings.
 * NOT a full XSS sanitizer — use server-side escaping + CSP for that.
 */
export function stripHtml(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "")
    .trim();
}

const RESERVED_SUBDOMAINS = new Set([
  "app", "www", "api", "admin", "mail", "ftp", "smtp", "pop", "imap",
  "blog", "shop", "store", "help", "support", "docs", "status", "cdn",
  "static", "assets", "media", "img", "images", "dev", "staging", "test",
  "demo", "beta", "preview", "dashboard", "panel", "my", "account", "auth",
  "login", "register", "signup", "billing", "pay", "checkout",
]);

const SUBDOMAIN_REGEX = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$|^[a-z0-9]{1,2}$/;

export interface SubdomainValidation {
  valid: boolean;
  reason?: string;
}

export function validateSubdomain(value: string): SubdomainValidation {
  if (!value) return { valid: false, reason: "Subdomain bos olamaz." };
  if (value.length < 3) return { valid: false, reason: "En az 3 karakter olmalidir." };
  if (value.length > 63) return { valid: false, reason: "En fazla 63 karakter olmalidir." };
  if (!/^[a-z0-9]/.test(value)) return { valid: false, reason: "Harf veya rakamla baslamalidir." };
  if (!/[a-z0-9]$/.test(value)) return { valid: false, reason: "Harf veya rakamla bitmalidir." };
  if (!/^[a-z0-9-]+$/.test(value)) return { valid: false, reason: "Sadece harf, rakam ve tire kullanilabilir." };
  if (RESERVED_SUBDOMAINS.has(value)) return { valid: false, reason: "Bu adres rezerve edilmistir." };
  void SUBDOMAIN_REGEX; // kept for reference
  return { valid: true };
}

/* ── Domain validation ─────────────────────────────── */

const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

export interface DomainValidation {
  valid: boolean;
  reason?: string;
}

export function validateDomain(value: string): DomainValidation {
  if (!value) return { valid: false, reason: "Domain bos olamaz." };
  const domain = value.toLowerCase().trim();
  if (domain.length > 253) return { valid: false, reason: "Domain cok uzun." };
  if (!DOMAIN_REGEX.test(domain))
    return { valid: false, reason: "Gecerli bir domain adresi girin (orn. example.com)." };
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").split(":")[0];
  if (domain === rootDomain || domain.endsWith(`.${rootDomain}`)) {
    return { valid: false, reason: "Bu domain kullanilamaz." };
  }
  return { valid: true };
}
