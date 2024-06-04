### importing chainlink contracts

yarn add @chainlink/contracts

# Ceptor Games BlockMagic Hackathon ReadMe

## Project Overview

Welcome to the Ceptor Games BlockMagic Hackathon project! This project is built using Solidity smart contracts to create a decentralized gaming ecosystem on the blockchain. Our goal is to progressively decentralize and allow for fun, transparent, and engaging gaming experiences. This README is intended to guide frontend developers on how to interact with the smart contracts using the Scaffold-ETH 2 framework.

## Project Components

1. **[GamesDAOv3.sol](./contracts/GamesDAOv3.sol)**: This contract manages the minting and pricing of GamesTokens based on Chainlink price feeds. It allows gamemaster proposals on token pricing, which can be voted on by allowed players and gamemasters.
2. **GamesToken.sol**: An ERC20 token contract for GamesToken (GT), which is minted and managed by the GamesDAO.
3. **Backgrounds.sol**: Provides an on-chain queryable array of D&D 5e SRD backgrounds.
4. **CharacterGen.sol**: Uses Chainlink VRF to generate random D&D characters with abilities, class, name, alignment, and background.
5. **Classes.sol**: Provides an on-chain queryable array of D&D 5e SRD classes.
6. **Names.sol**: Provides an on-chain queryable array of character names.
7. **World.sol**: Manages the creation of games within a world, player participation, and game scheduling.
8. **WorldFactory.sol**: Facilitates the creation of new worlds and manages player and game master participation in these worlds.

## Deployment Plan

We are initially deploying on the Polygon Amoy Testnet and plan to expand to Scroll, ZkSync, Optimism, and Metis. Since only Polygon, Avax, and Ethereum are currently supported by CCIP, the next version will implement CCIPGamesDAO on Polygon first.

## How to Interact with the Contracts using Scaffold-ETH 2

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ceptor-games.git
   cd ceptor-games
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the local blockchain:
   ```bash
   yarn chain
   ```

4. Deploy the contracts:
   ```bash
   yarn deploy
   ```

### Using Scaffold-ETH 2 Hooks

Scaffold-ETH 2 provides several hooks to interact with the smart contracts. Below are examples of how to call the functions in each contract.

#### GamesDAO

1. **Buy Tokens**
   ```javascript
   const { data, error, send } = useContractFunction(gamesDaoContract, 'buyTokens');
   send({ value: ethers.utils.parseEther("1") }); // sends 1 MATIC
   ```

2. **Create a Proposal**
   ```javascript
   const { data, error, send } = useContractFunction(gamesDaoContract, 'createProposal');
   send(3); // Propose to change the token price to 0.03 USD
   ```

3. **Vote on a Proposal**
   ```javascript
   const { data, error, send } = useContractFunction(gamesDaoContract, 'vote');
   send(true); // Vote in favor of the proposal
   ```

#### CharacterGen

1. **Create a Character**
   ```javascript
   const { data, error, send } = useContractFunction(characterGenContract, 'createCharacter');
   send("PlayerName");
   ```

2. **Finalize Character Details**
   ```javascript
   const { data, error, send } = useContractFunction(characterGenContract, 'finalizeCharacterDetails');
   send("Neutral Good");
   ```

3. **Swap Ability Scores**
   ```javascript
   const { data, error, send } = useContractFunction(characterGenContract, 'swapScores');
   send(0, 1); // Swap the first and second ability scores
   ```

#### WorldFactory

1. **Create a World**
   ```javascript
   const { data, error, send } = useContractFunction(worldFactoryContract, 'createWorld');
   send("Adventure", "GMName", "@GMTwitter", "A fun adventure world", { value: ethers.utils.parseEther("0.1") });
   ```

2. **Join a World as a Game Master**
   ```javascript
   const { data, error, send } = useContractFunction(worldFactoryContract, 'joinWorldAsGM');
   send(0, { value: ethers.utils.parseEther("0.05") }); // Join the first world as GM
   ```

3. **Join a World as a Player**
   ```javascript
   const { data, error, send } = useContractFunction(worldFactoryContract, 'joinWorldAsPlayer');
   send(0, { value: ethers.utils.parseEther("0.02") }); // Join the first world as a player
   ```

### Frontend Development Tips

- **Use React Hooks**: Scaffold-ETH 2's hooks make it easy to read from and write to your smart contracts. Make use of hooks like `useContractCall` and `useContractFunction` to interact with your contracts.
- **Display Data**: Use the `useContractCall` hook to fetch data from your contracts and display it in your components.
- **Handle Transactions**: Use `useContractFunction` to handle transactions. Always provide feedback to users about the status of their transactions.
- **Debugging**: Use the console and Scaffold-ETH 2's built-in debugging tools to troubleshoot any issues.

## Future Plans

1. **Decentralization**: Progressively decentralize the governance and operation of the GamesDAO.
2. **Cross-Chain Compatibility**: Implement Cross-Chain Interoperability Protocol (CCIP) to support multiple blockchains.
3. **Enhanced Gameplay**: Add more features to the CharacterGen contract, including Traits, Ideals, Bonds, and Flaws, and integrate additional randomness sources.
4. **Community Involvement**: Encourage community participation in the development and governance of the gaming ecosystem.

Thank you for being a part of the Ceptor Games BlockMagic Hackathon! Let's build something amazing together! If you have any questions or need further assistance, please reach out on our team Discord channel.
