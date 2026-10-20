"use strict";
/**
 * Writes Traefik dynamic config files on every container startup.
 *
 * 1. Wildcard config  — routes *.ROOT_DOMAIN → this container (subdomains)
 * 2. Custom domains   — one config per verified custom domain from the DB
 *
 * Using the current container's network IP ensures configs are always fresh
 * after a Coolify redeploy (container gets a new IP).
 *
 * Required env vars:
 *   TRAEFIK_DYNAMIC_DIR        – directory Traefik watches for dynamic configs
 *   NEXT_PUBLIC_ROOT_DOMAIN    – e.g. "example.com"
 *   DATABASE_URL               – Prisma connection string
 *
 * Optional env vars:
 *   TRAEFIK_SERVICE_URL        – override backend URL (stable Docker DNS name)
 *   TRAEFIK_CERT_RESOLVER      – cert resolver name (default: "letsencrypt")
 */

const fs   = require("fs");
const path = require("path");
const os   = require("os");

const TRAEFIK_DIR    = process.env.TRAEFIK_DYNAMIC_DIR ?? "";
const CERT_RESOLVER  = process.env.TRAEFIK_CERT_RESOLVER ?? "letsencrypt";
const ROOT_DOMAIN    = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "").split(":")[0];

/* ── helpers ──────────────────────────────────────────────────────────── */

function getServiceUrl() {
  if (process.env.TRAEFIK_SERVICE_URL) return process.env.TRAEFIK_SERVICE_URL;
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const iface of nets[name] ?? []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return `http://${iface.address}:3000`;
      }
    }
  }
  return `http://${os.hostname()}:3000`;
}

function sanitize(s) {
  return s.replace(/[^a-z0-9]/g, "-");
}

function buildCustomDomainConfig(domain, serviceUrl) {
  const n = sanitize(domain);
  return [
    "http:",
    "  routers:",
    "    " + n + ":",
    "      rule: 'Host(`" + domain + "`)'",
    "      service: " + n + "-svc",
    "      entryPoints:",
    "        - https",
    "      tls:",
    "        certResolver: " + CERT_RESOLVER,
    "    " + n + "-http:",
    "      rule: 'Host(`" + domain + "`)'",
    "      service: " + n + "-svc",
    "      entryPoints:",
    "        - http",
    "      middlewares:",
    "        - " + n + "-redirect",
    "  middlewares:",
    "    " + n + "-redirect:",
    "      redirectScheme:",
    "        scheme: https",
    "        permanent: true",
    "  services:",
    "    " + n + "-svc:",
    "      loadBalancer:",
    "        servers:",
    "          -",
    "            url: '" + serviceUrl + "'",
  ].join("\n") + "\n";
}

function buildWildcardConfig(rootDomain, serviceUrl) {
  const n = "wildcard-" + sanitize(rootDomain);
  // Escape dots for the regex — single backslash before each dot in the regex
  const escaped = rootDomain.replace(/\./g, "\\.");
  // Use array-join + single-quoted YAML values to avoid YAML double-quote escape issues
  return [
    "http:",
    "  routers:",
    "    " + n + ":",
    "      entryPoints:",
    "        - https",
    "      service: " + n + "-svc",
    "      rule: 'HostRegexp(`^.+\\." + escaped + "`)'",
    "      tls: {}",
    "    " + n + "-http:",
    "      entryPoints:",
    "        - http",
    "      service: " + n + "-svc",
    "      rule: 'HostRegexp(`^.+\\." + escaped + "`)'",
    "  services:",
    "    " + n + "-svc:",
    "      loadBalancer:",
    "        servers:",
    "          -",
    "            url: '" + serviceUrl + "'",
  ].join("\n") + "\n";
}

/* ── main ─────────────────────────────────────────────────────────────── */

async function main() {
  if (!TRAEFIK_DIR) {
    console.log("[traefik-startup] TRAEFIK_DYNAMIC_DIR not set — skipping.");
    return;
  }

  if (!fs.existsSync(TRAEFIK_DIR)) {
    fs.mkdirSync(TRAEFIK_DIR, { recursive: true });
  }

  const serviceUrl = getServiceUrl();
  console.log(`[traefik-startup] Service URL: ${serviceUrl}`);

  const activeFiles = new Set();

  /* 1. Wildcard subdomain config ─────────────────────────────────────── */
  if (ROOT_DOMAIN && ROOT_DOMAIN !== "localhost") {
    try {
      const fileName = `_wildcard-${sanitize(ROOT_DOMAIN)}.yml`;
      activeFiles.add(fileName);
      fs.writeFileSync(
        path.join(TRAEFIK_DIR, fileName),
        buildWildcardConfig(ROOT_DOMAIN, serviceUrl),
        "utf-8"
      );
      console.log(`[traefik-startup] Wildcard config written for *.${ROOT_DOMAIN}`);
    } catch (err) {
      console.error("[traefik-startup] Failed to write wildcard config:", err);
    }
  } else {
    console.log("[traefik-startup] ROOT_DOMAIN not set or localhost — skipping wildcard.");
  }

  /* 2. Per-domain custom configs ──────────────────────────────────────── */
  let domains = [];
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    try {
      const sites = await prisma.site.findMany({
        where: { customDomain: { not: null }, domainVerified: true },
        select: { customDomain: true },
      });
      domains = sites.map((s) => s.customDomain).filter(Boolean);
    } finally {
      await prisma.$disconnect();
    }
  } catch (err) {
    console.error("[traefik-startup] DB query failed — skipping custom domain configs:", err);
    // Non-fatal: startup continues.
  }

  for (const domain of domains) {
    try {
      const fileName = `${sanitize(domain)}.yml`;
      activeFiles.add(fileName);
      fs.writeFileSync(
        path.join(TRAEFIK_DIR, fileName),
        buildCustomDomainConfig(domain, serviceUrl),
        "utf-8"
      );
      console.log(`[traefik-startup] Custom domain config written: ${domain}`);
    } catch (err) {
      console.error(`[traefik-startup] Failed to write config for ${domain}:`, err);
    }
  }

  /* 3. Remove stale files ─────────────────────────────────────────────── */
  try {
    const existing = fs.readdirSync(TRAEFIK_DIR).filter((f) => f.endsWith(".yml"));
    for (const file of existing) {
      if (!activeFiles.has(file)) {
        fs.unlinkSync(path.join(TRAEFIK_DIR, file));
        console.log(`[traefik-startup] Removed stale config: ${file}`);
      }
    }
  } catch (err) {
    console.error("[traefik-startup] Failed to clean stale configs:", err);
  }

  console.log(
    `[traefik-startup] Done — 1 wildcard + ${domains.length} custom domain config(s).`
  );
}

main().catch((err) => {
  console.error("[traefik-startup] Unexpected error:", err);
});
