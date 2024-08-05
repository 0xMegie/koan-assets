export const ChainId = {
  SEPOLIA: 11155111,
  BASE_SEPOLIA: 84532,
  BLAST_SEPOLIA: 168587773,
  MUMBAI_TESTNET: 80001,
} as const;
export type ChainId = (typeof ChainId)[keyof typeof ChainId];

export const isChainId = (chainId: number): chainId is ChainId =>
  Object.values(ChainId).includes(chainId as ChainId);
