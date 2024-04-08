const { version } = require("../package.json");
const { sortTokens } = require("builder");

//token imports
const baseTestnet = require("../tokens/base-sepolia.json");
const mumbaiTestnet = require("../tokens/mumbai-testnet.json");
const blastTestnet = require("../tokens/blast-sepolia.json");
const sepolia = require("../tokens/sepolia.json");

//build
module.exports = function buildList() {
  const parsed = version.split(".");
  return {
    name: "Koan Protocol TokenList",
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2],
    },
    tags: {},
    logoURI:
      "https://raw.githubusercontent.com/koan-protocol/tokenlist/list/logos/koanlogo-256x256.png",
    keywords: ["Koanprotocol", "default"],
    tokens: sortTokens([
      ...baseTestnet,
      ...mumbaiTestnet,
      ...blastTestnet,
      ...sepolia,
    ]),
  };
};
