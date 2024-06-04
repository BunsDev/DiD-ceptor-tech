// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract World {
    struct Game {
        address gameMaster;
        uint256 startTime;
        uint256 endTime;
        address[] players;
        mapping(address => bool) isPlayer;
    }

    string public vibe;
    string public gameMasterName;
    string public gameMasterTwitterHandle;
    string public description;
    uint256 public creationTime;
    address public worldCreator;
    uint256 public treasuryBalance;

    uint256 public gameCount;
    mapping(uint256 => Game) public games;
    
    event WorldUpdated(string vibe, string gameMasterName, string gameMasterTwitterHandle, string description);
    event GameCreated(uint256 gameId, address gameMaster, uint256 startTime, uint256 endTime);
    event PlayerJoined(uint256 gameId, address player);
    event PlayerApproved(uint256 gameId, address player);

    constructor(
        string memory _vibe,
        string memory _gameMasterName,
        string memory _gameMasterTwitterHandle,
        string memory _description,
        address _worldCreator
    ) {
        vibe = _vibe;
        gameMasterName = _gameMasterName;
        gameMasterTwitterHandle = _gameMasterTwitterHandle;
        description = _description;
        creationTime = block.timestamp;
        worldCreator = _worldCreator;
    }

    modifier onlyGameMaster(uint256 gameId) {
        require(msg.sender == games[gameId].gameMaster, "Not the game master");
        _;
    }

    function createGame(uint256 startTime, uint256 endTime) public {
        games[gameCount].gameMaster = msg.sender;
        games[gameCount].startTime = startTime;
        games[gameCount].endTime = endTime;
        gameCount++;

        emit GameCreated(gameCount - 1, msg.sender, startTime, endTime);
    }

    function joinGame(uint256 gameId) public payable {
        require(gameId < gameCount, "Game does not exist");
        require(msg.value >= 1 ether, "Insufficient stake");

        games[gameId].players.push(msg.sender);
        games[gameId].isPlayer[msg.sender] = true;
        treasuryBalance += msg.value;

        emit PlayerJoined(gameId, msg.sender);
    }

    function approvePlayer(uint256 gameId, address player) public onlyGameMaster(gameId) {
        require(games[gameId].isPlayer[player], "Player not in the game");

        // Additional logic to approve player if needed
        emit PlayerApproved(gameId, player);
    }

    function updateDescription(string memory _description) public {
        require(msg.sender == worldCreator, "Operation not allowed");
        description = _description;
        emit WorldUpdated(vibe, gameMasterName, gameMasterTwitterHandle, description);
    }
}
