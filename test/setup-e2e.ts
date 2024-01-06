import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { execSync } from "child_process";
import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/env/env";
import { Redis } from "ioredis";

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

const schemaId = randomUUID();

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId);
  process.env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
