# Games Contracts

1. [Game World Generator](BuyMeACeptor.sol) - A contract that generates a game world based on a user's vibe and number of players. The world is generated with a visual of the planet, scenarios, locations, descriptions, maps, denizens, secrets, goals, and players. Each world has its own blockchain. Creating a World costs 10 gameTokens.  when creating a game, i want to have my own world or play with others. each world should be locked to a blockchain. 10 gT to make a world. 5 gT to join one as a GM, 2 gT to join as player.

Inside worlds, there are games
inside games there are schedules
inside schedules there are sessions
(and we verify who shows up)

1. [Character Generator](Characters/CharacterGen.sol) - A contract that generates a character for a user in the game world. The character is generated with abilities, class, name, alignment, and background. Each character has its own unique attributes. Currently it uses VRF2.5, and provides a reroll (4d4 drop lowest) as well as a swap scores. It refers to the classes, backgrounds, and names contracts.  These contracts will have their own Chainlink Functions call to GPT if the user rolls a length+1, it calls that function and triggers the Chainlink Functions call through the gateway, the prompt being to take the existing information about the character and the D&D 5e open source rules for homebrewing a name, class, or background. That's after the Auction House.

1. [GamesToken ERC20](GamesToken.sol) - A contract that is an ERC20 token that is used to pay for the creation of a world, and to pay for the creation of a game. Also can be spent to buy a random character from the portal.

1. [TokenShop](TokenShop.sol) - A contract that has a ledger of allowed players, gamemasters, and tracks + mints the ERC20 Games Token for Chainlink Price Feeds = $20 USD (or $0.02 for testing). It also allows a gamemaster to propose a new price for the token, and all allowed players and gamemasters to vote on the price. if you are a player and gamemaster, you get 2 votes!

### Random notes

1. Is the World Generator deploying a World contract? Yes. Is the World contract tracking all its games, or deploying each game as its own contract which tracks the sessions. Verifiable Truth.

1. NPC Generator - Unlike the PCG which is usable by any Verified Credential having hooty in their hey hey. The NPCG is a contract that generates a non-player character for a user in the game world. The character is generated with abilities, class, name, alignment, hometown, and background. Each character has its own unique attributes. Creating a Character is only allowed by the owner of the contract.  VRF2.5 because reusable code choices.

1. Auction Price Machine -- Like a Dutch Auction, but with a price multiplier based on the rarity tier (total sum of the 6 ability scores in 5 tiers: minimum being 3*6 and maximum being 18*6)

Links for Auction & NFT references:
https://github.com/smartcontractkit/chainlink-automation-templates/tree/main/batch-nft-reveal
https://github.com/solangegueiros/chainlink-bootcamp-2024/tree/main

## Flowcharts

![Flowchart of Random Character Auction](./square.png)

## Improvements
In our voting mechanism, I track both votesFor and votesAgainst. Consider using a single integer where a positive value increases for a “for” vote and decreases for an “against”. This reduces the storage operations:

```solidity
mapping(address => bool) public hasVoted;

function vote(bool voteFor) external onlyAllowed {
    require(!hasVoted[msg.sender], "Already voted");
    hasVoted[msg.sender] = true;

    proposal.voteCount += voteFor ? 1 : -1;
    emit Voted(msg.sender, voteFor);
}
```

Consider if I can use smaller type sizes and pack the struct better...

```solidity
struct Proposal {
        ProposalType proposalType;
        string catchphrase;
        uint32 newPrice; // could these be uint64?
        uint32 amount; // could these be uint64?
        uint32 votesFor; // could these be uint64?
        uint32 votesAgainst; // could these be uint64? 
        uint256 deadline;
        bool executed;
        mapping(address => bool) voters;
    }
    ```