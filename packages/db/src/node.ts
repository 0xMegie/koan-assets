import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;
const connectionString = process.env["DATABASE_URL"];
console.log("connection string", process.env["DATABASE_URL"]);

const neon = new Pool({ connectionString: connectionString });
const adapter = new PrismaNeon(neon);

// export const NeonClient = new PrismaClient({ adapter });

export async function NeonClient() {
  if (!process.env["DATABASE_URL"]) throw new Error("DATABASE_URL is required");
  //@ts-ignore
  const prisma = new PrismaClient({ adapter });
  return prisma;
}
