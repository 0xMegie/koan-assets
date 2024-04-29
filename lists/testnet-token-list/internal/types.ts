import { z } from "zod";

// const TokenListItem = z.object({
//   chainId: z.number(),
//   address: z.string(),
//   name: z.string(),
//   symbol: z.string(),
//   decimals: z.number(),
//   logoURI: z.optional(z.string()),
// });

const TokenListItem = z.object({
  address: z.string(),
  chainId: z.number(),
  decimals: z.number(),
  logoURI: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const TokenList = z.array(TokenListItem);

export type TokenList = z.infer<typeof TokenList>;

export type TokenListItem = z.infer<typeof TokenListItem>;

export enum TokenStatus {
  APPROVED = "APPROVED",
  UNKNOWN = "UNKNOWN",
  DISAPPROVED = "DISAPPROVED",
}
