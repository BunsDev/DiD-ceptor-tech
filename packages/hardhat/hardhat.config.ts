import * as dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

import { ChainLinkUserConfig } from "@/interfaces";
import "@/scripts/tasks";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io

const providerApiKey = process.env.ALCHEMY_API_KEY || "XfdusSNUiY5U0K7InJ1-seBOjcY-lBQi";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: ChainLinkUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 100,
  },
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    localhost: {
      contracts: {
        token: "0x0000000000000000000000000000000000000000",
      },
      functions: {
        // fill with your local router address
        router: "0x0000000000000000000000000000000000000000",
        donId: {
          // fill with your local donId
          onChain: "0x0000000000000000000000000000000000000000000000000000000000000000",
          offChain: "fun-ethereum-local-1",
        },
        secretsUploadEndpoints: [],
      },
    },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      },
      functions: {
        router: "0x65Dcc24F8ff9e51F10DCc7Ed1e4e2A61e6E14bd6",
        donId: {
          onChain: "0x66756e2d657468657265756d2d6d61696e6e65742d3100000000000000000000",
          offChain: "fun-ethereum-mainnet-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.chain.link/",
          "https://02.functions-gateway.chain.link/",
        ],
      },
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      },
      functions: {
        router: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
        donId: {
          onChain: "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000",
          offChain: "fun-ethereum-sepolia-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.testnet.chain.link/",
          "https://02.functions-gateway.testnet.chain.link/",
        ],
      },
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
      },
      functions: {
        router: "0xC17094E3A1348E5C7544D4fF8A36c28f2C6AAE28",
        donId: {
          onChain: "0x66756e2d6f7074696d69736d2d7365706f6c69612d3100000000000000000000",
          offChain: "fun-optimism-sepolia-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.testnet.chain.link/",
          "https://02.functions-gateway.testnet.chain.link/",
        ],
      },
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
      },
      functions: {
        router: "0xdc2AAF042Aeff2E68B3e8E33F19e4B9fA7C73F10",
        donId: {
          onChain: "0x66756e2d706f6c79676f6e2d6d61696e6e65742d310000000000000000000000",
          offChain: "fun-polygon-mainnet-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.chain.link/",
          "https://02.functions-gateway.chain.link/",
        ],
      },
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      },
      functions: {
        router: "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C",
        donId: {
          onChain: "0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000",
          offChain: "fun-polygon-mumbai-1",
        },
        secretsUploadEndpoints: [],
      },
    },
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
      },
      functions: {
        router: "0xC22a79eBA640940ABB6dF0f7982cc119578E11De",
        donId: {
          onChain: "0x66756e2d706f6c79676f6e2d616d6f792d310000000000000000000000000000",
          offChain: "fun-polygon-amoy-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.testnet.chain.link/",
          "https://02.functions-gateway.testnet.chain.link/",
        ],
      },
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
      },
      functions: {
        router: "0xf9b8fc078197181c841c296c876945aaa425b278",
        donId: {
          onChain: "0x66756e2d626173652d6d61696e6e65742d310000000000000000000000000000",
          offChain: "fun-base-mainnet-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.chain.link/",
          "https://02.functions-gateway.chain.link/",
        ],
      },
    },
    baseSepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0xe4ab69c077896252fafbd49efd26b5d171a32410",
      },
      functions: {
        router: "0xf9B8fc078197181C841c296C876945aaa425B278",
        donId: {
          onChain: "0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000",
          offChain: "fun-base-sepolia-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.testnet.chain.link/",
          "https://02.functions-gateway.testnet.chain.link/",
        ],
      },
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    pgn: {
      url: "https://rpc.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
    pgnTestnet: {
      url: "https://sepolia.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
    zora: {
      url: "https://rpc.zora.energy",
      accounts: [deployerPrivateKey],
    },
    zoraSepolia: {
      url: "https://sepolia.rpc.zora.energy",
      accounts: [deployerPrivateKey],
    },
    liskSepolia: {
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: [deployerPrivateKey],
    },
    mode: {
      url: "https://mainnet.mode.network",
      accounts: [deployerPrivateKey],
    },
    modeSepolia: {
      url: "https://sepolia.mode.network",
      accounts: [deployerPrivateKey],
    },
    axax: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x5947BB275c521040051D82396192181b413227A3",
      },
      functions: {
        router: "0x9f82a6A0758517FD0AfA463820F586999AF314a0",
        donId: {
          onChain: "0x66756e2d6176616c616e6368652d6d61696e6e65742d31000000000000000000",
          offChain: "fun-avalanche-mainnet-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.chain.link/",
          "https://02.functions-gateway.chain.link/",
        ],
      },
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [deployerPrivateKey],
      contracts: {
        token: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
      },
      functions: {
        router: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
        donId: {
          onChain: "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000",
          offChain: "fun-avalanche-fuji-1",
        },
        secretsUploadEndpoints: [
          "https://01.functions-gateway.testnet.chain.link/",
          "https://02.functions-gateway.testnet.chain.link/",
        ],
      },
    },
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: `${etherscanApiKey}`,
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
