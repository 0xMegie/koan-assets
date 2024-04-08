import { default as TESTNET_TOKEN_LIST } from "../../../lists/testnet-token-list/build/koan-testnet.tokenlist.json";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    "Cache-Control",
    "s-maxage=60, stale-while-revalidate=600",
  );
  return response.status(200).json(TESTNET_TOKEN_LIST);
};

export default handler;
