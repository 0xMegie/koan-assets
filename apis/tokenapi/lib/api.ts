import { readContracts } from "@wagmi/core";
import "dotenv/config";
import { erc20Abi, type Address } from "viem";
import {
  getKoanDefaultTkens,
  DEFAULT_TOKEN_LIST as OTHER_TOKEN_LISTS,
} from "@koanprotocol/token-list";
import { isPromiseFulfilled } from "./utils/index.js";
import { web3config } from "./wagmiConfig.js";

export async function getTokens() {
  const tokenFromList = getKoanDefaultTkens();
  return tokenFromList ? tokenFromList.tokens : [];
}

export async function getToken(chainId: number, address: string) {
  const tokenFromList = getKoanDefaultTkens().tokens.find(
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

  const _tokenFromOtherLists = await Promise.allSettled(
    OTHER_TOKEN_LISTS.map((el) => fetch(el).then((res) => res.json())),
  )
    .then((res) => {
      return res.filter(isPromiseFulfilled).map((el) => el.value);
    })
    .catch((error) => {
      console.error("Error fetching tokens from other lists", error);
      return [];
    });

  if (_tokenFromOtherLists) {
    console.log("_tokenFromOtherLists", _tokenFromOtherLists);
  }

  const _tokenFromContract = await readContracts(web3config, {
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
