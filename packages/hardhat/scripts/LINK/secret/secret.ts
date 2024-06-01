import { SecretsManager } from "@chainlink/functions-toolkit";
import { task } from "hardhat/config";
import { Wallet, providers } from "ethers@v5";
import { Contract } from "ethers";
import { getNetworkConfig } from "@/scripts/LINK/utils";
import { contractName } from "@/deploy/97_deploy_example_client";
import { getSecretPath } from "secrets"

const expirationTimeMinutes = 15; // expiration time in minutes of the secrets

task("update-secrets", "Upload secrets.")
    .addParam("secret", "secret file name")
    .setAction(async (params, hre) => {
        const { slotId, secrets } = await import(getSecretPath(params.secret));
        if (!slotId) {
            throw new Error(`can't find the slotId in ${params.secretPath}`);
        }
        if (!secrets) {
            throw new Error(`can't find the secret in ${params.secretPath}`);
        }

        const {
            url: url,
            functions: {
                router,
                donId: { offChain: donId },
                secretsUploadEndpoints: secretsUploadEndpoints
            },
        } = await getNetworkConfig(hre);

        if (!secretsUploadEndpoints || secretsUploadEndpoints.length === 0) {
            throw new Error(`the network ${hre.network.name} didn't support secrets upload`);
        }
        console.log(`router: ${router}, donId: ${donId}, slotId: ${slotId}`);

        const { deployer } = await hre.getNamedAccounts();
        console.log(`Deployer: ${deployer}`);

        // let signer = await hre.ethers.getSigner(deployer);

        //TODO: workaround for incompability
        const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        const provider = new providers.JsonRpcProvider(url);
        const signer = new Wallet(deployerPrivateKey, provider);
        //TODO: workaround for incompability

        const secretsManager = new SecretsManager({
            signer: signer,
            functionsRouterAddress: router,
            donId: donId,
        });
        await secretsManager.initialize();

        const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

        console.log(`Uploading encrypted secret to gateways ${secretsUploadEndpoints}. slotId ${slotId}.`);

        // Upload secrets
        const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
            encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
            gatewayUrls: secretsUploadEndpoints,
            slotId: slotId,
            minutesUntilExpiration: expirationTimeMinutes,
        });

        if (!uploadResult.success) {
            throw new Error(`Encrypted secrets not uploaded to ${secretsUploadEndpoints}`);
        }

        console.log(`Secrets uploaded properly to gateways ${secretsUploadEndpoints}! Gateways response: `, uploadResult);

        const secretsVersion = uploadResult.version; // fetch the version of the encrypted secrets
        const encryptedSecretsReference =
            secretsManager.buildDONHostedEncryptedSecretsReference({
                slotId: slotId,
                version: secretsVersion,
            });
        console.log('encrypted secrets reference:', encryptedSecretsReference);

        const consumer = await hre.ethers.getContract<Contract>(contractName, deployer);
        consumer.updateEncryptedSecretsReference(encryptedSecretsReference);
    });
