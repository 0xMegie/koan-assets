export const ChainId = {
  BASE: 8453,
  OPTIMISM: 10,
  SEPOLIA: 11155111,
} as const;
export type ChainId = (typeof ChainId)[keyof typeof ChainId];

export const isChainId = (chainId: number): chainId is ChainId =>
  Object.values(ChainId).includes(chainId as ChainId);
