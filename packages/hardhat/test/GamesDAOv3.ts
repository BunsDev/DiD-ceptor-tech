import { expect } from "chai";
import { ethers } from "hardhat";
import { GamesDAOv3 } from "../typechain-types";

describe("GamesDAOv3", function () {
  let gamesDAO: GamesDAOv3;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    const gamesDAOFactory = await ethers.getContractFactory("GamesDAOv3");
    gamesDAO = (await gamesDAOFactory.deploy()) as GamesDAOv3;
    await gamesDAO.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await gamesDAO.owner()).to.equal(owner.address);
    });

    it("Should have the initial greeting 'Hooty, world!'", async function () {
      expect(await gamesDAO.greeting()).to.equal("Hooty, world!");
    });
  });

  describe("Functionality", function () {
    it("Should allow the owner to change the games token price", async function () {
      await gamesDAO.connect(owner).createProposal(5); // Assume 0.05 USD
      await gamesDAO.connect(owner).vote(true);
      await ethers.provider.send("evm_increaseTime", [604800]); // Increase time by one week
      await gamesDAO.connect(owner).executeProposal();
      expect(await gamesDAO.gamesTokenPriceInCents()).to.equal(5);
    });

    it("Should emit an event when a player is allowed", async function () {
      await expect(gamesDAO.connect(owner).allowPlayer(addr1.address))
        .to.emit(gamesDAO, "PlayerAllowed")
        .withArgs(addr1.address);
    });
  });
});
