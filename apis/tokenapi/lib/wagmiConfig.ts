import { http, createConfig } from "@wagmi/core";
import {
  baseSepolia,
  blastSepolia,
  polygonMumbai,
  sepolia,
} from "@wagmi/core/chains";

export const config = createConfig({
  chains: [baseSepolia, blastSepolia, polygonMumbai, sepolia],
  transports: {
    [baseSepolia.id]: http(),
    [blastSepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [sepolia.id]: http(),
  },
});
