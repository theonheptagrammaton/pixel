// Drops columns removed from the schema that `prisma db push` would refuse to
// drop on its own (data-loss guard). Safe to run repeatedly.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma
  .$executeRawUnsafe('ALTER TABLE IF EXISTS "User" DROP COLUMN IF EXISTS "plainPassword"')
  .then(() => console.log("[migrate] Legacy columns dropped."))
  .catch((e) => { console.error("[migrate] Error:", e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
