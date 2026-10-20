// Production seed script — runs on container startup
// Seeds superadmin user and template records

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Check if already seeded
  const existingAdmin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  const existingTemplates = await prisma.template.count();

  if (existingAdmin && existingTemplates >= 8) {
    console.log("[seed] Already seeded, skipping.");
    return;
  }

  console.log("[seed] Seeding database...");

  // Super Admin — only created once, credentials come from env
  if (!existingAdmin) {
    const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
      throw new Error("[seed] No super admin exists. Set ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD.");
    }
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: await bcrypt.hash(ADMIN_PASSWORD, 12),
        name: "Super Admin",
        role: "SUPER_ADMIN",
        onboarded: true,
      },
    });
    console.log("[seed] Super admin created.");
  }

  // Templates — defaultConfig loaded from compiled JS if available
  let configs = {};
  try {
    configs = require("../src/lib/template-defaults");
  } catch {
    console.log("[seed] Template defaults not found, using empty configs.");
  }

  const templates = [
    { slug: "flavor", name: "Flavor", description: "Restoran ve kafe isletmeleri icin sicak, davetkar bir sablon.", thumbnail: "/templates/thumbnails/flavor.jpg", category: "restaurant", configKey: "flavorConfig" },
    { slug: "vertex", name: "Vertex", description: "Kurumsal ve dijital ajanslar icin profesyonel sablon.", thumbnail: "/templates/thumbnails/vertex.jpg", category: "business", configKey: "vertexConfig" },
    { slug: "showcase", name: "Showcase", description: "Yaratici profesyoneller icin portfolyo sablonu.", thumbnail: "/templates/thumbnails/showcase.jpg", category: "portfolio", configKey: "showcaseConfig" },
    { slug: "bloom", name: "Bloom", description: "Guzellik salonu ve spa isletmeleri icin zarif sablon.", thumbnail: "/templates/thumbnails/bloom.jpg", category: "guzellik", configKey: "bloomConfig" },
    { slug: "pulse", name: "Pulse", description: "Spor salonu ve fitness merkezi icin enerjik sablon.", thumbnail: "/templates/thumbnails/pulse.jpg", category: "saglik", configKey: "pulseConfig" },
    { slug: "craft", name: "Craft", description: "Blog yazarlari ve icerik ureticileri icin minimal sablon.", thumbnail: "/templates/thumbnails/craft.jpg", category: "blog", configKey: "craftConfig" },
    { slug: "zenith", name: "Zenith", description: "Otel ve tatil konaklari icin luks sablon.", thumbnail: "/templates/thumbnails/zenith.jpg", category: "otel", configKey: "zenithConfig" },
    { slug: "forge", name: "Forge", description: "Teknoloji girisimleri icin modern sablon.", thumbnail: "/templates/thumbnails/forge.jpg", category: "teknoloji", configKey: "forgeConfig" },
  ];

  for (const t of templates) {
    const defaultConfig = configs[t.configKey] || {};
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, thumbnail: t.thumbnail, category: t.category, defaultConfig, isActive: true },
      create: { slug: t.slug, name: t.name, description: t.description, thumbnail: t.thumbnail, category: t.category, defaultConfig, isActive: true },
    });
    console.log(`[seed] Template: ${t.name}`);
  }

  console.log("[seed] Done.");
}

main()
  .catch((e) => { console.error("[seed] Error:", e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
