import { http, createConfig } from "@wagmi/core";
import { base, optimism, sepolia } from "@wagmi/core/chains";

const config = createConfig({
  chains: [base, optimism, sepolia],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
});
