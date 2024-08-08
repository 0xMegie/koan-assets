const Ajv = require("ajv");
const buildList = require("../build");
const schema = require("@uniswap/token-lists/src/tokenlist.schema.json");
const ajv = new Ajv({ allErrors: true });
const validator = ajv.compile(schema);

async function filterAndSaveTokens() {

  const validTokens = [];
  const invalidTokens = [];
  const defaultTokenList = buildList();

  for (const token of defaultTokenList.tokens) {
    const dummyList = {
      name: "Koan Protocol TokenList",
      timestamp: new Date().toISOString(),
      version: {
        major: 0,
        minor: 0,
        patch: 1,
      },
      tags: {},
      logoURI:
        "https://raw.githubusercontent.com/koan-protocol/tokenlist/list/logos/koanlogo-256x256.png",
      keywords: ["Koanprotocol", "default"],
      tokens: [token],
    };

    if (validator(dummyList)) {
      console.log("token passed test");
      validTokens.push(token);
    } else {
      console.log("token didn't pass the test", token);
      invalidTokens.push(token);
    }
  }

  console.log(`Filtered out ${invalidTokens.length} invalid tokens.`);
  console.log(
    `Updated token list saved with ${validTokens.length} valid tokens.`,
  );
}

filterAndSaveTokens().catch(console.error);
