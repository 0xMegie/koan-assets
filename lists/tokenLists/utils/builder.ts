import { TokenList } from "../internal/types";

export function sortTokens(tokens: TokenList): TokenList {
  return tokens.sort((t1, t2) => {
    if (t1.chainId === t2.chainId) {
      return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
    }
    return t1.chainId < t2.chainId ? -1 : 1;
  });
}
