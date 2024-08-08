import { z } from "zod";
import * as fs from "fs";
import path from "path";

// Define the token schema
const TokenListItem = z.object({
  address: z.string(),
  chainId: z.number(),
  decimals: z.number(),
  logoURI: z.string(),
  name: z.string(),
  symbol: z.string(),
});

// const TokenList = z.array(TokenListItem);

// Load token list from a JSON file
// const tokenListPath = "./path/to/tokenList.json";
// const tokenListData = fs.readFileSync(tokenListPath, "utf-8");
// const tokenList = JSON.parse(tokenListData);

// // Arrays to hold valid and invalid tokens
// const validTokens: z.infer<typeof TokenListItem>[] = [];
// const invalidTokens: any[] = [];

// // Validate each token and separate valid and invalid tokens
// tokenList.forEach((token: any) => {
//   const result = TokenListItem.safeParse(token);
//   if (result.success) {
//     validTokens.push(token);
//   } else {
//     invalidTokens.push(token);
//   }
// });

// // Save valid tokens to a new JSON file
// const validTokensPath = "./path/to/validTokenList.json";
// fs.writeFileSync(validTokensPath, JSON.stringify(validTokens, null, 2));

// // Save invalid tokens to a separate JSON file
// const invalidTokensPath = "./path/to/invalidTokenList.json";
// fs.writeFileSync(invalidTokensPath, JSON.stringify(invalidTokens, null, 2));

// console.log("Token validation complete.");
// console.log(`Valid tokens saved to: ${validTokensPath}`);
// console.log(`Invalid tokens saved to: ${invalidTokensPath}`);

async function filterbadtokens() {
  const projectRoot = path.resolve(process.cwd());
  console.log("Project root:", projectRoot);

  const tokensPath = path.resolve(projectRoot, "tokens", "base.json");
  console.log("Processing base.json");
  console.log("Tokens file path:", tokensPath);

  // Read tokens JSON
  const tokenListData = fs.readFileSync(tokensPath, "utf-8");
  const tokenList = JSON.parse(tokenListData);

  // Arrays to hold valid and invalid tokens
  const validTokens: z.infer<typeof TokenListItem>[] = [];
  const invalidTokens: any[] = [];

  // Validate each token and separate valid and invalid tokens
  tokenList.forEach((token: any) => {
    const result = TokenListItem.safeParse(token);
    if (result.success) {
      validTokens.push(token);
    } else {
      invalidTokens.push(token);
    }
  });
  fs.writeFileSync(tokensPath, JSON.stringify(validTokens, null, 2));
  //   console.log("validTokens.....", validTokens);
  console.log("invalidTokens.....", invalidTokens);
}

filterbadtokens().catch(console.error);
