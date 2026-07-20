// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RaffleEscrow is ReentrancyGuard, Ownable {
    IERC20 public jungleToken;
    IERC721 public jungleBayNFT;
    
    uint256 public nftTokenId;
    uint256 public burnGoal; // in token units (0.13 ETH worth)
    uint256 public totalDeposited;
    uint256 public feePercent = 2; // 2% fee on refund
    uint256 public deadline;
    
    bool public raceTriggered;
    bool public goalMet;
    address public winner;
    
    struct Deposit {
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }
    
    mapping(address => Deposit) public deposits;
    address[] public depositors;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 fee);
    event GoalReached(uint256 totalDeposited);
    event RaceTriggered(address winner);
    event TokensBurned(uint256 amount);
    
    constructor(
        address _token,
        address _nft,
        uint256 _nftTokenId,
        uint256 _burnGoal,
        uint256 _deadlineDays
    ) Ownable(msg.sender) {
        jungleToken = IERC20(_token);
        jungleBayNFT = IERC721(_nft);
        nftTokenId = _nftTokenId;
        burnGoal = _burnGoal;
        deadline = block.timestamp + (_deadlineDays * 1 days);
    }
    
    function deposit(uint256 amount) external nonReentrant {
        require(!raceTriggered, "Race already started");
        require(block.timestamp < deadline, "Raffle ended");
        require(amount > 0, "Must deposit > 0");
        
        jungleToken.transferFrom(msg.sender, address(this), amount);
        
        if (deposits[msg.sender].amount == 0) {
            depositors.push(msg.sender);
        }
        deposits[msg.sender].amount += amount;
        deposits[msg.sender].timestamp = block.timestamp;
        totalDeposited += amount;
        
        emit Deposited(msg.sender, amount);
        
        if (totalDeposited >= burnGoal && !goalMet) {
            goalMet = true;
            emit GoalReached(totalDeposited);
        }
    }
    
    function withdraw() external nonReentrant {
        require(!raceTriggered, "Race already started");
        require(deposits[msg.sender].amount > 0, "Nothing to withdraw");
        require(!deposits[msg.sender].withdrawn, "Already withdrawn");
        
        uint256 amount = deposits[msg.sender].amount;
        uint256 fee = (amount * feePercent) / 100;
        uint256 refund = amount - fee;
        
        deposits[msg.sender].withdrawn = true;
        deposits[msg.sender].amount = 0;
        totalDeposited -= amount;
        
        jungleToken.transfer(msg.sender, refund);
        
        emit Withdrawn(msg.sender, refund, fee);
    }
    
    function triggerRace(address _winner) external onlyOwner {
        require(goalMet, "Goal not reached");
        require(!raceTriggered, "Already triggered");
        require(block.timestamp >= deadline || totalDeposited >= burnGoal, "Not ready");
        
        winner = _winner;
        raceTriggered = true;
        
        // Burn all deposited tokens
        uint256 burnAmount = totalDeposited;
        totalDeposited = 0;
        jungleToken.transfer(address(0), burnAmount);
        
        // Transfer NFT to winner
        jungleBayNFT.safeTransferFrom(address(this), _winner, nftTokenId);
        
        emit RaceTriggered(_winner);
        emit TokensBurned(burnAmount);
    }
    
    function getDepositorCount() external view returns (uint256) {
        return depositors.length;
    }
    
    function getDeposit(address user) external view returns (uint256, uint256, bool) {
        Deposit memory d = deposits[user];
        return (d.amount, d.timestamp, d.withdrawn);
    }
}