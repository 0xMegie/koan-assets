import fs from "fs/promises";
import path from "path";

interface OriginalToken {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  chainId: number;
  decimals: number;
}

interface ReorganizedToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

async function rearrangeBaseTokens() {
  const projectRoot = path.resolve(process.cwd());
  console.log("Project root:", projectRoot);

  const tokensPath = path.resolve(projectRoot, "tokens", "base.json");
  console.log("Processing base.json");
  console.log("Tokens file path:", tokensPath);

  // Read tokens JSON
  const tokensData = await fs.readFile(tokensPath, "utf-8");
  const tokens: OriginalToken[] = JSON.parse(tokensData);

  // Reorganize each token
  const reorganizedTokens: ReorganizedToken[] = tokens.map((token) => ({
    chainId: token.chainId,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
  }));

  // Save reorganized tokens JSON
  await fs.writeFile(tokensPath, JSON.stringify(reorganizedTokens, null, 2));
  console.log(`Reorganized tokens saved to: ${tokensPath}`);

  console.log("base.json token data reorganization completed.");
}

rearrangeBaseTokens().catch(console.error);
