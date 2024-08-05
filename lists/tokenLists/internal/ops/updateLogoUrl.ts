import fs from "fs/promises";
import path from "path";

interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  chainId: number;
  decimals: number;
}

const networks = ["base"];
const baseLogoUrl =
  "https://raw.githubusercontent.com/Koan-Protocol/koan-assets/main/lists/tokenLists/logos/token";

async function updateTokenLogos() {
  const missingLogos: { [network: string]: string[] } = {};

  for (const network of networks) {
    const projectRoot = process.cwd();
    // const tokensPath = path.join(__dirname, `tokens/${network}.json`);
    // const logoDir = path.join(__dirname, `logos/token/${network}`);
    const tokensPath = path.join(projectRoot, `tokens/${network}.json`);
    const logoDir = path.join(projectRoot, `logos/token/${network}`);
    // console.log("projectRoot..........", projectRoot);
    console.log("logoDir..........", logoDir);
    // console.log("tokensPath", tokensPath, "logoDir", logoDir);
    // // Read tokens JSON
    const tokensData = await fs.readFile(tokensPath, "utf-8");
    const tokens: Token[] = JSON.parse(tokensData);

    // console.log({
    //   tokensData: tokensData,
    // });
    // console.log({
    //     tokens: tokens,
    //   });

    // // Process each token
    for (const token of tokens) {
      const logoFile = await checkLogoExists(logoDir, token.address);
      if (logoFile) {
        token.logoURI = `${baseLogoUrl}/${network}/${token.address}.${logoFile.extension}`;
      } else {
        if (!missingLogos[network]) missingLogos[network] = [];
        missingLogos[network].push(token.address);
      }
    }
    // console.log("tokens....", tokens.slice(0, 5));
    console.log("missingLogos....", missingLogos[network]);
    // // Save updated tokens JSON
    await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
  }

  // Save missing logos JSON
  await fs.writeFile(
    path.join(__dirname, "missing_logos.json"),
    JSON.stringify(missingLogos, null, 2),
  );

  //   console.log("Token logos updated and missing logos recorded.");
}

async function checkLogoExists(dir: string, address: string) {
  const files = await fs.readdir(dir);
  // console.log("address", address);
  // console.log(files.find((item) => item.split(".")[0] === address));
  const logoFileName = files.find((item) => item.split(".")[0] === address);
  if (logoFileName) {
    const extension = logoFileName.split(".")[1];
    // console.log("extension....", extension);
    return {
      extension,
      logoExist: true,
    };
  }
  return null;
}

updateTokenLogos().catch(console.error);
