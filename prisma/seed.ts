import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  flavorConfig,
  vertexConfig,
  showcaseConfig,
  bloomConfig,
  pulseConfig,
  craftConfig,
  zenithConfig,
  forgeConfig,
} from "../src/lib/template-defaults";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Super Admin — credentials come from env, never from source
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminUsername || !adminPassword) {
    throw new Error("ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD must be set to seed the super admin.");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      password: hashedPassword,
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      onboarded: true,
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      onboarded: true,
    },
  });
  console.log(`Super admin: ${admin.username}`);

  // Templates
  const templates = [
    {
      slug: "flavor",
      name: "Flavor",
      description: "Restoran ve kafe isletmeleri icin sicak, davetkar bir sablon.",
      thumbnail: "/templates/thumbnails/flavor.jpg",
      category: "restaurant",
      defaultConfig: flavorConfig as unknown as object,
    },
    {
      slug: "vertex",
      name: "Vertex",
      description: "Kurumsal ve dijital ajanslar icin profesyonel, guven veren bir sablon.",
      thumbnail: "/templates/thumbnails/vertex.jpg",
      category: "business",
      defaultConfig: vertexConfig as unknown as object,
    },
    {
      slug: "showcase",
      name: "Showcase",
      description: "Yaratici profesyoneller ve sanatcilar icin sade, etkileyici portfolyo sablonu.",
      thumbnail: "/templates/thumbnails/showcase.jpg",
      category: "portfolio",
      defaultConfig: showcaseConfig as unknown as object,
    },
    {
      slug: "bloom",
      name: "Bloom",
      description: "Guzellik salonu, spa ve wellness isletmeleri icin zarif ve davetkar bir sablon.",
      thumbnail: "/templates/thumbnails/bloom.jpg",
      category: "guzellik",
      defaultConfig: bloomConfig as unknown as object,
    },
    {
      slug: "pulse",
      name: "Pulse",
      description: "Spor salonu, fitness merkezi ve saglik kulubu icin enerjik, guclu bir sablon.",
      thumbnail: "/templates/thumbnails/pulse.jpg",
      category: "saglik",
      defaultConfig: pulseConfig as unknown as object,
    },
    {
      slug: "craft",
      name: "Craft",
      description: "Blog yazarlari, icerik ureticileri ve kisisel markalar icin minimal, okunakli bir sablon.",
      thumbnail: "/templates/thumbnails/craft.jpg",
      category: "blog",
      defaultConfig: craftConfig as unknown as object,
    },
    {
      slug: "zenith",
      name: "Zenith",
      description: "Otel, butik otel ve tatil konaklari icin luks, sofistike bir sablon.",
      thumbnail: "/templates/thumbnails/zenith.jpg",
      category: "otel",
      defaultConfig: zenithConfig as unknown as object,
    },
    {
      slug: "forge",
      name: "Forge",
      description: "Teknoloji girisimleri ve dijital ajanslari icin modern, keskin bir sablon.",
      thumbnail: "/templates/thumbnails/forge.jpg",
      category: "teknoloji",
      defaultConfig: forgeConfig as unknown as object,
    },
  ];

  for (const t of templates) {
    const result = await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        thumbnail: t.thumbnail,
        category: t.category,
        defaultConfig: t.defaultConfig,
        isActive: true,
      },
      create: { ...t, isActive: true },
    });
    console.log(`Template upserted: ${result.name} (${result.slug})`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
