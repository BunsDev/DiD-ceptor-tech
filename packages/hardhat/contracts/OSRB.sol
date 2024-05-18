/* experimental smart contract by Tippi Fifestarr for Ceptor Games
/  simply provide an on-chain querable array of public domain random backstory
/  other smart contracts can import this or an interface of it to get a backstory
/  if that contract has a source verifiable of randomness, thats very cool
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract OpenSourceRandomBackstory {

    // note: backstory are as random as you make them
    // the alphabetical list of d&d 5e srd backgrounds
    string[15] public backstories = [
    "Acolyte",
    "Ceptor",
    "Charlatan",
    "Criminal",
    "Entertainer",
    "Folk Hero",
    "Guild Artisan",
    "Hermit",
    "Noble",
    "Outlander",
    "Sage",
    "Sailor",
    "Soldier",
    "Urchin",
    "Vampire"
    ];
    
    
}
