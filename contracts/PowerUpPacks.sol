// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PowerUpPacks is Ownable {
    IERC20 public jungleToken;
    address public raceEngine;
    
    uint256 public packPrice = 1000 * 10**18; // 1000 tokens per pack
    
    struct PackResult {
        uint8 powerType; // 0=speed, 1=shield, 2=shortcut
        uint8 intensity; // 1-10
    }
    
    mapping(address => uint256) public packsOpened;
    mapping(address => PackResult[]) public packHistory;
    
    event PackOpened(address indexed user, uint8 powerType, uint8 intensity, uint256 seed);
    
    constructor(address _token) Ownable(msg.sender) {
        jungleToken = IERC20(_token);
    }
    
    function setRaceEngine(address _engine) external onlyOwner {
        raceEngine = _engine;
    }
    
    function setPackPrice(uint256 _price) external onlyOwner {
        packPrice = _price;
    }
    
    function openPack() external returns (uint8, uint8) {
        require(raceEngine != address(0), "Race engine not set");
        
        // Transfer tokens from user
        jungleToken.transferFrom(msg.sender, address(this), packPrice);
        
        // Generate random power-up using block data + user nonce
        uint256 seed = uint256(keccak256(abi.encodePacked(
            msg.sender,
            block.timestamp,
            block.difficulty,
            packsOpened[msg.sender],
            gasleft()
        )));
        
        // Determine power type (0, 1, or 2)
        uint8 powerType = uint8(seed % 3);
        
        // Determine intensity (1-10, weighted toward middle)
        uint8 intensity = uint8((seed >> 8) % 10) + 1;
        
        // Apply to race engine
        RaceEngine(raceEngine).applyPowerUp(msg.sender, powerType, intensity);
        
        packHistory[msg.sender].push(PackResult(powerType, intensity));
        packsOpened[msg.sender]++;
        
        emit PackOpened(msg.sender, powerType, intensity, seed);
        return (powerType, intensity);
    }
    
    function getPackHistory(address user) external view returns (PackResult[] memory) {
        return packHistory[user];
    }
    
    function getPacksOpened(address user) external view returns (uint256) {
        return packsOpened[user];
    }
}

interface RaceEngine {
    function applyPowerUp(address wallet, uint8 powerType, uint8 intensity) external;
}