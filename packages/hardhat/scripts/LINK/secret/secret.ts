import { SecretsManager } from "@chainlink/functions-toolkit";
import { task } from "hardhat/config";
import { Wallet, providers } from "ethers@v5";
import { getNetworkConfig } from "@/scripts/LINK/utils";
import { contractName } from "@/deploy/97_deploy_example_client";
import { Contract } from "ethers";

const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
];

const slotIdNumber = 0; // slot ID where to upload the secrets
const expirationTimeMinutes = 15; // expiration time in minutes of the secrets

task("update-secrets", "Upload secrets.")
    .setAction(async (_, hre) => {
        if (!process.env.RABBITMQ_AUTH) {
            throw new Error("rabbitmq auth not provided - check your environment variable RABBITMQ_AUTH");
        }
        const auth = process.env.RABBITMQ_AUTH;

        const {
            functions: {
                router,
                donId: { offChain: donId },
            },
        } = await getNetworkConfig(hre);
        console.log(`router: ${router}, donId: ${donId}`);

        const { deployer } = await hre.getNamedAccounts();
        console.log(`Deployer: ${deployer}`);

        // let signer = await hre.ethers.getSigner(deployer);
        const { url } = await getNetworkConfig(hre)
        const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        const provider = new providers.JsonRpcProvider(url);
        const signer = new Wallet(deployerPrivateKey, provider);

        const secretsManager = new SecretsManager({
            signer: signer,
            functionsRouterAddress: router,
            donId: donId,
        });
        await secretsManager.initialize();

        const secrets = { auth: auth };
        const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

        console.log(`Uploading encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}.`);

        // Upload secrets
        const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
            encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
            gatewayUrls: gatewayUrls,
            slotId: slotIdNumber,
            minutesUntilExpiration: expirationTimeMinutes,
        });

        if (!uploadResult.success) {
            throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);
        }

        console.log(`Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `, uploadResult);

        const secretsVersion = uploadResult.version; // fetch the version of the encrypted secrets
        const encryptedSecretsReference =
            secretsManager.buildDONHostedEncryptedSecretsReference({
                slotId: slotIdNumber,
                version: secretsVersion,
            });
        console.log('encrypted secrets reference:', encryptedSecretsReference);

        const consumer = await hre.ethers.getContract<Contract>(contractName, deployer);
        consumer.updateEncryptedSecretsReference(encryptedSecretsReference);
    });
