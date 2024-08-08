// import { createClient } from "../db";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { readContracts } from "@wagmi/core";
import "dotenv/config";
import { erc20Abi, type Address } from "viem";
import { web3config } from "./wagmiConfig";

export const runtime = "edge";

console.log("connection string", process.env["DATABASE_URL"]);
neonConfig.webSocketConstructor = ws;
const connectionString = process.env["DATABASE_URL"];
const neon = new Pool({ connectionString: connectionString });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function getTokens() {
  const tokens = await prisma.token.findMany({
    select: {
      id: true,
      address: true,
      chainId: true,
      logoUrl: true,
      name: true,
      symbol: true,
      decimals: true,
      isCommon: true,
      isFeeOnTransfer: true,
    },
    where: {
      AND: {
        status: "APPROVED",
      },
    },
  });
  await prisma.$disconnect();
  return tokens ? tokens : [];
}

export async function getToken(chainId: number, address: string) {
  try {
    const token = await prisma.token.findFirstOrThrow({
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
        logoUrl: true,
        isCommon: true,
        isFeeOnTransfer: true,
        status: true,
      },
      where: {
        chainId,
        address,
      },
    });
    await prisma.$disconnect();
    return token;
  } catch {
    await prisma.$disconnect();

    const _tokenFromContract = await readContracts(web3config, {
      allowFailure: false,
      contracts: [
        {
          address: address as Address,
          abi: erc20Abi,
          functionName: "decimals",
        },
        {
          address: address as Address,
          abi: erc20Abi,
          functionName: "symbol",
        },
        {
          address: address as Address,
          abi: erc20Abi,
          functionName: "name",
        },
      ],
    }).catch(() => {
      return undefined;
    });
    if (_tokenFromContract) {
      const [decimals, symbol, name] = _tokenFromContract;
      return {
        id: `${chainId}:${address}`,
        address: address as Address,
        chainId: Number(chainId),
        name,
        symbol,
        logoUrl: "",
        decimals,
        status: "UNKNOWN",
      };
    } else {
      throw new Error("Token not found");
    }
  }
}
