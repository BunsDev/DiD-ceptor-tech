<div align="center">
  <a href="https://www.notion.so/danj-o/S3-Block-Magic-Hackathon-2024-d0ed09047ec648a087ace9b078736518"><img alt="Ceptor Club" src="Group 9.png" width=128></a>
  <br />
  <br />
</div>

# 🏗🔴 Ceptor-Tech-Team

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

## Tech Team

**Aldo:** Quick Learner & Worker (Frontend Developer)

**Allan:** Perceptive & Knowledgeable (Backend Developer)

**Q:** Creativity & Passion (UX/UI Designer)

**X:** Pixel Art (Graphic Designer)

**Y(👻):** Full-Stack Masterchef (Software Engineer)

# Infrastructure Contracts

### [Gateway](packages/hardhat/contracts/CCGateway.sol)
We created a unified Gateway for all Chainlink Function interactions to simplify and streamline the integration of various services. This Gateway abstracts all required logic into a single, managed place.

Key Features:
- **On-chain API**: The gateway registers different codes (functions) that can be run, acting like an on-chain API.
- **Subscription Management**: Each code has an independent subscription tied to it, functioning as an endpoint with a unique subscription ID.
- **Updatable Configuration**: Codes and configurations can be updated without needing new contracts, subscriptions, or deployments.
- **Access Control List (ACL)**: Only authorized Managers can update endpoints, and only registered clients can use the API.
- **Flexible Client Usage**: Clients can use multiple endpoints, with responses containing the subscription ID for easy management.

### [Onboarding](packages/hardhat/contracts/Clients/CCNotificationClient.sol)
This contract facilitates on-chain onboarding by validating signatures and storing client addresses and their allowed endpoints.

# Toolkit

### [Gateway Tools](packages/hardhat/scripts/LINK/subscription/tasks/createAndFund.ts)
We built a toolkit to simplify the deployment of new endpoints into our API gateway.

Key Features:
- **Chainlink Functions Toolkit**: Simplifies the creation, funding, and updating of subscriptions.
- **Endpoint Management Tools**: Eases the creation and updating of endpoints.
- **Hardhat Tasks**: Automates the upserting of endpoints into the gateway.
- **NPM Scripts**: Provides easy access to these tasks.

#### Adding a New Endpoint

1. **Test Your Function**:
   - Use the [Chainlink Functions Playground](https://functions.chain.link/playground) to ensure your function works.

2. **Create a New File**:
   - Name the file `<next_number>_<function_name>.[js|ts]` in the `packages/hardhat/functions` folder.
   - Paste the working code from the playground into this file.

3. **Deploy the Endpoint**:
   - Run: `npm run link:gw:upsert-fund --network <network_name>` to deploy the endpoint to the gateway.

#### Using the Endpoint

1. **Find Endpoint Details**:
   - Check `link_functions_map.json` for the `subscriptionId` and `consumerAddress`.

2. **Integrate in Your Smart Contract**:
   - Use the `consumerAddress` to create a gateway instance with the `ICCGateway` interface.
   - Use the `sendRequest` method with the `subscriptionId` to access the endpoint.

#### Updating an Endpoint

1. **Edit the Function**:
   - Modify the existing function file.

2. **Update the Gateway**:
   - Run: `npm run link:gw:upsert` to update the endpoint in the gateway.

### [Simulator](packages/hardhat/scripts/LINK/functions/tasks/simulate.ts)
We created a simulator Hardhat task to debug functions locally.

### [Networks](packages/hardhat/interfaces/ChainLink.ts)
The Hardhat config was updated to use the `ChainlinkUserConfig` type, defining network configurations for Chainlink scripts and deployments.

### [DID Implementation](packages/nextjs/app/sign-up/actions.ts)
We implemented Decentralized Identities (DIDs) using `ethr-did` and `ethr-did-registry`. The DID is created client-side and prepared for signing during onboarding.

---

Crafted with the prowess of a Level 5 Barbarian, the ingenuity of an Artificer 2, and the cosmic insight of a Druid of the Stars 2, by Tippi Fifestarr.

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/ethereum-optimism/scaffold-op/blob/main/packages/nextjs/public/scaffold-op-landing.png)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-OP, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ethereum-optimism/scaffold-op.git
cd scaffold-op
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On the same terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Deploy Contracts to Superchain Testnet(s)

To deploy contracts to a remote testnet (e.g. Optimism Sepolia), follow the steps below:

1. Get Superchain Sepolia ETH from the [Superchain Faucet](https://app.optimism.io/faucet)

2. Inside the `packages/hardhat` directory, copy `.env.example` to `.env`.

   ```bash
   cd packages/hardhat && cp .env.example .env
   ```

3. Edit your `.env` to specify the environment variables. Only specifying the `DEPLOYER_PRIVATE_KEY` is necessary here. The contract will be deployed from the address associated with this private key, so make sure it has enough Sepolia ETH.

   ```bash
   DEPLOYER_PRIVATE_KEY = "your_private_key_with_sepolia_ETH";
   ```

4. Inside `scaffold-op`, run

   ```bash
   yarn deploy --network-options
   ```

   Use spacebar to make your selection(s). This command deploys all smart contracts in `packages/hardhat/contracts` to the selected network(s). Alternatively, you can try

   ```bash
   yarn deploy --network networkName
   ```

   Network names are found in `hardhat.config.js`. Please ensure you have enough Sepolia ETH on all these Superchains. If the deployments are successful, you will see the deployment tx hash on the terminal.

## Adding Foundry

Hardhat's NodeJS stack and cleaner deployment management makes it a better default for Scaffold-OP.

To add Foundry to Scaffold-OP, follow this simple [tutorial](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-and-foundry) by Hardhat. We recommend users who want more robust and faster testing to add Foundry.

## Documentation

We highly recommend visiting the original [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out their [website](https://scaffoldeth.io).
