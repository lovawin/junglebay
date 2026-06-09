// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

import "./interfaces/ILetsBuyJungleBay.sol";
import "./errors/Errors.sol";
import "./events/Events.sol";
import "./structs/Structs.sol";

contract LetsBuyJungleBay is ILetsBuyJungleBay, Ownable2Step, ReentrancyGuard, Pausable {
    uint256 public constant FEE_BPS = 300;
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant MIN_ENTRY = 0.001 ether;
    uint256 public constant ROUND_DURATION = 3 days;
    uint256 public constant TARGET_BUFFER = 0.1 ether;

    address public immutable feeWallet;
    uint256 public currentRoundId;
    uint256 public accruedFees;

    mapping(uint256 => Structs.Round) public rounds;
    mapping(uint256 => mapping(address => Structs.Participant)) public participants;
    mapping(uint256 => address[]) private roundParticipants;
    mapping(uint256 => mapping(address => bool)) private participantExists;

    constructor(address _feeWallet) Ownable(msg.sender) {
        if (_feeWallet == address(0)) revert Errors.ZeroAddress();
        feeWallet = _feeWallet;
    }

    function createRound(uint256 floorPrice, bytes32 secretHash) external onlyOwner {
        if (floorPrice == 0) revert Errors.InvalidFloorPrice();
        if (secretHash == bytes32(0)) revert Errors.InvalidSecretHash();

        if (currentRoundId != 0) {
            Structs.RoundState prev = rounds[currentRoundId].state;
            if (prev != Structs.RoundState.ARCHIVED) revert Errors.RoundAlreadyActive();
        }

        currentRoundId++;

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + ROUND_DURATION;
        uint256 targetAmount = floorPrice + TARGET_BUFFER;

        rounds[currentRoundId] = Structs.Round({
            id: currentRoundId,
            floorPrice: floorPrice,
            targetAmount: targetAmount,
            totalRaised: 0,
            startTime: startTime,
            endTime: endTime,
            secretHash: secretHash,
            winner: address(0),
            revealed: false,
            withdrawn: false,
            delivered: false,
            state: Structs.RoundState.OPEN
        });

        emit Events.RoundCreated(currentRoundId, floorPrice, targetAmount, startTime, endTime, secretHash);
    }

    function deposit() external payable nonReentrant whenNotPaused {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.OPEN) revert Errors.RoundClosed();
        if (block.timestamp >= round.endTime) revert Errors.RoundExpired();
        if (msg.value < MIN_ENTRY) revert Errors.BelowMinimumEntry();

        uint256 feeAmount = (msg.value * FEE_BPS) / BPS_DENOMINATOR;
        uint256 netAmount = msg.value - feeAmount;

        accruedFees += feeAmount;

        Structs.Participant storage user = participants[currentRoundId][msg.sender];

        if (!participantExists[currentRoundId][msg.sender]) {
            participantExists[currentRoundId][msg.sender] = true;
            roundParticipants[currentRoundId].push(msg.sender);
        }

        user.contribution += netAmount;
        round.totalRaised += netAmount;

        emit Events.DepositReceived(currentRoundId, msg.sender, msg.value, feeAmount, netAmount);

        if (round.totalRaised >= round.targetAmount) {
            round.state = Structs.RoundState.TARGET_REACHED;
            emit Events.TargetReached(currentRoundId, round.totalRaised);
        }
    }

    function revealWinner(string calldata secret) external onlyOwner nonReentrant whenNotPaused {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.TARGET_REACHED) revert Errors.InvalidState();
        if (block.timestamp < round.endTime) revert Errors.RoundStillActive();
        if (round.totalRaised < round.targetAmount) revert Errors.TargetNotReached();
        if (round.revealed || round.winner != address(0)) revert Errors.WinnerAlreadySelected();
        if (keccak256(abi.encodePacked(secret)) != round.secretHash) revert Errors.InvalidSecret();

        round.revealed = true;

        uint256 randomValue = uint256(
            keccak256(
                abi.encodePacked(
                    secret,
                    block.prevrandao,
                    blockhash(block.number - 1),
                    address(this),
                    currentRoundId,
                    round.totalRaised,
                    round.targetAmount
                )
            )
        );

        address winner = _selectWeightedWinner(currentRoundId, randomValue);

        round.winner = winner;
        round.state = Structs.RoundState.WINNER_SELECTED;

        emit Events.WinnerSelected(
            currentRoundId,
            winner,
            participants[currentRoundId][winner].contribution,
            round.totalRaised,
            randomValue
        );
    }

    function _selectWeightedWinner(uint256 roundId, uint256 randomValue) internal view returns (address) {
        Structs.Round storage round = rounds[roundId];
        address[] storage users = roundParticipants[roundId];

        if (users.length == 0) revert Errors.NoContribution();

        uint256 winningPoint = randomValue % round.totalRaised;
        uint256 cumulative;

        for (uint256 i = 0; i < users.length; ) {
            address user = users[i];
            cumulative += participants[roundId][user].contribution;

            if (winningPoint < cumulative) return user;

            unchecked {
                i++;
            }
        }

        return users[users.length - 1];
    }

    function openRefunds() external nonReentrant {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.OPEN && round.state != Structs.RoundState.CANCELLED) {
            revert Errors.InvalidState();
        }

        if (round.state != Structs.RoundState.CANCELLED && block.timestamp < round.endTime) {
            revert Errors.RefundNotAvailable();
        }

        if (round.totalRaised >= round.targetAmount) revert Errors.TargetAlreadyReached();

        round.state = Structs.RoundState.REFUNDS_OPEN;

        emit Events.RefundsOpened(currentRoundId);
    }

    function claimRefund(uint256 roundId) external nonReentrant {
        Structs.Round storage round = rounds[roundId];

        if (round.state != Structs.RoundState.REFUNDS_OPEN && round.state != Structs.RoundState.CANCELLED) {
            revert Errors.RefundNotAvailable();
        }

        Structs.Participant storage user = participants[roundId][msg.sender];
        uint256 amount = user.contribution;

        if (amount == 0) revert Errors.NoContribution();
        if (user.refunded) revert Errors.AlreadyRefunded();

        user.refunded = true;
        user.contribution = 0;

        if (round.totalRaised >= amount) {
            round.totalRaised -= amount;
        }

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert Errors.TransferFailed();

        emit Events.RefundClaimed(roundId, msg.sender, amount);
    }

    function ownerWithdraw() external onlyOwner nonReentrant whenNotPaused {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.WINNER_SELECTED) revert Errors.InvalidState();
        if (round.withdrawn) revert Errors.AlreadyWithdrawn();
        if (round.winner == address(0)) revert Errors.WinnerNotSelected();

        uint256 amount = round.totalRaised;

        round.withdrawn = true;
        round.totalRaised = 0;
        round.state = Structs.RoundState.FUNDS_WITHDRAWN;

        (bool success, ) = payable(owner()).call{value: amount}("");
        if (!success) revert Errors.TransferFailed();

        emit Events.FundsWithdrawn(currentRoundId, amount);
    }

    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = accruedFees;
        if (amount == 0) revert Errors.NothingToWithdraw();

        accruedFees = 0;

        (bool success, ) = payable(feeWallet).call{value: amount}("");
        if (!success) revert Errors.TransferFailed();

        emit Events.FeesWithdrawn(feeWallet, amount);
    }

    function markDelivered() external onlyOwner {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.FUNDS_WITHDRAWN) revert Errors.InvalidState();
        if (round.delivered) revert Errors.AlreadyDelivered();

        round.delivered = true;
        round.state = Structs.RoundState.DELIVERED;

        emit Events.NFTDelivered(currentRoundId);
    }

    function archiveRound() external onlyOwner {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.DELIVERED && round.state != Structs.RoundState.REFUNDS_OPEN) {
            revert Errors.InvalidState();
        }

        round.state = Structs.RoundState.ARCHIVED;

        emit Events.RoundArchived(currentRoundId);
    }

    function cancelRound() external onlyOwner {
        if (currentRoundId == 0) revert Errors.NoActiveRound();

        Structs.Round storage round = rounds[currentRoundId];

        if (round.state != Structs.RoundState.OPEN) revert Errors.InvalidState();

        round.state = Structs.RoundState.CANCELLED;

        emit Events.RoundCancelled(currentRoundId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getParticipants(uint256 roundId) external view returns (address[] memory) {
        return roundParticipants[roundId];
    }

    function currentRound() external view returns (Structs.Round memory) {
        return rounds[currentRoundId];
    }

    function getContribution(uint256 roundId, address user) external view returns (uint256) {
        return participants[roundId][user].contribution;
    }

    function participantCount(uint256 roundId) external view returns (uint256) {
        return roundParticipants[roundId].length;
    }

    function getOddsBps(uint256 roundId, address user) external view returns (uint256) {
        Structs.Round storage round = rounds[roundId];
        if (round.totalRaised == 0) return 0;
        return (participants[roundId][user].contribution * BPS_DENOMINATOR) / round.totalRaised;
    }

    function timeRemaining(uint256 roundId) external view returns (uint256) {
        Structs.Round storage round = rounds[roundId];
        if (block.timestamp >= round.endTime) return 0;
        return round.endTime - block.timestamp;
    }

    function getWinner(uint256 roundId) external view returns (address) {
        return rounds[roundId].winner;
    }

    function currentPot() external view returns (uint256) {
        return rounds[currentRoundId].totalRaised;
    }

    function hashSecret(string calldata secret) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(secret));
    }

    receive() external payable {
        revert Errors.RoundClosed();
    }

    fallback() external payable {
        revert Errors.RoundClosed();
    }
}
