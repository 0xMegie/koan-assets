import fs from "fs/promises";
import path from "path";
import { getAddress } from "@ethersproject/address";

interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  chainId: number;
  decimals: number;
}

const networks = ["base"];

async function updateTokenAddresses() {
  for (const network of networks) {
    const projectRoot = process.cwd();
    const tokensPath = path.join(projectRoot, `tokens/${network}.json`);

    // Read tokens JSON
    const tokensData = await fs.readFile(tokensPath, "utf-8");
    const tokens: Token[] = JSON.parse(tokensData);

    // Process each token
    for (const token of tokens) {
      try {
        // Update the address to its checksummed version
        token.address = getAddress(token.address);
      } catch (error) {
        console.error(`Invalid address for token: ${token.name}`, error);
      }
    }

    // Save updated tokens JSON
    await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
    console.log(`Updated addresses for ${network} tokens.`);
  }

  console.log("Token addresses updated and checksummed.");
}

updateTokenAddresses().catch(console.error);