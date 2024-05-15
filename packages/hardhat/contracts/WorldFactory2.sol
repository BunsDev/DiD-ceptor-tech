// inspired by Josh "W" Comeau's open house lessson on useState and react dom magic
// https://courses.joshwcomeau.com/joy-of-react/open-house/01-why-the-dance

// SPDX-License-Identifier: MIT
// Why do we always use this one? - Tippi
// what does a world look like, that's up to it's Creator.
// what does a world factory look like? it all starts at the gift shop.
pragma solidity ^0.8.0;
// "public variables automatically generate getter functions" - Andrej
// what does the world factory need to make public?
// number of worlds
// number of gifts remaining in the gift shop
// number of games
// uri of each worlds' Creator (owner provided unique 8-bit wizard character) .gif file
// each worlds "vibe", "scenarios", "locations", "descriptions", "maps", "denizens", "secrets", "goals", "ruleset" and "players"
// if a game is currently happening and what world it's in
// what else? 
/* A contract that generates a game world based on a user's vibe and number of players. The world is generated with a visual of the planet, scenarios, locations, descriptions, maps, denizens, secrets, goals, and players. Each world has its own blockchain. Creating a World costs 10 gameTokens. when creating a game, i want to have my own world or play with others. each world should be locked to a blockchain. 10 gT to make a world. 5 gT to join one as a GM, 2 gT to join as player.
*/
// to gain access to world factory, you must buy a gift from the gift shop.
// for 10 dollars of eth, you get 1 gameToken.
// guess how much a gift costs? half gameToken.
// 10 gameTokens = Create 1 world
// what are the functions that the world factory needs?
// createWorld
// joinWorld
// leaveWorld
// getWorld
// moneyIn
// do we want to allow each game owner (Creator) to have a vote on how money is spent?
// i vote yes - tippi. add your vote - name above if you agree. 
// what else?
// what are the functions that a world needs?
// setSchedule
// scheduleGame
// startGame
// joinGame
// leaveGame
// reviewGame
// what else?
// what are the events that the world factory needs?
// worldCreated
// worldJoined
// worldLeft
// gameScheduled
// gameStarted
// gameJoined
// gameLeft
// gameReviewed
// what else?
// what are the modifiers that the world factory needs?
// onlyWorldOwner
// onlyWorldGameMaster
// onlyWorldPlayer
// what else?
// what are the structs that the world factory needs?
// World
// Game
// Player
// what else?

contract WorldFactory {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

}