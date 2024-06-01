/* Experimental smart contract by Tippi Fifestarr for Ceptor Games
/  This contract provides an on-chain queryable array of D&D character classes
/  Other smart contracts can import this or an interface of it to get a class
/  If that contract has a source verifiable of randomness, that's even better
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Classes {

    // Note: Classes are as random as you make them
    // The list of D&D 5e SRD classes
    string[13] public classes = [
    "Barbarian",
    "Bard",
    "Cleric",
    "Druid",
    "Fighter",
    "Monk",
    "Paladin",
    "Ranger",
    "Rogue",
    "Sorcerer",
    "Warlock",
    "Wizard",
    "Ceptor"
    ];

    function classesLength() public view returns (uint256) {
        return classes.length;
    }

}