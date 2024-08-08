import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const schema = require("@uniswap/token-lists/src/tokenlist.schema.json");

interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  chainId: number;
  decimals: number;
}

interface TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  tags: Record<string, { name: string; description: string }>;
  timestamp: string;
  tokens: Token[];
  version: { major: number; minor: number; patch: number };
}

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validator = ajv.compile(schema);

async function filterAndSaveTokens() {
  const projectRoot = process.cwd();
  const tokensPath = path.join(projectRoot, "tokens/base.json");

  // Read tokens JSON
  const tokensData = await fs.readFile(tokensPath, "utf-8");
  const tokenList: TokenList = JSON.parse(tokensData);

  const validTokens: Token[] = [];
  const invalidTokens: Token[] = [];

  for (const token of tokenList.tokens) {
    const dummyList: TokenList = {
      ...tokenList,
      tokens: [token],
    };

    if (validator(dummyList)) {
      validTokens.push(token);
    } else {
      invalidTokens.push(token);
    }
  }

  // Update the original token list with only valid tokens
  tokenList.tokens = validTokens;

  // Save updated valid tokens list
  await fs.writeFile(tokensPath, JSON.stringify(tokenList, null, 2));

  // Save invalid tokens to a separate file
  const invalidTokensPath = path.join(
    projectRoot,
    "tokens/invalid_base_tokens.json",
  );
  await fs.writeFile(invalidTokensPath, JSON.stringify(invalidTokens, null, 2));

  console.log(`Filtered out ${invalidTokens.length} invalid tokens.`);
  console.log(
    `Updated token list saved with ${validTokens.length} valid tokens.`,
  );
  console.log(`Invalid tokens saved to ${invalidTokensPath}`);
}

filterAndSaveTokens().catch(console.error);
