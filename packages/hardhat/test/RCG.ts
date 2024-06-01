// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { CCG } from "../typechain-types";

// describe("CCG", function () {
//   let ccg: CCG;
//   let owner: any;

//   before(async () => {
//     [owner] = await ethers.getSigners();
//     const ccgFactory = await ethers.getContractFactory("CCG");
//     ccg = (await ccgFactory.deploy()) as CCG;
//     await ccg.deployed();
//   });

//   describe("Deployment", function () {
//     it("Should deploy correctly", async function () {
//       expect(await ccg.COORDINATOR()).to.equal("0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B");
//     });
//   });

//   describe("Character Creation", function () {
//     it("Should create a character and emit CharacterCreated event", async function () {
//       const tx = await ccg.createCharacter();
//       await expect(tx).to.emit(ccg, "CharacterCreated");
//     });

//     it("Should revert if character already created", async function () {
//       await expect(ccg.createCharacter()).to.be.revertedWith("Character already created, use finalizeCharacterDetails");
//     });
//   });
// });
