
import { type Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config"

const defaultPrismaClientOptions = {
  datasources: {
    db: {
      url: process.env["DATABASE_URL"] as string,
    },
  },
} satisfies Prisma.PrismaClientOptions;

export async function createClient(options = defaultPrismaClientOptions) {
  await import("dotenv/config");
  if (!process.env["DATABASE_URL"]) throw new Error("DATABASE_URL is required");

  return new PrismaClient(options).$extends(withAccelerate());
}

export const db = async () => {
  await createClient();
};
