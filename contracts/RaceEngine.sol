// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RaceEngine is Ownable {
    
    struct Racer {
        address wallet;
        uint256 tokensLocked;
        uint256 speedBoost;
        uint256 shieldCount;
        uint256 shortcutCount;
        uint256 baseSpeed;
        uint256 finalSpeed;
        uint256 finishTime;
        bool finished;
    }
    
    struct PowerUp {
        uint8 powerType; // 0=speed, 1=shield, 2=shortcut
        uint8 intensity; // 1-10
    }
    
    address[] public racers;
    mapping(address => Racer) public racerData;
    mapping(address => PowerUp[]) public powerUps;
    
    uint256 public raceStartTime;
    uint256 public raceDuration = 3600; // 1 hour default
    bool public raceFinalized;
    address public winner;
    
    uint256 private nonce;
    
    event RacerRegistered(address indexed wallet, uint256 tokensLocked);
    event PowerUpApplied(address indexed wallet, uint8 powerType, uint8 intensity);
    event RaceFinalized(address winner, uint256 finishTime);
    
    constructor() Ownable(msg.sender) {}
    
    function registerRacer(address wallet, uint256 tokensLocked) external onlyOwner {
        require(racerData[wallet].wallet == address(0), "Already registered");
        
        // Base speed proportional to tokens locked (logarithmic for fairness)
        uint256 baseSpeed = calculateBaseSpeed(tokensLocked);
        
        racerData[wallet] = Racer({
            wallet: wallet,
            tokensLocked: tokensLocked,
            speedBoost: 0,
            shieldCount: 0,
            shortcutCount: 0,
            baseSpeed: baseSpeed,
            finalSpeed: baseSpeed,
            finishTime: 0,
            finished: false
        });
        
        racers.push(wallet);
        emit RacerRegistered(wallet, tokensLocked);
    }
    
    function calculateBaseSpeed(uint256 tokensLocked) internal pure returns (uint256) {
        // Logarithmic scaling: more tokens = higher speed but diminishing returns
        // This keeps it fair — whales have advantage but not insurmountable
        if (tokensLocked == 0) return 100;
        uint256 log = 1;
        uint256 temp = tokensLocked;
        while (temp > 10) {
            temp /= 10;
            log++;
        }
        return 100 + (log * 50); // 100 base + 50 per order of magnitude
    }
    
    function applyPowerUp(address wallet, uint8 powerType, uint8 intensity) external onlyOwner {
        require(racerData[wallet].wallet != address(0), "Not a racer");
        require(intensity >= 1 && intensity <= 10, "Invalid intensity");
        
        Racer storage racer = racerData[wallet];
        
        if (powerType == 0) {
            // Speed boost
            racer.speedBoost += intensity * 25;
            racer.finalSpeed = racer.baseSpeed + racer.speedBoost;
        } else if (powerType == 1) {
            // Shield
            racer.shieldCount += 1;
        } else if (powerType == 2) {
            // Shortcut
            racer.shortcutCount += 1;
        }
        
        powerUps[wallet].push(PowerUp(powerType, intensity));
        emit PowerUpApplied(wallet, powerType, intensity);
    }
    
    function computeRace() external onlyOwner returns (address) {
        require(!raceFinalized, "Already finalized");
        require(racers.length > 0, "No racers");
        
        raceFinalized = true;
        uint256 fastestTime = type(uint256).max;
        address fastest = racers[0];
        
        for (uint256 i = 0; i < racers.length; i++) {
            address r = racers[i];
            Racer storage racer = racerData[r];
            
            // Deterministic pseudo-random finish time
            // Uses wallet + tokens + powerups + block data
            uint256 seed = uint256(keccak256(abi.encodePacked(
                r,
                racer.tokensLocked,
                racer.speedBoost,
                racer.shieldCount,
                racer.shortcutCount,
                block.timestamp,
                nonce++
            )));
            
            // Higher speed = lower finish time (faster)
            // Randomness factor keeps it unpredictable but fair
            uint256 randomFactor = (seed % 1000) + 500; // 500-1500
            uint256 finishTime = (1000000 / (racer.finalSpeed + 1)) * randomFactor / 1000;
            
            // Shields reduce random penalties
            if (racer.shieldCount > 0) {
                finishTime = finishTime * (100 - racer.shieldCount * 5) / 100;
            }
            
            // Shortcuts skip a portion of the race
            if (racer.shortcutCount > 0) {
                finishTime = finishTime * (100 - racer.shortcutCount * 10) / 100;
            }
            
            racer.finishTime = finishTime;
            racer.finished = true;
            
            if (finishTime < fastestTime) {
                fastestTime = finishTime;
                fastest = r;
            }
        }
        
        winner = fastest;
        emit RaceFinalized(fastest, fastestTime);
        return fastest;
    }
    
    function getRacerCount() external view returns (uint256) {
        return racers.length;
    }
    
    function getRacer(address wallet) external view returns (Racer memory) {
        return racerData[wallet];
    }
    
    function getPowerUps(address wallet) external view returns (PowerUp[] memory) {
        return powerUps[wallet];
    }
}