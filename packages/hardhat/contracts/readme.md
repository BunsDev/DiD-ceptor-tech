# Games Contracts

1. [Game World Generator](BuyMeACeptor.sol) - A contract that generates a game world based on a user's vibe and number of players. The world is generated with a visual of the planet, scenarios, locations, descriptions, maps, denizens, secrets, goals, and players. Each world has its own blockchain. Creating a World costs 10 gameTokens.  when creating a game, i want to have my own world or play with others. each world should be locked to a blockchain. 10 gT to make a world. 5 gT to join one as a GM, 2 gT to join as player.

Inside worlds, there are games
inside games there are schedules
inside schedules there are sessions
(and we verify who shows up)

1. [Character Generator](CeptorCharacterGenerator.sol) - A contract that generates a character for a user in the game world. The character is generated with abilities, class, name, alignment, and background. Each character has its own unique attributes. Creating a Character is only allowed by the owner of the contract.  This is a mistake, and will be replaced in upgrade to VRF2.5

2. Is the World Generator deploying a World contract? Yes. Is the World contract tracking all its games, or deploying each game as its own contract which tracks the sessions. Verifiable Truth.

3. NPC Generator - Unlike the PCG which is usable by any Verified Credential having hooty in their hey hey. The NPCG is a contract that generates a non-player character for a user in the game world. The character is generated with abilities, class, name, alignment, hometown, and background. Each character has its own unique attributes. Creating a Character is only allowed by the owner of the contract.  VRF2.5 because reusable code choices.