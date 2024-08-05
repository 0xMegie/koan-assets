
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import { readContracts } from "@wagmi/core";

import "dotenv/config";
import { erc20Abi, type Address } from "viem";
import { NeonClient } from "@koan/tokenlistdb";

export const runtime = "edge";

export async function getTokens() {
  // const db = await createClient();

  const tokens = await prisma.token.findMany({
    select: {
      id: true,
      address: true,
      chainId: true,
      logoUrl: true,
      name: true,
      symbol: true,
      decimals: true,
      isCommon: true,
      isFeeOnTransfer: true,
    },
    where: {
      AND: {
        status: "APPROVED",
      },
    },
  });
  await prisma.$disconnect();
  return tokens ? tokens : [];
}

export async function getToken(chainId: number, address: string) {
  // TODO: example to include default list token
  const tokenFromList = defaultTokenLists.tokens.find(
    (token) => token.chainId === chainId && token.address === address,
  );
  if (tokenFromList) {
    return {
      id: `${chainId}:${tokenFromList.address}`,
      address: tokenFromList.address,
      name: tokenFromList.name,
      symbol: tokenFromList.symbol,
      decimals: tokenFromList.decimals,
      logoUrl: tokenFromList.logoURI,
      isCommon: false,
    };
  }

  try {
    const token = await prisma.token.findFirstOrThrow({
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
        logoUrl: true,
        isCommon: true,
        isFeeOnTransfer: true,
        status: true,
      },
      where: {
        chainId,
        address,
      },
    });
    await prisma.$disconnect();
    return token;
  } catch {
    await prisma.$disconnect();

    const _tokenFromContract = await readContracts(config, {
      allowFailure: false,
      contracts: [
        {
          address: address as Address,
          abi: erc20Abi,
          functionName: "decimals",
        },
        {
          address: address as Address,
          abi: erc20Abi,
          functionName: "symbol",
        },
        {
          address: address as Address,
          abi: erc20Abi,
          functionName: "name",
        },
      ],
    }).catch(() => {
      return undefined;
    });
    if (_tokenFromContract) {
      const [decimals, symbol, name] = _tokenFromContract;
      return {
        id: `${chainId}:${address}`,
        address: address as Address,
        chainId: Number(chainId),
        name,
        symbol,
        logoUrl: "",
        decimals,
        status: "UNKNOWN",
      };
    } else {
      throw new Error("Token not found");
    }
  }
}

// export async function getTokenIdsByChainId(chainId: number) {
//   const db = await createClient();
//   const ids = await db.token.findMany({
//     select: {
//       id: true,
//     },
//     where: {
//       AND: {
//         chainId,
//         status: "APPROVED",
//       },
//     },
//   });
//   await db.$disconnect();
//   return ids ? ids : [];
// }

// export async function getTokenAddressesByChainId(chainId: number) {
//   const db = await createClient();
//   const addresses = await db.token.findMany({
//     select: {
//       address: true,
//     },
//     where: {
//       AND: {
//         chainId,
//         status: "APPROVED",
//       },
//     },
//   });
//   await db.$disconnect();
//   return addresses ? addresses : [];
// }

// export async function getTokensByChainId(chainId: number) {
//   const db = await createClient();
//   const tokens = await db.token.findMany({
//     select: {
//       id: true,
//       address: true,
//       name: true,
//       symbol: true,
//       decimals: true,
//       isCommon: true,
//       isFeeOnTransfer: true,
//     },
//     where: {
//       AND: {
//         chainId,
//         status: "APPROVED",
//       },
//     },
//   });
//   await db.$disconnect();
//   return tokens ? tokens : [];
// }

// // export async function getPopularTokens(chainId: number) {
// //   const approvedTokens = await db.token.findMany({
// //     select: {
// //       id: true,
// //       address: true,
// //       name: true,
// //       symbol: true,
// //       decimals: true,
// //       isCommon: true,
// //       isFeeOnTransfer: true,
// //       pools0: {
// //         select: {
// //           liquidityUSD: true,
// //         },
// //         where: {
// //           isWhitelisted: true,
// //           liquidityUSD: {
// //             gt: 50,
// //           },
// //         },
// //       },
// //       pools1: {
// //         select: {
// //           liquidityUSD: true,
// //         },
// //         where: {
// //           isWhitelisted: true,
// //           liquidityUSD: {
// //             gt: 50,
// //           },
// //         },
// //       },
// //     },
// //     where: {
// //       chainId,
// //       status: "APPROVED",
// //     },
// //   });

// //   const filteredTokens = approvedTokens
// //     .map((token) => {
// //       const liquidity =
// //         token.pools0.reduce((a, b) => a + Number(b.liquidityUSD) / 2, 0) +
// //         token.pools1.reduce((a, b) => a + Number(b.liquidityUSD) / 2, 0);
// //       return {
// //         id: token.id,
// //         address: token.address,
// //         name: token.name,
// //         symbol: token.symbol,
// //         decimals: token.decimals,
// //         isCommon: token.isCommon,
// //         isFeeOnTransfer: token.isFeeOnTransfer,
// //         liquidityUSD: Number(liquidity.toFixed(0)),
// //       };
// //     })
// //     .sort((a, b) => b.liquidityUSD - a.liquidityUSD)
// //     .slice(0, 10);

// //   await db.$disconnect();
// //   return filteredTokens ? filteredTokens : [];
// // }

// export async function getCommonTokens(chainId: number) {
//   const db = await createClient();
//   const tokens = await db.token.findMany({
//     select: {
//       id: true,
//       address: true,
//       name: true,
//       symbol: true,
//       decimals: true,
//       isCommon: true,
//       isFeeOnTransfer: true,
//     },
//     where: {
//       chainId,
//       isCommon: true,
//       status: "APPROVED",
//     },
//   });

//   await db.$disconnect();
//   return tokens ? tokens : [];
// }

// export async function getTokensByAddress(address: string) {
//   const db = await createClient();
//   const tokens = await db.token.findMany({
//     select: {
//       id: true,
//       chainId: true,
//       address: true,
//       name: true,
//       symbol: true,
//       decimals: true,
//       isCommon: true,
//       isFeeOnTransfer: true,
//       status: true,
//     },
//     where: {
//       address,
//     },
//   });

//   await db.$disconnect();
//   return tokens ? tokens : [];
// }
