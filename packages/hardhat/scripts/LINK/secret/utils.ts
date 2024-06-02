import { Wallet, providers } from "ethers@v5";
import { SecretsManager } from "@chainlink/functions-toolkit";

import { getNetworkConfig } from "../utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

let secretsManager: SecretsManager;

export async function getManager(hre: HardhatRuntimeEnvironment) {
  if (secretsManager) return secretsManager;

  const {
    url,
    functions: {
      router: functionsRouterAddress,
      donId: { offChain: donId },
    },
  } = await getNetworkConfig(hre);

  // Workaround for the incompatibility between ethers v6 and v5. @chainlink/functions-toolkit is using ethers v5.
  const deployerPrivateKey =
    process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const provider = new providers.JsonRpcProvider(url);
  const signer = new Wallet(deployerPrivateKey, provider);
  // End of workaround. goal: ethers v5 Signer with the deployer private key using the hre network.

  secretsManager = new SecretsManager({
    signer,
    functionsRouterAddress,
    donId,
  });
  await secretsManager.initialize();

  return secretsManager;
}
