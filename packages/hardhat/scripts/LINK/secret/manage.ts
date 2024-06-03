import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getManager } from "./utils";

import { SecretFile } from "@/secrets";
import { getNetworkConfig } from "@/scripts/LINK/utils";
import { encodeBytes32String } from "ethers";

export async function encryptSecrets(hre: HardhatRuntimeEnvironment, secrets: SecretFile["secrets"]) {
  const secretsManager = await getManager(hre);
  console.log(`Encrypting secrets...`);
  return await secretsManager.encryptSecrets(secrets);
}

export async function uploadSecrets(
  hre: HardhatRuntimeEnvironment,
  { secrets, slotId, ttl: minutesUntilExpiration }: SecretFile,
) {
  const {
    functions: { secretsUploadEndpoints: gatewayUrls },
  } = await getNetworkConfig(hre);

  if (!gatewayUrls || gatewayUrls.length === 0)
    throw new Error(`the network ${hre.network.name} don't provide secrets upload endpoints`);

  const secretsManager = await getManager(hre);
  const encryptedSecretsObj = await encryptSecrets(hre, secrets);

  console.log(`Uploading encrypted secrets to gateways ${gatewayUrls}. slotId ${slotId}.`);
  return await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls,
    slotId,
    minutesUntilExpiration,
  });
}

export async function buildSecretsReference(hre: HardhatRuntimeEnvironment, secrets: SecretFile): Promise<string> {
  const chainId = await hre.getChainId();
  const isLocal = chainId === hre.config.networks.hardhat.chainId.toString();
  if (isLocal) return encodeBytes32String(`local:${secrets.slotId}`);

  const { success, version } = await uploadSecrets(hre, secrets);

  if (!success) throw new Error(`Encrypted secrets upload failed!`);
  console.log(`Secrets uploaded properly!`);

  const secretsManager = await getManager(hre);
  return secretsManager.buildDONHostedEncryptedSecretsReference({
    slotId: secrets.slotId,
    version,
  });
}
