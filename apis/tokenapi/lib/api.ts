// import { createClient } from "../db";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { readContracts } from "@wagmi/core";
import "dotenv/config";
import { erc20Abi, type Address } from "viem";
import { web3config } from "./wagmiConfig";
import { default as defaultTokenLists } from "@koanprotocol/token-list" assert { type: "json" };
import { ChainId } from "./chainId";
import {
  getTokens as getKoanTokens,
  DEFAULT_TOKEN_LIST,
} from "@koanprotocol/token-list";

export const runtime = "edge";

// console.log("connection string", process.env["DATABASE_URL"]);
// neonConfig.webSocketConstructor = ws;
// const connectionString = process.env["DATABASE_URL"];
// const neon = new Pool({ connectionString: connectionString });
// const adapter = new PrismaNeon(neon);
// const prisma = new PrismaClient({ adapter });

export async function getTokens() {
  const tokenFromList = defaultTokenLists?.tokens.find(
    (token) => token.chainId === ChainId && token.address === address,
  );
  return tokenFromList ? tokenFromList.tokens : [];
}

export async function getToken(chainId: number, address: string) {
  const tokenFromList = defaultTokenLists.tokens.find(
    (token) => token.chainId === chainId && token.address === address,
  );
  if (tokenFromList) {
    return {
      id: `${chainId}:${tokenFromList.address}`,
      address: tokenFromList.address,
      name: tokenFromList.name,
      symbol: tokenFromList.symbol,
      decimals: tokenFromList.decimals,
      logoUrl: tokenFromList.logoURI,
      isCommon: false,
    };
  }

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
