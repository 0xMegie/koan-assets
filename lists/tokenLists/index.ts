import { version } from "./package.json";
import { sortTokens } from "./utils/builder";
import base from "./tokens/base.json";
import optimism from "./tokens/optimism.json";
import sepolia from "./tokens/sepolia.json";

export function getKoanDefaultTkens() {
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
    tokens: sortTokens([...base, ...optimism, ...sepolia]),
  };
}

export * from "./constants";
