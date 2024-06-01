/* experimental smart contract by Tippi Fifestarr for Ceptor Games
/  simply provide an on-chain querable array of public domain character names
/  other smart contracts can import this or an interface of it to get a name
/  if that contract has a source verifiable of randomness, thats cool
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Names {

    // note: names are as random as you make them
    // the alphabetical list
    string[20] public names = [
    "Aladdin",
    "Alice",
    "Arthur",
    "Davy",
    "Dracula",
    "Felix",
    "Frankie",
    "Hercules",
    "Jack",
    "James",
    "Kong",
    "Lupin",
    "Merlin",
    "Nyarlathotep",
    "Nemo",
    "Oswald",
    "Red",
    "Sandman",
    "Sherlock",
    "Winnie"
    ];
    
    function namesLength() public view returns (uint256) {
        return names.length;
    }
}
