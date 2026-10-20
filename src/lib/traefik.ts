import fs from "fs";
import path from "path";
import os from "os";

/**
 * Traefik dynamic config file provider (optional).
 *
 * If TRAEFIK_DYNAMIC_DIR is set, writes/removes YAML config files.
 * If not set, these functions are no-ops — custom domains still work
 * via middleware routing; SSL can be handled by Cloudflare proxy.
 */

const TRAEFIK_DIR = process.env.TRAEFIK_DYNAMIC_DIR ?? "";
const CERT_RESOLVER = process.env.TRAEFIK_CERT_RESOLVER ?? "letsencrypt";

function getServiceUrl(): string {
  if (process.env.TRAEFIK_SERVICE_URL) return process.env.TRAEFIK_SERVICE_URL;
  // Use container's actual network IP — works without DNS resolution
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const iface of (nets[name] ?? [])) {
      if (iface.family === "IPv4" && !iface.internal) {
        return `http://${iface.address}:3000`;
      }
    }
  }
  return `http://${os.hostname()}:3000`;
}

function sanitizeName(domain: string): string {
  return domain.replace(/[^a-z0-9]/g, "-");
}

function buildConfig(domain: string): string {
  const name = sanitizeName(domain);
  const svcUrl = getServiceUrl();
  // Use single-quoted YAML values to avoid escape sequence issues
  return [
    "http:",
    "  routers:",
    "    " + name + ":",
    "      rule: 'Host(`" + domain + "`)'",
    "      service: " + name + "-svc",
    "      entryPoints:",
    "        - https",
    "      tls:",
    "        certResolver: " + CERT_RESOLVER,
    "    " + name + "-http:",
    "      rule: 'Host(`" + domain + "`)'",
    "      service: " + name + "-svc",
    "      entryPoints:",
    "        - http",
    "      middlewares:",
    "        - " + name + "-redirect",
    "  middlewares:",
    "    " + name + "-redirect:",
    "      redirectScheme:",
    "        scheme: https",
    "        permanent: true",
    "  services:",
    "    " + name + "-svc:",
    "      loadBalancer:",
    "        servers:",
    "          -",
    "            url: '" + svcUrl + "'",
  ].join("\n") + "\n";
}

export async function addDomainToApplication(domain: string): Promise<void> {
  if (!TRAEFIK_DIR) return; // no-op when not configured
  try {
    if (!fs.existsSync(TRAEFIK_DIR)) {
      fs.mkdirSync(TRAEFIK_DIR, { recursive: true });
    }
    const filePath = path.join(TRAEFIK_DIR, `${sanitizeName(domain)}.yml`);
    fs.writeFileSync(filePath, buildConfig(domain), "utf-8");
  } catch (err) {
    console.error("[traefik] Failed to write config:", err);
  }
}


export async function removeDomainFromApplication(domain: string): Promise<void> {
  if (!TRAEFIK_DIR) return; // no-op when not configured
  try {
    const filePath = path.join(TRAEFIK_DIR, `${sanitizeName(domain)}.yml`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("[traefik] Failed to remove config:", err);
  }
}
